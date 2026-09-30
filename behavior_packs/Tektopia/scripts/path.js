// src/path.ts
import {
  Block,
  GameMode,
  Player,
  system,
  world
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
function calculateSquareDistance(v1, v2, ignoreY = false) {
  const dx = Math.abs(v1.x - v2.x);
  const dy = ignoreY ? 0 : Math.abs(v1.y - v2.y);
  const dz = Math.abs(v1.z - v2.z);
  return Math.max(dx, dy, dz);
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
function generatePath(entity, startLocation, targetLocation, token) {
  return new Promise((resolve) => {
    const village = entity.getVillage();
    if (!village) {
      resolve("no_village");
      return;
    }
    const villageBounds = village.bounds;
    const dimensionId = village.dimensionId;
    const dimension = world.getDimension(dimensionId);
    const nodeList = village.pathNodes;
    startLocation = floorVector(startLocation);
    targetLocation = floorVector(targetLocation);
    const endBlock = dimension.getBlockSafe(targetLocation);
    if (endBlock !== void 0 && !endBlock.isValidPath(villageBounds)) {
      const checkBlocks = [
        endBlock.northSafe(),
        endBlock.eastSafe(),
        endBlock.southSafe(),
        endBlock.westSafe()
      ];
      for (let i = 0; i < checkBlocks.length; i++) {
        const block = checkBlocks[i];
        if (block !== void 0 && block.isValidPath(villageBounds)) {
          targetLocation = block.location;
          break;
        }
      }
    }
    function heuristic(vector1, vector2) {
      return Math.abs(vector1.x - vector2.x) + Math.abs(vector1.y - vector2.y) + Math.abs(vector1.z - vector2.z);
    }
    system.runJob(safeTickGeneratePath());
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
  const VillagerClass = villager.constructor;
  const result = [];
  const entityList = pathCheckEntities[dimensionId] ?? [];
  for (let i = 0; i < entityList.length; i++) {
    const checkEntityObject = entityList[i];
    if (!checkEntityObject || checkEntityObject.id === villager.id) {
      continue;
    }
    const checkEntity = world.getEntity(checkEntityObject.id);
    if (!checkEntity) {
      continue;
    }
    result.push({
      ...checkEntityObject,
      isBlocked: checkEntity instanceof VillagerClass && (checkEntity.isBlocked || !checkEntity.isPathing)
    });
  }
  return result;
}
var pathCheckEntities = {};
system.runInterval(() => {
  for (let i = 0; i < Registry.dimensionTypes.length; i++) {
    const dimensionId = Registry.dimensionTypes[i];
    const dimension = world.getDimension(dimensionId);
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
world.afterEvents.playerInteractWithBlock.subscribe((event) => {
  const block = event.block;
  updatePathNodes(
    [block, block.aboveSafe(), block.belowSafe()].filter(
      (block2) => block2 !== void 0
    )
  );
});
world.afterEvents.playerPlaceBlock.subscribe((event) => {
  const block = event.block;
  updatePathNodes([block, block.aboveSafe(), block.belowSafe()].filter((block2) => block2 !== void 0));
});
world.afterEvents.playerBreakBlock.subscribe((event) => {
  const block = event.block;
  updatePathNodes(
    [block, block.aboveSafe(), block.belowSafe()].filter(
      (block2) => block2 !== void 0
    )
  );
});
world.afterEvents.explosion.subscribe((event) => {
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
  system.runJob(updateNodesBlocks(tickUpdateNodes));
}
system.run(tickUpdateNodes);
function* updateNodesBlocks(callback) {
  try {
    if (!world.loadedData) {
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
        const villageList = world.getVillages();
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
              if (village.pathNodes[neighborLocationString] && neighborBlock.isValidPath(villageBounds)) {
                system.runJob(village.searchBlocks(neighborBlock));
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
export {
  generatePath,
  getCheckPathEntities,
  updatePathNodes
};
//# sourceMappingURL=path.js.map
