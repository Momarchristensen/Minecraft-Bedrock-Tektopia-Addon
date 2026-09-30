import {
    Block,
    GameMode,
    Player,
    system,
    type Vector3,
    world
} from "@minecraft/server"

import {
    pathCancelEntityTypes,
    pathIgnoreEntityTypes
} from "./path_constants"
import { Registry } from "./registry"
import {
    addVectors,
    calculateSquareDistance,
    centerVector,
    floorVector,
    isVectorBetween,
    stringToVector,
    vectorToString
} from "./utils"

import {
    minecraftDangerousBlockTypes,
    minecraftNonSolidBlocks
} from "./variables"
import type {
    CheckEntityData,
    NodeRequirement,
    PathNode,
    VillageBounds
} from "."
import type { Villager } from "./villager"

type PathResult = "no_path" | "no_village" | "timeout" | "cancelled" | "error" | Vector3[]

export function generatePath(entity: Villager, startLocation: Vector3, targetLocation: Vector3, token: { cancelled: boolean }) {
    return new Promise<PathResult>(resolve => {
        const village = entity.getVillage()
        if (!village) {
            resolve("no_village")
            return
        }
        const villageBounds = village.bounds
        const dimensionId = village.dimensionId
        const dimension = world.getDimension(dimensionId)
        const nodeList = village.pathNodes

        startLocation = floorVector(startLocation)
        targetLocation = floorVector(targetLocation)

        const endBlock = dimension.getBlockSafe(targetLocation)
        if (endBlock !== undefined && !endBlock.isValidPath(villageBounds)) {
            const checkBlocks = [
                endBlock.northSafe(),
                endBlock.eastSafe(),
                endBlock.southSafe(),
                endBlock.westSafe()
            ]
            for (let i = 0; i < checkBlocks.length; i++) {
                const block = checkBlocks[i]
                if (block !== undefined && block.isValidPath(villageBounds)) {
                    targetLocation = block.location
                    break
                }
            }
        }

        function heuristic(vector1: Vector3, vector2: Vector3) {
            return (
                Math.abs(vector1.x - vector2.x) + Math.abs(vector1.y - vector2.y) + Math.abs(vector1.z - vector2.z)
            )
        }

        system.runJob(safeTickGeneratePath())

        function* safeTickGeneratePath() {
            try {
                yield* tickGeneratePath()
            }
            catch (error) {
                console.warn("Pathfinding failed: ", error)
                resolve("error")
            }
        }

        function* tickGeneratePath() {
            let startKey = vectorToString(startLocation)
            let endKey = vectorToString(targetLocation)

            if (!nodeList[startKey]) {
                const nearestStart = findNearestNodeLocation(nodeList, startLocation)
                if (nearestStart === undefined) {
                    resolve("no_path"); return
                }
                startKey = vectorToString(nearestStart)
            }
            if (!nodeList[endKey]) {
                const nearestEnd = findNearestNodeLocation(nodeList, targetLocation)
                if (nearestEnd === undefined) {
                    resolve("no_path"); return
                }
                endKey = vectorToString(nearestEnd)
            }

            const startVec = stringToVector(startKey)
            const endVec = stringToVector(endKey)

            if (startKey === endKey) {
                resolve([startVec])
                return
            }

            const HEURISTIC_WEIGHT = 1
            const MAX_EXPANSIONS = 20000
            const YIELD_EVERY = 20

            const closedSet = new Set<string>()
            const gScore = new Map<string, number>([[startKey, 0]])
            const cameFrom = new Map<string, string>()
            const openSet = new PriorityQueue<string>()
            openSet.enqueue(startKey, heuristic(startVec, endVec) * HEURISTIC_WEIGHT)

            const checkEntityList = getCheckPathEntities(dimensionId, entity)
            let expansions = 0

            while (!openSet.isEmpty()) {
                const currentKey = openSet.dequeue()

                if (closedSet.has(currentKey)) {
                    continue
                }
                closedSet.add(currentKey)

                if (currentKey === endKey) {
                    const path: Vector3[] = []
                    let k: string | undefined = currentKey
                    while (k !== undefined) {
                        path.push(stringToVector(k))
                        k = cameFrom.get(k)
                    }
                    path.reverse()
                    resolve(path)
                    return
                }

                if (token.cancelled) {
                    resolve("cancelled"); return
                }

                if (++expansions > MAX_EXPANSIONS) {
                    resolve("timeout")
                    return
                }

                const currentVec = stringToVector(currentKey)
                const currentNode = nodeList[currentKey]
                if (!currentNode) {
                    continue
                }
                const currentG = gScore.get(currentKey) ?? 0

                outerLoop: for (const neighborKey of currentNode.neighbors) {
                    if (closedSet.has(neighborKey)) {
                        continue
                    }
                    const neighborNode = nodeList[neighborKey]
                    if (!neighborNode) {
                        continue
                    }
                    if (neighborNode.requirement !== undefined && !checkRequirement(entity.typeId, neighborNode.requirement)) {
                        continue
                    }

                    const neighborLocation = stringToVector(neighborKey)
                    const neighborCenter = centerVector(neighborLocation, true)

                    let isBlocked = false
                    for (let i = 0; i < checkEntityList.length; i++) {
                        const other = checkEntityList[i]
                        if (calculateSquareDistance(other.location, neighborCenter) < 1.75) {
                            if (other.cancelPath) {
                                continue outerLoop
                            }
                            isBlocked = true
                            break
                        }
                    }

                    const moveCost = heuristic(currentVec, neighborLocation) + (neighborLocation.y !== currentVec.y ? 10 : 0) + (isBlocked ? 50 : 0)
                    const tentativeG = currentG + moveCost

                    if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
                        cameFrom.set(neighborKey, currentKey)
                        gScore.set(neighborKey, tentativeG)
                        openSet.enqueue(
                            neighborKey,
                            tentativeG + heuristic(neighborLocation, endVec) * HEURISTIC_WEIGHT
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

function findNearestNodeLocation(nodeList: Record<string, PathNode>, location: Vector3, maxRadius = 6) {
    if (nodeList[vectorToString(location)]) {
        return location
    }
    for (let radius = 1; radius <= maxRadius; radius++) {
        let closest
        let closestDist = Infinity
        for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dz = -radius; dz <= radius; dz++) {
                    if (Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz)) !== radius) {
                        continue
                    }
                    const candidate = addVectors(location, { x: dx, y: dy, z: dz })
                    if (!nodeList[vectorToString(candidate)]) {
                        continue
                    }
                    const dist = calculateSquareDistance(candidate, location)
                    if (dist < closestDist) {
                        closestDist = dist
                        closest = candidate
                    }
                }
            }
        }
        if (closest) {
            return closest
        }
    }
    return undefined
}

export function getCheckPathEntities(dimensionId: string, villager: Villager) {
    const VillagerClass = villager.constructor as typeof Villager
    const result = []
    const entityList = pathCheckEntities[dimensionId] ?? []
    for (let i = 0; i < entityList.length; i++) {
        const checkEntityObject = entityList[i]
        if (!checkEntityObject || checkEntityObject.id === villager.id) {
            continue
        }
        const checkEntity = world.getEntity(checkEntityObject.id)
        if (!checkEntity) {
            continue
        }
        result.push({
            ...checkEntityObject,
            isBlocked: checkEntity instanceof VillagerClass && (checkEntity.isBlocked || !checkEntity.isPathing)
        })
    }
    return result
}

const pathCheckEntities: Record<string, CheckEntityData[]> = {}

system.runInterval(() => {
    for (let i = 0; i < Registry.dimensionTypes.length; i++) {
        const dimensionId = Registry.dimensionTypes[i]
        const dimension = world.getDimension(dimensionId)
        const entities = dimension.getEntities({
            excludeTypes: pathIgnoreEntityTypes
        })

        pathCheckEntities[dimensionId] = []
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i]
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
    if (!requirement) {
        return true
    }
    const { whiteList, types } = requirement
    const typeSet = new Set(types)
    if (whiteList) {
        return typeSet.has(villagerType)
    }
    return !typeSet.has(villagerType)
}

class PriorityQueue<T> {
    private heap: Array<{ element: T, priority: number }> = []

    enqueue(element: T, priority: number): void {
        const node = { element, priority }
        this.heap.push(node)
        this.bubbleUp()
    }

    dequeue(): T {
        const min = this.heap[0]
        const end = this.heap.pop()!

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
            const leftChildIndex = 2 * index + 1
            const rightChildIndex = 2 * index + 2

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
                    swap === null && rightChild.priority < element.priority || swap !== null && rightChild.priority < this.heap[swap].priority
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

const updatePathNodeList: Block[][] = []

export function updatePathNodes(blockList: Block[]) {
    updatePathNodeList.push(blockList)
}

world.afterEvents.playerInteractWithBlock.subscribe(event => {
    const block = event.block

    updatePathNodes(
        [block, block.aboveSafe(), block.belowSafe()].filter(
            block => block !== undefined
        )
    )
})

world.afterEvents.playerPlaceBlock.subscribe(event => {
    const block = event.block

    updatePathNodes([block, block.aboveSafe(), block.belowSafe()].filter(block => block !== undefined))
})

world.afterEvents.playerBreakBlock.subscribe(event => {
    const block = event.block

    updatePathNodes(
        [block, block.aboveSafe(), block.belowSafe()].filter(
            block => block !== undefined
        )
    )
})

world.afterEvents.explosion.subscribe(event => {
    const impactedBlocks = event.getImpactedBlocks()
    updatePathNodes(
        impactedBlocks.flatMap(block =>
            [block, block.aboveSafe(), block.belowSafe()].filter(
                block => block !== undefined
            )
        )
    )
})

function tickUpdateNodes() {
    system.runJob(updateNodesBlocks(tickUpdateNodes))
}

system.run(tickUpdateNodes)

function* updateNodesBlocks(callback: () => void) {
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
                const checkBlockStringLocation = vectorToString(checkBlock)
                const villageList = world.getVillages()
                for (let j = 0; j < villageList.length; j++) {
                    const village = villageList[j]
                    const alreadyCheckedLocations = new Set()
                    const villageBounds = village.bounds
                    village.removeNode(checkBlockStringLocation)
                    for (let k = 0; k < neighborList.length; k++) {
                        const neighborBlock = neighborList[k]
                        if (neighborBlock === undefined) {
                            continue
                        }
                        const neighborLocationString = vectorToString(neighborBlock)
                        if (!alreadyCheckedLocations.has(neighborLocationString)) {
                            alreadyCheckedLocations.add(neighborLocationString)
                            if (village.pathNodes[neighborLocationString] && neighborBlock.isValidPath(villageBounds)) {
                                system.runJob(village.searchBlocks(neighborBlock))
                            }
                        }
                    }
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

Block.prototype.isValidPath = function ( villageBounds?: VillageBounds) {
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

Block.prototype.canPathThrough = function () {
    return this.canWalkThrough() || Registry.doorTypes.includesFast(this.typeId)
}

Block.prototype.destroyableLeaf = function () {
    return (
        Registry.leafTypes.includesFast(this.typeId) && !this.permutation.getState("persistent_bit")
    )
}

const minecraftNonSolidBlocksSet = new Set(minecraftNonSolidBlocks)

Block.prototype.canWalkThrough = function () {
    return (
        (this.isAir || minecraftNonSolidBlocksSet.has(this.typeId) || this.destroyableLeaf()) && !this.isDangerous() && !this.isLiquid && !this.isWaterlogged
    )
}

Block.prototype.isDangerous = function () {
    return minecraftDangerousBlockTypes.includesFast(this.typeId)
}
