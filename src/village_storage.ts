import {
    ItemStack,
    Container,
    type Block,
    type Vector3,
    BlockComponentTypes,
    ContainerSlot
} from "@minecraft/server"

import {
    canCraft,
    getCraftingPlan,
    getMaxCrafts
} from "./recipes"

import {
    arraysAreEqual,
    locationToString
} from "./utils"

import type {
    ItemFilterResult,
    ItemStackFilter
} from "./minecraft_extensions"

import type { LocationString } from "./types"

import type { Village } from "./village"

export interface StorageChest {
    location: Vector3
    container: Container
}

export interface StorageItemResult extends ItemFilterResult {
    /** Index of the slot within `chest.container` */
    slotIndex: number
    /** The chest the item came from */
    chest: StorageChest
}

export interface InventorySlot {
    chest: StorageChest
    slotIndex: number
    slot: ContainerSlot
}

function distanceSquared(a: Vector3, b: Vector3) {
    const dx = a.x - b.x
    const dy = a.y - b.y
    const dz = a.z - b.z

    return (dx * dx) + (dy * dy) + (dz * dz)
}

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

export class VillageStorage implements Iterable<ContainerSlot> {
    // The chests of each storage structure, keyed by that structure's location, so several storage rooms can coexist
    private chestsByStructure = new Map<LocationString, StorageChest[]>()

    constructor(readonly village: Village) { }

    setContainers(structureKey: LocationString, blocks: Block[]) {
        const chests: StorageChest[] = []
        const otherHalves = new Set<LocationString>()

        for (const block of blocks) {
            if (!block.isValid || block.dimension.id !== this.village.dimensionId || !this.village.isInBounds(block.location)) {
                continue
            }

            if (otherHalves.has(locationToString(block.location))) {
                continue
            }

            const container = block.getComponent(BlockComponentTypes.Inventory)?.container
            if (container === undefined) {
                continue
            }

            // Both halves of a double chest share one container, so only the first half is stored
            const connected = block.chest?.getConnectingChest()
            if (connected !== undefined) {
                otherHalves.add(locationToString(connected.block.location))
            }

            chests.push({ location: block.location, container })
        }

        this.chestsByStructure.set(structureKey, chests)
    }

    clearContainers(structureKey: LocationString) {
        this.chestsByStructure.delete(structureKey)
    }

    private *liveChests(): Generator<StorageChest> {
        for (const chests of this.chestsByStructure.values()) {
            for (const chest of chests) {
                if (!chest.container.isValid) {
                    // A container goes stale when its chunk unloads; look it up again instead of forgetting the chest
                    const container = this.village.dimension.getBlockSafe(chest.location)?.getComponent(BlockComponentTypes.Inventory)?.container
                    if (container === undefined) {
                        continue
                    }
                    chest.container = container
                }

                yield chest
            }
        }
    }

    getItemCounts(itemFilter?: ItemStackFilter): Record<string, number> {
        const counts: Record<string, number> = {}
        for (const chest of this.liveChests()) {
            for (const [id, amount] of Object.entries(chest.container.getItemCounts(itemFilter))) {
                counts[id] = (counts[id] ?? 0) + amount
            }
        }
        return counts
    }

    canCraft(itemId: string, amount = 1) {
        return canCraft(itemId, this.getItemCounts(), amount)
    }

    getCraftingPlan(itemId: string, amount = 1) {
        return getCraftingPlan(itemId, this.getItemCounts(), amount)
    }

    getMaxCrafts(itemId: string, max = Infinity) {
        return getMaxCrafts(itemId, this.getItemCounts(), max)
    }

    getChests(origin?: Vector3): StorageChest[] {
        const chests = [...this.liveChests()]

        if (origin !== undefined) {
            chests.sort((chest1, chest2) => distanceSquared(chest1.location, origin) - distanceSquared(chest2.location, origin))
        }

        return chests
    }

    *entries(chests: Iterable<StorageChest> = this.liveChests()): Generator<InventorySlot> {
        for (const chest of chests) {
            for (let i = 0; i < chest.container.size; i++) {
                const slot = chest.container.getSlot(i)

                yield { chest, slotIndex: i, slot }
            }
        }
    }

    *[Symbol.iterator](): Iterator<ContainerSlot> {
        for (const { slot } of this.entries()) {
            yield slot
        }
    }

    *filter(itemFilter: ItemStackFilter): Generator<ContainerSlot> {
        for (const slot of this) {
            if (slot.matchesFilter(itemFilter)) {
                yield slot
            }
        }
    }

    getRoomFor(itemStack: ItemStack) {
        for (const slot of this) {
            const item = slot.getItem()
            if (item === undefined) {
                return itemStack.amount
            }

            if (item.isStackableWith(itemStack) && item.amount < item.maxAmount) {
                return Math.min(itemStack.amount, item.maxAmount - item.amount)
            }
        }

        return 0
    }

    findItem(itemFilter: ItemStackFilter): StorageItemResult | undefined {

        for (const { chest, slotIndex, slot } of this.entries()) {
            const item = slot.getItem()?.clone()
            if (item === undefined) {
                continue
            }

            if (!item.matchesFilter(itemFilter)) {
                continue
            }

            return { item, slotIndex, chest }
        }

        return undefined
    }

    findItems(itemFilter: ItemStackFilter, amount: number): StorageItemResult[] {
        let amountLeft = amount
        const matchingItems: StorageItemResult[] = []

        if (amountLeft <= 0) {
            return matchingItems
        }

        for (const { chest, slotIndex, slot } of this.entries()) {
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
            matchingItems.push({ item, slotIndex, chest })
            if (amountLeft <= 0) {
                break
            }
        }

        return matchingItems
    }

    filterItems(itemFilter: ItemStackFilter): StorageItemResult[] {
        const matchingItems: StorageItemResult[] = []

        for (const { chest, slotIndex, slot } of this.entries()) {
            const item = slot.getItem()
            if (item === undefined) {
                continue
            }

            if (!item.matchesFilter(itemFilter)) {
                continue
            }

            matchingItems.push({ item, slotIndex, chest })
        }

        return matchingItems
    }

    /**
     * The closest chest that can top up a stack of the item, else the closest one that already holds the item and has
     * a free slot, else the closest one with any free slot.
     */
    findDepositChest(itemStack: ItemStack, origin?: Vector3): StorageChest | undefined {
        let holdsItemWithRoom: StorageChest | undefined
        let hasFreeSlot: StorageChest | undefined

        for (const chest of this.getChests(origin)) {
            let freeSlot = false
            let holdsItem = false

            for (const slot of chest.container) {
                const item = slot.getItem()
                if (item === undefined) {
                    freeSlot = true
                }
                else if (item.typeId === itemStack.typeId) {
                    if (item.isStackableWith(itemStack) && item.amount < item.maxAmount) {
                        return chest
                    }
                    holdsItem = true
                }
            }

            if (freeSlot) {
                hasFreeSlot ??= chest
                if (holdsItem) {
                    holdsItemWithRoom ??= chest
                }
            }
        }

        return holdsItemWithRoom ?? hasFreeSlot
    }
}

ContainerSlot.prototype.matchesFilter = function (itemFilter) {
    const item = this.getItem()
    if (item === undefined) {
        return false
    }
    return item.matchesFilter(itemFilter)
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
