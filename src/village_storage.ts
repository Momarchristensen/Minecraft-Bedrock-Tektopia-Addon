import {
    ItemStack,
    Container,
    type Block,
    type Vector3,
    BlockComponentTypes
} from "@minecraft/server"

import type {
    DepositPlan,
    ItemStackFilter
} from "./minecraft_extensions"

import type { Village } from "./village"

export interface StorageChest {
    location: Vector3
    container: Container
}

export interface InventorySlot {
    chest: StorageChest
    slot: number
    item: ItemStack
}

function distanceSquared(a: Vector3, b: Vector3) {
    const dx = a.x - b.x
    const dy = a.y - b.y
    const dz = a.z - b.z

    return (dx * dx) + (dy * dy) + (dz * dz)
}

function countMatching(container: Container, itemFilter: ItemStackFilter) {
    let total = 0

    for (const item of container) {
        if (item?.matchesFilter(itemFilter)) {
            total += item.amount
        }
    }

    return total
}

function containsType(container: Container, typeId: string) {
    for (const item of container) {
        if (item?.typeId === typeId) {
            return true
        }
    }

    return false
}

// How many more of `itemStack` the container could accept (empty slots + partial stacks)
function getRoomFor(container: Container, itemStack: ItemStack) {
    let room = 0

    for (let slot = 0; slot < container.size; slot++) {
        const existing = container.getItem(slot)

        if (existing === undefined) {
            room += itemStack.maxAmount
        }
        else if (existing.isStackableWith(itemStack)) {
            room += existing.maxAmount - existing.amount
        }
    }

    return room
}

// Moves up to `amount` items out of one slot and into another container.
// Nothing is removed from the source unless the destination accepted it.
function moveItems(from: Container, slot: number, to: Container, amount: number) {
    const item = from.getItem(slot)

    if (item === undefined) {
        return 0
    }

    const stack = item.clone()
    stack.amount = Math.min(amount, item.amount)

    const leftover = to.addItem(stack)
    const moved = stack.amount - (leftover?.amount ?? 0)

    if (moved <= 0) {
        return 0
    }

    if (moved >= item.amount) {
        from.setItem(slot, undefined)
    }
    else {
        item.amount -= moved
        from.setItem(slot, item)
    }

    return moved
}

export class VillageStorage implements Iterable<ItemStack> {
    private chests: StorageChest[] = []

    constructor(readonly village: Village) { }

    setContainers(blocks: Block[]) {
        const chests: StorageChest[] = []

        for (const block of blocks) {
            if (!block.isValid) {
                continue
            }

            if (block.dimension.id !== this.village.dimensionId || !this.village.isInBounds(block.location)) {
                continue
            }

            const container = block.getComponent(BlockComponentTypes.Inventory)?.container

            if (container === undefined) {
                continue
            }

            chests.push({ location: block.location, container })
        }

        this.chests = chests
    }

    // ---------- Chests ----------

    private *liveChests(): Generator<StorageChest> {
        for (const chest of this.chests) {
            if (chest.container.isValid) {
                yield chest
            }
        }
    }

    // Chests that still exist, nearest to `origin` first (or in the order they were added)
    getChests(origin?: Vector3): StorageChest[] {
        const chests = [...this.liveChests()]

        if (origin !== undefined) {
            chests.sort((a, b) => distanceSquared(a.location, origin) - distanceSquared(b.location, origin))
        }

        return chests
    }

    get chestCount(): number {
        return this.getChests().length
    }

    // ---------- Iteration ----------

    *entries(chests: Iterable<StorageChest> = this.liveChests()): Generator<InventorySlot> {
        for (const chest of chests) {
            for (let slot = 0; slot < chest.container.size; slot++) {
                const item = chest.container.getItem(slot)

                if (item === undefined) {
                    continue
                }

                yield { chest, slot, item }
            }
        }
    }

    *[Symbol.iterator](): Iterator<ItemStack> {
        for (const { item } of this.entries()) {
            yield item
        }
    }

    *filter(itemFilter: ItemStackFilter): Generator<ItemStack> {
        for (const item of this) {
            if (item.matchesFilter(itemFilter)) {
                yield item
            }
        }
    }

    // ---------- Searching ----------

    hasItem(itemFilter: ItemStackFilter) {
        for (const item of this) {
            if (item.matchesFilter(itemFilter)) {
                return true
            }
        }

        return false
    }

    getItemCount(itemFilter: ItemStackFilter) {
        let total = 0

        for (const item of this) {
            if (item.matchesFilter(itemFilter)) {
                total += item.amount
            }
        }

        return total
    }

    hasAmount(itemFilter: ItemStackFilter, amount: number): boolean {
        return this.getItemCount(itemFilter) >= amount
    }

    // Totals per item type, e.g. for "what can I craft / what's missing" checks
    getItemCounts(itemFilter?: ItemStackFilter): Map<string, number> {
        const counts = new Map<string, number>()

        for (const item of this) {
            if (itemFilter !== undefined && !item.matchesFilter(itemFilter)) {
                continue
            }

            counts.set(item.typeId, (counts.get(item.typeId) ?? 0) + item.amount)
        }

        return counts
    }

    // First matching stack, searching the chests nearest to `origin` first
    findItem(itemFilter: ItemStackFilter, origin?: Vector3): InventorySlot | undefined {
        for (const entry of this.entries(this.getChests(origin))) {
            if (entry.item.matchesFilter(itemFilter)) {
                return entry
            }
        }

        return undefined
    }

    // Nearest chest holding at least `minAmount` matching items (so the trip is worth it)
    findChestWithItem(itemFilter: ItemStackFilter, origin?: Vector3, minAmount = 1): StorageChest | undefined {
        for (const chest of this.getChests(origin)) {
            if (countMatching(chest.container, itemFilter) >= minAmount) {
                return chest
            }
        }

        return undefined
    }

    // ---------- Withdrawing ----------

    // Moves up to `amount` matching items into `into` (e.g. a villager's inventory), nearest chests first.
    // Stops safely when `into` is full; returns how many items were actually moved.
    withdraw(itemFilter: ItemStackFilter, amount: number, into: Container, origin?: Vector3): number {
        let remaining = amount

        for (const { chest, slot, item } of this.entries(this.getChests(origin))) {
            if (remaining <= 0) {
                break
            }

            if (!item.matchesFilter(itemFilter)) {
                continue
            }

            remaining -= moveItems(chest.container, slot, into, Math.min(item.amount, remaining))
        }

        return amount - remaining
    }

    removeItem(itemFilter: ItemStackFilter, amount: number): number {
        let remaining = amount

        for (const { chest, slot, item } of this.entries()) {
            if (remaining <= 0) {
                break
            }

            if (!item.matchesFilter(itemFilter)) {
                continue
            }

            const taken = Math.min(item.amount, remaining)
            remaining -= taken

            if (taken === item.amount) {
                chest.container.setItem(slot, undefined)
            }
            else {
                item.amount -= taken
                chest.container.setItem(slot, item)
            }
        }

        return amount - remaining
    }

    // ---------- Depositing ----------

    getRoomFor(itemStack: ItemStack): number {
        let total = 0

        for (const chest of this.liveChests()) {
            total += getRoomFor(chest.container, itemStack)
        }

        return total
    }

    canFit(itemStack: ItemStack): boolean {
        return this.getRoomFor(itemStack) >= itemStack.amount
    }

    findDepositChest(
        itemStack: ItemStack,
        origin?: Vector3,
        accept?: (chest: StorageChest) => boolean
    ): StorageChest | undefined {
        let sameType: StorageChest | undefined
        let fitsAll: StorageChest | undefined
        let fitsSome: StorageChest | undefined

        for (const chest of this.getChests(origin)) {
            const room = getRoomFor(chest.container, itemStack)

            if (room <= 0) {
                continue
            }

            if (accept !== undefined && !accept(chest)) {
                continue
            }

            if (containsType(chest.container, itemStack.typeId)) {
                sameType = chest
                break
            }

            if (fitsAll === undefined && room >= itemStack.amount) {
                fitsAll = chest
            }

            fitsSome ??= chest
        }

        return sameType ?? fitsAll ?? fitsSome
    }

    canDeposit(source: Container, itemFilter?: ItemStackFilter): boolean {
        for (const item of source) {
            if (item === undefined) {
                continue
            }

            if (itemFilter !== undefined && !item.matchesFilter(itemFilter)) {
                continue
            }

            if (this.findDepositChest(item) !== undefined) {
                return true
            }
        }

        return false
    }

    deposit(source: Container, itemFilter?: ItemStackFilter, origin?: Vector3): number {
        let total = 0

        for (let slot = 0; slot < source.size; slot++) {
            let item = source.getItem(slot)

            if (item !== undefined && itemFilter !== undefined && !item.matchesFilter(itemFilter)) {
                continue
            }

            while (item !== undefined) {
                const chest = this.findDepositChest(item, origin)

                if (chest === undefined) {
                    break
                }

                const moved = moveItems(source, slot, chest.container, item.amount)

                if (moved === 0) {
                    break
                }

                total += moved
                item = source.getItem(slot)
            }
        }

        return total
    }

    depositInto(chest: StorageChest, source: Container, itemFilter?: ItemStackFilter): number {
        if (!chest.container.isValid) {
            return 0
        }

        let total = 0

        for (let slot = 0; slot < source.size; slot++) {
            const item = source.getItem(slot)

            if (item === undefined) {
                continue
            }

            if (itemFilter !== undefined && !item.matchesFilter(itemFilter)) {
                continue
            }

            total += moveItems(source, slot, chest.container, item.amount)
        }

        return total
    }

    depositPlanInto(chest: StorageChest, source: Container, plan: DepositPlan): number {
        if (!chest.container.isValid) {
            return 0
        }

        const remaining = { ...plan }
        let total = 0

        for (let slot = 0; slot < source.size; slot++) {
            const item = source.getItem(slot)

            if (item === undefined) {
                continue
            }

            const wanted = remaining[item.typeId] ?? 0

            if (wanted <= 0) {
                continue
            }

            const moved = moveItems(source, slot, chest.container, wanted)

            remaining[item.typeId] = wanted - moved
            total += moved
        }

        return total
    }

    addItem(itemStack: ItemStack): ItemStack | undefined {
        let leftover: ItemStack | undefined = itemStack

        for (const chest of this.liveChests()) {
            if (leftover === undefined) {
                break
            }

            leftover = chest.container.addItem(leftover)
        }

        return leftover
    }

    get emptySlotCount(): number {
        let total = 0

        for (const chest of this.liveChests()) {
            total += chest.container.emptySlotsCount
        }

        return total
    }

    get isFull(): boolean {
        return this.emptySlotCount === 0
    }
}

ItemStack.prototype.matchesFilter = function (itemFilter) {
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
        yield this.getItem(i)
    }
}

Container.prototype.getItemCount = function (itemFilter) {
    let total = 0

    for (const item of this) {
        if (item?.matchesFilter(itemFilter)) {
            total += item.amount
        }
    }

    return total
}

Container.prototype.getItemCounts = function (itemFilter) {
    const totals: Record<string, number> = {}

    for (const item of this) {
        if (item?.matchesFilter(itemFilter)) {
            totals[item.typeId] = (totals[item.typeId] ?? 0) + 1
        }
    }

    return totals
}

Object.defineProperty(Container.prototype, "isFull", {
    get(this: Container) {
        return this.emptySlotsCount === 0
    }
})
