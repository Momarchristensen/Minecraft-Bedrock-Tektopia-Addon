import LZString from "lz-string"

import {
    Block,
    Dimension,
    DimensionTypes,
    Entity,
    ItemComponentTypes,
    ItemStack,
    MolangVariableMap,
    system,
    Vector3,
    World,
    world
} from "@minecraft/server"

import { blockSounds } from "./generated"

import {
    minVectors,
    maxVectors,
    floorVector,
    ceilVector,
    calculateDistance,
    calculateSquareDistance,
    randomInt,
    vectorToString,
    centerVector,
    addVectors,
    addVector,
    rotationToStructureRotation,
    stringToVector,
    areVectorsEqual,
    directionToVector,
    getOppositeDirection,
    vectorToDirection,
    subtractVectors,
    splitString,
    calculateAverage,
    removeIdentifier,
    copy,
    fix,
    formatTypeId
} from "./utils"


import {
    minecraftDangerousBlockTypes,
    worldSaveDataList,
    minecraftNonSolidBlocks
} from "./variables"

import { Village } from "./village"

import { NodeRequirement } from "."

import {
    checkNodeValidity,
    searchBlocks
} from "./path"

import { Registry } from "./registry"


system.beforeEvents.watchdogTerminate.subscribe((event) => {
    event.cancel = true
    world.sendMessage(`§cWatch dog tried to terminate: ${event.terminateReason}`)
})

const itemFrameRotations: Record<string, string> = {
    2: "south",
    3: "north",
    4: "east",
    5: "west"
}

const cardinalDirectionList = ["north", "east", "south", "west"]

World.prototype.saveData = function () {
    if (!this.loadedData) {
        return
    }
    const worldSaveDataIdList = this.getDynamicPropertyIds()
    const propertiesToDelete = []

    for (let i = 0; i < worldSaveDataList.length; i++) {
        const property = worldSaveDataList[i]
        let value: any = this[property.property]

        if (property.compression !== undefined) {
            try {
                value = property.compression.compress(value)
            }
            catch (error) {
                console.error(`Failed to compress ${property.property}, keeping the previous save:`, error)
                continue
            }
        }


        const valueString = LZString.compressToBase64(JSON.stringify(value))

        let startingIndex = 0

        if (valueString.length > 32767) {
            const stringList = splitString(valueString, 32767)

            for (let j = 0; j < stringList.length; j++) {
                const saveString = stringList[j]
                this.setDynamicProperty(`${property.property}:${j}`, saveString)
            }

            startingIndex = stringList.length
            propertiesToDelete.push(property.property)
        }
        else {
            this.setDynamicProperty(property.property, valueString)
        }

        for (let j = startingIndex; worldSaveDataIdList.includes(`${property.property}:${j}`); j++) {
            propertiesToDelete.push(`${property.property}:${j}`)
        }
    }

    for (let i = 0; i < propertiesToDelete.length; i++) {
        const propertyId = propertiesToDelete[i]
        if (worldSaveDataIdList.includes(propertyId)) {
            this.setDynamicProperty(propertyId)
        }
    }
}

World.prototype.loadData = function () {
    const ids = new Set(this.getDynamicPropertyIds())

    const readRaw = (key: string): string | undefined => {
        if (ids.has(key)) {
            return this.getDynamicProperty(key) as string
        }
        if (!ids.has(`${key}:0`)) {
            return undefined
        }

        let data = ""
        for (let i = 0; ids.has(`${key}:${i}`); i++) {
            data += this.getDynamicProperty(`${key}:${i}`) as string
        }
        return data
    }

    for (const property of worldSaveDataList) {
        const raw = readRaw(property.property)
        const json = raw === undefined ? null : LZString.decompressFromBase64(raw)

        let value = json !== undefined && json !== null && json !== "null" ? JSON.parse(json) : copy(property.default)

        if (property.compression) {
            value = property.compression.decompress(value)
        }

        this[property.property] = value
    }

    this.loadedData = true
}

system.beforeEvents.shutdown.subscribe(() => {
    world.saveData()
})

system.runInterval(() => {
    world.saveData()
}, 1200)

function requirementColor(requirement: NodeRequirement) {
    if (!requirement?.types?.length) {
        return { red: 0, green: 0, blue: 0 }
    }

    const key = [...requirement.types].sort().join(",") + (requirement.whiteList ? "+w" : "+b")
    const hash = hashString(key)

    let red = hash * 197 % 256
    let green = hash * 293 % 256
    let blue = hash * 503 % 256

    if (!requirement.whiteList) {
        red = red ^ 137
        green = green ^ 251
        blue = blue ^ 61
    }

    return { red: red / 255, green: green / 255, blue: blue / 255 }

    function hashString(str: string) {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
            hash = hash * 31 + str.charCodeAt(i) | 0
        }
        return hash >>> 0
    }
}



system.runInterval(() => {
    if (!world.loadedData) {
        return
    }

    if (!world.loadedData) {
        return
    }

    world.itemFrameList = world.itemFrameList.filter((itemFrame) => {
        const dimension = world.getDimension(itemFrame.dimensionId)
        const block = dimension.getBlockSafe(itemFrame.location)
        return !block || minecraftFrameTypes.includes(block.typeId)
    })


    const itemEntities = world.getEntities({ type: "item" })
    for (let i = 0; i < itemEntities.length; i++) {
        const entity = itemEntities[i]
        if (entity.unreachable) {
            entity.unreachable--
        }
    }

    const players = world.getAllPlayers()
    for (let i = 0; i < players.length; i++) {
        const player = players[i]
        const playerLocation = player.location

        const villageList = world.getVillages()
        for (let i = 0; i < villageList.length; i++) {
            const village = villageList[i]
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




function _tickDrawDebug() {
    system.runJob(drawDebug(_tickDrawDebug))
}
system.run(_tickDrawDebug)
function* drawDebug(callback: () => void) {
    try {
        if (!world.loadedData) {
            callback()
            return
        }
        const players = world.getAllPlayers()

        const rotate45 = new MolangVariableMap()
        rotate45.setFloat("rotation", 45)

        const rotate90 = new MolangVariableMap()
        rotate90.setFloat("rotation", 90)

        const rotate135 = new MolangVariableMap()
        rotate135.setFloat("rotation", 135)

        const villageList = world.getVillages()

        for (const player of players) {
            const playerPos = player.location
            const nearbyRange = 4
            const minY = Math.floor(playerPos.y) - 1
            const maxY = Math.floor(playerPos.y) + 1

            for (const village of villageList) {
                for (let dx = -nearbyRange; dx <= nearbyRange; dx++) {
                    for (let dy = minY - Math.floor(playerPos.y); dy <= maxY - Math.floor(playerPos.y); dy++) {
                        for (let dz = -nearbyRange; dz <= nearbyRange; dz++) {
                            const checkPos = {
                                x: Math.floor(playerPos.x + dx),
                                y: Math.floor(playerPos.y + dy),
                                z: Math.floor(playerPos.z + dz)
                            }
                            const key = vectorToString(checkPos)
                            if (!village.pathNodes.hasOwnProperty(key)) {
                                continue
                            }

                            const node = village.pathNodes[key]
                            if (node === undefined) {
                                continue
                            }

                            const particlePos = addVector(
                                centerVector(checkPos, true),
                                "y",
                                0.01
                            )
                            const colorMap = new MolangVariableMap()

                            let color
                            if (node.requirement !== undefined) {
                                color = requirementColor(node.requirement)
                            }
                            if (color === undefined) {
                                color = {
                                    red: 122 / 255,
                                    green: 122 / 255,
                                    blue: 122 / 255
                                }
                            }
                            colorMap.setColorRGB("color", color)

                            player.spawnParticle("tektopia:path_node", particlePos, colorMap)

                            const directionSet = new Set(
                                node.neighbors.map((neighborString) =>
                                    vectorToDirection(
                                        subtractVectors(stringToVector(neighborString), checkPos)
                                    )
                                )
                            )

                            const spawnConnection = (
                                offsetX: number,
                                offsetY: number,
                                offsetZ: number,
                                dir?: MolangVariableMap | string
                            ) => {
                                const pos = addVectors(
                                    addVector(centerVector(checkPos, true), "y", 0.02),
                                    { x: offsetX, y: offsetY, z: offsetZ }
                                )
                                try {
                                    if (typeof dir === "string") {
                                        player.spawnParticle(`tektopia:node_connection_${dir}`, pos)
                                    }
                                    else {
                                        player.spawnParticle("tektopia:node_connection", pos, dir)
                                    }
                                }
                                catch { }
                            }

                            if (directionSet.has("north")) {
                                spawnConnection(-0.1, 0, -0.5)
                            }
                            if (directionSet.has("east")) {
                                spawnConnection(0.5, 0, -0.1, rotate90)
                            }
                            if (directionSet.has("south")) {
                                spawnConnection(0.1, 0, 0.5)
                            }
                            if (directionSet.has("west")) {
                                spawnConnection(-0.5, 0, 0.1, rotate90)
                            }
                            if (directionSet.has("northeast")) {
                                spawnConnection(0.43, 0, -0.57, rotate135)
                            }
                            if (directionSet.has("northwest")) {
                                spawnConnection(-0.57, 0, -0.43, rotate45)
                            }
                            if (directionSet.has("southeast")) {
                                spawnConnection(0.57, 0, 0.43, rotate45)
                            }
                            if (directionSet.has("southwest")) {
                                spawnConnection(-0.43, 0, 0.57, rotate135)
                            }
                            if (directionSet.has("northdown")) {
                                spawnConnection(-0.1, -0.5, -0.5, "north")
                            }
                            if (directionSet.has("eastdown")) {
                                spawnConnection(0.5, -0.5, -0.1, "east")
                            }
                            if (directionSet.has("southdown")) {
                                spawnConnection(0.1, -0.5, 0.5, "south")
                            }
                            if (directionSet.has("westdown")) {
                                spawnConnection(-0.5, -0.5, 0.1, "west")
                            }
                            if (directionSet.has("northup")) {
                                spawnConnection(-0.1, 0.5, -0.5, "south")
                            }
                            if (directionSet.has("eastup")) {
                                spawnConnection(0.5, 0.5, -0.1, "west")
                            }
                            if (directionSet.has("southup")) {
                                spawnConnection(0.1, 0.5, 0.5, "north")
                            }
                            if (directionSet.has("westup")) {
                                spawnConnection(-0.5, 0.5, 0.1, "east")
                            }

                            yield
                        }
                    }
                }
            }
        }
    }
    finally {
        if (callback !== undefined) {
            callback()
        }
    }
}






ItemStack.prototype.makeVillageItem = function () {
    this.nameTag = `§r§a${formatTypeId(this.typeId)}`
    this.setLore(["§r§7Village Item"])
}














const minecraftNonSolidBlocksSet = new Set(minecraftNonSolidBlocks)








const averageTickRateList: number[] = []
let lastTickTime = Date.now()






Block.prototype.destroy = function () {
    if (!this.isValid) {
        return
    }
    const lootTableManager = world.getLootTableManager()
    const itemList = lootTableManager.generateLootFromBlock(this) ?? []
    const dimension = this.dimension
    for (let i = 0; i < itemList.length; i++) {
        const item = itemList[i]
        item.makeVillageItem()
        dimension.spawnItem(item, this.center())
    }
    this.soundEvent("break")
    this.setType("air")
}
Block.prototype.replace = function (blockType) {
    this.setType(blockType)
    this.soundEvent("place")
}
World.prototype.getEntities = function (options) {
    return DimensionTypes.getAll().flatMap((dimension) =>
        world.getDimension(dimension.typeId).getEntities(options)
    )
}
Block.prototype.soundEvent = function (eventId, soundOptions) {
    if (this.isAir) {
        return
    }
    const sound = blockSounds[removeIdentifier(this.typeId)]?.[eventId]
    if (sound === undefined) {
        console.warn(`Missing sound: ${this.typeId}`)
        return
    }
    if (soundOptions === undefined && typeof sound === "object" && sound !== null) {
        soundOptions = {}
        soundOptions.pitch = sound.pitch !== undefined ? resolveValue(sound.pitch) : 1
        soundOptions.volume = sound.volume !== undefined ? resolveValue(sound.volume) : 1
    }
    function resolveValue(value: number | [number, number]) {
        if (Array.isArray(value)) {
            return randomInt(value[0] * 10, value[1] * 10) / 10
        }
        return value
    }
    if (sound !== null) {
        this.playSound(typeof sound === "string" ? sound : sound.sound, soundOptions)
    }
}
Block.prototype.playSound = function (soundId, soundOptions) {
    this.dimension.playSound(soundId, this.center(), soundOptions)
}










Entity.prototype.lookAt = function (location, ignoreY = false) {
    const entity = this
    const entityLocation = entity.location
    const dx = location.x - entityLocation.x
    const dy = location.y - entityLocation.y
    const dz = location.z - entityLocation.z
    const yaw = Math.atan2(dz, dx) * (180 / Math.PI) - 90
    const pitch = -Math.atan2(dy, Math.sqrt(dx * dx + dz * dz)) * (180 / Math.PI)
    entity.setRotation({ x: ignoreY ? entity.getRotation().x : pitch, y: yaw })
}



const setCache = new WeakMap()

Array.prototype.includesFast = function (value) {
    let set = setCache.get(this)

    if (!set) {
        set = new Set(this)
        setCache.set(this, set)
    }

    return set.has(value)
}


Block.prototype.canWalkThrough = function () {
    return (
        (this.isAir || minecraftNonSolidBlocksSet.has(this.typeId) || this.destroyableLeaf()) && !this.isDangerous() && !this.isLiquid && !this.isWaterlogged
    )
}

Block.prototype.isDangerous = function () {
    return minecraftDangerousBlockTypes.includesFast(this.typeId)
}













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

world.afterEvents.playerBreakBlock.subscribe((event) => {
    const block = event.block
    const blockLocation = block.location
    const brokenBlockPermutation = event.brokenBlockPermutation
    const beforeBlockTypeId = brokenBlockPermutation.type.id
    if (minecraftFrameTypes.includes(beforeBlockTypeId)) {
        const itemFrameIndex = world.itemFrameList.findIndex((itemFrame) =>
            areVectorsEqual(itemFrame.location, blockLocation)
        )
        if (itemFrameIndex >= 0) {
            world.itemFrameList.splice(itemFrameIndex, 1)
        }
    }
})


world.afterEvents.playerPlaceBlock.subscribe((event) => {
    const block = event.block
    const blockLocation = block.location
    const blockDimension = event.dimension
    if (
        minecraftFrameTypes.includes(block.typeId) && !world.itemFrameList.some((itemFrame) =>
            areVectorsEqual(itemFrame.location, blockLocation)
        )) {
        world.itemFrameList.push({
            dimensionId: blockDimension.id,
            location: blockLocation
        })
    }
})

world.afterEvents.playerInteractWithBlock.subscribe((event) => {
    const block = event.block
    const blockLocation = block.location
    const blockDimension = block.dimension

    if (minecraftFrameTypes.includes(block.typeId) && !world.itemFrameList.some((itemFrame) => areVectorsEqual(itemFrame.location, blockLocation))) {
        world.itemFrameList.push({
            dimensionId: blockDimension.id,
            location: blockLocation
        })
    }
})

world.afterEvents.entityDie.subscribe((event) => {
    const deadEntity = event.deadEntity
    deadEntity.isDead = true
})

world.afterEvents.playerSpawn.subscribe((event) => {
    const player = event.player
    player.isDead = false
})



Array.prototype.remove = function (value) {
    const index = this.indexOf(value)
    if (index !== -1) {
        this.splice(index, 1)
    }
    return this
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

Dimension.prototype.placeStructureFrame = function (
    location,
    structureType,
    isEnchanted,
    rotation = "north"
) {
    const structureManager = world.structureManager
    const block = this.getBlockSafe(location)
    if (block) {
        const item = block.getFrameItem()
        const itemIsEnchanted = item !== undefined && Boolean(
            item.getComponent(ItemComponentTypes.Enchantable)?.getEnchantments()
                .length
        )
        if (
            !item || item.typeId.replace("tektopia:structure_", "") !== structureType || itemIsEnchanted !== isEnchanted
        ) {
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

Block.prototype.northSafe = function () {
    try {
        return this.north()
    }
    catch {
        return undefined
    }
}

Block.prototype.eastSafe = function () {
    try {
        return this.east()
    }
    catch {
        return undefined
    }
}

Block.prototype.southSafe = function () {
    try {
        return this.south()
    }
    catch {
        return undefined
    }
}

Block.prototype.westSafe = function () {
    try {
        return this.west()
    }
    catch {
        return undefined
    }
}

Block.prototype.aboveSafe = function () {
    try {
        return this.above()
    }
    catch {
        return undefined
    }
}

Block.prototype.belowSafe = function () {
    try {
        return this.below()
    }
    catch {
        return undefined
    }
}

Block.prototype.offsetSafe = function (offset) {
    try {
        return this.offset(offset)
    }
    catch {
        return undefined
    }
}

Dimension.prototype.getBlockSafe = function (location) {
    try {
        return this.getBlock(location)
    }
    catch {
        return undefined
    }
}



function main() {
    world.loadData()


    // const blockTagObject: Record<string, string[]> = {}
    // for (const blockTypeId of minecraftBlockTypes) {
    //     const blockTags = BlockPermutation.resolve(blockTypeId).getTags()
    //     blockTags.forEach((blockTag) => {
    //         blockTagObject[blockTag] ??= []
    //         blockTagObject[blockTag].push(blockTypeId)
    //     })
    // }










    Block.prototype.getIsSolid = function () {
        return this.isSolid || Registry.solidBlocksSet.has(this.typeId)
    }

    Block.prototype.canPathThrough = function () {
        return this.canWalkThrough() || Registry.doorTypes.includesFast(this.typeId)
    }

    Block.prototype.destroyableLeaf = function () {
        return (
            Registry.leafTypes.includesFast(this.typeId) && !this.permutation.getState("persistent_bit")
        )
    }




    system.runInterval(() => {
        if (!world.loadedData) {
            return
        }
        const tickSpeed = Math.floor(1000 / (Date.now() - lastTickTime))
        lastTickTime = Date.now()
        averageTickRateList.push(tickSpeed)
        if (averageTickRateList.length > 20) {
            averageTickRateList.shift()
        }
        const averageTickRate = calculateAverage(averageTickRateList)

        const players = world.getAllPlayers()
        for (const player of players) {
            player.onScreenDisplay.setActionBar(fix(averageTickRate).toString())
        }


        const villagers = world.getVillagers()
        for (let i = 0; i < villagers.length; i++) {
            const villager = villagers[i]
            try {
                villager.tickAI()
            }
            catch (error) {
                console.warn("Villager tick failed: ", error)
            }
        }
    })


    system.runInterval(() => {
        if (!world.loadedData) {
            return
        }
        const villageList = world.getVillages()
        for (let i = 0; i < villageList.length; i++) {
            const village = villageList[i]

            const dimension = world.getDimension(village.dimensionId)
            if (!village.searchingBlocks) {
                const doorBlock = dimension.getBlockSafe(village.doorLocation)
                if (doorBlock) {
                    village.searchingBlocks = true
                    system.runJob(
                        searchBlocks(village, doorBlock, true, function () {
                            village.searchingBlocks = false
                        })
                    )
                }
            }

            if (!village.deletingInvalidNodes) {
                village.deletingInvalidNodes = true
                system.runJob(deleteInvalidPathNodes())
                function* deleteInvalidPathNodes() {
                    const allVillagePathNodes = Object.keys(village.pathNodes)
                    try {
                        for (let j = 0; j < allVillagePathNodes.length; j++) {
                            if (!village.isValid) {
                                return
                            }
                            const pathNodeLocation = allVillagePathNodes[j]
                            checkNodeValidity(village, pathNodeLocation)
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





    function tickScanItemFrames() {
        system.runJob(scanItemFrames(() => system.runTimeout(tickScanItemFrames, 100)))
    }
    system.run(tickScanItemFrames)

    function* scanItemFrames(callback: () => void) {
        try {
            const villageItemFrameLocations = []
            for (let i = 0; i < world.itemFrameList.length; i++) {
                const itemFrame = world.itemFrameList[i]
                const dimension = world.getDimension(itemFrame.dimensionId)
                const itemFrameBlock = dimension.getBlockSafe(itemFrame.location)
                if (itemFrameBlock !== undefined) {
                    const block = itemFrameBlock
                    const item = block.getFrameItem()
                    const blockCenter = block.center()
                    const blockCenterString = vectorToString(blockCenter)
                    if (item !== undefined && item.typeId.startsWith("tektopia:structure_")) {
                        const facingDirection = block.permutation.getState("facing_direction")
                        if (!(facingDirection in itemFrameRotations)) {
                            if (item.typeId === "tektopia:structure_townhall") {
                                villageItemFrameLocations.push(blockCenterString)
                            }
                            continue
                        }
                        const rotation = itemFrameRotations[facingDirection]
                        const structureId = item.typeId.replace("tektopia:structure_", "")
                        itemFrame.structureId = structureId
                        let doorLocation: Vector3 | undefined
                        function* checkStructureValidation() {
                            if (!cardinalDirectionList.includes(rotation)) {
                                return false
                            }
                            const itemFrameOnBlock = block.offsetSafe(
                                directionToVector(rotation)
                            )
                            if (!itemFrameOnBlock) {
                                return false
                            }
                            const oppositeRotation = getOppositeDirection(rotation)
                            const offsetList = [{ x: 0, y: -1, z: 0 }].concat(
                                cardinalDirectionList
                                    .filter(
                                        (direction) =>
                                            direction !== rotation && direction !== oppositeRotation
                                    )
                                    .map((direction) => directionToVector(direction))
                            )
                            let foundDoor
                            for (let i = 0; i < offsetList.length; i++) {
                                const offset = offsetList[i]
                                const checkBlock = itemFrameOnBlock.offsetSafe(offset)
                                if (!checkBlock) {
                                    return false
                                }
                                if (Registry.doorTypes.includes(checkBlock.typeId)) {
                                    foundDoor = checkBlock
                                }
                            }
                            if (!foundDoor) {
                                return false
                            }
                            doorLocation = addVector(foundDoor.location, "y", -1)
                            const doorBlock = dimension.getBlockSafe(doorLocation)
                            if (doorBlock === undefined) {
                                return undefined
                            }
                            if (!Registry.doorTypes.includes(doorBlock.typeId)) {
                                return false
                            }
                            const villageList = world.getVillages()
                            if (structureId === "townhall") {
                                if (villageList.filter((village) => village.centerString !== blockCenterString).some((village) => calculateSquareDistance(village.center, blockCenter, true) < 200)) {
                                    return false
                                }
                            }
                            else {
                                if (!villageList.some((village) => calculateSquareDistance(village.center, blockCenter, true) <= 100)) {
                                    return false
                                }
                            }

                            const floorBlockList = []
                            const startingLocation = addVectors(
                                doorBlock,
                                directionToVector(rotation)
                            )
                            const checkLocationList = [
                                {
                                    floor: getFloorBlock(startingLocation),
                                    ceiling: getCeilingBlock(startingLocation)
                                }
                            ]
                            const alreadyCheckedLocations = new Set([vectorToString(addVector(doorLocation, "y", -1))])

                            let steps = 0
                            while (checkLocationList.length) {
                                const currentLocation = checkLocationList.shift()
                                if (currentLocation !== undefined) {
                                    if (currentLocation.ceiling && currentLocation.floor) {
                                        if (currentLocation.ceiling.y - currentLocation.floor.y > 2) {
                                            const floorLocationString = vectorToString(
                                                currentLocation.floor
                                            )
                                            if (!alreadyCheckedLocations.has(floorLocationString)) {
                                                alreadyCheckedLocations.add(floorLocationString)

                                                floorBlockList.push(currentLocation.floor.aboveSafe())

                                                const offsetList = [
                                                    { x: 1, y: 0, z: 0 },
                                                    { x: -1, y: 0, z: 0 },
                                                    { x: 0, y: 0, z: 1 },
                                                    { x: 0, y: 0, z: -1 }
                                                ]

                                                for (let i = 0; i < offsetList.length; i++) {
                                                    const offset = offsetList[i]
                                                    const offsetLocation = addVectors(
                                                        currentLocation.floor,
                                                        offset
                                                    )
                                                    if (
                                                        !alreadyCheckedLocations.has(
                                                            vectorToString(offsetLocation)
                                                        )
                                                    ) {
                                                        const checkLocation = addVector(offsetLocation, "y", 1)

                                                        let floorBlock = getFloorBlock(checkLocation)?.aboveSafe()
                                                        while (floorBlock?.isSolid) {
                                                            floorBlock = floorBlock.aboveSafe()
                                                        }
                                                        if (!floorBlock) {
                                                            return undefined
                                                        }

                                                        const ceilingBlock = getCeilingBlock(
                                                            floorBlock.location
                                                        )

                                                        floorBlock = floorBlock.belowSafe()
                                                        if (
                                                            floorBlock && ceilingBlock && ceilingBlock.y - floorBlock.y > 2 && currentLocation.ceiling.y - floorBlock.y > 2 && ceilingBlock.y - checkLocation.y >= 2
                                                        ) {
                                                            checkLocationList.push({
                                                                floor: floorBlock,
                                                                ceiling: ceilingBlock
                                                            })
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                if (++steps % 5 === 0) {
                                    yield
                                }
                            }


                            if (floorBlockList.length < 9) {
                                return false
                            }
                            return true

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
                        }
                        const result = yield* checkStructureValidation()
                        if (!block.isValid) {
                            if (item.typeId === "tektopia:structure_townhall") {
                                villageItemFrameLocations.push(blockCenterString)
                            }
                            continue
                        }
                        if (result !== undefined) {
                            if (result && doorLocation !== undefined) {
                                if (structureId === "townhall") {
                                    villageItemFrameLocations.push(blockCenterString)
                                    const villageList = world.getVillages()
                                    const villageStringCenterList = villageList.map(
                                        (village) => village.centerString
                                    )
                                    if (!villageStringCenterList.includes(blockCenterString)) {
                                        world.villageList.push(
                                            Village.createData(blockCenter, dimension.id, doorLocation)
                                        )
                                    }
                                }
                            }
                            dimension.placeStructureFrame(
                                block.location,
                                structureId,
                                result,
                                rotation
                            )
                        }
                        else if (structureId === "townhall") {
                            villageItemFrameLocations.push(blockCenterString)
                        }
                    }
                    else {
                        itemFrame.structureId = undefined
                    }
                }
                else if (itemFrame.structureId === "townhall") {
                    villageItemFrameLocations.push(
                        vectorToString(centerVector(itemFrame.location))
                    )
                }
                yield
            }
            const keep = new Set(villageItemFrameLocations)
            for (let i = world.villageList.length - 1; i >= 0; i--) {
                if (!keep.has(vectorToString(world.villageList[i].center))) {
                    world.villageList.splice(i, 1)
                }
            }
        }
        finally {
            if (callback !== undefined) {
                callback()
            }
        }
    }



    function tickUpdateVillage() {
        system.runJob(updateVillageBlocks(tickUpdateVillage))
    }

    system.run(tickUpdateVillage)
    function* updateVillageBlocks(callback: () => void) {
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
                for (let i = 0; i < village.saplingLocations.length; i++) {
                    const locationString = village.saplingLocations[i]
                    const location = stringToVector(locationString)
                    const block = dimension.getBlockSafe(location)
                    if (block === undefined) {
                        continue
                    }
                    if (Registry.logTypes.includesFast(block.typeId)) {
                        village.saplingLocations.splice(i, 1)
                        i--
                        village.treeLocations.push(locationString)
                    }
                    else if (!Registry.saplingTypes.includesFast(block.typeId)) {
                        village.saplingLocations.splice(i, 1)
                        i--
                    }
                    yield
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


}

world.afterEvents.worldLoad.subscribe(() => {
    main()
})

function _testLag() {
    if (world.lagTime === undefined) {
        world.lagTime = Date.now()
    }
    else {
        console.warn(Date.now() - world.lagTime)
        world.lagTime = undefined
    }
}
