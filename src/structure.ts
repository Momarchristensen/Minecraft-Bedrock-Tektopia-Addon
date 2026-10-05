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
    calculateChebyshevDistance,
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

    if (debugFlags.structureScanParticles) {
        dimension.spawnParticle("minecraft:basic_flame_particle", block.center())
    }

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
            .some(checkVillage => calculateChebyshevDistance(checkVillage.center, blockCenter, true) < 200)

        if (tooCloseToAnotherVillage) {
            return parseResult(false)
        }
    }
    else if (
        !villageList.some(candidate => {
            const isNearby = calculateChebyshevDistance(candidate.center, blockCenter, true) <= 100

            if (isNearby) {
                village = candidate
            }

            return isNearby
        })
    ) {
        return parseResult(false)
    }

    if (!cardinalDirectionList.includes(rotation)) {
        return parseResult(false)
    }

    let result
    if (structureId === "mineshaft") {
        if (village === undefined) {
            return parseResult(false)
        }
        result = yield* validateMineshaftStructure(
            dimension,
            block,
            rotation,
            village
        )
    }
    else if (structureId === "guard_post") {
        result = parseResult(true)
    }
    else if (["pig_pen", "cow_pen", "sheep_pen", "chicken_coop"].includes(structureId)) {
        if (village === undefined) {
            return parseResult(false)
        }
        result = yield* validateAnimalPenStructure(dimension, block, rotation, village)
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

const minPenFloorBlocks = 3
const maxPenFloorBlocks = 512
const penFloorYieldInterval = 32
const penFloorYOffsets = [0, -1, 1]

function* validateAnimalPenStructure(
    dimension: Dimension,
    block: Block,
    rotation: CardinalDirection,
    _village: Village
): Generator<void, StructureValidationResult, void> {
    const parseResult = (
        result: boolean | undefined,
        door?: Vector3
    ): StructureValidationResult => ({ result, doorLocation: door })

    const penGate = findAnimalPenGate(block, rotation, checkBlock => {
        if (debugFlags.structureScanParticles) {
            dimension.spawnParticle("minecraft:basic_flame_particle", checkBlock.center())
        }
    })
    if (penGate === undefined) {
        return parseResult(false)
    }

    const { gate, axis, direction } = penGate

    const isEnclosed = yield* isFenceEnclosed(dimension, gate, axis)
    if (isEnclosed === undefined) {
        return parseResult(undefined)
    }
    if (!isEnclosed) {
        return parseResult(false)
    }

    const floorLocations = yield* collectPenFloorLocations(dimension, gate, direction)
    if (floorLocations === undefined) {
        return parseResult(undefined)
    }
    if (floorLocations.length < minPenFloorBlocks) {
        return parseResult(false)
    }

    return parseResult(true, gate)
}

interface AnimalPenGate {
    gate: Block
    axis: Vector3
    direction: Vector3
}

function findAnimalPenGate(
    block: Block,
    rotation: CardinalDirection,
    onCheck?: (checkBlock: Block) => void
): AnimalPenGate | undefined {
    const direction = directionToVector(rotation)
    const supportBlock = block.offsetSafe(direction)

    const axis = { x: direction.z, y: direction.y, z: direction.x }
    const reversedAxis = multiplyVector(axis, "xyz", -1)

    const gateCheckBlocks = [
        supportBlock?.offsetSafe(axis),
        supportBlock?.offsetSafe(reversedAxis)
    ]

    let gate: Block | undefined
    for (const gateCheckBlock of gateCheckBlocks) {
        if (gateCheckBlock === undefined) {
            continue
        }

        if (Registry.gateTypes.includes(gateCheckBlock.typeId)) {
            gate = gateCheckBlock
        }

        onCheck?.(gateCheckBlock)
    }

    return gate === undefined ? undefined : { gate, axis, direction }
}

function resolvePenFloor(dimension: Dimension, location: Vector3): Block | null | undefined {
    for (const yOffset of penFloorYOffsets) {
        const block = dimension.getBlockSafe(addVector(location, "y", yOffset))
        const below = dimension.getBlockSafe(addVector(location, "y", yOffset - 1))
        if (block === undefined || below === undefined) {
            return undefined
        }

        // A fence at the same height is a wall; never climb over it
        if (yOffset === 0 && isFenceBlock(block)) {
            return null
        }

        if (
            block.canPathThrough() &&
            !isFenceBlock(block) &&
            !block.isLiquid &&
            !below.canPathThrough() &&
            !below.isLiquid &&
            !isFenceBlock(below)
        ) {
            return block
        }
    }

    return null
}

interface PenFloorFill {
    queue: Block[]
    visited: Set<LocationString>
    floor: Vector3[]
    active: boolean
    unloaded: boolean
}

function* collectPenFloorLocations(
    dimension: Dimension,
    gate: Block,
    direction: Vector3
): Generator<void, Vector3[] | undefined, void> {
    const fills: PenFloorFill[] = []
    let unloaded = false

    for (const side of [direction, multiplyVector(direction, "xyz", -1)]) {
        const start = resolvePenFloor(dimension, addVectors(gate.location, side))
        if (start === undefined) {
            unloaded = true
            continue
        }
        if (start === null) {
            continue
        }

        fills.push({
            queue: [start],
            visited: new Set([locationToString(start.location)]),
            floor: [start.location],
            active: true,
            unloaded: false
        })
    }

    let processed = 0
    while (fills.some(fill => fill.active)) {
        for (const fill of fills) {
            if (!fill.active) {
                continue
            }

            const current = fill.queue.shift()
            if (current === undefined) {
                // This side ran out of floor without escaping, so it is the enclosed area
                return fill.floor
            }

            for (const cardinalDirection of cardinalDirectionList) {
                const next = resolvePenFloor(
                    dimension,
                    addVectors(current.location, directionToVector(cardinalDirection))
                )
                if (next === undefined) {
                    fill.active = false
                    fill.unloaded = true
                    break
                }
                if (next === null) {
                    continue
                }

                const nextString = locationToString(next.location)
                if (fill.visited.has(nextString)) {
                    continue
                }

                fill.visited.add(nextString)
                fill.queue.push(next)
                fill.floor.push(next.location)

                if (fill.floor.length > maxPenFloorBlocks) {
                    fill.active = false
                    break
                }
            }

            if (++processed % penFloorYieldInterval === 0) {
                yield
            }
        }
    }

    return unloaded || fills.some(fill => fill.unloaded) ? undefined : []
}

const maxFenceSearchBlocks = 256
const fenceSearchYieldInterval = 16

function isFenceBlock(block: Block): boolean {
    return Registry.fenceTypes.includes(block.typeId) || Registry.gateTypes.includes(block.typeId)
}

function* isFenceEnclosed(
    dimension: Dimension,
    gate: Block,
    axis: Vector3
): Generator<void, boolean | undefined, void> {
    const leftBlock = gate.offsetSafe(axis)
    const rightBlock = gate.offsetSafe(multiplyVector(axis, "xyz", -1))
    if (leftBlock === undefined || rightBlock === undefined) {
        return undefined
    }

    const showScanParticle = (block: Block) => {
        if (debugFlags.structureScanParticles) {
            dimension.spawnParticle("minecraft:basic_flame_particle", block.center())
        }
    }

    showScanParticle(gate)
    showScanParticle(leftBlock)
    showScanParticle(rightBlock)

    if (!isFenceBlock(leftBlock) || !isFenceBlock(rightBlock)) {
        return false
    }

    const gateString = locationToString(gate.location)
    const targetString = locationToString(rightBlock.location)

    const stepOffsets: Vector3[] = []
    for (const direction of cardinalDirectionList) {
        const vector = directionToVector(direction)
        for (const y of [0, 1, -1]) {
            stepOffsets.push({ x: vector.x, y, z: vector.z })
        }
    }

    const visited = new Set<LocationString>([gateString, locationToString(leftBlock.location)])
    const queue: Block[] = [leftBlock]

    let checked = 0
    while (queue.length > 0) {
        const current = queue.shift()
        if (current === undefined) {
            continue
        }

        for (const offset of stepOffsets) {
            const next = dimension.getBlockSafe(addVectors(current.location, offset))
            if (next === undefined) {
                return undefined
            }

            const nextString = locationToString(next.location)
            if (visited.has(nextString) || !isFenceBlock(next)) {
                continue
            }

            showScanParticle(next)

            if (nextString === targetString) {
                return true
            }

            visited.add(nextString)
            queue.push(next)
        }

        checked++
        if (checked > maxFenceSearchBlocks) {
            return false
        }
        if (checked % fenceSearchYieldInterval === 0) {
            yield
        }
    }

    return false
}

function* validateMineshaftStructure(
    dimension: Dimension,
    block: Block,
    rotation: CardinalDirection,
    village: Village
): Generator<void, StructureValidationResult, void> {
    const parseResult = (
        result: boolean | undefined,
        door?: Vector3
    ): StructureValidationResult => ({ result, doorLocation: door })

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
    const mineBlock = getMineshaftMineBlock(dimension, location, rotation, true)
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
    pig_pen: AnimalPen
    sheep_pen: AnimalPen
    cow_pen: AnimalPen
    chicken_coop: AnimalPen
    guard_post: Structure
}

export type StructureType = keyof StructureTypeMap

export interface StructureData {
    type: StructureType
    rotation: CardinalDirection
}

export interface MineshaftData extends StructureData {
    type: "mineshaft"
}

export interface AnimalPenData extends StructureData {
    type: "pig_pen" | "chicken_coop" | "sheep_pen" | "cow_pen"
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
    static from(locationString: LocationString, data: AnimalPenData, dimension: Dimension): AnimalPen
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
    maxDistance: number,
    showScanParticles: boolean
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

        if (showScanParticles && debugFlags.structureScanParticles) {
            dimension.spawnParticle("minecraft:basic_flame_particle", block.center())
        }

        if (block.isLiquid || !block.canPathThrough()) {
            return { distance: step, block }
        }
    }

    return undefined
}

function getMineshaftMineBlock(
    dimension: Dimension,
    location: Vector3,
    rotation: CardinalDirection,
    showScanParticles = false
) {
    const mineshaftDirection = directionToVector(rotation)
    const doorLocations = [location, addVector(location, "y", 1)]

    let shortest: MarchResult | undefined
    for (const doorLocation of doorLocations) {
        const result = marchToObstruction(
            dimension,
            doorLocation,
            mineshaftDirection,
            MAX_MINE_DISTANCE,
            showScanParticles
        )
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

export class AnimalPen extends Structure<AnimalPenData> {
    constructor(locationString: LocationString, data: AnimalPenData, dimension: Dimension) {
        super(locationString, data, dimension)
    }

    private getFrameBlock() {
        const direction = directionToVector(this.rotation)
        return this.dimension.getBlockSafe(
            addVector(subtractVectors(this.location, direction), "y", 2)
        )
    }

    override *validate(village: Village): Generator<void, boolean | undefined, void> {
        const frameBlock = this.getFrameBlock()
        if (frameBlock === undefined) {
            return undefined
        }

        const validation = yield* validateAnimalPenStructure(this.dimension, frameBlock, this.rotation, village)
        return validation.result
    }

    getFloorLocations(): Vector3[] {
        const frameBlock = this.getFrameBlock()
        if (frameBlock === undefined) {
            return []
        }

        const penGate = findAnimalPenGate(frameBlock, this.rotation)
        if (penGate === undefined) {
            return []
        }

        const generator = collectPenFloorLocations(this.dimension, penGate.gate, penGate.direction)
        let step = generator.next()
        while (!step.done) {
            step = generator.next()
        }

        return step.value ?? []
    }
}

Structure.register("mineshaft", (locationString, data, dimension) => new Mineshaft(locationString, data as MineshaftData, dimension))

const animalPenFactory: StructureFactory = (locationString, data, dimension) =>
    new AnimalPen(locationString, data as AnimalPenData, dimension)

Structure.register("pig_pen", animalPenFactory)
Structure.register("cow_pen", animalPenFactory)
Structure.register("sheep_pen", animalPenFactory)
Structure.register("chicken_coop", animalPenFactory)

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

                if (debugFlags.structureScanParticles) {
                    try {
                        village.dimension.spawnParticle(
                            "minecraft:basic_flame_particle",
                            centerVector(structure.location)
                        )
                    }
                    catch { }
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
