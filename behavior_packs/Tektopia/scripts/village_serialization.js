// src/utils.ts
import {
  StructureRotation
} from "@minecraft/server";
function vectorToString(vector) {
  return `${vector.x},${vector.y},${vector.z}`;
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
    SAVE_RESOURCE_LOCATIONS ? packLocations(data.harvestLocations, origin) : "",
    SAVE_RESOURCE_LOCATIONS ? packLocations(data.sweetBerryLocations, origin) : "",
    packPoints(nodeEntries.map((entry) => entry.location), origin),
    packUnsigned(palette),
    packUnsigned(maskIndices),
    nodeRequirements
  ];
}
function decompressVillage(compressed) {
  const [
    dimensionId,
    centerCoords,
    doorOffset,
    packedSugarCaneLocations,
    packedSaplingLocations,
    packedFarmLocations,
    packedTreeLocations,
    packedHarvestLocations,
    packedSweetBerryLocations,
    packedNodeLocations,
    packedMaskPalette,
    packedMaskIndices,
    compressedRequirements
  ] = compressed;
  const center = { x: centerCoords[0], y: centerCoords[1], z: centerCoords[2] };
  const origin = originOf(center);
  const nodePoints = unpackPoints(packedNodeLocations, origin);
  const nodeKeys = nodePoints.map((point) => vectorToString(point));
  const pathNodes = {};
  for (const key of nodeKeys) {
    pathNodes[key] = { neighbors: [] };
  }
  const maskPalette = unpackUnsigned(packedMaskPalette);
  const maskPaletteIndices = unpackUnsigned(packedMaskIndices);
  for (let nodeIndex = 0; nodeIndex < nodePoints.length; nodeIndex++) {
    const neighborMask = maskPalette[maskPaletteIndices[nodeIndex]];
    if (neighborMask === void 0) {
      continue;
    }
    const currentKey = nodeKeys[nodeIndex];
    const currentNode = pathNodes[currentKey];
    if (currentNode === void 0) {
      continue;
    }
    for (let bitIndex = 0; bitIndex < 13; bitIndex++) {
      if ((neighborMask & 1 << bitIndex) === 0) {
        continue;
      }
      const neighborKey = offsetKey(
        nodePoints[nodeIndex],
        NEIGHBOR_OFFSETS[FORWARD_START + bitIndex]
      );
      const neighborNode = pathNodes[neighborKey];
      if (neighborNode === void 0) {
        continue;
      }
      currentNode.neighbors.push(neighborKey);
      neighborNode.neighbors.push(currentKey);
    }
  }
  for (const [whiteListFlag, requiredTypes, packedIndexDeltas] of compressedRequirements) {
    const indexDeltas = unpackUnsigned(packedIndexDeltas);
    let nodeIndex = 0;
    for (const delta of indexDeltas) {
      nodeIndex += delta;
      const node = pathNodes[nodeKeys[nodeIndex]];
      if (node !== void 0) {
        node.requirement = {
          whiteList: whiteListFlag === 1,
          types: requiredTypes.slice()
        };
      }
    }
  }
  return {
    dimensionId: dimensionId.includes(":") ? dimensionId : NAMESPACE + dimensionId,
    center,
    doorLocation: {
      x: doorOffset[0] + origin.x,
      y: doorOffset[1] + origin.y,
      z: doorOffset[2] + origin.z
    },
    pathNodes,
    sugarCaneLocations: unpackLocations(packedSugarCaneLocations, origin),
    saplingLocations: unpackLocations(packedSaplingLocations, origin),
    farmLocations: unpackLocations(packedFarmLocations, origin),
    treeLocations: unpackLocations(packedTreeLocations, origin),
    harvestLocations: unpackLocations(packedHarvestLocations, origin),
    sweetBerryLocations: unpackLocations(packedSweetBerryLocations, origin)
  };
}
export {
  compressVillage,
  decompressVillage
};
//# sourceMappingURL=village_serialization.js.map
