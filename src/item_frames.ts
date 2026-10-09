import {
    Block,
    Dimension,
    ItemComponentTypes,
    system,
    world
} from "@minecraft/server"

import {
    areVectorsEqual,
    centerVector,
    getItemFrameRotation,
    rotationToStructureRotation,
    locationToString
} from "./utils"

import { Village } from "./village"

import type { StructureType } from "./structure"

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
            const rotation = getItemFrameRotation(facingDirection)

            if (rotation === undefined) {
                if (isTownhall) {
                    villageItemFrameLocations.push(blockCenterString)
                }
                yield
                continue
            }

            const structureId = item.typeId.replace("tektopia:structure_", "") as StructureType
            itemFrame.structureId = structureId

            const structureValidation = yield* dimension.validateStructure(block, rotation, structureId)

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
                if (result) {
                    if (isTownhall) {
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
                            village.addStructure(doorLocation ?? itemFrame.location, {
                                type: structureId,
                                rotation
                            })

                            if (structureId === "storage") {
                                if (structureValidation.floorLocations !== undefined) {
                                    const chestList = []
                                    for (const floorLocation of structureValidation.floorLocations) {
                                        const floorBlock = dimension.getBlockSafe(floorLocation)
                                        if (floorBlock?.typeId !== "minecraft:chest") {
                                            continue
                                        }

                                        chestList.push(floorBlock)
                                    }

                                    village.storage.setContainers(chestList)
                                }
                            }
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
    finally {
        itemFrameCleanupRunning = false
    }
}
