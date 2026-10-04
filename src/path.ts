import {
    Block,
    GameMode,
    Player,
    system,
    type Vector3,
    world
} from "@minecraft/server"

import { debugFlags } from "./debug"

import {
    pathCancelEntityTypes,
    pathIgnoreEntityTypes
} from "./path_constants"

import { Registry } from "./registry"

import {
    addVectors,
    calculateDistance,
    calculateSquareDistance,
    centerVector,
    floorVector,
    isVectorBetween,
    stringToLocation,
    locationToString,
    addVector
} from "./utils"

import {
    MIN_MOVE_COST,
    minecraftDangerousBlockTypes,
    minecraftNonSolidBlocks
} from "./variables"

import type {
    CheckEntityData,
    NodeRequirement,
    PathNode,
    UndefinedRecord,
    LocationString,
    VillageBounds
} from "./minecraft_extensions"

import type { Villager } from "./villager"

const Y_WEIGHT = 3
const VERTICAL_TOWARD_PENALTY = 2
const VERTICAL_AWAY_PENALTY = 10
const DIAGONAL_COST = 1.75

type PathResult = "no_path" | "no_village" | "timeout" | "cancelled" | "error" | Vector3[]

class PriorityQueue<T> {
    private heap: Array<{ element: T, priority: number }> = []

    enqueue(element: T, priority: number): void {
        const node = { element, priority }
        this.heap.push(node)
        this.bubbleUp()
    }

    dequeue(): T | undefined {
        const min = this.heap[0]
        const end = this.heap.pop()

        if (end === undefined) {
            return undefined
        }

        if (this.heap.length > 0) {
            this.heap[0] = end
            this.bubbleDown()
        }

        return min.element
    }

    private bubbleUp(): void {
        let index = this.heap.length - 1
        const element = this.heap[index]

        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2)
            const parent = this.heap[parentIndex]

            if (element.priority >= parent.priority) {
                break
            }

            this.heap[index] = parent
            index = parentIndex
        }

        this.heap[index] = element
    }

    private bubbleDown(): void {
        let index = 0
        const length = this.heap.length
        const element = this.heap[0]

        while (true) {
            const leftChildIndex = (2 * index) + 1
            const rightChildIndex = (2 * index) + 2

            let swap: number | null = null

            if (leftChildIndex < length) {
                const leftChild = this.heap[leftChildIndex]

                if (leftChild.priority < element.priority) {
                    swap = leftChildIndex
                }
            }

            if (rightChildIndex < length) {
                const rightChild = this.heap[rightChildIndex]

                if (
                    (swap === null && rightChild.priority < element.priority) ||
                    (swap !== null && rightChild.priority < this.heap[swap].priority)
                ) {
                    swap = rightChildIndex
                }
            }

            if (swap === null) {
                break
            }

            this.heap[index] = this.heap[swap]
            index = swap
        }

        this.heap[index] = element
    }

    isEmpty(): boolean {
        return this.heap.length === 0
    }
}

function checkDiagonalRequirements(
    nodeList: UndefinedRecord<string, PathNode>,
    from: Vector3,
    to: Vector3,
    villagerType: string
) {
    if (from.x === to.x || from.z === to.z) {
        return true
    }

    const corners: Vector3[] = [
        { x: to.x, y: from.y, z: from.z },
        { x: from.x, y: from.y, z: to.z }
    ]

    for (const corner of corners) {
        const cornerNode = nodeList[locationToString(corner)]
        if (cornerNode?.requirement === undefined) {
            continue
        }
        if (!checkRequirement(villagerType, cornerNode.requirement)) {
            return false
        }
    }

    return true
}

function checkStepRequirements(
    nodeList: UndefinedRecord<string, PathNode>,
    fromKey: LocationString,
    from: Vector3,
    toKey: LocationString,
    to: Vector3,
    villagerType: string
) {
    if (from.y === to.y) {
        return true
    }

    const upperKey = to.y > from.y ? toKey : fromKey
    const stepRequirement = nodeList[upperKey]?.stepRequirement
    return stepRequirement === undefined || checkRequirement(villagerType, stepRequirement)
}

export function generatePath(entity: Villager, start: Vector3, end: Vector3, token: { cancelled: boolean }) {
    return new Promise<PathResult>(resolve => {
        const village = entity.getVillage()
        if (village === undefined) {
            resolve("no_village")
            return
        }
        const villageBounds = village.bounds
        const dimensionId = village.dimensionId
        const dimension = world.getDimension(dimensionId)
        const nodeList = village.pathNodes

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

        function heuristic(vector1: Vector3, vector2: Vector3) {
            const dx = Math.abs(vector1.x - vector2.x)
            const dz = Math.abs(vector1.z - vector2.z)
            const dy = Math.abs(vector1.y - vector2.y)
            const diagonalSteps = Math.min(dx, dz)
            const straightSteps = Math.max(dx, dz) - diagonalSteps

            return straightSteps + (diagonalSteps * DIAGONAL_COST) + dy
        }


        function estimate(vector1: Vector3, vector2: Vector3) {
            const dx = Math.abs(vector1.x - vector2.x)
            const dz = Math.abs(vector1.z - vector2.z)
            const dy = Math.abs(vector1.y - vector2.y)
            const diagonalSteps = Math.min(dx, dz)
            const straightSteps = Math.max(dx, dz) - diagonalSteps

            return straightSteps + (diagonalSteps * DIAGONAL_COST) + (dy * Y_WEIGHT)
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
            const endVec = stringToLocation(endKey)

            if (startKey === endKey) {
                resolve([startVec])
                return
            }

            const HEURISTIC_WEIGHT = 1
            const MAX_EXPANSIONS = 20000
            const YIELD_EVERY = 20

            const closedSet = new Set<string>()
            const gScore = new Map<string, number>([[startKey, 0]])
            const cameFrom = new Map<string, LocationString>()
            const openSet = new PriorityQueue<LocationString>()
            openSet.enqueue(startKey, estimate(startVec, endVec) * HEURISTIC_WEIGHT)

            const buildPath = (targetKey: LocationString) => {
                const path: Vector3[] = []
                let key: LocationString | undefined = targetKey
                while (key !== undefined) {
                    path.push(stringToLocation(key))
                    key = cameFrom.get(key)
                }
                path.reverse()
                return path
            }

            const checkEntityList = getCheckPathEntities(dimensionId, entity)
            let expansions = 0
            let bestKey = startKey
            let bestHeuristic = estimate(startVec, endVec)
            let bestG = 0

            while (!openSet.isEmpty()) {
                const currentKey = openSet.dequeue()

                if (currentKey === undefined || closedSet.has(currentKey)) {
                    continue
                }
                closedSet.add(currentKey)

                if (currentKey === endKey) {
                    resolve(buildPath(currentKey))
                    return
                }

                if (token.cancelled) {
                    resolve("cancelled")
                    return
                }

                const currentVec = stringToLocation(currentKey)
                const currentG = gScore.get(currentKey) ?? 0

                const currentHeuristic = estimate(currentVec, endVec)
                if (
                    currentHeuristic < bestHeuristic ||
                    (currentHeuristic === bestHeuristic && currentG < bestG)
                ) {
                    bestKey = currentKey
                    bestHeuristic = currentHeuristic
                    bestG = currentG
                }

                if (++expansions > MAX_EXPANSIONS) {
                    if (bestKey === startKey) {
                        resolve("timeout")
                    }
                    else {
                        resolve(buildPath(bestKey))
                    }
                    return
                }

                const currentNode = nodeList[currentKey]
                if (currentNode === undefined) {
                    continue
                }

                outerLoop: for (const neighborKey of currentNode.neighbors) {
                    if (closedSet.has(neighborKey)) {
                        continue
                    }
                    const neighborNode = nodeList[neighborKey]
                    if (neighborNode === undefined) {
                        continue
                    }

                    if (debugFlags.pathScanParticles) {
                        try {
                            dimension.spawnParticle(
                                "minecraft:basic_flame_particle",
                                centerVector(stringToLocation(neighborKey))
                            )
                        }
                        catch { }
                    }

                    if (neighborNode.requirement !== undefined && !checkRequirement(entity.typeId, neighborNode.requirement)) {
                        continue
                    }

                    const neighborLocation = stringToLocation(neighborKey)

                    if (!checkDiagonalRequirements(nodeList, currentVec, neighborLocation, entity.typeId)) {
                        continue
                    }

                    if (!checkStepRequirements(nodeList, currentKey, currentVec, neighborKey, neighborLocation, entity.typeId)) {
                        continue
                    }

                    const neighborCenter = centerVector(neighborLocation, true)

                    let isBlocked = false
                    for (const other of checkEntityList) {
                        if (calculateSquareDistance(other.location, neighborCenter) < 1.75) {
                            if (other.cancelPath) {
                                continue outerLoop
                            }
                            isBlocked = true
                            break
                        }
                    }

                    const blockCost = neighborNode.cost ?? 0
                    let verticalPenalty = 0
                    if (neighborLocation.y !== currentVec.y) {
                        const movesTowardTarget = Math.abs(neighborLocation.y - endVec.y) < Math.abs(currentVec.y - endVec.y)
                        verticalPenalty = movesTowardTarget ? VERTICAL_TOWARD_PENALTY : VERTICAL_AWAY_PENALTY
                    }
                    const moveCost = Math.max(
                        MIN_MOVE_COST,
                        heuristic(currentVec, neighborLocation) +
                        verticalPenalty +
                        (isBlocked ? 50 : 0) +
                        blockCost
                    )

                    const tentativeG = currentG + moveCost

                    if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
                        cameFrom.set(neighborKey, currentKey)
                        gScore.set(neighborKey, tentativeG)
                        openSet.enqueue(
                            neighborKey,
                            tentativeG + (estimate(neighborLocation, endVec) * HEURISTIC_WEIGHT)
                        )
                    }
                }

                if (expansions % YIELD_EVERY === 0) {
                    yield
                }
            }

            resolve("no_path")
        }
    })
}

function findNearestNodeLocation(nodeList: UndefinedRecord<string, PathNode>, location: Vector3, maxRadius = 1.5) {
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

const pathCheckEntities: UndefinedRecord<string, CheckEntityData[]> = {}

export function getCheckPathEntities(dimensionId: string, villager: Villager) {
    const VillagerClass = villager.constructor as typeof Villager
    const result = []
    const entityList = pathCheckEntities[dimensionId] ?? []
    for (const checkEntityObject of entityList) {
        if (checkEntityObject.id === villager.id) {
            continue
        }
        const checkEntity = world.getEntity(checkEntityObject.id)
        if (checkEntity === undefined) {
            continue
        }
        result.push({
            ...checkEntityObject,
            isBlocked: checkEntity instanceof VillagerClass && ((checkEntity.isBlocked || !checkEntity.isPathing) || checkEntity.totalBlockTimer > 100)
        })
    }
    return result
}

system.runInterval(() => {
    for (const dimensionId of Registry.dimensionTypes) {
        const dimension = world.getDimension(dimensionId)
        const entities = dimension.getEntities({
            excludeTypes: pathIgnoreEntityTypes
        })

        pathCheckEntities[dimensionId] = []
        for (const entity of entities) {
            if (entity instanceof Player && entity.getGameMode() === GameMode.Spectator) {
                continue
            }
            pathCheckEntities[dimensionId].push({
                location: entity.location,
                id: entity.id,
                typeId: entity.typeId,
                cancelPath: pathCancelEntityTypes.includesFast(entity.typeId)
            })
        }
    }
})

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

const updatePathNodeList: Block[][] = []

export function updatePathNodes(blockList: Block[]) {
    updatePathNodeList.push(blockList)
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
        let index = 0
        while (updatePathNodeList.length > 0) {
            const blockList = updatePathNodeList.shift() as Block[]
            for (let i = 0; i < blockList.length; i++) {
                const checkBlock = blockList[i]
                if (!checkBlock.isValid) {
                    continue
                }
                const neighborList = checkBlock.getNodeNeighbors()
                const checkBlockStringLocation = locationToString(checkBlock)
                const villageList = world.getVillages()
                for (const village of villageList) {
                    const alreadyCheckedLocations = new Set()
                    const villageBounds = village.bounds
                    village.removeNode(checkBlockStringLocation)
                    for (const neighborBlock of neighborList) {
                        const neighborLocationString = locationToString(neighborBlock)
                        if (!alreadyCheckedLocations.has(neighborLocationString)) {
                            alreadyCheckedLocations.add(neighborLocationString)
                            if (village.pathNodes[neighborLocationString] !== undefined && neighborBlock.isValidPath(villageBounds)) {
                                yield* village.searchBlocks(neighborBlock)
                            }
                        }
                    }

                    yield* village.scanLocation(checkBlock.location)
                }

                if (i % 3 === 0) {
                    yield
                }
            }
            index++
            if (index % 5 === 0) {
                yield
            }
        }
    }
    finally {
        if (callback !== undefined) {
            callback()
        }
    }
}

Block.prototype.isValidPath = function (villageBounds?: VillageBounds) {
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

const minecraftNonSolidBlocksSet = new Set(minecraftNonSolidBlocks)

Block.prototype.canWalkThrough = function () {
    return (
        (this.isAir || minecraftNonSolidBlocksSet.has(this.typeId) || this.destroyableLeaf()) &&
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
