import {
    Block,
    Dimension,
    ItemComponentTypes,
    system,
    type Vector3,
    world
} from "@minecraft/server"

import { debugFlags } from "./debug"

import { Registry } from "./registry"

import {
    addVector,
    addVectors,
    areVectorsEqual,
    calculateSquareDistance,
    centerVector,
    directionToVector,
    getOppositeDirection,
    rotationToStructureRotation,
    locationToString,
    type CardinalDirection
} from "./utils"

import { Village } from "./village"

import type { StructureType } from "./structure"

const itemFrameRotations: Record<string, CardinalDirection> = {
    2: "south",
    3: "north",
    4: "east",
    5: "west"
}

const cardinalDirectionList = ["north", "east", "south", "west"] as CardinalDirection[]

interface StructureValidationResult {
    result: boolean | undefined
    doorLocation?: Vector3 | undefined
    village?: Village
}

function* validateStructure(
    dimension: Dimension,
    block: Block,
    rotation: CardinalDirection,
    structureId: StructureType
) {
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
            rotation
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
    rotation: CardinalDirection
): Generator<void, StructureValidationResult, void> {
    const parseResult = (
        result: boolean | undefined,
        door?: Vector3
    ): StructureValidationResult => ({ result, doorLocation: door })

    if (!cardinalDirectionList.includes(rotation)) {
        return parseResult(false)
    }

    const frameSupportLocation = addVectors(block.location, directionToVector(rotation))

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

        if (debugFlags.structureScanParticles) {
            dimension.spawnParticle(
                "minecraft:basic_flame_particle",
                centerVector(doorBlock.location)
            )
        }
    }

    return parseResult(true, doorLocations[1])
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

function tickScanItemFrames() {
    system.runJob(scanItemFrames(() => system.runTimeout(tickScanItemFrames, 100)))
}

system.run(tickScanItemFrames)

function* scanItemFrames(callback?: () => void) {
    try {
        const villageItemFrameLocations: string[] = []

        for (const itemFrame of world.itemFrameList) {
            const dimension = world.getDimension(itemFrame.dimensionId)
            const block = dimension.getBlockSafe(itemFrame.location)

            if (block === undefined) {
                if (itemFrame.structureId === "townhall") {
                    villageItemFrameLocations.push(locationToString(centerVector(itemFrame.location)))
                }
                yield
                continue
            }

            const item = block.getFrameItem()
            const blockCenter = block.center()
            const blockCenterString = locationToString(blockCenter)

            if (!item?.typeId.startsWith("tektopia:structure_")) {
                itemFrame.structureId = undefined
                yield
                continue
            }

            const isTownhall = item.typeId === "tektopia:structure_townhall"
            const facingDirection = block.permutation.getState("facing_direction")

            if (facingDirection === undefined || !(facingDirection in itemFrameRotations)) {
                if (isTownhall) {
                    villageItemFrameLocations.push(blockCenterString)
                }
                yield
                continue
            }

            const rotation = itemFrameRotations[facingDirection]
            const structureId = item.typeId.replace("tektopia:structure_", "") as StructureType
            itemFrame.structureId = structureId

            const structureValidation = yield* validateStructure(dimension, block, rotation, structureId)

            const result = structureValidation.result

            if (!block.isValid) {
                if (isTownhall) {
                    villageItemFrameLocations.push(blockCenterString)
                }
                yield
                continue
            }

            if (result !== undefined) {
                const doorLocation = structureValidation.doorLocation
                if (result && doorLocation !== undefined) {
                    if (isTownhall) {
                        villageItemFrameLocations.push(blockCenterString)
                        const villageStringCenterList = world.getVillages().map(village => village.centerString)
                        if (!villageStringCenterList.includes(blockCenterString)) {
                            world.villageList.push(Village.createData(blockCenter, dimension.id, doorLocation))
                        }
                    }
                    else {
                        const village = structureValidation.village
                        if (village !== undefined) {
                            village.addStructure(doorLocation, {
                                type: structureId,
                                rotation
                            })
                        }
                    }
                }
                dimension.placeStructureFrame(block.location, structureId, result, rotation)
            }
            else if (isTownhall) {
                villageItemFrameLocations.push(blockCenterString)
            }

            yield
        }

        const keep = new Set(villageItemFrameLocations)
        for (let i = world.villageList.length - 1; i >= 0; i--) {
            if (!keep.has(locationToString(world.villageList[i].center))) {
                world.villageList.splice(i, 1)
            }
        }
    }
    finally {
        callback?.()
    }
}

Dimension.prototype.placeStructureFrame = function (location, structureType, isEnchanted, rotation = "north") {
    const structureManager = world.structureManager
    const block = this.getBlockSafe(location)
    if (block !== undefined) {
        const item = block.getFrameItem()
        const itemIsEnchanted = item !== undefined && Boolean(
            item.getComponent(ItemComponentTypes.Enchantable)?.getEnchantments()
                .length
        )
        if (item?.typeId.replace("tektopia:structure_", "") !== structureType || itemIsEnchanted !== isEnchanted) {
            const structureRotation = rotationToStructureRotation(rotation)
            try {
                structureManager.place(
                    `mystructure:structure_${structureType}${isEnchanted ? "_enchanted" : ""}`,
                    this,
                    location,
                    { rotation: structureRotation }
                )
            }
            catch { }
        }
    }
}

const minecraftFrameTypes = ["minecraft:frame", "minecraft:glow_frame"]

Block.prototype.getFrameItem = function () {
    if (minecraftFrameTypes.includes(this.typeId)) {
        const item = this.getItemStack()
        if (item === undefined) {
            return undefined
        }
        return item.typeId !== this.typeId ? item : undefined
    }
    return undefined
}

world.afterEvents.playerInteractWithBlock.subscribe(event => {
    const block = event.block
    const blockLocation = block.location
    const blockDimension = block.dimension

    if (minecraftFrameTypes.includes(block.typeId) && !world.itemFrameList.some(itemFrame => areVectorsEqual(itemFrame.location, blockLocation))) {
        world.itemFrameList.push({
            dimensionId: blockDimension.id,
            location: blockLocation
        })
    }
})

world.afterEvents.playerPlaceBlock.subscribe(event => {
    const block = event.block
    const blockLocation = block.location
    const blockDimension = event.dimension
    if (
        minecraftFrameTypes.includes(block.typeId) && !world.itemFrameList.some(itemFrame =>
            areVectorsEqual(itemFrame.location, blockLocation)
        )) {
        world.itemFrameList.push({
            dimensionId: blockDimension.id,
            location: blockLocation
        })
    }
})

world.afterEvents.playerBreakBlock.subscribe(event => {
    const block = event.block
    const blockLocation = block.location
    const brokenBlockPermutation = event.brokenBlockPermutation
    const beforeBlockTypeId = brokenBlockPermutation.type.id
    if (minecraftFrameTypes.includes(beforeBlockTypeId)) {
        const itemFrameIndex = world.itemFrameList.findIndex(itemFrame =>
            areVectorsEqual(itemFrame.location, blockLocation)
        )
        if (itemFrameIndex >= 0) {
            world.itemFrameList.splice(itemFrameIndex, 1)
        }
    }
})

system.runInterval(() => {
    if (!world.loadedData) {
        return
    }

    world.itemFrameList = world.itemFrameList.filter(itemFrame => {
        const dimension = world.getDimension(itemFrame.dimensionId)
        const block = dimension.getBlockSafe(itemFrame.location)
        return block === undefined || minecraftFrameTypes.includes(block.typeId)
    })
}, 20)
