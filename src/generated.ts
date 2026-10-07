interface SoundEvent {
    pitch?: [number, number] | number
    sound: string
    volume?: number
}

interface BlockSounds {
    break: SoundEventEntry
    place: SoundEventEntry
    "fence_gate.close": SoundEventEntry
    "fence_gate.open": SoundEventEntry
    "door.close": SoundEventEntry
    "door.open": SoundEventEntry
}

export type SoundEvents = keyof BlockSounds

type SoundEventEntry = SoundEvent | string | null

//Auto Generated Variables
export const blockSounds: Record<string, BlockSounds> = {
    acacia_button: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    acacia_door: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    acacia_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    acacia_fence: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    acacia_fence_gate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    acacia_hanging_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.hanging_sign",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.hanging_sign",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    acacia_leaves: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    acacia_log: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    acacia_planks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    acacia_pressure_plate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    acacia_sapling: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    acacia_shelf: {
        break: "block.shelf.break",
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    acacia_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    acacia_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    acacia_standing_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    acacia_trapdoor: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    acacia_wall_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    acacia_wood: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    activator_rail: {
        break: {
            pitch: [
                1.1,
                1.2
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                1.2,
                1.25
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.iron_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.iron_door"
        }
    },
    allium: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    allow: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    amethyst_block: {
        break: {
            pitch: 0.8,
            sound: "break.amethyst_block",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.amethyst_block",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    amethyst_cluster: {
        break: {
            sound: "break.amethyst_cluster",
            volume: 1.0
        },
        place: {
            sound: "place.amethyst_cluster",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    ancient_debris: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.ancient_debris",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.ancient_debris",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    andesite: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    andesite_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    andesite_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    andesite_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    andesite_wall: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    anvil: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.anvil_land",
            volume: 0.5
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    azalea: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.azalea",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.azalea",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    azalea_leaves: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.azalea_leaves",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.azalea_leaves",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    azalea_leaves_flowered: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.azalea_leaves",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.azalea_leaves",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    azure_bluet: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    bamboo: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.bamboo.break",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.bamboo.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    bamboo_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.bamboo_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.bamboo_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_door"
        }
    },
    bamboo_button: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.bamboo_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.bamboo_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_door"
        }
    },
    bamboo_door: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.bamboo_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.bamboo_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_door"
        }
    },
    bamboo_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.bamboo_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.bamboo_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_door"
        }
    },
    bamboo_fence: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.bamboo_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.bamboo_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_door"
        }
    },
    bamboo_fence_gate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.bamboo_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.bamboo_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_door"
        }
    },
    bamboo_hanging_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.bamboo_wood_hanging_sign",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.bamboo_wood_hanging_sign",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    bamboo_mosaic: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.bamboo_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.bamboo_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_door"
        }
    },
    bamboo_mosaic_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.bamboo_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.bamboo_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_door"
        }
    },
    bamboo_mosaic_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.bamboo_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.bamboo_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_door"
        }
    },
    bamboo_mosaic_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.bamboo_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.bamboo_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_door"
        }
    },
    bamboo_planks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.bamboo_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.bamboo_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_door"
        }
    },
    bamboo_pressure_plate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.bamboo_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.bamboo_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_door"
        }
    },
    bamboo_sapling: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.bamboo_sapling.break",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.bamboo_sapling.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    bamboo_shelf: {
        break: "block.shelf.break",
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    bamboo_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.bamboo_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.bamboo_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_door"
        }
    },
    bamboo_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.bamboo_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.bamboo_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_door"
        }
    },
    bamboo_standing_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.bamboo_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.bamboo_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_door"
        }
    },
    bamboo_trapdoor: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.bamboo_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.bamboo_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_door"
        }
    },
    bamboo_wall_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.bamboo_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.bamboo_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_door"
        }
    },
    barrel: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    basalt: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.basalt",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.basalt",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    beacon: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    bed: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    bedrock: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    beetroot: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    bell: {
        break: {
            pitch: [
                1.1,
                1.2
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                1.2,
                1.25
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.iron_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.iron_door"
        }
    },
    big_dripleaf: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.big_dripleaf",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.big_dripleaf",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    birch_button: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    birch_door: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    birch_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    birch_fence: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    birch_fence_gate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    birch_hanging_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.hanging_sign",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.hanging_sign",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    birch_leaves: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    birch_log: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    birch_planks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    birch_pressure_plate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    birch_sapling: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    birch_shelf: {
        break: "block.shelf.break",
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    birch_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    birch_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    birch_standing_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    birch_trapdoor: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    birch_wall_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    birch_wood: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    black_candle: {
        break: {
            pitch: 1.0,
            sound: "dig.candle",
            volume: 1.0
        },
        place: {
            pitch: 1.0,
            sound: "place.candle",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    black_candle_cake: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    black_carpet: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    black_concrete: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    black_concrete_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    black_concrete_powder: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.sand",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.sand",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    black_concrete_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    black_concrete_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    black_glazed_terracotta: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    black_shulker_box: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    black_stained_glass: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    black_stained_glass_pane: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    black_terracotta: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    black_wool: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    black_wool_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    black_wool_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    black_wool_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    blackstone: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    blackstone_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    blackstone_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    blackstone_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    blackstone_wall: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    blast_furnace: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    blue_candle: {
        break: {
            pitch: 1.0,
            sound: "dig.candle",
            volume: 1.0
        },
        place: {
            pitch: 1.0,
            sound: "place.candle",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    blue_candle_cake: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    blue_carpet: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    blue_concrete: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    blue_concrete_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    blue_concrete_powder: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.sand",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.sand",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    blue_concrete_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    blue_concrete_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    blue_glazed_terracotta: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    blue_ice: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    blue_orchid: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    blue_shulker_box: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    blue_stained_glass: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    blue_stained_glass_pane: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    blue_terracotta: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    blue_wool: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    blue_wool_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    blue_wool_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    blue_wool_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    bone_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.bone_block",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.bone_block",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    bookshelf: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    border_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    brain_coral: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    brain_coral_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    brain_coral_fan: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    brain_coral_wall_fan: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    brewing_stand: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    brick_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    brick_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    brick_wall: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    brown_candle: {
        break: {
            pitch: 1.0,
            sound: "dig.candle",
            volume: 1.0
        },
        place: {
            pitch: 1.0,
            sound: "place.candle",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    brown_candle_cake: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    brown_carpet: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    brown_concrete: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    brown_concrete_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    brown_concrete_powder: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.sand",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.sand",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    brown_concrete_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    brown_concrete_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    brown_glazed_terracotta: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    brown_mushroom: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    brown_mushroom_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    brown_shulker_box: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    brown_stained_glass: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    brown_stained_glass_pane: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    brown_terracotta: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    brown_wool: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    brown_wool_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    brown_wool_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    brown_wool_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    bubble_coral: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    bubble_coral_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    bubble_coral_fan: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    bubble_coral_wall_fan: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    budding_amethyst: {
        break: {
            pitch: 0.8,
            sound: "break.amethyst_block",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.amethyst_block",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    bush: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cactus: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cactus_flower: {
        break: {
            pitch: 0.8,
            sound: "block.cactus_flower.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.cactus_flower.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cake: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    calcite: {
        break: {
            sound: "break.calcite",
            volume: 1.0
        },
        place: {
            sound: "place.calcite",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    calibrated_sculk_sensor: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.sculk_sensor",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.sculk_sensor",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    campfire: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    candle: {
        break: {
            pitch: 1.0,
            sound: "dig.candle",
            volume: 1.0
        },
        place: {
            pitch: 1.0,
            sound: "place.candle",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    candle_cake: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    carpet: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    carrots: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cartography_table: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    carved_pumpkin: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    cave_vines: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cave_vines",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cave_vines",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cave_vines_body_with_berries: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cave_vines",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cave_vines",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cave_vines_head_with_berries: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cave_vines",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cave_vines",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    chain: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.chain",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.chain",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    chain_command_block: {
        break: {
            pitch: [
                1.1,
                1.2
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                1.2,
                1.25
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.iron_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.iron_door"
        }
    },
    cherry_button: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.cherry_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.cherry_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_door"
        }
    },
    cherry_door: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.cherry_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.cherry_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_door"
        }
    },
    cherry_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.cherry_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.cherry_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_door"
        }
    },
    cherry_fence: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.cherry_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.cherry_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_door"
        }
    },
    cherry_fence_gate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.cherry_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.cherry_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_door"
        }
    },
    cherry_hanging_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.cherry_wood_hanging_sign",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cherry_wood_hanging_sign",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cherry_leaves: {
        break: {
            sound: "break.cherry_leaves",
            volume: 1.0
        },
        place: {
            sound: "place.cherry_leaves",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cherry_log: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.cherry_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.cherry_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_door"
        }
    },
    cherry_planks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.cherry_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.cherry_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_door"
        }
    },
    cherry_pressure_plate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.cherry_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.cherry_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_door"
        }
    },
    cherry_sapling: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.bamboo_sapling.break",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.bamboo_sapling.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cherry_shelf: {
        break: "block.shelf.break",
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cherry_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.cherry_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.cherry_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_door"
        }
    },
    cherry_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.cherry_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.cherry_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_door"
        }
    },
    cherry_standing_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.cherry_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.cherry_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_door"
        }
    },
    cherry_trapdoor: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.cherry_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.cherry_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_door"
        }
    },
    cherry_wall_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.cherry_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.cherry_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_door"
        }
    },
    cherry_wood: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.cherry_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.cherry_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_door"
        }
    },
    chest: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    chipped_anvil: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.anvil_land",
            volume: 0.5
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    chiseled_bookshelf: {
        break: {
            pitch: 1.0,
            sound: "break.chiseled_bookshelf",
            volume: 1.0
        },
        place: {
            pitch: 1.0,
            sound: "place.chiseled_bookshelf",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    chiseled_cinnabar: {
        break: {
            pitch: 0.8,
            sound: "block.cinnabar.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.cinnabar.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    chiseled_copper: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    chiseled_deepslate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate_bricks",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate_bricks",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    chiseled_nether_bricks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.nether_brick",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.nether_brick",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    chiseled_polished_blackstone: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    chiseled_quartz_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    chiseled_red_sandstone: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    chiseled_resin_bricks: {
        break: {
            pitch: 0.8,
            sound: "block.resin_brick.break",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "block.resin_brick.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    chiseled_sandstone: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    chiseled_stone_bricks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    chiseled_sulfur: {
        break: {
            pitch: 0.8,
            sound: "block.sulfur.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.sulfur.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    chiseled_tuff: {
        break: {
            pitch: 0.8,
            sound: "place.tuff",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.tuff",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    chiseled_tuff_bricks: {
        break: {
            pitch: 0.8,
            sound: "place.tuff_bricks",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.tuff_bricks",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    chorus_flower: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    chorus_plant: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cinnabar: {
        break: {
            pitch: 0.8,
            sound: "block.cinnabar.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.cinnabar.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cinnabar_brick_double_slab: {
        break: {
            pitch: 0.8,
            sound: "block.cinnabar.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.cinnabar.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cinnabar_brick_slab: {
        break: {
            pitch: 0.8,
            sound: "block.cinnabar.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.cinnabar.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cinnabar_brick_stairs: {
        break: {
            pitch: 0.8,
            sound: "block.cinnabar.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.cinnabar.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cinnabar_brick_wall: {
        break: {
            pitch: 0.8,
            sound: "block.cinnabar.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.cinnabar.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cinnabar_bricks: {
        break: {
            pitch: 0.8,
            sound: "block.cinnabar.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.cinnabar.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cinnabar_double_slab: {
        break: {
            pitch: 0.8,
            sound: "block.cinnabar.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.cinnabar.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cinnabar_slab: {
        break: {
            pitch: 0.8,
            sound: "block.cinnabar.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.cinnabar.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cinnabar_stairs: {
        break: {
            pitch: 0.8,
            sound: "block.cinnabar.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.cinnabar.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cinnabar_wall: {
        break: {
            pitch: 0.8,
            sound: "block.cinnabar.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.cinnabar.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    clay: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.gravel",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.gravel",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    closed_eyeblossom: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    coal_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    coal_ore: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    coarse_dirt: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.gravel",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.gravel",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cobbled_deepslate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cobbled_deepslate_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cobbled_deepslate_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cobbled_deepslate_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cobbled_deepslate_wall: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cobblestone: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cobblestone_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cobblestone_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cobblestone_wall: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cocoa: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    command_block: {
        break: {
            pitch: [
                1.1,
                1.2
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                1.2,
                1.25
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.iron_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.iron_door"
        }
    },
    composter: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    concrete: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    concretePowder: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.sand",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.sand",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    conduit: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    copper_bars: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    copper_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    copper_bulb: {
        break: {
            pitch: 0.8,
            sound: "break.copper_bulb"
        },
        place: {
            pitch: 0.8,
            sound: "place.copper_bulb"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    copper_chain: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.chain",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.chain",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    copper_chest: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    copper_door: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    copper_golem_statue: {
        break: "block.copper_golem_statue.break",
        place: "block.copper_golem_statue.place",
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    copper_grate: {
        break: {
            pitch: 0.8,
            sound: "break.copper_grate",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.copper_grate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    copper_lantern: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.lantern.break",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.lantern.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    copper_ore: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    copper_torch: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    copper_trapdoor: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    coral: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    coral_fan: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    coral_fan_dead: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    coral_fan_hang: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    coral_fan_hang2: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    coral_fan_hang3: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cornflower: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cracked_deepslate_bricks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate_bricks",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate_bricks",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cracked_deepslate_tiles: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate_bricks",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate_bricks",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cracked_nether_bricks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.nether_brick",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.nether_brick",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cracked_polished_blackstone_bricks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cracked_stone_bricks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    crafter: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    crafting_table: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    creaking_heart: {
        break: {
            pitch: 0.8,
            sound: "block.creaking_heart.break",
            volume: 0.5
        },
        place: {
            pitch: 0.8,
            sound: "block.creaking_heart.place",
            volume: 0.7
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    creeper_head: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    crimson_button: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.nether_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.nether_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_door"
        }
    },
    crimson_door: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.nether_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.nether_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_door"
        }
    },
    crimson_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.nether_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.nether_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_door"
        }
    },
    crimson_fence: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.nether_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.nether_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_door"
        }
    },
    crimson_fence_gate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.nether_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.nether_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_door"
        }
    },
    crimson_fungus: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.fungus",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.fungus",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    crimson_hanging_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.nether_wood_hanging_sign",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.nether_wood_hanging_sign",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    crimson_hyphae: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stem",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stem",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    crimson_nylium: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.nylium",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.nylium",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    crimson_planks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.nether_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.nether_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_door"
        }
    },
    crimson_pressure_plate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.nether_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.nether_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_door"
        }
    },
    crimson_roots: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.roots",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.roots",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    crimson_shelf: {
        break: "block.shelf.break",
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    crimson_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.nether_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.nether_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_door"
        }
    },
    crimson_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.nether_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.nether_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_door"
        }
    },
    crimson_standing_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.nether_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.nether_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_door"
        }
    },
    crimson_stem: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stem",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stem",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    crimson_trapdoor: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.nether_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.nether_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_door"
        }
    },
    crimson_wall_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.nether_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.nether_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_door"
        }
    },
    crying_obsidian: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cut_copper: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    cut_copper_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    cut_copper_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    cut_red_sandstone: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cut_red_sandstone_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cut_red_sandstone_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cut_sandstone: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cut_sandstone_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cut_sandstone_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cyan_candle: {
        break: {
            pitch: 1.0,
            sound: "dig.candle",
            volume: 1.0
        },
        place: {
            pitch: 1.0,
            sound: "place.candle",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cyan_candle_cake: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cyan_carpet: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cyan_concrete: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cyan_concrete_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cyan_concrete_powder: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.sand",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.sand",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cyan_concrete_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cyan_concrete_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cyan_glazed_terracotta: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cyan_shulker_box: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cyan_stained_glass: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cyan_stained_glass_pane: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cyan_terracotta: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cyan_wool: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cyan_wool_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cyan_wool_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    cyan_wool_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    damaged_anvil: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.anvil_land",
            volume: 0.5
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dandelion: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dark_oak_button: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    dark_oak_door: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    dark_oak_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    dark_oak_fence: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    dark_oak_fence_gate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    dark_oak_hanging_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.hanging_sign",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.hanging_sign",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dark_oak_leaves: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dark_oak_log: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    dark_oak_planks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    dark_oak_pressure_plate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    dark_oak_sapling: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dark_oak_shelf: {
        break: "block.shelf.break",
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dark_oak_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    dark_oak_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    dark_oak_trapdoor: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    dark_oak_wood: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    dark_prismarine: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dark_prismarine_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dark_prismarine_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dark_prismarine_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    darkoak_standing_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    darkoak_wall_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    daylight_detector: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    daylight_detector_inverted: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    dead_brain_coral: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dead_brain_coral_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dead_brain_coral_fan: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dead_brain_coral_wall_fan: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dead_bubble_coral: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dead_bubble_coral_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dead_bubble_coral_fan: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dead_bubble_coral_wall_fan: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dead_fire_coral: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dead_fire_coral_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dead_fire_coral_fan: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dead_fire_coral_wall_fan: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dead_horn_coral: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dead_horn_coral_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dead_horn_coral_fan: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dead_horn_coral_wall_fan: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dead_tube_coral: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dead_tube_coral_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dead_tube_coral_fan: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dead_tube_coral_wall_fan: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    deadbush: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    decorated_pot: {
        break: null,
        place: {
            pitch: 1.0,
            sound: "place.decorated_pot",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    deepslate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    deepslate_brick_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate_bricks",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate_bricks",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    deepslate_brick_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate_bricks",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate_bricks",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    deepslate_brick_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate_bricks",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate_bricks",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    deepslate_brick_wall: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate_bricks",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate_bricks",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    deepslate_bricks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate_bricks",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate_bricks",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    deepslate_coal_ore: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    deepslate_copper_ore: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    deepslate_diamond_ore: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    deepslate_emerald_ore: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    deepslate_gold_ore: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    deepslate_iron_ore: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    deepslate_lapis_ore: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    deepslate_redstone_ore: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    deepslate_tile_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate_bricks",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate_bricks",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    deepslate_tile_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate_bricks",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate_bricks",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    deepslate_tile_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate_bricks",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate_bricks",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    deepslate_tile_wall: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate_bricks",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate_bricks",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    deepslate_tiles: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate_bricks",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate_bricks",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    deny: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    deprecated_anvil: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.anvil_land",
            volume: 0.5
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    deprecated_purpur_block_1: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    deprecated_purpur_block_2: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    detector_rail: {
        break: {
            pitch: [
                1.1,
                1.2
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                1.2,
                1.25
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.iron_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.iron_door"
        }
    },
    diamond_block: {
        break: {
            pitch: [
                1.1,
                1.2
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                1.2,
                1.25
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.iron_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.iron_door"
        }
    },
    diamond_ore: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    diorite: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    diorite_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    diorite_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    diorite_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    diorite_wall: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dirt: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.gravel",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.gravel",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dirt_with_roots: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.hanging_roots",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.hanging_roots",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dispenser: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    double_cut_copper_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    double_plant: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    double_stone_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    double_stone_slab2: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    double_stone_slab3: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    double_stone_slab4: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    double_wooden_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    dragon_egg: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dragon_head: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dried_ghast: {
        break: {
            pitch: 0.96,
            sound: "block.dried_ghast.break",
            volume: 0.8
        },
        place: {
            pitch: 0.96,
            sound: "block.dried_ghast.place",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dried_kelp_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dripstone_block: {
        break: {
            sound: "break.dripstone_block"
        },
        place: {
            sound: "place.dripstone_block"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    dropper: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    emerald_block: {
        break: {
            pitch: [
                1.1,
                1.2
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                1.2,
                1.25
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.iron_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.iron_door"
        }
    },
    emerald_ore: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    end_brick_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    end_bricks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    end_portal_frame: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    end_rod: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    end_stone: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    end_stone_brick_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    end_stone_brick_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    end_stone_brick_wall: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    exposed_chiseled_copper: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    exposed_copper: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    exposed_copper_bars: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    exposed_copper_bulb: {
        break: {
            pitch: 0.8,
            sound: "break.copper_bulb"
        },
        place: {
            pitch: 0.8,
            sound: "place.copper_bulb"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    exposed_copper_chain: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.chain",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.chain",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    exposed_copper_chest: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    exposed_copper_door: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    exposed_copper_golem_statue: {
        break: "block.copper_golem_statue.break",
        place: "block.copper_golem_statue.place",
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    exposed_copper_grate: {
        break: {
            pitch: 0.8,
            sound: "break.copper_grate",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.copper_grate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    exposed_copper_lantern: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.lantern.break",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.lantern.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    exposed_copper_trapdoor: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    exposed_cut_copper: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    exposed_cut_copper_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    exposed_cut_copper_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    exposed_double_cut_copper_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    exposed_lightning_rod: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    farmland: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.gravel",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.gravel",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    fence: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    fence_gate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    fern: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    fire: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    fire_coral: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    fire_coral_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    fire_coral_fan: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    fire_coral_wall_fan: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    firefly_bush: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    fletching_table: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    flowering_azalea: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.azalea",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.azalea",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    frame: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.itemframe.break",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.itemframe.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    frog_spawn: {
        break: {
            pitch: 1.2,
            sound: "break.frog_spawn",
            volume: 0.1
        },
        place: {
            pitch: 1.5,
            sound: "place.frog_spawn",
            volume: 0.2
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    frosted_ice: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    furnace: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    gilded_blackstone: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    glass: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    glass_pane: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    glow_frame: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.itemframe.break",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.itemframe.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    glow_lichen: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    glowingobsidian: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    glowstone: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    gold_block: {
        break: {
            pitch: [
                1.1,
                1.2
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                1.2,
                1.25
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.iron_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.iron_door"
        }
    },
    gold_ore: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    golden_dandelion: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    golden_rail: {
        break: {
            pitch: [
                1.1,
                1.2
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                1.2,
                1.25
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.iron_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.iron_door"
        }
    },
    granite: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    granite_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    granite_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    granite_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    granite_wall: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    grass: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    grass_path: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    gravel: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.gravel",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.gravel",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    gray_candle: {
        break: {
            pitch: 1.0,
            sound: "dig.candle",
            volume: 1.0
        },
        place: {
            pitch: 1.0,
            sound: "place.candle",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    gray_candle_cake: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    gray_carpet: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    gray_concrete: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    gray_concrete_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    gray_concrete_powder: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.sand",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.sand",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    gray_concrete_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    gray_concrete_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    gray_glazed_terracotta: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    gray_shulker_box: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    gray_stained_glass: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    gray_stained_glass_pane: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    gray_terracotta: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    gray_wool: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    gray_wool_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    gray_wool_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    gray_wool_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    green_candle: {
        break: {
            pitch: 1.0,
            sound: "dig.candle",
            volume: 1.0
        },
        place: {
            pitch: 1.0,
            sound: "place.candle",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    green_candle_cake: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    green_carpet: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    green_concrete: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    green_concrete_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    green_concrete_powder: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.sand",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.sand",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    green_concrete_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    green_concrete_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    green_glazed_terracotta: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    green_shulker_box: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    green_stained_glass: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    green_stained_glass_pane: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    green_terracotta: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    green_wool: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    green_wool_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    green_wool_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    green_wool_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    grindstone: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    hanging_roots: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.hanging_roots",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.hanging_roots",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    hardened_clay: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    hay_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    heavy_core: {
        break: {
            pitch: 0.8,
            sound: "break.heavy_core",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.heavy_core",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    heavy_weighted_pressure_plate: {
        break: {
            pitch: 0.8,
            sound: "break.iron",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.iron",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.iron_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.iron_door"
        }
    },
    honey_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.honey_block",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.honey_block",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    honeycomb_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.coral",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.coral",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    hopper: {
        break: {
            pitch: [
                1.1,
                1.2
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                1.2,
                1.25
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.iron_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.iron_door"
        }
    },
    horn_coral: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    horn_coral_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    horn_coral_fan: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    horn_coral_wall_fan: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    ice: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    infested_chiseled_stone_bricks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    infested_cobblestone: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    infested_cracked_stone_bricks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    infested_deepslate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    infested_mossy_stone_bricks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    infested_stone: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    infested_stone_bricks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    info_update: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.gravel",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.gravel",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    info_update2: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.gravel",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.gravel",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    iron_bars: {
        break: {
            pitch: 0.8,
            sound: "break.iron",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.iron",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.iron_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.iron_door"
        }
    },
    iron_block: {
        break: {
            pitch: 0.8,
            sound: "break.iron",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.iron",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.iron_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.iron_door"
        }
    },
    iron_door: {
        break: {
            pitch: 0.8,
            sound: "break.iron",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.iron",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.iron_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.iron_door"
        }
    },
    iron_ore: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    iron_trapdoor: {
        break: {
            pitch: 0.8,
            sound: "break.iron",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.iron",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.iron_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.iron_door"
        }
    },
    jukebox: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    jungle_button: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    jungle_door: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    jungle_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    jungle_fence: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    jungle_fence_gate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    jungle_hanging_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.hanging_sign",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.hanging_sign",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    jungle_leaves: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    jungle_log: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    jungle_planks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    jungle_pressure_plate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    jungle_sapling: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    jungle_shelf: {
        break: "block.shelf.break",
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    jungle_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    jungle_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    jungle_standing_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    jungle_trapdoor: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    jungle_wall_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    jungle_wood: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    kelp: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    ladder: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lantern: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.lantern.break",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.lantern.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lapis_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lapis_ore: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    large_amethyst_bud: {
        break: {
            sound: "break.large_amethyst_bud"
        },
        place: {
            sound: "place.large_amethyst_bud",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    large_fern: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    leaf_litter: {
        break: {
            pitch: 0.8,
            sound: "block.leaf_litter.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.leaf_litter.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    leaves: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    leaves2: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lectern: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    lever: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_block_0: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_block_1: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_block_10: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_block_11: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_block_12: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_block_13: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_block_14: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_block_15: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_block_2: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_block_3: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_block_4: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_block_5: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_block_6: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_block_7: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_block_8: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_block_9: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_blue_candle: {
        break: {
            pitch: 1.0,
            sound: "dig.candle",
            volume: 1.0
        },
        place: {
            pitch: 1.0,
            sound: "place.candle",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_blue_candle_cake: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_blue_carpet: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_blue_concrete: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_blue_concrete_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_blue_concrete_powder: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.sand",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.sand",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_blue_concrete_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_blue_concrete_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_blue_glazed_terracotta: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_blue_shulker_box: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_blue_stained_glass: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_blue_stained_glass_pane: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_blue_terracotta: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_blue_wool: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_blue_wool_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_blue_wool_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_blue_wool_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_gray_candle: {
        break: {
            pitch: 1.0,
            sound: "dig.candle",
            volume: 1.0
        },
        place: {
            pitch: 1.0,
            sound: "place.candle",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_gray_candle_cake: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_gray_carpet: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_gray_concrete: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_gray_concrete_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_gray_concrete_powder: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.sand",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.sand",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_gray_concrete_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_gray_concrete_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_gray_shulker_box: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_gray_stained_glass: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_gray_stained_glass_pane: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_gray_terracotta: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_gray_wool: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_gray_wool_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_gray_wool_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_gray_wool_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    light_weighted_pressure_plate: {
        break: {
            pitch: [
                1.1,
                1.2
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                1.2,
                1.25
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.iron_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.iron_door"
        }
    },
    lightning_rod: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    lilac: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lily_of_the_valley: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lime_candle: {
        break: {
            pitch: 1.0,
            sound: "dig.candle",
            volume: 1.0
        },
        place: {
            pitch: 1.0,
            sound: "place.candle",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lime_candle_cake: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lime_carpet: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lime_concrete: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lime_concrete_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lime_concrete_powder: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.sand",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.sand",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lime_concrete_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lime_concrete_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lime_glazed_terracotta: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lime_shulker_box: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lime_stained_glass: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lime_stained_glass_pane: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lime_terracotta: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lime_wool: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lime_wool_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lime_wool_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lime_wool_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lit_blast_furnace: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lit_deepslate_redstone_ore: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lit_furnace: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lit_pumpkin: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    lit_redstone_lamp: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lit_redstone_ore: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lit_smoker: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    lodestone: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.lodestone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    log: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    log2: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    loom: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    magenta_candle: {
        break: {
            pitch: 1.0,
            sound: "dig.candle",
            volume: 1.0
        },
        place: {
            pitch: 1.0,
            sound: "place.candle",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    magenta_candle_cake: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    magenta_carpet: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    magenta_concrete: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    magenta_concrete_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    magenta_concrete_powder: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.sand",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.sand",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    magenta_concrete_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    magenta_concrete_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    magenta_glazed_terracotta: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    magenta_shulker_box: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    magenta_stained_glass: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    magenta_stained_glass_pane: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    magenta_terracotta: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    magenta_wool: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    magenta_wool_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    magenta_wool_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    magenta_wool_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    magma: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    mangrove_button: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    mangrove_door: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    mangrove_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    mangrove_fence: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    mangrove_fence_gate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    mangrove_hanging_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.hanging_sign",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.hanging_sign",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    mangrove_leaves: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    mangrove_log: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    mangrove_planks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    mangrove_pressure_plate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    mangrove_propagule: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    mangrove_roots: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.mangrove_roots.break",
            volume: 0.4
        },
        place: {
            pitch: [
                1.0,
                1.2
            ],
            sound: "block.mangrove_roots.place",
            volume: 0.25
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    mangrove_shelf: {
        break: "block.shelf.break",
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    mangrove_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    mangrove_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    mangrove_standing_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    mangrove_trapdoor: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    mangrove_wall_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    mangrove_wood: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    medium_amethyst_bud: {
        break: {
            sound: "break.medium_amethyst_bud"
        },
        place: {
            sound: "place.medium_amethyst_bud",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    melon_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    melon_stem: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    mob_spawner: {
        break: {
            pitch: 0.8,
            sound: "block.mob_spawner.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.mob_spawner.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    moss_block: {
        break: {
            sound: "dig.moss",
            volume: 0.93
        },
        place: {
            sound: "place.moss",
            volume: 0.93
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    moss_carpet: {
        break: {
            sound: "dig.moss",
            volume: 0.93
        },
        place: {
            sound: "place.moss",
            volume: 0.93
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    mossy_cobblestone: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    mossy_cobblestone_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    mossy_cobblestone_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    mossy_cobblestone_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    mossy_cobblestone_wall: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    mossy_stone_brick_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    mossy_stone_brick_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    mossy_stone_brick_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    mossy_stone_brick_wall: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    mossy_stone_bricks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    mud: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.mud.break",
            volume: 0.4
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.mud.place",
            volume: 0.25
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    mud_brick_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.mud_bricks.break",
            volume: 0.5
        },
        place: {
            pitch: [
                0.6,
                0.8
            ],
            sound: "block.mud_bricks.place",
            volume: 0.3
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    mud_brick_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.mud_bricks.break",
            volume: 0.5
        },
        place: {
            pitch: [
                0.6,
                0.8
            ],
            sound: "block.mud_bricks.place",
            volume: 0.3
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    mud_brick_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.mud_bricks.break",
            volume: 0.5
        },
        place: {
            pitch: [
                0.6,
                0.8
            ],
            sound: "block.mud_bricks.place",
            volume: 0.3
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    mud_brick_wall: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.mud_bricks.break",
            volume: 0.5
        },
        place: {
            pitch: [
                0.6,
                0.8
            ],
            sound: "block.mud_bricks.place",
            volume: 0.3
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    mud_bricks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.mud_bricks.break",
            volume: 0.5
        },
        place: {
            pitch: [
                0.6,
                0.8
            ],
            sound: "block.mud_bricks.place",
            volume: 0.3
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    muddy_mangrove_roots: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.muddy_mangrove_roots.break",
            volume: 0.4
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.muddy_mangrove_roots.place",
            volume: 0.25
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    mushroom_stem: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    mycelium: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    nether_brick: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.nether_brick",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.nether_brick",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    nether_brick_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    nether_brick_fence: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.nether_brick",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.nether_brick",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    nether_brick_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.nether_brick",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.nether_brick",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    nether_brick_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.nether_brick",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.nether_brick",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    nether_brick_wall: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.nether_brick",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.nether_brick",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    nether_gold_ore: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.nether_gold_ore",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.nether_gold_ore",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    nether_sprouts: {
        break: {
            pitch: [
                1.1,
                1.2
            ],
            sound: "dig.nether_sprouts",
            volume: 1.0
        },
        place: {
            pitch: [
                1.2,
                1.25
            ],
            sound: "place.nether_sprouts",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    nether_wart: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.nether_wart",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.nether_wart",
            volume: 0.7
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    nether_wart_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.nether_wart",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.nether_wart",
            volume: 0.7
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    netherite_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.netherite",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.netherite",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    netherrack: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.netherrack",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.netherrack",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    netherreactor: {
        break: {
            pitch: [
                1.1,
                1.2
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                1.2,
                1.25
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.iron_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.iron_door"
        }
    },
    normal_stone_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    normal_stone_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    normal_stone_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    noteblock: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    oak_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    oak_fence: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    oak_hanging_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.hanging_sign",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.hanging_sign",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    oak_leaves: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    oak_log: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    oak_planks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    oak_sapling: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    oak_shelf: {
        break: "block.shelf.break",
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    oak_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    oak_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    oak_wood: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    observer: {
        break: {
            pitch: [
                1.1,
                1.2
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                1.2,
                1.25
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.iron_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.iron_door"
        }
    },
    obsidian: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    ochre_froglight: {
        break: {
            sound: "break.froglight",
            volume: 1.0
        },
        place: {
            sound: "place.froglight",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    open_eyeblossom: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    orange_candle: {
        break: {
            pitch: 1.0,
            sound: "dig.candle",
            volume: 1.0
        },
        place: {
            pitch: 1.0,
            sound: "place.candle",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    orange_candle_cake: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    orange_carpet: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    orange_concrete: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    orange_concrete_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    orange_concrete_powder: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.sand",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.sand",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    orange_concrete_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    orange_concrete_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    orange_glazed_terracotta: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    orange_poplar_leaves: {
        break: {
            pitch: 1.2,
            sound: "block.poplar_leaves.break",
            volume: 0.8
        },
        place: {
            pitch: 0.8,
            sound: "block.poplar_leaves.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    orange_shulker_box: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    orange_stained_glass: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    orange_stained_glass_pane: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    orange_terracotta: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    orange_tulip: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    orange_wool: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    orange_wool_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    orange_wool_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    orange_wool_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    oxeye_daisy: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    oxidized_chiseled_copper: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    oxidized_copper: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    oxidized_copper_bars: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    oxidized_copper_bulb: {
        break: {
            pitch: 0.8,
            sound: "break.copper_bulb"
        },
        place: {
            pitch: 0.8,
            sound: "place.copper_bulb"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    oxidized_copper_chain: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.chain",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.chain",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    oxidized_copper_chest: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    oxidized_copper_door: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    oxidized_copper_golem_statue: {
        break: "block.copper_golem_statue.break",
        place: "block.copper_golem_statue.place",
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    oxidized_copper_grate: {
        break: {
            pitch: 0.8,
            sound: "break.copper_grate",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.copper_grate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    oxidized_copper_lantern: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.lantern.break",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.lantern.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    oxidized_copper_trapdoor: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    oxidized_cut_copper: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    oxidized_cut_copper_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    oxidized_cut_copper_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    oxidized_double_cut_copper_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    oxidized_lightning_rod: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    packed_ice: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    packed_mud: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.packed_mud.break",
            volume: 0.4
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.packed_mud.place",
            volume: 0.25
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pale_hanging_moss: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pale_moss_block: {
        break: {
            sound: "dig.moss",
            volume: 0.93
        },
        place: {
            sound: "place.moss",
            volume: 0.93
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pale_moss_carpet: {
        break: {
            sound: "dig.moss",
            volume: 0.93
        },
        place: {
            sound: "place.moss",
            volume: 0.93
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pale_oak_button: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    pale_oak_door: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    pale_oak_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    pale_oak_fence: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    pale_oak_fence_gate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    pale_oak_hanging_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.hanging_sign",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.hanging_sign",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pale_oak_leaves: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pale_oak_log: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    pale_oak_planks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    pale_oak_pressure_plate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    pale_oak_sapling: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pale_oak_shelf: {
        break: "block.shelf.break",
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pale_oak_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    pale_oak_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    pale_oak_standing_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    pale_oak_trapdoor: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    pale_oak_wall_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    pale_oak_wood: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    pearlescent_froglight: {
        break: {
            sound: "break.froglight",
            volume: 1.0
        },
        place: {
            sound: "place.froglight",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    peony: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    petrified_oak_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    petrified_oak_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    piglin_head: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pink_candle: {
        break: {
            pitch: 1.0,
            sound: "dig.candle",
            volume: 1.0
        },
        place: {
            pitch: 1.0,
            sound: "place.candle",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pink_candle_cake: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pink_carpet: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pink_concrete: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pink_concrete_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pink_concrete_powder: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.sand",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.sand",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pink_concrete_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pink_concrete_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pink_glazed_terracotta: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pink_petals: {
        break: {
            sound: "break.pink_petals",
            volume: 1.0
        },
        place: {
            sound: "place.pink_petals",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pink_shulker_box: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pink_stained_glass: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pink_stained_glass_pane: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pink_terracotta: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pink_tulip: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pink_wool: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pink_wool_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pink_wool_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pink_wool_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    piston: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pitcher_crop: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pitcher_plant: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    planks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    player_head: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    podzol: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.gravel",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.gravel",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pointed_dripstone: {
        break: {
            sound: "break.pointed_dripstone"
        },
        place: {
            sound: "place.pointed_dripstone"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_andesite: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_andesite_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_andesite_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_andesite_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_basalt: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.basalt",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.basalt",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_blackstone: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_blackstone_brick_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_blackstone_brick_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_blackstone_brick_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_blackstone_brick_wall: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_blackstone_bricks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_blackstone_button: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_blackstone_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_blackstone_pressure_plate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_blackstone_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_blackstone_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_blackstone_wall: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_cinnabar: {
        break: {
            pitch: 0.8,
            sound: "block.cinnabar.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.cinnabar.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_cinnabar_double_slab: {
        break: {
            pitch: 0.8,
            sound: "block.cinnabar.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.cinnabar.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_cinnabar_slab: {
        break: {
            pitch: 0.8,
            sound: "block.cinnabar.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.cinnabar.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_cinnabar_stairs: {
        break: {
            pitch: 0.8,
            sound: "block.cinnabar.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.cinnabar.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_cinnabar_wall: {
        break: {
            pitch: 0.8,
            sound: "block.cinnabar.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.cinnabar.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_deepslate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_deepslate_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_deepslate_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_deepslate_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_deepslate_wall: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_diorite: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_diorite_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_diorite_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_diorite_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_granite: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_granite_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_granite_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_granite_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_sulfur: {
        break: {
            pitch: 0.8,
            sound: "block.sulfur.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.sulfur.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_sulfur_double_slab: {
        break: {
            pitch: 0.8,
            sound: "block.sulfur.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.sulfur.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_sulfur_slab: {
        break: {
            pitch: 0.8,
            sound: "block.sulfur.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.sulfur.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_sulfur_stairs: {
        break: {
            pitch: 0.8,
            sound: "block.sulfur.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.sulfur.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_sulfur_wall: {
        break: {
            pitch: 0.8,
            sound: "block.sulfur.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.sulfur.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_tuff: {
        break: {
            pitch: 0.96,
            sound: "break.tuff",
            volume: 1.0
        },
        place: {
            pitch: 0.96,
            sound: "place.tuff",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_tuff_double_slab: {
        break: {
            pitch: 0.96,
            sound: "break.tuff",
            volume: 1.0
        },
        place: {
            pitch: 0.96,
            sound: "place.tuff",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_tuff_slab: {
        break: {
            pitch: 0.96,
            sound: "break.tuff",
            volume: 1.0
        },
        place: {
            pitch: 0.96,
            sound: "place.tuff",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_tuff_stairs: {
        break: {
            pitch: 0.96,
            sound: "break.tuff",
            volume: 1.0
        },
        place: {
            pitch: 0.96,
            sound: "place.tuff",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    polished_tuff_wall: {
        break: {
            pitch: 0.96,
            sound: "break.tuff",
            volume: 1.0
        },
        place: {
            pitch: 0.96,
            sound: "place.tuff",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    poplar_button: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    poplar_door: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    poplar_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    poplar_fence: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    poplar_fence_gate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    poplar_hanging_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.hanging_sign",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.hanging_sign",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    poplar_log: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    poplar_planks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    poplar_pressure_plate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    poplar_sapling: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    poplar_shelf: {
        break: "block.shelf.break",
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    poplar_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    poplar_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    poplar_standing_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    poplar_trapdoor: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    poplar_wall_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    poplar_wood: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    poppy: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    portal: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    potatoes: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    potent_sulfur: {
        break: {
            pitch: 0.8,
            sound: "block.potent_sulfur.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.potent_sulfur.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    powder_snow: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.powder_snow",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.powder_snow",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    powered_comparator: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    powered_repeater: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    prismarine: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    prismarine_brick_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    prismarine_brick_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    prismarine_bricks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    prismarine_bricks_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    prismarine_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    prismarine_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    prismarine_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    prismarine_wall: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    pumpkin: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    pumpkin_stem: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    purple_candle: {
        break: {
            pitch: 1.0,
            sound: "dig.candle",
            volume: 1.0
        },
        place: {
            pitch: 1.0,
            sound: "place.candle",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    purple_candle_cake: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    purple_carpet: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    purple_concrete: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    purple_concrete_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    purple_concrete_powder: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.sand",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.sand",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    purple_concrete_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    purple_concrete_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    purple_glazed_terracotta: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    purple_shulker_box: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    purple_stained_glass: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    purple_stained_glass_pane: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    purple_terracotta: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    purple_wool: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    purple_wool_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    purple_wool_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    purple_wool_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    purpur_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    purpur_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    purpur_pillar: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    purpur_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    quartz_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    quartz_bricks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    quartz_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    quartz_ore: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.nether_gold_ore",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.nether_gold_ore",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    quartz_pillar: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    quartz_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    rail: {
        break: {
            pitch: [
                1.1,
                1.2
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                1.2,
                1.25
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.iron_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.iron_door"
        }
    },
    raw_copper_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    raw_gold_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    raw_iron_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_candle: {
        break: {
            pitch: 1.0,
            sound: "dig.candle",
            volume: 1.0
        },
        place: {
            pitch: 1.0,
            sound: "place.candle",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_candle_cake: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_carpet: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_concrete: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_concrete_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_concrete_powder: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.sand",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.sand",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_concrete_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_concrete_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_flower: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_glazed_terracotta: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_mushroom: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_mushroom_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    red_nether_brick: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.nether_brick",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.nether_brick",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_nether_brick_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_nether_brick_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.nether_brick",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.nether_brick",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_nether_brick_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.nether_brick",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.nether_brick",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_nether_brick_wall: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.nether_brick",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.nether_brick",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_poplar_leaves: {
        break: {
            pitch: 1.2,
            sound: "block.poplar_leaves.break",
            volume: 0.8
        },
        place: {
            pitch: 0.8,
            sound: "block.poplar_leaves.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_sand: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.sand",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.sand",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_sandstone: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_sandstone_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_sandstone_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_sandstone_wall: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_shrub: {
        break: {
            pitch: 1.2,
            sound: "block.red_shrub.break",
            volume: 0.8
        },
        place: {
            pitch: 0.8,
            sound: "block.red_shrub.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_shulker_box: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_stained_glass: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_stained_glass_pane: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_terracotta: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_tulip: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_wool: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_wool_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_wool_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    red_wool_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    redstone_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    redstone_lamp: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    redstone_ore: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    redstone_torch: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    reeds: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    reinforced_deepslate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.deepslate",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.deepslate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    repeating_command_block: {
        break: {
            pitch: [
                1.1,
                1.2
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                1.2,
                1.25
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.iron_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.iron_door"
        }
    },
    resin_block: {
        break: {
            pitch: 0.8,
            sound: "block.resin.break",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "block.resin.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    resin_brick_double_slab: {
        break: {
            pitch: 0.8,
            sound: "block.resin_brick.break",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "block.resin_brick.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    resin_brick_slab: {
        break: {
            pitch: 0.8,
            sound: "block.resin_brick.break",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "block.resin_brick.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    resin_brick_stairs: {
        break: {
            pitch: 0.8,
            sound: "block.resin_brick.break",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "block.resin_brick.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    resin_brick_wall: {
        break: {
            pitch: 0.8,
            sound: "block.resin_brick.break",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "block.resin_brick.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    resin_bricks: {
        break: {
            pitch: 0.8,
            sound: "block.resin_brick.break",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "block.resin_brick.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    resin_clump: {
        break: {
            pitch: 0.8,
            sound: "block.resin.break",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "block.resin.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    respawn_anchor: {
        break: {
            pitch: [
                1.1,
                1.2
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                1.2,
                1.25
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.iron_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.iron_door"
        }
    },
    rose_bush: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    sand: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.sand",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.sand",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    sandstone: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    sandstone_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    sandstone_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    sandstone_wall: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    sapling: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    scaffolding: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.scaffolding.break",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.9
            ],
            sound: "block.scaffolding.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    sculk: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.sculk",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.sculk",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    sculk_catalyst: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.sculk_catalyst",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.sculk_catalyst",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    sculk_sensor: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.sculk_sensor",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.sculk_sensor",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    sculk_shrieker: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.sculk_shrieker",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.sculk_shrieker",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    sculk_vein: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.sculk_vein",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.sculk_vein",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    seaLantern: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    sea_pickle: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "mob.slime.big",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.slime.big",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    seagrass: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    shelf_mushroom: {
        break: {
            pitch: 1.2,
            sound: "block.shelf_mushroom.break",
            volume: 0.8
        },
        place: {
            pitch: 0.8,
            sound: "block.shelf_mushroom.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    short_dry_grass: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    short_grass: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    shroomlight: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.shroomlight",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.shroomlight",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    shulker_box: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    silver_glazed_terracotta: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    skeleton_skull: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    skull: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    slime: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "mob.slime.big",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.slime.big",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    small_amethyst_bud: {
        break: {
            sound: "break.small_amethyst_bud"
        },
        place: {
            sound: "place.small_amethyst_bud",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    small_dripleaf_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.big_dripleaf",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.big_dripleaf",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    smithing_table: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    smoker: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    smooth_basalt: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.basalt",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.basalt",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    smooth_quartz: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    smooth_quartz_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    smooth_quartz_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    smooth_quartz_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    smooth_red_sandstone: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    smooth_red_sandstone_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    smooth_red_sandstone_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    smooth_red_sandstone_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    smooth_sandstone: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    smooth_sandstone_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    smooth_sandstone_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    smooth_sandstone_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    smooth_stone: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    smooth_stone_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    smooth_stone_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    sniffer_egg: {
        break: {
            pitch: [
                1.1,
                1.2
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                1.2,
                1.25
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.iron_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.iron_door"
        }
    },
    snow: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.snow",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.snow",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    snow_layer: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.snow",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.snow",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    soul_campfire: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    soul_fire: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    soul_lantern: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.lantern.break",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.lantern.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    soul_sand: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.soul_sand",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.soul_sand",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    soul_soil: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.soul_soil",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.soul_soil",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    soul_torch: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    sponge: {
        break: {
            pitch: 0.8,
            sound: "break.sponge",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.sponge",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    spore_blossom: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.spore_blossom",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.spore_blossom",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    spruce_button: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    spruce_door: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    spruce_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    spruce_fence: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    spruce_fence_gate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    spruce_hanging_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.hanging_sign",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.hanging_sign",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    spruce_leaves: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    spruce_log: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    spruce_planks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    spruce_pressure_plate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    spruce_sapling: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    spruce_shelf: {
        break: "block.shelf.break",
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    spruce_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    spruce_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    spruce_standing_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    spruce_trapdoor: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    spruce_wall_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    spruce_wood: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    stained_glass: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    stained_glass_pane: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    stained_hardened_clay: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    standing_banner: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    standing_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    sticky_piston: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    stone: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    stone_brick_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    stone_brick_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    stone_brick_wall: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    stone_bricks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    stone_button: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    stone_pressure_plate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    stone_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    stone_slab2: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    stone_slab3: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    stone_slab4: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    stonebrick: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    stonecutter: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    stonecutter_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    straw_bed: {
        break: {
            pitch: 1.2,
            sound: "block.straw_bed.break",
            volume: 0.8
        },
        place: {
            pitch: 0.8,
            sound: "block.straw_bed.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    stripped_acacia_log: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    stripped_acacia_wood: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    stripped_bamboo_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.bamboo_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.bamboo_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.bamboo_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.bamboo_wood_door"
        }
    },
    stripped_birch_log: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    stripped_birch_wood: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    stripped_cherry_log: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.cherry_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.cherry_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_door"
        }
    },
    stripped_cherry_wood: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.cherry_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.cherry_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.cherry_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.cherry_wood_door"
        }
    },
    stripped_crimson_hyphae: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stem",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stem",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    stripped_crimson_stem: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stem",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stem",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    stripped_dark_oak_log: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    stripped_dark_oak_wood: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    stripped_jungle_log: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    stripped_jungle_wood: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    stripped_mangrove_log: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    stripped_mangrove_wood: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    stripped_oak_log: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    stripped_oak_wood: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    stripped_pale_oak_log: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    stripped_pale_oak_wood: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    stripped_poplar_log: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    stripped_poplar_wood: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    stripped_spruce_log: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    stripped_spruce_wood: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    stripped_warped_hyphae: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stem",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stem",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    stripped_warped_stem: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stem",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stem",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    sulfur: {
        break: {
            pitch: 0.8,
            sound: "block.sulfur.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.sulfur.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    sulfur_brick_double_slab: {
        break: {
            pitch: 0.8,
            sound: "block.sulfur.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.sulfur.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    sulfur_brick_slab: {
        break: {
            pitch: 0.8,
            sound: "block.sulfur.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.sulfur.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    sulfur_brick_stairs: {
        break: {
            pitch: 0.8,
            sound: "block.sulfur.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.sulfur.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    sulfur_brick_wall: {
        break: {
            pitch: 0.8,
            sound: "block.sulfur.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.sulfur.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    sulfur_bricks: {
        break: {
            pitch: 0.8,
            sound: "block.sulfur.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.sulfur.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    sulfur_double_slab: {
        break: {
            pitch: 0.8,
            sound: "block.sulfur.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.sulfur.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    sulfur_slab: {
        break: {
            pitch: 0.8,
            sound: "block.sulfur.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.sulfur.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    sulfur_spike: {
        break: {
            pitch: 0.8,
            sound: "block.sulfur_spike.break",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "block.sulfur_spike.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    sulfur_stairs: {
        break: {
            pitch: 0.8,
            sound: "block.sulfur.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.sulfur.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    sulfur_wall: {
        break: {
            pitch: 0.8,
            sound: "block.sulfur.break"
        },
        place: {
            pitch: 0.8,
            sound: "block.sulfur.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    sunflower: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    suspicious_gravel: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.suspicious_gravel",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.suspicious_gravel",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    suspicious_sand: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.suspicious_sand",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.suspicious_sand",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    sweet_berry_bush: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.sweet_berry_bush.break",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.sweet_berry_bush.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    tall_dry_grass: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    tall_grass: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    tallgrass: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    target: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    tinted_glass: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    tnt: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    torch: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    torchflower: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    torchflower_crop: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    trapdoor: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    trapped_chest: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    trial_spawner: {
        break: {
            pitch: 0.8,
            sound: "trial_spawner.break",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "trial_spawner.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    tube_coral: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    tube_coral_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    tube_coral_fan: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    tube_coral_wall_fan: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    tuff: {
        break: {
            pitch: 0.8,
            sound: "place.tuff",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.tuff",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    tuff_brick_double_slab: {
        break: {
            pitch: 0.8,
            sound: "place.tuff_bricks",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.tuff_bricks",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    tuff_brick_slab: {
        break: {
            pitch: 0.8,
            sound: "place.tuff_bricks",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.tuff_bricks",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    tuff_brick_stairs: {
        break: {
            pitch: 0.8,
            sound: "place.tuff_bricks",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.tuff_bricks",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    tuff_brick_wall: {
        break: {
            pitch: 0.8,
            sound: "place.tuff_bricks",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.tuff_bricks",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    tuff_bricks: {
        break: {
            pitch: 0.8,
            sound: "place.tuff_bricks",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.tuff_bricks",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    tuff_double_slab: {
        break: {
            pitch: 0.8,
            sound: "place.tuff",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.tuff",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    tuff_slab: {
        break: {
            pitch: 0.8,
            sound: "place.tuff",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.tuff",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    tuff_stairs: {
        break: {
            pitch: 0.8,
            sound: "place.tuff",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.tuff",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    tuff_wall: {
        break: {
            pitch: 0.8,
            sound: "place.tuff",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.tuff",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    turtle_egg: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    twisting_vines: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.weeping_vines.break",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.weeping_vines.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    undyed_shulker_box: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    unlit_redstone_torch: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    unpowered_comparator: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    unpowered_repeater: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    vault: {
        break: {
            pitch: 0.8,
            sound: "vault.break",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "vault.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    verdant_froglight: {
        break: {
            sound: "break.froglight",
            volume: 1.0
        },
        place: {
            sound: "place.froglight",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    vine: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.vines",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.vines",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    wall_banner: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    wall_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    warped_button: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.nether_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.nether_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_door"
        }
    },
    warped_door: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.nether_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.nether_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_door"
        }
    },
    warped_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.nether_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.nether_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_door"
        }
    },
    warped_fence: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.nether_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.nether_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_door"
        }
    },
    warped_fence_gate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.nether_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.nether_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_door"
        }
    },
    warped_fungus: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.fungus",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.fungus",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    warped_hanging_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.nether_wood_hanging_sign",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.nether_wood_hanging_sign",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    warped_hyphae: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stem",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stem",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    warped_nylium: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.nylium",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.nylium",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    warped_planks: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.nether_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.nether_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_door"
        }
    },
    warped_pressure_plate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.nether_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.nether_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_door"
        }
    },
    warped_roots: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.roots",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.roots",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    warped_shelf: {
        break: "block.shelf.break",
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    warped_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.nether_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.nether_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_door"
        }
    },
    warped_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.nether_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.nether_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_door"
        }
    },
    warped_standing_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.nether_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.nether_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_door"
        }
    },
    warped_stem: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stem",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stem",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    warped_trapdoor: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.nether_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.nether_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_door"
        }
    },
    warped_wall_sign: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "break.nether_wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.nether_wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.nether_wood_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.nether_wood_door"
        }
    },
    warped_wart_block: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.nether_wart",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.nether_wart",
            volume: 0.7
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    waterlily: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    waxed_chiseled_copper: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_copper: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_copper_bars: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_copper_bulb: {
        break: {
            pitch: 0.8,
            sound: "break.copper_bulb"
        },
        place: {
            pitch: 0.8,
            sound: "place.copper_bulb"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    waxed_copper_chain: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.chain",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.chain",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    waxed_copper_chest: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    waxed_copper_door: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_copper_golem_statue: {
        break: "block.copper_golem_statue.break",
        place: "block.copper_golem_statue.place",
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    waxed_copper_grate: {
        break: {
            pitch: 0.8,
            sound: "break.copper_grate",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.copper_grate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    waxed_copper_lantern: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.lantern.break",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.lantern.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    waxed_copper_trapdoor: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_cut_copper: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_cut_copper_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_cut_copper_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_double_cut_copper_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_exposed_chiseled_copper: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_exposed_copper: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_exposed_copper_bars: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_exposed_copper_bulb: {
        break: {
            pitch: 0.8,
            sound: "break.copper_bulb"
        },
        place: {
            pitch: 0.8,
            sound: "place.copper_bulb"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    waxed_exposed_copper_chain: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.chain",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.chain",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    waxed_exposed_copper_chest: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    waxed_exposed_copper_door: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_exposed_copper_golem_statue: {
        break: "block.copper_golem_statue.break",
        place: "block.copper_golem_statue.place",
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    waxed_exposed_copper_grate: {
        break: {
            pitch: 0.8,
            sound: "break.copper_grate",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.copper_grate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    waxed_exposed_copper_lantern: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.lantern.break",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.lantern.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    waxed_exposed_copper_trapdoor: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_exposed_cut_copper: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_exposed_cut_copper_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_exposed_cut_copper_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_exposed_double_cut_copper_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_exposed_lightning_rod: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_lightning_rod: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_oxidized_chiseled_copper: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_oxidized_copper: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_oxidized_copper_bars: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_oxidized_copper_bulb: {
        break: {
            pitch: 0.8,
            sound: "break.copper_bulb"
        },
        place: {
            pitch: 0.8,
            sound: "place.copper_bulb"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    waxed_oxidized_copper_chain: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.chain",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.chain",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    waxed_oxidized_copper_chest: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    waxed_oxidized_copper_door: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_oxidized_copper_golem_statue: {
        break: "block.copper_golem_statue.break",
        place: "block.copper_golem_statue.place",
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    waxed_oxidized_copper_grate: {
        break: {
            pitch: 0.8,
            sound: "break.copper_grate",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.copper_grate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    waxed_oxidized_copper_lantern: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.lantern.break",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.lantern.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    waxed_oxidized_copper_trapdoor: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_oxidized_cut_copper: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_oxidized_cut_copper_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_oxidized_cut_copper_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_oxidized_double_cut_copper_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_oxidized_lightning_rod: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_weathered_chiseled_copper: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_weathered_copper: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_weathered_copper_bars: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_weathered_copper_bulb: {
        break: {
            pitch: 0.8,
            sound: "break.copper_bulb"
        },
        place: {
            pitch: 0.8,
            sound: "place.copper_bulb"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    waxed_weathered_copper_chain: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.chain",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.chain",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    waxed_weathered_copper_chest: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    waxed_weathered_copper_door: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_weathered_copper_golem_statue: {
        break: "block.copper_golem_statue.break",
        place: "block.copper_golem_statue.place",
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    waxed_weathered_copper_grate: {
        break: {
            pitch: 0.8,
            sound: "break.copper_grate",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.copper_grate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    waxed_weathered_copper_lantern: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.lantern.break",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.lantern.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    waxed_weathered_copper_trapdoor: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_weathered_cut_copper: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_weathered_cut_copper_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_weathered_cut_copper_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_weathered_double_cut_copper_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    waxed_weathered_lightning_rod: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    weathered_chiseled_copper: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    weathered_copper: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    weathered_copper_bars: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    weathered_copper_bulb: {
        break: {
            pitch: 0.8,
            sound: "break.copper_bulb"
        },
        place: {
            pitch: 0.8,
            sound: "place.copper_bulb"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    weathered_copper_chain: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.chain",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.chain",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    weathered_copper_chest: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    weathered_copper_door: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    weathered_copper_golem_statue: {
        break: "block.copper_golem_statue.break",
        place: "block.copper_golem_statue.place",
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    weathered_copper_grate: {
        break: {
            pitch: 0.8,
            sound: "break.copper_grate",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.copper_grate",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    weathered_copper_lantern: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.lantern.break",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.lantern.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    weathered_copper_trapdoor: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    weathered_cut_copper: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    weathered_cut_copper_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    weathered_cut_copper_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    weathered_double_cut_copper_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    weathered_lightning_rod: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.copper",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.copper",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": {
            pitch: [
                1.0,
                1.1
            ],
            sound: "open_door.copper"
        },
        "door.close": {
            pitch: 1.0,
            sound: "close_door.copper"
        }
    },
    web: {
        break: {
            sound: "break.web"
        },
        place: {
            sound: "place.web"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    weeping_vines: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.weeping_vines.break",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "block.weeping_vines.place",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    wet_sponge: {
        break: {
            pitch: 0.8,
            sound: "break.wet_sponge",
            volume: 1.0
        },
        place: {
            pitch: 0.8,
            sound: "place.wet_sponge",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    wheat: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    white_candle: {
        break: {
            pitch: 1.0,
            sound: "dig.candle",
            volume: 1.0
        },
        place: {
            pitch: 1.0,
            sound: "place.candle",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    white_candle_cake: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    white_carpet: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    white_concrete: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    white_concrete_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    white_concrete_powder: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.sand",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.sand",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    white_concrete_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    white_concrete_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    white_glazed_terracotta: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    white_shulker_box: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    white_stained_glass: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    white_stained_glass_pane: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    white_terracotta: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    white_tulip: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    white_wool: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    white_wool_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    white_wool_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    white_wool_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    wildflowers: {
        break: {
            sound: "break.pink_petals",
            volume: 1.0
        },
        place: {
            sound: "place.pink_petals",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    wither_rose: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    wither_skeleton_skull: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    wood: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    wooden_button: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    wooden_door: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    wooden_pressure_plate: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    wooden_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.wood",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                0.8
            ],
            sound: "place.wood",
            volume: 1.0
        },
        "fence_gate.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.fence_gate"
        },
        "fence_gate.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.fence_gate"
        },
        "door.open": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "open.wooden_door"
        },
        "door.close": {
            pitch: [
                0.9,
                1.0
            ],
            sound: "close.wooden_door"
        }
    },
    wool: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    yellow_candle: {
        break: {
            pitch: 1.0,
            sound: "dig.candle",
            volume: 1.0
        },
        place: {
            pitch: 1.0,
            sound: "place.candle",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    yellow_candle_cake: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    yellow_carpet: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    yellow_concrete: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    yellow_concrete_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    yellow_concrete_powder: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.sand",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.sand",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    yellow_concrete_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    yellow_concrete_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    yellow_flower: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.grass",
            volume: 0.7
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.grass",
            volume: 0.8
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    yellow_glazed_terracotta: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    yellow_poplar_leaves: {
        break: {
            pitch: 1.2,
            sound: "block.poplar_leaves.break",
            volume: 0.8
        },
        place: {
            pitch: 0.8,
            sound: "block.poplar_leaves.place"
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    yellow_shulker_box: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    yellow_stained_glass: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    yellow_stained_glass_pane: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "random.glass",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    yellow_terracotta: {
        break: null,
        place: null,
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    yellow_wool: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    yellow_wool_double_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    yellow_wool_slab: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    yellow_wool_stairs: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.cloth",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.cloth",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    },
    zombie_head: {
        break: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "dig.stone",
            volume: 1.0
        },
        place: {
            pitch: [
                0.8,
                1.0
            ],
            sound: "place.stone",
            volume: 1.0
        },
        "fence_gate.close": null,
        "fence_gate.open": null,
        "door.open": null,
        "door.close": null
    }
}
