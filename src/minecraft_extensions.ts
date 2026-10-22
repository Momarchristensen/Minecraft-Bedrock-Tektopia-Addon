import type { TillResult } from "./big_variables"

import type { EntityBreeding } from "./breed"

import type {
    Chest,
    ConnectedChestRecord
} from "./chest"

import type { SoundEvents } from "./generated"

import type { EntityData as EntitySaveData } from "./saves"

import type {
    StructureType,
    StructureValidationResult
} from "./structure"

import type {
    Bounds,
    NodeRequirement
} from "./types"

import type { CardinalDirection } from "./utils"

import type { Village } from "./village"

import type { VillageSaveData } from "./village_serialization"

import type { Villager } from "./villager"

import type { ItemStack } from "@minecraft/server"

export interface ItemStackFilter {
    includesTypes?: string[]
    excludesTypes?: string[]
    isVillagerItem?: boolean
}

export interface ItemFilterResult { item: ItemStack, slotIndex: number }

declare module "@minecraft/server" {
    interface World {
        itemFrameList: Array<{
            location: Vector3
            dimensionId: string
            structureId?: string | undefined
        }>
        connectedChestList: ConnectedChestRecord[]
        villageList: VillageSaveData[]
        lagTime?: number
        loadedData: boolean
        getVillages(): Village[]
        saveData(asynchronous?: false): void
        saveData(asynchronous: true): Promise<void>
        autoSave(): void
        loadData(): void
        getEntities(options?: EntityQueryOptions | undefined): Entity[]
        getVillagers(): Villager[]
        getPlayerById(playerId: string): Player | undefined
        getVillager(entityId: string): Villager | undefined
        getEntity(entityId: string): Entity | Villager | undefined
    }

    interface Dimension {
        dropItem(itemStack: ItemStack, location: Vector3, pickupDelay?: number): Entity
        getBlockSafe(...args: Parameters<Dimension["getBlock"]>): ReturnType<Dimension["getBlock"]> | undefined
        validateStructure(block: Block, rotation: CardinalDirection, structureId: StructureType, allowInactiveMineshaft?: boolean): Generator<void, StructureValidationResult, void>
        placeStructureFrame(location: Vector3, structureId: string, isEnchanted: boolean, rotation: string): void
        getVillage(location: Vector3): Village | undefined
    }

    interface EntityItemComponent {
        setType(typeId: string, pickupDelay?: number): Entity
    }

    interface Entity extends EntitySaveData {
        saveData<K extends keyof EntitySaveData>(propertyId: K): void
        loadData(): void
        getWoolItem(): ItemStack | undefined
        getHitboxSize(): {
            width: number
            height: number
        }
        getHitbox(): Bounds
        resetEggTimer(): void
        isDead: boolean
        unreachable: number
        loadedData: boolean
        villagerEntityProperty?: boolean
        readonly isShearable: boolean
        readonly isVillager: boolean
        readonly breeding: EntityBreeding | undefined
    }

    interface Block {
        readonly isSolid: boolean
        readonly chest: Chest | undefined

        getFrameItem(): ItemStack | undefined
        growTree(): boolean
        northSafe(...args: Parameters<Block["north"]>): ReturnType<Block["north"]> | undefined
        eastSafe(...args: Parameters<Block["east"]>): ReturnType<Block["east"]> | undefined
        southSafe(...args: Parameters<Block["south"]>): ReturnType<Block["south"]> | undefined
        westSafe(...args: Parameters<Block["west"]>): ReturnType<Block["west"]> | undefined
        aboveSafe(...args: Parameters<Block["above"]>): ReturnType<Block["above"]> | undefined
        belowSafe(...args: Parameters<Block["below"]>): ReturnType<Block["below"]> | undefined
        offsetSafe(...args: Parameters<Block["offset"]>): ReturnType<Block["offset"]> | undefined

        canPathThrough(): boolean
        canWalkThrough(): boolean
        getIsSolid(): boolean
        isDangerous(): boolean
        destroyableLeaf(): boolean
        destroy(villagerItem?: boolean, playSound?: boolean): void
        playSound(soundId: string, soundOptions?: WorldSoundOptions): void
        soundEvent(eventId: SoundEvents, soundOptions?: WorldSoundOptions): void
        replace(replacement: string | BlockType | BlockPermutation): void
        getNodeNeighbors(): Block[]
        isValidPath(villageBounds?: Bounds): boolean
        getNodeRequirement(): NodeRequirement | undefined
        getConnectionRequirement(neighbor: Block): NodeRequirement | undefined
        scanBlock(village: Village): boolean
        getVillage(): Village | undefined
        getPathCost(): number
        getKey(): string
        isTree(checkLeaves?: boolean): boolean
        readonly isOre: boolean
        readonly isFarm: boolean
        readonly isHarvestable: boolean
        readonly isHarvestableSugarCane: boolean
        readonly isHarvestableGourd: boolean
        readonly isHarvestableCrop: boolean
        readonly isHarvestableSweetBerryBush: boolean
        readonly isValidSugarCane: boolean
        readonly isCrop: boolean
        readonly plantableType: string[]
        readonly isPlantable: boolean
        readonly isTillable: boolean
        readonly tillResult: TillResult
        readonly isRanchBoundary: boolean
        readonly isDoor: boolean
        readonly isOpenable: boolean
    }

    interface ItemStack {
        setType(typeId: string): ItemStack
        getToolRank(): number
        matchesFilter(filter?: ItemStackFilter): boolean
        makeVillagerItem(): void
        matchesItem(otherItem: ItemStack): boolean
        readonly isVillagerItem: boolean
    }

    interface ContainerSlot {
        decreaseAmount(amount: number): { item: ItemStack, amount: number } | undefined
        matchesFilter(filter?: ItemStackFilter): boolean
    }

    interface Player {
        resetCache(): void
        spawnBorderParticles(bounds: Bounds): void
    }

    interface Container {
        findItem(itemFilter: ItemStackFilter): ItemFilterResult | undefined
        findItems(itemFilter: ItemStackFilter, amount: number): Array<{ item: ItemStack, slotIndex: number }>
        removeItem(itemFilter: ItemStackFilter, amount: number, cancelIfUnable: boolean): boolean
        removeItems(requests: Array<{ itemFilter: ItemStackFilter, amount: number }>, cancelIfUnable: boolean): boolean
        getItemCount(itemFilter: ItemStackFilter): number
        getItemCounts(itemFilter?: ItemStackFilter): Record<string, number>
        hasItem(itemFilter: ItemStackFilter): boolean
        hasItems(itemFilter: ItemStackFilter, amount: number): boolean
        getRoomFor(item: ItemStack): number
        transferItemStack(fromSlot: number, toContainer: Container, amount: number): number
        isSameContainer(otherContainer: Container): boolean
        filterItems(itemFilter: ItemStackFilter): ItemFilterResult[]
        entries(): Generator<{ slotIndex: number, slot: ContainerSlot }>
        [Symbol.iterator](): Iterator<ContainerSlot>
        readonly isFull: boolean
    }
}

declare global {
    interface Array<T> {
        remove(value: T): boolean
        includesFast(value: T): boolean
        add(...values: T[]): void
    }
}

export { }
