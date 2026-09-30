import {
    Entity,
    GameMode,
    Player,
    system,
    System,
    world,
    World
} from "@minecraft/server"

import { snap } from "./utils"

function getGetter<T extends object, K extends keyof T>(prototype: T, property: K) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, property)

    if (descriptor?.get === undefined) {
        throw new Error(`Getter "${String(property)}" not found`)
    }

    return descriptor.get
}

function getSetter<T extends object, K extends keyof T>(prototype: T, property: K) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, property)

    if (descriptor?.set === undefined) {
        throw new Error(`Setter "${String(property)}" not found`)
    }

    return descriptor.set
}

const originalFunctions = {
    worldGetDimension: World.prototype.getDimension,
    getAllPlayers: World.prototype.getAllPlayers,

    getName: getGetter(Player.prototype, "name"),
    getGameMode: Player.prototype.getGameMode,
    getCommandPermissionLevel: getGetter(
        Player.prototype,
        "commandPermissionLevel"
    ),
    setCommandPermissionLevel: getSetter(
        Player.prototype,
        "commandPermissionLevel"
    ),

    setGameMode: Player.prototype.setGameMode,

    getCurrentTick: getGetter(System.prototype, "currentTick"),

    getLocation: getGetter(Entity.prototype, "location"),
    teleport: Entity.prototype.teleport,
    getPing: Player.prototype.getPing,
    getDimension: getGetter(Entity.prototype, "dimension")
}

const dimensionCache = new Map()
World.prototype.getDimension = function (dimensionId) {
    if (!dimensionCache.has(dimensionId)) {
        const dimension = originalFunctions.worldGetDimension.call(this, dimensionId)
        dimensionCache.set(dimensionId, dimension)
    }
    return dimensionCache.get(dimensionId)
}

const entityCacheMap = new Map()

function getEntityCache(entity: Entity) {
    let entityCache = entityCacheMap.get(entity.id)
    if (entityCache === undefined) {
        entityCache = {}
        entityCacheMap.set(entity.id, entityCache)
    }
    return entityCache
}

function getEntityTickCache(entity: Entity) {
    const cache = getEntityCache(entity)

    const currentTick = system.currentTick

    if (cache.tickCache?.tick === currentTick) {
        return cache.tickCache.data
    }

    cache.tickCache = {
        tick: currentTick,
        data: {}
    }

    return cache.tickCache.data
}

Player.prototype.getPing = function () {
    const cache = getEntityCache(this)

    const currentTick = system.currentTick

    if (cache.pingCache?.tick !== undefined && currentTick - cache.pingCache.tick < 20) {
        return cache.pingCache.value
    }

    const ping = originalFunctions.getPing.call(this)

    cache.pingCache = {
        tick: currentTick,
        value: ping
    }

    return ping
}

Object.defineProperty(Player.prototype, "name", {
    get() {
        const playerCache = getEntityCache(this)

        if (playerCache.name !== undefined) {
            return playerCache.name
        }

        const name = originalFunctions.getName.call(this)
        playerCache.name = name
        return name
    }
})

Object.defineProperty(Player.prototype, "commandPermissionLevel", {
    /**
     * @this {Player}
     */
    get() {
        const playerCache = getEntityCache(this)

        if (playerCache.commandPermissionLevel !== undefined) {
            return playerCache.commandPermissionLevel
        }

        const value = originalFunctions.getCommandPermissionLevel.call(this)
        playerCache.commandPermissionLevel = value
        return value
    },

    /**
     * @this {Player}
     */
    set(permissionLevel) {
        const playerCache = getEntityCache(this)

        if (playerCache.commandPermissionLevel !== permissionLevel) {
            playerCache.commandPermissionLevel = permissionLevel
            originalFunctions.setCommandPermissionLevel.call(this, permissionLevel)
        }
    }
})

Object.defineProperty(Entity.prototype, "dimension", {
    /**
     * @this {Entity}
     */
    get() {
        const entityCache = this instanceof Player ? getEntityCache(this) : getEntityTickCache(this)

        if (entityCache.dimension !== undefined) {
            return entityCache.dimension
        }

        const dimension = originalFunctions.getDimension.call(this)
        entityCache.dimension = dimension

        return dimension
    }
})

world.afterEvents.playerDimensionChange.subscribe(event => {
    const player = event.player
    const toDimension = event.toDimension
    const toLocation = event.toLocation

    const playerTickCache = getEntityTickCache(player)
    playerTickCache.location = toLocation

    const playerCache = getEntityCache(player)
    playerCache.dimension = toDimension
})

Object.defineProperty(Entity.prototype, "location", {
    /**@this {Entity} */
    get() {
        const playerTickCache = getEntityTickCache(this)

        if (playerTickCache.location !== undefined) {
            return playerTickCache.location
        }

        const location = originalFunctions.getLocation.call(this)
        location.y = snap(location.y, 1)
        playerTickCache.location = location
        return location
    }
})

Entity.prototype.teleport = function (location, teleportOptions) {
    const entityTickCache = getEntityTickCache(this)
    entityTickCache.location = location

    const entityCache = getEntityCache(this)
    if (teleportOptions?.dimension !== undefined) {
        if (this instanceof Player) {
            entityCache.dimension = teleportOptions.dimension
        }
        else {
            entityTickCache.dimension = teleportOptions.dimension
        }
    }

    return originalFunctions.teleport.call(this, location, teleportOptions)
}

world.afterEvents.playerGameModeChange.subscribe(event => {
    const playerCache = getEntityCache(event.player)
    playerCache.gameMode = event.toGameMode
})

Player.prototype.getGameMode = function () {
    const playerCache = getEntityCache(this)

    if (playerCache.gameMode !== undefined) {
        return playerCache.gameMode
    }

    const gameMode = originalFunctions.getGameMode.call(this)
    playerCache.gameMode = gameMode
    return gameMode
}

Player.prototype.setGameMode = function (gameMode) {
    if (gameMode === undefined || !(gameMode in GameMode)) {
        throw new TypeError(`Invalid game mode: ${gameMode}`)
    }

    const playerCache = getEntityCache(this)

    if (playerCache.gameMode !== gameMode) {
        playerCache.gameMode = gameMode
        originalFunctions.setGameMode.call(this, gameMode)
    }
}

world.afterEvents.playerLeave.subscribe(event => {
    entityCacheMap.delete(event.playerId)
})

let currentTick = originalFunctions.getCurrentTick.call(system)

system.runInterval(() => {
    currentTick++
})

Object.defineProperty(System.prototype, "currentTick", {
    /**
     * @this {System}
     */
    get() {
        return currentTick
    }
})

/**
 * @type {Map<string, Player>}
 */
const playersCache = new Map()

World.prototype.getAllPlayers = function () {
    return Array.from(playersCache.values())
}

World.prototype.getPlayerById = function (playerId) {
    return playersCache.get(playerId)
}

world.afterEvents.playerSpawn.subscribe(event => {
    const player = event.player

    playersCache.set(player.id, player)
})

world.beforeEvents.playerLeave.subscribe(event => {
    const player = event.player

    playersCache.delete(player.id)
})

world.afterEvents.entityRemove.subscribe(event => {
    const entityId = event.removedEntityId

    playersCache.delete(entityId)
})

Player.prototype.resetCache = function () {
    playersCache.delete(this.id)
}

world.afterEvents.worldLoad.subscribe(() => {
    const players = originalFunctions.getAllPlayers.call(world)

    for (const player of players) {

        playersCache.set(player.id, player)
    }
})
