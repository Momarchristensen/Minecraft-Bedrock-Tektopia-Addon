import {
    Entity,
    World
} from "@minecraft/server"

import { Registry } from "./registry"
import { Villager } from "./villager"

const originalFunctions = {
    getEntity: World.prototype.getEntity
}

World.prototype.getVillagers = function () {
    return this.getEntities().filter(entity =>
        Registry.villagerTypes.includes(entity.typeId)
    ).map(entity => Villager.fromEntity(entity))
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
