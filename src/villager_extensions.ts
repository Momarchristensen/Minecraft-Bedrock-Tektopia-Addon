import {
    Entity,
    system,
    World
} from "@minecraft/server"

import { Registry } from "./registry"

import { Villager } from "./villager"

const originalFunctions = {
    getEntity: World.prototype.getEntity
}

// villager_extensions.ts
let cachedTick = -1
let cachedVillagers: Villager[] = []

World.prototype.getVillagers = function () {
    const currentTick = system.currentTick
    if (currentTick === cachedTick) {
        return cachedVillagers
    }

    const result: Villager[] = []
    for (const dimensionId of Registry.dimensionTypes) {
        const dimension = this.getDimension(dimensionId)
        for (const typeId of Registry.villagerTypes) {
            for (const entity of dimension.getEntities({ type: typeId })) {
                result.push(Villager.fromEntity(entity))
            }
        }
    }

    cachedTick = currentTick
    cachedVillagers = result
    return result
}

World.prototype.getEntity = function (entityId: string) {
    const entity = originalFunctions.getEntity.call(this, entityId)
    if (entity?.isVillager) {
        return Villager.fromEntity(entity)
    }
    return entity
}

Object.defineProperty(Entity.prototype, "isVillager", {
    get(this: Entity) {
        return Registry.villagerTypes.includes(this.typeId)
    }
})
