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

function defineRegistry<T extends Record<string, (self: any) => unknown>>(definitions: T) {
    const registry = {} as { readonly [K in keyof T]: ReturnType<T[K]> }
    for (const key of Object.keys(definitions)) {
        Object.defineProperty(registry, key, {
            get: lazy(() => definitions[key]?.(registry)),
            enumerable: true
        })
    }
    return registry
}

interface RegistryShape {
    readonly blockTypes: string[]
    readonly entityTypes: string[]

    readonly trapdoorTypes: string[]
    readonly doorTypes: string[]
    readonly slabTypes: string[]
    readonly stairTypes: string[]
    readonly fenceTypes: string[]
    readonly gateTypes: string[]
    readonly saplingTypes: string[]
    readonly logTypes: string[]
    readonly leafTypes: string[]

    readonly villagerTypes: string[]

    readonly noWalkBlocks: string[]
    readonly solidBlocks: string[]
    readonly solidBlocksSet: Set<string>
    readonly lumberjackPickups: string[]

    readonly dimensionTypes: string[]

    readonly nonSolidBlocks: string[]
    readonly nonSolidBlocksSet: Set<string>
}

const blocks = (test: (id: string) => boolean) => (self: RegistryShape): string[] => self.blockTypes.filter(test)
const entities = (test: (id: string) => boolean) => (self: RegistryShape): string[] => self.entityTypes.filter(test)

export const Registry: RegistryShape = defineRegistry({
    blockTypes: (): string[] => BlockTypes.getAll().map(blockType => blockType.id),
    entityTypes: (): string[] => EntityTypes.getAll().map(entityType => entityType.id),

    trapdoorTypes: blocks(id => id.includes("trapdoor")),
    doorTypes: blocks(id => id.includes("_door") || id.includes("_fence_gate")),
    slabTypes: blocks(id => id.includes("_slab") && !id.includes("_double_slab")),
    stairTypes: blocks(id => id.includes("_stair")),
    fenceTypes: blocks(id => id.includes("_fence") || (id.includes("_wall") && !id.includes("_sign") && !id.includes("_fan"))),
    gateTypes: blocks(id => id.includes("_gate") && id.includes("fence")),
    saplingTypes: blocks(id => id.includes("_sapling")),
    logTypes: blocks(id => id.includes("_log") && !id.includes("stripped_")),
    leafTypes: blocks(id => id.includes("_leaves")),

    villagerTypes: entities(id => id.startsWith("tektopia:")),

    noWalkBlocks: (): string[] => [...Registry.fenceTypes, ...Registry.gateTypes, ...Registry.doorTypes, ...Registry.trapdoorTypes],
    solidBlocks: (): string[] => subtractLists(subtractLists(Registry.blockTypes, minecraftNonSolidBlocks), Registry.noWalkBlocks),
    solidBlocksSet: (): Set<string> => new Set(Registry.solidBlocks),
    lumberjackPickups: (): string[] => ["minecraft:apple", ...Registry.saplingTypes, ...Registry.logTypes],

    dimensionTypes: (): string[] => DimensionTypes.getAll().map(dimensionType => dimensionType.typeId),

    nonSolidBlocks: (): string[] => [...minecraftNonSolidBlocks, ...Registry.gateTypes],
    nonSolidBlocksSet: (): Set<string> => new Set(Registry.nonSolidBlocks)
})
