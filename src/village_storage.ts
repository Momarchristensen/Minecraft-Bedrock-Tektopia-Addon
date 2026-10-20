import {
    type ItemStack,
    type Container,
    type Block,
    type Vector3,
    BlockComponentTypes,
    type ContainerSlot
} from "@minecraft/server"

import {
    canCraft,
    getCraftingPlan,
    getMaxCrafts,
    type PlanOptions
} from "./recipes"

import { locationToString } from "./utils"

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

    slotIndex: number

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

export class VillageStorage implements Iterable<ContainerSlot> {

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

    canCraft(itemId: string, amount = 1, options?: PlanOptions) {
        return canCraft(itemId, this.getItemCounts(), amount, options)
    }

    getCraftingPlan(itemId: string, amount = 1, options?: PlanOptions) {
        return getCraftingPlan(itemId, this.getItemCounts(), amount, options)
    }

    getMaxCrafts(itemId: string, max = Infinity, options?: PlanOptions) {
        return getMaxCrafts(itemId, this.getItemCounts(), max, options)
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

    hasItems(itemFilter: ItemStackFilter, amount: number) {
        let currentAmount = amount

        for (const slot of this) {
            if (slot.matchesFilter(itemFilter)) {
                currentAmount -= slot.amount
                if (currentAmount <= 0) {
                    return true
                }
            }
        }

        return false
    }

    hasItem(itemFilter: ItemStackFilter) {
        for (const slot of this) {
            if (slot.matchesFilter(itemFilter)) {
                return true
            }
        }

        return false
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
            return []
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

        if (amountLeft > 0) {
            return []
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
