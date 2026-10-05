import { Registry } from "./registry"

import type { UndefinedRecord } from "./minecraft_extensions"

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
                condition: (villager: Villager, village: Village) => villager.findTillLocation(village) !== undefined,
                tick: (villager: Villager, village: Village) => villager.tickTill(village)
            },
            {
                id: "plant",
                name: "Plant",
                required: false,
                condition: (villager: Villager, village: Village) => villager.findPlantLocation(village) !== undefined,
                tick: (villager: Villager, village: Village) => villager.tickPlant(village)
            },
            {
                id: "harvest",
                name: "Harvest",
                required: false,
                condition: (villager: Villager, village: Village) => villager.findHarvestLocation(village) !== undefined,
                tick: (villager: Villager, village: Village) => villager.tickHarvest(village)
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
    },
    "tektopia:miner": {
        customTasks: [
            {
                id: "mine",
                name: "Mine",
                required: false,
                condition: (villager: Villager, village: Village) => villager.findMine(village) !== undefined,
                tick: (villager: Villager, village: Village) => villager.tickMine(village)
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
            "minecraft:gravel"
        ]
    },
    "tektopia:rancher": {
        customTasks: [
            // {
            //     id: "herd",
            //     name: "Herd",
            //     required: false,
            //     condition: (villager: Villager, village: Village) => villager.findMine(village) !== undefined,
            //     tick: (villager: Villager, village: Village) => villager.tickMine(village)
            // }
        ],
        pickupItems: () => []
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
