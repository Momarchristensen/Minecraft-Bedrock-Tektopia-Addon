import {
    Entity,
    Player,
    system,
    type Vector3,
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

const originalFunctions = {
    worldGetDimension: World.prototype.getDimension,
    worldGetEntity: World.prototype.getEntity,

    getLocation: getGetter(Entity.prototype, "location"),
    teleport: Entity.prototype.teleport,
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

const entityByIdCache = new Map<string, Entity>()

World.prototype.getEntity = function (id) {
    const cached = entityByIdCache.get(id)

    if (cached !== undefined) {
        if (cached.isValid) {
            return cached
        }
        entityByIdCache.delete(id)
    }

    const entity = originalFunctions.worldGetEntity.call(this, id)

    if (entity !== undefined) {
        entityByIdCache.set(id, entity)
    }

    return entity
}

export function getLocationUncached(entity: Entity): Vector3 {
    const location = originalFunctions.getLocation.call(entity)
    location.y = snap(location.y, 1)
    return location
}

const tickCacheMap = new Map<string, { tick: number, data: any }>()

world.afterEvents.entityRemove.subscribe(event => {
    const entityId = event.removedEntityId

    entityByIdCache.delete(entityId)
    tickCacheMap.delete(entityId)
})

function getEntityTickCache(entity: Entity) {
    const currentTick = system.currentTick

    let cache = tickCacheMap.get(entity.id)

    if (cache?.tick === currentTick) {
        return cache.data
    }

    cache = { tick: currentTick, data: {} }
    tickCacheMap.set(entity.id, cache)

    return cache.data
}

Object.defineProperty(Entity.prototype, "dimension", {
    /**
     * @this {Entity}
     */
    get() {
        if (this instanceof Player) {
            return originalFunctions.getDimension.call(this)
        }

        const tickCache = getEntityTickCache(this)

        if (tickCache.dimension !== undefined) {
            return tickCache.dimension
        }

        const dimension = originalFunctions.getDimension.call(this)
        tickCache.dimension = dimension

        return dimension
    }
})

Object.defineProperty(Entity.prototype, "location", {
    /**@this {Entity} */
    get() {
        if (this instanceof Player) {
            const location = originalFunctions.getLocation.call(this)
            location.y = snap(location.y, 1)
            return location
        }

        const tickCache = getEntityTickCache(this)

        if (tickCache.location !== undefined) {
            return tickCache.location
        }

        const location = originalFunctions.getLocation.call(this)
        location.y = snap(location.y, 1)
        tickCache.location = location
        return location
    }
})

Entity.prototype.teleport = function (location, teleportOptions) {
    if (!(this instanceof Player)) {
        const tickCache = getEntityTickCache(this)
        tickCache.location = location

        if (teleportOptions?.dimension !== undefined) {
            tickCache.dimension = teleportOptions.dimension
        }
    }

    return originalFunctions.teleport.call(this, location, teleportOptions)
}
