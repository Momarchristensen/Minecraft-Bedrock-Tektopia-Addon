import {
    Block,
    Dimension,
    Entity,
    EntityComponentTypes,
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

let currentTick: number = system.currentTick
system.runInterval(() => {
    currentTick++
}, 1)

Object.defineProperty(system, "currentTick", {
    get: () => currentTick,
    configurable: true
})

const originalFunctions = {
    worldGetDimension: World.prototype.getDimension,
    worldGetEntity: World.prototype.getEntity,

    getLocation: getGetter(Entity.prototype, "location"),
    teleport: Entity.prototype.teleport,
    getDimension: getGetter(Entity.prototype, "dimension"),

    getBlockTypeId: getGetter(Block.prototype, "typeId"),
    getBlockIsAir: getGetter(Block.prototype, "isAir"),
    blockSetType: Block.prototype.setType,
    blockSetPermutation: Block.prototype.setPermutation,

    dimensionSetBlockType: Dimension.prototype.setBlockType,
    dimensionSetBlockPermutation: Dimension.prototype.setBlockPermutation
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

const entityValidatedTick = new Map<string, number>()

const DIMENSION_CACHE_TICKS = 5
const entityDimensionCache = new Map<string, { tick: number, dimension: Dimension }>()

World.prototype.getEntity = function (id) {
    const cached = entityByIdCache.get(id)

    if (cached !== undefined) {
        if (entityValidatedTick.get(id) === currentTick || cached.isValid) {
            entityValidatedTick.set(id, currentTick)
            return cached
        }
        entityByIdCache.delete(id)
        entityValidatedTick.delete(id)
    }

    const entity = originalFunctions.worldGetEntity.call(this, id)

    if (entity !== undefined) {
        entityByIdCache.set(id, entity)
        entityValidatedTick.set(id, currentTick)
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
    entityValidatedTick.delete(entityId)
    tickCacheMap.delete(entityId)
    entityDimensionCache.delete(entityId)
})

function getEntityTickCache(entity: Entity) {
    let cache = tickCacheMap.get(entity.id)

    if (cache?.tick === currentTick) {
        return cache.data
    }

    cache = { tick: currentTick, data: {} }
    tickCacheMap.set(entity.id, cache)

    return cache.data
}

Object.defineProperty(Entity.prototype, "dimension", {
    get(this: Entity) {
        if (this instanceof Player) {
            return originalFunctions.getDimension.call(this)
        }

        const cached = entityDimensionCache.get(this.id)

        if (cached !== undefined && currentTick - cached.tick < DIMENSION_CACHE_TICKS) {
            return cached.dimension
        }

        const dimension = originalFunctions.getDimension.call(this)
        entityDimensionCache.set(this.id, { tick: currentTick, dimension })

        return dimension
    }
})

Object.defineProperty(Entity.prototype, "location", {
    get(this: Entity) {
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
    const result = originalFunctions.teleport.call(this, location, teleportOptions)

    if (!(this instanceof Player)) {
        getEntityTickCache(this).location = { x: location.x, y: snap(location.y, 1), z: location.z }

        if (teleportOptions?.dimension !== undefined) {
            entityDimensionCache.set(this.id, {
                tick: currentTick,
                dimension: teleportOptions.dimension
            })
        }
    }

    return result
}

const AIR_TYPE_IDS = new Set([
    "minecraft:air",
    "minecraft:cave_air",
    "minecraft:void_air"
])

const blockTypeIdCache = new Map<string, string>()
const blockIsAirCache = new Map<string, boolean>()
let blockCacheTick = -1

function refreshBlockCaches() {
    if (blockCacheTick !== currentTick) {
        blockTypeIdCache.clear()
        blockIsAirCache.clear()
        blockCacheTick = currentTick
    }
}

const dimensionIdCache = new WeakMap<Dimension, string>()

function getDimensionId(dimension: Dimension): string {
    let id = dimensionIdCache.get(dimension)

    if (id === undefined) {
        id = dimension.id
        dimensionIdCache.set(dimension, id)
    }

    return id
}

function makeBlockKey(dimensionId: string, x: number, y: number, z: number): string {
    return `${dimensionId}|${x},${y},${z}`
}

Block.prototype.getKey = function () {
    return makeBlockKey(getDimensionId(this.dimension), this.x, this.y, this.z)
}

function dimensionLocationKey(dimension: Dimension, location: Vector3): string {
    return makeBlockKey(
        getDimensionId(dimension),
        Math.floor(location.x),
        Math.floor(location.y),
        Math.floor(location.z)
    )
}

function invalidateBlockKey(key: string) {
    blockTypeIdCache.delete(key)
    blockIsAirCache.delete(key)
}

Object.defineProperty(Block.prototype, "typeId", {
    get(this: Block) {
        refreshBlockCaches()

        const key = this.getKey()
        const cached = blockTypeIdCache.get(key)

        if (cached !== undefined) {
            return cached
        }

        const typeId: string = originalFunctions.getBlockTypeId.call(this)
        blockTypeIdCache.set(key, typeId)

        return typeId
    },
    configurable: true
})

Object.defineProperty(Block.prototype, "isAir", {
    get(this: Block) {
        refreshBlockCaches()

        const key = this.getKey()
        const cached = blockIsAirCache.get(key)

        if (cached !== undefined) {
            return cached
        }

        let isAir: boolean

        const cachedType = blockTypeIdCache.get(key)

        if (cachedType !== undefined) {
            isAir = AIR_TYPE_IDS.has(cachedType)
        }
        else {
            isAir = originalFunctions.getBlockIsAir.call(this)
        }

        blockIsAirCache.set(key, isAir)

        return isAir
    },
    configurable: true
})

Block.prototype.setType = function (blockType) {
    const key = this.getKey()
    const result = originalFunctions.blockSetType.call(this, blockType)
    invalidateBlockKey(key)
    return result
}

Block.prototype.setPermutation = function (permutation) {
    const key = this.getKey()
    const result = originalFunctions.blockSetPermutation.call(this, permutation)
    invalidateBlockKey(key)
    return result
}

Dimension.prototype.setBlockType = function (location, blockType) {
    const result = originalFunctions.dimensionSetBlockType.call(this, location, blockType)
    invalidateBlockKey(dimensionLocationKey(this, location))
    return result
}

Dimension.prototype.setBlockPermutation = function (location, permutation) {
    const result = originalFunctions.dimensionSetBlockPermutation.call(this, location, permutation)
    invalidateBlockKey(dimensionLocationKey(this, location))
    return result
}

Entity.prototype.getHitbox = function () {
    const { center, extent } = this.getAABB()

    return {
        start: {
            x: center.x - extent.x,
            y: center.y - extent.y,
            z: center.z - extent.z
        },
        end: {
            x: center.x + extent.x,
            y: center.y + extent.y,
            z: center.z + extent.z
        }
    }
}

const entityHitBoxSizeCache = new Map<string, { width: number, height: number }>()

Entity.prototype.getHitboxSize = function () {
    const cacheKey = `${this.typeId}${this.hasComponent(EntityComponentTypes.IsBaby)}`

    const cachedSize = entityHitBoxSizeCache.get(cacheKey)
    if (cachedSize !== undefined) {
        return cachedSize
    }

    const { extent } = this.getAABB()

    const size = {
        width: extent.x * 2,
        height: extent.y * 2
    }
    entityHitBoxSizeCache.set(cacheKey, size)

    return size
}
