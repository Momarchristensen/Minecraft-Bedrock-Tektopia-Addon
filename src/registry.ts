import {
    BlockTypes,
    DimensionTypes,
    EntityTypes,
    ItemStack,
    ItemTypes
} from "@minecraft/server"

import { subtractLists } from "./utils"

import {
    minecraftNonSolidBlocks,
    type TagId
} from "./variables"

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

const blocks = (test: (id: string) => boolean) =>
    (self: { blockTypes: string[] }): string[] => self.blockTypes.filter(test)

const entities = (test: (id: string) => boolean) =>
    (self: { entityTypes: string[] }): string[] => self.entityTypes.filter(test)

export const Registry = defineRegistry({
    blockTypes: (): string[] => BlockTypes.getAll().map(blockType => blockType.id),
    entityTypes: (): string[] => EntityTypes.getAll().map(entityType => entityType.id),

    itemTagItems: (): Partial<Record<TagId, string[]>> => {
        const result: Partial<Record<TagId, string[]>> = {}
        for (const itemType of ItemTypes.getAll()) {
            let tags: string[]
            try {
                tags = new ItemStack(itemType).getTags()
            }
            catch {
                continue
            }
            for (const tag of tags as TagId[]) {
                (result[tag] ??= []).push(itemType.id)
            }
        }
        return result
    },

    trapdoorTypes: blocks(id => id.includes("trapdoor")),
    doorTypes: (): string[] => [...Registry.itemTagItems["minecraft:door"] ?? []],
    openableDoorTypes: (): string[] => Registry.doorTypes.filter(id => id !== "minecraft:iron_door"),
    slabTypes: blocks(id => id.includes("_slab") && !id.includes("_double_slab")),
    stairTypes: blocks(id => id.includes("_stair")),
    fenceTypes: blocks(id => id.includes("_fence") || (id.includes("_wall") && !id.includes("_sign") && !id.includes("_fan"))),
    fenceGateTypes: blocks(id => id.includes("_gate") && id.includes("fence")),
    saplingTypes: blocks(id => id.includes("_sapling")),
    logTypes: blocks(id => id.includes("_log") && !id.includes("stripped_")),
    leafTypes: blocks(id => id.includes("_leaves")),

    villagerTypes: entities(id => id.startsWith("tektopia:")),

    woolTypes: (): string[] => Registry.itemTagItems["minecraft:wool"]?.filter(id => !id.includes("_stairs") && !id.includes("_slab")) ?? [],
    eggTypes: (): string[] => Registry.itemTagItems["minecraft:egg"] ?? [],

    noWalkBlocks: (): string[] => [...Registry.fenceTypes, ...Registry.fenceGateTypes, ...Registry.doorTypes, ...Registry.trapdoorTypes],
    solidBlocks: (): string[] => subtractLists(subtractLists(Registry.blockTypes, minecraftNonSolidBlocks), Registry.noWalkBlocks),
    solidBlocksSet: (): Set<string> => new Set(Registry.solidBlocks),

    dimensionTypes: (): string[] => DimensionTypes.getAll().map(dimensionType => dimensionType.typeId),

    nonSolidBlocks: (): string[] => [...minecraftNonSolidBlocks, ...Registry.fenceGateTypes],
    nonSolidBlocksSet: (): Set<string> => new Set(Registry.nonSolidBlocks),

    pathBlockCosts: (): Map<string, number> => new Map<string, number>([
        ["minecraft:dirt_path", -0.25],
        ["minecraft:cobbled_deepslate", -0.25],
        ["minecraft:deepslate", -0.25],
        ["minecraft:stone_bricks", -0.5],
        ["minecraft:grass_path", -1],
        ["minecraft:farmland", 3],
        ["minecraft:web", 12],
        ...Registry.fenceGateTypes.map((id): [string, number] => [id, 6])
    ])
})