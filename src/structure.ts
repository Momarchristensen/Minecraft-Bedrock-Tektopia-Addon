import {
    system,
    world,
    type Block,
    Dimension,
    type Vector3
} from "@minecraft/server"

import { debugFlags } from "./debug"

import { Registry } from "./registry"

import {
    addVector,
    addVectors,
    calculateSquareDistance,
    type CardinalDirection,
    centerVector,
    directionToVector,
    floorVector,
    getOppositeDirection,
    locationToString,
    multiplyVector,
    stringToLocation,
    subtractVectors
} from "./utils"

import type { LocationString } from "./minecraft_extensions"

import type { Village } from "./village"

const cardinalDirectionList = ["north", "east", "south", "west"] as CardinalDirection[]

export interface StructureValidationResult {
    result: boolean | undefined
    doorLocation?: Vector3 | undefined
    village?: Village
}

Dimension.prototype.validateStructure = function* (block: Block, rotation: CardinalDirection, structureId: StructureType) {
    const dimension = this

    const parseResult = (
        result: boolean | undefined,
        door?: Vector3
    ): StructureValidationResult => ({ result, doorLocation: door })
    const blockCenter = block.center()
    const blockCenterString = locationToString(blockCenter)

    const villageList = world.getVillages()

    let village: Village | undefined

    if (structureId === "townhall") {
        const tooCloseToAnotherVillage = villageList
            .filter(checkVillage => checkVillage.centerString !== blockCenterString)
            .some(checkVillage => calculateSquareDistance(checkVillage.center, blockCenter, true) < 200)

        if (tooCloseToAnotherVillage) {
            return parseResult(false)
        }
    }
    else if (
        !villageList.some(candidate => {
            const isNearby = calculateSquareDistance(candidate.center, blockCenter, true) <= 100

            if (isNearby) {
                village = candidate
            }

            return isNearby
        })
    ) {
        return parseResult(false)
    }

    let result
    if (structureId === "mineshaft") {
        result = yield* validateMineshaftStructure(
            dimension,
            block,
            rotation,
            village
        )
    }
    else {
        result = yield* validateDefaultStructure(
            dimension,
            block,
            rotation
        )
    }

    result.village = village

    return result
}

function* validateMineshaftStructure(
    dimension: Dimension,
    block: Block,
    rotation: CardinalDirection,
    village?: Village
): Generator<void, StructureValidationResult, void> {
    const parseResult = (
        result: boolean | undefined,
        door?: Vector3
    ): StructureValidationResult => ({ result, doorLocation: door })

    if (village === undefined) {
        return parseResult(false)
    }

    if (!cardinalDirectionList.includes(rotation)) {
        return parseResult(false)
    }

    if (block.location.y > 40) {
        return parseResult(false)
    }

    const direction = directionToVector(rotation)
    const frameSupportLocation = addVectors(block.location, direction)

    const doorLocations = [
        addVector(frameSupportLocation, "y", -1),
        addVector(frameSupportLocation, "y", -2)
    ]

    for (const doorLocation of doorLocations) {
        const doorBlock = dimension.getBlockSafe(doorLocation)
        if (doorBlock === undefined) {
            return parseResult(undefined)
        }

        if (!doorBlock.canPathThrough()) {
            return parseResult(false)
        }
    }

    const location = doorLocations[1]
    const mineBlock = getMineshaftMineBlock(dimension, location, rotation)
    if (mineBlock === undefined) {
        return parseResult(undefined)
    }

    if (!village.isInBounds(mineBlock.center())) {
        return parseResult(false)
    }

    if (mineBlock.isLiquid) {
        return parseResult(false)
    }

    // const liquidCheckLocations = [
    //     { x: mineBlock.x + direction.x, y: location.y, z: mineBlock.z + direction.z },
    //     { x: mineBlock.x + direction.x, y: location.y + 1, z: mineBlock.z + direction.z }
    // ]

    // for (const liquidCheckLocation of liquidCheckLocations) {
    //     const liquidCheckBlock = dimension.getBlockSafe(liquidCheckLocation)
    //     if (liquidCheckBlock === undefined) {
    //         return parseResult(undefined)
    //     }

    //     if (liquidCheckBlock.isLiquid) {
    //         return parseResult(false)
    //     }
    // }

    return parseResult(true, location)
}

function* validateDefaultStructure(
    dimension: Dimension,
    block: Block,
    rotation: CardinalDirection
): Generator<void, StructureValidationResult, void> {
    const parseResult = (
        result: boolean | undefined,
        door?: Vector3
    ): StructureValidationResult => ({ result, doorLocation: door })

    if (!cardinalDirectionList.includes(rotation)) {
        return parseResult(false)
    }

    const itemFrameOnBlock = block.offsetSafe(directionToVector(rotation))
    if (itemFrameOnBlock === undefined) {
        return parseResult(false)
    }

    const oppositeRotation = getOppositeDirection(rotation)
    const itemFrameOffsetList = [{ x: 0, y: -1, z: 0 }].concat(
        cardinalDirectionList
            .filter(direction => direction !== rotation && direction !== oppositeRotation)
            .map(direction => directionToVector(direction))
    )

    let foundDoor
    for (const offset of itemFrameOffsetList) {
        const checkBlock = itemFrameOnBlock.offsetSafe(offset)
        if (checkBlock === undefined) {
            return parseResult(false)
        }
        if (Registry.doorTypes.includes(checkBlock.typeId)) {
            foundDoor = checkBlock
        }
    }
    if (foundDoor === undefined) {
        return parseResult(false)
    }

    const doorLocation = addVector(foundDoor.location, "y", -1)

    return yield* validateDefaultRoom(dimension, doorLocation, rotation)
}

function* validateDefaultRoom(
    dimension: Dimension,
    doorLocation: Vector3,
    rotation: CardinalDirection
): Generator<void, StructureValidationResult, void> {
    const parseResult = (
        result: boolean | undefined,
        door?: Vector3
    ): StructureValidationResult => ({ result, doorLocation: door })

    function getFloorBlock(location: Vector3) {
        return dimension.getBlockBelow(location, {
            maxDistance: 32,
            includeLiquidBlocks: false,
            includePassableBlocks: false
        })
    }

    function getCeilingBlock(location: Vector3) {
        return dimension.getBlockAbove(location, {
            maxDistance: 32,
            includeLiquidBlocks: false,
            includePassableBlocks: false
        })
    }

    const doorBlock = dimension.getBlockSafe(doorLocation)
    if (doorBlock === undefined) {
        return parseResult(undefined, doorLocation)
    }
    if (!Registry.doorTypes.includes(doorBlock.typeId)) {
        return parseResult(false, doorLocation)
    }

    const floorBlockList = []
    const startingLocation = addVectors(doorBlock, directionToVector(rotation))
    const checkLocationList = [
        {
            floor: getFloorBlock(startingLocation),
            ceiling: getCeilingBlock(startingLocation)
        }
    ]
    const alreadyCheckedLocations = new Set([locationToString(addVector(doorLocation, "y", -1))])

    let steps = 0
    while (checkLocationList.length > 0) {
        const currentLocation = checkLocationList.shift()
        if (
            currentLocation?.ceiling !== undefined &&
            currentLocation.floor !== undefined &&
            currentLocation.ceiling.y - currentLocation.floor.y > 2
        ) {
            const floorLocationString = locationToString(currentLocation.floor)
            if (!alreadyCheckedLocations.has(floorLocationString)) {
                alreadyCheckedLocations.add(floorLocationString)

                if (debugFlags.structureScanParticles) {
                    dimension.spawnParticle(
                        "minecraft:basic_flame_particle",
                        centerVector(addVector(currentLocation.floor, "y", 1))
                    )
                }

                floorBlockList.push(currentLocation.floor.aboveSafe())

                const floorOffsetList = [
                    { x: 1, y: 0, z: 0 },
                    { x: -1, y: 0, z: 0 },
                    { x: 0, y: 0, z: 1 },
                    { x: 0, y: 0, z: -1 }
                ]

                for (const offset of floorOffsetList) {
                    const offsetLocation = addVectors(currentLocation.floor, offset)
                    if (alreadyCheckedLocations.has(locationToString(offsetLocation))) {
                        continue
                    }

                    const checkLocation = addVector(offsetLocation, "y", 1)

                    let floorBlock = getFloorBlock(checkLocation)?.aboveSafe()
                    while (floorBlock?.isSolid) {
                        floorBlock = floorBlock.aboveSafe()
                    }
                    if (floorBlock === undefined) {
                        return parseResult(undefined, doorLocation)
                    }

                    const ceilingBlock = getCeilingBlock(floorBlock.location)

                    floorBlock = floorBlock.belowSafe()
                    if (
                        floorBlock !== undefined &&
                        ceilingBlock !== undefined &&
                        ceilingBlock.y - floorBlock.y > 2 &&
                        currentLocation.ceiling.y - floorBlock.y > 2 &&
                        ceilingBlock.y - checkLocation.y >= 2
                    ) {
                        checkLocationList.push({
                            floor: floorBlock,
                            ceiling: ceilingBlock
                        })
                    }
                }
            }
        }
        if (++steps % 5 === 0) {
            yield
        }
    }

    return parseResult(floorBlockList.length >= 9, doorLocation)
}

export interface StructureTypeMap {
    mineshaft: Mineshaft
    storage: Structure
    townhall: Structure
    home_2: Structure
}

export type StructureType = keyof StructureTypeMap

export interface StructureData {
    type: StructureType
    rotation: CardinalDirection
}

export interface MineshaftData extends StructureData {
    type: "mineshaft"
}

type StructureFactory = (locationString: LocationString, data: StructureData, dimension: Dimension) => Structure

export class Structure<T extends StructureData = StructureData> {
    private static cache = new WeakMap<StructureData, Structure>()
    private static factories = new Map<string, StructureFactory>()

    readonly location: Vector3
    readonly locationString
    private readonly data
    readonly dimension

    protected constructor(locationString: LocationString, data: T, dimension: Dimension) {
        this.location = stringToLocation(locationString)
        this.locationString = locationString
        this.data = data
        this.dimension = dimension
    }

    static register(type: string, factory: StructureFactory) {
        Structure.factories.set(type, factory)
    }

    static from(locationString: LocationString, data: MineshaftData, dimension: Dimension): Mineshaft
    static from(locationString: LocationString, data: StructureData, dimension: Dimension): Structure
    static from(locationString: LocationString, data: StructureData, dimension: Dimension): Structure {
        let structure = Structure.cache.get(data)
        if (structure === undefined) {
            const factory = Structure.factories.get(data.type)
            structure = factory !== undefined ?
                factory(locationString, data, dimension) :
                new Structure(locationString, data, dimension)
            Structure.cache.set(data, structure)
        }
        return structure
    }

    *validate(_village: Village): Generator<void, boolean | undefined, void> {
        const validation = yield* validateDefaultRoom(this.dimension, this.location, this.rotation)
        return validation.result
    }

    get type() {
        return this.data.type
    }

    get rotation() {
        return this.data.rotation
    }
}

const MAX_MINE_DISTANCE = 210

interface MarchResult {
    distance: number
    block: Block
}

function marchToObstruction(
    dimension: Dimension,
    start: Vector3,
    direction: Vector3,
    maxDistance: number
): MarchResult | undefined {
    const flooredStart = floorVector(start)
    for (let step = 1; step <= maxDistance; step++) {
        const blockLocation = {
            x: flooredStart.x + (direction.x * step),
            y: flooredStart.y + (direction.y * step),
            z: flooredStart.z + (direction.z * step)
        }

        const block = dimension.getBlockSafe(blockLocation)

        if (!block?.isValid) {
            return undefined
        }

        if (block.isLiquid || !block.canPathThrough()) {
            return { distance: step, block }
        }
    }

    return undefined
}

function getMineshaftMineBlock(dimension: Dimension, location: Vector3, rotation: CardinalDirection) {
    const mineshaftDirection = directionToVector(rotation)
    const doorLocations = [location, addVector(location, "y", 1)]

    let shortest: MarchResult | undefined
    for (const doorLocation of doorLocations) {
        const result = marchToObstruction(dimension, doorLocation, mineshaftDirection, MAX_MINE_DISTANCE)
        if (result === undefined) {
            continue
        }

        if (shortest === undefined || result.distance < shortest.distance) {
            shortest = result
        }
    }

    return shortest?.block
}

type MineshaftTask = { type: "fill", block: Block, offset: Vector3 } | { type: "mine", block: Block } | { type: "light", block: Block }

export class Mineshaft extends Structure<MineshaftData> {
    constructor(locationString: LocationString, data: MineshaftData, dimension: Dimension) {
        super(locationString, data, dimension)
    }

    override *validate(village: Village): Generator<void, boolean | undefined, void> {
        const direction = directionToVector(this.rotation)
        const frameBlock = this.dimension.getBlockSafe(
            addVector(subtractVectors(this.location, direction), "y", 2)
        )
        if (frameBlock === undefined) {
            return undefined
        }

        const validation = yield* validateMineshaftStructure(this.dimension, frameBlock, this.rotation, village)
        return validation.result
    }

    getMineBlock() {
        return getMineshaftMineBlock(this.dimension, this.location, this.rotation)
    }

    getNextTask(): MineshaftTask | undefined {
        const mineBlock = this.getMineBlock()
        if (mineBlock === undefined) {
            return undefined
        }

        const mineshaftDirection = directionToVector(this.rotation)
        const offsetDirection = { x: mineshaftDirection.z, y: mineshaftDirection.y, z: mineshaftDirection.x }
        const reverseOffsetDirection = multiplyVector(offsetDirection, "xyz", -1)

        const checkLocations = [
            addVector(this.location, "y", -1),
            addVector(this.location, "y", 2),
            addVectors(addVector(this.location, "y", 1), offsetDirection),
            addVectors(addVector(this.location, "y", 1), reverseOffsetDirection),
            addVectors(this.location, offsetDirection),
            addVectors(this.location, reverseOffsetDirection)
        ]

        const checkBlocks = checkLocations.map(location => ({
            offset: subtractVectors(location, this.location),
            block: this.dimension.getBlockSafe(location)
        }))

        const distanceToMineBlock =
            ((mineBlock.location.x - this.location.x) * mineshaftDirection.x) +
            ((mineBlock.location.y - this.location.y) * mineshaftDirection.y) +
            ((mineBlock.location.z - this.location.z) * mineshaftDirection.z)

        let lightBlock = this.dimension.getBlockSafe(this.location)
        for (let step = 0; step < distanceToMineBlock; step++) {
            for (let i = 0; i < checkBlocks.length; i++) {
                const { offset, block } = checkBlocks[i]
                if (block === undefined) {
                    return undefined
                }

                if (block.isAir) {
                    return { type: "fill", block, offset }
                }

                checkBlocks[i] = { block: block.offsetSafe(mineshaftDirection), offset }
            }

            if (lightBlock === undefined) {
                return undefined
            }

            if (step > 4 && lightBlock.getLightLevel() < 3 && lightBlock.isAir) {
                return { type: "light", block: lightBlock }
            }

            lightBlock = lightBlock.offsetSafe(mineshaftDirection)
        }

        return { type: "mine", block: mineBlock }
    }
}

Structure.register("mineshaft", (locationString, data, dimension) => new Mineshaft(locationString, data as MineshaftData, dimension))

function tickScanStructures() {
    system.runJob(scanStructures(() => system.runTimeout(tickScanStructures, 100)))
}

system.run(tickScanStructures)

function* scanStructures(callback?: () => void) {
    try {
        if (!world.loadedData) {
            return
        }

        for (const village of world.getVillages()) {
            for (const structure of village.getStructures()) {
                if (!village.isValid) {
                    break
                }

                const isValid = yield* structure.validate(village)

                if (isValid === false) {
                    village.removeStructure(structure.locationString)
                }

                yield
            }
        }
    }
    finally {
        callback?.()
    }
}
