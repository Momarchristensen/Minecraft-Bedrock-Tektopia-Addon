import type { EntityBreeding } from "./breed"

import type { SoundEvents } from "./generated"

import type { EntityData } from "./saves"

import type {
    StructureType,
    StructureValidationResult
} from "./structure"

import type { CardinalDirection } from "./utils"

import type { TillResult } from "./variables"

import type {
    Village,
    VillageSaveData
} from "./village"

import type { Villager } from "./villager"

import type {
    ItemLockMode,
    Vector3,
    WorldSoundOptions,
    BlockType,
    EntityQueryOptions
} from "@minecraft/server"

export type LocationString = string & {
    readonly __vectorString: unique symbol
}

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
    unbreakable?: boolean
    data?: number
    dynamicProperties?: Record<string, boolean | number | string | Vector3>
    tags?: string[]
}

declare module "@minecraft/server" {
    interface World {
        itemFrameList: Array<{
            location: Vector3
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
        getBlockSafe(...args: Parameters<Dimension["getBlock"]>): ReturnType<Dimension["getBlock"]> | undefined
        validateStructure(block: Block, rotation: CardinalDirection, structureId: StructureType): Generator<void, StructureValidationResult, void>
        placeStructureFrame(location: Vector3, structureId: string, isEnchanted: boolean, rotation: string): void
        getVillage(location: Vector3): Village | undefined
    }

    interface Entity extends EntityData {
        saveData<K extends keyof EntityData>(propertyId: K): void
        loadData(): void
        getWoolItem(): ItemStack | undefined

        isDead: boolean
        unreachable: number
        loadedData: boolean
        readonly isShearable: boolean
        readonly isVillager: boolean
        readonly breeding: EntityBreeding | undefined
    }

    interface Block {
        getFrameItem(): ItemStack | undefined

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
        destroy(): void
        playSound(soundId: string, soundOptions?: WorldSoundOptions): void
        soundEvent(eventId: SoundEvents, soundOptions?: WorldSoundOptions): void
        replace(blockType: string | BlockType | BlockPermutation): void
        getNodeNeighbors(): Block[]
        isValidPath(villageBounds?: Bounds): boolean
        getNodeRequirement(): NodeRequirement | undefined
        getConnectionRequirement(neighbor: Block): NodeRequirement | undefined
        scanBlock(village: Village): boolean
        getVillage(): Village | undefined
        getPathCost(): number
        readonly isTree: boolean
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
    }

    interface ItemStack {
        matchesFilter(filter: ItemStackFilter): boolean
        makeVillageItem(): void
    }

    interface Player {
        resetCache(): void
        spawnBorderParticles(bounds: Bounds): void
    }
}

export interface CheckEntityData {
    location: Vector3
    id: string
    typeId: string
    cancelPath: boolean
}

export interface NodeRequirement {
    whiteList: boolean
    types: string[]
}

export interface PathNode {
    neighbors: LocationString[]
    requirement?: NodeRequirement
    nodeRequirements?: Record<LocationString, NodeRequirement>
    cost?: number
}

export interface Bounds {
    start: Vector3
    end: Vector3
}

declare global {
    interface Array<T> {
        remove(value: T): boolean
        includesFast(value: T): boolean
        add(...values: T[]): void
    }
}

export { }
