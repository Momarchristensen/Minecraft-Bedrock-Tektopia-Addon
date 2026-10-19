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
    calculateChebyshevDistance,
    floorVector,
    isVectorBetween,
    stringToLocation,
    locationToString,
    addVector
} from "./utils"

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

const BLOCKED_ENTITY_RADIUS = 1

const BLOCKED_ENTITY_PADDING = 0.1

export function blockRadiusFromWidth(width: number) {
    return (width / 2) + BLOCKED_ENTITY_PADDING
}

export interface PathVillage {
    readonly bounds: Bounds
    readonly dimensionId: string
    readonly graph: PathGraph
    readonly pathNodes: Record<LocationString, PathNode>
    readonly penTiles: ReadonlyMap<LocationString, LocationString>
    readonly ranchEntities: Record<string, VillageRanchEntity>
}

export interface PathVillager {
    readonly id: string
    readonly typeId: string
    readonly isValid: boolean
    readonly isPathing: boolean
    readonly isBlocked: boolean
    readonly totalBlockTimer: number
    getVillage(): PathVillage | undefined

    getAvoidedNodes?(): ReadonlySet<LocationString> | undefined
}

export type PathFailure = "no_path" | "no_village" | "timeout" | "cancelled" | "error"

export type PathResult = PathFailure | Vector3[]

export type PathTarget = Vector3 | Entity

export interface PathStream {
    readonly nodes: Vector3[]
    head?: number
    reached?: Vector3
    status: "searching" | "complete" | PathFailure
}

const RETARGET_DISTANCE = 2
const TARGET_POLL_TICKS = 4
const TRACK_INTERVAL_TICKS = 2
const SLEEP = -1
const MAX_RESTARTS = 8
const PARTIAL_LOOKAHEAD = 16
const PARTIAL_MIN_PROGRESS = 1

const STALL_MIN_PROGRESS = 3

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
    entities: Array<{ id: string, location: Vector3, cancelPath?: boolean, radius?: number }>,
    graph: PathGraph,
    bounds: Bounds,
    blocked: Uint8Array,
    excludedEntityId: string,
    targetEntityId?: string
) {
    const BOUNDS_MARGIN = 4
    const minBX = Math.min(bounds.start.x, bounds.end.x) - BOUNDS_MARGIN
    const maxBX = Math.max(bounds.start.x, bounds.end.x) + BOUNDS_MARGIN
    const minBZ = Math.min(bounds.start.z, bounds.end.z) - BOUNDS_MARGIN
    const maxBZ = Math.max(bounds.start.z, bounds.end.z) + BOUNDS_MARGIN
    const RADIUS_Y = BLOCKED_ENTITY_RADIUS

    for (const other of entities) {
        if (other.id === excludedEntityId || other.id === targetEntityId) {
            continue
        }
        const loc = other.location
        if (loc.x < minBX || loc.x > maxBX || loc.z < minBZ || loc.z > maxBZ) {
            continue
        }
        const radius = other.radius ?? BLOCKED_ENTITY_RADIUS
        const state = other.cancelPath === true ? 2 : 1
        const maxX = Math.ceil(loc.x + radius)
        const maxY = Math.ceil(loc.y + RADIUS_Y)
        const maxZ = Math.ceil(loc.z + radius)

        for (let x = Math.floor(loc.x - radius - 1); x <= maxX; x++) {
            if (Math.abs(loc.x - (x + 0.5)) >= radius) {
                continue
            }
            for (let z = Math.floor(loc.z - radius - 1); z <= maxZ; z++) {
                if (Math.abs(loc.z - (z + 0.5)) >= radius) {
                    continue
                }
                for (let y = Math.floor(loc.y - RADIUS_Y - 1); y <= maxY; y++) {
                    if (Math.abs(loc.y - y) >= RADIUS_Y) {
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
        const radius = entity.radius ?? BLOCKED_ENTITY_RADIUS
        if (
            Math.abs(x - (node.x + 0.5)) >= radius
            || Math.abs(y - node.y) >= BLOCKED_ENTITY_RADIUS
            || Math.abs(z - (node.z + 0.5)) >= radius
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

export function reconcileStreamTail(
    stream: PathStream,
    graph: Pick<PathGraph, "idOf" | "x" | "y" | "z" | "hasOpenEdge">,
    chain: readonly number[],
    mark: Int32Array,
    link: Int32Array,
    stamp: number,
    final: boolean,
    parentOf?: (nodeId: number) => number
): "published" | "covered" | "disconnected" {
    const nodes = stream.nodes
    const head = stream.head ?? 0
    for (let i = 0; i < chain.length; i++) {
        const nodeId = chain[i] ?? -1
        mark[nodeId] = stamp
        link[nodeId] = i
    }
    const chainIndexOf = (node: Vector3) => {
        const nodeId = graph.idOf(locationToString(node))
        return nodeId !== -1 && mark[nodeId] === stamp ? link[nodeId] ?? -1 : -1
    }

    let k = head
    for (let i = head; i < nodes.length; i++) {
        const node = nodes[i]
        if (node !== undefined && chainIndexOf(node) === 0) {
            k = i
            break
        }
    }
    let matched = -1
    while (k < nodes.length) {
        const node = nodes[k]
        const index = node === undefined ? -1 : chainIndexOf(node)
        if (index <= matched) {
            break
        }
        matched = index
        k++
    }

    let keep = k
    if (matched === -1) {

        const anchor = stream.reached === undefined ? 0 : chainIndexOf(stream.reached)
        if (anchor !== -1) {
            matched = anchor
            keep = head
        }
        else {

            const back = parentOf === undefined || stream.reached === undefined ? undefined : walkBack(graph, stream.reached, mark, stamp, parentOf)
            if (back === undefined) {
                return "disconnected"
            }
            const join = back[back.length - 1] ?? -1
            nodes.length = head
            for (const nodeId of back) {
                nodes.push({ x: graph.x[nodeId] ?? 0, y: graph.y[nodeId] ?? 0, z: graph.z[nodeId] ?? 0 })
            }
            for (let i = (link[join] ?? 0) + 1; i < chain.length; i++) {
                const nodeId = chain[i] ?? -1
                nodes.push({ x: graph.x[nodeId] ?? 0, y: graph.y[nodeId] ?? 0, z: graph.z[nodeId] ?? 0 })
            }
            return "published"
        }
    }

    if (matched >= chain.length - 1 && !final) {
        return "covered"
    }
    nodes.length = keep
    for (let i = matched + 1; i < chain.length; i++) {
        const nodeId = chain[i] ?? -1
        nodes.push({ x: graph.x[nodeId] ?? 0, y: graph.y[nodeId] ?? 0, z: graph.z[nodeId] ?? 0 })
    }
    return "published"
}

function walkBack(
    graph: Pick<PathGraph, "idOf" | "hasOpenEdge">,
    from: Vector3,
    mark: Int32Array,
    stamp: number,
    parentOf: (nodeId: number) => number
): number[] | undefined {
    let nodeId = graph.idOf(locationToString(from))
    const back: number[] = []
    for (let steps = 0; nodeId !== -1 && steps < 4096; steps++) {
        if (mark[nodeId] === stamp) {
            return back.length === 0 ? undefined : back
        }
        const parent = parentOf(nodeId)
        if (parent < 0 || !graph.hasOpenEdge(nodeId, parent)) {
            return undefined
        }
        back.push(parent)
        nodeId = parent
    }
    return undefined
}

function estimateCost(dx: number, dy: number, dz: number) {
    const absX = Math.abs(dx)
    const absZ = Math.abs(dz)
    const diagonal = Math.min(absX, absZ)

    return (Math.max(absX, absZ) - diagonal) + (diagonal * DIAGONAL_COST) + (Math.abs(dy) * Y_WEIGHT)
}

const MIN_MOVE_COST = 0.25

export function generatePath(
    entity: PathVillager,
    start: Vector3,
    target: PathTarget,
    token: { cancelled: boolean },
    stream?: PathStream
) {
    return new Promise<PathResult>(resolve => {
        const out = stream ?? createPathStream()
        const tracking = stream !== undefined
        let settled = false
        let runId = 0
        let restarts = 0
        let goalKey = "0,0,0" as LocationString
        let lastPollTick = Number.NEGATIVE_INFINITY

        const finish = (status: "complete" | PathFailure) => {
            if (settled) {
                return
            }
            settled = true
            if (status !== "complete" && status !== "cancelled") {

                out.nodes.length = Math.min(out.nodes.length, out.head ?? 0)
            }
            out.status = status
            resolve(status === "complete" ? out.nodes : status)
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

        const anchorKey = (): LocationString | undefined => out.reached === undefined ? undefined : locationToString(out.reached)

        function pump(gen: Generator<number | void, void, void>) {
            system.runJob((function* () {
                while (true) {
                    const step = gen.next()
                    if (step.done) {
                        return
                    }
                    if (step.value === SLEEP) {
                        system.runTimeout(() => pump(gen), TRACK_INTERVAL_TICKS)
                        return
                    }
                    yield
                }
            })())
        }

        function* guarded(inner: Generator<number | void, void, void>): Generator<number | void, void, void> {
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

        function* begin(): Generator<number | void, void, void> {
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

            yield* run(++runId, startKey)
        }

        function* run(id: number, initialRootKey: LocationString): Generator<number | void, void, void> {
            let rootKey = initialRootKey
            while (true) {
                const outcome = yield* search(id, rootKey)
                if (outcome === "done") {
                    return
                }
                restarts++

                const anchor = anchorKey()
                if (anchor === undefined || restarts > MAX_RESTARTS) {
                    finish("no_path")
                    return
                }
                rootKey = anchor
                yield
            }
        }

        function* search(id: number, rootKey: LocationString): Generator<number | void, "done" | "restart", void> {
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

                const avoidedNodes = entity.getAvoidedNodes?.()
                if (avoidedNodes !== undefined) {
                    for (const avoidedKey of avoidedNodes) {
                        const avoidedId = graph.idOf(avoidedKey)
                        if (avoidedId !== -1) {
                            blocked[avoidedId] = 2
                        }
                    }
                }

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

                let cycle = 0
                const frontier: number[] = []

                const parentOf = (nodeId: number) => (g[nodeId] ?? Infinity) === Infinity ? -1 : came[nodeId] ?? -1

                const publishChain = (final: boolean) => {
                    cycle++

                    return reconcileStreamTail(out, graph, chain, mark, link, cycle, final, final ? parentOf : undefined)
                }

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

                const publishPartial = () => {
                    const head = out.head ?? 0
                    const pending = out.nodes.length - head
                    if (pending >= PARTIAL_LOOKAHEAD) {
                        return
                    }
                    let candidate = -1
                    if (bestId !== rootId && bestHeuristic !== Infinity) {
                        const end = out.nodes[out.nodes.length - 1]
                        const endId = end === undefined ? -1 : graph.idOf(locationToString(end))
                        if (endId === -1 || estimate(endId) - bestHeuristic >= PARTIAL_MIN_PROGRESS) {
                            candidate = bestId
                        }
                    }
                    if (candidate === -1 && pending <= 1 && heap.size > 0) {
                        const top = heap.values[0] ?? -1
                        if (top !== -1 && closed[top] === 0 && (g[top] ?? Infinity) !== Infinity) {
                            candidate = top
                        }
                    }
                    if (candidate === -1) {
                        return
                    }
                    fillChain(candidate)
                    publishChain(false)
                }

                const retarget = (key: LocationString, targetId: number) => {
                    goalKey = key
                    goalId = targetId
                    ex = X[goalId] ?? 0
                    ey = Y[goalId] ?? 0
                    ez = Z[goalId] ?? 0
                    bestHeuristic = Infinity
                    bestG = Infinity
                    rebuildHeap()
                }

                const settleGoal = function* (settledId: number): Generator<number | void, "restart" | "done" | "continue", void> {
                    let currentTarget = settledId
                    while (true) {
                        fillChain(currentTarget)
                        if (chain.length === 1 && out.nodes.length <= (out.head ?? 0)) {
                            out.nodes.push({ x: X[currentTarget] ?? 0, y: Y[currentTarget] ?? 0, z: Z[currentTarget] ?? 0 })
                        }
                        else if (publishChain(true) === "disconnected") {
                            return "restart"
                        }
                        if (targetEntity === undefined || !tracking) {
                            finish("complete")
                            return "done"
                        }
                        while (true) {
                            yield SLEEP
                            if (halted()) {
                                return "done"
                            }
                            if ((out.head ?? 0) >= out.nodes.length) {
                                finish("complete")
                                return "done"
                            }
                            const location = readTargetLocation(targetEntity, dimensionId)
                            if (location === undefined) {
                                finish("complete")
                                return "done"
                            }
                            const nextKey = evaluateTarget(location)
                            const nextId = nextKey === undefined ? -1 : graph.idOf(nextKey)
                            if (nextKey === undefined || nextId === -1) {
                                continue
                            }
                            retarget(nextKey, nextId)
                            if (closed[goalId] === 1) {
                                currentTarget = goalId
                                break
                            }
                            return "continue"
                        }
                    }
                }

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
                        const outcome = yield* settleGoal(current)
                        if (outcome !== "continue") {
                            return outcome
                        }
                    }

                    const currentG = g[current] ?? Infinity
                    const currentHeuristic = estimate(current)
                    if (currentG !== Infinity && (currentHeuristic < bestHeuristic || (currentHeuristic === bestHeuristic && currentG < bestG))) {
                        bestId = current
                        bestHeuristic = currentHeuristic
                        bestG = currentG
                    }

                    if (++expansions > MAX_EXPANSIONS) {

                        const progress = estimate(rootId) - bestHeuristic
                        if (bestId === rootId || progress < STALL_MIN_PROGRESS) {
                            finish((out.head ?? 0) < out.nodes.length ? "complete" : "timeout")
                            return "done"
                        }
                        fillChain(bestId)
                        publishChain(false)
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
                        publishPartial()
                        yield
                        if (halted()) {
                            return "done"
                        }
                        const nextGoalKey = pollTarget()
                        if (nextGoalKey !== undefined) {
                            const nextGoalId = graph.idOf(nextGoalKey)
                            if (nextGoalId !== -1) {
                                retarget(nextGoalKey, nextGoalId)
                                if (closed[goalId] === 1) {
                                    const outcome = yield* settleGoal(goalId)
                                    if (outcome !== "continue") {
                                        return outcome
                                    }
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

        pump(guarded(begin()))
    })
}

export interface SearchBias {
    x: -1 | 0 | 1
    z: -1 | 0 | 1
}

export function findNearestNodeLocation(nodeList: Record<string, PathNode>, location: Vector3, maxRadius = 1.5, bias?: SearchBias) {
    if (nodeList[locationToString(location)] !== undefined) {
        return location
    }
    const lx = location.x
    const ly = location.y
    const lz = location.z

    const biasX = bias?.x ?? 0
    const biasZ = bias?.z ?? 0
    for (let radius = 1; radius <= maxRadius; radius++) {
        let bestX = 0
        let bestY = 0
        let bestZ = 0
        let closestDistSq = Infinity
        const dxMin = biasX > 0 ? 0 : -radius
        const dxMax = biasX < 0 ? 0 : radius
        const dzMin = biasZ > 0 ? 0 : -radius
        const dzMax = biasZ < 0 ? 0 : radius

        for (let dx = dxMin; dx <= dxMax; dx++) {
            const dxOnShell = dx === radius || dx === -radius
            const x = lx + dx
            for (let dy = -radius; dy <= radius; dy++) {
                const dyOnShell = dxOnShell || dy === radius || dy === -radius
                const y = ly + dy

                const dzStep = dyOnShell ? 1 : radius * 2
                const keyPrefix = `${x},${y},`

                let dz = dyOnShell ? dzMin : -radius < dzMin ? radius : -radius
                for (; dz <= dzMax; dz += dzStep) {
                    if (nodeList[keyPrefix + (lz + dz)] === undefined) {
                        continue
                    }
                    const dyDist = (y + 0.25) - ly
                    const distSq = (dx * dx) + (dyDist * dyDist) + (dz * dz)
                    if (distSq < closestDistSq) {
                        closestDistSq = distSq
                        bestX = dx
                        bestY = dy
                        bestZ = dz
                    }
                }
            }
        }
        if (closestDistSq !== Infinity) {
            return { x: lx + bestX, y: ly + bestY, z: lz + bestZ }
        }
    }
    return undefined
}

interface PathEntity extends CheckEntityData {
    villager?: PathVillager
    ignoreAsBlocker?: boolean
    radius?: number
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
                if (other.id === selfId || other.id === targetId || calculateChebyshevDistance(other.location, node) >= (other.radius ?? BLOCKED_ENTITY_RADIUS) + 0.75) {
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
                    radius: blockRadiusFromWidth(entity.getHitboxSize().width),
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

export function checkRequirement(villagerType: string, requirement?: NodeRequirement) {
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

const BED_BLOCK_TYPE = "minecraft:bed"

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

    if (block.typeId === BED_BLOCK_TYPE || below.typeId === BED_BLOCK_TYPE) {
        return false
    }
    if (below.isDangerous()) {
        return false
    }
    if (
        below.destroyableLeaf() && (block.destroyableLeaf() || above.destroyableLeaf())
    ) {
        return false
    }

    const belowIsSolid = below.getIsSolid()
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
    if (Registry.chestTypesSet.has(this.typeId)) {
        return false
    }
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
    const blockTypeId = this.typeId
    return (
        (this.isAir || Registry.nonSolidBlocksSet.has(blockTypeId) || this.destroyableLeaf())
        && !avoidBlockTypes.has(blockTypeId)
        && !this.isDangerous() && !Registry.liquidTypesSet.has(blockTypeId)
    )
}

Block.prototype.destroyableLeaf = function () {
    return (
        Registry.leafTypes.includesFast(this.typeId) && this.permutation.getState("persistent_bit") === false
    )
}

Block.prototype.isDangerous = function () {
    return Registry.dangerousTypesSet.has(this.typeId)
}
