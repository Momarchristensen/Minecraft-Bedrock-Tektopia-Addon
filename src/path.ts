import {
    Block,
    GameMode,
    Player,
    system,
    type Vector3,
    world
} from "@minecraft/server"

import { getLocationUncached } from "./cache"

import { debugFlags } from "./debug"

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
    NodeRequirement,
    PathNode,
    Bounds
} from "./minecraft_extensions"

import type { Village } from "./village"

import type { Villager } from "./villager"

const Y_WEIGHT = 3
const VERTICAL_TOWARD_PENALTY = 2
const VERTICAL_AWAY_PENALTY = 10
const DIAGONAL_COST = 1.75

type PathResult = "no_path" | "no_village" | "timeout" | "cancelled" | "error" | Vector3[]

interface Scratch {
    capacity: number
    g: Float64Array
    closed: Uint8Array
    came: Int32Array
    blocked: Uint8Array
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
        heap: new IntHeap()
    }
    scratch.g.fill(Infinity)
    scratch.closed.fill(0)
    scratch.blocked.fill(0)
    scratch.heap.size = 0
    return scratch
}

function buildBlockedCells(
    entities: Array<{ location: Vector3, cancelPath?: boolean }>,
    graph: PathGraph,
    bounds: Bounds,
    blocked: Uint8Array
) {
    const RADIUS = 1.75
    const minBX = Math.min(bounds.start.x, bounds.end.x) - RADIUS - 1
    const maxBX = Math.max(bounds.start.x, bounds.end.x) + RADIUS + 1
    const minBZ = Math.min(bounds.start.z, bounds.end.z) - RADIUS - 1
    const maxBZ = Math.max(bounds.start.z, bounds.end.z) + RADIUS + 1

    for (const other of entities) {
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

export function generatePath(entity: Villager, start: Vector3, end: Vector3, token: { cancelled: boolean }) {
    return new Promise<PathResult>(resolve => {
        const village = entity.getVillage()
        if (village === undefined) {
            resolve("no_village")
            return
        }
        const villageInfo = village
        const villageBounds = villageInfo.bounds
        const dimensionId = villageInfo.dimensionId
        const dimension = world.getDimension(dimensionId)
        const nodeList = villageInfo.pathNodes

        const startLocation = floorVector(start)
        let endLocation = floorVector(end)

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

        system.runJob(safeTickGeneratePath())

        function* safeTickGeneratePath() {
            try {
                yield* tickGeneratePath()
            }
            catch (error) {
                if (debugFlags.pathfindingWarnings) {
                    console.warn("Pathfinding failed: ", error)
                }
                resolve("error")
            }
        }

        function* tickGeneratePath() {
            const isCancelled = () => token.cancelled
            if (isCancelled()) {
                resolve("cancelled")
                return
            }

            let startKey = locationToString(startLocation)
            let endKey = locationToString(endLocation)

            if (nodeList[startKey] === undefined) {
                const nearestStart = findNearestNodeLocation(nodeList, startLocation)
                if (nearestStart === undefined) {
                    resolve("no_path")
                    return
                }
                startKey = locationToString(nearestStart)
            }
            if (nodeList[endKey] === undefined) {
                const nearestEnd = findNearestNodeLocation(nodeList, endLocation)
                if (nearestEnd === undefined) {
                    resolve("no_path")
                    return
                }
                endKey = locationToString(nearestEnd)
            }

            const startVec = stringToLocation(startKey)

            if (startKey === endKey) {
                resolve([startVec])
                return
            }

            const graph = villageInfo.graph
            const startId = graph.idOf(startKey)
            const endId = graph.idOf(endKey)
            if (startId === -1 || endId === -1) {
                resolve("no_path")
                return
            }
            if (startId === endId) {
                resolve([stringToLocation(startKey)])
                return
            }

            const HEURISTIC_WEIGHT = 1
            const MAX_EXPANSIONS = 20000
            const YIELD_EVERY = 20

            const { x: X, y: Y, z: Z, cost: COST, reqId: REQ, stepReqId: STEP, alive: ALIVE, degree: DEG, adj: ADJ } = graph
            const size = X.length
            const lookup = (x: number, y: number, z: number) => {
                const id = graph.idAt(x, y, z)
                return id < size ? id : -1
            }

            graph.beginSearch()
            const scratch = acquireScratch(size)
            try {
                const { g, closed, came, blocked, heap } = scratch
                const checkEntityList = (pathCheckEntities[dimensionId] ?? []).filter(other => other.id !== entity.id)
                buildBlockedCells(checkEntityList, graph, villageBounds, blocked)

                const typeId = entity.typeId
                const verdict = new Int8Array(256).fill(-1)
                const allowed = (requirementId: number) => {
                    let value = verdict[requirementId] ?? -1
                    if (value === -1) {
                        value = checkRequirement(typeId, graph.requirements[requirementId] ?? { whiteList: false, types: [] }) ? 1 : 0
                        verdict[requirementId] = value
                    }
                    return value === 1
                }

                const ex = X[endId] ?? 0
                const ey = Y[endId] ?? 0
                const ez = Z[endId] ?? 0
                const estimate = (id: number) => {
                    const x = X[id] ?? 0
                    const y = Y[id] ?? 0
                    const z = Z[id] ?? 0
                    const dx = Math.abs(x - ex)
                    const dz = Math.abs(z - ez)
                    const diagonal = Math.min(dx, dz)
                    return (Math.max(dx, dz) - diagonal) + (diagonal * DIAGONAL_COST) + (Math.abs(y - ey) * Y_WEIGHT)
                }

                const buildPath = (targetId: number) => {
                    const path: Vector3[] = []
                    let id = targetId
                    while (id !== -1) {
                        const x = X[id] ?? 0
                        const y = Y[id] ?? 0
                        const z = Z[id] ?? 0
                        path.push({ x, y, z })
                        id = came[id] ?? -1
                    }
                    path.reverse()
                    return path
                }

                g[startId] = 0
                came[startId] = -1
                heap.push(startId, estimate(startId) * HEURISTIC_WEIGHT)

                let expansions = 0
                let bestId = startId
                let bestHeuristic = estimate(startId)
                let bestG = 0

                while (heap.size > 0) {
                    const current = heap.pop()
                    if (closed[current] === 1) {
                        continue
                    }
                    closed[current] = 1

                    if (current === endId) {
                        resolve(buildPath(current))
                        return
                    }
                    if (token.cancelled) {
                        resolve("cancelled")
                        return
                    }

                    const currentG = g[current] ?? Infinity
                    const currentHeuristic = estimate(current)
                    if (currentG !== Infinity && (currentHeuristic < bestHeuristic || (currentHeuristic === bestHeuristic && currentG < bestG))) {
                        bestId = current
                        bestHeuristic = currentHeuristic
                        bestG = currentG
                    }

                    if (++expansions > MAX_EXPANSIONS) {
                        resolve(bestId === startId ? "timeout" : buildPath(bestId))
                        return
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

                        let verticalPenalty = 0
                        if (cy !== ny) {
                            const stepId = STEP[ny > cy ? next : current] ?? 0
                            if (stepId !== 0 && !allowed(stepId)) {
                                continue
                            }
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
                            (Math.max(dx, dz) - diagonal) + (diagonal * DIAGONAL_COST) + Math.abs(cy - ny) +
                            verticalPenalty + (blockState === 1 ? 50 : 0) + (COST[next] ?? 0)
                        )

                        const tentativeG = currentG + moveCost
                        if (tentativeG < (g[next] ?? Infinity)) {
                            came[next] = current
                            g[next] = tentativeG
                            heap.push(next, tentativeG + (estimate(next) * HEURISTIC_WEIGHT))
                        }
                    }

                    if (expansions % YIELD_EVERY === 0) {
                        yield
                    }
                }

                resolve("no_path")
            }
            finally {
                scratchPool.push(scratch)
                graph.endSearch()
            }
        }
    })
}

function findNearestNodeLocation(nodeList: Record<string, PathNode>, location: Vector3, maxRadius = 1.5) {
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
    villager?: Villager
}

const CELL = 4
const cellKey = (x: number, z: number) => (Math.floor(x / CELL) * 4194304) + Math.floor(z / CELL)
const pathGrid = new Map<string, Map<number, PathEntity[]>>()

export function findPathBlocker(dimensionId: string, node: Vector3, selfId: string) {
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
                if (other.id === selfId || calculateChebyshevDistance(other.location, node) >= 1.75) {
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

system.runInterval(() => {
    const pathingVillages = new Map<string, Village>()
    const villagerById = new Map<string, Villager>()

    for (const villager of world.getVillagers()) {
        villagerById.set(villager.id, villager)
        if (!villager.isPathing) {
            continue
        }
        const village = villager.getVillage()
        if (village !== undefined) {
            pathingVillages.set(`${village.dimensionId}|${village.centerString}`, village)
        }
    }

    for (const dimensionId of Registry.dimensionTypes) {
        pathCheckEntities[dimensionId] = []
        pathGrid.set(dimensionId, new Map())
    }

    for (const village of pathingVillages.values()) {
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

        const seen = new Set(flat.map(pathEntity => pathEntity.id))
        for (const entity of entities) {
            if (seen.has(entity.id)) {
                continue
            }
            if (entity instanceof Player && entity.getGameMode() === GameMode.Spectator) {
                continue
            }
            seen.add(entity.id)

            const location = getLocationUncached(entity)
            const pathEntity: PathEntity = {
                location,
                id: entity.id,
                typeId: entity.typeId,
                cancelPath: pathCancelEntityTypes.includesFast(entity.typeId),
                villager: villagerById.get(entity.id)
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
}, 5)

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
        location.x >= Math.floor(Math.min(bounds.start.x, bounds.end.x)) - margin &&
        location.x <= Math.ceil(Math.max(bounds.start.x, bounds.end.x)) + margin &&
        location.z >= Math.floor(Math.min(bounds.start.z, bounds.end.z)) - margin &&
        location.z <= Math.ceil(Math.max(bounds.start.z, bounds.end.z)) + margin
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
                    block.dimension.id === village.dimensionId &&
                    isNearVillageBounds(block.location, villageBounds)
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
        this.canWalkThrough() ||
        Registry.doorTypes.includesFast(this.typeId) ||
        avoidBlockTypes.has(this.typeId)
    )
}

Block.prototype.canWalkThrough = function () {
    return (
        (this.isAir || Registry.nonSolidBlocksSet.has(this.typeId) || this.destroyableLeaf()) &&
        !avoidBlockTypes.has(this.typeId) &&
        !this.isDangerous() && !this.isLiquid && !this.isWaterlogged
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
