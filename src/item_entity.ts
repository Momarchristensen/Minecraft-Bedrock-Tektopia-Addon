import {
    Dimension,
    EntityItemComponent,
    ItemComponentTypes,
    ItemStack,
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

ItemStack.prototype.setType = function (typeId) {
    if (this.typeId === typeId) {
        return this
    }
    const newItem = new ItemStack(typeId, this.amount)
    newItem.setLore(this.getLore())
    newItem.keepOnDeath = this.keepOnDeath
    newItem.lockMode = this.lockMode
    newItem.nameTag = this.nameTag
    newItem.setCanDestroy(this.getCanDestroy())
    newItem.setCanPlaceOn(this.getCanPlaceOn())

    const newItemDurabilityComponent = newItem.getComponent(ItemComponentTypes.Durability)
    const itemDurabilityComponent = this.getComponent(ItemComponentTypes.Durability)
    if (newItemDurabilityComponent !== undefined && itemDurabilityComponent !== undefined) {
        newItemDurabilityComponent.damage = itemDurabilityComponent.damage
        newItemDurabilityComponent.unbreakable = itemDurabilityComponent.unbreakable
    }

    const newItemEnchantableComponent = newItem.getComponent(ItemComponentTypes.Enchantable)
    const itemEnchantableComponent = this.getComponent(ItemComponentTypes.Enchantable)
    if (newItemEnchantableComponent !== undefined && itemEnchantableComponent !== undefined) {
        newItemEnchantableComponent.addEnchantments(itemEnchantableComponent.getEnchantments())
    }

    const newItemDyeableComponent = newItem.getComponent(ItemComponentTypes.Dyeable)
    const itemDyeableComponent = this.getComponent(ItemComponentTypes.Dyeable)
    if (newItemDyeableComponent !== undefined && itemDyeableComponent !== undefined) {
        newItemDyeableComponent.color = itemDyeableComponent.color
    }

    const newItemInventory = newItem.getComponent(ItemComponentTypes.Inventory)?.container
    const itemInventory = this.getComponent(ItemComponentTypes.Inventory)?.container
    if (newItemInventory !== undefined && itemInventory !== undefined) {
        const size = Math.min(newItemInventory.size, itemInventory.size)
        for (let slot = 0; slot < size; slot++) {
            newItemInventory.setItem(slot, itemInventory.getItem(slot))
        }
    }

    const newItemBookComponent = newItem.getComponent(ItemComponentTypes.Book)
    const itemBookComponent = this.getComponent(ItemComponentTypes.Book)
    if (newItemBookComponent !== undefined && itemBookComponent !== undefined) {
        newItemBookComponent.setContents(itemBookComponent.contents.filter(page => page !== undefined))
        if (!newItemBookComponent.isSigned && itemBookComponent.isSigned && itemBookComponent.title !== undefined && itemBookComponent.author !== undefined) {
            newItemBookComponent.signBook(itemBookComponent.title, itemBookComponent.author)
        }
    }

    return newItem
}

world.beforeEvents.entityItemPickup.subscribe(event => {
    const itemEntity = event.item
    if (itemEntity.pickupDelay !== undefined && itemEntity.pickupDelay > 0) {
        event.cancel = true
    }
})
