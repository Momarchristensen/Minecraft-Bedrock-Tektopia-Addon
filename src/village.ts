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

import { debugFlags } from "./debug"

import { Registry } from "./registry"

import {
    centerVector,
    floorVector,
    isVectorBetween,
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
            message: "Scan started."
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
    harvestLocations: VectorString[]
    sweetBerryLocations: VectorString[]
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
            harvestLocations: [],
            sweetBerryLocations: [],
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
        return this.dimension.id
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

    get harvestLocations() {
        return this.data.harvestLocations
    }

    get sweetBerryLocations() {
        return this.data.sweetBerryLocations
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

            if (debugFlags.scanParticles) {
                try {
                    dimension.spawnParticle("minecraft:basic_flame_particle", centerVector(block.location))
                }
                catch { }
            }

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
                    else if (checkBlock.typeId === "minecraft:sweet_berry_bush") {
                        checkNearbyNodes = true
                        if (!village.sweetBerryLocations.includes(checkBlockString)) {
                            village.sweetBerryLocations.push(checkBlockString)
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
                if (debugFlags.nodeDeletionWarnings) {
                    console.warn("Node connection deleted: ", pathNodeLocation, neighborKey)
                }
            }
        }
    }

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
        return this.typeId === "minecraft:farmland"
    }
})

Object.defineProperty(Block.prototype, "isHarvestableSugarCane", {
    get(this: Block) {
        let validSugarCane = true
        const sugarCaneBlocks = [this, this.aboveSafe(), this.aboveSafe(2)]

        for (const block of sugarCaneBlocks) {
            if (block?.typeId !== "minecraft:reeds") {
                validSugarCane = false
                break
            }
        }

        if (validSugarCane) {
            return true
        }

        return false
    }
})

Object.defineProperty(Block.prototype, "isHarvestable", {
    get(this: Block) {
        if (["minecraft:pumpkin", "minecraft:melon_block"].includes(this.typeId)) {
            return true
        }

        const blockGrowth = this.permutation.getState("growth")

        if (blockGrowth === 7 && ["minecraft:wheat", "minecraft:carrots", "minecraft:potatoes", "minecraft:beetroot"].includes(this.typeId)) {
            return true
        }

        if (blockGrowth === 3 && this.typeId === "minecraft:sweet_berry_bush") {
            return true
        }

        if (this.isHarvestableSugarCane) {
            return true
        }

        return false
    }
})

function tickScanVillage() {
    system.runJob(scanVillageBlocks(() => system.runTimeout(tickScanVillage, 20)))
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
    system.runJob(updateVillageBlocks(() => system.runTimeout(tickUpdateVillage, 20)))
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

            yield* pruneLocations(dimension, village.farmLocations, block => {
                const aboveBlock = block.aboveSafe()
                if (aboveBlock?.isHarvestable) {
                    const aboveLocationString = vectorToString(aboveBlock.location)
                    if (!village.harvestLocations.includes(aboveLocationString)) {
                        village.harvestLocations.push(aboveLocationString)
                    }
                }
                return !block.isFarm
            })

            yield* pruneLocations(dimension, village.sugarCaneLocations, (block, locationString) => {
                if (block.isHarvestableSugarCane) {
                    if (!village.harvestLocations.includes(locationString)) {
                        village.harvestLocations.push(locationString)
                    }
                }

                return block.typeId !== "minecraft:reeds"
            })

            yield* pruneLocations(dimension, village.sweetBerryLocations, (block, locationString) => {
                if (block.isHarvestable) {
                    if (!village.harvestLocations.includes(locationString)) {
                        village.harvestLocations.push(locationString)
                    }
                }

                return block.typeId !== "minecraft:sweet_berry_bush"
            })

            yield* pruneLocations(dimension, village.harvestLocations, block => !block.isHarvestable)

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
                        while (village.searchingBlocks) {
                            yield
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

const BORDER_PARTICLE_RANGE = 20
const BORDER_PARTICLE_ID = "minecraft:rising_border_dust_particle"

Player.prototype.spawnBorderParticles = function (bounds) { //not debug
    const player = this

    const range = BORDER_PARTICLE_RANGE
    const { x: px, y: py, z: pz } = player.location

    const minX = Math.floor(bounds.start.x)
    const maxX = Math.ceil(bounds.end.x)
    const minZ = Math.floor(bounds.start.z)
    const maxZ = Math.ceil(bounds.end.z)

    if (px < minX - range || px > maxX + range || pz < minZ - range || pz > maxZ + range) {
        return
    }

    const emit = (x: number, z: number) => {
        player.spawnParticle(BORDER_PARTICLE_ID, { x, y: py + randomInt(-10, 10), z })
    }

    for (const edgeZ of [minZ, maxZ]) {
        const dz = pz - edgeZ
        if (Math.abs(dz) >= range) {
            continue
        }
        const half = Math.sqrt((range * range) - (dz * dz))
        const from = Math.max(minX, Math.ceil(px - half))
        const to = Math.min(maxX, Math.floor(px + half))
        for (let x = from; x <= to; x++) {
            emit(x, edgeZ)
        }
    }

    for (const edgeX of [minX, maxX]) {
        const dx = px - edgeX
        if (Math.abs(dx) >= range) {
            continue
        }
        const half = Math.sqrt((range * range) - (dx * dx))
        const from = Math.max(minZ + 1, Math.ceil(pz - half))
        const to = Math.min(maxZ - 1, Math.floor(pz + half))
        for (let z = from; z <= to; z++) {
            emit(edgeX, z)
        }
    }
}

system.runInterval(() => {
    if (!world.loadedData) {
        return
    }

    const villageList = world.getVillages()
    if (villageList.length === 0) {
        return
    }

    for (const player of world.getAllPlayers()) {
        const dimensionId = player.dimension.id
        for (const village of villageList) {
            if (village.dimensionId !== dimensionId) {
                continue
            }
            try {
                player.spawnBorderParticles(village.bounds)
            }
            catch { }
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
            if (checkBlockX === undefined || (!checkBlockX.canWalkThrough() || !checkBlockX.aboveSafe()?.canWalkThrough() || !checkBlockX.isValidPath())) {
                return false
            }
            const checkBlockZ = block1[dirZ]()
            if (checkBlockZ === undefined || (!checkBlockZ.canWalkThrough() || !checkBlockZ.aboveSafe()?.canWalkThrough() || !checkBlockZ.isValidPath())) {
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
        if (isVectorBetween(location, village.bounds.start, village.bounds.end, true) && this.id === village.dimensionId) {
            return village
        }
    }
    return undefined
}
