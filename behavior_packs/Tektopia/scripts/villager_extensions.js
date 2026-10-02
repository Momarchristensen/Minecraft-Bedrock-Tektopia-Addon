var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// src/utils.ts
import {
  StructureRotation
} from "@minecraft/server";
function isVectorBetween(vector, vector1, vector2, ignoreY = false) {
  const centeredVector = centerVector(vector);
  const startingVector = floorVector(minVectors(vector1, vector2));
  const endingVector = ceilVector(maxVectors(vector1, vector2));
  return centeredVector.x >= startingVector.x && centeredVector.x <= endingVector.x && (ignoreY || centeredVector.y >= startingVector.y && centeredVector.y <= endingVector.y) && centeredVector.z >= startingVector.z && centeredVector.z <= endingVector.z;
}
function formatTypeId(itemTypeId) {
  return capitalizeEveryWord(removeIdentifier(itemTypeId).replace(/_/g, " "));
}
function capitalizeEveryWord(sentence) {
  const words = sentence.split(" ");
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  const capitalizedSentence = capitalizedWords.join(" ");
  return capitalizedSentence;
}
function minVectors(...vectors) {
  return {
    x: Math.min(...vectors.map((vector) => vector.x)),
    y: Math.min(...vectors.map((vector) => vector.y)),
    z: Math.min(...vectors.map((vector) => vector.z))
  };
}
function maxVectors(...vectors) {
  return {
    x: Math.max(...vectors.map((vector) => vector.x)),
    y: Math.max(...vectors.map((vector) => vector.y)),
    z: Math.max(...vectors.map((vector) => vector.z))
  };
}
function floorVector(vector) {
  return {
    x: Math.floor(vector.x),
    y: Math.floor(vector.y),
    z: Math.floor(vector.z)
  };
}
function ceilVector(vector) {
  return {
    x: Math.ceil(vector.x),
    y: Math.ceil(vector.y),
    z: Math.ceil(vector.z)
  };
}
function calculateDistance(v1, v2, ignoreY = false) {
  const dx = v1.x - v2.x;
  const dy = ignoreY ? 0 : v1.y - v2.y;
  const dz = v1.z - v2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
function calculateSquareDistance(v1, v2, ignoreY = false) {
  const dx = Math.abs(v1.x - v2.x);
  const dy = ignoreY ? 0 : Math.abs(v1.y - v2.y);
  const dz = Math.abs(v1.z - v2.z);
  return Math.max(dx, dy, dz);
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function vectorToString(vector) {
  return `${vector.x},${vector.y},${vector.z}`;
}
function centerVector(vector, floorY = false) {
  return {
    x: Math.floor(vector.x) + 0.5,
    y: Math.floor(vector.y) + (floorY ? 0 : 0.5),
    z: Math.floor(vector.z) + 0.5
  };
}
function addVectors(...vectors) {
  let x = 0, y = 0, z = 0;
  const len = vectors.length;
  for (let i = 0; i < len; i++) {
    const v = vectors[i];
    x += v.x;
    y += v.y;
    z += v.z;
  }
  return { x, y, z };
}
function addVector(vector, axises, value) {
  const result = {
    x: vector.x,
    y: vector.y,
    z: vector.z
  };
  for (const axis of axises) {
    if (axis in result) {
      result[axis] += value;
    }
  }
  return result;
}
function multiplyVector(vector, axises, value) {
  const result = {
    x: vector.x,
    y: vector.y,
    z: vector.z
  };
  for (const axis of axises) {
    if (axis in result) {
      result[axis] *= value;
    }
  }
  return result;
}
function stringToVector(string) {
  const index1 = string.indexOf(",");
  const index2 = string.indexOf(",", index1 + 1);
  return {
    x: Number(string.substring(0, index1)),
    y: Number(string.substring(index1 + 1, index2)),
    z: Number(string.substring(index2 + 1))
  };
}
function subtractLists(list1, list2) {
  const removalSet = new Set(list2);
  const result = [];
  const len1 = list1.length;
  const has = removalSet.has.bind(removalSet);
  for (let i = 0; i < len1; ++i) {
    const item = list1[i];
    if (!has(item)) {
      result.push(item);
    }
  }
  return result;
}
function areVectorsEqual(vector1, vector2) {
  return vector1.x === vector2.x && vector1.y === vector2.y && vector1.z === vector2.z;
}
function vectorToDirection(vector) {
  return directionMap[vectorToString(vector)];
}
function subtractVectors(vector1, vector2) {
  return {
    x: vector1.x - vector2.x,
    y: vector1.y - vector2.y,
    z: vector1.z - vector2.z
  };
}
function removeIdentifier(string) {
  return string.includes(":") ? string.split(":")[1] : string;
}
var directionMap;
var init_utils = __esm({
  "src/utils.ts"() {
    "use strict";
    directionMap = {
      "0,0,-1": "north",
      "1,0,0": "east",
      "0,0,1": "south",
      "-1,0,0": "west",
      "0,1,0": "up",
      "0,-1,0": "down",
      "1,0,-1": "northeast",
      "1,0,1": "southeast",
      "-1,0,1": "southwest",
      "-1,0,-1": "northwest",
      "0,1,-1": "northup",
      "1,1,0": "eastup",
      "0,1,1": "southup",
      "-1,1,0": "westup",
      "0,-1,-1": "northdown",
      "1,-1,0": "eastdown",
      "0,-1,1": "southdown",
      "-1,-1,0": "westdown"
    };
  }
});

// src/variables.ts
var minecraftDangerousBlockTypes, minecraftNonSolidBlocks;
var init_variables = __esm({
  "src/variables.ts"() {
    "use strict";
    minecraftDangerousBlockTypes = [
      "minecraft:lava",
      "minecraft:flowing_lava",
      "minecraft:water",
      "minecraft:flowing_water",
      "minecraft:magma",
      "minecraft:fire",
      "minecraft:soul_fire",
      "minecraft:cactus",
      "minecraft:powder_snow",
      "minecraft:campfire",
      "minecraft:soul_campfire",
      "minecraft:sweet_berry_bush"
    ];
    minecraftNonSolidBlocks = [
      "minecraft:glow_lichen",
      "minecraft:glow_frame",
      "minecraft:frame",
      "minecraft:pink_tulip",
      "minecraft:detector_rail",
      "minecraft:zombie_head",
      "minecraft:cornflower",
      "minecraft:leaf_litter",
      "minecraft:dead_bubble_coral_wall_fan",
      "minecraft:blue_carpet",
      "minecraft:vine",
      "minecraft:cyan_carpet",
      "minecraft:cactus_flower",
      "minecraft:pale_moss_carpet",
      "minecraft:white_tulip",
      "minecraft:open_eyeblossom",
      "minecraft:brown_mushroom",
      "minecraft:powder_snow",
      "minecraft:dead_horn_coral_wall_fan",
      "minecraft:dead_bubble_coral_fan",
      "minecraft:powered_repeater",
      "minecraft:hanging_roots",
      "minecraft:light_block_1",
      "minecraft:azure_bluet",
      "minecraft:snow_layer",
      "minecraft:white_carpet",
      "minecraft:creeper_head",
      "minecraft:bubble_coral_fan",
      "minecraft:nether_wart",
      "minecraft:gray_carpet",
      "minecraft:wheat",
      "minecraft:lily_of_the_valley",
      "minecraft:blue_orchid",
      "minecraft:dead_brain_coral_fan",
      "minecraft:seagrass",
      "minecraft:tube_coral_fan",
      "minecraft:big_dripleaf",
      "minecraft:dead_horn_coral",
      "minecraft:magenta_carpet",
      "minecraft:pitcher_crop",
      "minecraft:redstone_wire",
      "minecraft:firefly_bush",
      "minecraft:fern",
      "minecraft:poppy",
      "minecraft:moss_carpet",
      "minecraft:warped_fungus",
      "minecraft:melon_stem",
      "minecraft:flower_pot",
      "minecraft:short_grass",
      "minecraft:activator_rail",
      "minecraft:potatoes",
      "minecraft:soul_torch",
      "minecraft:allium",
      "minecraft:lava",
      "minecraft:light_block_14",
      "minecraft:powered_comparator",
      "minecraft:light_block_8",
      "minecraft:spruce_sapling",
      "minecraft:dark_oak_sapling",
      "minecraft:pale_oak_sapling",
      "minecraft:soul_fire",
      "minecraft:pink_petals",
      "minecraft:pink_carpet",
      "minecraft:brown_carpet",
      "minecraft:brain_coral",
      "minecraft:orange_carpet",
      "minecraft:pitcher_plant",
      "minecraft:unlit_redstone_torch",
      "minecraft:light_block_9",
      "minecraft:light_block_7",
      "minecraft:light_block_6",
      "minecraft:light_block_5",
      "minecraft:light_block_4",
      "minecraft:warped_roots",
      "minecraft:small_dripleaf_block",
      "minecraft:light_block_3",
      "minecraft:light_block_2",
      "minecraft:light_block_0",
      "minecraft:unpowered_repeater",
      "minecraft:oak_sapling",
      "minecraft:fire_coral",
      "minecraft:bush",
      "minecraft:kelp",
      "minecraft:dead_fire_coral_wall_fan",
      "minecraft:sea_pickle",
      "minecraft:flowering_azalea",
      "minecraft:brain_coral_fan",
      "minecraft:torch",
      "minecraft:water",
      "minecraft:torchflower",
      "minecraft:colored_torch_red",
      "minecraft:spore_blossom",
      "minecraft:waterlily",
      "minecraft:redstone_torch",
      "minecraft:tube_coral_wall_fan",
      "minecraft:light_block_13",
      "minecraft:horn_coral",
      "minecraft:player_head",
      "minecraft:light_block_10",
      "minecraft:rose_bush",
      "minecraft:green_carpet",
      "minecraft:compound_creator",
      "minecraft:dead_brain_coral_wall_fan",
      "minecraft:light_block_12",
      "minecraft:rail",
      "minecraft:carrots",
      "minecraft:brain_coral_wall_fan",
      "minecraft:short_dry_grass",
      "minecraft:pale_hanging_moss",
      "minecraft:bubble_coral",
      "minecraft:dead_tube_coral",
      "minecraft:light_block_11",
      "minecraft:colored_torch_blue",
      "minecraft:flowing_lava",
      "minecraft:skeleton_skull",
      "minecraft:frog_spawn",
      "minecraft:horn_coral_wall_fan",
      "minecraft:chorus_flower",
      "minecraft:torchflower_crop",
      "minecraft:lab_table",
      "minecraft:element_constructor",
      "minecraft:wildflowers",
      "minecraft:colored_torch_purple",
      "minecraft:red_mushroom",
      "minecraft:black_carpet",
      "minecraft:bubble_column",
      "minecraft:sunflower",
      "minecraft:wither_rose",
      "minecraft:deadbush",
      "minecraft:flowing_water",
      "minecraft:cave_vines",
      "minecraft:light_blue_carpet",
      "minecraft:beetroot",
      "minecraft:tall_dry_grass",
      "minecraft:golden_rail",
      "minecraft:fire_coral_wall_fan",
      "minecraft:dead_brain_coral",
      "minecraft:weeping_vines",
      "minecraft:chorus_plant",
      "minecraft:pumpkin_stem",
      "minecraft:lever",
      "minecraft:twisting_vines",
      "minecraft:reeds",
      "minecraft:end_rod",
      "minecraft:dragon_head",
      "minecraft:cave_vines_body_with_berries",
      "minecraft:oxeye_daisy",
      "minecraft:yellow_carpet",
      "minecraft:tripwire_hook",
      "minecraft:large_fern",
      "minecraft:sweet_berry_bush",
      "minecraft:piglin_head",
      "minecraft:jungle_sapling",
      "minecraft:web",
      "minecraft:cocoa",
      "minecraft:fire",
      "minecraft:dead_fire_coral",
      "minecraft:acacia_sapling",
      "minecraft:unpowered_comparator",
      "minecraft:tall_grass",
      "minecraft:light_block_15",
      "minecraft:nether_sprouts",
      "minecraft:dead_horn_coral_fan",
      "minecraft:wither_skeleton_skull",
      "minecraft:horn_coral_fan",
      "minecraft:colored_torch_green",
      "minecraft:purple_carpet",
      "minecraft:fire_coral_fan",
      "minecraft:air",
      "minecraft:dead_tube_coral_fan",
      "minecraft:lime_carpet",
      "minecraft:closed_eyeblossom",
      "minecraft:dead_fire_coral_fan",
      "minecraft:bubble_coral_wall_fan",
      "minecraft:orange_tulip",
      "minecraft:azalea",
      "minecraft:mangrove_propagule",
      "minecraft:dead_bubble_coral",
      "minecraft:cherry_sapling",
      "minecraft:lilac",
      "minecraft:red_carpet",
      "minecraft:red_tulip",
      "minecraft:trip_wire",
      "minecraft:cave_vines_head_with_berries",
      "minecraft:dead_tube_coral_wall_fan",
      "minecraft:birch_sapling",
      "minecraft:bamboo_sapling",
      "minecraft:crimson_roots",
      "minecraft:light_gray_carpet",
      "minecraft:crimson_fungus",
      "minecraft:tube_coral",
      "minecraft:peony",
      "minecraft:material_reducer",
      "minecraft:dandelion",
      "minecraft:pink_tulip",
      "minecraft:cornflower",
      "minecraft:white_tulip",
      "minecraft:azure_bluet",
      "minecraft:lily_of_the_valley",
      "minecraft:blue_orchid",
      "minecraft:poppy",
      "minecraft:allium",
      "minecraft:oxeye_daisy",
      "minecraft:orange_tulip",
      "minecraft:red_tulip",
      "minecraft:dandelion",
      "minecraft:wheat",
      "minecraft:pitcher_crop",
      "minecraft:potatoes",
      "minecraft:carrots",
      "minecraft:torchflower_crop",
      "minecraft:beetroot",
      "minecraft:pitcher_crop",
      "minecraft:spruce_sapling",
      "minecraft:dark_oak_sapling",
      "minecraft:pitcher_plant",
      "minecraft:oak_sapling",
      "minecraft:rose_bush",
      "minecraft:sunflower",
      "minecraft:large_fern",
      "minecraft:jungle_sapling",
      "minecraft:acacia_sapling",
      "minecraft:tall_grass",
      "minecraft:lilac",
      "minecraft:birch_sapling",
      "minecraft:peony",
      "minecraft:acacia_wall_sign",
      "minecraft:birch_standing_sign",
      "minecraft:spruce_standing_sign",
      "minecraft:warped_wall_sign",
      "minecraft:darkoak_wall_sign",
      "minecraft:cherry_hanging_sign",
      "minecraft:crimson_wall_sign",
      "minecraft:pale_oak_hanging_sign",
      "minecraft:acacia_standing_sign",
      "minecraft:dark_oak_hanging_sign",
      "minecraft:pale_oak_wall_sign",
      "minecraft:darkoak_standing_sign",
      "minecraft:jungle_wall_sign",
      "minecraft:warped_hanging_sign",
      "minecraft:birch_hanging_sign",
      "minecraft:wall_sign",
      "minecraft:acacia_hanging_sign",
      "minecraft:jungle_hanging_sign",
      "minecraft:mangrove_standing_sign",
      "minecraft:bamboo_hanging_sign",
      "minecraft:warped_standing_sign",
      "minecraft:oak_hanging_sign",
      "minecraft:mangrove_wall_sign",
      "minecraft:spruce_wall_sign",
      "minecraft:standing_sign",
      "minecraft:spruce_hanging_sign",
      "minecraft:cherry_standing_sign",
      "minecraft:mangrove_hanging_sign",
      "minecraft:jungle_standing_sign",
      "minecraft:pale_oak_standing_sign",
      "minecraft:birch_wall_sign",
      "minecraft:bamboo_wall_sign",
      "minecraft:crimson_hanging_sign",
      "minecraft:bamboo_standing_sign",
      "minecraft:crimson_standing_sign",
      "minecraft:cherry_wall_sign",
      "minecraft:detector_rail",
      "minecraft:activator_rail",
      "minecraft:rail",
      "minecraft:golden_rail",
      "minecraft:torch",
      "minecraft:soul_torch"
    ];
  }
});

// src/registry.ts
import {
  BlockTypes,
  DimensionTypes,
  EntityTypes
} from "@minecraft/server";
function lazy(compute) {
  let cached;
  let ready = false;
  return () => {
    if (!ready) {
      cached = compute();
      ready = true;
    }
    return cached;
  };
}
function defineRegistry(definitions) {
  const registry = {};
  for (const key of Object.keys(definitions)) {
    Object.defineProperty(registry, key, {
      get: lazy(() => definitions[key](registry)),
      enumerable: true
    });
  }
  return registry;
}
var blocks, entities, Registry;
var init_registry = __esm({
  "src/registry.ts"() {
    "use strict";
    init_utils();
    init_variables();
    blocks = (test) => (self) => self.blockTypes.filter(test);
    entities = (test) => (self) => self.entityTypes.filter(test);
    Registry = defineRegistry({
      blockTypes: () => BlockTypes.getAll().map((b) => b.id),
      entityTypes: () => EntityTypes.getAll().map((e) => e.id),
      trapdoorTypes: blocks((id) => id.includes("trapdoor")),
      doorTypes: blocks((id) => id.includes("_door") || id.includes("_fence_gate")),
      slabTypes: blocks((id) => id.includes("_slab") && !id.includes("_double_slab")),
      stairTypes: blocks((id) => id.includes("_stair")),
      fenceTypes: blocks((id) => id.includes("_fence") || id.includes("_wall") && !id.includes("_sign") && !id.includes("_fan")),
      saplingTypes: blocks((id) => id.includes("_sapling")),
      logTypes: blocks((id) => id.includes("_log") && !id.includes("stripped_")),
      leafTypes: blocks((id) => id.includes("_leaves")),
      villagerTypes: entities((id) => id.startsWith("tektopia:")),
      noWalkBlocks: () => [...Registry.fenceTypes, ...Registry.doorTypes, ...Registry.trapdoorTypes],
      solidBlocks: () => subtractLists(subtractLists(Registry.blockTypes, minecraftNonSolidBlocks), Registry.noWalkBlocks),
      solidBlocksSet: () => new Set(Registry.solidBlocks),
      lumberjackPickups: () => ["minecraft:apple", ...Registry.saplingTypes, ...Registry.logTypes],
      dimensionTypes: () => DimensionTypes.getAll().map((dimensionType) => dimensionType.typeId)
    });
  }
});

// src/generated.ts
var blockSounds;
var init_generated = __esm({
  "src/generated.ts"() {
    "use strict";
    blockSounds = {
      acacia_button: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      acacia_door: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      acacia_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      acacia_fence: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      acacia_fence_gate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      acacia_hanging_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.hanging_sign",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.hanging_sign",
          volume: 1
        }
      },
      acacia_leaves: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      acacia_log: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      acacia_planks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      acacia_pressure_plate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      acacia_sapling: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      acacia_shelf: {
        break: "block.shelf.break",
        place: null
      },
      acacia_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      acacia_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      acacia_standing_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      acacia_trapdoor: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      acacia_wall_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      acacia_wood: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      activator_rail: {
        break: {
          pitch: [
            1.1,
            1.2
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            1.2,
            1.25
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      allium: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      allow: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      amethyst_block: {
        break: {
          pitch: 0.8,
          sound: "break.amethyst_block",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.amethyst_block",
          volume: 1
        }
      },
      amethyst_cluster: {
        break: {
          sound: "break.amethyst_cluster",
          volume: 1
        },
        place: {
          sound: "place.amethyst_cluster",
          volume: 1
        }
      },
      ancient_debris: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.ancient_debris",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.ancient_debris",
          volume: 1
        }
      },
      andesite: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      andesite_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      andesite_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      andesite_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      andesite_wall: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      anvil: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.anvil_land",
          volume: 0.5
        }
      },
      azalea: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.azalea",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.azalea",
          volume: 1
        }
      },
      azalea_leaves: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.azalea_leaves",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.azalea_leaves",
          volume: 1
        }
      },
      azalea_leaves_flowered: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.azalea_leaves",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.azalea_leaves",
          volume: 1
        }
      },
      azure_bluet: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      bamboo: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.bamboo.break",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.bamboo.place",
          volume: 1
        }
      },
      bamboo_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.bamboo_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.bamboo_wood",
          volume: 1
        }
      },
      bamboo_button: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.bamboo_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.bamboo_wood",
          volume: 1
        }
      },
      bamboo_door: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.bamboo_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.bamboo_wood",
          volume: 1
        }
      },
      bamboo_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.bamboo_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.bamboo_wood",
          volume: 1
        }
      },
      bamboo_fence: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.bamboo_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.bamboo_wood",
          volume: 1
        }
      },
      bamboo_fence_gate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.bamboo_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.bamboo_wood",
          volume: 1
        }
      },
      bamboo_hanging_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.bamboo_wood_hanging_sign",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.bamboo_wood_hanging_sign",
          volume: 1
        }
      },
      bamboo_mosaic: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.bamboo_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.bamboo_wood",
          volume: 1
        }
      },
      bamboo_mosaic_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.bamboo_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.bamboo_wood",
          volume: 1
        }
      },
      bamboo_mosaic_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.bamboo_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.bamboo_wood",
          volume: 1
        }
      },
      bamboo_mosaic_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.bamboo_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.bamboo_wood",
          volume: 1
        }
      },
      bamboo_planks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.bamboo_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.bamboo_wood",
          volume: 1
        }
      },
      bamboo_pressure_plate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.bamboo_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.bamboo_wood",
          volume: 1
        }
      },
      bamboo_sapling: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.bamboo_sapling.break",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.bamboo_sapling.place",
          volume: 1
        }
      },
      bamboo_shelf: {
        break: "block.shelf.break",
        place: null
      },
      bamboo_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.bamboo_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.bamboo_wood",
          volume: 1
        }
      },
      bamboo_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.bamboo_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.bamboo_wood",
          volume: 1
        }
      },
      bamboo_standing_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.bamboo_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.bamboo_wood",
          volume: 1
        }
      },
      bamboo_trapdoor: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.bamboo_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.bamboo_wood",
          volume: 1
        }
      },
      bamboo_wall_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.bamboo_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.bamboo_wood",
          volume: 1
        }
      },
      barrel: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      basalt: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.basalt",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.basalt",
          volume: 1
        }
      },
      beacon: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      bed: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      bedrock: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      beetroot: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      bell: {
        break: {
          pitch: [
            1.1,
            1.2
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            1.2,
            1.25
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      big_dripleaf: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.big_dripleaf",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.big_dripleaf",
          volume: 1
        }
      },
      birch_button: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      birch_door: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      birch_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      birch_fence: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      birch_fence_gate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      birch_hanging_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.hanging_sign",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.hanging_sign",
          volume: 1
        }
      },
      birch_leaves: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      birch_log: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      birch_planks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      birch_pressure_plate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      birch_sapling: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      birch_shelf: {
        break: "block.shelf.break",
        place: null
      },
      birch_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      birch_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      birch_standing_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      birch_trapdoor: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      birch_wall_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      birch_wood: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      black_candle: {
        break: {
          pitch: 1,
          sound: "dig.candle",
          volume: 1
        },
        place: {
          pitch: 1,
          sound: "place.candle",
          volume: 1
        }
      },
      black_candle_cake: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      black_carpet: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      black_concrete: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      black_concrete_powder: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.sand",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.sand",
          volume: 1
        }
      },
      black_glazed_terracotta: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      black_shulker_box: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      black_stained_glass: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      black_stained_glass_pane: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      black_terracotta: {
        break: null,
        place: null
      },
      black_wool: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      blackstone: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      blackstone_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      blackstone_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      blackstone_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      blackstone_wall: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      blast_furnace: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      blue_candle: {
        break: {
          pitch: 1,
          sound: "dig.candle",
          volume: 1
        },
        place: {
          pitch: 1,
          sound: "place.candle",
          volume: 1
        }
      },
      blue_candle_cake: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      blue_carpet: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      blue_concrete: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      blue_concrete_powder: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.sand",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.sand",
          volume: 1
        }
      },
      blue_glazed_terracotta: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      blue_ice: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      blue_orchid: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      blue_shulker_box: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      blue_stained_glass: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      blue_stained_glass_pane: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      blue_terracotta: {
        break: null,
        place: null
      },
      blue_wool: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      bone_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.bone_block",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.bone_block",
          volume: 1
        }
      },
      bookshelf: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      border_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      brain_coral: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      brain_coral_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      brain_coral_fan: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      brain_coral_wall_fan: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      brewing_stand: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      brick_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      brick_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      brick_wall: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      brown_candle: {
        break: {
          pitch: 1,
          sound: "dig.candle",
          volume: 1
        },
        place: {
          pitch: 1,
          sound: "place.candle",
          volume: 1
        }
      },
      brown_candle_cake: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      brown_carpet: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      brown_concrete: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      brown_concrete_powder: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.sand",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.sand",
          volume: 1
        }
      },
      brown_glazed_terracotta: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      brown_mushroom: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      brown_mushroom_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      brown_shulker_box: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      brown_stained_glass: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      brown_stained_glass_pane: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      brown_terracotta: {
        break: null,
        place: null
      },
      brown_wool: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      bubble_coral: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      bubble_coral_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      bubble_coral_fan: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      bubble_coral_wall_fan: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      budding_amethyst: {
        break: {
          pitch: 0.8,
          sound: "break.amethyst_block",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.amethyst_block",
          volume: 1
        }
      },
      bush: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      cactus: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      cactus_flower: {
        break: {
          pitch: 0.8,
          sound: "block.cactus_flower.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.cactus_flower.place"
        }
      },
      cake: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      calcite: {
        break: {
          sound: "break.calcite",
          volume: 1
        },
        place: {
          sound: "place.calcite",
          volume: 1
        }
      },
      calibrated_sculk_sensor: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.sculk_sensor",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.sculk_sensor",
          volume: 0.8
        }
      },
      campfire: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      candle: {
        break: {
          pitch: 1,
          sound: "dig.candle",
          volume: 1
        },
        place: {
          pitch: 1,
          sound: "place.candle",
          volume: 1
        }
      },
      candle_cake: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      carpet: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      carrots: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      cartography_table: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      carved_pumpkin: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      cave_vines: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cave_vines",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cave_vines",
          volume: 1
        }
      },
      cave_vines_body_with_berries: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cave_vines",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cave_vines",
          volume: 1
        }
      },
      cave_vines_head_with_berries: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cave_vines",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cave_vines",
          volume: 1
        }
      },
      chain: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.chain",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.chain",
          volume: 1
        }
      },
      chain_command_block: {
        break: {
          pitch: [
            1.1,
            1.2
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            1.2,
            1.25
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      cherry_button: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.cherry_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.cherry_wood",
          volume: 1
        }
      },
      cherry_door: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.cherry_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.cherry_wood",
          volume: 1
        }
      },
      cherry_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.cherry_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.cherry_wood",
          volume: 1
        }
      },
      cherry_fence: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.cherry_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.cherry_wood",
          volume: 1
        }
      },
      cherry_fence_gate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.cherry_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.cherry_wood",
          volume: 1
        }
      },
      cherry_hanging_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.cherry_wood_hanging_sign",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cherry_wood_hanging_sign",
          volume: 1
        }
      },
      cherry_leaves: {
        break: {
          sound: "break.cherry_leaves",
          volume: 1
        },
        place: {
          sound: "place.cherry_leaves",
          volume: 1
        }
      },
      cherry_log: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.cherry_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.cherry_wood",
          volume: 1
        }
      },
      cherry_planks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.cherry_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.cherry_wood",
          volume: 1
        }
      },
      cherry_pressure_plate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.cherry_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.cherry_wood",
          volume: 1
        }
      },
      cherry_sapling: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.bamboo_sapling.break",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.bamboo_sapling.place",
          volume: 1
        }
      },
      cherry_shelf: {
        break: "block.shelf.break",
        place: null
      },
      cherry_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.cherry_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.cherry_wood",
          volume: 1
        }
      },
      cherry_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.cherry_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.cherry_wood",
          volume: 1
        }
      },
      cherry_standing_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.cherry_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.cherry_wood",
          volume: 1
        }
      },
      cherry_trapdoor: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.cherry_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.cherry_wood",
          volume: 1
        }
      },
      cherry_wall_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.cherry_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.cherry_wood",
          volume: 1
        }
      },
      cherry_wood: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.cherry_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.cherry_wood",
          volume: 1
        }
      },
      chest: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      chipped_anvil: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.anvil_land",
          volume: 0.5
        }
      },
      chiseled_bookshelf: {
        break: {
          pitch: 1,
          sound: "break.chiseled_bookshelf",
          volume: 1
        },
        place: {
          pitch: 1,
          sound: "place.chiseled_bookshelf",
          volume: 1
        }
      },
      chiseled_cinnabar: {
        break: {
          pitch: 0.8,
          sound: "block.cinnabar.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.cinnabar.place"
        }
      },
      chiseled_copper: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      chiseled_deepslate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate_bricks",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate_bricks",
          volume: 1
        }
      },
      chiseled_nether_bricks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.nether_brick",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.nether_brick",
          volume: 1
        }
      },
      chiseled_polished_blackstone: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      chiseled_quartz_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      chiseled_red_sandstone: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      chiseled_resin_bricks: {
        break: {
          pitch: 0.8,
          sound: "block.resin_brick.break",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "block.resin_brick.place",
          volume: 1
        }
      },
      chiseled_sandstone: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      chiseled_stone_bricks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      chiseled_sulfur: {
        break: {
          pitch: 0.8,
          sound: "block.sulfur.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.sulfur.place"
        }
      },
      chiseled_tuff: {
        break: {
          pitch: 0.8,
          sound: "place.tuff",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.tuff",
          volume: 1
        }
      },
      chiseled_tuff_bricks: {
        break: {
          pitch: 0.8,
          sound: "place.tuff_bricks",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.tuff_bricks",
          volume: 1
        }
      },
      chorus_flower: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      chorus_plant: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      cinnabar: {
        break: {
          pitch: 0.8,
          sound: "block.cinnabar.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.cinnabar.place"
        }
      },
      cinnabar_brick_double_slab: {
        break: {
          pitch: 0.8,
          sound: "block.cinnabar.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.cinnabar.place"
        }
      },
      cinnabar_brick_slab: {
        break: {
          pitch: 0.8,
          sound: "block.cinnabar.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.cinnabar.place"
        }
      },
      cinnabar_brick_stairs: {
        break: {
          pitch: 0.8,
          sound: "block.cinnabar.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.cinnabar.place"
        }
      },
      cinnabar_brick_wall: {
        break: {
          pitch: 0.8,
          sound: "block.cinnabar.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.cinnabar.place"
        }
      },
      cinnabar_bricks: {
        break: {
          pitch: 0.8,
          sound: "block.cinnabar.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.cinnabar.place"
        }
      },
      cinnabar_double_slab: {
        break: {
          pitch: 0.8,
          sound: "block.cinnabar.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.cinnabar.place"
        }
      },
      cinnabar_slab: {
        break: {
          pitch: 0.8,
          sound: "block.cinnabar.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.cinnabar.place"
        }
      },
      cinnabar_stairs: {
        break: {
          pitch: 0.8,
          sound: "block.cinnabar.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.cinnabar.place"
        }
      },
      cinnabar_wall: {
        break: {
          pitch: 0.8,
          sound: "block.cinnabar.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.cinnabar.place"
        }
      },
      clay: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.gravel",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.gravel",
          volume: 1
        }
      },
      closed_eyeblossom: {
        break: null,
        place: null
      },
      coal_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      coal_ore: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      coarse_dirt: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.gravel",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.gravel",
          volume: 1
        }
      },
      cobbled_deepslate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate",
          volume: 1
        }
      },
      cobbled_deepslate_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate",
          volume: 1
        }
      },
      cobbled_deepslate_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate",
          volume: 1
        }
      },
      cobbled_deepslate_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate",
          volume: 1
        }
      },
      cobbled_deepslate_wall: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate",
          volume: 1
        }
      },
      cobblestone: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      cobblestone_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      cobblestone_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      cobblestone_wall: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      cocoa: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      command_block: {
        break: {
          pitch: [
            1.1,
            1.2
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            1.2,
            1.25
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      composter: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      concrete: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      concretePowder: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.sand",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.sand",
          volume: 1
        }
      },
      conduit: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      copper_bars: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      copper_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
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
        }
      },
      copper_chain: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.chain",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.chain",
          volume: 1
        }
      },
      copper_chest: {
        break: null,
        place: null
      },
      copper_door: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      copper_golem_statue: {
        break: "block.copper_golem_statue.break",
        place: "block.copper_golem_statue.place"
      },
      copper_grate: {
        break: {
          pitch: 0.8,
          sound: "break.copper_grate",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.copper_grate",
          volume: 1
        }
      },
      copper_lantern: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.lantern.break",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.lantern.place",
          volume: 1
        }
      },
      copper_ore: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      copper_torch: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      copper_trapdoor: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      coral: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      coral_fan: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      coral_fan_dead: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      coral_fan_hang: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      coral_fan_hang2: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      coral_fan_hang3: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      cornflower: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      cracked_deepslate_bricks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate_bricks",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate_bricks",
          volume: 1
        }
      },
      cracked_deepslate_tiles: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate_bricks",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate_bricks",
          volume: 1
        }
      },
      cracked_nether_bricks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.nether_brick",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.nether_brick",
          volume: 1
        }
      },
      cracked_polished_blackstone_bricks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      cracked_stone_bricks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      crafter: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      crafting_table: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
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
        }
      },
      creeper_head: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      crimson_button: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.nether_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.nether_wood",
          volume: 1
        }
      },
      crimson_door: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.nether_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.nether_wood",
          volume: 1
        }
      },
      crimson_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.nether_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.nether_wood",
          volume: 1
        }
      },
      crimson_fence: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.nether_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.nether_wood",
          volume: 1
        }
      },
      crimson_fence_gate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.nether_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.nether_wood",
          volume: 1
        }
      },
      crimson_fungus: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.fungus",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.fungus",
          volume: 1
        }
      },
      crimson_hanging_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.nether_wood_hanging_sign",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.nether_wood_hanging_sign",
          volume: 1
        }
      },
      crimson_hyphae: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stem",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stem",
          volume: 1
        }
      },
      crimson_nylium: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.nylium",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.nylium",
          volume: 1
        }
      },
      crimson_planks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.nether_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.nether_wood",
          volume: 1
        }
      },
      crimson_pressure_plate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.nether_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.nether_wood",
          volume: 1
        }
      },
      crimson_roots: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.roots",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.roots",
          volume: 1
        }
      },
      crimson_shelf: {
        break: "block.shelf.break",
        place: null
      },
      crimson_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.nether_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.nether_wood",
          volume: 1
        }
      },
      crimson_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.nether_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.nether_wood",
          volume: 1
        }
      },
      crimson_standing_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.nether_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.nether_wood",
          volume: 1
        }
      },
      crimson_stem: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stem",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stem",
          volume: 1
        }
      },
      crimson_trapdoor: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.nether_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.nether_wood",
          volume: 1
        }
      },
      crimson_wall_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.nether_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.nether_wood",
          volume: 1
        }
      },
      crying_obsidian: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      cut_copper: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      cut_copper_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      cut_copper_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      cut_red_sandstone: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      cut_red_sandstone_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      cut_red_sandstone_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      cut_sandstone: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      cut_sandstone_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      cut_sandstone_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      cyan_candle: {
        break: {
          pitch: 1,
          sound: "dig.candle",
          volume: 1
        },
        place: {
          pitch: 1,
          sound: "place.candle",
          volume: 1
        }
      },
      cyan_candle_cake: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      cyan_carpet: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      cyan_concrete: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      cyan_concrete_powder: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.sand",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.sand",
          volume: 1
        }
      },
      cyan_glazed_terracotta: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      cyan_shulker_box: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      cyan_stained_glass: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      cyan_stained_glass_pane: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      cyan_terracotta: {
        break: null,
        place: null
      },
      cyan_wool: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      damaged_anvil: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.anvil_land",
          volume: 0.5
        }
      },
      dandelion: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      dark_oak_button: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      dark_oak_door: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      dark_oak_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      dark_oak_fence: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      dark_oak_fence_gate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      dark_oak_hanging_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.hanging_sign",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.hanging_sign",
          volume: 1
        }
      },
      dark_oak_leaves: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      dark_oak_log: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      dark_oak_planks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      dark_oak_pressure_plate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      dark_oak_sapling: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      dark_oak_shelf: {
        break: "block.shelf.break",
        place: null
      },
      dark_oak_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      dark_oak_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      dark_oak_trapdoor: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      dark_oak_wood: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      dark_prismarine: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      dark_prismarine_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      dark_prismarine_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      dark_prismarine_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      darkoak_standing_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      darkoak_wall_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      daylight_detector: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      daylight_detector_inverted: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      dead_brain_coral: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      dead_brain_coral_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      dead_brain_coral_fan: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      dead_brain_coral_wall_fan: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      dead_bubble_coral: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      dead_bubble_coral_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      dead_bubble_coral_fan: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      dead_bubble_coral_wall_fan: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      dead_fire_coral: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      dead_fire_coral_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      dead_fire_coral_fan: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      dead_fire_coral_wall_fan: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      dead_horn_coral: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      dead_horn_coral_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      dead_horn_coral_fan: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      dead_horn_coral_wall_fan: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      dead_tube_coral: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      dead_tube_coral_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      dead_tube_coral_fan: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      dead_tube_coral_wall_fan: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      deadbush: {
        break: null,
        place: null
      },
      decorated_pot: {
        break: null,
        place: {
          pitch: 1,
          sound: "place.decorated_pot",
          volume: 1
        }
      },
      deepslate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate",
          volume: 1
        }
      },
      deepslate_brick_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate_bricks",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate_bricks",
          volume: 1
        }
      },
      deepslate_brick_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate_bricks",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate_bricks",
          volume: 1
        }
      },
      deepslate_brick_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate_bricks",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate_bricks",
          volume: 1
        }
      },
      deepslate_brick_wall: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate_bricks",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate_bricks",
          volume: 1
        }
      },
      deepslate_bricks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate_bricks",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate_bricks",
          volume: 1
        }
      },
      deepslate_coal_ore: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate",
          volume: 1
        }
      },
      deepslate_copper_ore: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate",
          volume: 1
        }
      },
      deepslate_diamond_ore: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate",
          volume: 1
        }
      },
      deepslate_emerald_ore: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate",
          volume: 1
        }
      },
      deepslate_gold_ore: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate",
          volume: 1
        }
      },
      deepslate_iron_ore: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate",
          volume: 1
        }
      },
      deepslate_lapis_ore: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate",
          volume: 1
        }
      },
      deepslate_redstone_ore: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate",
          volume: 1
        }
      },
      deepslate_tile_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate_bricks",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate_bricks",
          volume: 1
        }
      },
      deepslate_tile_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate_bricks",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate_bricks",
          volume: 1
        }
      },
      deepslate_tile_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate_bricks",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate_bricks",
          volume: 1
        }
      },
      deepslate_tile_wall: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate_bricks",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate_bricks",
          volume: 1
        }
      },
      deepslate_tiles: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate_bricks",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate_bricks",
          volume: 1
        }
      },
      deny: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      deprecated_anvil: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.anvil_land",
          volume: 0.5
        }
      },
      deprecated_purpur_block_1: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      deprecated_purpur_block_2: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      detector_rail: {
        break: {
          pitch: [
            1.1,
            1.2
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            1.2,
            1.25
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      diamond_block: {
        break: {
          pitch: [
            1.1,
            1.2
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            1.2,
            1.25
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      diamond_ore: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      diorite: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      diorite_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      diorite_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      diorite_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      diorite_wall: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      dirt: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.gravel",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.gravel",
          volume: 1
        }
      },
      dirt_with_roots: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.hanging_roots",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.hanging_roots",
          volume: 1
        }
      },
      dispenser: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      double_cut_copper_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      double_plant: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      double_stone_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      double_stone_slab2: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      double_stone_slab3: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      double_stone_slab4: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      double_wooden_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      dragon_egg: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      dragon_head: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
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
        }
      },
      dried_kelp_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      dripstone_block: {
        break: {
          sound: "break.dripstone_block"
        },
        place: {
          sound: "place.dripstone_block"
        }
      },
      dropper: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      emerald_block: {
        break: {
          pitch: [
            1.1,
            1.2
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            1.2,
            1.25
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      emerald_ore: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      end_brick_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      end_bricks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      end_portal_frame: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      end_rod: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      end_stone: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      end_stone_brick_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      end_stone_brick_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      end_stone_brick_wall: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      exposed_chiseled_copper: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      exposed_copper: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      exposed_copper_bars: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
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
        }
      },
      exposed_copper_chain: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.chain",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.chain",
          volume: 1
        }
      },
      exposed_copper_chest: {
        break: null,
        place: null
      },
      exposed_copper_door: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      exposed_copper_golem_statue: {
        break: "block.copper_golem_statue.break",
        place: "block.copper_golem_statue.place"
      },
      exposed_copper_grate: {
        break: {
          pitch: 0.8,
          sound: "break.copper_grate",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.copper_grate",
          volume: 1
        }
      },
      exposed_copper_lantern: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.lantern.break",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.lantern.place",
          volume: 1
        }
      },
      exposed_copper_trapdoor: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      exposed_cut_copper: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      exposed_cut_copper_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      exposed_cut_copper_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      exposed_double_cut_copper_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      exposed_lightning_rod: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      farmland: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.gravel",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.gravel",
          volume: 1
        }
      },
      fence: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      fence_gate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      fern: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      fire: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      fire_coral: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      fire_coral_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      fire_coral_fan: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      fire_coral_wall_fan: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      firefly_bush: {
        break: null,
        place: null
      },
      fletching_table: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      flowering_azalea: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.azalea",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.azalea",
          volume: 1
        }
      },
      frame: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.itemframe.break",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.itemframe.place",
          volume: 1
        }
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
        }
      },
      frosted_ice: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      furnace: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      gilded_blackstone: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      glass: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      glass_pane: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      glow_frame: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.itemframe.break",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.itemframe.place",
          volume: 1
        }
      },
      glow_lichen: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      glowingobsidian: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      glowstone: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      gold_block: {
        break: {
          pitch: [
            1.1,
            1.2
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            1.2,
            1.25
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      gold_ore: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      golden_dandelion: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      golden_rail: {
        break: {
          pitch: [
            1.1,
            1.2
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            1.2,
            1.25
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      granite: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      granite_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      granite_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      granite_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      granite_wall: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      grass: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      grass_path: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      gravel: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.gravel",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.gravel",
          volume: 1
        }
      },
      gray_candle: {
        break: {
          pitch: 1,
          sound: "dig.candle",
          volume: 1
        },
        place: {
          pitch: 1,
          sound: "place.candle",
          volume: 1
        }
      },
      gray_candle_cake: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      gray_carpet: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      gray_concrete: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      gray_concrete_powder: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.sand",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.sand",
          volume: 1
        }
      },
      gray_glazed_terracotta: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      gray_shulker_box: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      gray_stained_glass: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      gray_stained_glass_pane: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      gray_terracotta: {
        break: null,
        place: null
      },
      gray_wool: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      green_candle: {
        break: {
          pitch: 1,
          sound: "dig.candle",
          volume: 1
        },
        place: {
          pitch: 1,
          sound: "place.candle",
          volume: 1
        }
      },
      green_candle_cake: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      green_carpet: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      green_concrete: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      green_concrete_powder: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.sand",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.sand",
          volume: 1
        }
      },
      green_glazed_terracotta: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      green_shulker_box: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      green_stained_glass: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      green_stained_glass_pane: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      green_terracotta: {
        break: null,
        place: null
      },
      green_wool: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      grindstone: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      hanging_roots: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.hanging_roots",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.hanging_roots",
          volume: 1
        }
      },
      hardened_clay: {
        break: null,
        place: null
      },
      hay_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      heavy_core: {
        break: {
          pitch: 0.8,
          sound: "break.heavy_core",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.heavy_core",
          volume: 1
        }
      },
      heavy_weighted_pressure_plate: {
        break: {
          pitch: 0.8,
          sound: "break.iron",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.iron",
          volume: 1
        }
      },
      honey_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.honey_block",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.honey_block",
          volume: 1
        }
      },
      honeycomb_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.coral",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.coral",
          volume: 1
        }
      },
      hopper: {
        break: {
          pitch: [
            1.1,
            1.2
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            1.2,
            1.25
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      horn_coral: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      horn_coral_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      horn_coral_fan: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      horn_coral_wall_fan: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      ice: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      infested_chiseled_stone_bricks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      infested_cobblestone: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      infested_cracked_stone_bricks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      infested_deepslate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate",
          volume: 1
        }
      },
      infested_mossy_stone_bricks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      infested_stone: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      infested_stone_bricks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      info_update: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.gravel",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.gravel",
          volume: 1
        }
      },
      info_update2: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.gravel",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.gravel",
          volume: 1
        }
      },
      iron_bars: {
        break: {
          pitch: 0.8,
          sound: "break.iron",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.iron",
          volume: 1
        }
      },
      iron_block: {
        break: {
          pitch: 0.8,
          sound: "break.iron",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.iron",
          volume: 1
        }
      },
      iron_door: {
        break: {
          pitch: 0.8,
          sound: "break.iron",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.iron",
          volume: 1
        }
      },
      iron_ore: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      iron_trapdoor: {
        break: {
          pitch: 0.8,
          sound: "break.iron",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.iron",
          volume: 1
        }
      },
      jukebox: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      jungle_button: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      jungle_door: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      jungle_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      jungle_fence: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      jungle_fence_gate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      jungle_hanging_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.hanging_sign",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.hanging_sign",
          volume: 1
        }
      },
      jungle_leaves: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      jungle_log: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      jungle_planks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      jungle_pressure_plate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      jungle_sapling: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      jungle_shelf: {
        break: "block.shelf.break",
        place: null
      },
      jungle_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      jungle_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      jungle_standing_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      jungle_trapdoor: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      jungle_wall_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      jungle_wood: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      kelp: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      ladder: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      lantern: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.lantern.break",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.lantern.place",
          volume: 1
        }
      },
      lapis_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      lapis_ore: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      large_amethyst_bud: {
        break: {
          sound: "break.large_amethyst_bud"
        },
        place: {
          sound: "place.large_amethyst_bud",
          volume: 1
        }
      },
      large_fern: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      leaf_litter: {
        break: {
          pitch: 0.8,
          sound: "block.leaf_litter.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.leaf_litter.place"
        }
      },
      leaves: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      leaves2: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      lectern: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      lever: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      light_block_0: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      light_block_1: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      light_block_10: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      light_block_11: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      light_block_12: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      light_block_13: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      light_block_14: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      light_block_15: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      light_block_2: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      light_block_3: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      light_block_4: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      light_block_5: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      light_block_6: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      light_block_7: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      light_block_8: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      light_block_9: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      light_blue_candle: {
        break: {
          pitch: 1,
          sound: "dig.candle",
          volume: 1
        },
        place: {
          pitch: 1,
          sound: "place.candle",
          volume: 1
        }
      },
      light_blue_candle_cake: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      light_blue_carpet: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      light_blue_concrete: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      light_blue_concrete_powder: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.sand",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.sand",
          volume: 1
        }
      },
      light_blue_glazed_terracotta: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      light_blue_shulker_box: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      light_blue_stained_glass: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      light_blue_stained_glass_pane: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      light_blue_terracotta: {
        break: null,
        place: null
      },
      light_blue_wool: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      light_gray_candle: {
        break: {
          pitch: 1,
          sound: "dig.candle",
          volume: 1
        },
        place: {
          pitch: 1,
          sound: "place.candle",
          volume: 1
        }
      },
      light_gray_candle_cake: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      light_gray_carpet: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      light_gray_concrete: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      light_gray_concrete_powder: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.sand",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.sand",
          volume: 1
        }
      },
      light_gray_shulker_box: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      light_gray_stained_glass: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      light_gray_stained_glass_pane: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      light_gray_terracotta: {
        break: null,
        place: null
      },
      light_gray_wool: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      light_weighted_pressure_plate: {
        break: {
          pitch: [
            1.1,
            1.2
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            1.2,
            1.25
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      lightning_rod: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      lilac: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      lily_of_the_valley: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      lime_candle: {
        break: {
          pitch: 1,
          sound: "dig.candle",
          volume: 1
        },
        place: {
          pitch: 1,
          sound: "place.candle",
          volume: 1
        }
      },
      lime_candle_cake: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      lime_carpet: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      lime_concrete: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      lime_concrete_powder: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.sand",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.sand",
          volume: 1
        }
      },
      lime_glazed_terracotta: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      lime_shulker_box: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      lime_stained_glass: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      lime_stained_glass_pane: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      lime_terracotta: {
        break: null,
        place: null
      },
      lime_wool: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      lit_blast_furnace: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      lit_deepslate_redstone_ore: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate",
          volume: 1
        }
      },
      lit_furnace: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      lit_pumpkin: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      lit_redstone_lamp: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      lit_redstone_ore: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      lit_smoker: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      lodestone: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.lodestone",
          volume: 1
        }
      },
      log: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      log2: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      loom: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      magenta_candle: {
        break: {
          pitch: 1,
          sound: "dig.candle",
          volume: 1
        },
        place: {
          pitch: 1,
          sound: "place.candle",
          volume: 1
        }
      },
      magenta_candle_cake: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      magenta_carpet: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      magenta_concrete: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      magenta_concrete_powder: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.sand",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.sand",
          volume: 1
        }
      },
      magenta_glazed_terracotta: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      magenta_shulker_box: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      magenta_stained_glass: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      magenta_stained_glass_pane: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      magenta_terracotta: {
        break: null,
        place: null
      },
      magenta_wool: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      magma: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      mangrove_button: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      mangrove_door: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      mangrove_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      mangrove_fence: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      mangrove_fence_gate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      mangrove_hanging_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.hanging_sign",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.hanging_sign",
          volume: 1
        }
      },
      mangrove_leaves: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      mangrove_log: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      mangrove_planks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      mangrove_pressure_plate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      mangrove_propagule: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      mangrove_roots: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.mangrove_roots.break",
          volume: 0.4
        },
        place: {
          pitch: [
            1,
            1.2
          ],
          sound: "block.mangrove_roots.place",
          volume: 0.25
        }
      },
      mangrove_shelf: {
        break: "block.shelf.break",
        place: null
      },
      mangrove_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      mangrove_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      mangrove_standing_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      mangrove_trapdoor: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      mangrove_wall_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      mangrove_wood: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      medium_amethyst_bud: {
        break: {
          sound: "break.medium_amethyst_bud"
        },
        place: {
          sound: "place.medium_amethyst_bud",
          volume: 1
        }
      },
      melon_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      melon_stem: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
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
        }
      },
      moss_block: {
        break: {
          sound: "dig.moss",
          volume: 0.93
        },
        place: {
          sound: "place.moss",
          volume: 0.93
        }
      },
      moss_carpet: {
        break: {
          sound: "dig.moss",
          volume: 0.93
        },
        place: {
          sound: "place.moss",
          volume: 0.93
        }
      },
      mossy_cobblestone: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      mossy_cobblestone_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      mossy_cobblestone_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      mossy_cobblestone_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      mossy_cobblestone_wall: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      mossy_stone_brick_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      mossy_stone_brick_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      mossy_stone_brick_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      mossy_stone_brick_wall: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      mossy_stone_bricks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      mud: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.mud.break",
          volume: 0.4
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.mud.place",
          volume: 0.25
        }
      },
      mud_brick_double_slab: {
        break: {
          pitch: [
            0.8,
            1
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
        }
      },
      mud_brick_slab: {
        break: {
          pitch: [
            0.8,
            1
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
        }
      },
      mud_brick_stairs: {
        break: {
          pitch: [
            0.8,
            1
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
        }
      },
      mud_brick_wall: {
        break: {
          pitch: [
            0.8,
            1
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
        }
      },
      mud_bricks: {
        break: {
          pitch: [
            0.8,
            1
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
        }
      },
      muddy_mangrove_roots: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.muddy_mangrove_roots.break",
          volume: 0.4
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.muddy_mangrove_roots.place",
          volume: 0.25
        }
      },
      mushroom_stem: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      mycelium: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      nether_brick: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.nether_brick",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.nether_brick",
          volume: 1
        }
      },
      nether_brick_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      nether_brick_fence: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.nether_brick",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.nether_brick",
          volume: 1
        }
      },
      nether_brick_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.nether_brick",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.nether_brick",
          volume: 1
        }
      },
      nether_brick_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.nether_brick",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.nether_brick",
          volume: 1
        }
      },
      nether_brick_wall: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.nether_brick",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.nether_brick",
          volume: 1
        }
      },
      nether_gold_ore: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.nether_gold_ore",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.nether_gold_ore",
          volume: 1
        }
      },
      nether_sprouts: {
        break: {
          pitch: [
            1.1,
            1.2
          ],
          sound: "dig.nether_sprouts",
          volume: 1
        },
        place: {
          pitch: [
            1.2,
            1.25
          ],
          sound: "place.nether_sprouts",
          volume: 1
        }
      },
      nether_wart: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.nether_wart",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.nether_wart",
          volume: 0.7
        }
      },
      nether_wart_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.nether_wart",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.nether_wart",
          volume: 0.7
        }
      },
      netherite_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.netherite",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.netherite",
          volume: 1
        }
      },
      netherrack: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.netherrack",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.netherrack",
          volume: 1
        }
      },
      netherreactor: {
        break: {
          pitch: [
            1.1,
            1.2
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            1.2,
            1.25
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      normal_stone_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      normal_stone_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      normal_stone_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      noteblock: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      oak_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      oak_fence: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      oak_hanging_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.hanging_sign",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.hanging_sign",
          volume: 1
        }
      },
      oak_leaves: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      oak_log: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      oak_planks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      oak_sapling: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      oak_shelf: {
        break: "block.shelf.break",
        place: null
      },
      oak_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      oak_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      oak_wood: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      observer: {
        break: {
          pitch: [
            1.1,
            1.2
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            1.2,
            1.25
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      obsidian: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      ochre_froglight: {
        break: {
          sound: "break.froglight",
          volume: 1
        },
        place: {
          sound: "place.froglight",
          volume: 1
        }
      },
      open_eyeblossom: {
        break: null,
        place: null
      },
      orange_candle: {
        break: {
          pitch: 1,
          sound: "dig.candle",
          volume: 1
        },
        place: {
          pitch: 1,
          sound: "place.candle",
          volume: 1
        }
      },
      orange_candle_cake: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      orange_carpet: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      orange_concrete: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      orange_concrete_powder: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.sand",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.sand",
          volume: 1
        }
      },
      orange_glazed_terracotta: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      orange_shulker_box: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      orange_stained_glass: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      orange_stained_glass_pane: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      orange_terracotta: {
        break: null,
        place: null
      },
      orange_tulip: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      orange_wool: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      oxeye_daisy: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      oxidized_chiseled_copper: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      oxidized_copper: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      oxidized_copper_bars: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
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
        }
      },
      oxidized_copper_chain: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.chain",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.chain",
          volume: 1
        }
      },
      oxidized_copper_chest: {
        break: null,
        place: null
      },
      oxidized_copper_door: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      oxidized_copper_golem_statue: {
        break: "block.copper_golem_statue.break",
        place: "block.copper_golem_statue.place"
      },
      oxidized_copper_grate: {
        break: {
          pitch: 0.8,
          sound: "break.copper_grate",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.copper_grate",
          volume: 1
        }
      },
      oxidized_copper_lantern: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.lantern.break",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.lantern.place",
          volume: 1
        }
      },
      oxidized_copper_trapdoor: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      oxidized_cut_copper: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      oxidized_cut_copper_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      oxidized_cut_copper_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      oxidized_double_cut_copper_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      oxidized_lightning_rod: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      packed_ice: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      packed_mud: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.packed_mud.break",
          volume: 0.4
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.packed_mud.place",
          volume: 0.25
        }
      },
      pale_hanging_moss: {
        break: null,
        place: null
      },
      pale_moss_block: {
        break: {
          sound: "dig.moss",
          volume: 0.93
        },
        place: {
          sound: "place.moss",
          volume: 0.93
        }
      },
      pale_moss_carpet: {
        break: {
          sound: "dig.moss",
          volume: 0.93
        },
        place: {
          sound: "place.moss",
          volume: 0.93
        }
      },
      pale_oak_button: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      pale_oak_door: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      pale_oak_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      pale_oak_fence: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      pale_oak_fence_gate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      pale_oak_hanging_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.hanging_sign",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.hanging_sign",
          volume: 1
        }
      },
      pale_oak_leaves: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      pale_oak_log: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      pale_oak_planks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      pale_oak_pressure_plate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      pale_oak_sapling: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      pale_oak_shelf: {
        break: "block.shelf.break",
        place: null
      },
      pale_oak_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      pale_oak_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      pale_oak_standing_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      pale_oak_trapdoor: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      pale_oak_wall_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      pale_oak_wood: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      pearlescent_froglight: {
        break: {
          sound: "break.froglight",
          volume: 1
        },
        place: {
          sound: "place.froglight",
          volume: 1
        }
      },
      peony: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      petrified_oak_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      petrified_oak_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      piglin_head: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      pink_candle: {
        break: {
          pitch: 1,
          sound: "dig.candle",
          volume: 1
        },
        place: {
          pitch: 1,
          sound: "place.candle",
          volume: 1
        }
      },
      pink_candle_cake: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      pink_carpet: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      pink_concrete: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      pink_concrete_powder: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.sand",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.sand",
          volume: 1
        }
      },
      pink_glazed_terracotta: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      pink_petals: {
        break: {
          sound: "break.pink_petals",
          volume: 1
        },
        place: {
          sound: "place.pink_petals",
          volume: 1
        }
      },
      pink_shulker_box: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      pink_stained_glass: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      pink_stained_glass_pane: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      pink_terracotta: {
        break: null,
        place: null
      },
      pink_tulip: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      pink_wool: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      piston: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      pitcher_crop: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      pitcher_plant: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      planks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      player_head: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      podzol: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.gravel",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.gravel",
          volume: 1
        }
      },
      pointed_dripstone: {
        break: {
          sound: "break.pointed_dripstone"
        },
        place: {
          sound: "place.pointed_dripstone"
        }
      },
      polished_andesite: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      polished_andesite_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      polished_andesite_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      polished_andesite_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      polished_basalt: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.basalt",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.basalt",
          volume: 1
        }
      },
      polished_blackstone: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      polished_blackstone_brick_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      polished_blackstone_brick_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      polished_blackstone_brick_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      polished_blackstone_brick_wall: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      polished_blackstone_bricks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      polished_blackstone_button: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      polished_blackstone_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      polished_blackstone_pressure_plate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      polished_blackstone_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      polished_blackstone_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      polished_blackstone_wall: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      polished_cinnabar: {
        break: {
          pitch: 0.8,
          sound: "block.cinnabar.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.cinnabar.place"
        }
      },
      polished_cinnabar_double_slab: {
        break: {
          pitch: 0.8,
          sound: "block.cinnabar.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.cinnabar.place"
        }
      },
      polished_cinnabar_slab: {
        break: {
          pitch: 0.8,
          sound: "block.cinnabar.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.cinnabar.place"
        }
      },
      polished_cinnabar_stairs: {
        break: {
          pitch: 0.8,
          sound: "block.cinnabar.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.cinnabar.place"
        }
      },
      polished_cinnabar_wall: {
        break: {
          pitch: 0.8,
          sound: "block.cinnabar.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.cinnabar.place"
        }
      },
      polished_deepslate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate",
          volume: 1
        }
      },
      polished_deepslate_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate",
          volume: 1
        }
      },
      polished_deepslate_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate",
          volume: 1
        }
      },
      polished_deepslate_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate",
          volume: 1
        }
      },
      polished_deepslate_wall: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate",
          volume: 1
        }
      },
      polished_diorite: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      polished_diorite_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      polished_diorite_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      polished_diorite_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      polished_granite: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      polished_granite_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      polished_granite_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      polished_granite_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      polished_sulfur: {
        break: {
          pitch: 0.8,
          sound: "block.sulfur.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.sulfur.place"
        }
      },
      polished_sulfur_double_slab: {
        break: {
          pitch: 0.8,
          sound: "block.sulfur.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.sulfur.place"
        }
      },
      polished_sulfur_slab: {
        break: {
          pitch: 0.8,
          sound: "block.sulfur.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.sulfur.place"
        }
      },
      polished_sulfur_stairs: {
        break: {
          pitch: 0.8,
          sound: "block.sulfur.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.sulfur.place"
        }
      },
      polished_sulfur_wall: {
        break: {
          pitch: 0.8,
          sound: "block.sulfur.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.sulfur.place"
        }
      },
      polished_tuff: {
        break: {
          pitch: 0.96,
          sound: "break.tuff",
          volume: 1
        },
        place: {
          pitch: 0.96,
          sound: "place.tuff",
          volume: 1
        }
      },
      polished_tuff_double_slab: {
        break: {
          pitch: 0.96,
          sound: "break.tuff",
          volume: 1
        },
        place: {
          pitch: 0.96,
          sound: "place.tuff",
          volume: 1
        }
      },
      polished_tuff_slab: {
        break: {
          pitch: 0.96,
          sound: "break.tuff",
          volume: 1
        },
        place: {
          pitch: 0.96,
          sound: "place.tuff",
          volume: 1
        }
      },
      polished_tuff_stairs: {
        break: {
          pitch: 0.96,
          sound: "break.tuff",
          volume: 1
        },
        place: {
          pitch: 0.96,
          sound: "place.tuff",
          volume: 1
        }
      },
      polished_tuff_wall: {
        break: {
          pitch: 0.96,
          sound: "break.tuff",
          volume: 1
        },
        place: {
          pitch: 0.96,
          sound: "place.tuff",
          volume: 1
        }
      },
      poppy: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      portal: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      potatoes: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      potent_sulfur: {
        break: {
          pitch: 0.8,
          sound: "block.potent_sulfur.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.potent_sulfur.place"
        }
      },
      powder_snow: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.powder_snow",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.powder_snow",
          volume: 1
        }
      },
      powered_comparator: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      powered_repeater: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      prismarine: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      prismarine_brick_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      prismarine_brick_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      prismarine_bricks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      prismarine_bricks_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      prismarine_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      prismarine_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      prismarine_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      prismarine_wall: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      pumpkin: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      pumpkin_stem: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      purple_candle: {
        break: {
          pitch: 1,
          sound: "dig.candle",
          volume: 1
        },
        place: {
          pitch: 1,
          sound: "place.candle",
          volume: 1
        }
      },
      purple_candle_cake: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      purple_carpet: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      purple_concrete: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      purple_concrete_powder: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.sand",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.sand",
          volume: 1
        }
      },
      purple_glazed_terracotta: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      purple_shulker_box: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      purple_stained_glass: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      purple_stained_glass_pane: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      purple_terracotta: {
        break: null,
        place: null
      },
      purple_wool: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      purpur_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      purpur_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      purpur_pillar: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      purpur_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      quartz_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      quartz_bricks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      quartz_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      quartz_ore: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.nether_gold_ore",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.nether_gold_ore",
          volume: 1
        }
      },
      quartz_pillar: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      quartz_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      rail: {
        break: {
          pitch: [
            1.1,
            1.2
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            1.2,
            1.25
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      raw_copper_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      raw_gold_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      raw_iron_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      red_candle: {
        break: {
          pitch: 1,
          sound: "dig.candle",
          volume: 1
        },
        place: {
          pitch: 1,
          sound: "place.candle",
          volume: 1
        }
      },
      red_candle_cake: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      red_carpet: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      red_concrete: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      red_concrete_powder: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.sand",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.sand",
          volume: 1
        }
      },
      red_flower: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      red_glazed_terracotta: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      red_mushroom: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      red_mushroom_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      red_nether_brick: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.nether_brick",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.nether_brick",
          volume: 1
        }
      },
      red_nether_brick_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      red_nether_brick_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.nether_brick",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.nether_brick",
          volume: 1
        }
      },
      red_nether_brick_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.nether_brick",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.nether_brick",
          volume: 1
        }
      },
      red_nether_brick_wall: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.nether_brick",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.nether_brick",
          volume: 1
        }
      },
      red_sand: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.sand",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.sand",
          volume: 1
        }
      },
      red_sandstone: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      red_sandstone_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      red_sandstone_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      red_sandstone_wall: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      red_shulker_box: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      red_stained_glass: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      red_stained_glass_pane: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      red_terracotta: {
        break: null,
        place: null
      },
      red_tulip: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      red_wool: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      redstone_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      redstone_lamp: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      redstone_ore: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      redstone_torch: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      reeds: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      reinforced_deepslate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.deepslate",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.deepslate",
          volume: 1
        }
      },
      repeating_command_block: {
        break: {
          pitch: [
            1.1,
            1.2
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            1.2,
            1.25
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      resin_block: {
        break: {
          pitch: 0.8,
          sound: "block.resin.break",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "block.resin.place",
          volume: 1
        }
      },
      resin_brick_double_slab: {
        break: {
          pitch: 0.8,
          sound: "block.resin_brick.break",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "block.resin_brick.place",
          volume: 1
        }
      },
      resin_brick_slab: {
        break: {
          pitch: 0.8,
          sound: "block.resin_brick.break",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "block.resin_brick.place",
          volume: 1
        }
      },
      resin_brick_stairs: {
        break: {
          pitch: 0.8,
          sound: "block.resin_brick.break",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "block.resin_brick.place",
          volume: 1
        }
      },
      resin_brick_wall: {
        break: {
          pitch: 0.8,
          sound: "block.resin_brick.break",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "block.resin_brick.place",
          volume: 1
        }
      },
      resin_bricks: {
        break: {
          pitch: 0.8,
          sound: "block.resin_brick.break",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "block.resin_brick.place",
          volume: 1
        }
      },
      resin_clump: {
        break: {
          pitch: 0.8,
          sound: "block.resin.break",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "block.resin.place",
          volume: 1
        }
      },
      respawn_anchor: {
        break: {
          pitch: [
            1.1,
            1.2
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            1.2,
            1.25
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      rose_bush: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      sand: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.sand",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.sand",
          volume: 1
        }
      },
      sandstone: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      sandstone_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      sandstone_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      sandstone_wall: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      sapling: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      scaffolding: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.scaffolding.break",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.9
          ],
          sound: "block.scaffolding.place",
          volume: 1
        }
      },
      sculk: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.sculk",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.sculk",
          volume: 1
        }
      },
      sculk_catalyst: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.sculk_catalyst",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.sculk_catalyst",
          volume: 1
        }
      },
      sculk_sensor: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.sculk_sensor",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.sculk_sensor",
          volume: 0.8
        }
      },
      sculk_shrieker: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.sculk_shrieker",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.sculk_shrieker",
          volume: 1
        }
      },
      sculk_vein: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.sculk_vein",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.sculk_vein",
          volume: 1
        }
      },
      seaLantern: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      sea_pickle: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "mob.slime.big",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.slime.big",
          volume: 1
        }
      },
      seagrass: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      short_dry_grass: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      short_grass: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      shroomlight: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.shroomlight",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.shroomlight",
          volume: 1
        }
      },
      shulker_box: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      silver_glazed_terracotta: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      skeleton_skull: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      skull: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      slime: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "mob.slime.big",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.slime.big",
          volume: 1
        }
      },
      small_amethyst_bud: {
        break: {
          sound: "break.small_amethyst_bud"
        },
        place: {
          sound: "place.small_amethyst_bud",
          volume: 1
        }
      },
      small_dripleaf_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.big_dripleaf",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.big_dripleaf",
          volume: 1
        }
      },
      smithing_table: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      smoker: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      smooth_basalt: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.basalt",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.basalt",
          volume: 1
        }
      },
      smooth_quartz: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      smooth_quartz_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      smooth_quartz_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      smooth_quartz_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      smooth_red_sandstone: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      smooth_red_sandstone_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      smooth_red_sandstone_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      smooth_red_sandstone_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      smooth_sandstone: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      smooth_sandstone_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      smooth_sandstone_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      smooth_sandstone_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      smooth_stone: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      smooth_stone_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      smooth_stone_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      sniffer_egg: {
        break: {
          pitch: [
            1.1,
            1.2
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            1.2,
            1.25
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      snow: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.snow",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.snow",
          volume: 1
        }
      },
      snow_layer: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.snow",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.snow",
          volume: 1
        }
      },
      soul_campfire: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      soul_fire: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      soul_lantern: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.lantern.break",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.lantern.place",
          volume: 1
        }
      },
      soul_sand: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.soul_sand",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.soul_sand",
          volume: 1
        }
      },
      soul_soil: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.soul_soil",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.soul_soil",
          volume: 1
        }
      },
      soul_torch: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      sponge: {
        break: {
          pitch: 0.8,
          sound: "break.sponge",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.sponge",
          volume: 1
        }
      },
      spore_blossom: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.spore_blossom",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.spore_blossom",
          volume: 1
        }
      },
      spruce_button: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      spruce_door: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      spruce_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      spruce_fence: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      spruce_fence_gate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      spruce_hanging_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.hanging_sign",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.hanging_sign",
          volume: 1
        }
      },
      spruce_leaves: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      spruce_log: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      spruce_planks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      spruce_pressure_plate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      spruce_sapling: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      spruce_shelf: {
        break: "block.shelf.break",
        place: null
      },
      spruce_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      spruce_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      spruce_standing_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      spruce_trapdoor: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      spruce_wall_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      spruce_wood: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      stained_glass: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      stained_glass_pane: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      stained_hardened_clay: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      standing_banner: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      standing_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      sticky_piston: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      stone: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      stone_brick_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      stone_brick_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      stone_brick_wall: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      stone_bricks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      stone_button: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      stone_pressure_plate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      stone_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      stone_slab2: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      stone_slab3: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      stone_slab4: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      stonebrick: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      stonecutter: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      stonecutter_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      stripped_acacia_log: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      stripped_acacia_wood: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      stripped_bamboo_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.bamboo_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.bamboo_wood",
          volume: 1
        }
      },
      stripped_birch_log: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      stripped_birch_wood: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      stripped_cherry_log: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.cherry_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.cherry_wood",
          volume: 1
        }
      },
      stripped_cherry_wood: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.cherry_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.cherry_wood",
          volume: 1
        }
      },
      stripped_crimson_hyphae: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stem",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stem",
          volume: 1
        }
      },
      stripped_crimson_stem: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stem",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stem",
          volume: 1
        }
      },
      stripped_dark_oak_log: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      stripped_dark_oak_wood: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      stripped_jungle_log: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      stripped_jungle_wood: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      stripped_mangrove_log: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      stripped_mangrove_wood: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      stripped_oak_log: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      stripped_oak_wood: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      stripped_pale_oak_log: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      stripped_pale_oak_wood: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      stripped_spruce_log: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      stripped_spruce_wood: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      stripped_warped_hyphae: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stem",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stem",
          volume: 1
        }
      },
      stripped_warped_stem: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stem",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stem",
          volume: 1
        }
      },
      sulfur: {
        break: {
          pitch: 0.8,
          sound: "block.sulfur.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.sulfur.place"
        }
      },
      sulfur_brick_double_slab: {
        break: {
          pitch: 0.8,
          sound: "block.sulfur.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.sulfur.place"
        }
      },
      sulfur_brick_slab: {
        break: {
          pitch: 0.8,
          sound: "block.sulfur.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.sulfur.place"
        }
      },
      sulfur_brick_stairs: {
        break: {
          pitch: 0.8,
          sound: "block.sulfur.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.sulfur.place"
        }
      },
      sulfur_brick_wall: {
        break: {
          pitch: 0.8,
          sound: "block.sulfur.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.sulfur.place"
        }
      },
      sulfur_bricks: {
        break: {
          pitch: 0.8,
          sound: "block.sulfur.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.sulfur.place"
        }
      },
      sulfur_double_slab: {
        break: {
          pitch: 0.8,
          sound: "block.sulfur.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.sulfur.place"
        }
      },
      sulfur_slab: {
        break: {
          pitch: 0.8,
          sound: "block.sulfur.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.sulfur.place"
        }
      },
      sulfur_spike: {
        break: {
          pitch: 0.8,
          sound: "block.sulfur_spike.break",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "block.sulfur_spike.place",
          volume: 1
        }
      },
      sulfur_stairs: {
        break: {
          pitch: 0.8,
          sound: "block.sulfur.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.sulfur.place"
        }
      },
      sulfur_wall: {
        break: {
          pitch: 0.8,
          sound: "block.sulfur.break"
        },
        place: {
          pitch: 0.8,
          sound: "block.sulfur.place"
        }
      },
      sunflower: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      suspicious_gravel: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.suspicious_gravel",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.suspicious_gravel",
          volume: 1
        }
      },
      suspicious_sand: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.suspicious_sand",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.suspicious_sand",
          volume: 1
        }
      },
      sweet_berry_bush: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.sweet_berry_bush.break",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.sweet_berry_bush.place",
          volume: 1
        }
      },
      tall_dry_grass: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      tall_grass: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      tallgrass: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      target: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      tinted_glass: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      tnt: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      torch: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      torchflower: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      torchflower_crop: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      trapdoor: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      trapped_chest: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      trial_spawner: {
        break: {
          pitch: 0.8,
          sound: "trial_spawner.break",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "trial_spawner.place",
          volume: 1
        }
      },
      tube_coral: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      tube_coral_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      tube_coral_fan: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      tube_coral_wall_fan: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      tuff: {
        break: {
          pitch: 0.8,
          sound: "place.tuff",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.tuff",
          volume: 1
        }
      },
      tuff_brick_double_slab: {
        break: {
          pitch: 0.8,
          sound: "place.tuff_bricks",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.tuff_bricks",
          volume: 1
        }
      },
      tuff_brick_slab: {
        break: {
          pitch: 0.8,
          sound: "place.tuff_bricks",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.tuff_bricks",
          volume: 1
        }
      },
      tuff_brick_stairs: {
        break: {
          pitch: 0.8,
          sound: "place.tuff_bricks",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.tuff_bricks",
          volume: 1
        }
      },
      tuff_brick_wall: {
        break: {
          pitch: 0.8,
          sound: "place.tuff_bricks",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.tuff_bricks",
          volume: 1
        }
      },
      tuff_bricks: {
        break: {
          pitch: 0.8,
          sound: "place.tuff_bricks",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.tuff_bricks",
          volume: 1
        }
      },
      tuff_double_slab: {
        break: {
          pitch: 0.8,
          sound: "place.tuff",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.tuff",
          volume: 1
        }
      },
      tuff_slab: {
        break: {
          pitch: 0.8,
          sound: "place.tuff",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.tuff",
          volume: 1
        }
      },
      tuff_stairs: {
        break: {
          pitch: 0.8,
          sound: "place.tuff",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.tuff",
          volume: 1
        }
      },
      tuff_wall: {
        break: {
          pitch: 0.8,
          sound: "place.tuff",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.tuff",
          volume: 1
        }
      },
      turtle_egg: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      twisting_vines: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.weeping_vines.break",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.weeping_vines.place",
          volume: 1
        }
      },
      undyed_shulker_box: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      unlit_redstone_torch: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      unpowered_comparator: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      unpowered_repeater: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      vault: {
        break: {
          pitch: 0.8,
          sound: "vault.break",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "vault.place",
          volume: 1
        }
      },
      verdant_froglight: {
        break: {
          sound: "break.froglight",
          volume: 1
        },
        place: {
          sound: "place.froglight",
          volume: 1
        }
      },
      vine: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.vines",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.vines",
          volume: 1
        }
      },
      wall_banner: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      wall_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      warped_button: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.nether_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.nether_wood",
          volume: 1
        }
      },
      warped_door: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.nether_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.nether_wood",
          volume: 1
        }
      },
      warped_double_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.nether_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.nether_wood",
          volume: 1
        }
      },
      warped_fence: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.nether_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.nether_wood",
          volume: 1
        }
      },
      warped_fence_gate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.nether_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.nether_wood",
          volume: 1
        }
      },
      warped_fungus: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.fungus",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.fungus",
          volume: 1
        }
      },
      warped_hanging_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.nether_wood_hanging_sign",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.nether_wood_hanging_sign",
          volume: 1
        }
      },
      warped_hyphae: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stem",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stem",
          volume: 1
        }
      },
      warped_nylium: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.nylium",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.nylium",
          volume: 1
        }
      },
      warped_planks: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.nether_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.nether_wood",
          volume: 1
        }
      },
      warped_pressure_plate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.nether_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.nether_wood",
          volume: 1
        }
      },
      warped_roots: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.roots",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.roots",
          volume: 1
        }
      },
      warped_shelf: {
        break: "block.shelf.break",
        place: null
      },
      warped_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.nether_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.nether_wood",
          volume: 1
        }
      },
      warped_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.nether_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.nether_wood",
          volume: 1
        }
      },
      warped_standing_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.nether_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.nether_wood",
          volume: 1
        }
      },
      warped_stem: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stem",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stem",
          volume: 1
        }
      },
      warped_trapdoor: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.nether_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.nether_wood",
          volume: 1
        }
      },
      warped_wall_sign: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "break.nether_wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.nether_wood",
          volume: 1
        }
      },
      warped_wart_block: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.nether_wart",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.nether_wart",
          volume: 0.7
        }
      },
      waterlily: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      waxed_chiseled_copper: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_copper: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_copper_bars: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
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
        }
      },
      waxed_copper_chain: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.chain",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.chain",
          volume: 1
        }
      },
      waxed_copper_chest: {
        break: null,
        place: null
      },
      waxed_copper_door: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_copper_golem_statue: {
        break: "block.copper_golem_statue.break",
        place: "block.copper_golem_statue.place"
      },
      waxed_copper_grate: {
        break: {
          pitch: 0.8,
          sound: "break.copper_grate",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.copper_grate",
          volume: 1
        }
      },
      waxed_copper_lantern: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.lantern.break",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.lantern.place",
          volume: 1
        }
      },
      waxed_copper_trapdoor: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_cut_copper: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_cut_copper_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_cut_copper_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_double_cut_copper_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_exposed_chiseled_copper: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_exposed_copper: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_exposed_copper_bars: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
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
        }
      },
      waxed_exposed_copper_chain: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.chain",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.chain",
          volume: 1
        }
      },
      waxed_exposed_copper_chest: {
        break: null,
        place: null
      },
      waxed_exposed_copper_door: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_exposed_copper_golem_statue: {
        break: "block.copper_golem_statue.break",
        place: "block.copper_golem_statue.place"
      },
      waxed_exposed_copper_grate: {
        break: {
          pitch: 0.8,
          sound: "break.copper_grate",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.copper_grate",
          volume: 1
        }
      },
      waxed_exposed_copper_lantern: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.lantern.break",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.lantern.place",
          volume: 1
        }
      },
      waxed_exposed_copper_trapdoor: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_exposed_cut_copper: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_exposed_cut_copper_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_exposed_cut_copper_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_exposed_double_cut_copper_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_exposed_lightning_rod: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_lightning_rod: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_oxidized_chiseled_copper: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_oxidized_copper: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_oxidized_copper_bars: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
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
        }
      },
      waxed_oxidized_copper_chain: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.chain",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.chain",
          volume: 1
        }
      },
      waxed_oxidized_copper_chest: {
        break: null,
        place: null
      },
      waxed_oxidized_copper_door: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_oxidized_copper_golem_statue: {
        break: "block.copper_golem_statue.break",
        place: "block.copper_golem_statue.place"
      },
      waxed_oxidized_copper_grate: {
        break: {
          pitch: 0.8,
          sound: "break.copper_grate",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.copper_grate",
          volume: 1
        }
      },
      waxed_oxidized_copper_lantern: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.lantern.break",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.lantern.place",
          volume: 1
        }
      },
      waxed_oxidized_copper_trapdoor: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_oxidized_cut_copper: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_oxidized_cut_copper_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_oxidized_cut_copper_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_oxidized_double_cut_copper_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_oxidized_lightning_rod: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_weathered_chiseled_copper: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_weathered_copper: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_weathered_copper_bars: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
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
        }
      },
      waxed_weathered_copper_chain: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.chain",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.chain",
          volume: 1
        }
      },
      waxed_weathered_copper_chest: {
        break: null,
        place: null
      },
      waxed_weathered_copper_door: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_weathered_copper_golem_statue: {
        break: "block.copper_golem_statue.break",
        place: "block.copper_golem_statue.place"
      },
      waxed_weathered_copper_grate: {
        break: {
          pitch: 0.8,
          sound: "break.copper_grate",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.copper_grate",
          volume: 1
        }
      },
      waxed_weathered_copper_lantern: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.lantern.break",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.lantern.place",
          volume: 1
        }
      },
      waxed_weathered_copper_trapdoor: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_weathered_cut_copper: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_weathered_cut_copper_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_weathered_cut_copper_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_weathered_double_cut_copper_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      waxed_weathered_lightning_rod: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      weathered_chiseled_copper: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      weathered_copper: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      weathered_copper_bars: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
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
        }
      },
      weathered_copper_chain: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.chain",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.chain",
          volume: 1
        }
      },
      weathered_copper_chest: {
        break: null,
        place: null
      },
      weathered_copper_door: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      weathered_copper_golem_statue: {
        break: "block.copper_golem_statue.break",
        place: "block.copper_golem_statue.place"
      },
      weathered_copper_grate: {
        break: {
          pitch: 0.8,
          sound: "break.copper_grate",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.copper_grate",
          volume: 1
        }
      },
      weathered_copper_lantern: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.lantern.break",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.lantern.place",
          volume: 1
        }
      },
      weathered_copper_trapdoor: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      weathered_cut_copper: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      weathered_cut_copper_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      weathered_cut_copper_stairs: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      weathered_double_cut_copper_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      weathered_lightning_rod: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.copper",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.copper",
          volume: 1
        }
      },
      web: {
        break: {
          sound: "break.web"
        },
        place: {
          sound: "place.web"
        }
      },
      weeping_vines: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.weeping_vines.break",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "block.weeping_vines.place",
          volume: 1
        }
      },
      wet_sponge: {
        break: {
          pitch: 0.8,
          sound: "break.wet_sponge",
          volume: 1
        },
        place: {
          pitch: 0.8,
          sound: "place.wet_sponge",
          volume: 1
        }
      },
      wheat: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      white_candle: {
        break: {
          pitch: 1,
          sound: "dig.candle",
          volume: 1
        },
        place: {
          pitch: 1,
          sound: "place.candle",
          volume: 1
        }
      },
      white_candle_cake: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      white_carpet: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      white_concrete: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      white_concrete_powder: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.sand",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.sand",
          volume: 1
        }
      },
      white_glazed_terracotta: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      white_shulker_box: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      white_stained_glass: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      white_stained_glass_pane: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      white_terracotta: {
        break: null,
        place: null
      },
      white_tulip: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      white_wool: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      wildflowers: {
        break: {
          sound: "break.pink_petals",
          volume: 1
        },
        place: {
          sound: "place.pink_petals",
          volume: 1
        }
      },
      wither_rose: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      wither_skeleton_skull: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      wood: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      wooden_button: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      wooden_door: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      wooden_pressure_plate: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      wooden_slab: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.wood",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            0.8
          ],
          sound: "place.wood",
          volume: 1
        }
      },
      wool: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      yellow_candle: {
        break: {
          pitch: 1,
          sound: "dig.candle",
          volume: 1
        },
        place: {
          pitch: 1,
          sound: "place.candle",
          volume: 1
        }
      },
      yellow_candle_cake: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      yellow_carpet: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      yellow_concrete: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      yellow_concrete_powder: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.sand",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.sand",
          volume: 1
        }
      },
      yellow_flower: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.grass",
          volume: 0.7
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.grass",
          volume: 0.8
        }
      },
      yellow_glazed_terracotta: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      yellow_shulker_box: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      yellow_stained_glass: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      yellow_stained_glass_pane: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "random.glass",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      },
      yellow_terracotta: {
        break: null,
        place: null
      },
      yellow_wool: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.cloth",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.cloth",
          volume: 1
        }
      },
      zombie_head: {
        break: {
          pitch: [
            0.8,
            1
          ],
          sound: "dig.stone",
          volume: 1
        },
        place: {
          pitch: [
            0.8,
            1
          ],
          sound: "place.stone",
          volume: 1
        }
      }
    };
  }
});

// src/debug.ts
import {
  CommandPermissionLevel,
  CustomCommandParamType,
  CustomCommandStatus,
  MolangVariableMap,
  system,
  world
} from "@minecraft/server";
function isDebugFlag(value) {
  return value in debugFlags;
}
function setDebugFlag(flag, enabled) {
  debugFlags[flag] = enabled;
  world.setDynamicProperty(PROPERTY_PREFIX + flag, enabled ? true : void 0);
}
function loadDebugFlags() {
  for (const flag of debugFlagNames) {
    const saved = world.getDynamicProperty(PROPERTY_PREFIX + flag);
    if (typeof saved === "boolean") {
      debugFlags[flag] = saved;
    }
  }
}
function tickDrawDebug() {
  system.runJob(drawDebug(tickDrawDebug));
}
function* drawDebug(callback) {
  try {
    if (!world.loadedData || !debugFlags.pathParticles) {
      return;
    }
    const players = world.getAllPlayers();
    const rotate45 = new MolangVariableMap();
    rotate45.setFloat("rotation", 45);
    const rotate90 = new MolangVariableMap();
    rotate90.setFloat("rotation", 90);
    const rotate135 = new MolangVariableMap();
    rotate135.setFloat("rotation", 135);
    const villageList = world.getVillages();
    for (const player of players) {
      const playerPos = player.location;
      const nearbyRange = 4;
      const minY = Math.floor(playerPos.y) - 1;
      const maxY = Math.floor(playerPos.y) + 1;
      for (const village of villageList) {
        for (let dx = -nearbyRange; dx <= nearbyRange; dx++) {
          for (let dy = minY - Math.floor(playerPos.y); dy <= maxY - Math.floor(playerPos.y); dy++) {
            for (let dz = -nearbyRange; dz <= nearbyRange; dz++) {
              const checkPos = {
                x: Math.floor(playerPos.x + dx),
                y: Math.floor(playerPos.y + dy),
                z: Math.floor(playerPos.z + dz)
              };
              const key = vectorToString(checkPos);
              if (!village.pathNodes.hasOwnProperty(key)) {
                continue;
              }
              const node = village.pathNodes[key];
              if (node === void 0) {
                continue;
              }
              const particlePos = addVector(
                centerVector(checkPos, true),
                "y",
                0.01
              );
              const colorMap = new MolangVariableMap();
              let color;
              if (node.requirement !== void 0) {
                color = requirementColor(node.requirement);
              }
              color ??= {
                red: 122 / 255,
                green: 122 / 255,
                blue: 122 / 255
              };
              colorMap.setColorRGB("color", color);
              player.spawnParticle("tektopia:path_node", particlePos, colorMap);
              const directionSet = new Set(
                node.neighbors.map(
                  (neighborString) => vectorToDirection(
                    subtractVectors(stringToVector(neighborString), checkPos)
                  )
                )
              );
              const spawnConnection = (offsetX, offsetY, offsetZ, dir) => {
                const pos = addVectors(
                  addVector(centerVector(checkPos, true), "y", 0.02),
                  { x: offsetX, y: offsetY, z: offsetZ }
                );
                try {
                  if (typeof dir === "string") {
                    player.spawnParticle(`tektopia:node_connection_${dir}`, pos);
                  } else {
                    player.spawnParticle("tektopia:node_connection", pos, dir);
                  }
                } catch {
                }
              };
              if (directionSet.has("north")) {
                spawnConnection(-0.1, 0, -0.5);
              }
              if (directionSet.has("east")) {
                spawnConnection(0.5, 0, -0.1, rotate90);
              }
              if (directionSet.has("south")) {
                spawnConnection(0.1, 0, 0.5);
              }
              if (directionSet.has("west")) {
                spawnConnection(-0.5, 0, 0.1, rotate90);
              }
              if (directionSet.has("northeast")) {
                spawnConnection(0.43, 0, -0.57, rotate135);
              }
              if (directionSet.has("northwest")) {
                spawnConnection(-0.57, 0, -0.43, rotate45);
              }
              if (directionSet.has("southeast")) {
                spawnConnection(0.57, 0, 0.43, rotate45);
              }
              if (directionSet.has("southwest")) {
                spawnConnection(-0.43, 0, 0.57, rotate135);
              }
              if (directionSet.has("northdown")) {
                spawnConnection(-0.1, -0.5, -0.5, "north");
              }
              if (directionSet.has("eastdown")) {
                spawnConnection(0.5, -0.5, -0.1, "east");
              }
              if (directionSet.has("southdown")) {
                spawnConnection(0.1, -0.5, 0.5, "south");
              }
              if (directionSet.has("westdown")) {
                spawnConnection(-0.5, -0.5, 0.1, "west");
              }
              if (directionSet.has("northup")) {
                spawnConnection(-0.1, 0.5, -0.5, "south");
              }
              if (directionSet.has("eastup")) {
                spawnConnection(0.5, 0.5, -0.1, "west");
              }
              if (directionSet.has("southup")) {
                spawnConnection(0.1, 0.5, 0.5, "north");
              }
              if (directionSet.has("westup")) {
                spawnConnection(-0.5, 0.5, 0.1, "east");
              }
              yield;
            }
          }
        }
      }
    }
  } finally {
    if (callback !== void 0) {
      callback();
    }
  }
}
function requirementColor(requirement) {
  if (requirement === void 0 || requirement.types.length === 0) {
    return { red: 0, green: 0, blue: 0 };
  }
  const key = [...requirement.types].sort().join(",") + (requirement.whiteList ? "+w" : "+b");
  const hash = hashString(key);
  let red = hash * 197 % 256;
  let green = hash * 293 % 256;
  let blue = hash * 503 % 256;
  if (!requirement.whiteList) {
    red = red ^ 137;
    green = green ^ 251;
    blue = blue ^ 61;
  }
  return { red: red / 255, green: green / 255, blue: blue / 255 };
  function hashString(str) {
    let hashStr = 0;
    for (let i = 0; i < str.length; i++) {
      hashStr = hashStr * 31 + str.charCodeAt(i) | 0;
    }
    return hashStr >>> 0;
  }
}
function main() {
  loadDebugFlags();
}
var debugFlags, debugFlagNames, PROPERTY_PREFIX;
var init_debug = __esm({
  "src/debug.ts"() {
    "use strict";
    init_utils();
    debugFlags = {
      scanParticles: true,
      pathParticles: true,
      pathfindingWarnings: true
    };
    debugFlagNames = Object.keys(debugFlags);
    PROPERTY_PREFIX = "tektopia:debug:";
    system.beforeEvents.startup.subscribe((event) => {
      const customCommandRegistry = event.customCommandRegistry;
      customCommandRegistry.registerEnum("tektopia:debugflag", debugFlagNames);
      customCommandRegistry.registerCommand({
        name: "tektopia:debug",
        cheatsRequired: false,
        description: "Toggle a debug flag (omit the value to flip it)",
        mandatoryParameters: [{ type: CustomCommandParamType.Enum, name: "tektopia:debugflag" }],
        optionalParameters: [{ type: CustomCommandParamType.Boolean, name: "enabled" }],
        permissionLevel: CommandPermissionLevel.Admin
      }, (_, flag, enabled) => {
        if (!isDebugFlag(flag)) {
          return {
            status: CustomCommandStatus.Failure,
            message: `Unknown flag. Options: ${debugFlagNames.join(", ")}`
          };
        }
        const newValue = enabled ?? !debugFlags[flag];
        system.run(() => setDebugFlag(flag, newValue));
        return {
          status: CustomCommandStatus.Success,
          message: `${flag} is now ${newValue ? "on" : "off"}`
        };
      });
    });
    system.run(tickDrawDebug);
    world.afterEvents.worldLoad.subscribe(() => {
      main();
    });
  }
});

// src/path_constants.ts
var pathCancelEntityTypes, pathIgnoreEntityTypes;
var init_path_constants = __esm({
  "src/path_constants.ts"() {
    "use strict";
    pathCancelEntityTypes = [
      "minecraft:chest_boat",
      "minecraft:boat",
      "minecraft:minecart",
      "minecraft:command_block_minecart",
      "minecraft:chest_minecart",
      "minecraft:tnt_minecart",
      "minecraft:hopper_minecart"
    ];
    pathIgnoreEntityTypes = [
      "minecraft:fishing_hook",
      "minecraft:ice_bomb",
      "minecraft:balloon",
      "minecraft:wind_charge_projectile",
      "minecraft:egg",
      "minecraft:small_fireball",
      "minecraft:ender_crystal",
      "minecraft:wither_skull_dangerous",
      "minecraft:wither_skull",
      "minecraft:thrown_trident",
      "minecraft:fireball",
      "minecraft:dragon_fireball",
      "minecraft:breeze_wind_charge_projectile",
      "minecraft:arrow",
      "minecraft:ominous_item_spawner",
      "minecraft:llama_spit",
      "minecraft:xp_orb",
      "minecraft:shulker_bullet",
      "minecraft:xp_bottle",
      "minecraft:tnt",
      "minecraft:splash_potion",
      "minecraft:lingering_potion",
      "minecraft:snowball",
      "minecraft:ender_pearl",
      "minecraft:armor_stand",
      "minecraft:lightning_bolt",
      "minecraft:tripod_camera",
      "minecraft:fireworks_rocket",
      "minecraft:eye_of_ender_signal",
      "minecraft:area_effect_cloud",
      "minecraft:item"
    ];
  }
});

// src/path.ts
import {
  Block,
  GameMode,
  Player,
  system as system2,
  world as world2
} from "@minecraft/server";
function generatePath(entity, start, end, token) {
  return new Promise((resolve) => {
    const village = entity.getVillage();
    if (village === void 0) {
      resolve("no_village");
      return;
    }
    const villageBounds = village.bounds;
    const dimensionId = village.dimensionId;
    const dimension = world2.getDimension(dimensionId);
    const nodeList = village.pathNodes;
    const startLocation = floorVector(start);
    let endLocation = floorVector(end);
    const endBlock = dimension.getBlockSafe(endLocation);
    if (endBlock !== void 0 && !endBlock.isValidPath(villageBounds)) {
      const checkBlocks = [
        endBlock.northSafe(),
        endBlock.eastSafe(),
        endBlock.southSafe(),
        endBlock.westSafe()
      ];
      for (const block of checkBlocks) {
        if (block?.isValidPath(villageBounds)) {
          endLocation = block.location;
          break;
        }
      }
    }
    function heuristic(vector1, vector2) {
      return Math.abs(vector1.x - vector2.x) + Math.abs(vector1.y - vector2.y) + Math.abs(vector1.z - vector2.z);
    }
    system2.runJob(safeTickGeneratePath());
    function* safeTickGeneratePath() {
      try {
        yield* tickGeneratePath();
      } catch (error) {
        if (debugFlags.pathfindingWarnings) {
          console.warn("Pathfinding failed: ", error);
        }
        resolve("error");
      }
    }
    function* tickGeneratePath() {
      let startKey = vectorToString(startLocation);
      let endKey = vectorToString(endLocation);
      if (nodeList[startKey] === void 0) {
        const nearestStart = findNearestNodeLocation(nodeList, startLocation);
        if (nearestStart === void 0) {
          resolve("no_path");
          return;
        }
        startKey = vectorToString(nearestStart);
      }
      if (nodeList[endKey] === void 0) {
        const nearestEnd = findNearestNodeLocation(nodeList, endLocation);
        if (nearestEnd === void 0) {
          resolve("no_path");
          return;
        }
        endKey = vectorToString(nearestEnd);
      }
      const startVec = stringToVector(startKey);
      const endVec = stringToVector(endKey);
      if (startKey === endKey) {
        resolve([startVec]);
        return;
      }
      const HEURISTIC_WEIGHT = 1;
      const MAX_EXPANSIONS = 2e4;
      const YIELD_EVERY = 20;
      const closedSet = /* @__PURE__ */ new Set();
      const gScore = /* @__PURE__ */ new Map([[startKey, 0]]);
      const cameFrom = /* @__PURE__ */ new Map();
      const openSet = new PriorityQueue();
      openSet.enqueue(startKey, heuristic(startVec, endVec) * HEURISTIC_WEIGHT);
      const checkEntityList = getCheckPathEntities(dimensionId, entity);
      let expansions = 0;
      while (!openSet.isEmpty()) {
        const currentKey = openSet.dequeue();
        if (currentKey === void 0 || closedSet.has(currentKey)) {
          continue;
        }
        closedSet.add(currentKey);
        if (currentKey === endKey) {
          const path = [];
          let key = currentKey;
          while (key !== void 0) {
            path.push(stringToVector(key));
            key = cameFrom.get(key);
          }
          path.reverse();
          resolve(path);
          return;
        }
        if (token.cancelled) {
          resolve("cancelled");
          return;
        }
        if (++expansions > MAX_EXPANSIONS) {
          resolve("timeout");
          return;
        }
        const currentVec = stringToVector(currentKey);
        const currentNode = nodeList[currentKey];
        if (currentNode === void 0) {
          continue;
        }
        const currentG = gScore.get(currentKey) ?? 0;
        outerLoop: for (const neighborKey of currentNode.neighbors) {
          if (closedSet.has(neighborKey)) {
            continue;
          }
          const neighborNode = nodeList[neighborKey];
          if (neighborNode === void 0) {
            continue;
          }
          if (neighborNode.requirement !== void 0 && !checkRequirement(entity.typeId, neighborNode.requirement)) {
            continue;
          }
          const neighborLocation = stringToVector(neighborKey);
          const neighborCenter = centerVector(neighborLocation, true);
          let isBlocked = false;
          for (const other of checkEntityList) {
            if (calculateSquareDistance(other.location, neighborCenter) < 1.75) {
              if (other.cancelPath) {
                continue outerLoop;
              }
              isBlocked = true;
              break;
            }
          }
          const moveCost = heuristic(currentVec, neighborLocation) + (neighborLocation.y !== currentVec.y ? 10 : 0) + (isBlocked ? 50 : 0);
          const tentativeG = currentG + moveCost;
          if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
            cameFrom.set(neighborKey, currentKey);
            gScore.set(neighborKey, tentativeG);
            openSet.enqueue(
              neighborKey,
              tentativeG + heuristic(neighborLocation, endVec) * HEURISTIC_WEIGHT
            );
          }
        }
        if (expansions % YIELD_EVERY === 0) {
          yield;
        }
      }
      resolve("no_path");
    }
  });
}
function findNearestNodeLocation(nodeList, location, maxRadius = 6) {
  if (nodeList[vectorToString(location)] !== void 0) {
    return location;
  }
  for (let radius = 1; radius <= maxRadius; radius++) {
    let closest;
    let closestDist = Infinity;
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dz = -radius; dz <= radius; dz++) {
          if (Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz)) !== radius) {
            continue;
          }
          const candidate = addVectors(location, { x: dx, y: dy, z: dz });
          if (nodeList[vectorToString(candidate)] === void 0) {
            continue;
          }
          const dist = calculateSquareDistance(candidate, location);
          if (dist < closestDist) {
            closestDist = dist;
            closest = candidate;
          }
        }
      }
    }
    if (closest !== void 0) {
      return closest;
    }
  }
  return void 0;
}
function getCheckPathEntities(dimensionId, villager) {
  const VillagerClass = villager.constructor;
  const result = [];
  const entityList = pathCheckEntities[dimensionId] ?? [];
  for (const checkEntityObject of entityList) {
    if (checkEntityObject.id === villager.id) {
      continue;
    }
    const checkEntity = world2.getEntity(checkEntityObject.id);
    if (checkEntity === void 0) {
      continue;
    }
    result.push({
      ...checkEntityObject,
      isBlocked: checkEntity instanceof VillagerClass && (checkEntity.isBlocked || !checkEntity.isPathing)
    });
  }
  return result;
}
function checkRequirement(villagerType, requirement) {
  if (requirement === void 0) {
    return true;
  }
  const { whiteList, types } = requirement;
  const typeSet = new Set(types);
  if (whiteList) {
    return typeSet.has(villagerType);
  }
  return !typeSet.has(villagerType);
}
function updatePathNodes(blockList) {
  updatePathNodeList.push(blockList);
}
function tickUpdateNodes() {
  system2.runJob(updateNodesBlocks(tickUpdateNodes));
}
function* updateNodesBlocks(callback) {
  try {
    if (!world2.loadedData) {
      return;
    }
    let index = 0;
    while (updatePathNodeList.length > 0) {
      const blockList = updatePathNodeList.shift();
      for (let i = 0; i < blockList.length; i++) {
        const checkBlock = blockList[i];
        if (!checkBlock.isValid) {
          continue;
        }
        const neighborList = checkBlock.getNodeNeighbors();
        const checkBlockStringLocation = vectorToString(checkBlock);
        const villageList = world2.getVillages();
        for (const village of villageList) {
          const alreadyCheckedLocations = /* @__PURE__ */ new Set();
          const villageBounds = village.bounds;
          village.removeNode(checkBlockStringLocation);
          for (const neighborBlock of neighborList) {
            const neighborLocationString = vectorToString(neighborBlock);
            if (!alreadyCheckedLocations.has(neighborLocationString)) {
              alreadyCheckedLocations.add(neighborLocationString);
              if (village.pathNodes[neighborLocationString] !== void 0 && neighborBlock.isValidPath(villageBounds)) {
                system2.runJob(village.searchBlocks(neighborBlock));
              }
            }
          }
        }
        if (i % 3 === 0) {
          yield;
        }
      }
      index++;
      if (index % 5 === 0) {
        yield;
      }
    }
  } finally {
    if (callback !== void 0) {
      callback();
    }
  }
}
var PriorityQueue, pathCheckEntities, updatePathNodeList, minecraftNonSolidBlocksSet;
var init_path = __esm({
  "src/path.ts"() {
    "use strict";
    init_path_constants();
    init_debug();
    init_registry();
    init_utils();
    init_variables();
    PriorityQueue = class {
      heap = [];
      enqueue(element, priority) {
        const node = { element, priority };
        this.heap.push(node);
        this.bubbleUp();
      }
      dequeue() {
        const min = this.heap[0];
        const end = this.heap.pop();
        if (end === void 0) {
          return void 0;
        }
        if (this.heap.length > 0) {
          this.heap[0] = end;
          this.bubbleDown();
        }
        return min.element;
      }
      bubbleUp() {
        let index = this.heap.length - 1;
        const element = this.heap[index];
        while (index > 0) {
          const parentIndex = Math.floor((index - 1) / 2);
          const parent = this.heap[parentIndex];
          if (element.priority >= parent.priority) {
            break;
          }
          this.heap[index] = parent;
          index = parentIndex;
        }
        this.heap[index] = element;
      }
      bubbleDown() {
        let index = 0;
        const length = this.heap.length;
        const element = this.heap[0];
        while (true) {
          const leftChildIndex = 2 * index + 1;
          const rightChildIndex = 2 * index + 2;
          let swap = null;
          if (leftChildIndex < length) {
            const leftChild = this.heap[leftChildIndex];
            if (leftChild.priority < element.priority) {
              swap = leftChildIndex;
            }
          }
          if (rightChildIndex < length) {
            const rightChild = this.heap[rightChildIndex];
            if (swap === null && rightChild.priority < element.priority || swap !== null && rightChild.priority < this.heap[swap].priority) {
              swap = rightChildIndex;
            }
          }
          if (swap === null) {
            break;
          }
          this.heap[index] = this.heap[swap];
          index = swap;
        }
        this.heap[index] = element;
      }
      isEmpty() {
        return this.heap.length === 0;
      }
    };
    pathCheckEntities = {};
    system2.runInterval(() => {
      for (const dimensionId of Registry.dimensionTypes) {
        const dimension = world2.getDimension(dimensionId);
        const entities2 = dimension.getEntities({
          excludeTypes: pathIgnoreEntityTypes
        });
        pathCheckEntities[dimensionId] = [];
        for (const entity of entities2) {
          if (entity instanceof Player && entity.getGameMode() === GameMode.Spectator) {
            continue;
          }
          pathCheckEntities[dimensionId].push({
            location: entity.location,
            id: entity.id,
            typeId: entity.typeId,
            cancelPath: pathCancelEntityTypes.includesFast(entity.typeId)
          });
        }
      }
    });
    updatePathNodeList = [];
    world2.afterEvents.playerInteractWithBlock.subscribe((event) => {
      const block = event.block;
      updatePathNodes(
        [block, block.aboveSafe(), block.belowSafe()].filter((checkBlock) => checkBlock !== void 0)
      );
    });
    world2.afterEvents.playerPlaceBlock.subscribe((event) => {
      const block = event.block;
      updatePathNodes([block, block.aboveSafe(), block.belowSafe()].filter((checkBlock) => checkBlock !== void 0));
    });
    world2.afterEvents.playerBreakBlock.subscribe((event) => {
      const block = event.block;
      updatePathNodes(
        [block, block.aboveSafe(), block.belowSafe()].filter((checkBlock) => checkBlock !== void 0)
      );
    });
    world2.afterEvents.explosion.subscribe((event) => {
      const impactedBlocks = event.getImpactedBlocks();
      updatePathNodes(
        impactedBlocks.flatMap(
          (block) => [block, block.aboveSafe(), block.belowSafe()].filter((checkBlock) => checkBlock !== void 0)
        )
      );
    });
    system2.run(tickUpdateNodes);
    Block.prototype.isValidPath = function(villageBounds) {
      const block = this;
      const below = block.belowSafe();
      if (below === void 0) {
        return false;
      }
      const above = block.aboveSafe();
      if (above === void 0) {
        return false;
      }
      if (!block.canPathThrough()) {
        return false;
      }
      if (below.isDangerous()) {
        return false;
      }
      const belowIsSolid = below.getIsSolid();
      if (below.destroyableLeaf() && (block.destroyableLeaf() || above.destroyableLeaf())) {
        return false;
      }
      if (!belowIsSolid) {
        return false;
      }
      if (!above.canPathThrough()) {
        return false;
      }
      if (villageBounds !== void 0 && !isVectorBetween(block, villageBounds.start, villageBounds.end, true)) {
        return false;
      }
      return true;
    };
    Block.prototype.getNodeNeighbors = function() {
      const nodeBlock = this;
      const north = nodeBlock.northSafe();
      const east = nodeBlock.eastSafe();
      const south = nodeBlock.southSafe();
      const west = nodeBlock.westSafe();
      const sides = [north, east, south, west];
      const neighborList = [];
      for (const block of sides) {
        if (block !== void 0) {
          neighborList.push(block);
        }
      }
      for (const block of [...sides, nodeBlock]) {
        const below = block?.belowSafe();
        if (below !== void 0) {
          neighborList.push(below);
        }
      }
      for (const block of [...sides, nodeBlock]) {
        const above = block?.aboveSafe();
        if (above !== void 0) {
          neighborList.push(above);
        }
      }
      const diagonals = [
        north?.eastSafe(),
        east?.southSafe(),
        south?.westSafe(),
        west?.northSafe()
      ];
      for (const block of diagonals) {
        if (block !== void 0) {
          neighborList.push(block);
        }
      }
      return neighborList;
    };
    Block.prototype.getIsSolid = function() {
      return this.isSolid || Registry.solidBlocksSet.has(this.typeId);
    };
    Block.prototype.canPathThrough = function() {
      return this.canWalkThrough() || Registry.doorTypes.includesFast(this.typeId);
    };
    Block.prototype.destroyableLeaf = function() {
      return Registry.leafTypes.includesFast(this.typeId) && !this.permutation.getState("persistent_bit");
    };
    minecraftNonSolidBlocksSet = new Set(minecraftNonSolidBlocks);
    Block.prototype.canWalkThrough = function() {
      return (this.isAir || minecraftNonSolidBlocksSet.has(this.typeId) || this.destroyableLeaf()) && !this.isDangerous() && !this.isLiquid && !this.isWaterlogged;
    };
    Block.prototype.isDangerous = function() {
      return minecraftDangerousBlockTypes.includesFast(this.typeId);
    };
  }
});

// src/tree.ts
import {
  system as system3
} from "@minecraft/server";
function destroyTree(startingBlock, callback) {
  system3.runJob(destroyTreeGenerator());
  function* destroyTreeGenerator() {
    try {
      let currentBlock = startingBlock;
      const logType = removeIdentifier(startingBlock.typeId).replace("_log", "");
      const logTypeId = `minecraft:${logType}_log`;
      const leafTypeId = `minecraft:${logType}_leaves`;
      const logBlocks = [startingBlock];
      const checkLogBlocks = [];
      for (let x = -1; x <= 1; x++) {
        for (let z = -1; z <= 1; z++) {
          checkLogBlocks.push(startingBlock.offsetSafe({ x, y: 0, z }));
        }
      }
      const checkLeafBlocks = [];
      let logChecks = 0;
      while (true) {
        currentBlock = currentBlock.aboveSafe();
        if (currentBlock?.typeId !== logTypeId) {
          break;
        }
        if (currentBlock.permutation.getState("pillar_axis") !== "y") {
          break;
        }
        logBlocks.push(currentBlock);
        checkLeafBlocks.push(
          currentBlock.aboveSafe(),
          currentBlock.belowSafe(),
          currentBlock.northSafe(),
          currentBlock.eastSafe(),
          currentBlock.southSafe(),
          currentBlock.westSafe()
        );
        for (let x = -1; x <= 1; x++) {
          for (let z = -1; z <= 1; z++) {
            checkLogBlocks.push(currentBlock.offsetSafe({ x, y: 0, z }));
          }
        }
        if (++logChecks % 10 === 0) {
          yield;
        }
      }
      let alreadyCheckedLocations = /* @__PURE__ */ new Set();
      let sideLogChecks = 0;
      while (checkLogBlocks.length > 0) {
        const checkBlock = checkLogBlocks.pop();
        if (checkBlock === void 0) {
          continue;
        }
        const checkBlockString = vectorToString(checkBlock);
        if (alreadyCheckedLocations.has(checkBlockString)) {
          continue;
        }
        alreadyCheckedLocations.add(checkBlockString);
        if (checkBlock.typeId !== logTypeId) {
          continue;
        }
        if (checkBlock.permutation.getState("pillar_axis") === "y") {
          continue;
        }
        logBlocks.push(checkBlock);
        checkLeafBlocks.push(
          checkBlock.aboveSafe(),
          checkBlock.belowSafe(),
          checkBlock.northSafe(),
          checkBlock.eastSafe(),
          checkBlock.southSafe(),
          checkBlock.westSafe()
        );
        for (let x = -1; x <= 1; x++) {
          for (let y = 0; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
              checkLogBlocks.push(checkBlock.offsetSafe({ x, y, z }));
            }
          }
        }
        if (++sideLogChecks % 10 === 0) {
          yield;
        }
      }
      alreadyCheckedLocations = /* @__PURE__ */ new Set();
      const leafBlocks = [];
      const logBlockLocations = logBlocks.map((block) => block.location);
      let leafChecks = 0;
      while (checkLeafBlocks.length > 0) {
        const checkBlock = checkLeafBlocks.pop();
        if (checkBlock === void 0) {
          continue;
        }
        const checkBlockString = vectorToString(checkBlock);
        if (alreadyCheckedLocations.has(checkBlockString)) {
          continue;
        }
        alreadyCheckedLocations.add(checkBlockString);
        if (checkBlock.typeId !== leafTypeId) {
          continue;
        }
        if (checkBlock.permutation.getState("persistent_bit")) {
          continue;
        }
        let closestLogLocation;
        const maxDistance = 4;
        let closestDistance = maxDistance + 1;
        outer: for (let dx = -maxDistance; dx <= maxDistance; dx++) {
          for (let dy = -maxDistance; dy <= maxDistance; dy++) {
            for (let dz = -maxDistance; dz <= maxDistance; dz++) {
              if (Math.abs(dx) + Math.abs(dy) + Math.abs(dz) > maxDistance) {
                continue;
              }
              const block = checkBlock.offsetSafe({ x: dx, y: dy, z: dz });
              if (block === void 0) {
                continue;
              }
              const distance = calculateDistance(block, checkBlock);
              if (block.typeId === logTypeId && distance < closestDistance) {
                closestLogLocation = block.location;
                closestDistance = distance;
                if (closestDistance === 1) {
                  break outer;
                }
              }
            }
          }
        }
        if (closestLogLocation === void 0) {
          continue;
        }
        if (!logBlockLocations.some((location) => areVectorsEqual(closestLogLocation, location))) {
          continue;
        }
        leafBlocks.push(checkBlock);
        checkLeafBlocks.push(
          checkBlock.aboveSafe(),
          checkBlock.belowSafe(),
          checkBlock.northSafe(),
          checkBlock.eastSafe(),
          checkBlock.southSafe(),
          checkBlock.westSafe()
        );
        if (++leafChecks % 3 === 0) {
          yield;
        }
      }
      const blockList = logBlocks.concat(leafBlocks);
      const blocksToUpdate = [];
      const checkedBlocks = /* @__PURE__ */ new Set();
      for (let i = 0; i < blockList.length; i++) {
        const block = blockList[i];
        block.destroy();
        const updateBlockList = [block, block.aboveSafe(), block.belowSafe()];
        for (const updateBlock of updateBlockList) {
          if (updateBlock === void 0) {
            continue;
          }
          const neighborBlockList = [updateBlock, updateBlock.aboveSafe()];
          for (const neighborBlock of neighborBlockList) {
            if (neighborBlock === void 0) {
              continue;
            }
            const blockString = vectorToString(neighborBlock);
            if (!checkedBlocks.has(blockString)) {
              checkedBlocks.add(blockString);
              blocksToUpdate.push(neighborBlock, neighborBlock.aboveSafe());
            }
          }
        }
        if (i % 3 === 0) {
          yield;
        }
      }
      updatePathNodes(blocksToUpdate.filter((block) => block !== void 0));
    } finally {
      if (callback !== void 0) {
        callback();
      }
    }
  }
}
var init_tree = __esm({
  "src/tree.ts"() {
    "use strict";
    init_path();
    init_utils();
  }
});

// src/villager_tasks.ts
var tektopiaVillagers, globalTasks;
var init_villager_tasks = __esm({
  "src/villager_tasks.ts"() {
    "use strict";
    init_registry();
    tektopiaVillagers = {
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
            condition: (villager, village) => villager.findTree(village) !== void 0,
            tick: (villager, village) => villager.tickChop(village)
          }
        ],
        pickupItems: () => ["minecraft:apple", ...Registry.saplingTypes, ...Registry.logTypes]
      }
    };
    globalTasks = [
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
        condition: (villager, village) => villager.findItem(village) !== void 0,
        tick: (villager) => villager.tickPickupItem()
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
    ];
  }
});

// src/villager.ts
import {
  Block as Block2,
  EntityComponentTypes,
  ItemStack,
  system as system4,
  World,
  world as world3
} from "@minecraft/server";
var villagerCache, Villager;
var init_villager = __esm({
  "src/villager.ts"() {
    "use strict";
    init_generated();
    init_debug();
    init_path();
    init_registry();
    init_tree();
    init_utils();
    init_villager_tasks();
    villagerCache = /* @__PURE__ */ new Map();
    world3.afterEvents.entityRemove.subscribe((event) => {
      const removedEntityId = event.removedEntityId;
      villagerCache.delete(removedEntityId);
    });
    Villager = class _Villager {
      constructor(entity) {
        this.entity = entity;
        return new Proxy(this, {
          get(target, prop, receiver) {
            if (!(prop in target) && prop in target.entity) {
              const value = Reflect.get(target.entity, prop);
              return typeof value === "function" ? value.bind(target.entity) : value;
            }
            return Reflect.get(target, prop, receiver);
          },
          set(target, prop, value) {
            if (!(prop in target) && prop in target.entity) {
              return Reflect.set(target.entity, prop, value);
            }
            return Reflect.set(target, prop, value);
          }
        });
      }
      entity;
      isBlocked = false;
      blockedTimer = 0;
      isPathing = false;
      unblockTimer = 0;
      pathTickId;
      pathError;
      taskProgress = 0;
      currentTask;
      animation;
      lastAnimation;
      holdingItem;
      lastHoldingItem;
      waiting;
      foundItem;
      foundTree;
      static fromEntity(entity) {
        const cached = villagerCache.get(entity.id);
        if (cached !== void 0) {
          return cached;
        }
        const villager = new _Villager(entity);
        villagerCache.set(entity.id, villager);
        return villager;
      }
      static fromId(entityId) {
        const entity = world3.getEntity(entityId);
        if (!entity?.isVillager) {
          return void 0;
        }
        return entity instanceof _Villager ? entity : _Villager.fromEntity(entity);
      }
      lookAt(location, ignoreY = false) {
        const entity = this;
        const entityLocation = entity.location;
        const dx = location.x - entityLocation.x;
        const dy = location.y - entityLocation.y;
        const dz = location.z - entityLocation.z;
        const yaw = Math.atan2(dz, dx) * (180 / Math.PI) - 90;
        const pitch = -Math.atan2(dy, Math.sqrt(dx * dx + dz * dz)) * (180 / Math.PI);
        entity.setRotation({ x: ignoreY ? entity.getRotation().x : pitch, y: yaw });
      }
      setAnimation(animation) {
        this.animation = animation;
      }
      getAnimation() {
        return this.animation;
      }
      getAllBlocksStandingOn(...args) {
        return this.entity.getAllBlocksStandingOn(...args);
      }
      stopPath() {
      }
      getMoveSpeed(ignoreY = false) {
        const entityVelocity = this.entity.getVelocity();
        const { x, y, z } = entityVelocity;
        return Math.sqrt(x * x + z * z + (ignoreY ? 0 : y * y));
      }
      getVillage() {
        const entityLocation = this.location;
        const entityDimension = this.dimension;
        return entityDimension.getVillage(entityLocation);
      }
      findTree(village) {
        const takenTrees = /* @__PURE__ */ new Set();
        const villagers = world3.getVillagers();
        for (const villager of villagers) {
          if (villager.id === this.id) {
            continue;
          }
          const tree = villager.foundTree;
          if (tree !== void 0) {
            takenTrees.add(vectorToString(tree));
          }
        }
        const villagerLoc = this.location;
        let closestTree;
        let minDist = Infinity;
        for (const treeStr of village.treeLocations) {
          if (takenTrees.has(treeStr)) {
            continue;
          }
          const treeVec = stringToVector(treeStr);
          const dist = calculateDistance(villagerLoc, treeVec);
          if (dist < minDist) {
            minDist = dist;
            closestTree = treeVec;
          }
        }
        this.foundTree = closestTree;
        return closestTree;
      }
      findItem(village) {
        let pickupItems = tektopiaVillagers[this.typeId]?.pickupItems;
        if (pickupItems === void 0) {
          this.foundItem = void 0;
          return void 0;
        }
        if (typeof pickupItems === "function") {
          pickupItems = pickupItems();
        }
        const villagerLoc = this.location;
        const nearbyItems = this.dimension.getEntities({
          type: "item",
          location: villagerLoc,
          maxDistance: 9
        });
        let closestItem;
        let bestDist = Infinity;
        for (const item of nearbyItems) {
          if (!item.isOnGround || item.unreachable > 0) {
            continue;
          }
          if (Math.abs(item.location.y - villagerLoc.y) > 1.1) {
            continue;
          }
          if (!isVectorBetween(item.location, village.bounds.start, village.bounds.end)) {
            continue;
          }
          const stack = item.getComponent(EntityComponentTypes.Item)?.itemStack;
          if (stack === void 0 || !pickupItems.includes(stack.typeId)) {
            continue;
          }
          const dist = calculateDistance(item.location, villagerLoc);
          if (dist < bestDist) {
            bestDist = dist;
            closestItem = item;
          }
        }
        this.foundItem = closestItem;
        return closestItem;
      }
      pathFindTo(targetLocation) {
        const villager = this;
        if (villager.isPathing) {
          return;
        }
        const village = villager.getVillage();
        if (village === void 0) {
          return;
        }
        villager.isPathing = true;
        const token = { cancelled: false };
        let finished = false;
        const timeoutId = system4.runTimeout(() => {
          if (!finished) {
            cancelPath();
          }
        }, 1200);
        function cancelPath() {
          if (finished) {
            return;
          }
          finished = true;
          system4.clearRun(timeoutId);
          token.cancelled = true;
          villager.blockedTimer = 0;
          villager.setAnimation(void 0);
          villager.isPathing = false;
          if (villager.pathTickId !== void 0) {
            system4.clearRun(villager.pathTickId);
          }
          villager.pathTickId = void 0;
          villager.stopPath = () => {
          };
        }
        villager.stopPath = cancelPath;
        try {
          let startLocation = floorVector(villager.location);
          if (village.pathNodes[vectorToString(startLocation)] === void 0) {
            const entityStandingOnBlocks = villager.getAllBlocksStandingOn();
            for (const block of entityStandingOnBlocks) {
              const blockAbove = block.aboveSafe();
              if (blockAbove === void 0) {
                continue;
              }
              const blockAboveLocationString = vectorToString(blockAbove);
              if (village.pathNodes[blockAboveLocationString] !== void 0) {
                startLocation = blockAbove.location;
                break;
              }
            }
          }
          generatePath(villager, startLocation, targetLocation, token).then((result) => {
            if (finished) {
              return;
            }
            if (typeof result === "string") {
              if (result !== "cancelled") {
                villager.pathError = result;
              }
              cancelPath();
              return;
            }
            if (result.length === 0) {
              cancelPath();
              return;
            }
            villager.followPath(result, targetLocation, cancelPath, () => finished);
          }).catch((error) => {
            if (debugFlags.pathfindingWarnings) {
              console.warn("pathFindTo failed: ", error);
            }
            cancelPath();
          });
        } catch (error) {
          if (debugFlags.pathfindingWarnings) {
            console.warn("pathFindTo setup failed: ", error);
          }
          cancelPath();
        }
      }
      tickAI() {
        const villager = this;
        if (villager.isDead) {
          return;
        }
        const village = villager.getVillage();
        if (village === void 0) {
          villager.nameTag = "No Village";
          villager.setAnimation(void 0);
          return;
        }
        const pathError = villager.pathError;
        if (villager.isWaiting && pathError === void 0) {
          let nameTag = `Waiting${".".repeat(Math.floor(system4.currentTick / 5) % 3 + 1)}`;
          if (typeof villager.waiting === "number") {
            villager.waiting--;
            if (villager.waiting === 0) {
              villager.holdingItem = void 0;
            }
            nameTag = `(${villager.waiting}) ${nameTag}`;
          }
          villager.nameTag = nameTag;
        } else {
          villager.tickTasks(village);
        }
        if (pathError !== void 0) {
          villager.pathError = void 0;
        }
        villager.updateHoldingItem();
        villager.updateAnimation();
      }
      get isWaiting() {
        return typeof this.waiting === "number" ? this.waiting > 0 : this.waiting;
      }
      tickTasks(village) {
        const villager = this;
        const dimension = villager.dimension;
        const villagerProps = tektopiaVillagers[villager.typeId];
        if (villagerProps === void 0) {
          return;
        }
        const villagerLocation = villager.location;
        const allTaskList = globalTasks.concat(villagerProps.customTasks);
        const taskList = villager.currentTask !== void 0 ? allTaskList.filter((task) => task.canInterrupt) : allTaskList;
        if (villager.currentTask === void 0) {
          villager.foundTree = void 0;
          villager.foundItem = void 0;
          for (const task of taskList) {
            if (task.condition(villager, village)) {
              villager.currentTask = task.id;
              villager.stopPath();
              villager.taskProgress = 0;
              break;
            }
          }
          if (villager.currentTask === void 0) {
            villager.foundTree = void 0;
            villager.foundItem = void 0;
          }
        }
        if (villager.currentTask !== void 0) {
          const task = allTaskList.find((checkTask) => checkTask.id === villager.currentTask);
          task?.tick?.(villager, village);
          if (!villager.hasTask && !villager.isWaiting) {
            if (villager.animation !== "walking") {
              villager.animation = void 0;
            }
            villager.holdingItem = void 0;
            villager.stopPath();
            villager.taskProgress = 0;
            villager.foundTree = void 0;
          }
          for (const checkTask of allTaskList) {
            if (checkTask.id === villager.currentTask) {
              villager.nameTag = `${checkTask.name}
${villager.blockedTimer}`;
              break;
            }
          }
        } else if (!villager.isPathing) {
          const offset = {
            x: randomInt(-10, 10),
            y: 0,
            z: randomInt(-10, 10)
          };
          const randomLocation = addVectors(villagerLocation, offset);
          if (villager.taskProgress > 0) {
            villager.taskProgress--;
          } else {
            let block = dimension.getBlockSafe(randomLocation);
            if (block !== void 0) {
              while (block?.isAir) {
                block = block.belowSafe();
              }
              while (block !== void 0 && !block.isAir) {
                block = block.aboveSafe();
              }
              if (block !== void 0) {
                if (village.pathNodes[vectorToString(block)] !== void 0) {
                  villager.pathFindTo(block.location);
                  villager.taskProgress = randomInt(20, 200);
                }
              }
            }
          }
        }
        if (villager.currentTask === void 0) {
          villager.nameTag = "Idle";
        }
        if (villager.isPathing && villager.typeId === "tektopia:lumberjack" && system4.currentTick % 20 === 0) {
          const minVector = addVectors(villagerLocation, { x: -2, y: -1, z: -2 });
          const maxVector = addVectors(villagerLocation, { x: 2, y: 2, z: 2 });
          const blocksToUpdate = [];
          const checkedBlocks = /* @__PURE__ */ new Set();
          for (let x = minVector.x; x <= maxVector.x; x++) {
            for (let y = minVector.y; y <= maxVector.y; y++) {
              for (let z = minVector.z; z <= maxVector.z; z++) {
                const block = dimension.getBlockSafe({ x, y, z });
                if (block === void 0) {
                  continue;
                }
                if (block.permutation.getState("persistent_bit") === false) {
                  block.destroy();
                  const blockList = [block, block.aboveSafe(), block.belowSafe()];
                  for (const neighbor of blockList) {
                    if (neighbor === void 0) {
                      continue;
                    }
                    const blockString = vectorToString(neighbor);
                    if (!checkedBlocks.has(blockString)) {
                      checkedBlocks.add(blockString);
                      blocksToUpdate.push(neighbor);
                    }
                  }
                }
              }
            }
          }
          updatePathNodes(blocksToUpdate);
        }
      }
      get hasTask() {
        return this.currentTask !== void 0;
      }
      tickChop(village) {
        const villager = this;
        const dimension = villager.dimension;
        const foundTree = villager.foundTree;
        if (foundTree !== void 0) {
          const treeBlock = dimension.getBlockSafe(foundTree);
          if (treeBlock?.isTree) {
            const treeDist = calculateDistance(foundTree, villager.location);
            if (treeDist <= 5) {
              villager.holdingItem = "wooden_axe";
            } else {
              villager.holdingItem = void 0;
            }
            if (treeDist < 0.5 || !villager.isPathing && treeDist < 3) {
              villager.animation = "chopping";
              villager.lookAt(centerVector(foundTree));
              villager.taskProgress++;
              if (villager.taskProgress > 100 && !villager.isWaiting) {
                const saplingTypeId = treeBlock.typeId.replace(
                  "_log",
                  "_sapling"
                );
                villager.waiting = true;
                villager.animation = void 0;
                destroyTree(treeBlock, () => {
                  village.saplingLocations.push(vectorToString(treeBlock));
                  villager.currentTask = void 0;
                  villager.waiting = 20;
                  if (!treeBlock.isValid) {
                    return;
                  }
                  treeBlock.replace(saplingTypeId);
                });
              }
            } else {
              villager.pathFindTo(foundTree);
            }
          } else {
            village.treeLocations.remove(vectorToString(foundTree));
            villager.currentTask = void 0;
          }
        } else {
          villager.currentTask = void 0;
        }
      }
      tickPickupItem() {
        const villager = this;
        const foundItem = villager.foundItem;
        const pathError = villager.pathError;
        if (foundItem?.isValid) {
          if (calculateDistance(foundItem.location, villager.location) < 1.75) {
            if (villager.getMoveSpeed() < 0.01) {
              const item = foundItem.getComponent(EntityComponentTypes.Item)?.itemStack;
              if (item !== void 0) {
                villager.getComponent(EntityComponentTypes.Inventory)?.container.addItem(item);
                villager.holdingItem = item.typeId;
              }
              villager.waiting = 10;
              villager.playAnimation(
                "animation.tektopia_villager.pickup_item"
              );
              foundItem.remove();
              villager.currentTask = void 0;
              villager.animation = void 0;
              villager.stopPath();
            }
          } else if (pathError !== void 0) {
            foundItem.unreachable = 20;
            villager.currentTask = void 0;
          } else {
            villager.pathFindTo(foundItem.location);
          }
        } else {
          villager.currentTask = void 0;
        }
      }
      updateAnimation() {
        if (this.lastAnimation !== this.animation) {
          this.lastAnimation = this.animation;
          this.entity.setProperty("property:animation", this.animation ?? "none");
        }
      }
      updateHoldingItem() {
        if (this.lastHoldingItem !== this.holdingItem) {
          this.lastHoldingItem = this.holdingItem;
          this.entity.runCommand(
            this.holdingItem !== void 0 ? `replaceitem entity @s slot.weapon.offhand 0 ${this.holdingItem}` : "replaceitem entity @s slot.weapon.offhand 0 air"
          );
        }
      }
      followPath(pathNodeList, targetLocation, cancelPath, isFinished) {
        const villager = this;
        const village = villager.getVillage();
        if (village === void 0) {
          cancelPath();
          return;
        }
        const dimension = villager.dimension;
        const dimensionId = dimension.id;
        const villageBounds = village.bounds;
        function tickFollowPath() {
          if (isFinished()) {
            return;
          }
          try {
            if (!villager.isValid || !villager.isPathing || village === void 0) {
              cancelPath();
              return;
            }
            const targetBlock = dimension.getBlockSafe(targetLocation);
            if (targetBlock !== void 0 && !targetBlock.isValidPath(villageBounds) && calculateDistance(centerVector(targetLocation), villager.location) <= 1.25) {
              cancelPath();
              return;
            }
            villager.pathTickId = system4.run(tickFollowPath);
            if (pathNodeList.length === 0) {
              cancelPath();
              return;
            }
            if (system4.currentTick % 20 === 0) {
              pathNodeList.forEach((pathNode) => {
                try {
                  dimension.spawnParticle(
                    "minecraft:villager_angry",
                    centerVector(pathNode)
                  );
                } catch {
                }
              });
            }
            const currentPathNode = centerVector(pathNodeList[0], true);
            const entityLocation = villager.location;
            if (villager.isOnGround) {
              villager.lookAt(currentPathNode, true);
            }
            const direction = villager.getViewDirection();
            const speed = villager.isOnGround ? 0.2 : 0.015;
            const moveVector = multiplyVector(direction, "xyz", speed);
            const checkEntityList = getCheckPathEntities(dimensionId, villager);
            const pathNodeBlock = dimension.getBlockSafe(currentPathNode);
            if (pathNodeBlock !== void 0) {
              if (!pathNodeBlock.isValidPath(villageBounds)) {
                village.checkNodeValidity(vectorToString(pathNodeBlock));
                cancelPath();
                return;
              }
              const pathNodeBlockBelowTypeId = pathNodeBlock.belowSafe()?.typeId;
              if (pathNodeBlockBelowTypeId !== void 0 && (Registry.slabTypes.includesFast(pathNodeBlockBelowTypeId) || Registry.stairTypes.includesFast(pathNodeBlockBelowTypeId))) {
                currentPathNode.y -= 0.5;
              }
            }
            if (calculateDistance(currentPathNode, entityLocation) >= 2) {
              cancelPath();
              return;
            }
            let isBlocked = false;
            let blockedByTektopiaVillager = false;
            for (const checkEntity of checkEntityList) {
              if (!checkEntity.isBlocked) {
                const checkEntityLocation = checkEntity.location;
                const checkEntityIsTektopiaVillager = checkEntity.typeId.startsWith("tektopia:");
                if (calculateSquareDistance(checkEntityLocation, currentPathNode) < 1.75) {
                  if (checkEntity.cancelPath) {
                    cancelPath();
                    return;
                  }
                  blockedByTektopiaVillager = checkEntityIsTektopiaVillager;
                  isBlocked = true;
                  break;
                }
              }
            }
            if (blockedByTektopiaVillager) {
              villager.unblockTimer = 20;
            } else if (!isBlocked && villager.unblockTimer > 0) {
              villager.unblockTimer--;
              isBlocked = true;
            }
            villager.isBlocked = isBlocked;
            const isMoving = villager.getMoveSpeed(true) > 1e-4;
            if (!isMoving || isBlocked) {
              villager.blockedTimer = (villager.blockedTimer | 0) + 1;
            } else {
              villager.blockedTimer = 0;
            }
            if (isBlocked) {
              if (!isMoving) {
                villager.setAnimation(void 0);
              }
            } else {
              villager.setAnimation("walking");
              if (villager.isOnGround) {
                villager.applyKnockback(moveVector, 0);
                if (currentPathNode.y - villager.location.y > 0.55) {
                  villager.applyImpulse({ x: 0, y: 0.44, z: 0 });
                }
              } else {
                villager.applyImpulse({ x: moveVector.x, y: 0, z: moveVector.z });
              }
            }
            if (villager.blockedTimer > 40) {
              cancelPath();
              return;
            }
            if (calculateSquareDistance(currentPathNode, villager.location) <= 0.5) {
              pathNodeList.shift();
            }
          } catch (error) {
            if (debugFlags.pathfindingWarnings) {
              console.warn("Path follow failed: ", error);
            }
            cancelPath();
          }
        }
        villager.pathTickId = system4.run(tickFollowPath);
      }
    };
    World.prototype.getVillager = function(entityId) {
      return Villager.fromId(entityId);
    };
    system4.runInterval(() => {
      if (!world3.loadedData) {
        return;
      }
      const villagers = world3.getVillagers();
      for (const villager of villagers) {
        try {
          villager.tickAI();
        } catch (error) {
          console.warn("Villager tick failed: ", error);
        }
      }
    });
    system4.runInterval(() => {
      const itemEntities = world3.getEntities({ type: "item" });
      for (const entity of itemEntities) {
        if (entity.unreachable > 0) {
          entity.unreachable--;
        }
      }
    }, 20);
    Block2.prototype.destroy = function() {
      if (!this.isValid) {
        return;
      }
      const lootTableManager = world3.getLootTableManager();
      const itemList = lootTableManager.generateLootFromBlock(this) ?? [];
      const dimension = this.dimension;
      for (const item of itemList) {
        item.makeVillageItem();
        dimension.spawnItem(item, this.center());
      }
      this.soundEvent("break");
      this.setType("air");
    };
    Block2.prototype.replace = function(blockType) {
      this.setType(blockType);
      this.soundEvent("place");
    };
    ItemStack.prototype.makeVillageItem = function() {
      this.nameTag = `\xA7r\xA7a${formatTypeId(this.typeId)}`;
      this.setLore(["\xA7r\xA77Village Item"]);
    };
    Block2.prototype.soundEvent = function(eventId, soundOptions) {
      let options = soundOptions !== void 0 ? { ...soundOptions } : void 0;
      if (this.isAir) {
        return;
      }
      const sound = blockSounds[removeIdentifier(this.typeId)]?.[eventId];
      if (sound === void 0) {
        console.warn(`Missing sound: ${this.typeId}`);
        return;
      }
      if (typeof sound === "object" && sound !== null) {
        options = {
          pitch: resolveValue(sound.pitch ?? 1),
          volume: resolveValue(sound.volume ?? 1),
          ...options
        };
      }
      function resolveValue(value) {
        if (Array.isArray(value)) {
          return randomInt(value[0] * 10, value[1] * 10) / 10;
        }
        return value;
      }
      if (sound !== null) {
        this.playSound(typeof sound === "string" ? sound : sound.sound, options);
      }
    };
    Block2.prototype.playSound = function(soundId, soundOptions) {
      this.dimension.playSound(soundId, this.center(), soundOptions);
    };
  }
});

// src/villager_extensions.ts
import {
  Entity,
  World as World2
} from "@minecraft/server";
var require_villager_extensions = __commonJS({
  "src/villager_extensions.ts"() {
    init_registry();
    init_villager();
    var originalFunctions = {
      getEntity: World2.prototype.getEntity
    };
    World2.prototype.getVillagers = function() {
      return this.getEntities().filter(
        (entity) => Registry.villagerTypes.includes(entity.typeId)
      ).map((entity) => Villager.fromEntity(entity));
    };
    World2.prototype.getEntity = function(entityId) {
      const entity = originalFunctions.getEntity.call(this, entityId);
      if (entity?.isVillager) {
        return Villager.fromEntity(entity);
      }
      return entity;
    };
    Object.defineProperty(Entity.prototype, "isVillager", {
      get() {
        return Registry.villagerTypes.includes(this.typeId);
      }
    });
  }
});
export default require_villager_extensions();
//# sourceMappingURL=villager_extensions.js.map
