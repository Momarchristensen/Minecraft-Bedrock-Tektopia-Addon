import {
    CommandPermissionLevel,
    CustomCommandStatus,
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
            // A generator so the work can be spread across ticks (system.runJob) or drained immediately when saving synchronously
            *compress(value: VillageSaveData[]): Generator<void, CompressedVillage[], void> {
                const compressed: CompressedVillage[] = []

                // Iterate over a snapshot so villages added or removed while the job is paused can't skip or duplicate entries
                for (const village of [...value]) {
                    compressed.push(yield* Village.compress(village))
                    yield
                }

                return compressed
            },
            decompress: (value: unknown) => {
                const villages: VillageSaveData[] = []
                if (!Array.isArray(value)) {
                    console.warn("Skipping village save data with an invalid list format.")
                    return villages
                }
                for (const compressed of value) {
                    try {
                        const village = Village.decompress(compressed)
                        if (village === undefined) {
                            console.warn("Skipping village save with missing or invalid required data.")
                            continue
                        }
                        villages.push(village)
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

let syncSaveCount = 0
let activeAsyncSave: Promise<void> | undefined

// Runs a generator to completion immediately, ignoring its yields
function runGeneratorSync<T>(generator: Generator<void, T, void>): T {
    let result = generator.next()
    while (!result.done) {
        result = generator.next()
    }
    return result.value
}

// Runs a generator across ticks with system.runJob and resolves with its return value
function runJobAsync<T>(generator: Generator<void, T, void>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        system.runJob(function* () {
            try {
                resolve(yield* generator)
            }
            catch (error) {
                reject(error)
            }
        }())
    })
}

function* serializeWorldProperty(worldObject: World, property: WorldSaveDataProperty): Generator<void, SerializedWorldProperty | undefined, void> {
    let value: any = worldObject[property.property]

    if (property.compression !== undefined) {
        try {
            value = yield* property.compression.compress(value)
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

function* serializeWorldProperties(worldObject: World): Generator<void, SerializedWorldProperty[], void> {
    const serializedList: SerializedWorldProperty[] = []

    for (const property of worldSaveDataList) {
        const serialized = yield* serializeWorldProperty(worldObject, property)
        if (serialized !== undefined) {
            serializedList.push(serialized)
        }
        yield
    }

    return serializedList
}

function writeWorldSaveData(worldInstance: World, saves: CompressedWorldProperty[]) {
    const worldSaveDataIdList = worldInstance.getDynamicPropertyIds()
    const propertiesToDelete = []

    for (const { property, valueString } of saves) {
        let startingIndex = 0

        if (valueString.length > 32767) {
            const stringList = splitString(valueString, 32767)

            for (let j = 0; j < stringList.length; j++) {
                const saveString = stringList[j]
                worldInstance.setDynamicProperty(`${property}:${j}`, saveString)
            }

            startingIndex = stringList.length
            propertiesToDelete.push(property)
        }
        else {
            worldInstance.setDynamicProperty(property, valueString)
        }

        for (let j = startingIndex; worldSaveDataIdList.includes(`${property}:${j}`); j++) {
            propertiesToDelete.push(`${property}:${j}`)
        }
    }

    for (const propertyId of propertiesToDelete) {
        if (worldSaveDataIdList.includes(propertyId)) {
            worldInstance.setDynamicProperty(propertyId)
        }
    }
}

function saveWorldDataSync(worldInstance: World) {
    if (!worldInstance.loadedData) {
        return
    }
    syncSaveCount++

    const saves: CompressedWorldProperty[] = []

    for (const serialized of runGeneratorSync(serializeWorldProperties(worldInstance))) {
        saves.push({
            property: serialized.property,
            valueString: LZString.compressToBase64(serialized.json)
        })
    }

    writeWorldSaveData(worldInstance, saves)
}

async function saveWorldDataAsync(worldInstance: World) {
    const startingSyncSaveCount = syncSaveCount

    const serializedList = await runJobAsync(serializeWorldProperties(worldInstance))

    const savePromises = serializedList.map(async ({ property, json }) => {
        try {
            return {
                property,
                valueString: await compressToBase64Async(json)
            }
        }
        catch (error) {
            console.error(`Failed to compress ${property} asynchronously, keeping the previous save:`, error)
            return undefined
        }
    })

    const saves = (await Promise.all(savePromises)).filter((save): save is CompressedWorldProperty => save !== undefined)

    if (syncSaveCount !== startingSyncSaveCount) {
        return
    }

    writeWorldSaveData(worldInstance, saves)
}

function saveWorldData(this: World, asynchronous?: false): void
function saveWorldData(this: World, asynchronous: true): Promise<void>

function saveWorldData(this: World, asynchronous = false): void | Promise<void> {
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
}

World.prototype.saveData = saveWorldData

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

World.prototype.autoSave = function () {
    world.sendMessage("Running Autosave")
    world.saveData(true).then(() => {
        world.sendMessage("Autosave Complete")
    }).catch((error: unknown) => {
        console.error("Asynchronous world save failed:", error)
    })
}

system.beforeEvents.startup.subscribe(event => {
    const customCommandRegistry = event.customCommandRegistry
    customCommandRegistry.registerCommand({
        name: "tektopia:autosave",
        cheatsRequired: false,
        description: "Trigger an autosave",
        permissionLevel: CommandPermissionLevel.Admin
    }, () => {
        system.run(() => world.autoSave())

        return {
            status: CustomCommandStatus.Success,
            message: "Autosave started."
        }
    })
})

system.runInterval(() => {
    world.autoSave()
    loadEntities()
}, 1200)

function main() {
    world.loadData()
    loadEntities()
}

world.afterEvents.worldLoad.subscribe(() => {
    main()
})
