import {
    ItemLockMode,
    Vector3,
    WorldSoundOptions,
    BlockType,
    EntityQueryOptions
} from "@minecraft/server"

import type { Villager } from "./villager"

import type {
    Village,
    VillageSaveData
} from "./village"

export interface ItemStackFilter {
    typeId?: string
    amount?: number
    lore?: string[]
    lockMode?: ItemLockMode
    keepOnDeath?: boolean
    nameTag?: string
    canDestroy?: string[]
    canPlaceOn?: string[]
    enchantments?: Array<{
        id: string
        level?: number
    }>
    unbreakable?: boolean,
    data?: number
    dynamicProperties?: Record<string, boolean | number | string | Vector3>
    tags?: string[]
}

declare module "@minecraft/server" {
    interface World {
        itemFrameList: Array<{
            location: Vector3,
            dimensionId: string
            structureId?: string | undefined
        }>
        villageList: VillageSaveData[]
        lagTime?: number
        loadedData: boolean
        getVillages(): Village[]
        saveData(): void
        loadData(): void
        getEntities(options?: EntityQueryOptions | undefined): Entity[]
        getVillagers(): Villager[]
        getPlayerById(playerId: string): Player | undefined
        getVillager(entityId: string): Villager | undefined
        getEntity(entityId: string): Entity | Villager | undefined
    }

    interface Dimension {
        getBlockSafe(location: Vector3): Block | undefined
        placeStructureFrame(location: Vector3, structureId: string, isEnchanted: boolean, rotation: string): void
    }

    interface Entity {
        isDead: boolean
        unreachable: number
        readonly isVillager: boolean
    }

    interface Block {
        getFrameItem(): ItemStack | undefined
        offsetSafe(offset: Vector3): Block | undefined
        northSafe(): Block | undefined
        eastSafe(): Block | undefined
        southSafe(): Block | undefined
        westSafe(): Block | undefined
        aboveSafe(): Block | undefined
        belowSafe(): Block | undefined
        canPathThrough(): boolean
        canWalkThrough(): boolean
        getIsSolid(): boolean
        isDangerous(): boolean
        destroyableLeaf(): boolean
        destroy(): void
        playSound(soundId: string, soundOptions?: WorldSoundOptions): void
        soundEvent(eventId: SoundEvents, soundOptions?: WorldSoundOptions): void
        replace(blockType: string | BlockType): void
        getNodeNeighbors(): Block[]
        isValidPath(villageBounds?: VillageBounds): boolean
        getNodeRequirement(): NodeRequirement | undefined
        readonly isTree: boolean
        readonly isFarm: boolean
    }

    interface Container {
        getItemCount(itemFilter: ItemStackFilter): number
    }

    interface ItemStack {
        matchesFilter(filter: ItemStackFilter): boolean
        makeVillageItem(): void
    }

    interface Player {
        resetCache(): void
    }
}

export interface CheckEntityData {
    location: Vector3
    id: string
    typeId: string
    cancelPath: boolean
}

type SoundEvents = "break" | "place"

export interface NodeRequirement {
    whiteList: boolean
    types: string[]
}

export interface PathNode {
    neighbors: string[]
    requirement?: NodeRequirement
}

export interface VillageBounds {
    start: Vector3
    end: Vector3
}

declare global {
    interface Array<T> {
        remove(value: T): this
        includesFast(value: string): boolean
    }
}

export { }
