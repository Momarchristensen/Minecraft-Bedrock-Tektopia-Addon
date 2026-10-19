import {
    ItemComponentTypes,
    ItemStack
} from "@minecraft/server"

import { arraysAreEqual } from "./utils"

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

ItemStack.prototype.matchesFilter = function (itemFilter) {
    if (itemFilter === undefined) {
        return true
    }

    const {
        includesTypes: includesType,
        excludesTypes: excludesType,
        isVillagerItem
    } = itemFilter

    if (includesType !== undefined && !includesType.includes(this.typeId)) {
        return false
    }

    if (excludesType?.includes(this.typeId)) {
        return false
    }

    if (isVillagerItem !== undefined && isVillagerItem !== this.isVillagerItem) {
        return false
    }

    return true
}

ItemStack.prototype.matchesItem = function (otherItem) {
    if (this.typeId !== otherItem.typeId) {
        return false
    }

    if (this.nameTag !== otherItem.nameTag) {
        return false
    }

    if (!arraysAreEqual(this.getLore(), otherItem.getLore(), true)) {
        return false
    }

    return true
}
