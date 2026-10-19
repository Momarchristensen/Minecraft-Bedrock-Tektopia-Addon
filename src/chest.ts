import {
    Block,
    BlockComponentTypes,
    BlockPermutation,
    EntityComponentTypes,
    system,
    world,
    type Dimension,
    type Entity,
    type VanillaEntityIdentifier,
    type Vector3
} from "@minecraft/server"

import { Registry } from "./registry"

import {
    areVectorsEqual,
    calculateDistance,
    directionToRotation,
    directionToVector,
    reverseRecord,
    rotateHorizontalDirection,
    vectorsAreEqual,
    type HorizontalDirection
} from "./utils"

const chestBlockPlacements: Record<string, string> = {
    "tektopia:chest_item": "minecraft:chest",
    "tektopia:trapped_chest_item": "minecraft:trapped_chest",
    "tektopia:ender_chest_item": "minecraft:ender_chest",
    "tektopia:copper_chest_item": "minecraft:copper_chest",
    "tektopia:exposed_copper_chest_item": "minecraft:exposed_copper_chest",
    "tektopia:weathered_copper_chest_item": "minecraft:weathered_copper_chest",
    "tektopia:oxidized_copper_chest_item": "minecraft:oxidized_copper_chest",
    "tektopia:waxed_copper_chest_item": "minecraft:waxed_copper_chest",
    "tektopia:waxed_exposed_copper_chest_item": "minecraft:waxed_exposed_copper_chest",
    "tektopia:waxed_weathered_copper_chest_item": "minecraft:waxed_weathered_copper_chest",
    "tektopia:waxed_oxidized_copper_chest_item": "minecraft:waxed_oxidized_copper_chest"
}

const reversedChestBlockPlacements = reverseRecord(chestBlockPlacements)

const DISPLAY_TYPE_ID = "tektopia:chest_display"
const DOUBLE_CHEST_SIZE = 54

const CHEST_VARIANTS = [
    "trapped",
    "copper_default",
    "copper_exposed",
    "copper_oxidized",
    "copper_weathered",
    "ender",
    "normal"
] as const

export type ChestVariant = typeof CHEST_VARIANTS[number]

const CHEST_VARIANT_BY_TYPE_ID: Readonly<Record<string, ChestVariant>> = {
    "minecraft:chest": "normal",
    "minecraft:trapped_chest": "trapped",
    "minecraft:ender_chest": "ender",
    "minecraft:copper_chest": "copper_default",
    "minecraft:waxed_copper_chest": "copper_default",
    "minecraft:exposed_copper_chest": "copper_exposed",
    "minecraft:waxed_exposed_copper_chest": "copper_exposed",
    "minecraft:weathered_copper_chest": "copper_weathered",
    "minecraft:waxed_weathered_copper_chest": "copper_weathered",
    "minecraft:oxidized_copper_chest": "copper_oxidized",
    "minecraft:waxed_oxidized_copper_chest": "copper_oxidized"
}

export interface ConnectingChest {
    block: Block
    isBase: boolean
}

export interface ConnectedChestRecord {
    dimensionId: string
    a: Vector3
    b: Vector3
}

// ---------------------------------------------------------------------------
// Saved double-chest pairs
// ---------------------------------------------------------------------------

// Lookup index over world.connectedChestList, rebuilt whenever the list instance changes
const savedPartners = new Map<string, Vector3>()
let indexedList: ConnectedChestRecord[] | undefined

function chestKey(dimensionId: string, location: Vector3): string {
    return `${dimensionId}:${location.x},${location.y},${location.z}`
}

function offsetLocation(location: Vector3, offset: Vector3): Vector3 {
    return { x: location.x + offset.x, y: location.y + offset.y, z: location.z + offset.z }
}

function getSavedPartners(): Map<string, Vector3> {
    const list = world.connectedChestList
    if (list !== indexedList) {
        indexedList = list
        savedPartners.clear()
        for (const { dimensionId, a, b } of list) {
            savedPartners.set(chestKey(dimensionId, a), b)
            savedPartners.set(chestKey(dimensionId, b), a)
        }
    }
    return savedPartners
}

function getSavedPartner(dimensionId: string, location: Vector3): Vector3 | undefined {
    return getSavedPartners().get(chestKey(dimensionId, location))
}

function savePair(dimensionId: string, first: Vector3, second: Vector3) {
    forgetPair(dimensionId, first)
    forgetPair(dimensionId, second)

    const a = { ...first }
    const b = { ...second }

    world.connectedChestList.push({ dimensionId, a, b })

    const partners = getSavedPartners()
    partners.set(chestKey(dimensionId, a), b)
    partners.set(chestKey(dimensionId, b), a)
}

function forgetPair(dimensionId: string, location: Vector3) {
    const partner = getSavedPartner(dimensionId, location)
    if (partner === undefined) {
        return
    }

    const partners = getSavedPartners()
    partners.delete(chestKey(dimensionId, location))
    partners.delete(chestKey(dimensionId, partner))

    const list = world.connectedChestList
    const index = list.findIndex(record =>
        record.dimensionId === dimensionId && (areVectorsEqual(record.a, location) || areVectorsEqual(record.b, location))
    )
    if (index >= 0) {
        list.splice(index, 1)
    }
}

// ---------------------------------------------------------------------------
// Connection detection
// ---------------------------------------------------------------------------

function getDirection(block: Block): HorizontalDirection | undefined {
    return block.permutation.getState("minecraft:cardinal_direction") as HorizontalDirection | undefined
}

function getContainer(block: Block) {
    return block.getComponent(BlockComponentTypes.Inventory)?.container
}

function isDoubleChest(block: Block): boolean {
    return getContainer(block)?.size === DOUBLE_CHEST_SIZE
}

function sharesContainer(a: Block, b: Block): boolean {
    const first = getContainer(a)
    const second = getContainer(b)
    return first !== undefined && second !== undefined && first.isSameContainer(second)
}

function canJoin(block: Block, other: Block, direction: HorizontalDirection): boolean {
    return other.typeId === block.typeId && getDirection(other) === direction && isDoubleChest(other)
}

function getNeighborOffsets(direction: HorizontalDirection): Array<{ offset: Vector3, isBase: boolean }> {
    return [
        { offset: directionToVector(rotateHorizontalDirection(direction, -1)), isBase: false },
        { offset: directionToVector(rotateHorizontalDirection(direction, 1)), isBase: true }
    ]
}

// True when the candidate is already saved as half of a different, still valid pair
function isPairedElsewhere(candidate: Block, block: Block, direction: HorizontalDirection): boolean {
    const dimensionId = candidate.dimension.id
    const partnerLocation = getSavedPartner(dimensionId, candidate.location)
    if (partnerLocation === undefined || areVectorsEqual(partnerLocation, block.location)) {
        return false
    }

    const partner = candidate.dimension.getBlockSafe(partnerLocation)
    if (partner === undefined || canJoin(candidate, partner, direction)) {
        return true
    }

    forgetPair(dimensionId, candidate.location)
    return false
}

function findConnectedChest(block: Block): ConnectingChest | undefined {
    const { dimension, location } = block
    const direction = getDirection(block)
    if (direction === undefined || !isDoubleChest(block)) {
        forgetPair(dimension.id, location)
        return undefined
    }

    const neighbors = getNeighborOffsets(direction)

    // Prefer the saved partner if it is still adjacent and valid
    const savedLocation = getSavedPartner(dimension.id, location)
    if (savedLocation !== undefined) {
        const partner = dimension.getBlockSafe(savedLocation)
        if (partner === undefined) {
            // Partner chunk isn't loaded; keep the saved pair for later
            return undefined
        }

        const neighbor = neighbors.find(({ offset }) =>
            areVectorsEqual(partner.location, offsetLocation(location, offset))
        )
        if (neighbor !== undefined && canJoin(block, partner, direction)) {
            return { block: partner, isBase: neighbor.isBase }
        }

        forgetPair(dimension.id, location)
    }

    // Otherwise look for a free neighbor, using the shared container to break ties
    const candidates: ConnectingChest[] = []
    for (const { offset, isBase } of neighbors) {
        const other = block.offsetSafe(offset)
        if (other !== undefined && canJoin(block, other, direction) && !isPairedElsewhere(other, block, direction)) {
            candidates.push({ block: other, isBase })
        }
    }

    const connected = candidates.length > 1
        ? candidates.find(candidate => sharesContainer(block, candidate.block))
        : candidates[0]

    if (connected !== undefined) {
        savePair(dimension.id, location, connected.block.location)
    }
    return connected
}

// ---------------------------------------------------------------------------
// Display entities and opener tracking
// ---------------------------------------------------------------------------

function getDisplaysAt(dimension: Dimension, location: Vector3): Entity[] {
    return dimension.getEntitiesAtBlockLocation(location).filter(entity => entity.typeId === DISPLAY_TYPE_ID)
}

function getVariantIndex(variant: ChestVariant): number {
    return CHEST_VARIANTS.indexOf(variant)
}

// The display lives on the base half of a double chest
function getOwnerBlock(block: Block, connection: ConnectingChest | undefined): Block {
    return connection?.isBase === true ? connection.block : block
}

interface OpenerEntry {
    dimensionId: string
    location: Vector3
    openers: Set<string>
}

// Keyed by the display owner's location so both halves of a double chest share one list.
// Entries are removed as soon as their last opener leaves.
const chestOpeners = new Map<string, OpenerEntry>()

// The chest each copper golem currently has open, so it can be closed when the golem looks away or switches chests
interface GolemTarget {
    dimensionId: string
    location: Vector3
    ownerKey: string
}

const golemTargets = new Map<string, GolemTarget>()

export class Chest {
    constructor(readonly block: Block) { }

    get direction(): HorizontalDirection | undefined {
        return getDirection(this.block)
    }

    get variant(): ChestVariant | undefined {
        return CHEST_VARIANT_BY_TYPE_ID[this.block.typeId]
    }

    getConnectingChest(): ConnectingChest | undefined {
        return findConnectedChest(this.block)
    }

    syncDisplay(): Entity | undefined {
        const { direction, variant } = this
        if (direction === undefined || variant === undefined) {
            return undefined
        }

        const connection = this.getConnectingChest()
        const owner = getOwnerBlock(this.block, connection)

        const otherHalf = owner === this.block ? connection?.block : this.block
        const strayDisplays = connection === undefined || otherHalf === undefined
            ? []
            : getDisplaysAt(otherHalf.dimension, otherHalf.location)

        const [existing, ...duplicates] = getDisplaysAt(owner.dimension, owner.location)
        for (const extra of [...duplicates, ...strayDisplays]) {
            extra.remove()
        }

        const display = existing ?? owner.dimension.spawnEntity(
            DISPLAY_TYPE_ID as VanillaEntityIdentifier,
            owner.bottomCenter(),
            { initialRotation: directionToRotation(direction).y }
        )

        display.setProperty("tektopia:variant", getVariantIndex(variant))
        display.setProperty("tektopia:double", connection !== undefined)

        return display
    }

    open(openerId: string, playSound = true) {
        const owner = getOwnerBlock(this.block, this.getConnectingChest())
        const key = chestKey(owner.dimension.id, owner.location)

        const wasClosed = !chestOpeners.has(key)
        const entry = chestOpeners.get(key) ?? { dimensionId: owner.dimension.id, location: owner.location, openers: new Set<string>() }
        entry.openers.add(openerId)
        chestOpeners.set(key, entry)

        this.syncDisplay()?.setProperty("tektopia:open", true)
        if (playSound && wasClosed) {
            this.block.soundEvent("chest.open")
        }
    }

    close(openerId: string, playSound = true) {
        const owner = getOwnerBlock(this.block, this.getConnectingChest())
        const key = chestKey(owner.dimension.id, owner.location)

        const entry = chestOpeners.get(key)
        entry?.openers.delete(openerId)
        if (entry?.openers.size === 0) {
            chestOpeners.delete(key)
        }

        const display = this.syncDisplay()
        if ((entry?.openers.size ?? 0) > 0) {
            return
        }

        display?.setProperty("tektopia:open", false)
        if (playSound) {
            this.block.soundEvent("chest.close")
        }
    }
}

Object.defineProperty(Block.prototype, "chest", {
    configurable: true,
    get(this: Block): Chest | undefined {
        return this.typeId in CHEST_VARIANT_BY_TYPE_ID ? new Chest(this) : undefined
    }
})

function refreshPlacedChest(block: Block) {
    const chest = block.chest
    if (chest === undefined) {
        return
    }

    forgetPair(block.dimension.id, block.location)
    chest.syncDisplay()
}

world.afterEvents.blockContainerOpened.subscribe(event => {
    const openerId = event.openSource.entity?.id
    const block = event.block
    if (openerId !== undefined) {
        block.chest?.open(openerId, false)
    }

    const blockInventory = block.getComponent(BlockComponentTypes.Inventory)?.container
    if (blockInventory === undefined) {
        return
    }

    for (const slot of blockInventory) {
        const item = slot.getItem()
        if (item === undefined) {
            continue
        }

        const fakeItemType = reversedChestBlockPlacements[item.typeId]

        if (fakeItemType === undefined) {
            continue
        }

        slot.setItem(item.setType(fakeItemType))
    }
})

world.afterEvents.entityContainerOpened.subscribe(event => {
    const entity = event.entity

    const entityInventory = entity.getComponent(EntityComponentTypes.Inventory)?.container
    if (entityInventory === undefined) {
        return
    }

    for (const slot of entityInventory) {
        const item = slot.getItem()
        if (item === undefined) {
            continue
        }

        const fakeItemType = reversedChestBlockPlacements[item.typeId]

        if (fakeItemType === undefined) {
            continue
        }

        slot.setItem(item.setType(fakeItemType))
    }
})

world.afterEvents.blockContainerClosed.subscribe(event => {
    const openerId = event.closeSource.entity?.id
    if (openerId !== undefined) {
        event.block.chest?.close(openerId, false)
    }
})

function releaseOpener(openerId: string) {
    golemTargets.delete(openerId)

    const held = [...chestOpeners.values()].filter(entry => entry.openers.has(openerId))
    for (const { dimensionId, location } of held) {
        world.getDimension(dimensionId).getBlockSafe(location)?.chest?.close(openerId)
    }
}

const anchors = new Map<string, Vector3>()

world.afterEvents.playerLeave.subscribe(event => releaseOpener(event.playerId))
world.afterEvents.entityRemove.subscribe(event => {
    anchors.delete(event.removedEntityId)
    releaseOpener(event.removedEntityId)
})

world.afterEvents.playerPlaceBlock.subscribe(event => refreshPlacedChest(event.block))

world.beforeEvents.playerBreakBlock.subscribe(event => {
    const chest = event.block.chest
    if (chest === undefined) {
        return
    }

    const { dimension, location } = event.block
    const partnerLocation = chest.getConnectingChest()?.block.location

    system.run(() => {
        if (dimension.getBlockSafe(location)?.chest !== undefined) {
            return
        }

        forgetPair(dimension.id, location)
        chestOpeners.delete(chestKey(dimension.id, location))

        for (const display of getDisplaysAt(dimension, location)) {
            display.remove()
        }

        if (partnerLocation !== undefined) {
            chestOpeners.delete(chestKey(dimension.id, partnerLocation))
            dimension.getBlockSafe(partnerLocation)?.chest?.syncDisplay()
        }
    })
})

system.beforeEvents.startup.subscribe(event => {
    const blockComponentRegistry = event.blockComponentRegistry

    blockComponentRegistry.registerCustomComponent("tektopia:display_block", {
        onPlace({ block }) {
            const placeType = chestBlockPlacements[block.typeId]

            if (placeType === undefined) {
                return
            }

            block.setPermutation(BlockPermutation.resolve(placeType, block.permutation.getAllStates()))
            refreshPlacedChest(block)
        },
        beforeOnPlayerPlace(placeEvent) {
            const placeType = chestBlockPlacements[placeEvent.permutationToPlace.type.id]

            if (placeType === undefined) {
                return
            }

            placeEvent.permutationToPlace = BlockPermutation.resolve(placeType, placeEvent.permutationToPlace.getAllStates())
        }
    })
})

system.runInterval(() => {
    for (const dimensionId of Registry.dimensionTypes) {
        const dimension = world.getDimension(dimensionId)
        for (const display of dimension.getEntities({ type: DISPLAY_TYPE_ID })) {
            const block = dimension.getBlockSafe(display.location)
            if (block === undefined) {
                continue
            }

            const variant = block.chest?.variant
            if (variant === undefined) {
                display.remove()
                continue
            }

            const index = getVariantIndex(variant)
            if (display.getProperty("tektopia:variant") !== index) {
                display.setProperty("tektopia:variant", index)
            }
        }
    }
}, 20)

type GolemChestInteraction = "none" | "take" | "take_fail" | "put" | "put_fail"

const GOLEM_FALLBACK_RADIUS = 1

function findNearbyChestBlock(golem: Entity): Block | undefined {
    const { dimension, location } = golem
    const feet = { x: Math.floor(location.x), y: Math.floor(location.y), z: Math.floor(location.z) }

    let closest: Block | undefined
    let closestDistance = Infinity
    for (let dx = -GOLEM_FALLBACK_RADIUS; dx <= GOLEM_FALLBACK_RADIUS; dx++) {
        for (let dz = -GOLEM_FALLBACK_RADIUS; dz <= GOLEM_FALLBACK_RADIUS; dz++) {
            const block = dimension.getBlockSafe(offsetLocation(feet, { x: dx, y: 0, z: dz }))
            if (block?.chest === undefined) {
                continue
            }

            const distance = calculateDistance(location, block.bottomCenter())
            if (distance < closestDistance) {
                closest = block
                closestDistance = distance
            }
        }
    }
    return closest
}

function getGolemTarget(golem: Entity): GolemTarget | undefined {
    const interaction = golem.getProperty("minecraft:chest_interaction") as GolemChestInteraction
    if (interaction === "none") {
        return undefined
    }

    const viewed = golem.getBlockFromViewDirection()?.block
    const block = viewed?.chest !== undefined ? viewed : findNearbyChestBlock(golem)
    const chest = block?.chest
    if (block === undefined || chest === undefined) {
        return undefined
    }

    const owner = getOwnerBlock(block, chest.getConnectingChest())
    return {
        dimensionId: block.dimension.id,
        location: block.location,
        ownerKey: chestKey(owner.dimension.id, owner.location)
    }
}

function closeGolemTarget(golemId: string, { dimensionId, location }: GolemTarget) {
    world.getDimension(dimensionId).getBlockSafe(location)?.chest?.close(golemId)
}

system.runInterval(() => {
    const seen = new Set<string>()

    for (const dimensionId of Registry.dimensionTypes) {
        const dimension = world.getDimension(dimensionId)
        for (const golem of dimension.getEntities({ type: "minecraft:copper_golem" })) {
            seen.add(golem.id)

            const last = golemTargets.get(golem.id)
            const current = getGolemTarget(golem)
            if (last?.ownerKey === current?.ownerKey) {
                continue
            }

            if (last !== undefined) {
                closeGolemTarget(golem.id, last)
            }

            if (current === undefined) {
                golemTargets.delete(golem.id)
                continue
            }

            golemTargets.set(golem.id, current)
            dimension.getBlockSafe(current.location)?.chest?.open(golem.id)
        }

        for (const display of dimension.getEntities({ type: DISPLAY_TYPE_ID })) {
            const anchor = anchors.get(display.id)
            if (anchor === undefined) {
                anchors.set(display.id, display.location)
                continue
            }

            if (!vectorsAreEqual(display.location, anchor)) {
                display.teleport(anchor)
            }
            if (!vectorsAreEqual(display.getVelocity(), { x: 0, y: 0, z: 0 })) {
                display.clearVelocity()
            }
        }
    }

    for (const [golemId, target] of golemTargets) {
        if (!seen.has(golemId)) {
            golemTargets.delete(golemId)
            closeGolemTarget(golemId, target)
        }
    }
})

world.afterEvents.entitySpawn.subscribe(event => {
    const entity = event.entity
    system.run(() => {
        if (!entity.isValid) {
            return
        }

        const entityItemComponent = entity.getComponent(EntityComponentTypes.Item)
        if (entityItemComponent === undefined) {
            return
        }

        const fakeItemType = reversedChestBlockPlacements[entityItemComponent.itemStack.typeId]

        if (fakeItemType === undefined) {
            return
        }

        entityItemComponent.setType(fakeItemType, 10)
    })
})

world.afterEvents.entityItemDrop.subscribe(event => {
    const entities = Array.from(event.items)

    for (const entity of entities) {
        if (!entity.isValid) {
            continue
        }

        const entityItemComponent = entity.getComponent(EntityComponentTypes.Item)
        if (entityItemComponent === undefined) {
            continue
        }

        const fakeItemType = reversedChestBlockPlacements[entityItemComponent.itemStack.typeId]
        if (fakeItemType === undefined) {
            continue
        }

        entityItemComponent.setType(fakeItemType, 40)
    }
})

world.afterEvents.playerInventoryItemChange.subscribe(event => {
    const item = event.itemStack
    const slotIndex = event.slot
    const player = event.player

    if (item === undefined) {
        return
    }

    const fakeItemType = reversedChestBlockPlacements[item.typeId]

    if (fakeItemType === undefined) {
        return
    }

    const playerInventory = player.getComponent(EntityComponentTypes.Inventory)?.container
    if (playerInventory === undefined) {
        return
    }

    playerInventory.setItem(slotIndex, item.setType(fakeItemType))
})
