import { Registry } from "./registry"

import { randomInt } from "./utils"

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
    // Higher priority tasks are checked first; tasks sharing a priority are picked in random order
    priority: number
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
                priority: 10,
                condition: (villager: Villager, village: Village) =>
                    villager.findTillLocation(village) !== undefined,
                tick: (villager: Villager, village: Village) =>
                    villager.tickTill(village)
            },
            {
                id: "plant",
                name: "Plant",
                required: false,
                priority: 10,
                condition: (villager: Villager, village: Village) =>
                    villager.findPlantLocation(village) !== undefined,
                tick: (villager: Villager, village: Village) =>
                    villager.tickPlant(village)
            },
            {
                id: "harvest",
                name: "Harvest",
                required: false,
                priority: 10,
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
                priority: 10,
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
                priority: 10,
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
                priority: 40,
                condition: (villager: Villager, village: Village) =>
                    villager.findHerdEntity(village) !== undefined
                    || villager.isHoldingLeash,
                tick: (villager: Villager, village: Village) =>
                    villager.tickHerdEntity(village)
            },
            {
                id: "close_gate",
                name: "Close Gate",
                required: false,
                priority: 50,
                condition: (villager: Villager, village: Village) =>
                    villager.findOpenGate(village) !== undefined,
                tick: (villager: Villager) =>
                    villager.tickCloseGate()
            },
            {
                id: "breed",
                name: "Breed",
                required: false,
                priority: 20,
                condition: (villager: Villager, village: Village) =>
                    villager.findBreedableEntity(village) !== undefined,
                tick: (villager: Villager) =>
                    villager.tickBreedEntity()
            },
            {
                id: "shear",
                name: "Shear",
                required: false,
                priority: 20,
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
                priority: 20,
                condition: (villager: Villager, village: Village) =>
                    villager.findGuardPost(village) !== undefined,
                tick: (villager: Villager, village: Village) =>
                    villager.tickGuardPost(village)
            },
            {
                id: "guard_village",
                name: "Guard Village",
                required: false,
                priority: 0,
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
                priority: 10,
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
    },

    "tektopia:druid": {
        customTasks: [
            {
                id: "refill_mine",
                name: "Refill Mine",
                required: false,
                priority: 10,
                condition: (villager: Villager, village: Village) => villager.findMine(village, true) !== undefined,
                tick: (villager: Villager, village: Village) => villager.tickRefillMine(village)
            }
        ],
        pickupItems: () => [],
        depositItems: () => undefined
    }
}

export const globalTasks: Task[] = [
    {
        id: "eat",
        name: "Eat",
        required: true,
        priority: 100,
        condition: () => false,
        interruptible: true
    },
    {
        id: "sleep",
        name: "Sleep",
        required: true,
        priority: 90,
        condition: () => false
    },
    {
        id: "item",
        name: "Pickup Items",
        required: true,
        priority: 80,
        condition: (villager: Villager, village: Village) => villager.findItem(village) !== undefined,
        tick: (villager: Villager) => villager.tickPickupItem()
    },
    {
        id: "deposit",
        name: "Deposit Items",
        required: false,
        priority: 70,
        condition: (villager, village) => villager.findDepositTarget(village) !== undefined,
        tick: (villager, village) => villager.tickDeposit(village)
    },
    {
        id: "tool",
        name: "Get Tool",
        required: true,
        priority: 60,
        condition: () => false
    },
    {
        id: "craft",
        name: "Craft Tools",
        required: false,
        priority: 50,
        condition: () => false
    }
]

export function resolvePickupItems(pickupItems: VillagerConfig["pickupItems"]) {
    const resolvedPickupItems = typeof pickupItems === "function"
        ? pickupItems()
        : pickupItems

    return resolvedPickupItems
}

const tieScratch: Task[] = []

// Sorts tasks so higher priority tasks come first
export function sortTasksByPriority(tasks: Task[]): Task[] {
    return tasks.slice().sort((a, b) => b.priority - a.priority)
}

// Walks a priority-sorted task list from the highest priority down and returns the first task accepted by isAvailable.
// Tasks sharing a priority are tried in random order. Tasks with a priority <= minPriority are ignored.
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

            // Lazy Fisher-Yates: draw a random remaining task, only evaluating conditions as needed
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
