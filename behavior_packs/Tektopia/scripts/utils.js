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
function fix(number, decimalPlaces = 0) {
  return Number(number.toFixed(decimalPlaces));
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
function rotationToStructureRotation(rotation) {
  if (rotation === "north") {
    return StructureRotation.None;
  } else if (rotation === "east") {
    return StructureRotation.Rotate90;
  } else if (rotation === "south") {
    return StructureRotation.Rotate180;
  } else if (rotation === "west") {
    return StructureRotation.Rotate270;
  }
  return void 0;
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
function directionToVector(direction) {
  switch (direction.toLowerCase()) {
    case "north":
      return { x: 0, y: 0, z: -1 };
    case "south":
      return { x: 0, y: 0, z: 1 };
    case "east":
      return { x: 1, y: 0, z: 0 };
    case "west":
      return { x: -1, y: 0, z: 0 };
    case "up":
      return { x: 0, y: 1, z: 0 };
    case "down":
      return { x: 0, y: -1, z: 0 };
  }
  return { x: 0, y: 0, z: 0 };
}
function getOppositeDirection(direction) {
  switch (direction.toLowerCase()) {
    case "north":
      return "south";
    case "south":
      return "north";
    case "east":
      return "west";
    case "west":
      return "east";
    case "up":
      return "down";
    case "down":
      return "up";
  }
  return void 0;
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
function splitString(input, chunkSize) {
  const length = input.length;
  const count = Math.ceil(length / chunkSize);
  const out = new Array(count);
  let offset = 0;
  for (let i = 0; i < count; ++i) {
    out[i] = input.slice(offset, offset + chunkSize);
    offset += chunkSize;
  }
  return out;
}
function calculateAverage(numbers) {
  if (numbers.length === 0) {
    return 0;
  }
  const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const average = sum / numbers.length;
  return average;
}
function removeIdentifier(string) {
  return string.includes(":") ? string.split(":")[1] : string;
}
function exclusiveValues(...lists) {
  const freq = /* @__PURE__ */ new Map();
  for (const lst of lists) {
    for (const val of new Set(lst)) {
      freq.set(val, (freq.get(val) ?? 0) + 1);
    }
  }
  const result = [];
  for (const [val, count] of freq) {
    if (count === 1) {
      result.push(val);
    }
  }
  return result;
}
function snap(value, target, epsilon = 1e-6) {
  return Math.abs(value - target) < epsilon ? target : value;
}
function arraysAreEqual(array1, array2, orderMatters = true) {
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    return false;
  }
  if (array1.length !== array2.length) {
    return false;
  }
  if (orderMatters) {
    return array1.every((value, index) => value === array2[index]);
  }
  return array1.every((value) => array2.includes(value));
}
function copy(object) {
  if (object === null || typeof object !== "object") {
    return object;
  }
  if (Array.isArray(object)) {
    return object.map(copy);
  }
  const result = {};
  for (const [key, value] of Object.entries(object)) {
    result[key] = copy(value);
  }
  return result;
}
export {
  addVector,
  addVectors,
  areVectorsEqual,
  arraysAreEqual,
  calculateAverage,
  calculateDistance,
  calculateSquareDistance,
  capitalizeEveryWord,
  ceilVector,
  centerVector,
  copy,
  directionToVector,
  exclusiveValues,
  fix,
  floorVector,
  formatTypeId,
  getOppositeDirection,
  isVectorBetween,
  maxVectors,
  minVectors,
  multiplyVector,
  randomInt,
  randomItem,
  removeIdentifier,
  rotationToStructureRotation,
  snap,
  splitString,
  stringToVector,
  subtractLists,
  subtractVectors,
  vectorToDirection,
  vectorToString
};
//# sourceMappingURL=utils.js.map
