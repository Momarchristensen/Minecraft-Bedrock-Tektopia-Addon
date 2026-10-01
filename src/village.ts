import {
    Block,
    CommandPermissionLevel,
    CustomCommandParamType,
    CustomCommandStatus,
    Dimension,
    Player,
    system,
    type Vector3,
    World,
    world
} from "@minecraft/server"

import { Registry } from "./registry"

import {
    addVector,
    calculateDistance,
    ceilVector,
    centerVector,
    floorVector,
    isVectorBetween,
    maxVectors,
    minVectors,
    randomInt,
    randomItem,
    stringToVector,
    subtractVectors,
    vectorToString
} from "./utils"

import { minecraftDirtTypes } from "./variables"

import {
    type CompressedVillage,
    compressVillage,
    decompressVillage
} from "./village_serialization"

import type {
    PathNode,
    UndefinedRecord,
    VectorString,
    VillageBounds
} from "."

system.beforeEvents.startup.subscribe(event => {
    const customCommandRegistry = event.customCommandRegistry

    customCommandRegistry.registerCommand({
        name: "tektopia:scan",
        cheatsRequired: false,
        description: "Scan a block at a specified location",
        mandatoryParameters: [{ type: CustomCommandParamType.Location, name: "location" }],
        permissionLevel: CommandPermissionLevel.Admin
    }, (origin, blockLocation: Vector3) => {
        const player = origin.sourceEntity instanceof Player ? origin.sourceEntity : undefined

        if (player === undefined) {
            return {
                status: CustomCommandStatus.Failure,
                message: "This command can only be run by a player."
            }
        }

        const dimension = player.dimension

        const village = dimension.getVillage(blockLocation)

        if (village === undefined) {
            return {
                status: CustomCommandStatus.Failure,
                message: "No village was found at the specified location."
            }
        }

        system.runJob(village.scanLocation(blockLocation))

        return {
            status: CustomCommandStatus.Success,
            message: "Block scanned successfully."
        }
    })
})

export const VILLAGE_RADIUS = 100

export interface VillageSaveData {
    center: Vector3
    dimensionId: string
    doorLocation: Vector3
    pathNodes: UndefinedRecord<VectorString, PathNode>
    sugarCaneLocations: VectorString[]
    saplingLocations: VectorString[]
    farmLocations: VectorString[]
    cropLocations: VectorString[]
    treeLocations: VectorString[]
}

export class Village {
    private static cache = new WeakMap<VillageSaveData, Village>()

    readonly center: Vector3
    readonly centerString: string
    readonly bounds: VillageBounds

    searchingBlocks = false
    deletingInvalidNodes = false

    private constructor(readonly data: VillageSaveData) {
        this.center = data.center
        this.centerString = vectorToString(data.center)
        this.bounds = {
            start: { x: data.center.x - VILLAGE_RADIUS, y: -64, z: data.center.z - VILLAGE_RADIUS },
            end: { x: data.center.x + VILLAGE_RADIUS, y: 320, z: data.center.z + VILLAGE_RADIUS }
        }
    }

    static from(data: VillageSaveData): Village {
        let village = Village.cache.get(data)
        if (village === undefined) {
            village = new Village(data)
            Village.cache.set(data, village)
        }
        return village
    }

    static createData(center: Vector3, dimensionId: string, doorLocation: Vector3): VillageSaveData {
        return {
            center,
            dimensionId,
            doorLocation,
            pathNodes: {},
            sugarCaneLocations: [],
            saplingLocations: [],
            farmLocations: [],
            cropLocations: [],
            treeLocations: []
        }
    }

    static compress(data: VillageSaveData): CompressedVillage {
        return compressVillage(data)
    }

    static decompress(compressed: CompressedVillage): VillageSaveData {
        return decompressVillage(compressed)
    }

    get dimensionId() {
        return this.data.dimensionId
    }

    get doorLocation() {
        return this.data.doorLocation
    }

    get pathNodes() {
        return this.data.pathNodes
    }

    get sugarCaneLocations() {
        return this.data.sugarCaneLocations
    }

    get saplingLocations() {
        return this.data.saplingLocations
    }

    get farmLocations() {
        return this.data.farmLocations
    }

    get cropLocations() {
        return this.data.cropLocations
    }

    get treeLocations() {
        return this.data.treeLocations
    }

    get dimension(): Dimension {
        return world.getDimension(this.data.dimensionId)
    }

    get isValid() {
        return world.villageList.includes(this.data)
    }

    public link(aKey: VectorString, bKey: VectorString) {
        const village = this
        if (aKey === bKey) {
            return
        }
        const node1 = village.pathNodes[aKey]
        const node2 = village.pathNodes[bKey]
        if (node1 === undefined || node2 === undefined) {
            return
        }
        if (!node1.neighbors.includes(bKey)) {
            node1.neighbors.push(bKey)
        }
        if (!node2.neighbors.includes(aKey)) {
            node2.neighbors.push(aKey)
        }
    }

    public unlink(aKey: VectorString, bKey: VectorString) {
        const village = this
        const node1 = village.pathNodes[aKey]
        const node2 = village.pathNodes[bKey]
        if (node1 !== undefined) {
            node1.neighbors = node1.neighbors.filter(k => k !== bKey)
        }
        if (node2 !== undefined) {
            node2.neighbors = node2.neighbors.filter(k => k !== aKey)
        }
    }

    public removeNode(key: VectorString) {
        const village = this
        const node = village.pathNodes[key]
        if (node === undefined) {
            return
        }
        for (const neighborKey of [...node.neighbors]) {
            this.unlink(key, neighborKey)
        }
        delete village.pathNodes[key]
    }

    *searchBlocks(
        startingBlock: Block,
        overwrite = false,
        callback?: () => void
    ) {
        const village = this
        try {
            const checkBlockList = [startingBlock]
            if (!startingBlock.isValidPath(village.bounds)) {
                return
            }
            const startingBlockLocationString = vectorToString(startingBlock)
            const alreadyCheckedLocations = new Set([startingBlockLocationString])
            const villageBounds = village.bounds
            const dimension = world.getDimension(village.dimensionId)
            const pathCache = new Map<string, boolean>()
            while (checkBlockList.length > 0) {
                if (!village.isValid) {
                    return
                }
                const checkBlock = checkBlockList.shift()
                if (!checkBlock?.isValid) {
                    continue
                }

                const key = vectorToString(checkBlock)
                village.pathNodes[key] ??= { neighbors: [] }
                const node = village.pathNodes[key]

                const requirement = checkBlock.getNodeRequirement()
                if (requirement !== undefined) {
                    node.requirement = requirement
                }
                else {
                    delete node.requirement
                }

                const before = new Set(node.neighbors)
                const after = new Set<string>()

                const checkBlockNeighbors = checkBlock.getNodeNeighbors()
                for (const block of checkBlockNeighbors) {
                    const blockString = vectorToString(block)
                    let isValid = pathCache.get(blockString)
                    if (isValid === undefined) {
                        isValid = block.isValidPath(villageBounds)
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
                        if (neighbor?.isValidPath(villageBounds)) {
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

    *scanLocation(location: Vector3) {
        const flooredLocation = floorVector(location)
        const village = this
        const dimension = world.getDimension(village.dimensionId)
        const locationStringList = [vectorToString(flooredLocation)]
        const alreadyCheckedLocations = new Set()
        while (locationStringList.length > 0) {
            const locationString = locationStringList.pop()
            if (alreadyCheckedLocations.has(locationString) || locationString === undefined) {
                continue
            }
            alreadyCheckedLocations.add(locationString)
            const node = village.pathNodes[locationString]
            const currentLocation = stringToVector(locationString)
            const block = dimension.getBlockSafe(currentLocation)

            if (block === undefined || node === undefined) {
                continue
            }
            dimension.spawnParticle("minecraft:basic_flame_particle", centerVector(block.location))
            try {
                const checkBlockList = [
                    block,
                    block.northSafe(),
                    block.eastSafe(),
                    block.southSafe(),
                    block.westSafe(),
                    block.belowSafe()
                ]
                for (const checkBlock of checkBlockList) {
                    if (checkBlock === undefined) {
                        continue
                    }
                    let checkNearbyNodes = false
                    const checkBlockString = vectorToString(checkBlock)
                    if (checkBlock.isFarm) {
                        checkNearbyNodes = true
                        if (!village.farmLocations.includes(checkBlockString)) {
                            village.farmLocations.push(checkBlockString)
                        }
                    }
                    else if (checkBlock.typeId === "minecraft:reeds") {
                        checkNearbyNodes = true
                        if (!village.sugarCaneLocations.includes(checkBlockString)) {
                            village.sugarCaneLocations.push(checkBlockString)
                        }
                    }
                    else if (Registry.saplingTypes.includesFast(checkBlock.typeId)) {
                        checkNearbyNodes = true
                        if (!village.saplingLocations.includes(checkBlockString)) {
                            village.saplingLocations.push(checkBlockString)
                        }
                    }
                    else if (checkBlock.isTree) {
                        checkNearbyNodes = true
                        if (!village.treeLocations.includes(checkBlockString)) {
                            village.treeLocations.push(checkBlockString)
                        }
                    }
                    if (checkNearbyNodes) {
                        locationStringList.push(...node.neighbors)
                    }
                }
            }
            catch { }

            yield
        }
    }

    checkNodeValidity(pathNodeLocation: VectorString) {
        const village = this
        const dimension = world.getDimension(village.dimensionId)
        const block = dimension.getBlockSafe(stringToVector(pathNodeLocation))
        const pathNode = village.pathNodes[pathNodeLocation]
        if (block === undefined || pathNode === undefined) {
            return
        }

        if (!block.isValidPath(village.bounds)) {
            village.removeNode(pathNodeLocation)
            return
        }

        for (const neighborKey of [...pathNode.neighbors]) {
            const neighborBlock = dimension.getBlockSafe(stringToVector(neighborKey))
            if (neighborBlock !== undefined && !isValidConnection(block, neighborBlock)) {
                village.unlink(pathNodeLocation, neighborKey)
                //console.warn("Node Deleted: ", pathNodeLocation)
            }
        }
    }

}

export interface VillageExtraData {
    searchingBlocks: boolean
    deletingInvalidNodes?: boolean
}

World.prototype.getVillages = function () {
    return this.villageList.map(data => Village.from(data))
}

Block.prototype.getNodeRequirement = function () {
    const block = this
    const below = block.belowSafe()
    const above = block.aboveSafe()

    if (below?.destroyableLeaf()) {
        return { whiteList: false, types: ["tektopia:lumberjack"] }
    }

    if (Registry.leafTypes.includesFast(block.typeId) || (above !== undefined && Registry.leafTypes.includesFast(above.typeId))) {
        return { whiteList: true, types: ["tektopia:lumberjack"] }
    }

    return undefined
}

Object.defineProperty(Block.prototype, "isTree", {
    get(this: Block) {
        const block = this
        const aboveBlock = block.aboveSafe()
        if (!Registry.logTypes.includesFast(block.typeId)) {
            return false
        }
        if (aboveBlock?.typeId !== block.typeId) {
            return false
        }
        const aboveAboveBlock = aboveBlock.aboveSafe()
        if (aboveAboveBlock?.typeId !== block.typeId) {
            return false
        }
        const belowBlock = block.belowSafe()
        if (belowBlock === undefined || !minecraftDirtTypes.includesFast(belowBlock.typeId)) {
            return false
        }
        return true
    }
})

Object.defineProperty(Block.prototype, "isFarm", {
    get(this: Block) {
        const block = this
        const blockAbove = block.aboveSafe()
        if (blockAbove === undefined) {
            return false
        }
        const blockAboveAbove = blockAbove.aboveSafe()
        if (blockAboveAbove === undefined) {
            return false
        }
        return block.typeId === "minecraft:farmland" && blockAbove.isAir && blockAboveAbove.isAir
    }
})

function tickScanVillage() {
    system.runJob(scanVillageBlocks(tickScanVillage))
}

system.run(tickScanVillage)

function* scanVillageBlocks(callback?: () => void) {
    try {
        if (!world.loadedData) {
            return
        }
        const villageList = world.getVillages()
        for (const village of villageList) {
            const randomLocationString = randomItem(Object.keys(village.pathNodes) as VectorString[])
            if (randomLocationString === undefined) {
                continue
            }

            const randomLocation = stringToVector(randomLocationString)

            yield* village.scanLocation(randomLocation)
        }
    }
    finally {
        if (callback !== undefined) {
            callback()
        }
    }
}

function* pruneLocations(dimension: Dimension, locations: VectorString[], shouldRemove: (block: Block, locationString: VectorString) => boolean) {
    for (let i = locations.length - 1; i >= 0; i--) {
        if (i >= locations.length) {
            i = locations.length
            continue
        }

        const locationString = locations[i]
        const block = dimension.getBlockSafe(stringToVector(locationString))

        if (block !== undefined && shouldRemove(block, locationString)) {
            locations[i] = locations[locations.length - 1]
            locations.pop()
        }
        yield
    }
}

function tickUpdateVillage() {
    system.runJob(updateVillageBlocks(tickUpdateVillage))
}

system.run(tickUpdateVillage)

function* updateVillageBlocks(callback?: () => void) {
    try {
        if (!world.loadedData) {
            return
        }
        const villageList = world.getVillages()
        for (const village of villageList) {
            if (!village.isValid) {
                continue
            }
            const dimension = world.getDimension(village.dimensionId)

            yield* pruneLocations(dimension, village.saplingLocations, (block, locationString) => {
                if (Registry.logTypes.includesFast(block.typeId)) {
                    if (!village.treeLocations.includes(locationString)) {
                        village.treeLocations.push(locationString)
                    }
                    return true
                }
                return !Registry.saplingTypes.includesFast(block.typeId)
            })

            yield* pruneLocations(dimension, village.farmLocations, block => !block.isFarm)
            yield
        }
    }
    finally {
        if (callback !== undefined) {
            callback()
        }
    }
}

system.runInterval(() => {
    if (!world.loadedData) {
        return
    }
    const villageList = world.getVillages()
    for (const village of villageList) {

        const dimension = world.getDimension(village.dimensionId)
        if (!village.searchingBlocks) {
            const doorBlock = dimension.getBlockSafe(village.doorLocation)
            if (doorBlock !== undefined) {
                village.searchingBlocks = true
                system.runJob(
                    village.searchBlocks(doorBlock, true, () => {
                        village.searchingBlocks = false
                    })
                )
            }
        }

        if (!village.deletingInvalidNodes) {
            village.deletingInvalidNodes = true
            system.runJob(deleteInvalidPathNodes())

            function* deleteInvalidPathNodes() {
                const allVillagePathNodes = Object.keys(village.pathNodes) as VectorString[]
                try {
                    for (const pathNodeLocation of allVillagePathNodes) {
                        if (!village.isValid) {
                            return
                        }
                        village.checkNodeValidity(pathNodeLocation)
                        yield
                    }
                }
                finally {
                    village.deletingInvalidNodes = false
                }
            }
        }
    }
}, 100)

function getBoundaryLocations(vector1: Vector3, vector2: Vector3, ignoreY = false) {
    const minV = floorVector(minVectors(vector1, vector2))
    const maxV = ceilVector(maxVectors(vector1, vector2))

    const { x: minX, y: minY, z: minZ } = minV
    const { x: maxX, y: maxY, z: maxZ } = maxV

    const boundary = []
    if (ignoreY) {
        const y = minY
        for (let x = minX; x <= maxX; x++) {
            boundary.push({ x, y, z: minZ })
            if (minZ !== maxZ) {
                boundary.push({ x, y, z: maxZ })
            }
        }
        for (let z = minZ + 1; z < maxZ; z++) {
            boundary.push({ x: minX, y, z })
            if (minX !== maxX) {
                boundary.push({ x: maxX, y, z })
            }
        }
    }
    else {
        for (let x = minX; x <= maxX; x++) {
            for (let z = minZ; z <= maxZ; z++) {
                boundary.push({ x, y: minY, z })
                if (minY !== maxY) {
                    boundary.push({ x, y: maxY, z })
                }
            }
        }
        for (let y = minY + 1; y < maxY; y++) {
            boundary.push({ x: minX, y, z: minZ })
            if (minZ !== maxZ) {
                boundary.push({ x: minX, y, z: maxZ })
            }
            if (minX !== maxX) {
                boundary.push({ x: maxX, y, z: minZ })
                if (minZ !== maxZ) {
                    boundary.push({ x: maxX, y, z: maxZ })
                }
            }
        }
    }
    return boundary
}

system.runInterval(() => { //not debug
    if (!world.loadedData) {
        return
    }

    const players = world.getAllPlayers()
    for (const player of players) {
        const playerLocation = player.location

        const villageList = world.getVillages()
        for (const village of villageList) {
            const boundaryLocationList = getBoundaryLocations(
                village.bounds.start,
                village.bounds.end,
                true
            )

            for (const location of boundaryLocationList) {
                location.y = playerLocation.y
                if (calculateDistance(location, playerLocation) < 20) {
                    try {
                        player.spawnParticle(
                            "minecraft:rising_border_dust_particle",
                            addVector(location, "y", randomInt(-10, 10))
                        )
                    }
                    catch { }
                }
            }
        }
    }
}, 20)

function isValidConnection(currentBlock: Block, neighborBlock: Block) {
    function checkValidConnection(block1: Block, block2: Block) {
        const offset = subtractVectors(block2, block1)
        if (offset.y === 1) {
            const aboveAbove = block1.aboveSafe()?.aboveSafe()
            if (!aboveAbove?.canWalkThrough()) {
                return false
            }
        }
        if (offset.x !== 0 && offset.z !== 0) {
            const block2Above = block2.aboveSafe()
            if (block2Above === undefined || !block2.canWalkThrough() || !block2Above.canWalkThrough()) {
                return false
            }
            const dirX = offset.x === 1 ? "eastSafe" : "westSafe"
            const dirZ = offset.z === 1 ? "southSafe" : "northSafe"
            const checkBlockX = block1[dirX]()
            if (checkBlockX !== undefined && (!checkBlockX.canWalkThrough() || !checkBlockX.aboveSafe()?.canWalkThrough() || !checkBlockX.isValidPath())) {
                return false
            }
            const checkBlockZ = block1[dirZ]()
            if (checkBlockZ !== undefined && (!checkBlockZ.canWalkThrough() || !checkBlockZ.aboveSafe()?.canWalkThrough() || !checkBlockZ.isValidPath())) {
                return false
            }
        }
        return true
    }

    return checkValidConnection(currentBlock, neighborBlock) && checkValidConnection(neighborBlock, currentBlock)
}

Dimension.prototype.getVillage = function (location) {
    const villages = world.getVillages()
    for (const village of villages) {
        if (isVectorBetween(location, village.bounds.start, village.bounds.end, true) && this === village.dimension) {
            return village
        }
    }
    return undefined
}
