import {
    Entity,
    Player,
    system,
    World,
    world
} from "@minecraft/server"

import { compressToBase64 as compressToBase64Async } from "async-lz-string"

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

// async-lz-string pauses between slices of work with setTimeout, which the Bedrock script runtime does not provide
const globalScope = globalThis as unknown as Record<string, unknown>

if (globalScope.setTimeout === undefined) {
    globalScope.setTimeout = (callback: () => void, delay = 0) => {
        return system.runTimeout(callback, Math.max(1, Math.ceil(delay / 50)))
    }
}

type WorldSaveDataProperty = typeof worldSaveDataList[number]

interface SerializedWorldProperty {
    property: WorldSaveDataProperty["property"]
    json: string
}

interface CompressedWorldProperty {
    property: WorldSaveDataProperty["property"]
    valueString: string
}

// Incremented by every synchronous save, so an asynchronous save that was started earlier knows its snapshot is stale
let syncSaveCount = 0
let activeAsyncSave: Promise<void> | undefined

function serializeWorldProperty(world: World, property: WorldSaveDataProperty): SerializedWorldProperty | undefined {
    let value: any = world[property.property]

    if (property.compression !== undefined) {
        try {
            value = property.compression.compress(value)
        }
        catch (error) {
            console.error(`Failed to compress ${property.property}, keeping the previous save:`, error)
            return undefined
        }
    }

    return {
        property: property.property,
        json: JSON.stringify(value)
    }
}

function writeWorldSaveData(world: World, saves: CompressedWorldProperty[]) {
    const worldSaveDataIdList = world.getDynamicPropertyIds()
    const propertiesToDelete = []

    for (const { property, valueString } of saves) {
        let startingIndex = 0

        if (valueString.length > 32767) {
            const stringList = splitString(valueString, 32767)

            for (let j = 0; j < stringList.length; j++) {
                const saveString = stringList[j]
                world.setDynamicProperty(`${property}:${j}`, saveString)
            }

            startingIndex = stringList.length
            propertiesToDelete.push(property)
        }
        else {
            world.setDynamicProperty(property, valueString)
        }

        for (let j = startingIndex; worldSaveDataIdList.includes(`${property}:${j}`); j++) {
            propertiesToDelete.push(`${property}:${j}`)
        }
    }

    for (const propertyId of propertiesToDelete) {
        if (worldSaveDataIdList.includes(propertyId)) {
            world.setDynamicProperty(propertyId)
        }
    }
}

function saveWorldDataSync(world: World) {
    if (!world.loadedData) {
        return
    }
    syncSaveCount++

    const saves: CompressedWorldProperty[] = []

    for (const property of worldSaveDataList) {
        const serialized = serializeWorldProperty(world, property)
        if (serialized === undefined) {
            continue
        }
        saves.push({
            property: serialized.property,
            valueString: LZString.compressToBase64(serialized.json)
        })
    }

    writeWorldSaveData(world, saves)
}

async function saveWorldDataAsync(world: World) {
    const startingSyncSaveCount = syncSaveCount

    // Snapshot everything now, so the data that gets saved is the data as it was when the save was requested
    const serializedList: SerializedWorldProperty[] = []
    for (const property of worldSaveDataList) {
        const serialized = serializeWorldProperty(world, property)
        if (serialized !== undefined) {
            serializedList.push(serialized)
        }
    }

    const saves: CompressedWorldProperty[] = []
    for (const { property, json } of serializedList) {
        try {
            saves.push({
                property,
                valueString: await compressToBase64Async(json)
            })
        }
        catch (error) {
            console.error(`Failed to compress ${property} asynchronously, keeping the previous save:`, error)
        }
    }

    if (syncSaveCount !== startingSyncSaveCount) {
        // A synchronous save (such as the one on shutdown) already wrote newer data while this one was compressing
        return
    }

    writeWorldSaveData(world, saves)
}

World.prototype.saveData = function (this: World, asynchronous = false) {
    if (!asynchronous) {
        saveWorldDataSync(this)
        return undefined
    }

    if (!this.loadedData) {
        return Promise.resolve()
    }
    if (activeAsyncSave !== undefined) {
        return activeAsyncSave
    }

    const save = saveWorldDataAsync(this).finally(() => {
        activeAsyncSave = undefined
    })
    activeAsyncSave = save
    return save
} as World["saveData"]

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
    world.sendMessage("Running Autosave")
    world.saveData(true).then(()=> {
        world.sendMessage("Autosave Complete")
    }).catch((error: unknown) => {
        console.error("Asynchronous world save failed:", error)
    })
    loadEntities()
}, 1200)

function main() {
    world.loadData()
    loadEntities()
}

world.afterEvents.worldLoad.subscribe(() => {
    main()
})
