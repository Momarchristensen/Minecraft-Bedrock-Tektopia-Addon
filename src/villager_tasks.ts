import {
    ItemStack,
    type Container
} from "@minecraft/server"

import { Registry } from "./registry"

import { randomInt } from "./utils"

import type { CraftStep } from "./recipes"

import type { Village } from "./village"

import type { Villager } from "./villager"

const CROP_SEEDS: Record<string, string> = {
    "minecraft:wheat": "minecraft:wheat_seeds",
    "minecraft:beetroot": "minecraft:beetroot_seeds",
    "minecraft:carrots": "minecraft:carrot",
    "minecraft:potatoes": "minecraft:potato",
    "minecraft:melon_stem": "minecraft:melon_seeds",
    "minecraft:pumpkin_stem": "minecraft:pumpkin_seeds"
}

export const SEED_ITEMS: readonly string[] = [...new Set(Object.values(CROP_SEEDS))]

export const SEED_CARRY_AMOUNT = 8

export const SEED_KEEP: Readonly<Record<string, number>> = Object.fromEntries(
    SEED_ITEMS.map(seed => [seed, SEED_CARRY_AMOUNT])
)

export type UpgradableToolType = (typeof upgradableToolTypes)[number]

export type ArmorType = (typeof armorTypes)[number]

export type VillagerToolType = ArmorType | UpgradableToolType | "shears"

export const upgradableToolTypes = ["axe", "hoe", "sword", "pickaxe"] as const
export const armorTypes = ["helmet", "chestplate", "leggings", "boots"] as const

export type DepositPlan = Record<string, number>

export interface ToolUpgradePlan {
    newId: string
    oldId: string | undefined
}

export interface ToolCraftPlan {
    itemId: string
    crafting?: {
        plan: CraftStep[]
        items: Record<string, number>
        doneSteps?: number[]
        haveItems?: boolean
    }
}

const toolMaterials = [
    "wooden",
    "golden",
    "stone",
    "copper",
    "iron",
    "diamond",
    "netherite"
] as const

const armorMaterials = [
    "leather",
    "copper",
    "golden",
    "chainmail",
    "iron",
    "diamond",
    "netherite"
] as const

export function getToolCategory(toolType: VillagerToolType) {
    if (upgradableToolTypes.includes(toolType as UpgradableToolType)) {
        return "tool"
    }
    if (armorTypes.includes(toolType as ArmorType)) {
        return "armor"
    }
    return "item"
}

export function getToolItems(toolType: VillagerToolType) {
    const toolCategory = getToolCategory(toolType)
    if (toolCategory === "tool") {
        return toolMaterials.map(material => `minecraft:${material}_${toolType}`)
    }
    else if (toolCategory === "armor") {
        return armorMaterials.map(material => `minecraft:${material}_${toolType}`)
    }
    return [`minecraft:${toolType}`]
}

ItemStack.prototype.getToolRank = function () {
    for (const toolType of upgradableToolTypes) {
        const toolItems = getToolItems(toolType)
        const rank = toolItems.indexOf(this.typeId)
        if (rank >= 0) {
            return rank
        }
    }
    for (const armorType of armorTypes) {
        const armorItems = getToolItems(armorType)
        const rank = armorItems.indexOf(this.typeId)
        if (rank >= 0) {
            return rank
        }
    }
    return 0
}

interface VillagerConfig {
    customTasks: Task[]
    pickupItems: string[] | (() => string[])
    depositItems: (inventory: Container) => DepositPlan | undefined
    sleepTime: {
        tired: number
        startSleep: number
        endSleep: number
        working: number
    }
    tool: VillagerToolType | VillagerToolType[] | undefined
}

export interface Task {
    id: string
    name: string
    priority: number
    condition: (villager: Villager, village: Village) => boolean
    interruptible?: boolean
    tick?: (villager: Villager, village: Village) => void
    requiresTool: boolean
}

// Items villagers craft with (and pick up while crafting). Any of these in a villager's inventory gets deposited.
export const CRAFTING_ITEMS: VillagerConfig["pickupItems"] = () => [
    "minecraft:stick",
    ...Registry.plankTypes
]

function createDepositPlan(
    inventory: Container,
    pickupItems: VillagerConfig["pickupItems"],
    shouldDeposit: (counts: Record<string, number>) => boolean,
    keep?: Readonly<Record<string, number>>,
    craftingItems?: VillagerConfig["pickupItems"]
): DepositPlan | undefined {
    const counts = inventory.getItemCounts({
        includesTypes: resolvePickupItems(pickupItems)
    })

    // Crafting items are always deposited when the villager has any, regardless of keep or thresholds
    const craftingCounts = craftingItems !== undefined
        ? inventory.getItemCounts({ includesTypes: resolvePickupItems(craftingItems) })
        : {}
    const hasCraftingItems = Object.values(craftingCounts).some(count => count > 0)

    if (keep !== undefined) {
        for (const [typeId, amount] of Object.entries(keep)) {
            const count = counts[typeId]

            if (count !== undefined) {
                counts[typeId] = Math.max(0, count - amount)
            }
        }
    }

    if (!hasCraftingItems && !inventory.isFull && !shouldDeposit(counts)) {
        return undefined
    }

    const plan: DepositPlan = {}

    for (const [typeId, count] of Object.entries(counts)) {
        if (count > 0) {
            plan[typeId] = count
        }
    }

    for (const [typeId, count] of Object.entries(craftingCounts)) {
        if (count > 0) {
            plan[typeId] = count
        }
    }

    return Object.keys(plan).length > 0 ? plan : undefined
}

const NEARBY_ORE_STAND_DISTANCE = 5

export const tektopiaVillagers: Record<string, VillagerConfig> = {
    "tektopia:villager_farmer": {
        customTasks: [
            {
                id: "till",
                name: "Till",
                priority: 10,
                condition: (villager, village) =>
                    villager.findTillLocation(village),
                tick: (villager, village) =>
                    villager.tickTill(village),
                requiresTool: true
            },
            {
                id: "plant",
                name: "Plant",
                priority: 10,
                condition: (villager, village) =>
                    villager.findPlantLocation(village),
                tick: (villager, village) =>
                    villager.tickPlant(village),
                requiresTool: false
            },
            {
                id: "harvest",
                name: "Harvest",
                priority: 10,
                condition: (villager, village) =>
                    villager.findHarvestLocation(village),
                tick: (villager, village) =>
                    villager.tickHarvest(village),
                requiresTool: false
            }
        ],
        pickupItems: [
            "minecraft:wheat_seeds",
            "minecraft:beetroot_seeds",
            "minecraft:pumpkin_seeds",
            "minecraft:melon_seeds",
            "minecraft:sugar_cane",
            "minecraft:potato",
            "minecraft:carrot",
            "minecraft:pumpkin",
            "minecraft:melon_slice",
            "minecraft:wheat",
            "minecraft:beetroot",
            "minecraft:sweet_berries"
        ],
        depositItems(inventory: Container): DepositPlan | undefined {
            return createDepositPlan(
                inventory,
                this.pickupItems,
                counts => Object.entries(counts).some(([key, count]) => !key.includes("_seeds") && count > 5),
                SEED_KEEP,
                CRAFTING_ITEMS
            )
        },
        sleepTime: {
            tired: 11400,
            startSleep: 13000,
            endSleep: 0,
            working: 600
        },
        tool: "hoe"
    },

    "tektopia:villager_lumberjack": {
        customTasks: [
            {
                id: "chop",
                name: "Chop Trees",
                priority: 10,
                condition: (villager, village) =>
                    villager.findTree(village),
                tick: (villager, village) =>
                    villager.tickChopTree(village),
                requiresTool: true
            }
        ],
        pickupItems: () => [
            "minecraft:apple",
            ...Registry.saplingTypes,
            ...Registry.logTypes
        ],
        depositItems(inventory: Container): DepositPlan | undefined {
            return createDepositPlan(
                inventory,
                this.pickupItems,
                counts => Object.values(counts).some(count => count > 8),
                undefined,
                CRAFTING_ITEMS
            )
        },
        sleepTime: {
            tired: 11400,
            startSleep: 13000,
            endSleep: 0,
            working: 600
        },
        tool: "axe"
    },

    "tektopia:villager_miner": {
        customTasks: [
            {
                id: "mine_nearby_ore",
                name: "Mine Nearby Ore",
                priority: 12,
                condition: (villager, village) =>
                    villager.findOre(village, undefined, NEARBY_ORE_STAND_DISTANCE),
                tick: (villager, village) =>
                    villager.tickMineOre(village),
                requiresTool: true
            },
            {
                id: "mine",
                name: "Mine",
                priority: 11,
                condition: (villager, village) =>
                    villager.findMine(village, false, false),
                tick: (villager, village) =>
                    villager.tickMine(village),
                requiresTool: true
            },
            {
                id: "mine_ore",
                name: "Mine Ore",
                priority: 10,
                condition: (villager, village) =>
                    villager.findOre(village),
                tick: (villager, village) =>
                    villager.tickMineOre(village),
                requiresTool: true
            }
        ],
        pickupItems: () => [
            "minecraft:cobblestone",
            "minecraft:redstone",
            "minecraft:redstone",
            "minecraft:raw_iron",
            "minecraft:raw_gold",
            "minecraft:lapis_lazuli",
            "minecraft:raw_copper",
            "minecraft:emerald",
            "minecraft:coal",
            "minecraft:dirt",
            "minecraft:granite",
            "minecraft:diorite",
            "minecraft:andesite",
            "minecraft:gravel",
            "minecraft:flint",
            "minecraft:cobbled_deepslate"
        ],
        depositItems(inventory: Container): DepositPlan | undefined {
            return createDepositPlan(
                inventory,
                this.pickupItems,
                counts => {
                    let total = 0

                    for (const count of Object.values(counts)) {
                        total += count
                    }

                    return total >= 192
                },
                undefined,
                CRAFTING_ITEMS
            )
        },
        sleepTime: {
            tired: 10800,
            startSleep: 12400,
            endSleep: 23400,
            working: 0
        },
        tool: "pickaxe"
    },

    "tektopia:villager_rancher": {
        customTasks: [
            {
                id: "herd",
                name: "Herd",
                priority: 40,
                condition: (villager, village) =>
                    villager.findHerdEntity(village)
                    || villager.isHoldingLeash,
                tick: (villager, village) =>
                    villager.tickHerdEntity(village),
                requiresTool: false
            },
            {
                id: "close_gate",
                name: "Close Gate",
                priority: 50,
                condition: (villager, village) =>
                    villager.findOpenGate(village),
                tick: villager => villager.tickCloseGate(),
                requiresTool: false
            },
            {
                id: "breed",
                name: "Breed",
                priority: 20,
                condition: (villager, village) =>
                    villager.findBreedableEntity(village),
                tick: villager => villager.tickBreedEntity(),
                requiresTool: false
            },
            {
                id: "shear",
                name: "Shear",
                priority: 20,
                condition: (villager, village) =>
                    villager.findShearableEntity(village),
                tick: villager =>
                    villager.tickShearEntity(),
                requiresTool: true
            }
        ],
        pickupItems: () => [
            ...Registry.woolTypes,
            ...Registry.eggTypes
        ],
        depositItems(inventory: Container): DepositPlan | undefined {
            return createDepositPlan(
                inventory,
                this.pickupItems,
                counts => Object.values(counts).some(count => count > 6),
                undefined,
                CRAFTING_ITEMS
            )
        },
        sleepTime: {
            tired: 11400,
            startSleep: 13000,
            endSleep: 0,
            working: 600
        },
        tool: "shears"
    },

    "tektopia:villager_guard": {
        customTasks: [
            {
                id: "guard_post",
                name: "Guard Post",
                priority: 20,
                condition: (villager, village) =>
                    villager.findGuardPost(village),
                tick: (villager, village) =>
                    villager.tickGuardPost(village),
                requiresTool: false
            },
            {
                id: "guard_village",
                name: "Guard Village",
                priority: 0,
                interruptible: true,
                condition: () => true,
                tick: (villager, village) =>
                    villager.tickGuardVillage(village),
                requiresTool: false
            }
        ],
        pickupItems: () => [],
        depositItems: () => undefined,
        sleepTime: {
            tired: 1400,
            startSleep: 3000,
            endSleep: 13000,
            working: 13600
        },
        tool: ["sword", "helmet", "chestplate", "leggings", "boots"]
    },

    "tektopia:villager_butcher": {
        customTasks: [
            {
                id: "butcher_animal",
                name: "Butcher Animal",
                priority: 10,
                condition: (villager, village) =>
                    villager.findFullPen(village)
                    && villager.findButcherStructure(village),
                tick: (villager, village) =>
                    villager.tickButcher(village),
                requiresTool: true
            }
        ],
        pickupItems: () => [
            "minecraft:beef",
            "minecraft:porkchop",
            "minecraft:chicken",
            "minecraft:mutton",
            "minecraft:feather",
            "minecraft:leather",
            ...Registry.woolTypes
        ],
        depositItems(inventory: Container): DepositPlan | undefined {
            return createDepositPlan(
                inventory,
                this.pickupItems,
                counts => Object.values(counts).some(count => count > 6),
                undefined,
                CRAFTING_ITEMS
            )
        },
        sleepTime: {
            tired: 11400,
            startSleep: 13000,
            endSleep: 0,
            working: 600
        },
        tool: "axe"
    },

    "tektopia:villager_druid": {
        customTasks: [
            {
                id: "refill_mine",
                name: "Refill Mine",
                priority: 10,
                condition: (villager, village) => villager.findMine(village, true, true),
                tick: (villager, village) => villager.tickRefillMine(village),
                requiresTool: false
            },
            {
                id: "grow_crop",
                name: "Grow Crop",
                priority: 10,
                condition: (villager, village) => villager.findGrowableCrop(village),
                tick: (villager, village) => villager.tickGrowCrop(village),
                requiresTool: false
            },
            {
                id: "grow_sapling",
                name: "Grow Sapling",
                priority: 10,
                condition: (villager, village) => villager.findSapling(village),
                tick: villager => villager.tickGrowSapling(),
                requiresTool: false
            }
        ],
        pickupItems: () => [],
        depositItems: () => undefined,
        sleepTime: {
            tired: 11400,
            startSleep: 13000,
            endSleep: 0,
            working: 600
        },
        tool: undefined
    },

    "tektopia:villager_blacksmith": {
        customTasks: [

        ],
        pickupItems: () => [],
        depositItems: () => undefined,
        sleepTime: {
            tired: 11400,
            startSleep: 13000,
            endSleep: 0,
            working: 600
        },
        tool: undefined
    }
}

export const globalTasks: Task[] = [
    {
        id: "sleep",
        name: "Sleep",
        priority: 90,
        condition: villager => villager.bedTime() !== "working",
        tick: villager => villager.tickSleep(),
        requiresTool: false
    },
    {
        id: "item",
        name: "Pickup Items",
        priority: 80,
        condition: (villager, village) => villager.findItem(village),
        tick: villager => villager.tickPickupItem(),
        requiresTool: false
    },
    {
        id: "deposit",
        name: "Deposit Items",
        priority: 70,
        condition: (villager, village) => villager.checkDepositTask(village),
        tick: (villager, village) => villager.tickDepositTask(village),
        requiresTool: false
    },
    {
        id: "deposit_tool",
        name: "Deposit Tool",
        priority: 66,
        condition: (villager, village) => villager.checkDepositToolTask(village),
        tick: (villager, village) => villager.tickDepositToolTask(village),
        requiresTool: false
    },
    {
        id: "get_tool",
        name: "Get Tool",
        priority: 65,
        condition: (villager, village) => villager.checkGetToolTask(village),
        tick: (villager, village) => villager.tickGetToolTask(village),
        requiresTool: false
    },
    {
        id: "craft_tool",
        name: "Craft Tool",
        priority: 64,
        condition: (villager, village) => villager.checkCraftToolTask(village),
        tick: (villager, village) => villager.tickCraftToolTask(village),
        requiresTool: false
    }
]

export function resolvePickupItems(pickupItems: VillagerConfig["pickupItems"]) {
    const resolvedPickupItems = typeof pickupItems === "function"
        ? pickupItems()
        : pickupItems

    return resolvedPickupItems
}

const tieScratch: Task[] = []

export function sortTasksByPriority(tasks: Task[]): Task[] {
    return tasks.slice().sort((a, b) => b.priority - a.priority)
}

export function pickTask(
    sortedTasks: Task[],
    isAvailable: (task: Task) => boolean,
    minPriority = Number.NEGATIVE_INFINITY
): Task | undefined {
    const length = sortedTasks.length
    let start = 0

    while (start < length) {
        const first = sortedTasks[start]
        if (first === undefined || first.priority <= minPriority) {
            return undefined
        }

        let end = start + 1
        while (end < length && sortedTasks[end]?.priority === first.priority) {
            end++
        }

        if (end - start === 1) {
            if (isAvailable(first)) {
                return first
            }
        }
        else {
            tieScratch.length = 0
            for (let index = start; index < end; index++) {
                const task = sortedTasks[index]
                if (task !== undefined) {
                    tieScratch.push(task)
                }
            }

            let remaining = tieScratch.length
            while (remaining > 0) {
                const pick = randomInt(0, remaining - 1)
                const task = tieScratch[pick]
                tieScratch[pick] = tieScratch[remaining - 1] as Task
                remaining--

                if (task !== undefined && isAvailable(task)) {
                    return task
                }
            }
        }

        start = end
    }

    return undefined
}
