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

import { LocationList } from "./location_list"

import { PathGraph } from "./path_graph"

import { Registry } from "./registry"

import {
    Structure,
    type StructureType,
    type StructureTypeMap,
    type StructureData
} from "./structure"

import {
    centerVector,
    floorVector,
    isVectorBetween,
    randomInt,
    randomItem,
    stringToLocation,
    subtractVectors,
    locationToString,
    addVector
} from "./utils"

import {
    minecraftDirtTypes,
    pathBlockCosts,
    tillBlocks
} from "./variables"

import {
    type CompressedVillage,
    compressVillage,
    decompressVillage
} from "./village_serialization"

import type {
    NodeRequirement,
    PathNode,
    LocationString,
    Bounds
} from "./minecraft_extensions"

import type { Villager } from "./villager"

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
    pathNodes: Record<LocationString, PathNode>
    sugarCaneLocations: LocationString[]
    saplingLocations: LocationString[]
    farmLocations: LocationString[]
    harvestLocations: LocationString[]
    plantLocations: Record<LocationString, string>
    tillLocations: LocationString[]
    sweetBerryLocations: LocationString[]
    treeLocations: LocationString[]
    structures: Record<LocationString, StructureData>
}

export interface StructureFilter<K extends StructureType = StructureType> {
    includedTypes?: readonly K[]
    excludedTypes?: readonly StructureType[]
}

export interface VillageRanchEntity {
    typeId: string
    location: Vector3
    inPen: boolean
    structure: LocationString | undefined
    breedable: boolean
    villagerEntity: boolean
    isShearable: boolean
}

export class Village {
    private static cache = new WeakMap<VillageSaveData, Village>()
    private pathGraph?: PathGraph

    readonly center: Vector3
    readonly centerString: string
    readonly bounds: Bounds
    ranchEntities: Record<string, VillageRanchEntity> = {}
    penTiles = new Map<LocationString, LocationString>()
    penCache = new Map<LocationString, { floor: Vector3[], fence: Vector3[] }>()

    readonly sugarCaneLocations: LocationList
    readonly saplingLocations: LocationList
    readonly farmLocations: LocationList
    readonly harvestLocations: LocationList
    readonly tillLocations: LocationList
    readonly sweetBerryLocations: LocationList
    readonly treeLocations: LocationList

    searchingBlocks = false
    deletingInvalidNodes = false

    private constructor(readonly data: VillageSaveData) {
        this.center = data.center
        this.centerString = locationToString(data.center)
        this.bounds = {
            start: { x: data.center.x - VILLAGE_RADIUS, y: -64, z: data.center.z - VILLAGE_RADIUS },
            end: { x: data.center.x + VILLAGE_RADIUS, y: 320, z: data.center.z + VILLAGE_RADIUS }
        }

        this.sugarCaneLocations = new LocationList(data.sugarCaneLocations)
        this.saplingLocations = new LocationList(data.saplingLocations)
        this.farmLocations = new LocationList(data.farmLocations)
        this.harvestLocations = new LocationList(data.harvestLocations)
        this.tillLocations = new LocationList(data.tillLocations)
        this.sweetBerryLocations = new LocationList(data.sweetBerryLocations)
        this.treeLocations = new LocationList(data.treeLocations)
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
            plantLocations: {},
            tillLocations: [],
            sweetBerryLocations: [],
            treeLocations: [],
            structures: {}
        }
    }

    static compress(data: VillageSaveData): CompressedVillage {
        return compressVillage(data)
    }

    static decompress(compressed: CompressedVillage): VillageSaveData {
        return decompressVillage(compressed)
    }

    get graph() {
        this.pathGraph ??= new PathGraph(this.data.pathNodes, this.center)
        return this.pathGraph
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

    get plantLocations() {
        return this.data.plantLocations
    }

    getStructure(location: Vector3) {
        const locationString = locationToString(location)
        const data = this.data.structures[locationString]
        return data !== undefined ? Structure.from(locationString, data, this.dimension, this) : undefined
    }

    addStructure(location: Vector3, structureData: StructureData) {
        const locationString = locationToString(location)
        this.data.structures[locationString] = structureData
    }

    removeStructure(locationString: LocationString) {
        delete this.data.structures[locationString]
    }

    getStructures(): Structure[] {
        const resultList: Structure[] = []

        for (const [locationString, structureData] of Object.entries(this.data.structures)) {
            resultList.push(Structure.from(locationString as LocationString, structureData, this.dimension, this))
        }

        return resultList
    }

    matchesFilter(structureData: StructureData | undefined, filter: StructureFilter): boolean {
        if (structureData === undefined) {
            return false
        }

        const { type } = structureData

        if (filter.includedTypes !== undefined && !filter.includedTypes.includes(type)) {
            return false
        }

        if (filter.excludedTypes?.includes(type)) {
            return false
        }

        return true
    }

    findStructures<K extends StructureType = StructureType>(
        filter: StructureFilter<K>
    ): Array<StructureTypeMap[K]> {
        const resultList: Array<StructureTypeMap[K]> = []

        for (const [locationString, structureData] of Object.entries(this.data.structures)) {
            if (!this.matchesFilter(structureData, filter)) {
                continue
            }

            const structure = Structure.from(locationString as LocationString, structureData, this.dimension, this)
            resultList.push(structure as StructureTypeMap[K])
        }

        return resultList
    }

    get dimension(): Dimension {
        return world.getDimension(this.data.dimensionId)
    }

    get isValid() {
        return world.villageList.includes(this.data)
    }

    getVillagers(): Villager[] {
        const dimensionId = this.data.dimensionId
        return world.getVillagers().filter(villager => {
            return villager.dimension.id === dimensionId && this.isInBounds(villager.location)
        })
    }

    public link(aKey: LocationString, bKey: LocationString) {
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

        this.pathGraph?.refreshNode(aKey)
        this.pathGraph?.refreshNode(bKey)
        this.pathGraph?.addEdge(aKey, bKey, node1.nodeRequirements?.[bKey])
        this.pathGraph?.addEdge(bKey, aKey, node2.nodeRequirements?.[aKey])
    }

    public setConnectionRequirement(fromKey: LocationString, toKey: LocationString, requirement: NodeRequirement | undefined) {
        const node = this.pathNodes[fromKey]
        if (node === undefined) {
            return
        }
        if (requirement === undefined) {
            if (node.nodeRequirements !== undefined) {
                delete node.nodeRequirements[toKey]
                if (Object.keys(node.nodeRequirements).length === 0) {
                    delete node.nodeRequirements
                }
            }
        }
        else {
            node.nodeRequirements ??= {}
            node.nodeRequirements[toKey] = requirement
        }

        if (node.neighbors.includes(toKey)) {
            this.pathGraph?.addEdge(fromKey, toKey, requirement)
        }
    }

    public unlink(aKey: LocationString, bKey: LocationString) {
        const village = this
        const node1 = village.pathNodes[aKey]
        const node2 = village.pathNodes[bKey]
        if (node1 !== undefined) {
            node1.neighbors = node1.neighbors.filter(k => k !== bKey)
            village.setConnectionRequirement(aKey, bKey, undefined)
        }
        if (node2 !== undefined) {
            node2.neighbors = node2.neighbors.filter(k => k !== aKey)
            village.setConnectionRequirement(bKey, aKey, undefined)
        }

        this.pathGraph?.removeEdge(aKey, bKey)
        this.pathGraph?.removeEdge(bKey, aKey)
    }

    public removeNode(key: LocationString) {
        const village = this
        const node = village.pathNodes[key]
        if (node === undefined) {
            return
        }
        for (const neighborKey of [...node.neighbors]) {
            this.unlink(key, neighborKey)
        }
        delete village.pathNodes[key]

        this.pathGraph?.removeNode(key)
    }

    isInBounds(location: Vector3) {
        return isVectorBetween(location, this.bounds.start, this.bounds.end, true)
    }

    *searchBlocks(
        startingBlock: Block | Block[],
        overwrite = false,
        callback?: () => void
    ) {
        const village = this
        try {
            const villageBounds = village.bounds
            const dimension = world.getDimension(village.dimensionId)
            const pathCache = new Map<string, boolean>()
            const checkBlockList: Block[] = []
            const alreadyCheckedLocations = new Set<string>()

            for (const seedBlock of Array.isArray(startingBlock) ? startingBlock : [startingBlock]) {
                const seedString = locationToString(seedBlock)
                if (alreadyCheckedLocations.has(seedString) || !seedBlock.isValidPath(villageBounds)) {
                    continue
                }
                alreadyCheckedLocations.add(seedString)
                pathCache.set(seedString, true)
                checkBlockList.push(seedBlock)
            }
            while (checkBlockList.length > 0) {
                if (!village.isValid) {
                    return
                }
                const checkBlock = checkBlockList.shift()
                if (!checkBlock?.isValid) {
                    continue
                }

                if (debugFlags.searchBlocksParticles) {
                    dimension.spawnParticle(
                        "minecraft:heart_particle",
                        centerVector(checkBlock.location)
                    )
                }

                const key = locationToString(checkBlock)
                village.pathNodes[key] ??= { neighbors: [] }
                const node = village.pathNodes[key]

                const pathCost = checkBlock.getPathCost()
                if (pathCost !== 0) {
                    node.cost = pathCost
                }

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
                    const blockString = locationToString(block)
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
                    village.setConnectionRequirement(key, blockString, checkBlock.getConnectionRequirement(block))
                    village.setConnectionRequirement(blockString, key, block.getConnectionRequirement(checkBlock))

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
                        const neighbor = dimension.getBlockSafe(stringToLocation(oldKey))
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

    *scanLocation(location: Vector3, flood = true) {
        const flooredLocation = floorVector(location)
        const village = this
        if (!village.isInBounds(location)) {
            return
        }
        const dimension = world.getDimension(village.dimensionId)
        const locationStringList = [locationToString(flooredLocation)]
        const alreadyCheckedLocations = new Set()
        while (locationStringList.length > 0) {
            const locationString = locationStringList.pop()
            if (alreadyCheckedLocations.has(locationString) || locationString === undefined) {
                continue
            }
            alreadyCheckedLocations.add(locationString)
            let node = village.pathNodes[locationString]
            const currentLocation = stringToLocation(locationString)
            const block = dimension.getBlockSafe(currentLocation)

            if (block === undefined) {
                continue
            }

            if (debugFlags.locationScanParticles) {
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
                    const checkBlockString = locationToString(checkBlock)
                    if (checkBlock.isFarm) {
                        checkNearbyNodes = true
                        village.farmLocations.add(checkBlockString)

                        const aboveCheckBlock = checkBlock.aboveSafe()

                        if (aboveCheckBlock !== undefined) {
                            node = village.pathNodes[locationToString(aboveCheckBlock)]
                        }
                    }
                    else if (checkBlock.isValidSugarCane) {
                        checkNearbyNodes = true
                        village.sugarCaneLocations.add(checkBlockString)
                    }
                    else if (Registry.saplingTypes.includesFast(checkBlock.typeId)) {
                        checkNearbyNodes = true
                        village.saplingLocations.add(checkBlockString)
                    }
                    else if (checkBlock.isTree) {
                        checkNearbyNodes = true
                        village.treeLocations.add(checkBlockString)
                    }
                    else if (checkBlock.typeId === "minecraft:sweet_berry_bush") {
                        checkNearbyNodes = true
                        village.sweetBerryLocations.add(checkBlockString)
                    }
                    else if (checkBlock.isHarvestableGourd) {
                        checkNearbyNodes = true
                        village.harvestLocations.add(checkBlockString)
                    }

                    if (flood && checkNearbyNodes && node !== undefined) {
                        locationStringList.push(...node.neighbors)
                    }
                }
            }
            catch { }

            yield
        }
    }

    checkNodeValidity(pathNodeLocation: LocationString) {
        const village = this
        const dimension = world.getDimension(village.dimensionId)
        const block = dimension.getBlockSafe(stringToLocation(pathNodeLocation))
        const pathNode = village.pathNodes[pathNodeLocation]
        if (block === undefined || pathNode === undefined) {
            return
        }

        if (!block.isValidPath(village.bounds)) {
            village.removeNode(pathNodeLocation)
            return
        }

        for (const neighborKey of [...pathNode.neighbors]) {
            const neighborBlock = dimension.getBlockSafe(stringToLocation(neighborKey))
            if (neighborBlock === undefined) {
                continue
            }
            if (!isValidConnection(block, neighborBlock)) {
                village.unlink(pathNodeLocation, neighborKey)
                if (debugFlags.nodeUpdatedWarnings) {
                    console.warn("Node connection deleted: ", pathNodeLocation, neighborKey)
                }
                continue
            }
            const connectionRequirement = block.getConnectionRequirement(neighborBlock)
            if (!requirementsEqual(pathNode.nodeRequirements?.[neighborKey], connectionRequirement)) {
                village.setConnectionRequirement(pathNodeLocation, neighborKey, connectionRequirement)
                if (debugFlags.nodeUpdatedWarnings) {
                    console.warn("Node connection requirement updated: ", pathNodeLocation, neighborKey)
                }
            }
        }

        const requirement = block.getNodeRequirement()
        if (!requirementsEqual(pathNode.requirement, requirement)) {
            if (requirement !== undefined) {
                pathNode.requirement = requirement
            }
            else {
                delete pathNode.requirement
            }
            if (debugFlags.nodeUpdatedWarnings) {
                console.warn("Node requirement updated: ", pathNodeLocation)
            }
        }

        const nodeCost = block.getPathCost()
        if ((pathNode.cost ?? 0) !== nodeCost) {
            if (nodeCost !== 0) {
                pathNode.cost = nodeCost
            }
            else {
                delete pathNode.cost
            }

            if (debugFlags.nodeUpdatedWarnings) {
                console.warn("Node cost updated: ", pathNodeLocation)
            }
        }
    }

}

Block.prototype.getPathCost = function () {
    const feetCost = pathBlockCosts.get(this.typeId) ?? 0
    const below = this.belowSafe()
    const floorCost = below === undefined ? 0 : pathBlockCosts.get(below.typeId) ?? 0
    return feetCost + floorCost
}

Block.prototype.getVillage = function () {
    return this.dimension.getVillage(this.location)
}

function requirementsEqual(node1: NodeRequirement | undefined, node2: NodeRequirement | undefined) {
    if (node1 === undefined || node2 === undefined) {
        return node1 === node2
    }
    if (node1.whiteList !== node2.whiteList || node1.types.length !== node2.types.length) {
        return false
    }
    const sortedA = node1.types.slice().sort()
    const sortedB = node2.types.slice().sort()
    return sortedA.every((type, index) => type === sortedB[index])
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

    if (Registry.gateTypes.includes(block.typeId)) {
        return { whiteList: true, types: ["tektopia:rancher"] }
    }

    return undefined
}

Block.prototype.getConnectionRequirement = function (neighbor: Block) {
    if (this.location.y === neighbor.location.y) {
        return undefined
    }
    const ownCeiling = this.aboveSafe()?.aboveSafe()
    const neighborCeiling = neighbor.aboveSafe()?.aboveSafe()
    if (ownCeiling?.destroyableLeaf() === true || neighborCeiling?.destroyableLeaf() === true) {
        return { whiteList: true, types: ["tektopia:lumberjack"] }
    }
    return undefined
}

Object.defineProperty(Block.prototype, "tillResult", {
    get(this: Block) {
        return tillBlocks[this.typeId]
    }
})

Object.defineProperty(Block.prototype, "isTillable", {
    get(this: Block) {
        const blockAbove = this.aboveSafe()
        return this.tillResult !== undefined && blockAbove?.canPathThrough()
    }
})

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

Object.defineProperty(Block.prototype, "isValidSugarCane", {
    get(this: Block) {
        const belowBlock = this.belowSafe()
        return belowBlock !== undefined && belowBlock.isSolid && this.typeId === "minecraft:reeds"
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

Object.defineProperty(Block.prototype, "isHarvestableGourd", {
    get(this: Block) {
        return ["minecraft:pumpkin", "minecraft:melon_block"].includes(this.typeId)
    }
})

Object.defineProperty(Block.prototype, "isCrop", {
    get(this: Block) {
        return ["minecraft:wheat", "minecraft:carrots", "minecraft:potatoes", "minecraft:beetroot"].includes(this.typeId)
    }
})

Object.defineProperty(Block.prototype, "isHarvestableCrop", {
    get(this: Block) {
        const blockGrowth = this.permutation.getState("growth")

        return blockGrowth === 7 && this.isCrop
    }
})

Object.defineProperty(Block.prototype, "isHarvestableSweetBerryBush", {
    get(this: Block) {
        const blockGrowth = this.permutation.getState("growth")

        return blockGrowth === 3 && this.typeId === "minecraft:sweet_berry_bush"
    }
})

Object.defineProperty(Block.prototype, "isHarvestable", {
    get(this: Block) {
        return this.isHarvestableGourd ||
            this.isHarvestableCrop ||
            this.isHarvestableSweetBerryBush ||
            this.isHarvestableSugarCane
    }
})

Object.defineProperty(Block.prototype, "plantableType", {
    get(this: Block) {
        const neighborBlocks = [
            this.northSafe(),
            this.eastSafe(),
            this.southSafe(),
            this.westSafe()
        ]

        const seedCounts: Record<string, number> = {}

        for (const neighborBlock of neighborBlocks) {
            if (neighborBlock === undefined) {
                continue
            }

            const belowBlock = neighborBlock.belowSafe()

            if (belowBlock === undefined) {
                continue
            }

            if (!belowBlock.isFarm) {
                continue
            }

            if (neighborBlock.isCrop) {
                seedCounts[neighborBlock.typeId] = (seedCounts[neighborBlock.typeId] ?? 0) + 1
            }
        }

        const highestCount = Math.max(...Object.values(seedCounts), 0)

        const highestSeedCounts = Object.entries(seedCounts)
            .filter(([, count]) => count === highestCount)
            .map(([key]) => key)

        return highestSeedCounts
    }
})

Object.defineProperty(Block.prototype, "isPlantable", {
    get(this: Block) {
        return this.plantableType.length > 0
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
            const randomLocationString = randomItem(Object.keys(village.pathNodes) as LocationString[])
            if (randomLocationString === undefined) {
                continue
            }

            const randomLocation = stringToLocation(randomLocationString)

            yield* village.scanLocation(randomLocation)
        }
    }
    finally {
        if (callback !== undefined) {
            callback()
        }
    }
}

function* pruneLocations(dimension: Dimension, locations: LocationList, shouldRemove: (block: Block, locationString: LocationString) => boolean) {
    for (let i = locations.length - 1; i >= 0; i--) {
        if (i >= locations.length) {
            i = locations.length
            continue
        }

        const locationString = locations.at(i)
        const location = locations.locationAt(i)
        if (locationString === undefined || location === undefined) {
            yield
            continue
        }

        const block = dimension.getBlockSafe(location)

        if (block !== undefined && shouldRemove(block, locationString)) {
            locations.removeAt(i)
        }
        yield
    }
}

function* pruneLocationRecord<T>(dimension: Dimension, locations: Record<LocationString, T>, shouldRemove: (block: Block, locationString: LocationString) => boolean) {
    for (const locationString of Object.keys(locations) as LocationString[]) {
        const block = dimension.getBlockSafe(stringToLocation(locationString))

        if (block !== undefined && shouldRemove(block, locationString)) {
            delete locations[locationString]
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
                    village.treeLocations.add(locationString)
                    return true
                }
                return !Registry.saplingTypes.includesFast(block.typeId)
            })

            yield* pruneLocations(dimension, village.farmLocations, block => {
                const aboveBlock = block.aboveSafe()
                if (aboveBlock?.isHarvestableCrop) {
                    const aboveLocationString = locationToString(aboveBlock.location)
                    village.harvestLocations.add(aboveLocationString)
                }

                if (aboveBlock !== undefined) {
                    const gourdBlocks = [
                        aboveBlock.northSafe(),
                        aboveBlock.eastSafe(),
                        aboveBlock.southSafe(),
                        aboveBlock.westSafe()
                    ]

                    for (const gourdBlock of gourdBlocks) {
                        if (gourdBlock?.isHarvestableGourd) {
                            const gourdLocationString = locationToString(gourdBlock.location)
                            village.harvestLocations.add(gourdLocationString)
                        }
                    }
                }

                if (aboveBlock?.isCrop) {
                    const neighboringFarms = [
                        block.northSafe(),
                        block.eastSafe(),
                        block.southSafe(),
                        block.westSafe()
                    ]

                    for (const neighborBlock of neighboringFarms) {
                        if (neighborBlock === undefined) {
                            continue
                        }

                        if (!neighborBlock.isFarm) {
                            continue
                        }

                        const plantBlock = neighborBlock.aboveSafe()
                        if (!plantBlock?.isAir) {
                            continue
                        }
                        const plantLocationString = locationToString(plantBlock.location)

                        village.plantLocations[plantLocationString] ??= aboveBlock.typeId
                    }
                }

                for (let x = -1; x <= 1; x += 2) {
                    for (let z = -1; z <= 1; z += 2) {
                        const neighborBlock = block.offsetSafe({ x, y: 0, z })
                        if (neighborBlock === undefined) {
                            continue
                        }

                        const neighborLocationString = locationToString(neighborBlock.location)
                        if (!village.farmLocations.has(neighborLocationString)) {
                            continue
                        }

                        const newTillBlocks = [
                            block.offsetSafe({ x, y: 0, z: 0 }),
                            block.offsetSafe({ x: 0, y: 0, z })
                        ]

                        for (const newTillBlock of newTillBlocks) {
                            if (newTillBlock === undefined) {
                                continue
                            }

                            if (!newTillBlock.isTillable) {
                                continue
                            }

                            const tillLocationString = locationToString(newTillBlock.location)
                            village.tillLocations.add(tillLocationString)
                        }
                    }
                }

                return !block.isFarm
            })

            yield* pruneLocations(dimension, village.sugarCaneLocations, (block, locationString) => {
                if (block.isHarvestableSugarCane) {
                    village.harvestLocations.add(locationString)
                }

                return block.typeId !== "minecraft:reeds"
            })

            yield* pruneLocations(dimension, village.sweetBerryLocations, (block, locationString) => {
                if (block.isHarvestableSweetBerryBush) {
                    village.harvestLocations.add(locationString)
                }

                return block.typeId !== "minecraft:sweet_berry_bush"
            })

            yield* pruneLocations(dimension, village.harvestLocations, block => !block.isHarvestable)

            yield* pruneLocations(dimension, village.tillLocations, block => !block.isTillable)

            yield* pruneLocationRecord(dimension, village.plantLocations, block => !block.isAir)

            yield* pruneLocations(dimension, village.treeLocations, block => !block.isTree)

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
            system.runJob(checkVillagePathNodes())

            function* checkVillagePathNodes() {
                const allVillagePathNodes = Object.keys(village.pathNodes) as LocationString[]
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

    const rancherEntities = world.getEntities().filter(entity => ["minecraft:pig", "minecraft:sheep", "minecraft:cow", "minecraft:chicken"].includes(entity.typeId))

    const villages = world.getVillages()
    for (const village of villages) {
        village.ranchEntities = {}
        village.penTiles = new Map()
        const pens = village.findStructures({ includedTypes: ["pig_pen", "cow_pen", "chicken_coop", "sheep_pen"] })
        if (pens.length === 0) {
            continue
        }

        const penFloors = pens.map(pen => {
            // A failed scan (unloaded chunk, etc.) must not wipe the pen, or every animal in it
            // would read as "outside" for that tick. Fall back to the last good scan.
            const scanned = pen.scanLocations()
            const previous = village.penCache.get(pen.locationString)
            const floor = scanned.floor ?? previous?.floor ?? []
            const fence = scanned.fence ?? previous?.fence ?? []
            village.penCache.set(pen.locationString, { floor, fence })
            const locations = floor.concat(fence)
            if (debugFlags.rancherPenParticles) {
                for (const location of locations) {
                    village.dimension.spawnParticle("minecraft:heart_particle", centerVector(location))
                }
            }
            // Columns rather than exact tiles, so an animal that hops or flutters above its tile
            // is still inside the pen.
            const columns = new Map<string, number[]>()
            for (const location of locations) {
                village.penTiles.set(locationToString(location), pen.locationString)
                const key = `${location.x},${location.z}`
                const ys = columns.get(key)
                if (ys === undefined) {
                    columns.set(key, [location.y])
                }
                else {
                    ys.push(location.y)
                }
            }
            return { pen, columns }
        })

        for (const rancherEntity of rancherEntities) {
            const rancherEntityLocation = rancherEntity.location
            if (rancherEntity.dimension.id !== village.dimensionId) {
                continue
            }

            if (!village.isInBounds(rancherEntityLocation)) {
                continue
            }

            const columnKey = `${Math.floor(rancherEntityLocation.x)},${Math.floor(rancherEntityLocation.z)}`
            let matchedPen: LocationString | undefined
            let fallbackPen: LocationString | undefined
            for (const { pen, columns } of penFloors) {
                const ys = columns.get(columnKey)
                if (!ys?.some(y => rancherEntityLocation.y >= y - 0.5 && rancherEntityLocation.y < y + 3)) {
                    continue
                }
                if (pen.getAnimalTypeId() === rancherEntity.typeId) {
                    matchedPen = pen.locationString
                    break
                }
                fallbackPen ??= pen.locationString
            }

            const structure = matchedPen ?? fallbackPen

            if (structure === undefined) {
                const entityTile = locationToString(floorVector(addVector(rancherEntityLocation, "y", 0.01)))
                if (village.pathNodes[entityTile] === undefined) {
                    continue
                }
            }

            const inPen = matchedPen !== undefined
            village.ranchEntities[rancherEntity.id] = {
                typeId: rancherEntity.typeId,
                location: rancherEntityLocation,
                inPen,
                structure,
                breedable: rancherEntity.breeding === undefined ? false : rancherEntity.breeding.canBreed,
                villagerEntity: rancherEntity.villagerEntity ?? false,
                isShearable: rancherEntity.isShearable
            }

            if (debugFlags.rancherDebugNameTags) {
                rancherEntity.nameTag = [
                    `Ranch entity: ${rancherEntity.typeId}`,
                    `In pen: ${inPen ? "Yes" : "No"}`,
                    `Structure: ${structure ?? "None"}`,
                    `Breeding: ${rancherEntity.breeding?.time ?? "none"}-${rancherEntity.breeding?.cooldown ?? "none"}`,
                    `Villager Entity: ${rancherEntity.villagerEntity ?? false}`
                ].join("\n")
            }
            else if (rancherEntity.nameTag !== "") {
                rancherEntity.nameTag = ""
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
        if (this.id === village.dimensionId && village.isInBounds(location)) {
            return village
        }
    }
    return undefined
}
