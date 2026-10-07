import {
    Block,
    type Entity,
    EntityComponentTypes,
    GameMode,
    Player,
    system,
    type Vector3,
    world
} from "@minecraft/server"

import { getLocationUncached } from "./cache"

import { debugFlags } from "./debug_flags"

import {
    pathCancelEntityTypes,
    pathIgnoreEntityTypes
} from "./path_constants"

import {
    IntHeap,
    MAX_DEGREE,
    type PathGraph
} from "./path_graph"

import { Registry } from "./registry"

import {
    addVectors,
    calculateDistance,
    calculateChebyshevDistance,
    floorVector,
    isVectorBetween,
    stringToLocation,
    locationToString,
    addVector
} from "./utils"

import {
    MIN_MOVE_COST,
    minecraftDangerousBlockTypes
} from "./variables"

import type {
    CheckEntityData,
    LocationString,
    NodeRequirement,
    PathNode,
    Bounds,
    VillageRanchEntity
} from "./types"

const Y_WEIGHT = 3
const VERTICAL_TOWARD_PENALTY = 2
const VERTICAL_AWAY_PENALTY = 10
const DIAGONAL_COST = 1.75

const BLOCKED_ENTITY_RADIUS = 0.75

/** The part of a `Village` that pathfinding reads. `Village` satisfies this structurally. */
export interface PathVillage {
    readonly bounds: Bounds
    readonly dimensionId: string
    readonly graph: PathGraph
    readonly pathNodes: Record<LocationString, PathNode>
    readonly penTiles: ReadonlyMap<LocationString, LocationString>
    readonly ranchEntities: Record<string, VillageRanchEntity>
}

/** The part of a `Villager` that pathfinding reads. `Villager` satisfies this structurally. */
export interface PathVillager {
    readonly id: string
    readonly typeId: string
    readonly isValid: boolean
    readonly isPathing: boolean
    readonly isBlocked: boolean
    readonly totalBlockTimer: number
    getVillage(): PathVillage | undefined
}

export type PathFailure = "no_path" | "no_village" | "timeout" | "cancelled" | "error"

export type PathResult = PathFailure | Vector3[]

export type PathTarget = Vector3 | Entity

export interface PathStream {
    readonly nodes: Vector3[]
    head?: number
    status: "searching" | "complete" | PathFailure
}

const RETARGET_DISTANCE = 2
const TARGET_POLL_TICKS = 4
const TRACK_INTERVAL_TICKS = 2
const TRACK_MIN_IMPROVEMENT = 1
const MAX_RESTARTS = 8

interface Scratch {
    capacity: number
    g: Float64Array
    closed: Uint8Array
    came: Int32Array
    blocked: Uint8Array
    verdict: Int8Array
    mark: Int32Array
    link: Int32Array
    heap: IntHeap
}

const scratchPool: Scratch[] = []

function acquireScratch(capacity: number): Scratch {
    const index = scratchPool.findIndex(scratch => scratch.capacity >= capacity)
    const reused = index === -1 ? undefined : scratchPool.splice(index, 1)[0]
    const scratch: Scratch = reused ?? {
        capacity,
        g: new Float64Array(capacity),
        closed: new Uint8Array(capacity),
        came: new Int32Array(capacity),
        blocked: new Uint8Array(capacity),
        verdict: new Int8Array(256),
        mark: new Int32Array(capacity),
        link: new Int32Array(capacity),
        heap: new IntHeap()
    }
    scratch.g.fill(Infinity)
    scratch.closed.fill(0)
    scratch.blocked.fill(0)
    scratch.verdict.fill(-1)
    scratch.mark.fill(0)
    scratch.heap.size = 0
    return scratch
}

function buildBlockedCells(
    entities: Array<{ id: string, location: Vector3, cancelPath?: boolean }>,
    graph: PathGraph,
    bounds: Bounds,
    blocked: Uint8Array,
    excludedEntityId: string,
    targetEntityId?: string
) {
    const RADIUS = BLOCKED_ENTITY_RADIUS
    const minBX = Math.min(bounds.start.x, bounds.end.x) - RADIUS - 1
    const maxBX = Math.max(bounds.start.x, bounds.end.x) + RADIUS + 1
    const minBZ = Math.min(bounds.start.z, bounds.end.z) - RADIUS - 1
    const maxBZ = Math.max(bounds.start.z, bounds.end.z) + RADIUS + 1

    for (const other of entities) {
        if (other.id === excludedEntityId || other.id === targetEntityId) {
            continue
        }
        const loc = other.location
        if (loc.x < minBX || loc.x > maxBX || loc.z < minBZ || loc.z > maxBZ) {
            continue
        }
        const state = other.cancelPath === true ? 2 : 1
        const maxX = Math.ceil(loc.x + RADIUS)
        const maxY = Math.ceil(loc.y + RADIUS)
        const maxZ = Math.ceil(loc.z + RADIUS)

        for (let x = Math.floor(loc.x - RADIUS - 1); x <= maxX; x++) {
            if (Math.abs(loc.x - (x + 0.5)) >= RADIUS) {
                continue
            }
            for (let z = Math.floor(loc.z - RADIUS - 1); z <= maxZ; z++) {
                if (Math.abs(loc.z - (z + 0.5)) >= RADIUS) {
                    continue
                }
                for (let y = Math.floor(loc.y - RADIUS - 1); y <= maxY; y++) {
                    if (Math.abs(loc.y - y) >= RADIUS) {
                        continue
                    }
                    const id = graph.idAt(x, y, z)
                    if (blocked[id] !== undefined && id !== -1 && state > blocked[id]) {
                        blocked[id] = state
                    }
                }
            }
        }
    }
}

const pathCheckEntities: Record<string, PathEntity[]> = {}
const pathCheckEntityIds = new Map<string, Set<string>>()

export function getPathNodeBlockState(dimensionId: string, node: Vector3): 0 | 1 | 2 {
    let blockState: 0 | 1 | 2 = 0
    for (const entity of pathCheckEntities[dimensionId] ?? []) {
        const { x, y, z } = entity.location
        if (
            Math.abs(x - (node.x + 0.5)) >= BLOCKED_ENTITY_RADIUS
            || Math.abs(y - node.y) >= BLOCKED_ENTITY_RADIUS
            || Math.abs(z - (node.z + 0.5)) >= BLOCKED_ENTITY_RADIUS
        ) {
            continue
        }
        if (entity.cancelPath) {
            return 2
        }
        blockState = 1
    }
    return blockState
}

function isEntityTarget(target: PathTarget): target is Entity {
    return "isValid" in target
}

export { isEntityTarget }

export function createPathStream(): PathStream {
    return { nodes: [], head: 0, status: "searching" }
}

export function getPathStreamFailure(stream: PathStream): PathFailure | undefined {
    return stream.status === "searching" || stream.status === "complete" ? undefined : stream.status
}

function readTargetLocation(target: Entity, dimensionId: string): Vector3 | undefined {
    try {
        if (!target.isValid) {
            return undefined
        }
        const health = target.getComponent(EntityComponentTypes.Health)
        if (health !== undefined && health.currentValue <= 0) {
            return undefined
        }
        if (target.dimension.id !== dimensionId) {
            return undefined
        }
        return target.location
    }
    catch {
        return undefined
    }
}

const SHORTCUT_LOOKAHEAD = 12

export function shortcutStream(stream: PathStream, graph: PathGraph, reached: Vector3) {
    const head = stream.head ?? 0
    const reachedId = graph.idOf(locationToString(reached))
    if (reachedId === -1) {
        return
    }

    const end = Math.min(stream.nodes.length, head + SHORTCUT_LOOKAHEAD)
    for (let i = end - 1; i > head; i--) {
        const node = stream.nodes[i]
        if (node === undefined) {
            continue
        }

        const nodeId = graph.idOf(locationToString(node))
        if (nodeId !== -1 && graph.hasOpenEdge(reachedId, nodeId)) {
            stream.nodes.splice(head, i - head)
            return
        }
    }
}

function estimateCost(dx: number, dy: number, dz: number) {
    const absX = Math.abs(dx)
    const absZ = Math.abs(dz)
    const diagonal = Math.min(absX, absZ)

    return (Math.max(absX, absZ) - diagonal) + (diagonal * DIAGONAL_COST) + (Math.abs(dy) * Y_WEIGHT)
}

export function generatePath(
    entity: PathVillager,
    start: Vector3,
    target: PathTarget,
    token: { cancelled: boolean },
    stream?: PathStream
) {
    return new Promise<PathResult>(resolve => {
        const emitted: Vector3[] = []
        let settled = false
        let runId = 0
        let restarts = 0
        let commitCount = 0
        let tipKey: LocationString | undefined
        let goalKey = "0,0,0" as LocationString
        let lastPollTick = Number.NEGATIVE_INFINITY

        const finish = (status: "complete" | PathFailure) => {
            if (settled) {
                return
            }
            settled = true
            if (stream !== undefined) {
                stream.status = status
            }
            resolve(status === "complete" ? emitted : status)
        }

        const village = entity.getVillage()
        if (village === undefined) {
            finish("no_village")
            return
        }
        const villageInfo = village
        const villageBounds = villageInfo.bounds
        const dimensionId = villageInfo.dimensionId
        const dimension = world.getDimension(dimensionId)
        const nodeList = villageInfo.pathNodes
        const graph = villageInfo.graph

        const targetEntity = isEntityTarget(target) ? target : undefined
        const staticTarget: Vector3 | undefined = isEntityTarget(target) ? undefined : target

        const toGoalKey = (location: Vector3): LocationString | undefined => {
            let endLocation = floorVector(location)
            const endBlock = dimension.getBlockSafe(endLocation)
            if (endBlock !== undefined && !endBlock.isValidPath(villageBounds)) {
                const checkBlocks = [
                    endBlock.northSafe(),
                    endBlock.eastSafe(),
                    endBlock.southSafe(),
                    endBlock.westSafe()
                ]
                for (const block of checkBlocks) {
                    if (block?.isValidPath(villageBounds)) {
                        endLocation = block.location
                        break
                    }
                }
            }
            const key = locationToString(endLocation)
            if (nodeList[key] !== undefined) {
                return key
            }
            const nearest = findNearestNodeLocation(nodeList, endLocation)
            return nearest === undefined ? undefined : locationToString(nearest)
        }

        // Returns the new goal key if the target moved far enough from the current goal to be worth steering towards.
        const evaluateTarget = (location: Vector3): LocationString | undefined => {
            const key = toGoalKey(location)
            if (key === undefined || key === goalKey) {
                return undefined
            }
            return calculateChebyshevDistance(stringToLocation(key), stringToLocation(goalKey)) >= RETARGET_DISTANCE ? key : undefined
        }

        const pollTarget = (): LocationString | undefined => {
            const tick = system.currentTick
            if (targetEntity === undefined || tick - lastPollTick < TARGET_POLL_TICKS) {
                return undefined
            }
            lastPollTick = tick
            const location = readTargetLocation(targetEntity, dimensionId)
            return location === undefined ? undefined : evaluateTarget(location)
        }

        const emitLocation = (node: Vector3) => {
            emitted.push(node)
            if (stream !== undefined) {
                stream.nodes.push(node)
            }
        }

        const trackTick = () => {
            try {
                if (settled) {
                    return
                }
                if (token.cancelled) {
                    finish("cancelled")
                    return
                }
                if (stream === undefined || targetEntity === undefined || (stream.head ?? 0) >= stream.nodes.length) {
                    finish("complete")
                    return
                }
                const location = readTargetLocation(targetEntity, dimensionId)
                if (location === undefined) {
                    finish("complete")
                    return
                }
                const key = evaluateTarget(location)
                if (key === undefined) {
                    system.runTimeout(trackTick, TRACK_INTERVAL_TICKS)
                    return
                }

                const head = stream.head ?? 0
                const goalLocation = stringToLocation(key)

                const first = stream.nodes[head]
                if (first === undefined) {
                    finish("complete")
                    return
                }

                let keepIndex = head
                let bestCost = estimateCost(first.x - goalLocation.x, first.y - goalLocation.y, first.z - goalLocation.z)

                for (let i = head + 1; i < stream.nodes.length; i++) {
                    const node = stream.nodes[i]
                    if (node === undefined) {
                        continue
                    }

                    const cost = estimateCost(node.x - goalLocation.x, node.y - goalLocation.y, node.z - goalLocation.z)
                    if (cost < bestCost - TRACK_MIN_IMPROVEMENT) {
                        bestCost = cost
                        keepIndex = i
                    }
                }

                const tip = stream.nodes[keepIndex]
                if (tip === undefined) {
                    finish("complete")
                    return
                }

                const dropped = stream.nodes.length - (keepIndex + 1)
                if (dropped > 0) {
                    stream.nodes.length = keepIndex + 1
                    emitted.length -= dropped
                }

                tipKey = locationToString(tip)
                goalKey = key

                if (tipKey === key) {
                    afterGoal()
                    return
                }

                system.runJob(guarded(run(++runId, tipKey)))
            }
            catch (error) {
                if (debugFlags.pathfindingWarnings) {
                    console.warn("Pathfinding failed: ", error)
                }
                finish("error")
            }
        }

        function afterGoal() {
            if (stream !== undefined && targetEntity !== undefined) {
                system.runTimeout(trackTick, TRACK_INTERVAL_TICKS)
                return
            }
            finish("complete")
        }

        function* guarded(inner: Generator<void, void, void>): Generator<void, void, void> {
            try {
                yield* inner
            }
            catch (error) {
                if (debugFlags.pathfindingWarnings) {
                    console.warn("Pathfinding failed: ", error)
                }
                finish("error")
            }
        }

        function* begin(): Generator<void, void, void> {
            if (token.cancelled) {
                finish("cancelled")
                return
            }

            const initialLocation = targetEntity === undefined ? staticTarget : readTargetLocation(targetEntity, dimensionId)
            if (initialLocation === undefined) {
                finish("no_path")
                return
            }

            const startLocation = floorVector(start)
            let startKey = locationToString(startLocation)
            if (nodeList[startKey] === undefined) {
                const nearestStart = findNearestNodeLocation(nodeList, startLocation)
                if (nearestStart === undefined) {
                    finish("no_path")
                    return
                }
                startKey = locationToString(nearestStart)
            }

            const initialGoalKey = toGoalKey(initialLocation)
            if (initialGoalKey === undefined) {
                finish("no_path")
                return
            }
            goalKey = initialGoalKey

            if (startKey === goalKey) {
                emitLocation(stringToLocation(startKey))
                commitCount = 1
                tipKey = startKey
                afterGoal()
                return
            }

            yield* run(++runId, startKey)
        }

        // Runs searches until one finishes. A search only restarts (from the last streamed node) when
        // the destination can no longer be reached through the nodes that were already streamed.
        function* run(id: number, initialRootKey: LocationString): Generator<void, void, void> {
            let rootKey = initialRootKey
            while (true) {
                const outcome = yield* search(id, rootKey)
                if (outcome === "done") {
                    return
                }
                restarts++
                if (tipKey === undefined || restarts > MAX_RESTARTS) {
                    finish("no_path")
                    return
                }
                rootKey = tipKey
                yield
            }
        }

        function* search(id: number, rootKey: LocationString): Generator<void, "done" | "restart", void> {
            // Stale (cancelled, replaced or settled) searches must never touch the stream again.
            const halted = () => {
                if (id !== runId || settled) {
                    return true
                }
                if (token.cancelled) {
                    finish("cancelled")
                    return true
                }
                return false
            }
            if (halted()) {
                return "done"
            }

            const rootId = graph.idOf(rootKey)
            const initialGoalId = graph.idOf(goalKey)
            if (rootId === -1 || initialGoalId === -1) {
                finish("no_path")
                return "done"
            }

            const HEURISTIC_WEIGHT = 1
            const MAX_EXPANSIONS = 20000
            const YIELD_EVERY = 100

            const { x: X, y: Y, z: Z, cost: COST, reqId: REQ, adjReq: ADJ_REQ, adj: ADJ, alive: ALIVE, degree: DEG } = graph
            const size = X.length
            const lookup = (x: number, y: number, z: number) => {
                const nodeId = graph.idAt(x, y, z)
                return nodeId < size ? nodeId : -1
            }

            graph.beginSearch()
            const scratch = acquireScratch(size)
            try {
                const { g, closed, came, blocked, verdict, heap, mark, link } = scratch
                buildBlockedCells(pathCheckEntities[dimensionId] ?? [], graph, villageBounds, blocked, entity.id, targetEntity?.id)

                const typeId = entity.typeId
                const allowed = (requirementId: number) => {
                    let value = verdict[requirementId] ?? -1
                    if (value === -1) {
                        value = checkRequirement(typeId, graph.requirements[requirementId] ?? { whiteList: false, types: [] }) ? 1 : 0
                        verdict[requirementId] = value
                    }
                    return value === 1
                }

                let goalId = initialGoalId
                let ex = X[goalId] ?? 0
                let ey = Y[goalId] ?? 0
                let ez = Z[goalId] ?? 0

                const estimate = (nodeId: number) => estimateCost(
                    (X[nodeId] ?? 0) - ex,
                    (Y[nodeId] ?? 0) - ey,
                    (Z[nodeId] ?? 0) - ez
                )

                // Node ids from the search root to `targetId`.
                const chain: number[] = []
                const fillChain = (targetId: number) => {
                    chain.length = 0
                    let nodeId = targetId
                    while (nodeId !== -1) {
                        chain.push(nodeId)
                        nodeId = came[nodeId] ?? -1
                    }
                    chain.reverse()
                }

                const emitNode = (nodeId: number) => {
                    emitLocation({ x: X[nodeId] ?? 0, y: Y[nodeId] ?? 0, z: Z[nodeId] ?? 0 })
                }

                // Last node streamed so far. A restarted search is rooted here.
                let tipId = tipKey === undefined ? -1 : rootId
                commitCount = tipKey === undefined ? 0 : 1

                const frontier: number[] = []
                const walk: number[] = []
                let cycle = 0

                // Streams the part of the route that every open candidate shares. Closed nodes are never revised,
                // and any final route continues through an open node, so that shared prefix is final.
                const commitStable = () => {
                    if (stream === undefined || settled || token.cancelled) {
                        return
                    }
                    frontier.length = 0
                    for (let i = 0; i < heap.size; i++) {
                        const nodeId = heap.values[i] ?? -1
                        if (nodeId !== -1 && closed[nodeId] === 0 && (g[nodeId] ?? Infinity) !== Infinity) {
                            frontier.push(nodeId)
                        }
                    }
                    const first = frontier[0]
                    if (first === undefined) {
                        return
                    }
                    const firstParent = came[first] ?? -1
                    if (firstParent === -1) {
                        return
                    }
                    fillChain(firstParent)
                    cycle++
                    for (let i = 0; i < chain.length; i++) {
                        const nodeId = chain[i] ?? -1
                        mark[nodeId] = cycle
                        link[nodeId] = i
                    }
                    let limit = chain.length - 1
                    for (let i = 1; i < frontier.length && limit >= commitCount; i++) {
                        let nodeId = came[frontier[i] ?? -1] ?? -1
                        walk.length = 0
                        while (nodeId !== -1 && mark[nodeId] !== cycle) {
                            walk.push(nodeId)
                            nodeId = came[nodeId] ?? -1
                        }
                        if (nodeId === -1) {
                            return
                        }
                        const shared = link[nodeId] ?? 0
                        for (const walked of walk) {
                            mark[walked] = cycle
                            link[walked] = shared
                        }
                        if (shared < limit) {
                            limit = shared
                        }
                    }
                    if (limit < commitCount) {
                        return
                    }
                    for (let i = commitCount; i <= limit; i++) {
                        emitNode(chain[i] ?? -1)
                    }
                    commitCount = limit + 1
                    tipId = chain[limit] ?? -1
                    tipKey = locationToString({ x: X[tipId] ?? 0, y: Y[tipId] ?? 0, z: Z[tipId] ?? 0 })
                }

                const reachGoal = (targetId: number): "done" | "restart" => {
                    fillChain(targetId)
                    if (commitCount > 0 && chain[commitCount - 1] !== tipId) {
                        return "restart"
                    }
                    for (let i = commitCount; i < chain.length; i++) {
                        emitNode(chain[i] ?? -1)
                    }
                    commitCount = Math.max(commitCount, chain.length)
                    tipId = targetId
                    tipKey = locationToString({ x: X[targetId] ?? 0, y: Y[targetId] ?? 0, z: Z[targetId] ?? 0 })
                    afterGoal()
                    return "done"
                }

                const bestOpenNode = () => {
                    let bestOpen = -1
                    let bestOpenEstimate = Infinity
                    for (let i = 0; i < heap.size; i++) {
                        const nodeId = heap.values[i] ?? -1
                        if (nodeId === -1 || closed[nodeId] === 1 || (g[nodeId] ?? Infinity) === Infinity) {
                            continue
                        }
                        const value = estimate(nodeId)
                        if (value < bestOpenEstimate) {
                            bestOpenEstimate = value
                            bestOpen = nodeId
                        }
                    }
                    return bestOpen
                }

                // Re-prioritises the open set for a new goal without discarding any search progress.
                const rebuildHeap = () => {
                    cycle++
                    frontier.length = 0
                    for (let i = 0; i < heap.size; i++) {
                        const nodeId = heap.values[i] ?? -1
                        if (nodeId === -1 || closed[nodeId] === 1 || mark[nodeId] === cycle) {
                            continue
                        }
                        mark[nodeId] = cycle
                        frontier.push(nodeId)
                    }
                    heap.size = 0
                    for (const nodeId of frontier) {
                        heap.push(nodeId, (g[nodeId] ?? Infinity) + (estimate(nodeId) * HEURISTIC_WEIGHT))
                    }
                }

                g[rootId] = 0
                came[rootId] = -1
                heap.push(rootId, estimate(rootId) * HEURISTIC_WEIGHT)

                let expansions = 0
                let bestId = rootId
                let bestHeuristic = estimate(rootId)
                let bestG = 0

                while (heap.size > 0) {
                    const current = heap.pop()
                    if (closed[current] === 1) {
                        continue
                    }
                    closed[current] = 1

                    if (debugFlags.pathScanParticles) {
                        try {
                            dimension.spawnParticle("minecraft:basic_flame_particle", {
                                x: (X[current] ?? 0) + 0.5,
                                y: (Y[current] ?? 0) + 0.5,
                                z: (Z[current] ?? 0) + 0.5
                            })
                        }
                        catch { }
                    }

                    if (halted()) {
                        return "done"
                    }
                    if (current === goalId) {
                        return reachGoal(current)
                    }

                    const currentG = g[current] ?? Infinity
                    const currentHeuristic = estimate(current)
                    if (currentG !== Infinity && (currentHeuristic < bestHeuristic || (currentHeuristic === bestHeuristic && currentG < bestG))) {
                        bestId = current
                        bestHeuristic = currentHeuristic
                        bestG = currentG
                    }

                    if (++expansions > MAX_EXPANSIONS) {
                        // Give up on the goal and walk to the closest point reached, as before.
                        let candidate = bestId
                        if (stream !== undefined && commitCount > 0) {
                            fillChain(candidate)
                            if (chain[commitCount - 1] !== tipId) {
                                candidate = bestOpenNode()
                            }
                        }
                        if (candidate === -1 || candidate === rootId) {
                            finish("timeout")
                            return "done"
                        }
                        fillChain(candidate)
                        for (let i = commitCount; i < chain.length; i++) {
                            emitNode(chain[i] ?? -1)
                        }
                        commitCount = Math.max(commitCount, chain.length)
                        finish("complete")
                        return "done"
                    }
                    if (ALIVE[current] === 0) {
                        continue
                    }

                    const cx = X[current] ?? 0
                    const cy = Y[current] ?? 0
                    const cz = Z[current] ?? 0
                    const base = current * MAX_DEGREE

                    for (let i = 0, count = DEG[current] ?? 0; i < count; i++) {
                        const next = ADJ[base + i] ?? -1
                        if (next === -1 || closed[next] === 1 || ALIVE[next] === 0) {
                            continue
                        }
                        const requirementId = REQ[next] ?? 0
                        if (requirementId !== 0 && !allowed(requirementId)) {
                            continue
                        }

                        const nx = X[next] ?? 0
                        const ny = Y[next] ?? 0
                        const nz = Z[next] ?? 0

                        if (cx !== nx && cz !== nz) {
                            const cornerA = lookup(nx, cy, cz)
                            if (cornerA !== -1 && (REQ[cornerA] ?? 0) !== 0 && !allowed(REQ[cornerA] ?? 0)) {
                                continue
                            }
                            const cornerB = lookup(cx, cy, nz)
                            if (cornerB !== -1 && (REQ[cornerB] ?? 0) !== 0 && !allowed(REQ[cornerB] ?? 0)) {
                                continue
                            }
                        }

                        const edgeRequirementId = ADJ_REQ[base + i] ?? 0
                        if (edgeRequirementId !== 0 && !allowed(edgeRequirementId)) {
                            continue
                        }

                        let verticalPenalty = 0
                        if (cy !== ny) {
                            verticalPenalty = Math.abs(ny - ey) < Math.abs(cy - ey) ? VERTICAL_TOWARD_PENALTY : VERTICAL_AWAY_PENALTY
                        }

                        const blockState = blocked[next]
                        if (blockState === 2) {
                            continue
                        }

                        const dx = Math.abs(cx - nx)
                        const dz = Math.abs(cz - nz)
                        const diagonal = Math.min(dx, dz)
                        const moveCost = Math.max(
                            MIN_MOVE_COST,
                            (Math.max(dx, dz) - diagonal) + (diagonal * DIAGONAL_COST) + Math.abs(cy - ny)
                            + verticalPenalty + (blockState === 1 ? 50 : 0) + (COST[next] ?? 0)
                        )

                        const tentativeG = currentG + moveCost
                        if (tentativeG < (g[next] ?? Infinity)) {
                            came[next] = current
                            g[next] = tentativeG
                            heap.push(next, tentativeG + (estimate(next) * HEURISTIC_WEIGHT))
                        }
                    }

                    if (expansions % YIELD_EVERY === 0) {
                        commitStable()
                        yield
                        if (halted()) {
                            return "done"
                        }
                        const nextGoalKey = pollTarget()
                        if (nextGoalKey !== undefined) {
                            const nextGoalId = graph.idOf(nextGoalKey)
                            if (nextGoalId !== -1) {
                                goalKey = nextGoalKey
                                goalId = nextGoalId
                                ex = X[goalId] ?? 0
                                ey = Y[goalId] ?? 0
                                ez = Z[goalId] ?? 0
                                bestHeuristic = Infinity
                                bestG = Infinity
                                rebuildHeap()
                                if (closed[goalId] === 1) {
                                    return reachGoal(goalId)
                                }
                            }
                        }
                    }
                }

                finish("no_path")
                return "done"
            }
            finally {
                scratchPool.push(scratch)
                graph.endSearch()
            }
        }

        system.runJob(guarded(begin()))
    })
}

export function findNearestNodeLocation(nodeList: Record<string, PathNode>, location: Vector3, maxRadius = 1.5) {
    if (nodeList[locationToString(location)] !== undefined) {
        return location
    }
    for (let radius = 1; radius <= maxRadius; radius++) {
        let closest: Vector3 | undefined
        let closestDist = Infinity
        for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dz = -radius; dz <= radius; dz++) {
                    if (Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz)) !== radius) {
                        continue
                    }
                    const candidate = addVectors(location, { x: dx, y: dy, z: dz })
                    if (nodeList[locationToString(candidate)] === undefined) {
                        continue
                    }
                    const dist = calculateDistance(addVector(candidate, "y", 0.25), location)
                    if (dist < closestDist) {
                        closestDist = dist
                        closest = candidate
                    }
                }
            }
        }
        if (closest !== undefined) {
            return closest
        }
    }
    return undefined
}

interface PathEntity extends CheckEntityData {
    villager?: PathVillager
    ignoreAsBlocker?: boolean
}

const CELL = 4
const cellKey = (x: number, z: number) => (Math.floor(x / CELL) * 4194304) + Math.floor(z / CELL)
const pathGrid = new Map<string, Map<number, PathEntity[]>>()

export function findPathBlocker(
    dimensionId: string,
    node: Vector3,
    selfId: string,
    selfLocation: Vector3,
    village: PathVillage,
    targetId?: string
) {
    if (village.penTiles.has(locationToString(floorVector(addVector(selfLocation, "y", 0.1))))) {
        return undefined
    }
    const grid = pathGrid.get(dimensionId)
    if (grid === undefined) {
        return undefined
    }
    let blocker: PathEntity | undefined
    for (let dx = -1; dx <= 1; dx++) {
        for (let dz = -1; dz <= 1; dz++) {
            const bucket = grid.get(cellKey(node.x + (dx * CELL), node.z + (dz * CELL)))
            if (bucket === undefined) {
                continue
            }
            for (const other of bucket) {
                if (other.id === selfId || other.id === targetId || calculateChebyshevDistance(other.location, node) >= 1.75) {
                    continue
                }
                if (other.ignoreAsBlocker === true) {
                    continue
                }
                const villager = other.villager
                if (villager !== undefined && (villager.isBlocked || !villager.isPathing || villager.totalBlockTimer > 100)) {
                    continue
                }
                if (other.cancelPath) {
                    return other
                }
                blocker ??= other
            }
        }
    }
    return blocker
}

const SNAPSHOT_MARGIN = 4

function isPennedMob(village: PathVillage, entity: Entity, location: Vector3) {
    if (entity instanceof Player || !entity.typeId.startsWith("minecraft:")) {
        return false
    }
    if (village.ranchEntities[entity.id]?.structure !== undefined) {
        return true
    }
    return village.penTiles.has(locationToString(floorVector(addVector(location, "y", 0.1))))
}

const pathingVillagers = new Set<PathVillager>()
const pathingVillagerById = new Map<string, PathVillager>()
let pathSnapshotTimeoutId: number | undefined

export function startPathSnapshot(villager: PathVillager) {
    pathingVillagers.add(villager)
    pathingVillagerById.set(villager.id, villager)
    schedulePathSnapshot()
}

export function stopPathSnapshot(villager: PathVillager) {
    pathingVillagers.delete(villager)
    if (pathingVillagerById.get(villager.id) === villager) {
        pathingVillagerById.delete(villager.id)
    }
}

function schedulePathSnapshot() {
    if (pathSnapshotTimeoutId === undefined && pathingVillagers.size > 0) {
        pathSnapshotTimeoutId = system.runTimeout(tickPathSnapshot, 5)
    }
}

function tickPathSnapshot() {
    pathSnapshotTimeoutId = undefined
    if (pathingVillagers.size === 0) {
        for (const dimensionId of Registry.dimensionTypes) {
            pathCheckEntities[dimensionId] = []
            pathGrid.set(dimensionId, new Map())
            pathCheckEntityIds.get(dimensionId)?.clear()
        }
        return
    }

    try {
        const pathingVillages = new Set<PathVillage>()

        for (const villager of pathingVillagers) {
            if (!villager.isValid || !villager.isPathing) {
                pathingVillagers.delete(villager)
                pathingVillagerById.delete(villager.id)
                continue
            }
            const village = villager.getVillage()
            if (village !== undefined) {
                pathingVillages.add(village)
            }
        }

        for (const dimensionId of Registry.dimensionTypes) {
            pathCheckEntities[dimensionId] = []
            pathGrid.set(dimensionId, new Map())
            pathCheckEntityIds.get(dimensionId)?.clear()
        }

        for (const village of pathingVillages) {
            const dimensionId = village.dimensionId
            const dimension = world.getDimension(dimensionId)
            const flat = pathCheckEntities[dimensionId] ?? []
            const grid = pathGrid.get(dimensionId) ?? new Map<number, PathEntity[]>()
            const { start, end } = village.bounds

            const entities = dimension.getEntities({
                excludeTypes: pathIgnoreEntityTypes,
                location: {
                    x: Math.min(start.x, end.x) - SNAPSHOT_MARGIN,
                    y: Math.min(start.y, end.y),
                    z: Math.min(start.z, end.z) - SNAPSHOT_MARGIN
                },
                volume: {
                    x: Math.abs(end.x - start.x) + (SNAPSHOT_MARGIN * 2),
                    y: Math.abs(end.y - start.y),
                    z: Math.abs(end.z - start.z) + (SNAPSHOT_MARGIN * 2)
                }
            })

            let seen = pathCheckEntityIds.get(dimensionId)
            if (seen === undefined) {
                seen = new Set()
                pathCheckEntityIds.set(dimensionId, seen)
            }
            for (const entity of entities) {
                if (seen.has(entity.id)) {
                    continue
                }
                if (entity instanceof Player && entity.getGameMode() === GameMode.Spectator) {
                    continue
                }
                const location = getLocationUncached(entity)
                if (isPennedMob(village, entity, location)) {
                    continue
                }
                if (entity.getComponent(EntityComponentTypes.Leashable)?.isLeashed) {
                    continue
                }

                seen.add(entity.id)

                const pathEntity: PathEntity = {
                    location,
                    id: entity.id,
                    typeId: entity.typeId,
                    cancelPath: pathCancelEntityTypes.includesFast(entity.typeId),
                    villager: entity.isVillager ? pathingVillagerById.get(entity.id) : undefined,
                    ignoreAsBlocker: entity.isVillager && !pathingVillagerById.has(entity.id)
                }
                flat.push(pathEntity)

                const key = cellKey(location.x, location.z)
                const bucket = grid.get(key)
                if (bucket === undefined) {
                    grid.set(key, [pathEntity])
                }
                else {
                    bucket.push(pathEntity)
                }
            }

            pathCheckEntities[dimensionId] = flat
            pathGrid.set(dimensionId, grid)
        }
    }
    finally {
        schedulePathSnapshot()
    }
}

function checkRequirement(villagerType: string, requirement?: NodeRequirement) {
    if (requirement === undefined) {
        return true
    }
    const { whiteList, types } = requirement
    const typeSet = new Set(types)
    if (whiteList) {
        return typeSet.has(villagerType)
    }
    return !typeSet.has(villagerType)
}

const pendingNodeUpdates = new Map<string, Block>()

export function updatePathNodes(blockList: Block[]) {
    for (const block of blockList) {
        pendingNodeUpdates.set(`${block.dimension.id}|${locationToString(block)}`, block)
    }
}

function isNearVillageBounds(location: Vector3, bounds: Bounds, margin = 1) {
    return (
        location.x >= Math.floor(Math.min(bounds.start.x, bounds.end.x)) - margin
        && location.x <= Math.ceil(Math.max(bounds.start.x, bounds.end.x)) + margin
        && location.z >= Math.floor(Math.min(bounds.start.z, bounds.end.z)) - margin
        && location.z <= Math.ceil(Math.max(bounds.start.z, bounds.end.z)) + margin
    )
}

world.afterEvents.playerInteractWithBlock.subscribe(event => {
    const block = event.block

    updatePathNodes(
        [block, block.aboveSafe(), block.belowSafe()].filter(checkBlock => checkBlock !== undefined)
    )
})

world.afterEvents.playerPlaceBlock.subscribe(event => {
    const block = event.block

    updatePathNodes([block, block.aboveSafe(), block.belowSafe()].filter(checkBlock => checkBlock !== undefined))
})

world.afterEvents.playerBreakBlock.subscribe(event => {
    const block = event.block

    updatePathNodes(
        [block, block.aboveSafe(), block.belowSafe()].filter(checkBlock => checkBlock !== undefined)
    )
})

world.afterEvents.explosion.subscribe(event => {
    const impactedBlocks = event.getImpactedBlocks()
    updatePathNodes(
        impactedBlocks.flatMap(block =>
            [block, block.aboveSafe(), block.belowSafe()].filter(checkBlock => checkBlock !== undefined)
        )
    )
})

function tickUpdateNodes() {
    system.runJob(updateNodesBlocks(tickUpdateNodes))
}

system.run(tickUpdateNodes)

function* updateNodesBlocks(callback?: () => void) {
    try {
        if (!world.loadedData) {
            return
        }

        while (pendingNodeUpdates.size > 0) {
            const batch = [...pendingNodeUpdates.values()].filter(block => block.isValid)
            pendingNodeUpdates.clear()

            for (const village of world.getVillages()) {
                if (!village.isValid) {
                    continue
                }

                const villageBounds = village.bounds
                const villageBlocks = batch.filter(block =>
                    block.dimension.id === village.dimensionId
                    && isNearVillageBounds(block.location, villageBounds)
                )
                if (villageBlocks.length === 0) {
                    continue
                }

                for (const block of villageBlocks) {
                    village.removeNode(locationToString(block))
                }

                const seedBlocks = new Map<string, Block>()
                const checkedNeighbors = new Set<string>()
                let count = 0
                for (const block of villageBlocks) {
                    if (!block.isValid) {
                        continue
                    }

                    for (const neighborBlock of block.getNodeNeighbors()) {
                        const neighborLocationString = locationToString(neighborBlock)
                        if (checkedNeighbors.has(neighborLocationString)) {
                            continue
                        }
                        checkedNeighbors.add(neighborLocationString)

                        if (village.pathNodes[neighborLocationString] !== undefined && neighborBlock.isValidPath(villageBounds)) {
                            seedBlocks.set(neighborLocationString, neighborBlock)
                        }
                    }

                    if (++count % 20 === 0) {
                        yield
                    }
                }

                yield* village.searchBlocks([...seedBlocks.values()])

                for (const block of villageBlocks) {
                    yield* village.scanLocation(block.location, false)
                }
            }
        }
    }
    finally {
        if (callback !== undefined) {
            callback()
        }
    }
}

Block.prototype.isValidPath = function (villageBounds?: Bounds) {
    const block = this
    const below = block.belowSafe()
    if (below === undefined) {
        return false
    }
    const above = block.aboveSafe()
    if (above === undefined) {
        return false
    }
    if (!block.canPathThrough()) {
        return false
    }
    if (below.isDangerous()) {
        return false
    }
    const belowIsSolid = below.getIsSolid()
    if (
        below.destroyableLeaf() && (block.destroyableLeaf() || above.destroyableLeaf())
    ) {
        return false
    }
    if (!belowIsSolid) {
        return false
    }
    if (!above.canPathThrough()) {
        return false
    }
    if (villageBounds !== undefined && !isVectorBetween(block, villageBounds.start, villageBounds.end, true)) {
        return false
    }
    return true
}

Block.prototype.getNodeNeighbors = function () {
    const nodeBlock = this
    const north = nodeBlock.northSafe()
    const east = nodeBlock.eastSafe()
    const south = nodeBlock.southSafe()
    const west = nodeBlock.westSafe()
    const sides = [north, east, south, west]

    const neighborList: Block[] = []

    for (const block of sides) {
        if (block !== undefined) {
            neighborList.push(block)
        }
    }

    for (const block of [...sides, nodeBlock]) {
        const below = block?.belowSafe()
        if (below !== undefined) {
            neighborList.push(below)
        }
    }

    for (const block of [...sides, nodeBlock]) {
        const above = block?.aboveSafe()
        if (above !== undefined) {
            neighborList.push(above)
        }
    }

    const diagonals = [
        north?.eastSafe(),
        east?.southSafe(),
        south?.westSafe(),
        west?.northSafe()
    ]
    for (const block of diagonals) {
        if (block !== undefined) {
            neighborList.push(block)
        }
    }

    return neighborList
}

Block.prototype.getIsSolid = function () {
    return this.isSolid || Registry.solidBlocksSet.has(this.typeId)
}

const avoidBlockTypes = new Set(["minecraft:web"])

Block.prototype.canPathThrough = function () {
    return (
        this.canWalkThrough()
        || Registry.openableDoorTypes.includesFast(this.typeId)
        || Registry.fenceGateTypes.includesFast(this.typeId)
        || avoidBlockTypes.has(this.typeId)
    )
}

Block.prototype.canWalkThrough = function () {
    return (
        (this.isAir || Registry.nonSolidBlocksSet.has(this.typeId) || this.destroyableLeaf())
        && !avoidBlockTypes.has(this.typeId)
        && !this.isDangerous() && !this.isLiquid && !this.isWaterlogged
    )
}

Block.prototype.destroyableLeaf = function () {
    return (
        Registry.leafTypes.includesFast(this.typeId) && this.permutation.getState("persistent_bit") === false
    )
}

Block.prototype.isDangerous = function () {
    return minecraftDangerousBlockTypes.includesFast(this.typeId)
}
