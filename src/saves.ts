import {
    Entity,
    Player,
    system,
    World,
    world
} from "@minecraft/server"

import LZString from "lz-string"

import {
    copy,
    splitString
} from "./utils"

import { Village } from "./village"

import type { BreedingSaveData } from "./breed"

import type {
    CompressedVillage,
    VillageSaveData
} from "./village_serialization"

export const worldSaveDataList = [
    {
        property: "itemFrameList",
        default: [],
        compression: undefined
    },
    {
        property: "villageList",
        default: [],
        compression: {
            compress: (value: VillageSaveData[]) => value.map(village => Village.compress(village)),
            decompress: (value: CompressedVillage[]) => {
                const villages: VillageSaveData[] = []
                for (const compressed of value) {
                    try {
                        villages.push(Village.decompress(compressed))
                    }
                    catch (error) {
                        console.error("Skipping unreadable village:", error)
                    }
                }
                return villages
            }
        }
    }
] as const

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

        let value = json !== null && json !== "null" ? JSON.parse(json) : copy(property.default)

        if (property.compression !== undefined) {
            value = property.compression.decompress(value)
        }

        this[property.property] = value
    }

    this.loadedData = true
}

World.prototype.saveData = function () {
    if (!this.loadedData) {
        return
    }
    const worldSaveDataIdList = this.getDynamicPropertyIds()
    const propertiesToDelete = []

    for (const property of worldSaveDataList) {
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

    for (const propertyId of propertiesToDelete) {
        if (worldSaveDataIdList.includes(propertyId)) {
            this.setDynamicProperty(propertyId)
        }
    }
}

export interface EntityData {
    breedingData?: BreedingSaveData | undefined
    villagerEntity?: boolean
}

Entity.prototype.saveData = function <K extends keyof EntityData>(
    this: Entity,
    propertyId: K
) {
    if (!this.loadedData || this instanceof Player || !this.isValid) {
        return
    }
    this.setDynamicProperty(propertyId, JSON.stringify(this[propertyId]))
}

Entity.prototype.loadData = function (this: Entity) {
    if (this instanceof Player || !this.isValid) {
        return
    }

    const target = this as unknown as Record<string, unknown>

    for (const propertyId of this.getDynamicPropertyIds()) {
        const valueString = this.getDynamicProperty(propertyId)
        if (typeof valueString !== "string") {
            continue
        }

        try {
            target[propertyId] = JSON.parse(valueString)
        }
        catch (error) {
            console.warn(`Failed to read entity property ${propertyId}:`, error)
        }
    }

    this.loadedData = true
}

world.afterEvents.entitySpawn.subscribe(event => {
    const entity = event.entity
    entity.loadData()
})

world.afterEvents.entityLoad.subscribe(event => {
    const entity = event.entity
    entity.loadData()
})

function loadEntities() {
    for (const entity of world.getEntities()) {
        if (!entity.loadedData) {
            entity.loadData()
        }
    }
}

system.beforeEvents.shutdown.subscribe(() => {
    world.saveData()
})

system.runInterval(() => {
    world.saveData()
    loadEntities()
}, 1200)

function main() {
    world.loadData()
    loadEntities()
}

world.afterEvents.worldLoad.subscribe(() => {
    main()
})
