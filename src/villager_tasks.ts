import { Registry } from "./registry"

import type { DepositPlan } from "./minecraft_extensions"

import type { Village } from "./village"

import type { Villager } from "./villager"

import type { Container } from "@minecraft/server"

interface VillagerConfig {
    customTasks: Task[]
    pickupItems: string[] | (() => string[])
    depositItems: (inventory: Container) => DepositPlan | undefined
}

interface Task {
    id: string
    name: string
    required: boolean
    condition: (villager: Villager, village: Village) => boolean
    interruptible?: boolean
    tick?: (villager: Villager, village: Village) => void
}

function createDepositPlan(
    inventory: Container,
    pickupItems: VillagerConfig["pickupItems"],
    shouldDeposit: (counts: Record<string, number>) => boolean
): DepositPlan | undefined {
    const counts = inventory.getItemCounts({
        includesTypes: resolvePickupItems(pickupItems)
    })

    if (!inventory.isFull && !shouldDeposit(counts)) {
        return undefined
    }

    const plan: DepositPlan = {}

    for (const [typeId, count] of Object.entries(counts)) {
        plan[typeId] = count
    }

    return Object.keys(plan).length > 0 ? plan : undefined
}

export const tektopiaVillagers: Record<string, VillagerConfig> = {
    "tektopia:farmer": {
        customTasks: [
            {
                id: "till",
                name: "Till",
                required: false,
                condition: (villager: Villager, village: Village) =>
                    villager.findTillLocation(village) !== undefined,
                tick: (villager: Villager, village: Village) =>
                    villager.tickTill(village)
            },
            {
                id: "plant",
                name: "Plant",
                required: false,
                condition: (villager: Villager, village: Village) =>
                    villager.findPlantLocation(village) !== undefined,
                tick: (villager: Villager, village: Village) =>
                    villager.tickPlant(village)
            },
            {
                id: "harvest",
                name: "Harvest",
                required: false,
                condition: (villager: Villager, village: Village) =>
                    villager.findHarvestLocation(village) !== undefined,
                tick: (villager: Villager, village: Village) =>
                    villager.tickHarvest(village)
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
                counts => Object.values(counts).some(count => count > 3)
            )
        }
    },

    "tektopia:lumberjack": {
        customTasks: [
            {
                id: "chop",
                name: "Chop Trees",
                required: false,
                condition: (villager: Villager, village: Village) =>
                    villager.findTree(village) !== undefined,
                tick: (villager: Villager, village: Village) =>
                    villager.tickChop(village)
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
                counts => Object.values(counts).some(count => count > 8)
            )
        }
    },

    "tektopia:miner": {
        customTasks: [
            {
                id: "mine",
                name: "Mine",
                required: false,
                condition: (villager: Villager, village: Village) =>
                    villager.findMine(village) !== undefined,
                tick: (villager: Villager, village: Village) =>
                    villager.tickMine(village)
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
            "minecraft:flint"
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
                }
            )
        }
    },

    "tektopia:rancher": {
        customTasks: [
            {
                id: "herd",
                name: "Herd",
                required: false,
                condition: (villager: Villager, village: Village) =>
                    villager.findHerdEntity(village) !== undefined
                    || villager.isHoldingLeash,
                tick: (villager: Villager, village: Village) =>
                    villager.tickHerdEntity(village)
            },
            {
                id: "breed",
                name: "Breed",
                required: false,
                condition: (villager: Villager, village: Village) =>
                    villager.findBreedableEntity(village) !== undefined,
                tick: (villager: Villager) =>
                    villager.tickBreedEntity()
            },
            {
                id: "shear",
                name: "Shear",
                required: false,
                condition: (villager: Villager, village: Village) =>
                    villager.findShearableEntity(village) !== undefined,
                tick: (villager: Villager) =>
                    villager.tickShearEntity()
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
                counts => Object.values(counts).some(count => count > 3)
            )
        }
    },

    "tektopia:guard": {
        customTasks: [
            {
                id: "guard_post",
                name: "Guard Post",
                required: false,
                condition: (villager: Villager, village: Village) =>
                    villager.findGuardPost(village) !== undefined,
                tick: (villager: Villager, village: Village) =>
                    villager.tickGuardPost(village)
            },
            {
                id: "guard_village",
                name: "Guard Village",
                required: false,
                interruptible: true,
                condition: () => true,
                tick: (villager: Villager, village: Village) =>
                    villager.tickGuardVillage(village)
            }
        ],
        pickupItems: () => [],
        depositItems: () => undefined
    },

    "tektopia:butcher": {
        customTasks: [
            {
                id: "butcher_animal",
                name: "Butcher Animal",
                required: false,
                condition: (villager: Villager, village: Village) =>
                    villager.findFullPen(village) !== undefined
                    && villager.findButcherStructure(village) !== undefined,
                tick: (villager: Villager, village: Village) =>
                    villager.tickButcher(village)
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
                counts => Object.values(counts).some(count => count > 6)
            )
        }
    }
}

export const globalTasks: Task[] = [
    {
        id: "eat",
        name: "Eat",
        required: true,
        condition: () => false,
        interruptible: true
    },
    {
        id: "sleep",
        name: "Sleep",
        required: true,
        condition: () => false
    },
    {
        id: "item",
        name: "Pickup Items",
        required: true,
        condition: (villager: Villager, village: Village) => villager.findItem(village) !== undefined,
        tick: (villager: Villager) => villager.tickPickupItem()
    },
    {
        id: "deposit",
        name: "Deposit Items",
        required: false,
        condition: (villager, village) => villager.findDepositTarget(village) !== undefined,
        tick: (villager, village) => villager.tickDeposit(village)
    },
    {
        id: "tool",
        name: "Get Tool",
        required: true,
        condition: () => false
    },
    {
        id: "craft",
        name: "Craft Tools",
        required: false,
        condition: () => false
    }
]

export function resolvePickupItems(pickupItems: VillagerConfig["pickupItems"]) {
    const resolvedPickupItems = typeof pickupItems === "function"
        ? pickupItems()
        : pickupItems

    return resolvedPickupItems
}
