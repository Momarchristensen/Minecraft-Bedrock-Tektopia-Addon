// src/tree.ts
import {
  system as system3
} from "@minecraft/server";

// src/path.ts
import {
  Block,
  GameMode,
  Player,
  system as system2,
  world as world2
} from "@minecraft/server";

// src/path_constants.ts
var pathCancelEntityTypes = [
  "minecraft:chest_boat",
  "minecraft:boat",
  "minecraft:minecart",
  "minecraft:command_block_minecart",
  "minecraft:chest_minecart",
  "minecraft:tnt_minecart",
  "minecraft:hopper_minecart"
];
var pathIgnoreEntityTypes = [
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

// src/debug.ts
import {
  CommandPermissionLevel,
  CustomCommandParamType,
  CustomCommandStatus,
  MolangVariableMap,
  system,
  world
} from "@minecraft/server";

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
var directionMap = {
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

// src/debug.ts
var debugFlags = {
  scanParticles: true,
  pathParticles: true,
  pathfindingWarnings: true
};
var debugFlagNames = Object.keys(debugFlags);
var PROPERTY_PREFIX = "tektopia:debug:";
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
function tickDrawDebug() {
  system.runJob(drawDebug(tickDrawDebug));
}
system.run(tickDrawDebug);
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
world.afterEvents.worldLoad.subscribe(() => {
  main();
});
function main() {
  loadDebugFlags();
}

// src/registry.ts
import {
  BlockTypes,
  DimensionTypes,
  EntityTypes
} from "@minecraft/server";

// src/variables.ts
var minecraftDangerousBlockTypes = [
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
var minecraftNonSolidBlocks = [
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

// src/registry.ts
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
var blocks = (test) => (self) => self.blockTypes.filter(test);
var entities = (test) => (self) => self.entityTypes.filter(test);
var Registry = defineRegistry({
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

// src/path.ts
var pathCheckEntities = {};
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
var updatePathNodeList = [];
function updatePathNodes(blockList) {
  updatePathNodeList.push(blockList);
}
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
function tickUpdateNodes() {
  system2.runJob(updateNodesBlocks(tickUpdateNodes));
}
system2.run(tickUpdateNodes);
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
var minecraftNonSolidBlocksSet = new Set(minecraftNonSolidBlocks);
Block.prototype.canWalkThrough = function() {
  return (this.isAir || minecraftNonSolidBlocksSet.has(this.typeId) || this.destroyableLeaf()) && !this.isDangerous() && !this.isLiquid && !this.isWaterlogged;
};
Block.prototype.isDangerous = function() {
  return minecraftDangerousBlockTypes.includesFast(this.typeId);
};

// src/tree.ts
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
export {
  destroyTree
};
//# sourceMappingURL=tree.js.map
