// src/villager.ts
import {
  Entity,
  EntityComponentTypes,
  system as system3,
  World as World2,
  world as world3
} from "@minecraft/server";

// src/utils.ts
import {
  StructureRotation
} from "@minecraft/server";
function isVectorBetween(vector, vector1, vector2, ignoreY = false) {
  vector = centerVector(vector);
  const startingVector = floorVector(minVectors(vector1, vector2));
  const endingVector = ceilVector(maxVectors(vector1, vector2));
  return vector.x >= startingVector.x && vector.x <= endingVector.x && (ignoreY || vector.y >= startingVector.y && vector.y <= endingVector.y) && vector.z >= startingVector.z && vector.z <= endingVector.z;
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
function multiplyVector(vector, axises, value) {
  const result = {
    x: vector.x,
    y: vector.y,
    z: vector.z
  };
  if (typeof axises === "string") {
    axises = axises.split("");
  }
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

// src/registry.ts
import {
  BlockTypes,
  DimensionTypes,
  EntityTypes
} from "@minecraft/server";

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

// src/path.ts
import {
  GameMode,
  Player,
  system as system2,
  world as world2
} from "@minecraft/server";
function generatePath(entity, startLocation, targetLocation, token) {
  return new Promise((resolve) => {
    const village = entity.getVillage();
    if (!village) {
      resolve("no_village");
      return;
    }
    const villageBounds = village.bounds;
    const dimensionId = village.dimensionId;
    const dimension = world2.getDimension(dimensionId);
    const nodeList = village.pathNodes;
    startLocation = floorVector(startLocation);
    targetLocation = floorVector(targetLocation);
    const endBlock = dimension.getBlockSafe(targetLocation);
    if (endBlock !== void 0 && !isValidPath(endBlock, villageBounds)) {
      const checkBlocks = [
        endBlock.northSafe(),
        endBlock.eastSafe(),
        endBlock.southSafe(),
        endBlock.westSafe()
      ];
      for (let i = 0; i < checkBlocks.length; i++) {
        const block = checkBlocks[i];
        if (block !== void 0 && isValidPath(block, villageBounds)) {
          targetLocation = block.location;
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
        console.warn("Pathfinding failed: ", error);
        resolve("error");
      }
    }
    function* tickGeneratePath() {
      let startKey = vectorToString(startLocation);
      let endKey = vectorToString(targetLocation);
      if (!nodeList[startKey]) {
        const nearestStart = findNearestNodeLocation(nodeList, startLocation);
        if (nearestStart === void 0) {
          resolve("no_path");
          return;
        }
        startKey = vectorToString(nearestStart);
      }
      if (!nodeList[endKey]) {
        const nearestEnd = findNearestNodeLocation(nodeList, targetLocation);
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
        if (closedSet.has(currentKey)) {
          continue;
        }
        closedSet.add(currentKey);
        if (currentKey === endKey) {
          const path = [];
          let k = currentKey;
          while (k !== void 0) {
            path.push(stringToVector(k));
            k = cameFrom.get(k);
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
        if (!currentNode) {
          continue;
        }
        const currentG = gScore.get(currentKey) ?? 0;
        outerLoop: for (const neighborKey of currentNode.neighbors) {
          if (closedSet.has(neighborKey)) {
            continue;
          }
          const neighborNode = nodeList[neighborKey];
          if (!neighborNode) {
            continue;
          }
          if (neighborNode.requirement !== void 0 && !checkRequirement(entity.typeId, neighborNode.requirement)) {
            continue;
          }
          const neighborLocation = stringToVector(neighborKey);
          const neighborCenter = centerVector(neighborLocation, true);
          let isBlocked = false;
          for (let i = 0; i < checkEntityList.length; i++) {
            const other = checkEntityList[i];
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
  if (nodeList[vectorToString(location)]) {
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
          if (!nodeList[vectorToString(candidate)]) {
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
    if (closest) {
      return closest;
    }
  }
  return void 0;
}
function getCheckPathEntities(dimensionId, villager) {
  const result = [];
  const entityList = pathCheckEntities[dimensionId] ?? [];
  for (let i = 0; i < entityList.length; i++) {
    const checkEntityObject = entityList[i];
    if (!checkEntityObject || checkEntityObject.id === villager.id) {
      continue;
    }
    const checkEntity = world2.getEntity(checkEntityObject.id);
    if (!checkEntity) {
      continue;
    }
    result.push({
      ...checkEntityObject,
      isBlocked: checkEntity instanceof Villager && (checkEntity.isBlocked || !checkEntity.isPathing)
    });
  }
  return result;
}
var pathCheckEntities = {};
system2.runInterval(() => {
  for (let i = 0; i < Registry.dimensionTypes.length; i++) {
    const dimensionId = Registry.dimensionTypes[i];
    const dimension = world2.getDimension(dimensionId);
    const entities2 = dimension.getEntities({
      excludeTypes: pathIgnoreEntityTypes
    });
    pathCheckEntities[dimensionId] = [];
    for (let i2 = 0; i2 < entities2.length; i2++) {
      const entity = entities2[i2];
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
function checkRequirement(villagerType, requirement) {
  if (!requirement) {
    return true;
  }
  const { whiteList, types } = requirement;
  const typeSet = new Set(types);
  if (whiteList) {
    return typeSet.has(villagerType);
  }
  return !typeSet.has(villagerType);
}
var PriorityQueue = class {
  heap = [];
  enqueue(element, priority) {
    const node = { element, priority };
    this.heap.push(node);
    this.bubbleUp();
  }
  dequeue() {
    const min = this.heap[0];
    const end = this.heap.pop();
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
var updatePathNodeList = [];
function updatePathNodes(blockList) {
  updatePathNodeList.push(blockList);
}
world2.afterEvents.playerInteractWithBlock.subscribe((event) => {
  const block = event.block;
  updatePathNodes(
    [block, block.aboveSafe(), block.belowSafe()].filter(
      (block2) => block2 !== void 0
    )
  );
});
world2.afterEvents.playerPlaceBlock.subscribe((event) => {
  const block = event.block;
  updatePathNodes([block, block.aboveSafe(), block.belowSafe()].filter((block2) => block2 !== void 0));
});
world2.afterEvents.playerBreakBlock.subscribe((event) => {
  const block = event.block;
  updatePathNodes(
    [block, block.aboveSafe(), block.belowSafe()].filter(
      (block2) => block2 !== void 0
    )
  );
});
world2.afterEvents.explosion.subscribe((event) => {
  const impactedBlocks = event.getImpactedBlocks();
  updatePathNodes(
    impactedBlocks.flatMap(
      (block) => [block, block.aboveSafe(), block.belowSafe()].filter(
        (block2) => block2 !== void 0
      )
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
        const neighborList = getNodeNeighbors(checkBlock);
        const checkBlockStringLocation = vectorToString(checkBlock);
        const villageList = world2.getVillages();
        for (let j = 0; j < villageList.length; j++) {
          const village = villageList[j];
          const alreadyCheckedLocations = /* @__PURE__ */ new Set();
          const villageBounds = village.bounds;
          village.removeNode(checkBlockStringLocation);
          for (let k = 0; k < neighborList.length; k++) {
            const neighborBlock = neighborList[k];
            if (neighborBlock === void 0) {
              continue;
            }
            const neighborLocationString = vectorToString(neighborBlock);
            if (!alreadyCheckedLocations.has(neighborLocationString)) {
              alreadyCheckedLocations.add(neighborLocationString);
              if (village.pathNodes[neighborLocationString] && isValidPath(neighborBlock, villageBounds)) {
                system2.runJob(searchBlocks(village, neighborBlock));
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
function checkNodeValidity(village, pathNodeLocation) {
  const dimension = world2.getDimension(village.dimensionId);
  const block = dimension.getBlockSafe(stringToVector(pathNodeLocation));
  const pathNode = village.pathNodes[pathNodeLocation];
  if (!block || !pathNode) {
    return;
  }
  if (!isValidPath(block, village.bounds)) {
    village.removeNode(pathNodeLocation);
    return;
  }
  for (const neighborKey of [...pathNode.neighbors]) {
    const neighborBlock = dimension.getBlockSafe(stringToVector(neighborKey));
    if (neighborBlock && !isValidConnection(block, neighborBlock)) {
      village.unlink(pathNodeLocation, neighborKey);
      console.warn("Node Deleted: ", pathNodeLocation);
    }
  }
}
function isValidConnection(currentBlock, neighborBlock) {
  function checkValidConnection(block1, block2) {
    const offset = subtractVectors(block2, block1);
    if (offset.y === 1) {
      const aboveAbove = block1.aboveSafe()?.aboveSafe();
      if (aboveAbove === void 0 || !aboveAbove.canWalkThrough()) {
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
      if (checkBlockX && (!checkBlockX.canWalkThrough() || !checkBlockX.aboveSafe()?.canWalkThrough() || !isValidPath(checkBlockX))) {
        return false;
      }
      const checkBlockZ = block1[dirZ]();
      if (checkBlockZ && (!checkBlockZ.canWalkThrough() || !checkBlockZ.aboveSafe()?.canWalkThrough() || !isValidPath(checkBlockZ))) {
        return false;
      }
    }
    return true;
  }
  return checkValidConnection(currentBlock, neighborBlock) && checkValidConnection(neighborBlock, currentBlock);
}
function isValidPath(block, villageBounds) {
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
}
function* searchBlocks(village, startingBlock, overwrite = false, callback) {
  try {
    const checkBlockList = [startingBlock];
    if (!isValidPath(startingBlock, village.bounds)) {
      return;
    }
    const startingBlockLocationString = vectorToString(startingBlock);
    const alreadyCheckedLocations = /* @__PURE__ */ new Set([startingBlockLocationString]);
    const villageBounds = village.bounds;
    const dimension = world2.getDimension(village.dimensionId);
    const pathCache = /* @__PURE__ */ new Map();
    while (checkBlockList.length > 0) {
      if (!village.isValid) {
        return;
      }
      const checkBlock = checkBlockList.shift();
      if (checkBlock === void 0 || !checkBlock.isValid) {
        continue;
      }
      const key = vectorToString(checkBlock);
      village.pathNodes[key] ??= { neighbors: [] };
      const node = village.pathNodes[key];
      const requirement = getNodeRequirement(checkBlock);
      if (requirement) {
        node.requirement = requirement;
      } else {
        delete node.requirement;
      }
      const before = new Set(node.neighbors);
      const after = /* @__PURE__ */ new Set();
      for (const block of getNodeNeighbors(checkBlock)) {
        const blockString = vectorToString(block);
        let isValid = pathCache.get(blockString);
        if (isValid === void 0) {
          isValid = isValidPath(block, villageBounds);
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
          if (neighbor && isValidPath(neighbor, villageBounds)) {
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
function getNodeRequirement(block) {
  const below = block.belowSafe();
  const above = block.aboveSafe();
  if (below?.destroyableLeaf()) {
    return { whiteList: false, types: ["tektopia:lumberjack"] };
  }
  if (Registry.leafTypes.includesFast(block.typeId) || above !== void 0 && Registry.leafTypes.includesFast(above.typeId)) {
    return { whiteList: true, types: ["tektopia:lumberjack"] };
  }
  return void 0;
}
function getNodeNeighbors(nodeBlock) {
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
}
function pathFindTo(villager, targetLocation) {
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
  function cancelPath() {
    if (finished) {
      return;
    }
    finished = true;
    system2.clearRun(timeoutId);
    token.cancelled = true;
    villager.blockedTimer = 0;
    villager.setAnimation(void 0);
    villager.isPathing = false;
    if (villager.pathTickId !== void 0) {
      system2.clearRun(villager.pathTickId);
    }
    villager.pathTickId = void 0;
    villager.stopPath = () => {
    };
  }
  villager.stopPath = cancelPath;
  const timeoutId = system2.runTimeout(() => {
    if (!finished) {
      cancelPath();
    }
  }, 1200);
  try {
    let startLocation = floorVector(villager.location);
    if (village.pathNodes[vectorToString(startLocation)] === void 0) {
      const entityStandingOnBlocks = villager.getAllBlocksStandingOn();
      for (let i = 0; i < entityStandingOnBlocks.length; i++) {
        const blockAbove = entityStandingOnBlocks[i].aboveSafe();
        if (blockAbove === void 0) {
          continue;
        }
        const blockAboveLocationString = vectorToString(blockAbove);
        if (village.pathNodes[blockAboveLocationString]) {
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
      startFollowing(villager, result, targetLocation, cancelPath, () => finished);
    }).catch((error) => {
      console.warn("pathFindTo failed: ", error);
      cancelPath();
    });
  } catch (error) {
    console.warn("pathFindTo setup failed: ", error);
    cancelPath();
  }
}
function startFollowing(villager, pathNodeList, targetLocation, cancelPath, isFinished) {
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
      if (!villager.isValid || !villager.isPathing) {
        cancelPath();
        return;
      }
      const targetBlock = dimension.getBlockSafe(targetLocation);
      if (targetBlock && !isValidPath(targetBlock, villageBounds) && calculateDistance(centerVector(targetLocation), villager.location) <= 1.25) {
        cancelPath();
        return;
      }
      villager.pathTickId = system2.run(tickFollowPath);
      if (pathNodeList.length === 0) {
        cancelPath();
        return;
      }
      if (system2.currentTick % 20 === 0) {
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
        if (!isValidPath(pathNodeBlock, villageBounds)) {
          checkNodeValidity(village, vectorToString(pathNodeBlock));
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
      for (let i = 0; i < checkEntityList.length; i++) {
        const checkEntity = checkEntityList[i];
        if (checkEntity.isBlocked === void 0 || !checkEntity.isBlocked) {
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
      villager.unblockTimer ??= 0;
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
      console.warn("Path follow failed: ", error);
      cancelPath();
    }
  }
  villager.pathTickId = system2.run(tickFollowPath);
}

// src/villager.ts
var originalFunctions = {
  "getEntity": World2.prototype.getEntity
};
Object.defineProperty(Entity.prototype, "isVillager", {
  get: function() {
    return Registry.villagerTypes.includes(this.typeId);
  }
});
World2.prototype.getEntity = function(entityId) {
  const entity = originalFunctions.getEntity.call(this, entityId);
  if (entity !== void 0 && entity.isVillager) {
    return Villager.fromEntity(entity);
  }
  return entity;
};
World2.prototype.getVillagers = function() {
  return this.getEntities().filter(
    (entity) => Registry.villagerTypes.includes(entity.typeId)
  ).map((entity) => Villager.fromEntity(entity));
};
var villagerCache = /* @__PURE__ */ new Map();
world3.afterEvents.entityRemove.subscribe((event) => {
  const removedEntityId = event.removedEntityId;
  villagerCache.delete(removedEntityId);
});
var Villager = class _Villager {
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
    if (entity === void 0 || !entity.isVillager) {
      return void 0;
    }
    return entity instanceof _Villager ? entity : _Villager.fromEntity(entity);
  }
  get location() {
    return this.entity.location;
  }
  get dimension() {
    return this.entity.dimension;
  }
  get isDead() {
    return this.entity.isDead;
  }
  get id() {
    return this.entity.id;
  }
  get typeId() {
    return this.entity.typeId;
  }
  get isOnGround() {
    return this.entity.isOnGround;
  }
  get isValid() {
    return this.entity.isValid;
  }
  get nameTag() {
    return this.entity.nameTag;
  }
  set nameTag(value) {
    this.entity.nameTag = value;
  }
  applyKnockback(...args) {
    return this.entity.applyKnockback(...args);
  }
  applyImpulse(...args) {
    return this.entity.applyImpulse(...args);
  }
  getViewDirection(...args) {
    return this.entity.getViewDirection(...args);
  }
  lookAt(...args) {
    return this.entity.lookAt(...args);
  }
  getComponent(componentId) {
    return this.entity.getComponent(componentId);
  }
  playAnimation(...args) {
    return this.entity.playAnimation(...args);
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
    const villages = world3.getVillages();
    for (let i = 0; i < villages.length; i++) {
      const village = villages[i];
      if (isVectorBetween(entityLocation, village.bounds.start, village.bounds.end, true)) {
        return village;
      }
    }
    return void 0;
  }
  findTree(village) {
    const takenTrees = /* @__PURE__ */ new Set();
    const villagers = world3.getVillagers();
    for (let i = 0; i < villagers.length; i++) {
      if (villagers[i].id === this.id) {
        continue;
      }
      const tree = villagers[i].foundTree;
      if (tree) {
        takenTrees.add(vectorToString(tree));
      }
    }
    const villagerLoc = this.location;
    let closestTree;
    let minDist = Infinity;
    for (let i = 0; i < village.treeLocations.length; i++) {
      const treeStr = village.treeLocations[i];
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
    for (let i = 0; i < nearbyItems.length; i++) {
      const item = nearbyItems[i];
      if (!item.isOnGround || item.unreachable) {
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
    pathFindTo(this, targetLocation);
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
    if (villager.waiting && pathError === void 0) {
      let nameTag = `Waiting${".".repeat(Math.floor(system3.currentTick / 5) % 3 + 1)}`;
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
  tickTasks(village) {
    const villager = this;
    const dimension = villager.dimension;
    const villagerProps = tektopiaVillagers[villager.typeId];
    if (villagerProps === void 0) {
      return;
    }
    const villagerLocation = villager.location;
    const allTaskList = globalTasks.concat(villagerProps.customTasks);
    const taskList = villager.currentTask ? allTaskList.filter((task) => task.canInterrupt) : allTaskList;
    villager.taskProgress ??= 0;
    if (!villager.currentTask) {
      villager.foundTree = void 0;
      villager.foundItem = void 0;
      for (let i = 0; i < taskList.length; i++) {
        const task = taskList[i];
        if (task.condition(villager, village)) {
          villager.currentTask = task.id;
          villager.stopPath();
          villager.taskProgress = 0;
          break;
        }
      }
      if (!villager.currentTask) {
        villager.foundTree = void 0;
        villager.foundItem = void 0;
      }
    }
    if (villager.currentTask !== void 0) {
      const task = allTaskList.find((task2) => task2.id === villager.currentTask);
      task?.tick?.(villager, village);
      if (!villager.currentTask && !villager.waiting) {
        if (villager.animation !== "walking") {
          villager.animation = void 0;
        }
        villager.holdingItem = void 0;
        villager.stopPath();
        villager.taskProgress = 0;
        villager.foundTree = void 0;
      }
      for (let i = 0; i < allTaskList.length; i++) {
        const task2 = allTaskList[i];
        if (task2.id === villager.currentTask) {
          villager.nameTag = `${task2.name}
${villager.blockedTimer}`;
          break;
        }
      }
    } else {
      if (!villager.isPathing) {
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
            while (block !== void 0 && block.isAir) {
              block = block.belowSafe();
            }
            while (block !== void 0 && !block.isAir) {
              block = block.aboveSafe();
            }
            if (block !== void 0) {
              if (village.pathNodes[vectorToString(block)]) {
                villager.pathFindTo(block.location);
                villager.taskProgress = randomInt(20, 200);
              }
            }
          }
        }
      }
    }
    if (villager.currentTask === void 0) {
      villager.nameTag = "Idle";
    }
    if (villager.isPathing && villager.typeId === "tektopia:lumberjack" && system3.currentTick % 20 === 0) {
      const minVector = addVectors(villagerLocation, { x: -2, y: -1, z: -2 });
      const maxVector = addVectors(villagerLocation, { x: 2, y: 2, z: 2 });
      const blocksToUpdate = [];
      const checkedBlocks = /* @__PURE__ */ new Set();
      for (let x = minVector.x; x <= maxVector.x; x++) {
        for (let y = minVector.y; y <= maxVector.y; y++) {
          for (let z = minVector.z; z <= maxVector.z; z++) {
            const block = dimension.getBlockSafe({ x, y, z });
            if (!block) {
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
  tickChop(village) {
    const villager = this;
    const dimension = villager.dimension;
    const foundTree = villager.foundTree;
    if (foundTree !== void 0) {
      const treeBlock = dimension.getBlockSafe(foundTree);
      if (treeBlock !== void 0 && blockIsTree(treeBlock)) {
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
          if (villager.taskProgress > 100 && !villager.waiting) {
            const saplingTypeId = treeBlock.typeId.replace(
              "_log",
              "_sapling"
            );
            villager.waiting = true;
            villager.animation = void 0;
            destroyTree(treeBlock, function() {
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
    if (foundItem !== void 0 && foundItem.isValid) {
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
        this.holdingItem ? `replaceitem entity @s slot.weapon.offhand 0 ${this.holdingItem}` : "replaceitem entity @s slot.weapon.offhand 0 air"
      );
    }
  }
};
World2.prototype.getVillager = function(entityId) {
  return Villager.fromId(entityId);
};
var globalTasks = [
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
      const y = 0;
      for (let x = -1; x <= 1; x++) {
        for (let z = -1; z <= 1; z++) {
          checkLogBlocks.push(startingBlock.offsetSafe({ x, y, z }));
        }
      }
      const checkLeafBlocks = [];
      let logChecks = 0;
      while (true) {
        currentBlock = currentBlock.aboveSafe();
        if (currentBlock === void 0 || currentBlock.typeId !== logTypeId) {
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
            checkLogBlocks.push(currentBlock.offsetSafe({ x, y, z }));
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
          for (let y2 = 0; y2 <= 1; y2++) {
            for (let z = -1; z <= 1; z++) {
              checkLogBlocks.push(checkBlock.offsetSafe({ x, y: y2, z }));
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
              if (!block) {
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
        if (!closestLogLocation) {
          continue;
        }
        if (!logBlockLocations.some(
          (loc) => areVectorsEqual(closestLogLocation, loc)
        )) {
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
        for (let j = 0; j < updateBlockList.length; j++) {
          const block2 = updateBlockList[j];
          if (block2 === void 0) {
            continue;
          }
          const list = [block2, block2.aboveSafe()];
          for (let k = 0; k < list.length; k++) {
            const block3 = list[k];
            if (block3 === void 0) {
              continue;
            }
            const blockString = vectorToString(block3);
            if (!checkedBlocks.has(blockString)) {
              checkedBlocks.add(blockString);
              blocksToUpdate.push(block3, block3.aboveSafe());
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
var tektopiaVillagers = {
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
export {
  Villager
};
//# sourceMappingURL=villager.js.map
