import {
    Block,
    BlockPermutation,
    Dimension,
    ItemStack,
    world
} from "@minecraft/server"

import { blockSounds } from "./generated"

import { Registry } from "./registry"

import {
    randomInt,
    removeIdentifier
} from "./utils"

Block.prototype.northSafe = function (...args) {
    try {
        return this.north(...args)
    }
    catch {
        return undefined
    }
}

Block.prototype.eastSafe = function (...args) {
    try {
        return this.east(...args)
    }
    catch {
        return undefined
    }
}

Block.prototype.southSafe = function (...args) {
    try {
        return this.south(...args)
    }
    catch {
        return undefined
    }
}

Block.prototype.westSafe = function (...args) {
    try {
        return this.west(...args)
    }
    catch {
        return undefined
    }
}

Block.prototype.aboveSafe = function (...args) {
    try {
        return this.above(...args)
    }
    catch {
        return undefined
    }
}

Block.prototype.belowSafe = function (...args) {
    try {
        return this.below(...args)
    }
    catch {
        return undefined
    }
}

Block.prototype.offsetSafe = function (...args) {
    try {
        return this.offset(...args)
    }
    catch {
        return undefined
    }
}

Dimension.prototype.getBlockSafe = function (...args) {
    try {
        return this.getBlock(...args)
    }
    catch {
        return undefined
    }
}

Object.defineProperty(Block.prototype, "isDoor", {
    get(this: Block) {
        return Registry.openableDoorTypes.includes(this.typeId)
    }
})

Object.defineProperty(Block.prototype, "isOpenable", {
    get(this: Block) {
        return this.isDoor || Registry.fenceGateTypes.includes(this.typeId)
    }
})
Block.prototype.soundEvent = function (eventId, soundOptions) {
    let options = soundOptions !== undefined ? { ...soundOptions } : undefined
    if (this.isAir) {
        return
    }
    const sound = blockSounds[removeIdentifier(this.typeId)]?.[eventId]
    if (sound === undefined) {
        console.warn(`Missing sound: ${this.typeId}`)
        return
    }

    if (typeof sound === "object" && sound !== null) {
        options = {
            pitch: resolveValue(sound.pitch ?? 1),
            volume: resolveValue(sound.volume ?? 1),
            ...options
        }
    }

    function resolveValue(value: number | [number, number]) {
        if (Array.isArray(value)) {
            return randomInt(value[0] * 10, value[1] * 10) / 10
        }
        return value
    }

    if (sound !== null) {
        this.playSound(typeof sound === "string" ? sound : sound.sound, options)
    }
}

Block.prototype.playSound = function (soundId, soundOptions) {
    this.dimension.playSound(soundId, this.center(), soundOptions)
}

Block.prototype.destroy = function (villagerItem = false, playSound = true) {
    if (!this.isValid) {
        return
    }
    const lootTableManager = world.getLootTableManager()
    const itemList = lootTableManager.generateLootFromBlock(this, new ItemStack("minecraft:netherite_pickaxe")) ?? []
    const dimension = this.dimension
    for (const item of itemList) {
        if (villagerItem) {
            item.makeVillagerItem()
        }
        dimension.spawnItem(item, this.center())
    }
    if (playSound) {
        this.soundEvent("break")
    }
    this.setType("air")
}

Block.prototype.replace = function (replacement) {
    if (replacement instanceof BlockPermutation) {
        this.setPermutation(replacement)
    }
    else {
        this.setType(replacement)
    }

    this.soundEvent("place")
}
