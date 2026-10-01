// src/village.ts
import {
  Block,
  CommandPermissionLevel,
  CustomCommandParamType,
  CustomCommandStatus,
  Dimension,
  Player,
  system,
  World,
  world
} from "@minecraft/server";

// src/registry.ts
import {
  BlockTypes,
  DimensionTypes,
  EntityTypes
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
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomItem(list) {
  return list[randomInt(0, list.length - 1)];
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
function subtractVectors(vector1, vector2) {
  return {
    x: vector1.x - vector2.x,
    y: vector1.y - vector2.y,
    z: vector1.z - vector2.z
  };
}

// src/variables.ts
var minecraftDirtTypes = [
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

// src/village_serialization.ts
var SAVE_PATH_NODES = true;
var SAVE_RESOURCE_LOCATIONS = true;
var NAMESPACE = "minecraft:";
var DIGITS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
var DIGIT_VALUES = {};
for (let i = 0; i < DIGITS.length; i++) {
  DIGIT_VALUES[DIGITS[i]] = i;
}
function packUnsigned(values) {
  let result = "";
  for (let value of values) {
    while (value >= 32) {
      result += DIGITS[value % 32 + 32];
      value = Math.floor(value / 32);
    }
    result += DIGITS[value];
  }
  return result;
}
function unpackUnsigned(text) {
  const result = [];
  let value = 0;
  let scale = 1;
  for (const char of text) {
    const digit = DIGIT_VALUES[char];
    value += (digit & 31) * scale;
    if (digit >= 32) {
      scale *= 32;
    } else {
      result.push(value);
      value = 0;
      scale = 1;
    }
  }
  return result;
}
function zigzag(value) {
  return value >= 0 ? value * 2 : -value * 2 - 1;
}
function unzigzag(value) {
  return value % 2 === 0 ? value / 2 : -(value + 1) / 2;
}
function packSigned(values) {
  return packUnsigned(values.map((value) => zigzag(value)));
}
function unpackSigned(text) {
  return unpackUnsigned(text).map((value) => unzigzag(value));
}
function comparePoints(vector1, vector2) {
  const x = vector1.x - vector2.x;
  if (x !== 0) {
    return x;
  }
  const z = vector1.z - vector2.z;
  if (z !== 0) {
    return z;
  }
  return vector1.y - vector2.y;
}
function packPoints(sortedPoints, origin) {
  if (sortedPoints.length === 0) {
    return "";
  }
  const dx = new Array(sortedPoints.length);
  const dy = new Array(sortedPoints.length);
  const dz = new Array(sortedPoints.length);
  let px = origin.x;
  let py = origin.y;
  let pz = origin.z;
  for (let i = 0; i < sortedPoints.length; i++) {
    const point = sortedPoints[i];
    dx[i] = point.x - px;
    dy[i] = point.y - py;
    dz[i] = point.z - pz;
    px = point.x;
    py = point.y;
    pz = point.z;
  }
  return `${packSigned(dx)}.${packSigned(dz)}.${packSigned(dy)}`;
}
function unpackPoints(text, origin) {
  if (text === "") {
    return [];
  }
  const [xText, zText, yText] = text.split(".");
  const dx = unpackSigned(xText);
  const dz = unpackSigned(zText);
  const dy = unpackSigned(yText);
  const points = new Array(dx.length);
  let x = origin.x;
  let y = origin.y;
  let z = origin.z;
  for (let i = 0; i < dx.length; i++) {
    x += dx[i];
    y += dy[i];
    z += dz[i];
    points[i] = { x, y, z };
  }
  return points;
}
function packLocations(locationList, origin) {
  const points = locationList.map((location) => stringToVector(location));
  points.sort(comparePoints);
  return packPoints(points, origin);
}
function unpackLocations(text, origin) {
  return unpackPoints(text, origin).map((point) => vectorToString(point));
}
function originOf(center) {
  return { x: Math.floor(center.x), y: Math.floor(center.y), z: Math.floor(center.z) };
}
var NEIGHBOR_OFFSETS = [];
for (let dx = -1; dx <= 1; dx++) {
  for (let dz = -1; dz <= 1; dz++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx !== 0 || dy !== 0 || dz !== 0) {
        NEIGHBOR_OFFSETS.push({ x: dx, y: dy, z: dz });
      }
    }
  }
}
var FORWARD_START = 13;
function offsetIndex(dx, dy, dz) {
  const index = (dx + 1) * 9 + (dz + 1) * 3 + (dy + 1);
  return index > 13 ? index - 1 : index;
}
function offsetKey(location, offset) {
  return vectorToString({
    x: location.x + offset.x,
    y: location.y + offset.y,
    z: location.z + offset.z
  });
}
function compressVillage(data) {
  const center = data.center;
  const origin = originOf(center);
  const nodeEntries = SAVE_PATH_NODES ? Object.keys(data.pathNodes).map((key) => ({ key, location: stringToVector(key) })) : [];
  nodeEntries.sort((a, b) => comparePoints(a.location, b.location));
  const indexByKey = /* @__PURE__ */ new Map();
  for (let i = 0; i < nodeEntries.length; i++) {
    indexByKey.set(nodeEntries[i].key, i);
  }
  const forwardMasks = new Array(nodeEntries.length).fill(0);
  const requirementGroups = /* @__PURE__ */ new Map();
  for (let i = 0; i < nodeEntries.length; i++) {
    const { key, location } = nodeEntries[i];
    const node = data.pathNodes[key];
    if (node === void 0) {
      continue;
    }
    for (const neighborKey of node.neighbors) {
      const neighborIndex = indexByKey.get(neighborKey);
      const neighborNode = data.pathNodes[neighborKey];
      if (neighborIndex === void 0 || neighborNode === void 0) {
        continue;
      }
      const neighbor = nodeEntries[neighborIndex].location;
      const dx = neighbor.x - location.x;
      const dy = neighbor.y - location.y;
      const dz = neighbor.z - location.z;
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1 || Math.abs(dz) > 1) {
        continue;
      }
      if (dx === 0 && dy === 0 && dz === 0) {
        continue;
      }
      const bit = offsetIndex(dx, dy, dz);
      if (bit >= FORWARD_START) {
        forwardMasks[i] |= 1 << bit - FORWARD_START;
      } else if (!neighborNode.neighbors.includes(key)) {
        forwardMasks[neighborIndex] |= 1 << offsetIndex(-dx, -dy, -dz) - FORWARD_START;
      }
    }
    const requirement = node.requirement;
    if (requirement !== void 0) {
      const types = requirement.types.slice().sort();
      const groupKey = (requirement.whiteList ? "1" : "0") + types.join(",");
      let group = requirementGroups.get(groupKey);
      if (group === void 0) {
        group = { whiteList: requirement.whiteList ? 1 : 0, types, deltas: [], last: 0 };
        requirementGroups.set(groupKey, group);
      }
      group.deltas.push(i - group.last);
      group.last = i;
    }
  }
  const maskCounts = /* @__PURE__ */ new Map();
  for (const mask of forwardMasks) {
    maskCounts.set(mask, (maskCounts.get(mask) ?? 0) + 1);
  }
  const palette = [...maskCounts.keys()].sort((mask1, mask2) => {
    const countDifference = (maskCounts.get(mask2) ?? 0) - (maskCounts.get(mask1) ?? 0);
    return countDifference !== 0 ? countDifference : mask1 - mask2;
  });
  const paletteIndexByMask = /* @__PURE__ */ new Map();
  for (let i = 0; i < palette.length; i++) {
    paletteIndexByMask.set(palette[i], i);
  }
  const maskIndices = forwardMasks.map((mask) => paletteIndexByMask.get(mask)).filter((mask) => mask !== void 0);
  const nodeRequirements = [];
  for (const group of requirementGroups.values()) {
    nodeRequirements.push([group.whiteList, group.types, packUnsigned(group.deltas)]);
  }
  const dimensionId = data.dimensionId;
  const door = data.doorLocation;
  return [
    dimensionId.startsWith(NAMESPACE) ? dimensionId.slice(NAMESPACE.length) : dimensionId,
    [center.x, center.y, center.z],
    [door.x - origin.x, door.y - origin.y, door.z - origin.z],
    SAVE_RESOURCE_LOCATIONS ? packLocations(data.sugarCaneLocations, origin) : "",
    SAVE_RESOURCE_LOCATIONS ? packLocations(data.saplingLocations, origin) : "",
    SAVE_RESOURCE_LOCATIONS ? packLocations(data.farmLocations, origin) : "",
    SAVE_RESOURCE_LOCATIONS ? packLocations(data.treeLocations, origin) : "",
    packPoints(nodeEntries.map((entry) => entry.location), origin),
    packUnsigned(palette),
    packUnsigned(maskIndices),
    nodeRequirements
  ];
}
function decompressVillage(compressed) {
  const [
    dimensionId,
    centerTriple,
    doorTriple,
    sugarCaneText,
    saplingText,
    farmText,
    treeText,
    nodeText,
    paletteText,
    maskIndexText
  ] = compressed;
  const nodeRequirements = compressed[compressed.length - 1];
  const center = { x: centerTriple[0], y: centerTriple[1], z: centerTriple[2] };
  const origin = originOf(center);
  const points = unpackPoints(nodeText, origin);
  const keys = points.map((point) => vectorToString(point));
  const pathNodes = {};
  for (const key of keys) {
    pathNodes[key] = { neighbors: [] };
  }
  const palette = unpackUnsigned(paletteText);
  const maskIndices = unpackUnsigned(maskIndexText);
  for (let i = 0; i < points.length; i++) {
    const mask = palette[maskIndices[i]];
    if (mask === void 0) {
      continue;
    }
    const node = pathNodes[keys[i]];
    if (node === void 0) {
      continue;
    }
    for (let bit = 0; bit < 13; bit++) {
      if ((mask & 1 << bit) === 0) {
        continue;
      }
      const neighborKey = offsetKey(points[i], NEIGHBOR_OFFSETS[FORWARD_START + bit]);
      const neighborNode = pathNodes[neighborKey];
      if (neighborNode === void 0) {
        continue;
      }
      node.neighbors.push(neighborKey);
      neighborNode.neighbors.push(keys[i]);
    }
  }
  for (const requirement of nodeRequirements) {
    const [whiteList, types, deltaText] = requirement;
    const deltas = unpackUnsigned(deltaText);
    let index = 0;
    for (const delta of deltas) {
      index += delta;
      const node = pathNodes[keys[index]];
      if (node !== void 0) {
        node.requirement = { whiteList: whiteList === 1, types: types.slice() };
      }
    }
  }
  return {
    dimensionId: dimensionId.includes(":") ? dimensionId : NAMESPACE + dimensionId,
    center,
    doorLocation: {
      x: doorTriple[0] + origin.x,
      y: doorTriple[1] + origin.y,
      z: doorTriple[2] + origin.z
    },
    pathNodes,
    sugarCaneLocations: unpackLocations(sugarCaneText, origin),
    saplingLocations: unpackLocations(saplingText, origin),
    farmLocations: unpackLocations(farmText, origin),
    treeLocations: unpackLocations(treeText, origin)
  };
}

// src/village.ts
system.beforeEvents.startup.subscribe((event) => {
  const customCommandRegistry = event.customCommandRegistry;
  customCommandRegistry.registerCommand({
    name: "tektopia:scan",
    cheatsRequired: false,
    description: "Scan a block at a specified location",
    mandatoryParameters: [{ type: CustomCommandParamType.Location, name: "location" }],
    permissionLevel: CommandPermissionLevel.Admin
  }, (origin, blockLocation) => {
    const player = origin.sourceEntity instanceof Player ? origin.sourceEntity : void 0;
    if (player === void 0) {
      return {
        status: CustomCommandStatus.Failure,
        message: "This command can only be run by a player."
      };
    }
    const dimension = player.dimension;
    const village = dimension.getVillage(blockLocation);
    if (village === void 0) {
      return {
        status: CustomCommandStatus.Failure,
        message: "No village was found at the specified location."
      };
    }
    system.runJob(village.scanLocation(blockLocation));
    return {
      status: CustomCommandStatus.Success,
      message: "Block scanned successfully."
    };
  });
});
var VILLAGE_RADIUS = 100;
var Village = class _Village {
  constructor(data) {
    this.data = data;
    this.center = data.center;
    this.centerString = vectorToString(data.center);
    this.bounds = {
      start: { x: data.center.x - VILLAGE_RADIUS, y: -64, z: data.center.z - VILLAGE_RADIUS },
      end: { x: data.center.x + VILLAGE_RADIUS, y: 320, z: data.center.z + VILLAGE_RADIUS }
    };
  }
  data;
  static cache = /* @__PURE__ */ new WeakMap();
  center;
  centerString;
  bounds;
  searchingBlocks = false;
  deletingInvalidNodes = false;
  static from(data) {
    let village = _Village.cache.get(data);
    if (village === void 0) {
      village = new _Village(data);
      _Village.cache.set(data, village);
    }
    return village;
  }
  static createData(center, dimensionId, doorLocation) {
    return {
      center,
      dimensionId,
      doorLocation,
      pathNodes: {},
      sugarCaneLocations: [],
      saplingLocations: [],
      farmLocations: [],
      cropLocations: [],
      treeLocations: []
    };
  }
  static compress(data) {
    return compressVillage(data);
  }
  static decompress(compressed) {
    return decompressVillage(compressed);
  }
  get dimensionId() {
    return this.data.dimensionId;
  }
  get doorLocation() {
    return this.data.doorLocation;
  }
  get pathNodes() {
    return this.data.pathNodes;
  }
  get sugarCaneLocations() {
    return this.data.sugarCaneLocations;
  }
  get saplingLocations() {
    return this.data.saplingLocations;
  }
  get farmLocations() {
    return this.data.farmLocations;
  }
  get cropLocations() {
    return this.data.cropLocations;
  }
  get treeLocations() {
    return this.data.treeLocations;
  }
  get dimension() {
    return world.getDimension(this.data.dimensionId);
  }
  get isValid() {
    return world.villageList.includes(this.data);
  }
  link(aKey, bKey) {
    const village = this;
    if (aKey === bKey) {
      return;
    }
    const node1 = village.pathNodes[aKey];
    const node2 = village.pathNodes[bKey];
    if (node1 === void 0 || node2 === void 0) {
      return;
    }
    if (!node1.neighbors.includes(bKey)) {
      node1.neighbors.push(bKey);
    }
    if (!node2.neighbors.includes(aKey)) {
      node2.neighbors.push(aKey);
    }
  }
  unlink(aKey, bKey) {
    const village = this;
    const node1 = village.pathNodes[aKey];
    const node2 = village.pathNodes[bKey];
    if (node1 !== void 0) {
      node1.neighbors = node1.neighbors.filter((k) => k !== bKey);
    }
    if (node2 !== void 0) {
      node2.neighbors = node2.neighbors.filter((k) => k !== aKey);
    }
  }
  removeNode(key) {
    const village = this;
    const node = village.pathNodes[key];
    if (node === void 0) {
      return;
    }
    for (const neighborKey of [...node.neighbors]) {
      this.unlink(key, neighborKey);
    }
    delete village.pathNodes[key];
  }
  *searchBlocks(startingBlock, overwrite = false, callback) {
    const village = this;
    try {
      const checkBlockList = [startingBlock];
      if (!startingBlock.isValidPath(village.bounds)) {
        return;
      }
      const startingBlockLocationString = vectorToString(startingBlock);
      const alreadyCheckedLocations = /* @__PURE__ */ new Set([startingBlockLocationString]);
      const villageBounds = village.bounds;
      const dimension = world.getDimension(village.dimensionId);
      const pathCache = /* @__PURE__ */ new Map();
      while (checkBlockList.length > 0) {
        if (!village.isValid) {
          return;
        }
        const checkBlock = checkBlockList.shift();
        if (!checkBlock?.isValid) {
          continue;
        }
        const key = vectorToString(checkBlock);
        village.pathNodes[key] ??= { neighbors: [] };
        const node = village.pathNodes[key];
        const requirement = checkBlock.getNodeRequirement();
        if (requirement !== void 0) {
          node.requirement = requirement;
        } else {
          delete node.requirement;
        }
        const before = new Set(node.neighbors);
        const after = /* @__PURE__ */ new Set();
        const checkBlockNeighbors = checkBlock.getNodeNeighbors();
        for (const block of checkBlockNeighbors) {
          const blockString = vectorToString(block);
          let isValid = pathCache.get(blockString);
          if (isValid === void 0) {
            isValid = block.isValidPath(villageBounds);
            pathCache.set(blockString, isValid);
          }
          if (!isValid || !isValidConnection(checkBlock, block)) {
            continue;
          }
          after.add(blockString);
          const existed = village.pathNodes[blockString] !== void 0;
          village.pathNodes[blockString] ??= { neighbors: [] };
          village.link(key, blockString);
          if (!alreadyCheckedLocations.has(blockString)) {
            alreadyCheckedLocations.add(blockString);
            if (overwrite || !existed) {
              checkBlockList.push(block);
            }
          }
        }
        for (const oldKey of before) {
          if (after.has(oldKey)) {
            continue;
          }
          village.unlink(key, oldKey);
          if (!overwrite && !alreadyCheckedLocations.has(oldKey)) {
            const neighbor = dimension.getBlockSafe(stringToVector(oldKey));
            if (neighbor?.isValidPath(villageBounds)) {
              alreadyCheckedLocations.add(oldKey);
              checkBlockList.push(neighbor);
            }
          }
        }
        yield;
      }
    } finally {
      if (callback !== void 0) {
        callback();
      }
    }
  }
  *scanLocation(location) {
    const flooredLocation = floorVector(location);
    const village = this;
    const dimension = world.getDimension(village.dimensionId);
    const locationStringList = [vectorToString(flooredLocation)];
    const alreadyCheckedLocations = /* @__PURE__ */ new Set();
    while (locationStringList.length > 0) {
      const locationString = locationStringList.pop();
      if (alreadyCheckedLocations.has(locationString) || locationString === void 0) {
        continue;
      }
      alreadyCheckedLocations.add(locationString);
      const node = village.pathNodes[locationString];
      const currentLocation = stringToVector(locationString);
      const block = dimension.getBlockSafe(currentLocation);
      if (block === void 0 || node === void 0) {
        continue;
      }
      dimension.spawnParticle("minecraft:basic_flame_particle", centerVector(block.location));
      try {
        const checkBlockList = [
          block,
          block.northSafe(),
          block.eastSafe(),
          block.southSafe(),
          block.westSafe(),
          block.belowSafe()
        ];
        for (const checkBlock of checkBlockList) {
          if (checkBlock === void 0) {
            continue;
          }
          let checkNearbyNodes = false;
          const checkBlockString = vectorToString(checkBlock);
          if (checkBlock.isFarm) {
            checkNearbyNodes = true;
            if (!village.farmLocations.includes(checkBlockString)) {
              village.farmLocations.push(checkBlockString);
            }
          } else if (checkBlock.typeId === "minecraft:reeds") {
            checkNearbyNodes = true;
            if (!village.sugarCaneLocations.includes(checkBlockString)) {
              village.sugarCaneLocations.push(checkBlockString);
            }
          } else if (Registry.saplingTypes.includesFast(checkBlock.typeId)) {
            checkNearbyNodes = true;
            if (!village.saplingLocations.includes(checkBlockString)) {
              village.saplingLocations.push(checkBlockString);
            }
          } else if (checkBlock.isTree) {
            checkNearbyNodes = true;
            if (!village.treeLocations.includes(checkBlockString)) {
              village.treeLocations.push(checkBlockString);
            }
          }
          if (checkNearbyNodes) {
            locationStringList.push(...node.neighbors);
          }
        }
      } catch {
      }
      yield;
    }
  }
  checkNodeValidity(pathNodeLocation) {
    const village = this;
    const dimension = world.getDimension(village.dimensionId);
    const block = dimension.getBlockSafe(stringToVector(pathNodeLocation));
    const pathNode = village.pathNodes[pathNodeLocation];
    if (block === void 0 || pathNode === void 0) {
      return;
    }
    if (!block.isValidPath(village.bounds)) {
      village.removeNode(pathNodeLocation);
      return;
    }
    for (const neighborKey of [...pathNode.neighbors]) {
      const neighborBlock = dimension.getBlockSafe(stringToVector(neighborKey));
      if (neighborBlock !== void 0 && !isValidConnection(block, neighborBlock)) {
        village.unlink(pathNodeLocation, neighborKey);
      }
    }
  }
};
World.prototype.getVillages = function() {
  return this.villageList.map((data) => Village.from(data));
};
Block.prototype.getNodeRequirement = function() {
  const block = this;
  const below = block.belowSafe();
  const above = block.aboveSafe();
  if (below?.destroyableLeaf()) {
    return { whiteList: false, types: ["tektopia:lumberjack"] };
  }
  if (Registry.leafTypes.includesFast(block.typeId) || above !== void 0 && Registry.leafTypes.includesFast(above.typeId)) {
    return { whiteList: true, types: ["tektopia:lumberjack"] };
  }
  return void 0;
};
Object.defineProperty(Block.prototype, "isTree", {
  get() {
    const block = this;
    const aboveBlock = block.aboveSafe();
    if (!Registry.logTypes.includesFast(block.typeId)) {
      return false;
    }
    if (aboveBlock?.typeId !== block.typeId) {
      return false;
    }
    const aboveAboveBlock = aboveBlock.aboveSafe();
    if (aboveAboveBlock?.typeId !== block.typeId) {
      return false;
    }
    const belowBlock = block.belowSafe();
    if (belowBlock === void 0 || !minecraftDirtTypes.includesFast(belowBlock.typeId)) {
      return false;
    }
    return true;
  }
});
Object.defineProperty(Block.prototype, "isFarm", {
  get() {
    const block = this;
    const blockAbove = block.aboveSafe();
    if (blockAbove === void 0) {
      return false;
    }
    const blockAboveAbove = blockAbove.aboveSafe();
    if (blockAboveAbove === void 0) {
      return false;
    }
    return block.typeId === "minecraft:farmland" && blockAbove.isAir && blockAboveAbove.isAir;
  }
});
function tickScanVillage() {
  system.runJob(scanVillageBlocks(tickScanVillage));
}
system.run(tickScanVillage);
function* scanVillageBlocks(callback) {
  try {
    if (!world.loadedData) {
      return;
    }
    const villageList = world.getVillages();
    for (const village of villageList) {
      const randomLocationString = randomItem(Object.keys(village.pathNodes));
      if (randomLocationString === void 0) {
        continue;
      }
      const randomLocation = stringToVector(randomLocationString);
      yield* village.scanLocation(randomLocation);
    }
  } finally {
    if (callback !== void 0) {
      callback();
    }
  }
}
function* pruneLocations(dimension, locations, shouldRemove) {
  for (let i = locations.length - 1; i >= 0; i--) {
    if (i >= locations.length) {
      i = locations.length;
      continue;
    }
    const locationString = locations[i];
    const block = dimension.getBlockSafe(stringToVector(locationString));
    if (block !== void 0 && shouldRemove(block, locationString)) {
      locations[i] = locations[locations.length - 1];
      locations.pop();
    }
    yield;
  }
}
function tickUpdateVillage() {
  system.runJob(updateVillageBlocks(tickUpdateVillage));
}
system.run(tickUpdateVillage);
function* updateVillageBlocks(callback) {
  try {
    if (!world.loadedData) {
      return;
    }
    const villageList = world.getVillages();
    for (const village of villageList) {
      if (!village.isValid) {
        continue;
      }
      const dimension = world.getDimension(village.dimensionId);
      yield* pruneLocations(dimension, village.saplingLocations, (block, locationString) => {
        if (Registry.logTypes.includesFast(block.typeId)) {
          if (!village.treeLocations.includes(locationString)) {
            village.treeLocations.push(locationString);
          }
          return true;
        }
        return !Registry.saplingTypes.includesFast(block.typeId);
      });
      yield* pruneLocations(dimension, village.farmLocations, (block) => !block.isFarm);
      yield;
    }
  } finally {
    if (callback !== void 0) {
      callback();
    }
  }
}
system.runInterval(() => {
  if (!world.loadedData) {
    return;
  }
  const villageList = world.getVillages();
  for (const village of villageList) {
    const dimension = world.getDimension(village.dimensionId);
    if (!village.searchingBlocks) {
      const doorBlock = dimension.getBlockSafe(village.doorLocation);
      if (doorBlock !== void 0) {
        village.searchingBlocks = true;
        system.runJob(
          village.searchBlocks(doorBlock, true, () => {
            village.searchingBlocks = false;
          })
        );
      }
    }
    if (!village.deletingInvalidNodes) {
      village.deletingInvalidNodes = true;
      system.runJob(deleteInvalidPathNodes());
      function* deleteInvalidPathNodes() {
        const allVillagePathNodes = Object.keys(village.pathNodes);
        try {
          for (const pathNodeLocation of allVillagePathNodes) {
            if (!village.isValid) {
              return;
            }
            village.checkNodeValidity(pathNodeLocation);
            yield;
          }
        } finally {
          village.deletingInvalidNodes = false;
        }
      }
    }
  }
}, 100);
function getBoundaryLocations(vector1, vector2, ignoreY = false) {
  const minV = floorVector(minVectors(vector1, vector2));
  const maxV = ceilVector(maxVectors(vector1, vector2));
  const { x: minX, y: minY, z: minZ } = minV;
  const { x: maxX, y: maxY, z: maxZ } = maxV;
  const boundary = [];
  if (ignoreY) {
    const y = minY;
    for (let x = minX; x <= maxX; x++) {
      boundary.push({ x, y, z: minZ });
      if (minZ !== maxZ) {
        boundary.push({ x, y, z: maxZ });
      }
    }
    for (let z = minZ + 1; z < maxZ; z++) {
      boundary.push({ x: minX, y, z });
      if (minX !== maxX) {
        boundary.push({ x: maxX, y, z });
      }
    }
  } else {
    for (let x = minX; x <= maxX; x++) {
      for (let z = minZ; z <= maxZ; z++) {
        boundary.push({ x, y: minY, z });
        if (minY !== maxY) {
          boundary.push({ x, y: maxY, z });
        }
      }
    }
    for (let y = minY + 1; y < maxY; y++) {
      boundary.push({ x: minX, y, z: minZ });
      if (minZ !== maxZ) {
        boundary.push({ x: minX, y, z: maxZ });
      }
      if (minX !== maxX) {
        boundary.push({ x: maxX, y, z: minZ });
        if (minZ !== maxZ) {
          boundary.push({ x: maxX, y, z: maxZ });
        }
      }
    }
  }
  return boundary;
}
system.runInterval(() => {
  if (!world.loadedData) {
    return;
  }
  const players = world.getAllPlayers();
  for (const player of players) {
    const playerLocation = player.location;
    const villageList = world.getVillages();
    for (const village of villageList) {
      const boundaryLocationList = getBoundaryLocations(
        village.bounds.start,
        village.bounds.end,
        true
      );
      for (const location of boundaryLocationList) {
        location.y = playerLocation.y;
        if (calculateDistance(location, playerLocation) < 20) {
          try {
            player.spawnParticle(
              "minecraft:rising_border_dust_particle",
              addVector(location, "y", randomInt(-10, 10))
            );
          } catch {
          }
        }
      }
    }
  }
}, 20);
function isValidConnection(currentBlock, neighborBlock) {
  function checkValidConnection(block1, block2) {
    const offset = subtractVectors(block2, block1);
    if (offset.y === 1) {
      const aboveAbove = block1.aboveSafe()?.aboveSafe();
      if (!aboveAbove?.canWalkThrough()) {
        return false;
      }
    }
    if (offset.x !== 0 && offset.z !== 0) {
      const block2Above = block2.aboveSafe();
      if (block2Above === void 0 || !block2.canWalkThrough() || !block2Above.canWalkThrough()) {
        return false;
      }
      const dirX = offset.x === 1 ? "eastSafe" : "westSafe";
      const dirZ = offset.z === 1 ? "southSafe" : "northSafe";
      const checkBlockX = block1[dirX]();
      if (checkBlockX !== void 0 && (!checkBlockX.canWalkThrough() || !checkBlockX.aboveSafe()?.canWalkThrough() || !checkBlockX.isValidPath())) {
        return false;
      }
      const checkBlockZ = block1[dirZ]();
      if (checkBlockZ !== void 0 && (!checkBlockZ.canWalkThrough() || !checkBlockZ.aboveSafe()?.canWalkThrough() || !checkBlockZ.isValidPath())) {
        return false;
      }
    }
    return true;
  }
  return checkValidConnection(currentBlock, neighborBlock) && checkValidConnection(neighborBlock, currentBlock);
}
Dimension.prototype.getVillage = function(location) {
  const villages = world.getVillages();
  for (const village of villages) {
    if (isVectorBetween(location, village.bounds.start, village.bounds.end, true) && this === village.dimension) {
      return village;
    }
  }
  return void 0;
};
export {
  VILLAGE_RADIUS,
  Village
};
//# sourceMappingURL=village.js.map
