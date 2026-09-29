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
function snap(value, target, epsilon = 1e-6) {
  return Math.abs(value - target) < epsilon ? target : value;
}
var init_utils = __esm({
  "src/utils.ts"() {
    "use strict";
  }
});

// src/cache.ts
import {
  Entity,
  GameMode,
  Player,
  system,
  System,
  world,
  World
} from "@minecraft/server";
var require_cache = __commonJS({
  "src/cache.ts"() {
    init_utils();
    var originalFunctions = {
      "worldGetDimension": World.prototype.getDimension,
      "getAllPlayers": World.prototype.getAllPlayers,
      "getName": Object.getOwnPropertyDescriptor(Player.prototype, "name").get,
      "getGameMode": Player.prototype.getGameMode,
      "getCommandPermissionLevel": Object.getOwnPropertyDescriptor(Player.prototype, "commandPermissionLevel").get,
      "setCommandPermissionLevel": Object.getOwnPropertyDescriptor(Player.prototype, "commandPermissionLevel").set,
      "setGameMode": Player.prototype.setGameMode,
      "getCurrentTick": Object.getOwnPropertyDescriptor(System.prototype, "currentTick").get,
      "getLocation": Object.getOwnPropertyDescriptor(Entity.prototype, "location").get,
      "teleport": Entity.prototype.teleport,
      "getPing": Player.prototype.getPing,
      "getDimension": Object.getOwnPropertyDescriptor(Entity.prototype, "dimension").get
    };
    var dimensionCache = /* @__PURE__ */ new Map();
    World.prototype.getDimension = function(dimensionId) {
      if (!dimensionCache.has(dimensionId)) {
        const dimension = originalFunctions["worldGetDimension"].call(this, dimensionId);
        dimensionCache.set(dimensionId, dimension);
      }
      return dimensionCache.get(dimensionId);
    };
    var entityCacheMap = /* @__PURE__ */ new Map();
    function getEntityCache(entity) {
      let entityCache = entityCacheMap.get(entity.id);
      if (entityCache === void 0) {
        entityCache = {};
        entityCacheMap.set(entity.id, entityCache);
      }
      return entityCache;
    }
    function getEntityTickCache(entity) {
      const cache = getEntityCache(entity);
      const currentTick2 = system.currentTick;
      if (cache.tickCache?.tick === currentTick2) {
        return cache.tickCache.data;
      }
      cache.tickCache = {
        tick: currentTick2,
        data: {}
      };
      return cache.tickCache.data;
    }
    Player.prototype.getPing = function() {
      const cache = getEntityCache(this);
      const currentTick2 = system.currentTick;
      if (cache.pingCache?.tick !== void 0 && currentTick2 - cache.pingCache.tick < 20) {
        return cache.pingCache.value;
      }
      const ping = originalFunctions.getPing.call(this);
      cache.pingCache = {
        tick: currentTick2,
        value: ping
      };
      return ping;
    };
    Object.defineProperty(Player.prototype, "name", {
      get() {
        const playerCache = getEntityCache(this);
        if (playerCache.name !== void 0) {
          return playerCache.name;
        }
        const name = originalFunctions.getName.call(this);
        playerCache.name = name;
        return name;
      }
    });
    Object.defineProperty(Player.prototype, "commandPermissionLevel", {
      /**
       * @this {Player}
       */
      get() {
        const playerCache = getEntityCache(this);
        if (playerCache.commandPermissionLevel !== void 0) {
          return playerCache.commandPermissionLevel;
        }
        const value = originalFunctions.getCommandPermissionLevel.call(this);
        playerCache.commandPermissionLevel = value;
        return value;
      },
      /**
       * @this {Player}
       */
      set(permissionLevel) {
        const playerCache = getEntityCache(this);
        if (playerCache.commandPermissionLevel !== permissionLevel) {
          playerCache.commandPermissionLevel = permissionLevel;
          originalFunctions.setCommandPermissionLevel.call(this, permissionLevel);
        }
      }
    });
    Object.defineProperty(Entity.prototype, "dimension", {
      /**
       * @this {Entity}
       */
      get() {
        const entityCache = this instanceof Player ? getEntityCache(this) : getEntityTickCache(this);
        if (entityCache.dimension !== void 0) {
          return entityCache.dimension;
        }
        const dimension = originalFunctions["getDimension"].call(this);
        entityCache.dimension = dimension;
        return dimension;
      }
    });
    world.afterEvents.playerDimensionChange.subscribe((event) => {
      const player = event.player;
      const toDimension = event.toDimension;
      const toLocation = event.toLocation;
      const playerTickCache = getEntityTickCache(player);
      playerTickCache.location = toLocation;
      const playerCache = getEntityCache(player);
      playerCache.dimension = toDimension;
    });
    Object.defineProperty(Entity.prototype, "location", {
      /**@this {Entity} */
      get() {
        const playerTickCache = getEntityTickCache(this);
        if (playerTickCache.location !== void 0) {
          return playerTickCache.location;
        }
        const location = originalFunctions["getLocation"].call(this);
        location.y = snap(location.y, 1);
        playerTickCache.location = location;
        return location;
      }
    });
    Entity.prototype.teleport = function(location, teleportOptions) {
      const entityTickCache = getEntityTickCache(this);
      entityTickCache.location = location;
      const entityCache = getEntityCache(this);
      if (teleportOptions?.dimension !== void 0) {
        if (this instanceof Player) {
          entityCache.dimension = teleportOptions.dimension;
        } else {
          entityTickCache.dimension = teleportOptions.dimension;
        }
      }
      return originalFunctions.teleport.call(this, location, teleportOptions);
    };
    world.afterEvents.playerGameModeChange.subscribe((event) => {
      const playerCache = getEntityCache(event.player);
      playerCache.gameMode = event.toGameMode;
    });
    Player.prototype.getGameMode = function() {
      const playerCache = getEntityCache(this);
      if (playerCache.gameMode !== void 0) {
        return playerCache.gameMode;
      }
      const gameMode = originalFunctions.getGameMode.call(this);
      playerCache.gameMode = gameMode;
      return gameMode;
    };
    Player.prototype.setGameMode = function(gameMode) {
      if (gameMode === void 0 || !(gameMode in GameMode)) {
        throw new TypeError(`Invalid game mode: ${gameMode}`);
      }
      const playerCache = getEntityCache(this);
      if (playerCache.gameMode !== gameMode) {
        playerCache.gameMode = gameMode;
        originalFunctions.setGameMode.call(this, gameMode);
      }
    };
    world.afterEvents.playerLeave.subscribe((event) => {
      entityCacheMap.delete(event.playerId);
    });
    var currentTick = originalFunctions["getCurrentTick"].call(system);
    system.runInterval(() => {
      currentTick++;
    });
    Object.defineProperty(System.prototype, "currentTick", {
      /**
       * @this {System}
       */
      get() {
        return currentTick;
      }
    });
    World.prototype.getAllPlayers = function() {
      return Array.from(playersCache.values());
    };
    World.prototype.getPlayerById = function(playerId) {
      return playersCache.get(playerId);
    };
    var playersCache = /* @__PURE__ */ new Map();
    world.afterEvents.playerSpawn.subscribe((event) => {
      const player = event.player;
      playersCache.set(player.id, player);
    });
    world.beforeEvents.playerLeave.subscribe((event) => {
      const player = event.player;
      playersCache.delete(player.id);
    });
    world.afterEvents.entityRemove.subscribe((event) => {
      const entityId = event.removedEntityId;
      playersCache.delete(entityId);
    });
    Player.prototype.resetCache = function() {
      playersCache.delete(this.id);
    };
    world.afterEvents.worldLoad.subscribe(() => {
      const players = originalFunctions["getAllPlayers"].call(world);
      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        playersCache.set(player.id, player);
      }
    });
  }
});
export default require_cache();
//# sourceMappingURL=cache.js.map
