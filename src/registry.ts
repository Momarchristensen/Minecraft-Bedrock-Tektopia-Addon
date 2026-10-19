import {
    BlockTypes,
    DimensionTypes,
    EntityTypes,
    ItemStack,
    ItemTypes
} from "@minecraft/server"

import { subtractLists } from "./utils"

import type { TagId } from "./big_variables"

import type { Recipe } from "./recipes"

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

    liquidTypes: (): string[] => ["minecraft:water", "minecraft:flowing_water", "minecraft:lava", "minecraft:flowing_lava"],
    liquidTypesSet: (): Set<string> => new Set(Registry.liquidTypes),
    trapdoorTypes: blocks(id => id.includes("trapdoor")),
    doorTypes: (): string[] => [...Registry.itemTagItems["minecraft:door"] ?? []],
    openableDoorTypes: (): string[] => Registry.doorTypes.filter(id => id !== "minecraft:iron_door"),
    slabTypes: blocks(id => id.includes("_slab") && !id.includes("_double_slab")),
    stairTypes: blocks(id => id.includes("_stair")),
    fenceTypes: blocks(id => id.includes("_fence") || (id.includes("_wall") && !id.includes("_sign") && !id.includes("_fan"))),
    fenceGateTypes: blocks(id => id.includes("_gate") && id.includes("fence")),
    saplingTypes: blocks(id => id.includes("_sapling")),
    logTypes: blocks(id => id.includes("_log")),
    plankTypes: blocks(id => id.includes("_planks")),
    nonStrippedLogTypes: (): string[] => Registry.logTypes.filter(id => !id.includes("stripped_")),
    nonStrippedLogTypesSet: (): Set<string> => new Set(Registry.nonStrippedLogTypes),
    leafTypes: blocks(id => id.includes("_leaves")),
    oreTypes: blocks(id => id.endsWith("_ore")),
    pressurePlateTypes: blocks(id => id.endsWith("_pressure_plate")),

    nonFloorBlocks: (): string[] => ["minecraft:crafting_table", "minecraft:anvil", "minecraft:furnace", "minecraft:lit_furnace", "minecraft:blast_furnace", "minecraft:smoker", "minecraft:lit_blast_furnace", "minecraft:lit_smoker"],
    nonFloorBlocksSet: (): Set<string> => new Set(Registry.nonFloorBlocks),

    villagerTypes: entities(id => id.startsWith("tektopia:villager_")),

    woolTypes: (): string[] => Registry.itemTagItems["minecraft:wool"]?.filter(id => !id.includes("_stairs") && !id.includes("_slab")) ?? [],
    eggTypes: (): string[] => Registry.itemTagItems["minecraft:egg"] ?? [],

    noWalkBlocks: (): string[] => [...Registry.fenceTypes, ...Registry.fenceGateTypes, ...Registry.doorTypes, ...Registry.trapdoorTypes, "tektopia:chair"],
    solidBlocks: (): string[] => subtractLists(Registry.blockTypes, [
        ...Registry.nonSolidBlocks,
        ...Registry.noWalkBlocks,
        ...Registry.chestTypes,
        "minecraft:bed",
        ...Registry.fenceTypes,
        ...Registry.pressurePlateTypes
    ]),
    solidBlocksSet: (): Set<string> => new Set(Registry.solidBlocks),

    chestTypes: blocks(id => id.endsWith("chest")),
    chestTypesSet: (): Set<string> => new Set(Registry.chestTypes),
    storageChestTypes: (): string[] => Registry.chestTypes.filter(id => id !== "minecraft:ender_chest"),

    dimensionTypes: (): string[] => DimensionTypes.getAll().map(dimensionType => dimensionType.typeId),

    pathBlockCosts: (): Map<string, number> => new Map<string, number>([
        ["minecraft:dirt_path", -0.25],
        ["minecraft:cobbled_deepslate", -0.25],
        ["minecraft:deepslate", -0.25],
        ["minecraft:stone_bricks", -0.5],
        ["minecraft:grass_path", -1],
        ["minecraft:farmland", 3],
        ["minecraft:web", 12],
        ...Registry.fenceGateTypes.map((id): [string, number] => [id, 6]),
        ...Registry.doorTypes.map((id): [string, number] => [id, 6])
    ]),

    dirtTypes: (): string[] => [
        "minecraft:mycelium",
        "minecraft:pale_moss_block",
        "minecraft:coarse_dirt",
        "minecraft:podzol",
        "minecraft:muddy_mangrove_roots",
        "minecraft:farmland",
        "minecraft:dirt_with_roots",
        "minecraft:dirt",
        "minecraft:grass_block",
        "minecraft:moss_block",
        "minecraft:mud"
    ],

    dirtTypesSet: (): Set<string> => new Set(Registry.dirtTypes),

    dangerousTypes: (): string[] => [
        ...Registry.liquidTypes,
        "minecraft:magma",
        "minecraft:fire",
        "minecraft:soul_fire",
        "minecraft:cactus",
        "minecraft:powder_snow",
        "minecraft:campfire",
        "minecraft:soul_campfire",
        "minecraft:sweet_berry_bush"
    ],
    dangerousTypesSet: (): Set<string> => new Set(Registry.dangerousTypes),

    carpetTypes: (): string[] => Registry.blockTypes.filter(id => id.endsWith("_carpet")),
    signTypes: blocks(id => id.endsWith("_sign")),
    railTypes: (): string[] => [
        ...Registry.blockTypes.filter(id => id.endsWith("_rail")),
        "minecraft:rail"
    ],
    torchTypes: blocks(id => id.includes("torch")),
    headTypes: blocks(id => id.endsWith("_head") || id.endsWith("_skull")),
    lightBlockTypes: blocks(id => id.startsWith("minecraft:light_block_")),
    coralPlantTypes: blocks(id => id.includes("coral") && !id.endsWith("_block")),
    redstoneComponentTypes: (): string[] => [
        ...Registry.blockTypes.filter(id => id.includes("repeater") || id.includes("comparator")),
        "minecraft:redstone_wire"
    ],
    tulipTypes: blocks(id => id.endsWith("_tulip")),
    mushroomTypes: blocks(id => id.endsWith("_mushroom")),
    fungusTypes: blocks(id => id.endsWith("_fungus")),
    vineTypes: blocks(id => id.includes("vine")),
    eyeblossomTypes: blocks(id => id.includes("eyeblossom")),

    cropTypes: (): string[] => [
        ...Registry.blockTypes.filter(id => id.endsWith("_crop")),
        "minecraft:wheat",
        "minecraft:potatoes",
        "minecraft:carrots",
        "minecraft:beetroot",
        "minecraft:melon_stem",
        "minecraft:pumpkin_stem"
    ],

    plantTypes: (): string[] => [
        ...Registry.blockTypes.filter(id =>
            id.endsWith("_grass")
            || id.endsWith("fern")
            || (id.endsWith("_roots") && id !== "minecraft:muddy_mangrove_roots" && id !== "minecraft:mangrove_roots")
        ),
        "minecraft:deadbush",
        "minecraft:seagrass",
        "minecraft:kelp",
        "minecraft:reeds",
        "minecraft:waterlily",
        "minecraft:big_dripleaf",
        "minecraft:small_dripleaf_block",
        "minecraft:spore_blossom",
        "minecraft:azalea",
        "minecraft:flowering_azalea",
        "minecraft:bush",
        "minecraft:firefly_bush",
        "minecraft:sweet_berry_bush",
        "minecraft:rose_bush",
        "minecraft:pitcher_plant",
        "minecraft:chorus_plant",
        "minecraft:chorus_flower",
        "minecraft:mangrove_propagule",
        "minecraft:nether_sprouts",
        "minecraft:nether_wart",
        "minecraft:cocoa",
        "minecraft:sea_pickle",
        "minecraft:pale_hanging_moss",
        "minecraft:leaf_litter",
        "minecraft:glow_lichen"
    ],

    flowerTypes: (): string[] => [
        ...Registry.blockTypes.filter(id =>
            id.endsWith("_tulip")
            || id.endsWith("_petals")
            || id.endsWith("_orchid")
            || id.endsWith("_rose")
        ),
        "minecraft:dandelion",
        "minecraft:poppy",
        "minecraft:allium",
        "minecraft:azure_bluet",
        "minecraft:cornflower",
        "minecraft:lily_of_the_valley",
        "minecraft:oxeye_daisy",
        "minecraft:sunflower",
        "minecraft:lilac",
        "minecraft:peony",
        "minecraft:torchflower",
        "minecraft:cactus_flower",
        "minecraft:wildflowers"
    ],

    fireTypes: (): string[] => [
        "minecraft:fire",
        "minecraft:soul_fire"
    ],

    nonSolidBlocks: (): string[] => [...new Set([
        ...Registry.liquidTypes,
        ...Registry.carpetTypes,
        ...Registry.signTypes,
        ...Registry.railTypes,
        ...Registry.torchTypes,
        ...Registry.headTypes,
        ...Registry.lightBlockTypes,
        ...Registry.coralPlantTypes,
        ...Registry.redstoneComponentTypes,
        ...Registry.mushroomTypes,
        ...Registry.fungusTypes,
        ...Registry.vineTypes,
        ...Registry.eyeblossomTypes,
        ...Registry.cropTypes,
        ...Registry.plantTypes,
        ...Registry.flowerTypes,
        ...Registry.saplingTypes,
        ...Registry.fireTypes,
        "minecraft:air",
        "minecraft:web",
        "minecraft:powder_snow",
        "minecraft:snow_layer",
        "minecraft:frog_spawn",
        "minecraft:bubble_column",
        "minecraft:end_rod",
        "minecraft:lever",
        "minecraft:tripwire_hook",
        "minecraft:trip_wire",
        "minecraft:flower_pot",
        "minecraft:frame",
        "minecraft:glow_frame",
        "minecraft:lantern",
        "minecraft:compound_creator",
        "minecraft:lab_table",
        "minecraft:element_constructor",
        "minecraft:material_reducer"
    ])],
    nonSolidBlocksSet: (): Set<string> => new Set(Registry.nonSolidBlocks),

    craftingRecipes: (): Recipe[] => {
        const recipes: Recipe[] = [
            {
                input: [{
                    id: "minecraft:iron_ingot",
                    amount: 2
                }],
                output: {
                    id: "minecraft:shears",
                    amount: 1
                }
            },
            {
                input: [{
                    id: Registry.plankTypes,
                    amount: 2
                }],
                output: {
                    id: "minecraft:stick",
                    amount: 4
                }
            },
            {
                input: [
                    {
                        id: Registry.plankTypes,
                        amount: 3
                    },
                    {
                        id: "minecraft:stick",
                        amount: 2
                    }
                ],
                output: {
                    id: "minecraft:wooden_axe",
                    amount: 1
                }
            },
            {
                input: [
                    {
                        id: Registry.plankTypes,
                        amount: 2
                    },
                    {
                        id: "minecraft:stick",
                        amount: 2
                    }
                ],
                output: {
                    id: "minecraft:wooden_hoe",
                    amount: 1
                }
            },
            {
                input: [
                    {
                        id: Registry.plankTypes,
                        amount: 2
                    },
                    {
                        id: "minecraft:stick",
                        amount: 1
                    }
                ],
                output: {
                    id: "minecraft:wooden_sword",
                    amount: 1
                }
            },
            {
                input: [
                    {
                        id: Registry.plankTypes,
                        amount: 3
                    },
                    {
                        id: "minecraft:stick",
                        amount: 2
                    }
                ],
                output: {
                    id: "minecraft:wooden_pickaxe",
                    amount: 1
                }
            },
            {
                input: [
                    {
                        id: "minecraft:coal",
                        amount: 1
                    },
                    {
                        id: "minecraft:stick",
                        amount: 2
                    }
                ],
                output: {
                    id: "minecraft:torch",
                    amount: 4
                }
            },
            {
                input: [
                    {
                        id: "minecraft:charcoal",
                        amount: 1
                    },
                    {
                        id: "minecraft:stick",
                        amount: 2
                    }
                ],
                output: {
                    id: "minecraft:torch",
                    amount: 4
                }
            },

            {
                input: [
                    {
                        id: "minecraft:copper_ingot",
                        amount: 3
                    },
                    {
                        id: "minecraft:stick",
                        amount: 2
                    }
                ],
                output: {
                    id: "minecraft:copper_pickaxe",
                    amount: 1
                }
            },
            {
                input: [
                    {
                        id: "minecraft:copper_ingot",
                        amount: 3
                    },
                    {
                        id: "minecraft:stick",
                        amount: 2
                    }
                ],
                output: {
                    id: "minecraft:copper_axe",
                    amount: 1
                }
            },
            {
                input: [
                    {
                        id: "minecraft:copper_ingot",
                        amount: 1
                    },
                    {
                        id: "minecraft:stick",
                        amount: 2
                    }
                ],
                output: {
                    id: "minecraft:copper_hoe",
                    amount: 1
                }
            },
            {
                input: [
                    {
                        id: "minecraft:copper_ingot",
                        amount: 2
                    },
                    {
                        id: "minecraft:stick",
                        amount: 1
                    }
                ],
                output: {
                    id: "minecraft:copper_sword",
                    amount: 1
                }
            },
            {
                input: [
                    {
                        id: "minecraft:copper_ingot",
                        amount: 5
                    }
                ],
                output: {
                    id: "minecraft:copper_helmet",
                    amount: 1
                }
            },
            {
                input: [
                    {
                        id: "minecraft:copper_ingot",
                        amount: 8
                    }
                ],
                output: {
                    id: "minecraft:copper_chestplate",
                    amount: 1
                }
            },
            {
                input: [
                    {
                        id: "minecraft:copper_ingot",
                        amount: 7
                    }
                ],
                output: {
                    id: "minecraft:copper_leggings",
                    amount: 1
                }
            },
            {
                input: [
                    {
                        id: "minecraft:copper_ingot",
                        amount: 4
                    }
                ],
                output: {
                    id: "minecraft:copper_boots",
                    amount: 1
                }
            },

            {
                input: [
                    {
                        id: "minecraft:iron_ingot",
                        amount: 3
                    },
                    {
                        id: "minecraft:stick",
                        amount: 2
                    }
                ],
                output: {
                    id: "minecraft:iron_pickaxe",
                    amount: 1
                }
            },
            {
                input: [
                    {
                        id: "minecraft:iron_ingot",
                        amount: 3
                    },
                    {
                        id: "minecraft:stick",
                        amount: 2
                    }
                ],
                output: {
                    id: "minecraft:iron_axe",
                    amount: 1
                }
            },
            {
                input: [
                    {
                        id: "minecraft:iron_ingot",
                        amount: 1
                    },
                    {
                        id: "minecraft:stick",
                        amount: 2
                    }
                ],
                output: {
                    id: "minecraft:iron_hoe",
                    amount: 1
                }
            },
            {
                input: [
                    {
                        id: "minecraft:iron_ingot",
                        amount: 2
                    },
                    {
                        id: "minecraft:stick",
                        amount: 1
                    }
                ],
                output: {
                    id: "minecraft:iron_sword",
                    amount: 1
                }
            },
            {
                input: [
                    {
                        id: "minecraft:iron_ingot",
                        amount: 5
                    }
                ],
                output: {
                    id: "minecraft:iron_helmet",
                    amount: 1
                }
            },
            {
                input: [
                    {
                        id: "minecraft:iron_ingot",
                        amount: 8
                    }
                ],
                output: {
                    id: "minecraft:iron_chestplate",
                    amount: 1
                }
            },
            {
                input: [
                    {
                        id: "minecraft:iron_ingot",
                        amount: 7
                    }
                ],
                output: {
                    id: "minecraft:iron_leggings",
                    amount: 1
                }
            },
            {
                input: [
                    {
                        id: "minecraft:iron_ingot",
                        amount: 4
                    }
                ],
                output: {
                    id: "minecraft:iron_boots",
                    amount: 1
                }
            },
            {
                input: [
                    {
                        id: "minecraft:diamond",
                        amount: 3
                    },
                    {
                        id: "minecraft:stick",
                        amount: 2
                    }
                ],
                output: {
                    id: "minecraft:diamond_pickaxe",
                    amount: 1
                }
            },
            {
                input: [
                    {
                        id: "minecraft:diamond",
                        amount: 3
                    },
                    {
                        id: "minecraft:stick",
                        amount: 2
                    }
                ],
                output: {
                    id: "minecraft:diamond_axe",
                    amount: 1
                }
            },
            {
                input: [
                    {
                        id: "minecraft:diamond",
                        amount: 1
                    },
                    {
                        id: "minecraft:stick",
                        amount: 2
                    }
                ],
                output: {
                    id: "minecraft:diamond_hoe",
                    amount: 1
                }
            },
            {
                input: [
                    {
                        id: "minecraft:diamond",
                        amount: 2
                    },
                    {
                        id: "minecraft:stick",
                        amount: 1
                    }
                ],
                output: {
                    id: "minecraft:diamond_sword",
                    amount: 1
                }
            },
            {
                input: [
                    {
                        id: "minecraft:diamond",
                        amount: 5
                    }
                ],
                output: {
                    id: "minecraft:diamond_helmet",
                    amount: 1
                }
            },
            {
                input: [
                    {
                        id: "minecraft:diamond",
                        amount: 8
                    }
                ],
                output: {
                    id: "minecraft:diamond_chestplate",
                    amount: 1
                }
            },
            {
                input: [
                    {
                        id: "minecraft:diamond",
                        amount: 7
                    }
                ],
                output: {
                    id: "minecraft:diamond_leggings",
                    amount: 1
                }
            },
            {
                input: [
                    {
                        id: "minecraft:diamond",
                        amount: 4
                    }
                ],
                output: {
                    id: "minecraft:diamond_boots",
                    amount: 1
                }
            },
            {
                input: [
                    {
                        id: "minecraft:iron_ingot",
                        amount: 2
                    }
                ],
                output: {
                    id: "minecraft:shears",
                    amount: 1
                }
            },
            {
                input: {
                    id: "minecraft:raw_iron",
                    amount: 1
                },
                output: {
                    id: "minecraft:iron_ingot",
                    amount: 1
                },
                usesFurnace: true
            }
        ]

        for (const id of Registry.logTypes) {
            recipes.push({
                input: [{
                    id,
                    amount: 1
                }],
                output: {
                    id: `${id.replace("stripped_", "").replace("_log", "")}_planks`,
                    amount: 4
                }
            })

            recipes.push({
                input: {
                    id,
                    amount: 1
                },
                output: {
                    id: "minecraft:charcoal",
                    amount: 1
                },
                usesFurnace: true
            })
        }

        return recipes
    }
})
