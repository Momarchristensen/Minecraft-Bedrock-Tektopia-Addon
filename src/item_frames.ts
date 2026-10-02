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
    type Direction,
    directionToVector,
    getOppositeDirection,
    rotationToStructureRotation,
    locationToString
} from "./utils"

import { Village } from "./village"

const itemFrameRotations: Record<string, Direction> = {
    2: "south",
    3: "north",
    4: "east",
    5: "west"
}

const cardinalDirectionList = ["north", "east", "south", "west"]

interface StructureValidationResult {
    result: boolean | undefined
    doorLocation: Vector3 | undefined
}

function* validateStructure(
    dimension: Dimension,
    block: Block,
    rotation: Direction,
    structureId: string
): Generator<void, StructureValidationResult, void> {
    const blockCenter = block.center()
    const blockCenterString = locationToString(blockCenter)

    const fail = (
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
        return fail(false)
    }

    const itemFrameOnBlock = block.offsetSafe(directionToVector(rotation))
    if (itemFrameOnBlock === undefined) {
        return fail(false)
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
            return fail(false)
        }
        if (Registry.doorTypes.includes(checkBlock.typeId)) {
            foundDoor = checkBlock
        }
    }
    if (foundDoor === undefined) {
        return fail(false)
    }

    const doorLocation = addVector(foundDoor.location, "y", -1)
    const doorBlock = dimension.getBlockSafe(doorLocation)
    if (doorBlock === undefined) {
        return fail(undefined, doorLocation)
    }
    if (!Registry.doorTypes.includes(doorBlock.typeId)) {
        return fail(false, doorLocation)
    }

    const villageList = world.getVillages()
    if (structureId === "townhall") {
        const tooCloseToAnotherVillage = villageList
            .filter(village => village.centerString !== blockCenterString)
            .some(village => calculateSquareDistance(village.center, blockCenter, true) < 200)
        if (tooCloseToAnotherVillage) {
            return fail(false, doorLocation)
        }
    }
    else if (!villageList.some(village => calculateSquareDistance(village.center, blockCenter, true) <= 100)) {
        return fail(false, doorLocation)
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

                if (debugFlags.itemFrameScanParticles) {
                    try {
                        dimension.spawnParticle(
                            "minecraft:basic_flame_particle",
                            centerVector(currentLocation.floor)
                        )
                    }
                    catch { }
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
                        return fail(undefined, doorLocation)
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

    return fail(floorBlockList.length >= 9, doorLocation)
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
            const structureId = item.typeId.replace("tektopia:structure_", "")
            itemFrame.structureId = structureId

            const { result, doorLocation } = yield* validateStructure(dimension, block, rotation, structureId)

            if (!block.isValid) {
                if (isTownhall) {
                    villageItemFrameLocations.push(blockCenterString)
                }
                yield
                continue
            }

            if (result !== undefined) {
                if (result && doorLocation !== undefined && structureId === "townhall") {
                    villageItemFrameLocations.push(blockCenterString)
                    const villageStringCenterList = world.getVillages().map(village => village.centerString)
                    if (!villageStringCenterList.includes(blockCenterString)) {
                        world.villageList.push(Village.createData(blockCenter, dimension.id, doorLocation))
                    }
                }
                dimension.placeStructureFrame(block.location, structureId, result, rotation)
            }
            else if (isTownhall) {
                villageItemFrameLocations.push(blockCenterString)
            }

            yield
        }

        // Remove villages whose townhall frame no longer exists
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
            structureManager.place(
                `mystructure:structure_${structureType}${isEnchanted ? "_enchanted" : ""}`,
                this,
                location,
                { rotation: structureRotation }
            )
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
