import {
    Block,
    CommandPermissionLevel,
    CustomCommandParamType,
    CustomCommandStatus,
    Dimension,
    Player,
    system,
    type Entity,
    type Vector3,
    World,
    world
} from "@minecraft/server"

import { tillBlocks } from "./big_variables"

import { getRanchAnimals } from "./breed"

import { debugFlags } from "./debug_flags"

import { LocationList } from "./location_list"

import { PathGraph } from "./path_graph"

import { Registry } from "./registry"

import {
    Structure,
    type FloorClaims,
    type StructureType,
    type StructureTypeMap,
    type StructureData
} from "./structure"

import { getTrunkBlocks } from "./tree"

import {
    calculateDistance,
    centerVector,
    floorVector,
    isVectorBetween,
    randomItem,
    stringToLocation,
    subtractVectors,
    locationToString,
    addVector
} from "./utils"

import {
    type CompressedVillage,
    type VillageSaveData,
    compressVillage,
    decompressVillage
} from "./village_serialization"

import { VillageStorage } from "./village_storage"

import type {
    NodeRequirement,
    LocationString,
    Bounds,
    VillageRanchEntity
} from "./types"

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

export interface StructureFilter<K extends StructureType = StructureType> {
    includedTypes?: readonly K[]
    excludedTypes?: readonly StructureType[]
}

// Ores within one block of each other in any direction (faces, edges and corners) belong to the same vein
const ORE_NEIGHBOR_OFFSETS: Vector3[] = []

for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
            if ((x !== 0 || y !== 0 || z !== 0) && !(x !== 0 && y !== 0 && z !== 0)) {
                ORE_NEIGHBOR_OFFSETS.push({ x, y, z })
            }
        }
    }
}

const ORE_FACE_OFFSETS: Vector3[] = [
    { x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 }, { x: 0, y: -1, z: 0 },
    { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: -1 }
]

// Safety cap so one scan can never flood an entire ore-filled area in a single tick
const MAX_ORE_VEIN_SCAN = 2048

// How far (in blocks) from a path node a villager can mine an ore
const ORE_REACH = 2

export class Village {
    private static cache = new WeakMap<VillageSaveData, Village>()
    private pathGraph?: PathGraph

    readonly center: Vector3
    readonly centerString: string
    readonly bounds: Bounds
    ranchEntities: Record<string, VillageRanchEntity> = {}
    ranchVillagerEntitiesByStructure = new Map<LocationString, string[]>()
    penTiles = new Map<LocationString, LocationString>()
    // Which structure (by key) holds each floor location, and the reverse. In memory only: it fills back in as
    // structures scan, and the scan decides who wins when two structures want the same floor.
    private readonly floorOwners = new Map<LocationString, LocationString>()
    // The floor locations that are held as the owner's own room (first-claim-wins), as opposed to rooms the owner
    // only reached through a door
    private readonly ownRoomFloors = new Set<LocationString>()
    private readonly floorsByStructure = new Map<LocationString, Set<LocationString>>()
    penCache = new Map<LocationString, { floor: Vector3[], fence: Vector3[], gates: Vector3[] }>()

    readonly sugarCaneLocations: LocationList
    readonly saplingLocations: LocationList
    readonly farmLocations: LocationList
    readonly harvestLocations: LocationList
    readonly growLocations: LocationList
    readonly tillLocations: LocationList
    readonly sweetBerryLocations: LocationList
    readonly treeLocations: LocationList
    readonly oreLocations: LocationList
    readonly storage: VillageStorage

    searchingBlocks = false
    deletingInvalidNodes = false
    // The full path-graph scan and node sweep only start again once these ticks have passed (see the interval near checkVillagePathNodes)
    nextFullScanTick = 0
    nextNodeSweepTick = 0

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
        this.growLocations = new LocationList(data.growLocations)
        this.tillLocations = new LocationList(data.tillLocations)
        this.sweetBerryLocations = new LocationList(data.sweetBerryLocations)
        this.treeLocations = new LocationList(data.treeLocations)
        this.oreLocations = new LocationList(data.oreLocations)
        this.storage = new VillageStorage(this)
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
            growLocations: [],
            plantLocations: {},
            tillLocations: [],
            sweetBerryLocations: [],
            treeLocations: [],
            oreLocations: [],
            structures: {}
        }
    }

    static compress(data: VillageSaveData): Generator<void, CompressedVillage, void> {
        return compressVillage(data)
    }

    static decompress(compressed: unknown): VillageSaveData | undefined {
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

    /**
     * Every fence gate of a pen, the pen's own gate included. Ranches can have more than one gate.
     */
    getPenGates(penKey: LocationString): Vector3[] {
        const gates = this.penCache.get(penKey)?.gates ?? []
        const primary = stringToLocation(penKey)
        const primaryKey = locationToString(primary)
        if (gates.some(gate => locationToString(gate) === primaryKey)) {
            return gates
        }
        return [primary, ...gates]
    }

    addStructure(location: Vector3, structureData: StructureData) {
        const locationString = locationToString(location)
        const existing = this.data.structures[locationString]
        // The same structure seen again keeps its data object: Structure instances (and the floor they cache) are
        // keyed by it. A different structure on the same key starts over, claims included.
        if (existing?.type === structureData.type && existing.rotation === structureData.rotation) {
            return
        }
        if (existing !== undefined) {
            this.releaseFloorClaims(locationString)
        }
        this.data.structures[locationString] = structureData
    }

    removeStructure(locationString: LocationString) {
        delete this.data.structures[locationString]
        this.releaseFloorClaims(locationString)
        this.storage.clearContainers(locationString)
    }

    getFloorClaims(selfKey: LocationString): FloorClaims {
        return {
            selfKey,
            getOwner: location => this.floorOwners.get(locationToString(location)),
            isOwnRoom: location => this.ownRoomFloors.has(locationToString(location))
        }
    }

    getClaimedFloorLocations(structureKey: LocationString): readonly LocationString[] {
        return [...this.floorsByStructure.get(structureKey) ?? []]
    }

    /**
     * Makes the locations the structure's floor. The first ownRoomFloorCount locations are the structure's own
     * room, which is first-claim-wins: if another structure already holds any of them as its own room nothing
     * changes and undefined is returned (the structure is invalid). Other locations are rooms past a door. They
     * only change hands when they are the claimant's own room, and are left alone when anyone else holds them.
     * A structure that loses locations drops them from its own floor right away.
     * Returns the locations the structure now holds.
     */
    claimFloor(
        structureKey: LocationString,
        floorLocations: readonly Vector3[],
        ownRoomFloorCount = floorLocations.length
    ): Set<LocationString> | undefined {
        for (let i = 0; i < floorLocations.length && i < ownRoomFloorCount; i++) {
            const floorLocation = floorLocations[i]
            if (floorLocation === undefined) {
                return undefined
            }
            const locationString = locationToString(floorLocation)
            const previousOwner = this.floorOwners.get(locationString)
            if (previousOwner !== undefined && previousOwner !== structureKey && this.ownRoomFloors.has(locationString)) {
                return undefined
            }
        }

        this.releaseFloorClaims(structureKey)

        const claimed = new Set<LocationString>()
        const lostByStructure = new Map<LocationString, Set<LocationString>>()
        for (const [index, location] of floorLocations.entries()) {
            const locationString = locationToString(location)
            const isOwnRoom = index < ownRoomFloorCount
            const previousOwner = this.floorOwners.get(locationString)
            if (previousOwner !== undefined) {
                if (!isOwnRoom) {
                    continue
                }
                this.floorsByStructure.get(previousOwner)?.delete(locationString)
                let lost = lostByStructure.get(previousOwner)
                if (lost === undefined) {
                    lost = new Set()
                    lostByStructure.set(previousOwner, lost)
                }
                lost.add(locationString)
            }
            this.floorOwners.set(locationString, structureKey)
            if (isOwnRoom) {
                this.ownRoomFloors.add(locationString)
            }
            else {
                this.ownRoomFloors.delete(locationString)
            }
            claimed.add(locationString)
        }
        this.floorsByStructure.set(structureKey, claimed)

        for (const [previousOwner, lost] of lostByStructure) {
            this.getStructure(stringToLocation(previousOwner))?.dropFloorLocations(lost)
        }
        if (lostByStructure.size > 0) {
            // Once the claims have settled, so a scan in progress isn't interrupted by the losers' own work
            system.run(() => {
                for (const previousOwner of lostByStructure.keys()) {
                    this.getStructure(stringToLocation(previousOwner))?.onFloorLost()
                }
            })
        }
        return claimed
    }

    releaseFloorClaims(structureKey: LocationString) {
        const claimed = this.floorsByStructure.get(structureKey)
        if (claimed === undefined) {
            return
        }
        for (const locationString of claimed) {
            if (this.floorOwners.get(locationString) === structureKey) {
                this.floorOwners.delete(locationString)
                this.ownRoomFloors.delete(locationString)
            }
        }
        this.floorsByStructure.delete(structureKey)
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

    getVillagers() {
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
            const checkBlockList: Array<Block | undefined> = []
            const alreadyCheckedLocations = new Set<string>()
            let checkBlockIndex = 0

            for (const seedBlock of Array.isArray(startingBlock) ? startingBlock : [startingBlock]) {
                const seedString = locationToString(seedBlock)
                if (alreadyCheckedLocations.has(seedString) || !seedBlock.isValidPath(villageBounds)) {
                    continue
                }
                alreadyCheckedLocations.add(seedString)
                pathCache.set(seedString, true)
                checkBlockList.push(seedBlock)
            }
            while (checkBlockIndex < checkBlockList.length) {
                // village.isValid scans the village list, so it is only checked every 32 blocks
                if ((checkBlockIndex & 31) === 0 && !village.isValid) {
                    return
                }
                const checkBlock = checkBlockList[checkBlockIndex]
                checkBlockList[checkBlockIndex] = undefined
                checkBlockIndex++
                if (checkBlock === undefined) {
                    continue
                }

                // Blocks queued on an earlier tick can become invalid (chunk unloaded), and the first native read then throws.
                // isValid is a native call per block, so it is only checked after something threw instead of before every block.
                try {
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
                }
                catch (error) {
                    if (checkBlock.isValid) {
                        throw error
                    }
                    continue
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

    private isOreExposed(dimension: Dimension, location: Vector3): boolean {
        for (const offset of ORE_FACE_OFFSETS) {
            const block = dimension.getBlockSafe({
                x: location.x + offset.x,
                y: location.y + offset.y,
                z: location.z + offset.z
            })
            if (block !== undefined && !block.getIsSolid()) {
                return true
            }
        }
        return false
    }

    scanOreVein(dimension: Dimension, origin: Vector3) {
        const start = floorVector(origin)
        const visited = new Set<LocationString>([locationToString(start)])
        const queue: Vector3[] = [start]
        const ores: LocationString[] = []

        for (let head = 0; head < queue.length && visited.size < MAX_ORE_VEIN_SCAN; head++) {
            const current = queue[head]
            if (current === undefined) {
                continue
            }

            for (const offset of ORE_NEIGHBOR_OFFSETS) {
                const neighborLocation = {
                    x: current.x + offset.x,
                    y: current.y + offset.y,
                    z: current.z + offset.z
                }
                const neighborKey = locationToString(neighborLocation)
                if (visited.has(neighborKey) || !this.isInBounds(neighborLocation)) {
                    continue
                }
                visited.add(neighborKey)

                const neighborBlock = dimension.getBlockSafe(neighborLocation)
                if (!neighborBlock?.isOre) {
                    continue
                }

                // Buried ores are skipped until something next to them is mined away
                if (!this.isOreExposed(dimension, neighborLocation)) {
                    continue
                }

                this.oreLocations.add(neighborKey)
                ores.push(neighborKey)
                queue.push(neighborLocation)
            }
        }

        return ores
    }

    getOreVein(start: LocationString) {
        if (!this.oreLocations.has(start)) {
            return []
        }

        const ores = [start]
        const found = new Set<LocationString>(ores)
        for (const currentKey of ores) {
            const current = stringToLocation(currentKey)
            for (const offset of ORE_NEIGHBOR_OFFSETS) {
                const neighborKey = locationToString({
                    x: current.x + offset.x,
                    y: current.y + offset.y,
                    z: current.z + offset.z
                })
                if (!found.has(neighborKey) && this.oreLocations.has(neighborKey)) {
                    found.add(neighborKey)
                    ores.push(neighborKey)
                }
            }
        }
        return ores
    }

    /**
     * Finds the path node a villager can stand on to mine the ore at the given location.
     * The villager can reach ORE_REACH blocks, so ores deeper in a vein can be mined from the tunnel.
     */
    findOreStandLocation(oreLocation: Vector3): Vector3 | undefined {
        const oreCenter = { x: oreLocation.x + 0.5, y: oreLocation.y + 0.5, z: oreLocation.z + 0.5 }
        let best: Vector3 | undefined
        let bestDistance = Infinity

        for (let dx = -ORE_REACH; dx <= ORE_REACH; dx++) {
            for (let dz = -ORE_REACH; dz <= ORE_REACH; dz++) {
                for (let dy = -ORE_REACH - 1; dy <= 1; dy++) {
                    // Never stand on top of the ore being mined
                    if (dx === 0 && dz === 0 && dy === 1) {
                        continue
                    }

                    const stand = { x: oreLocation.x + dx, y: oreLocation.y + dy, z: oreLocation.z + dz }
                    // Compare against the villager's eye position, not their feet
                    const distance = calculateDistance({ x: stand.x + 0.5, y: stand.y + 1.5, z: stand.z + 0.5 }, oreCenter)
                    if (distance > ORE_REACH + 0.5 || distance >= bestDistance) {
                        continue
                    }

                    if (this.pathNodes[locationToString(stand)] === undefined) {
                        continue
                    }

                    best = stand
                    bestDistance = distance
                }
            }
        }

        return best
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
                    else if (checkBlock.isTree(true)) {
                        checkNearbyNodes = true
                        addTreeLocation(village, checkBlock)
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

        const isValidPath = block.isValidPath(village.bounds)
        if (debugFlags.pathNodeValidationParticles) {
            try {
                dimension.spawnParticle(
                    "minecraft:mobflame_single",
                    addVector(centerVector(block.location, true), "y", 0.01)
                )
            }
            catch { }
        }

        if (!isValidPath) {
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
    const feetCost = Registry.pathBlockCosts.get(this.typeId) ?? 0
    const below = this.belowSafe()
    const floorCost = below === undefined ? 0 : Registry.pathBlockCosts.get(below.typeId) ?? 0
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
        return { whiteList: false, types: ["tektopia:villager_lumberjack"] }
    }

    if (Registry.leafTypes.includesFast(block.typeId) || (above !== undefined && Registry.leafTypes.includesFast(above.typeId))) {
        return { whiteList: true, types: ["tektopia:villager_lumberjack"] }
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
        return { whiteList: true, types: ["tektopia:villager_lumberjack"] }
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

Object.defineProperty(Block.prototype, "isOre", {
    get(this: Block) {
        return Registry.oreTypes.includesFast(this.typeId)
    }
})

Object.defineProperty(Block.prototype, "isValidSugarCane", {
    get(this: Block) {
        const belowBlock = this.belowSafe()
        return belowBlock?.getIsSolid() && this.typeId === "minecraft:reeds"
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
        return this.isHarvestableGourd
            || this.isHarvestableCrop
            || this.isHarvestableSweetBerryBush
            || this.isHarvestableSugarCane
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

function addTreeLocation(village: Village, block: Block) {
    const [origin, ...otherTrunks] = getTrunkBlocks(block)
    for (const trunk of otherTrunks) {
        village.treeLocations.remove(locationToString(trunk.location))
    }
    village.treeLocations.add(locationToString(origin.location))
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

            yield* pruneLocations(dimension, village.saplingLocations, (block, _) => {
                if (Registry.logTypes.includesFast(block.typeId)) {
                    addTreeLocation(village, block)
                    return true
                }
                return !Registry.saplingTypes.includesFast(block.typeId)
            })

            yield* pruneLocations(dimension, village.farmLocations, block => {
                const aboveBlock = block.aboveSafe()

                if (aboveBlock !== undefined) {
                    const aboveBlockIsHarvestableCrop = aboveBlock.isHarvestableCrop
                    const aboveLocationString = locationToString(aboveBlock.location)

                    if (aboveBlockIsHarvestableCrop) {
                        village.harvestLocations.add(aboveLocationString)
                    }

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

                    if (aboveBlock.isCrop) {
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

                        if (!aboveBlockIsHarvestableCrop) {
                            village.growLocations.add(aboveLocationString)
                        }
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
                else {
                    village.growLocations.add(locationString)
                }

                return block.typeId !== "minecraft:reeds"
            })

            yield* pruneLocations(dimension, village.sweetBerryLocations, (block, locationString) => {
                if (block.isHarvestableSweetBerryBush) {
                    village.harvestLocations.add(locationString)
                }
                else {
                    village.growLocations.add(locationString)
                }

                return block.typeId !== "minecraft:sweet_berry_bush"
            })

            yield* pruneLocations(dimension, village.harvestLocations, block => !block.isHarvestable)

            yield* pruneLocations(dimension, village.tillLocations, block => !block.isTillable)

            yield* pruneLocationRecord(dimension, village.plantLocations, block => !block.isAir)

            yield* pruneLocations(dimension, village.treeLocations, block => !block.isTree())

            yield* pruneLocations(dimension, village.oreLocations, block => !block.isOre)

            yield* pruneLocations(dimension, village.growLocations, block => block.isAir || block.isHarvestable)

            yield
        }
    }
    finally {
        if (callback !== undefined) {
            callback()
        }
    }
}

let ranchRefreshRunning = false

// The full path-graph scan and the node sweep used to restart right after they finished, so they ran all the time. Player edits
// and explosions already update the graph immediately (updateNodesBlocks in path.ts); these two passes are the safety net for
// everything else. After a pass the village now idles for at least the minimum, and for FACTOR times as long as the pass took,
// which caps their share of the server's time. Raise the minimums or the factors to save more, lower them to notice changes sooner.
const FULL_SCAN_MIN_COOLDOWN_TICKS = 1200
const FULL_SCAN_IDLE_FACTOR = 4
const NODE_SWEEP_MIN_COOLDOWN_TICKS = 400
const NODE_SWEEP_IDLE_FACTOR = 2

system.runInterval(() => {
    if (!world.loadedData) {
        return
    }

    const villageList = world.getVillages()
    for (const village of villageList) {

        const dimension = world.getDimension(village.dimensionId)
        if (!village.searchingBlocks && system.currentTick >= village.nextFullScanTick) {
            const doorBlock = dimension.getBlockSafe(village.doorLocation)
            if (doorBlock !== undefined) {
                village.searchingBlocks = true
                const scanStartTick = system.currentTick
                system.runJob(
                    village.searchBlocks(doorBlock, true, () => {
                        village.searchingBlocks = false
                        const took = system.currentTick - scanStartTick
                        village.nextFullScanTick = system.currentTick + Math.max(FULL_SCAN_MIN_COOLDOWN_TICKS, took * FULL_SCAN_IDLE_FACTOR)
                    })
                )
            }
        }

        if (!village.deletingInvalidNodes && system.currentTick >= village.nextNodeSweepTick) {
            village.deletingInvalidNodes = true
            const sweepStartTick = system.currentTick
            system.runJob(checkVillagePathNodes())

            function* checkVillagePathNodes() {
                const allVillagePathNodes = Object.keys(village.pathNodes) as LocationString[]
                let checkedNodes = 0
                try {
                    for (const pathNodeLocation of allVillagePathNodes) {
                        // isValid scans the village list, so it is only checked every 32 nodes
                        if ((checkedNodes++ & 31) === 0 && !village.isValid) {
                            return
                        }
                        // Must not wait for searchingBlocks: the full scan restarts every interval right after it finishes,
                        // so it is almost always running and waiting for it starves this sweep. The two don't conflict: both
                        // judge nodes by the current block state, and checkNodeValidity skips nodes that no longer exist.
                        village.checkNodeValidity(pathNodeLocation)
                        yield
                    }
                }
                finally {
                    village.deletingInvalidNodes = false
                    const took = system.currentTick - sweepStartTick
                    village.nextNodeSweepTick = system.currentTick + Math.max(NODE_SWEEP_MIN_COOLDOWN_TICKS, took * NODE_SWEEP_IDLE_FACTOR)
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
        player.spawnParticle(BORDER_PARTICLE_ID, { x, y: py + ((Math.random() * 20) - 10), z })
    }

    // Spawns about one particle per block of visible border, at random positions along it instead of on whole block coordinates
    const emitAlong = (from: number, to: number, emitAt: (position: number) => void) => {
        const length = to - from
        if (length <= 0) {
            return
        }
        const count = Math.floor(length) + (Math.random() < length % 1 ? 1 : 0)
        for (let i = 0; i < count; i++) {
            emitAt(from + (Math.random() * length))
        }
    }

    for (const edgeZ of [minZ, maxZ]) {
        const dz = pz - edgeZ
        if (Math.abs(dz) >= range) {
            continue
        }
        const half = Math.sqrt((range * range) - (dz * dz))
        emitAlong(Math.max(minX, px - half), Math.min(maxX, px + half), x => emit(x, edgeZ))
    }

    for (const edgeX of [minX, maxX]) {
        const dx = px - edgeX
        if (Math.abs(dx) >= range) {
            continue
        }
        const half = Math.sqrt((range * range) - (dx * dx))
        emitAlong(Math.max(minZ, pz - half), Math.min(maxZ, pz + half), z => emit(edgeX, z))
    }
}

const WIREFRAME_PROPERTY = "tektopia:show_wireframe"

// Entities each player currently has the wireframe override applied to, so it can be cleared again
const wireframeOverrides = new Map<string, Set<string>>()

function clearWireframeOverride(player: Player, entityId: string) {
    const entity = world.getEntity(entityId)
    // An unloaded or removed entity takes its overrides with it
    if (entity?.isValid === true) {
        player.removePropertyOverrideForEntity(entity, WIREFRAME_PROPERTY)
    }
}

function getWireframeEntityIds(player: Player) {
    const wanted = new Set<string>()
    const village = player.dimension.getVillage(player.location)
    if (village === undefined) {
        return wanted
    }

    const tile = locationToString(floorVector(addVector(player.location, "y", 0.1)))
    const playerPen = village.penTiles.get(tile)
    if (playerPen === undefined) {
        return wanted
    }

    for (const entityId of village.ranchVillagerEntitiesByStructure.get(playerPen) ?? []) {
        if (village.ranchEntities[entityId] !== undefined) {
            wanted.add(entityId)
        }
    }
    return wanted
}

system.runInterval(() => {
    if (!world.loadedData) {
        return
    }

    for (const player of world.getAllPlayers()) {
        const applied = wireframeOverrides.get(player.id)
        const wanted = getWireframeEntityIds(player)

        if (applied !== undefined) {
            for (const entityId of applied) {
                if (!wanted.has(entityId)) {
                    clearWireframeOverride(player, entityId)
                    applied.delete(entityId)
                }
            }
        }

        if (wanted.size === 0) {
            wireframeOverrides.delete(player.id)
            continue
        }

        const current = applied ?? new Set<string>()
        for (const entityId of wanted) {
            const entity = world.getEntity(entityId)
            if (entity?.isValid !== true) {
                current.delete(entityId)
                continue
            }

            player.setPropertyOverrideForEntity(entity, WIREFRAME_PROPERTY, true)
            current.add(entityId)
        }
        wireframeOverrides.set(player.id, current)
    }
}, 10)

world.afterEvents.playerLeave.subscribe(event => {
    wireframeOverrides.delete(event.playerId)
})

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

    if (!ranchRefreshRunning) {
        ranchRefreshRunning = true
        system.runJob(refreshRanchEntities(villageList, () => {
            ranchRefreshRunning = false
        }))
    }
}, 20)

// Fence blocks sit on the pen's border, but small mobs (chickens) can stand inside a fence block's cell while
// still outside the pen. Only the part of a fence block that faces the pen interior counts as inside:
// each quarter of the block counts if a floor tile touches it (either side or the diagonal between them),
// which gives half a block on straight fences, a quarter on outer corners and three quarters on inner corners.
function isInsideFenceBlock(floorColumns: Set<string>, location: Vector3): boolean {
    const blockX = Math.floor(location.x)
    const blockZ = Math.floor(location.z)
    const sx = location.x - blockX >= 0.5 ? 1 : -1
    const sz = location.z - blockZ >= 0.5 ? 1 : -1

    return floorColumns.has(`${blockX + sx},${blockZ}`)
        || floorColumns.has(`${blockX},${blockZ + sz}`)
        || floorColumns.has(`${blockX + sx},${blockZ + sz}`)
}

function* refreshRanchEntities(villageList: Village[], callback: () => void): Generator<void, void, void> {
    try {
        const rancherEntitiesByDimension = new Map<string, Entity[]>()
        let processedEntities = 0
        for (const entity of getRanchAnimals()) {
            if (!entity.isValid) {
                continue
            }
            const dimensionId = entity.dimension.id
            let entities = rancherEntitiesByDimension.get(dimensionId)
            if (entities === undefined) {
                entities = []
                rancherEntitiesByDimension.set(dimensionId, entities)
            }
            entities.push(entity)
            if (++processedEntities % 32 === 0) {
                yield
            }
        }

        for (const village of villageList) {
            const ranchEntities = village.ranchEntities
            const seenRanchEntityIds = new Set<string>()
            const ranchVillagerEntitiesByStructure = new Map<LocationString, string[]>()
            const penTiles = new Map<LocationString, LocationString>()
            const pens = village.findStructures({ includedTypes: ["pig_pen", "cow_pen", "chicken_coop", "sheep_pen"] })
            if (pens.length === 0) {
                for (const id of Object.keys(ranchEntities)) {
                    delete ranchEntities[id]
                }
                village.ranchVillagerEntitiesByStructure = ranchVillagerEntitiesByStructure
                village.penTiles = penTiles
                continue
            }

            const penFloors: Array<{ pen: typeof pens[number], columns: Map<string, number[]>, floorColumns: Set<string> }> = []
            for (const pen of pens) {
                const scanned = yield* pen.scanLocationsIncremental()
                const previous = village.penCache.get(pen.locationString)
                const floor = scanned.floor ?? previous?.floor ?? []
                const fence = scanned.fence ?? previous?.fence ?? []
                // A pen can have several gates: every fence gate on the enclosure is a way in or out
                const gates = scanned.fence === undefined && previous !== undefined
                    ? previous.gates
                    : fence.filter(location => {
                        const block = village.dimension.getBlockSafe(location)
                        return block !== undefined && Registry.fenceGateTypes.includes(block.typeId)
                    })
                village.penCache.set(pen.locationString, { floor, fence, gates })
                const columns = new Map<string, number[]>()
                const floorColumns = new Set<string>()
                let processedLocations = 0
                for (const locations of [floor, fence]) {
                    for (const location of locations) {
                        if (debugFlags.rancherPenParticles) {
                            village.dimension.spawnParticle("minecraft:heart_particle", centerVector(location))
                        }
                        penTiles.set(locationToString(location), pen.locationString)
                        const key = `${location.x},${location.z}`
                        if (locations === floor) {
                            floorColumns.add(key)
                        }
                        const ys = columns.get(key)
                        if (ys === undefined) {
                            columns.set(key, [location.y])
                        }
                        else {
                            ys.push(location.y)
                        }
                        if (++processedLocations % 32 === 0) {
                            yield
                        }
                    }
                }
                penFloors.push({ pen, columns, floorColumns })
            }

            let processedEntitiesInVillage = 0
            for (const rancherEntity of rancherEntitiesByDimension.get(village.dimensionId) ?? []) {
                if (!rancherEntity.isValid) {
                    continue
                }
                const rancherEntityLocation = rancherEntity.location
                if (!village.isInBounds(rancherEntityLocation)) {
                    continue
                }

                const columnKey = `${Math.floor(rancherEntityLocation.x)},${Math.floor(rancherEntityLocation.z)}`
                let matchedPen: LocationString | undefined
                let fallbackPen: LocationString | undefined
                for (const { pen, columns, floorColumns } of penFloors) {
                    const ys = columns.get(columnKey)
                    if (!ys?.some(y => rancherEntityLocation.y >= y - 0.5 && rancherEntityLocation.y < y + 3)) {
                        continue
                    }
                    if (!floorColumns.has(columnKey) && !isInsideFenceBlock(floorColumns, rancherEntityLocation)) {
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
                const breeding = rancherEntity.breeding
                const breedable = breeding?.canBreed ?? false
                const villagerEntity = rancherEntity.villagerEntity ?? false
                const eggLayTicks = rancherEntity.eggLayTimer
                const eggLaySeconds = eggLayTicks === undefined
                    ? undefined
                    : Math.ceil(Math.max(0, eggLayTicks) / 20)
                const eggLayTime = eggLaySeconds === undefined
                    ? "none"
                    : `${Math.floor(eggLaySeconds / 60)}:${(eggLaySeconds % 60).toString().padStart(2, "0")}`

                const existingRanchEntity = ranchEntities[rancherEntity.id]
                if (existingRanchEntity === undefined) {
                    ranchEntities[rancherEntity.id] = {
                        typeId: rancherEntity.typeId,
                        location: rancherEntityLocation,
                        inPen,
                        structure,
                        breedable,
                        villagerEntity,
                        isShearable: rancherEntity.isShearable
                    }
                }
                else {
                    existingRanchEntity.typeId = rancherEntity.typeId
                    existingRanchEntity.location = rancherEntityLocation
                    existingRanchEntity.inPen = inPen
                    existingRanchEntity.structure = structure
                    existingRanchEntity.breedable = breedable
                    existingRanchEntity.villagerEntity = villagerEntity
                    existingRanchEntity.isShearable = rancherEntity.isShearable
                }
                seenRanchEntityIds.add(rancherEntity.id)

                rancherEntity.villagerEntityProperty ??= rancherEntity.getProperty("tektopia:villager_entity") as boolean | undefined
                if (rancherEntity.villagerEntityProperty === false) {
                    rancherEntity.triggerEvent("tektopia:make_villager_entity")
                }

                if (inPen && structure !== undefined && rancherEntity.villagerEntity) {
                    let villagerEntities = ranchVillagerEntitiesByStructure.get(structure)
                    if (villagerEntities === undefined) {
                        villagerEntities = []
                        ranchVillagerEntitiesByStructure.set(structure, villagerEntities)
                    }
                    villagerEntities.push(rancherEntity.id)
                }

                if (debugFlags.rancherDebugNameTags) {
                    rancherEntity.nameTag = [
                        `Ranch entity: ${rancherEntity.typeId}`,
                        `In pen: ${inPen ? "Yes" : "No"}`,
                        `Structure: ${structure ?? "None"}`,
                        `Breeding: ${breeding?.time ?? "none"}-${breeding?.cooldown ?? "none"}`,
                        ...rancherEntity.typeId === "minecraft:chicken" ? [`Egg lay: ${eggLayTime}`] : [],
                        `Villager Entity: ${rancherEntity.villagerEntity ?? false}`
                    ].join("\n")
                }
                else if (rancherEntity.nameTag !== "") {
                    rancherEntity.nameTag = ""
                }

                if (++processedEntitiesInVillage % 32 === 0) {
                    yield
                }
            }

            for (const id of Object.keys(ranchEntities)) {
                if (!seenRanchEntityIds.has(id)) {
                    delete ranchEntities[id]
                }
            }
            village.ranchVillagerEntitiesByStructure = ranchVillagerEntitiesByStructure
            village.penTiles = penTiles
        }
    }
    finally {
        callback()
    }
}

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
    for (const data of world.villageList) {
        const village = Village.from(data)
        if (this.id === village.dimensionId && village.isInBounds(location)) {
            return village
        }
    }
    return undefined
}
