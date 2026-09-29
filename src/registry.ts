import {
    BlockTypes,
    DimensionTypes,
    EntityTypes
} from "@minecraft/server"

import { subtractLists } from "./utils"

import { minecraftNonSolidBlocks } from "./variables"

function lazy<T>(compute: () => T): () => T {
    let cached: T
    let ready = false
    return () => {
        if (!ready) {
            cached = compute()
            ready = true
        }
        return cached
    }
}

function defineRegistry<T extends Record<string, () => unknown>>(definitions: T) {
    const registry = {} as { readonly [K in keyof T]: ReturnType<T[K]> }
    for (const key of Object.keys(definitions)) {
        Object.defineProperty(registry, key, {
            get: lazy(definitions[key]),
            enumerable: true
        })
    }
    return registry
}

const blocks = (test: (id: string) => boolean) => (): string[] => Registry.blockTypes.filter(test)
const entities = (test: (id: string) => boolean) => (): string[] => Registry.entityTypes.filter(test)

export const Registry = defineRegistry({
    blockTypes: (): string[] => BlockTypes.getAll().map((b) => b.id),
    entityTypes: (): string[] => EntityTypes.getAll().map((e) => e.id),

    trapdoorTypes: blocks((id) => id.includes("trapdoor")),
    doorTypes: blocks((id) => id.includes("_door") || id.includes("_fence_gate")),
    slabTypes: blocks((id) => id.includes("_slab") && !id.includes("_double_slab")),
    stairTypes: blocks((id) => id.includes("_stair")),
    fenceTypes: blocks((id) => id.includes("_fence") || id.includes("_wall") && !id.includes("_sign") && !id.includes("_fan")),
    saplingTypes: blocks((id) => id.includes("_sapling")),
    logTypes: blocks((id) => id.includes("_log") && !id.includes("stripped_")),
    leafTypes: blocks((id) => id.includes("_leaves")),

    villagerTypes: entities((id) => id.startsWith("tektopia:")),

    noWalkBlocks: (): string[] => [...Registry.fenceTypes, ...Registry.doorTypes, ...Registry.trapdoorTypes],
    solidBlocks: (): string[] => subtractLists(subtractLists(Registry.blockTypes, minecraftNonSolidBlocks), Registry.noWalkBlocks),
    solidBlocksSet: (): Set<string> => new Set(Registry.solidBlocks),
    lumberjackPickups: (): string[] => ["minecraft:apple", ...Registry.saplingTypes, ...Registry.logTypes],

    dimensionTypes: (): string[] => DimensionTypes.getAll().map((dimensionType) => dimensionType.typeId)
})
