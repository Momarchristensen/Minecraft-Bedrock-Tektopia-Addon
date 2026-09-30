// src/debug.ts
import {
  MolangVariableMap,
  system,
  world
} from "@minecraft/server";

// src/utils.ts
import {
  StructureRotation
} from "@minecraft/server";
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
  if (typeof axises === "string") {
    axises = axises.split("");
  }
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

// src/debug.ts
function _tickDrawDebug() {
  system.runJob(drawDebug(_tickDrawDebug));
}
system.run(_tickDrawDebug);
function* drawDebug(callback) {
  try {
    if (!world.loadedData) {
      callback();
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
              if (color === void 0) {
                color = {
                  red: 122 / 255,
                  green: 122 / 255,
                  blue: 122 / 255
                };
              }
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
  if (!requirement?.types?.length) {
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
    let hash2 = 0;
    for (let i = 0; i < str.length; i++) {
      hash2 = hash2 * 31 + str.charCodeAt(i) | 0;
    }
    return hash2 >>> 0;
  }
}
function testLag() {
  if (world.lagTime === void 0) {
    world.lagTime = Date.now();
  } else {
    console.warn(Date.now() - world.lagTime);
    world.lagTime = void 0;
  }
}
export {
  testLag
};
//# sourceMappingURL=debug.js.map
