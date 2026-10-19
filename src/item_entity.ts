import {
    Dimension,
    EntityItemComponent,
    system,
    world
} from "@minecraft/server"

system.runInterval(() => {
    const entities = world.getEntities({ type: "item" })
    for (const entity of entities) {
        if (entity.pickupDelay !== undefined && entity.pickupDelay > 0) {
            entity.pickupDelay--
            entity.saveData("pickupDelay")
        }
    }
})

Dimension.prototype.dropItem = function (itemStack, location, pickupDelay = 40) {
    const itemEntity = this.spawnItem(itemStack, location)
    itemEntity.pickupDelay = pickupDelay
    itemEntity.saveData("pickupDelay")
    return itemEntity
}

EntityItemComponent.prototype.setType = function (typeId, pickupDelay = 40) {
    const itemEntity = this.entity
    const item = this.itemStack

    const newItem = itemEntity.dimension.dropItem(item.setType(typeId), itemEntity.location, pickupDelay)
    newItem.clearVelocity()
    newItem.applyImpulse(itemEntity.getVelocity())

    itemEntity.remove()

    return newItem
}

world.beforeEvents.entityItemPickup.subscribe(event => {
    const itemEntity = event.item
    if (itemEntity.pickupDelay !== undefined && itemEntity.pickupDelay > 0) {
        event.cancel = true
    }
})
