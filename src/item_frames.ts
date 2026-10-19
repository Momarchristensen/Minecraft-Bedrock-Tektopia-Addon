import {
    Block,
    Dimension,
    ItemComponentTypes,
    system,
    world,
    type Vector3
} from "@minecraft/server"

import {
    BedStructure,
    StorageStructure,
    type StructureType
} from "./structure"

import {
    areVectorsEqual,
    calculateChebyshevDistance,
    centerVector,
    getItemFrameRotation,
    rotationToStructureRotation,
    locationToString,
    stringToLocation
} from "./utils"

import { Village } from "./village"

import type { LocationString } from "./types"

const FRAME_UNCERTAINTY_RADIUS = 8
type ItemFrameRecord = typeof world.itemFrameList[number]
const structureLocationsByItemFrame = new WeakMap<ItemFrameRecord, LocationString>()

export function getItemFrameStructureLocation(itemFrame: ItemFrameRecord) {
    return structureLocationsByItemFrame.get(itemFrame)
}

function tickScanItemFrames() {
    system.runJob(scanItemFrames(() => system.runTimeout(tickScanItemFrames, 100)))
}

system.run(tickScanItemFrames)

function* scanItemFrames(callback?: () => void) {
    try {
        const villageItemFrameLocations: string[] = []
        const claimedStructures = new Set<LocationString>()
        const uncertainFrames: Array<{ dimensionId: string, location: Vector3 }> = []

        for (const itemFrame of world.itemFrameList) {
            const dimension = world.getDimension(itemFrame.dimensionId)
            const block = dimension.getBlockSafe(itemFrame.location)

            if (block === undefined) {
                uncertainFrames.push({ dimensionId: itemFrame.dimensionId, location: itemFrame.location })
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
                structureLocationsByItemFrame.delete(itemFrame)
                yield
                continue
            }

            const isTownhall = item.typeId === "tektopia:structure_townhall"
            const facingDirection = block.permutation.getState("facing_direction")
            const rotation = getItemFrameRotation(facingDirection)

            if (rotation === undefined) {
                uncertainFrames.push({ dimensionId: itemFrame.dimensionId, location: itemFrame.location })
                if (isTownhall) {
                    villageItemFrameLocations.push(blockCenterString)
                }
                yield
                continue
            }

            const structureId = item.typeId.replace("tektopia:structure_", "") as StructureType
            itemFrame.structureId = structureId

            const structureValidation = yield* dimension.validateStructure(block, rotation, structureId)

            let result = structureValidation.result

            if (!block.isValid) {
                uncertainFrames.push({ dimensionId: itemFrame.dimensionId, location: itemFrame.location })
                if (isTownhall) {
                    villageItemFrameLocations.push(blockCenterString)
                }
                yield
                continue
            }

            if (result !== undefined) {
                const doorLocation = structureValidation.doorLocation
                if (result) {
                    if (isTownhall) {
                        structureLocationsByItemFrame.delete(itemFrame)
                        if (doorLocation !== undefined) {
                            villageItemFrameLocations.push(blockCenterString)
                            const villageStringCenterList = world.getVillages().map(village => village.centerString)
                            if (!villageStringCenterList.includes(blockCenterString)) {
                                world.villageList.push(Village.createData(blockCenter, dimension.id, doorLocation))
                            }
                        }
                    }
                    else {
                        const village = structureValidation.village
                        if (village !== undefined) {
                            const structureLocation = doorLocation ?? itemFrame.location
                            const structureLocationString = locationToString(structureLocation)
                            village.addStructure(structureLocation, {
                                type: structureId,
                                rotation
                            })
                            claimedStructures.add(structureLocationString)
                            structureLocationsByItemFrame.set(itemFrame, structureLocationString)

                            const structure = village.getStructure(structureLocation)
                            const floorLocations = structureValidation.floorLocations
                            const claimedRoom = structure?.cacheFloorLocations(
                                floorLocations,
                                structureValidation.ownRoomFloorCount
                            ) ?? true

                            if (!claimedRoom) {
                                village.removeStructure(structureLocationString)
                                claimedStructures.delete(structureLocationString)
                                structureLocationsByItemFrame.delete(itemFrame)
                                result = false
                            }
                            else if (structure instanceof StorageStructure) {
                                if (floorLocations !== undefined) {
                                    village.storage.setContainers(structure.locationString, structure.getChests(structure.loadFloorLocations()))
                                }
                            }
                            else if (structure instanceof BedStructure) {
                                structure.validateBeds(structure.loadFloorLocations())
                            }
                        }
                        else {
                            structureLocationsByItemFrame.delete(itemFrame)
                        }
                    }
                }
                else {
                    const previousKey = structureLocationsByItemFrame.get(itemFrame)
                    if (previousKey !== undefined) {
                        for (const village of world.getVillages()) {
                            village.getStructure(stringToLocation(previousKey))?.cacheFloorLocations(undefined)
                            village.releaseFloorClaims(previousKey)
                            village.storage.clearContainers(previousKey)
                        }
                    }
                    structureLocationsByItemFrame.delete(itemFrame)
                }
                dimension.placeStructureFrame(block.location, structureId, result, rotation)
            }
            else {
                uncertainFrames.push({ dimensionId: itemFrame.dimensionId, location: itemFrame.location })
                if (isTownhall) {
                    villageItemFrameLocations.push(blockCenterString)
                }
            }

            yield
        }

        if (world.loadedData) {
            removeStructuresWithoutFrames(claimedStructures, uncertainFrames)
        }

        const keep = new Set(villageItemFrameLocations)
        for (let i = world.villageList.length - 1; i >= 0; i--) {
            const villageData = world.villageList[i]
            if (villageData !== undefined && !keep.has(locationToString(villageData.center))) {
                world.villageList.splice(i, 1)
            }
        }
    }
    finally {
        callback?.()
    }
}

function removeStructuresWithoutFrames(
    claimedStructures: Set<LocationString>,
    uncertainFrames: Array<{ dimensionId: string, location: Vector3 }>
) {
    for (const village of world.getVillages()) {
        if (!village.isValid) {
            continue
        }

        for (const structure of village.getStructures()) {
            if (claimedStructures.has(structure.locationString)) {
                continue
            }

            if (village.dimension.getBlockSafe(structure.location) === undefined) {
                continue
            }

            const mightHaveUnreadFrame = uncertainFrames.some(frame =>
                frame.dimensionId === village.dimensionId
                && calculateChebyshevDistance(frame.location, structure.location, true) <= FRAME_UNCERTAINTY_RADIUS
            )
            if (mightHaveUnreadFrame) {
                continue
            }

            village.removeStructure(structure.locationString)
        }
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

let itemFrameCleanupRunning = false

system.runInterval(() => {
    if (!world.loadedData || itemFrameCleanupRunning) {
        return
    }

    itemFrameCleanupRunning = true
    system.runJob(cleanupItemFrames())
}, 20)

function* cleanupItemFrames(): Generator<void, void, void> {
    try {
        const itemFrames = world.itemFrameList
        const snapshot = itemFrames.slice()
        const invalidItemFrames = new Set<typeof itemFrames[number]>()
        const dimensions = new Map<string, Dimension>()

        for (let index = 0; index < snapshot.length; index++) {
            const itemFrame = snapshot[index]
            if (itemFrame === undefined) {
                continue
            }
            let dimension = dimensions.get(itemFrame.dimensionId)
            if (dimension === undefined) {
                dimension = world.getDimension(itemFrame.dimensionId)
                dimensions.set(itemFrame.dimensionId, dimension)
            }
            const block = dimension.getBlockSafe(itemFrame.location)
            if (block !== undefined && !minecraftFrameTypes.includes(block.typeId)) {
                invalidItemFrames.add(itemFrame)
            }
            if ((index + 1) % 32 === 0) {
                yield
            }
        }

        let writeIndex = 0
        for (const itemFrame of itemFrames) {
            if (invalidItemFrames.has(itemFrame)) {
                continue
            }
            itemFrames[writeIndex] = itemFrame
            writeIndex++
        }
        itemFrames.length = writeIndex
    }
    catch (error) {
        console.error(error)
    }
    finally {
        itemFrameCleanupRunning = false
    }
}
