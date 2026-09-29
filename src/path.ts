import {
    Block,
    GameMode,
    Player,
    system,
    Vector3,
    world
} from "@minecraft/server"

import {
    addVectors,
    calculateDistance,
    calculateSquareDistance,
    centerVector,
    floorVector,
    isVectorBetween,
    multiplyVector,
    stringToVector,
    subtractVectors,
    vectorToString
} from "./utils"

import { Villager } from "./villager"

import {
    CheckEntityData,
    NodeRequirement,
    PathNode,
    VillageBounds
} from "."

import {
    pathCancelEntityTypes,
    pathIgnoreEntityTypes
} from "./variables"

import { Village } from "./village"

import { Registry } from "./registry"


type PathResult = "no_path" | "no_village" | "timeout" | "cancelled" | "error" | Vector3[]


export function generatePath(entity: Villager, startLocation: Vector3, targetLocation: Vector3, token: { cancelled: boolean }) {
    return new Promise<PathResult>((resolve) => {
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
        if (endBlock !== undefined && !isValidPath(endBlock, villageBounds)) {
            const checkBlocks = [
                endBlock.northSafe(),
                endBlock.eastSafe(),
                endBlock.southSafe(),
                endBlock.westSafe()
            ]
            for (let i = 0; i < checkBlocks.length; i++) {
                const block = checkBlocks[i]
                if (block !== undefined && isValidPath(block, villageBounds)) {
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
            isBlocked: checkEntity instanceof Villager && (checkEntity.isBlocked || !checkEntity.isPathing)
        })
    }
    return result
}

let pathCheckEntities: Record<string, CheckEntityData[]> = {}


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
    private heap: { element: T; priority: number }[] = []

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


world.afterEvents.playerInteractWithBlock.subscribe((event) => {
    const block = event.block

    updatePathNodes(
        [block, block.aboveSafe(), block.belowSafe()].filter(
            (block) => block !== undefined
        )
    )
})


world.afterEvents.playerPlaceBlock.subscribe((event) => {
    const block = event.block

    updatePathNodes([block, block.aboveSafe(), block.belowSafe()].filter((block) => block !== undefined))
})



world.afterEvents.playerBreakBlock.subscribe((event) => {
    const block = event.block

    updatePathNodes(
        [block, block.aboveSafe(), block.belowSafe()].filter(
            (block) => block !== undefined
        )
    )
})

world.afterEvents.explosion.subscribe((event) => {
    const impactedBlocks = event.getImpactedBlocks()
    updatePathNodes(
        impactedBlocks.flatMap((block) =>
            [block, block.aboveSafe(), block.belowSafe()].filter(
                (block) => block !== undefined
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
                const neighborList = getNodeNeighbors(checkBlock)
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
                            if (
                                village.pathNodes[neighborLocationString] && isValidPath(neighborBlock, villageBounds)
                            ) {
                                system.runJob(searchBlocks(village, neighborBlock))
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


export function checkNodeValidity(village: Village, pathNodeLocation: string) {
    const dimension = world.getDimension(village.dimensionId)
    const block = dimension.getBlockSafe(stringToVector(pathNodeLocation))
    const pathNode = village.pathNodes[pathNodeLocation]
    if (!block || !pathNode) {
        return
    }

    if (!isValidPath(block, village.bounds)) {
        village.removeNode(pathNodeLocation)
        return
    }

    for (const neighborKey of [...pathNode.neighbors]) {
        const neighborBlock = dimension.getBlockSafe(stringToVector(neighborKey))
        if (neighborBlock && !isValidConnection(block, neighborBlock)) {
            village.unlink(pathNodeLocation, neighborKey)
            console.warn("Node Deleted: ", pathNodeLocation)
        }
    }
}


function isValidConnection(currentBlock: Block, neighborBlock: Block) {
    function checkValidConnection(block1: Block, block2: Block) {
        const offset = subtractVectors(block2, block1)
        if (offset.y === 1) {
            const aboveAbove = block1.aboveSafe()?.aboveSafe()
            if (aboveAbove === undefined || !aboveAbove.canWalkThrough()) {
                return false
            }
        }
        if (offset.x !== 0 && offset.z !== 0) {
            const block2Above = block2.aboveSafe() //fix
            if (block2Above === undefined || !block2.canWalkThrough() || !block2Above.canWalkThrough()) {
                return false
            }
            const dirX = offset.x === 1 ? "eastSafe" : "westSafe"
            const dirZ = offset.z === 1 ? "southSafe" : "northSafe"
            const checkBlockX = block1[dirX]()
            if (
                checkBlockX && (!checkBlockX.canWalkThrough() || !checkBlockX.aboveSafe()?.canWalkThrough() || !isValidPath(checkBlockX))
            ) {
                return false
            }
            const checkBlockZ = block1[dirZ]()
            if (
                checkBlockZ && (!checkBlockZ.canWalkThrough() || !checkBlockZ.aboveSafe()?.canWalkThrough() || !isValidPath(checkBlockZ))
            ) {
                return false
            }
        }
        return true
    }
    return checkValidConnection(currentBlock, neighborBlock) && checkValidConnection(neighborBlock, currentBlock)
}

function isValidPath(block: Block, villageBounds?: VillageBounds) {
    const below = block.belowSafe()//fix
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


export function* searchBlocks(
    village: Village,
    startingBlock: Block,
    overwrite = false,
    callback?: () => void
) {
    try {
        const checkBlockList = [startingBlock]
        if (!isValidPath(startingBlock, village.bounds)) {
            return
        }
        const startingBlockLocationString = vectorToString(startingBlock)
        const alreadyCheckedLocations = new Set([startingBlockLocationString])
        const villageBounds = village.bounds
        const dimension = world.getDimension(village.dimensionId)
        const pathCache = new Map()
        while (checkBlockList.length > 0) {
            if (!village.isValid) {
                return
            }
            const checkBlock = checkBlockList.shift()
            if (checkBlock === undefined || !checkBlock.isValid) {
                continue
            }

            const key = vectorToString(checkBlock)
            village.pathNodes[key] ??= { neighbors: [] }
            const node = village.pathNodes[key]

            const requirement = getNodeRequirement(checkBlock)
            if (requirement) {
                node.requirement = requirement
            }
            else {
                delete node.requirement
            }

            const before = new Set(node.neighbors)
            const after = new Set<string>()

            for (const block of getNodeNeighbors(checkBlock)) {
                const blockString = vectorToString(block)
                let isValid = pathCache.get(blockString)
                if (isValid === undefined) {
                    isValid = isValidPath(block, villageBounds)
                    pathCache.set(blockString, isValid)
                }
                if (!isValid || !isValidConnection(checkBlock, block)) {
                    continue
                }

                after.add(blockString)

                const existed = village.pathNodes[blockString] !== undefined
                village.pathNodes[blockString] ??= { neighbors: [] }
                village.link(key, blockString)


                if (!alreadyCheckedLocations.has(blockString)) {
                    alreadyCheckedLocations.add(blockString)
                    if (overwrite || !existed) {
                        checkBlockList.push(block)
                    }
                }
            }

            for (const oldKey of before) {
                if (after.has(oldKey)) {
                    continue
                }
                village.unlink(key, oldKey)
                if (!overwrite && !alreadyCheckedLocations.has(oldKey)) {
                    const neighbor = dimension.getBlockSafe(stringToVector(oldKey))
                    if (neighbor && isValidPath(neighbor, villageBounds)) {
                        alreadyCheckedLocations.add(oldKey)
                        checkBlockList.push(neighbor)
                    }
                }
            }
            yield
        }
    }
    finally {
        if (callback !== undefined) {
            callback()
        }
    }
}

function getNodeRequirement(block: Block): NodeRequirement | undefined {
    const below = block.belowSafe()
    const above = block.aboveSafe()

    if (below?.destroyableLeaf()) {
        return { whiteList: false, types: ["tektopia:lumberjack"] }
    }

    if (Registry.leafTypes.includesFast(block.typeId) || above !== undefined && Registry.leafTypes.includesFast(above.typeId)) {
        return { whiteList: true, types: ["tektopia:lumberjack"] }
    }

    return undefined
}


function getNodeNeighbors(nodeBlock: Block) {
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

export function pathFindTo(villager: Villager, targetLocation: Vector3) {
    if (villager.isPathing) {
        return
    }

    const village = villager.getVillage()
    if (village === undefined) {
        return
    }

    villager.isPathing = true
    const token = { cancelled: false }
    let finished = false

    function cancelPath() {
        if (finished) {
            return
        }
        finished = true
        system.clearRun(timeoutId)
        token.cancelled = true
        villager.blockedTimer = 0
        villager.setAnimation(undefined)
        villager.isPathing = false
        if (villager.pathTickId !== undefined) {
            system.clearRun(villager.pathTickId)
        }
        villager.pathTickId = undefined
        villager.stopPath = () => { }
    }
    villager.stopPath = cancelPath

    const timeoutId = system.runTimeout(() => {
        if (!finished) {
            cancelPath()
        }
    }, 1200)

    try {
        let startLocation = floorVector(villager.location)

        if (village.pathNodes[vectorToString(startLocation)] === undefined) {
            const entityStandingOnBlocks = villager.getAllBlocksStandingOn()
            for (let i = 0; i < entityStandingOnBlocks.length; i++) {
                const blockAbove = entityStandingOnBlocks[i].aboveSafe()
                if (blockAbove === undefined) {
                    continue
                }
                const blockAboveLocationString = vectorToString(blockAbove)
                if (village.pathNodes[blockAboveLocationString]) {
                    startLocation = blockAbove.location
                    break
                }
            }
        }


        generatePath(villager, startLocation, targetLocation, token).then((result) => {
            if (finished) {
                return
            }
            if (typeof result === "string") {
                if (result !== "cancelled") {
                    villager.pathError = result
                }
                cancelPath()
                return
            }
            if (result.length === 0) {
                cancelPath()
                return
            }
            startFollowing(villager, result, targetLocation, cancelPath, () => finished)
        }).catch((error) => {
            console.warn("pathFindTo failed: ", error)
            cancelPath()
        })
    }
    catch (error) {
        console.warn("pathFindTo setup failed: ", error)
        cancelPath()
    }
}

function startFollowing(
    villager: Villager,
    pathNodeList: Vector3[],
    targetLocation: Vector3,
    cancelPath: () => void,
    isFinished: () => boolean
) {
    const village = villager.getVillage()
    if (village === undefined) {
        cancelPath()
        return
    }


    const dimension = villager.dimension
    const dimensionId = dimension.id
    const villageBounds = village.bounds

    function tickFollowPath() {
        if (isFinished()) {
            return
        }

        try {
            if (!villager.isValid || !villager.isPathing) {
                cancelPath()
                return
            }
            const targetBlock = dimension.getBlockSafe(targetLocation)
            if (targetBlock && !isValidPath(targetBlock, villageBounds) && calculateDistance(centerVector(targetLocation), villager.location) <= 1.25) {
                cancelPath()
                return
            }
            villager.pathTickId = system.run(tickFollowPath)
            if (pathNodeList.length === 0) {
                cancelPath()
                return
            }
            if (system.currentTick % 20 === 0) {
                pathNodeList.forEach((pathNode) => {
                    try {
                        dimension.spawnParticle(
                            "minecraft:villager_angry",
                            centerVector(pathNode)
                        )
                    }
                    catch { }
                })
            }
            const currentPathNode = centerVector(pathNodeList[0], true)
            const entityLocation = villager.location
            if (villager.isOnGround) {
                villager.lookAt(currentPathNode, true)
            }
            const direction = villager.getViewDirection()
            const speed = villager.isOnGround ? 0.2 : 0.015
            const moveVector = multiplyVector(direction, "xyz", speed)
            const checkEntityList = getCheckPathEntities(dimensionId, villager)
            const pathNodeBlock = dimension.getBlockSafe(currentPathNode)
            if (pathNodeBlock !== undefined) {
                if (!isValidPath(pathNodeBlock, villageBounds)) {
                    checkNodeValidity(village!, vectorToString(pathNodeBlock))
                    cancelPath()
                    return
                }
                const pathNodeBlockBelowTypeId = pathNodeBlock.belowSafe()?.typeId
                if (pathNodeBlockBelowTypeId !== undefined && (Registry.slabTypes.includesFast(pathNodeBlockBelowTypeId) || Registry.stairTypes.includesFast(pathNodeBlockBelowTypeId))) {
                    currentPathNode.y -= 0.5
                }
            }
            if (calculateDistance(currentPathNode, entityLocation) >= 2) {
                cancelPath()
                return
            }
            let isBlocked = false
            let blockedByTektopiaVillager = false
            for (let i = 0; i < checkEntityList.length; i++) {
                const checkEntity = checkEntityList[i]
                if (checkEntity.isBlocked === undefined || !checkEntity.isBlocked) {
                    const checkEntityLocation = checkEntity.location
                    const checkEntityIsTektopiaVillager = checkEntity.typeId.startsWith("tektopia:")
                    if (
                        calculateSquareDistance(checkEntityLocation, currentPathNode) < 1.75
                    ) {
                        if (checkEntity.cancelPath) {
                            cancelPath()
                            return
                        }
                        blockedByTektopiaVillager = checkEntityIsTektopiaVillager
                        isBlocked = true
                        break
                    }
                }
            }

            villager.unblockTimer ??= 0

            if (blockedByTektopiaVillager) {
                villager.unblockTimer = 20
            }
            else if (!isBlocked && villager.unblockTimer > 0) {
                villager.unblockTimer--
                isBlocked = true
            }

            villager.isBlocked = isBlocked

            const isMoving = villager.getMoveSpeed(true) > 0.0001
            if (!isMoving || isBlocked) {
                villager.blockedTimer = (villager.blockedTimer | 0) + 1
            }
            else {
                villager.blockedTimer = 0
            }
            if (isBlocked) {
                if (!isMoving) {
                    villager.setAnimation(undefined)
                }
            }
            else {
                villager.setAnimation("walking")
                if (villager.isOnGround) {
                    villager.applyKnockback(moveVector, 0)
                    if (currentPathNode.y - villager.location.y > 0.55) {
                        villager.applyImpulse({ x: 0, y: 0.44, z: 0 })
                    }
                }
                else {
                    villager.applyImpulse({ x: moveVector.x, y: 0, z: moveVector.z })
                }
            }
            if (villager.blockedTimer > 40) {
                cancelPath()
                return
            }
            if (calculateSquareDistance(currentPathNode, villager.location) <= 0.5) {
                pathNodeList.shift()
            }
        }
        catch (error) {
            console.warn("Path follow failed: ", error)
            cancelPath()
        }
    }
    villager.pathTickId = system.run(tickFollowPath)
}