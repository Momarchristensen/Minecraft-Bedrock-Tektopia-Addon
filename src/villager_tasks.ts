import { Registry } from "./registry"

import type { UndefinedRecord } from "."

import type { Village } from "./village"

import type { Villager } from "./villager"

interface VillagerConfig {
    customTasks: Task[]
    pickupItems: string[] | (() => string[])
}

interface Task {
    id: string
    name: string
    required: boolean
    condition: (villager: Villager, village: Village) => boolean
    canInterrupt?: boolean
    tick?: (villager: Villager, village: Village) => void
}

export const tektopiaVillagers: UndefinedRecord<string, VillagerConfig> = {
    "tektopia:farmer": {
        customTasks: [
            {
                id: "till",
                name: "Till",
                required: false,
                condition: () => false
            },
            {
                id: "plant",
                name: "Plant",
                required: false,
                condition: () => false
            },
            {
                id: "harvest",
                name: "Harvest",
                required: false,
                condition: () => false
            }
        ],
        pickupItems: [
            "minecraft:wheat_seeds",
            "minecraft:beetroot_seeds",
            "minecraft:pumpkin_seeds",
            "minecraft:melon_seeds",
            "minecraft:sugarcane",
            "minecraft:potato",
            "minecraft:carrot",
            "minecraft:pumpkin",
            "minecraft:melon_slice"
        ]
    },
    "tektopia:lumberjack": {
        customTasks: [
            {
                id: "chop",
                name: "Chop Trees",
                required: false,
                condition: (villager: Villager, village: Village) => villager.findTree(village) !== undefined,
                tick: (villager: Villager, village: Village) => villager.tickChop(village)
            }
        ],
        pickupItems: () => ["minecraft:apple", ...Registry.saplingTypes, ...Registry.logTypes]
    }
}

export const globalTasks: Task[] = [
    {
        id: "eat",
        name: "Eat",
        required: true,
        condition: () => false,
        canInterrupt: true
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
