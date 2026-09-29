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

// src/village.ts
import {
  system,
  World,
  world
} from "@minecraft/server";
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
  for (let i = 0; i < values.length; i++) {
    let value = values[i];
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
  for (let i = 0; i < text.length; i++) {
    const digit = DIGIT_VALUES[text[i]];
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
function comparePoints(a, b) {
  return a.x - b.x || a.z - b.z || a.y - b.y;
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
  return packSigned(dx) + "." + packSigned(dz) + "." + packSigned(dy);
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
    if (!village) {
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
      treeLocations: []
    };
  }
  static compress(data) {
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
      for (let j = 0; j < node.neighbors.length; j++) {
        const neighborKey = node.neighbors[j];
        const neighborIndex = indexByKey.get(neighborKey);
        if (neighborIndex === void 0) {
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
        } else if (!data.pathNodes[neighborKey].neighbors.includes(key)) {
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
    for (let i = 0; i < forwardMasks.length; i++) {
      maskCounts.set(forwardMasks[i], (maskCounts.get(forwardMasks[i]) ?? 0) + 1);
    }
    const palette = [...maskCounts.keys()].sort(
      (a, b) => maskCounts.get(b) - maskCounts.get(a) || a - b
    );
    const paletteIndexByMask = /* @__PURE__ */ new Map();
    for (let i = 0; i < palette.length; i++) {
      paletteIndexByMask.set(palette[i], i);
    }
    const maskIndices = forwardMasks.map((mask) => paletteIndexByMask.get(mask));
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
  static decompress(compressed) {
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
    for (let i = 0; i < keys.length; i++) {
      pathNodes[keys[i]] = { neighbors: [] };
    }
    const palette = unpackUnsigned(paletteText);
    const maskIndices = unpackUnsigned(maskIndexText);
    for (let i = 0; i < points.length; i++) {
      const mask = palette[maskIndices[i]];
      if (!mask) {
        continue;
      }
      const node = pathNodes[keys[i]];
      for (let bit = 0; bit < 13; bit++) {
        if (!(mask & 1 << bit)) {
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
    for (let i = 0; i < nodeRequirements.length; i++) {
      const [whiteList, types, deltaText] = nodeRequirements[i];
      const deltas = unpackUnsigned(deltaText);
      let index = 0;
      for (let j = 0; j < deltas.length; j++) {
        index += deltas[j];
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
    if (!node1 || !node2) {
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
    if (node1) {
      node1.neighbors = node1.neighbors.filter((k) => k !== bKey);
    }
    if (node2) {
      node2.neighbors = node2.neighbors.filter((k) => k !== aKey);
    }
  }
  removeNode(key) {
    const village = this;
    const node = village.pathNodes[key];
    if (!node) {
      return;
    }
    for (const neighborKey of [...node.neighbors]) {
      this.unlink(key, neighborKey);
    }
    delete village.pathNodes[key];
  }
};
World.prototype.getVillages = function() {
  return this.villageList.map((data) => Village.from(data));
};
function blockIsTree(block) {
  const aboveBlock = block.aboveSafe();
  if (!Registry.logTypes.includesFast(block.typeId)) {
    return false;
  }
  if (aboveBlock === void 0 || aboveBlock.typeId !== block.typeId) {
    return false;
  }
  const aboveAboveBlock = aboveBlock.aboveSafe();
  if (aboveAboveBlock === void 0 || aboveAboveBlock.typeId !== block.typeId) {
    return false;
  }
  const belowBlock = block.belowSafe();
  if (belowBlock === void 0 || !minecraftDirtTypes.includesFast(belowBlock.typeId)) {
    return false;
  }
  return true;
}
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
      const locationString = randomItem(Object.keys(village.pathNodes));
      const locationStringList = [locationString];
      const alreadyCheckedLocations = /* @__PURE__ */ new Set();
      while (locationStringList.length) {
        const locationString2 = locationStringList.pop();
        if (alreadyCheckedLocations.has(locationString2) || locationString2 === void 0) {
          continue;
        }
        alreadyCheckedLocations.add(locationString2);
        const node = village.pathNodes[locationString2];
        const location = stringToVector(locationString2);
        const dimension = world.getDimension(village.dimensionId);
        const block = dimension.getBlockSafe(location);
        if (block === void 0 || node === void 0) {
          continue;
        }
        try {
          dimension.spawnParticle(
            "minecraft:basic_flame_particle",
            centerVector(block)
          );
        } catch {
        }
        try {
          const checkBlockList = [
            block,
            block.northSafe(),
            block.eastSafe(),
            block.southSafe(),
            block.westSafe(),
            block.belowSafe()
          ];
          for (let i = 0; i < checkBlockList.length; i++) {
            const checkBlock = checkBlockList[i];
            if (checkBlock === void 0) {
              continue;
            }
            let checkNearbyNodes = false;
            const checkBlockString = vectorToString(checkBlock);
            if (blockIsFarm(checkBlock)) {
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
            } else if (blockIsTree(checkBlock)) {
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
      yield;
    }
  } finally {
    if (callback) {
      callback();
    }
  }
}
function blockIsFarm(block) {
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
      get: lazy(definitions[key]),
      enumerable: true
    });
  }
  return registry;
}
var blocks = (test) => () => Registry.blockTypes.filter(test);
var entities = (test) => () => Registry.entityTypes.filter(test);
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
export {
  Registry
};
//# sourceMappingURL=registry.js.map
