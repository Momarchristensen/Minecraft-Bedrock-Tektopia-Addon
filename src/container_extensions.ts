import {
    Container,
    ContainerSlot,
    ItemStack
} from "@minecraft/server"

Container.prototype.getRoomFor = function (item) {
    let room = 0

    for (let slot = 0; slot < this.size; slot++) {
        const existing = this.getItem(slot)

        if (existing === undefined) {
            room += item.maxAmount
        }
        else if (existing.isStackableWith(item)) {
            room += existing.maxAmount - existing.amount
        }
    }

    return room
}

ContainerSlot.prototype.decreaseAmount = function (amount) {
    const item = this.getItem()
    if (item === undefined || amount <= 0) {
        return undefined
    }

    const removedAmount = Math.min(amount, item.amount)
    const removed = item.clone()
    removed.amount = removedAmount

    if (removedAmount >= item.amount) {
        this.setItem(undefined)
    }
    else {
        this.amount = item.amount - removedAmount
    }

    return { item: removed, amount: removedAmount }
}

Container.prototype.transferItemStack = function (fromSlot: number, toContainer: Container, amount: number) {
    const item = this.getItem(fromSlot)

    if (item === undefined) {
        return 0
    }

    const itemClone = item.clone()
    itemClone.amount = Math.min(amount, item.amount)

    const leftover = toContainer.addItem(itemClone)
    const moved = itemClone.amount - (leftover?.amount ?? 0)

    if (moved <= 0) {
        return 0
    }

    if (moved >= item.amount) {
        this.setItem(fromSlot, undefined)
    }
    else {
        item.amount -= moved
        this.setItem(fromSlot, item)
    }

    return moved
}

Container.prototype.removeItem = function (itemFilter, amount, cancelIfUnable = false) {
    return this.removeItems([{ itemFilter, amount }], cancelIfUnable)
}

Container.prototype.removeItems = function (requests, cancelIfUnable = false) {
    const remainingInSlot = new Map<number, number>()
    const items = new Map<number, ItemStack>()
    let allFulfilled = true

    for (const { itemFilter, amount } of requests) {
        let amountLeft = amount

        for (let slotIndex = 0; slotIndex < this.size && amountLeft > 0; slotIndex++) {
            let item = items.get(slotIndex)
            if (item === undefined) {
                item = this.getItem(slotIndex)
                if (item === undefined) {
                    continue
                }
                items.set(slotIndex, item)
                remainingInSlot.set(slotIndex, item.amount)
            }

            const remaining = remainingInSlot.get(slotIndex) ?? 0
            if (remaining <= 0 || !item.matchesFilter(itemFilter)) {
                continue
            }

            const remove = Math.min(remaining, amountLeft)
            remainingInSlot.set(slotIndex, remaining - remove)
            amountLeft -= remove
        }

        if (amountLeft > 0) {
            allFulfilled = false
        }
    }

    if (!allFulfilled && cancelIfUnable) {
        return false
    }

    for (const [slotIndex, remaining] of remainingInSlot) {
        const item = items.get(slotIndex)
        if (item === undefined || remaining === item.amount) {
            continue
        }

        if (remaining <= 0) {
            this.setItem(slotIndex, undefined)
        }
        else {
            item.amount = remaining
            this.setItem(slotIndex, item)
        }
    }

    return allFulfilled
}

Container.prototype[Symbol.iterator] = function* () {
    for (let i = 0; i < this.size; i++) {
        yield this.getSlot(i)
    }
}

Container.prototype.entries = function* () {
    for (let slotIndex = 0; slotIndex < this.size; slotIndex++) {
        yield { slotIndex, slot: this.getSlot(slotIndex) }
    }
}

Container.prototype.getItemCount = function (itemFilter) {
    let total = 0

    for (const slot of this) {
        if (slot.matchesFilter(itemFilter)) {
            total += slot.amount
        }
    }

    return total
}

Container.prototype.hasItem = function (itemFilter) {
    for (const slot of this) {
        if (slot.matchesFilter(itemFilter)) {
            return true
        }
    }

    return false
}

Container.prototype.getItemCounts = function (itemFilter) {
    const totals: Record<string, number> = {}

    for (const slot of this) {
        if (slot.matchesFilter(itemFilter)) {
            totals[slot.typeId] = (totals[slot.typeId] ?? 0) + slot.amount
        }
    }

    return totals
}

Container.prototype.isSameContainer = function (otherContainer) {
    if (this.size !== otherContainer.size || this.size === 0) {
        return false
    }

    const slotIndex = Math.floor(Math.random() * this.size)
    const originalItem = this.getItem(slotIndex)

    const markerTag = `same_container_${Math.random().toString(36).slice(2)}`
    const marker = new ItemStack("minecraft:stick", 1)
    marker.nameTag = markerTag

    try {
        this.setItem(slotIndex, marker)
        return otherContainer.getItem(slotIndex)?.nameTag === markerTag
    }
    finally {
        this.setItem(slotIndex, originalItem)
    }
}

Object.defineProperty(Container.prototype, "isFull", {
    get(this: Container) {
        return this.emptySlotsCount === 0
    }
})

Container.prototype.findItem = function (itemFilter) {
    for (const { slotIndex, slot } of this.entries()) {
        const item = slot.getItem()?.clone()
        if (item === undefined) {
            continue
        }

        if (!item.matchesFilter(itemFilter)) {
            continue
        }

        return { item, slotIndex }
    }

    return undefined
}

Container.prototype.filterItems = function (itemFilter) {
    const matchingItems = []

    for (const { slotIndex, slot } of this.entries()) {
        const item = slot.getItem()
        if (item === undefined) {
            continue
        }

        if (item.matchesFilter(itemFilter)) {
            matchingItems.push({ item, slotIndex })
        }
    }

    return matchingItems
}

Container.prototype.findItems = function (itemFilter, amount) {
    let amountLeft = amount
    const matchingItems: Array<{ item: ItemStack, slotIndex: number }> = []

    if (amountLeft <= 0) {
        return matchingItems
    }

    for (const { slotIndex, slot } of this.entries()) {
        const item = slot.getItem()?.clone()
        if (item === undefined) {
            continue
        }

        if (!item.matchesFilter(itemFilter)) {
            continue
        }

        if (item.amount > amountLeft) {
            item.amount = amountLeft
        }

        amountLeft -= item.amount
        matchingItems.push({ item, slotIndex })
        if (amountLeft <= 0) {
            break
        }
    }

    return matchingItems
}

ContainerSlot.prototype.matchesFilter = function (itemFilter) {
    const item = this.getItem()
    if (item === undefined) {
        return false
    }
    return item.matchesFilter(itemFilter)
}
