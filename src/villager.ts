import {
    type Block,
    BlockComponentTypes,
    BlockPermutation,
    type Container,
    Entity,
    EntityComponentTypes,
    EntityDamageCause,
    ItemStack,
    MolangVariableMap,
    system,
    type Vector3,
    World,
    world
} from "@minecraft/server"

import { debugFlags } from "./debug_flags"

import {
    checkRequirement,
    createPathStream,
    findNearestNodeLocation,
    type SearchBias,
    findPathBlocker,
    generatePath,
    getPathStreamFailure,
    isEntityTarget,
    shortcutStream,
    startPathSnapshot,
    stopPathSnapshot,
    updatePathNodes,
    type PathStream,
    type PathTarget
} from "./path"

import {
    type CraftStep,
    getCraftingPlan,
    getMaxCrafts,
    getRequiredItems
} from "./recipes"

import { Registry } from "./registry"

import {
    AnimalPen,
    entityStructures,
    type BedInfo,
    type StationPost,
    type Mineshaft,
    type Structure,
    getMineshaftMineBlock,
    type StructureTypeMap,
    BlackSmith,
    Kitchen
} from "./structure"

import {
    destroyTree,
    getTrunkBlocks
} from "./tree"

import {
    addVectors,
    areVectorsEqual,
    subtractVectors,
    calculateDistance,
    calculateChebyshevDistance,
    centerVector,
    floorVector,
    formatTypeId,
    fix,
    multiplyVector,
    randomInt,
    locationToString,
    fixVector,
    getItemFrameRotation,
    addVector,
    getOppositeDirection,
    directionToVector,
    stringToLocationCached,
    randomItem,
    stringToLocation,
    type CardinalDirection,
    randomWeighedItem,
    shuffle,
    type HorizontalDirection,
    directionToRotation
} from "./utils"

import {
    armorSlotNames,
    type ArmorType,
    armorTypes,
    cropSeeds,
    type DepositPlan,
    getToolItems,
    globalTasks,
    pickTask,
    resolvePickupItems,
    sortTasksByPriority,
    type Task,
    tektopiaVillagers,
    type ToolUpgradePlan,
    type UpgradableToolType,
    upgradableToolTypes,
    type VillagerToolType
} from "./villager_tasks"

import type { ItemFilterResult } from "./minecraft_extensions"

import type { VillagerData } from "./saves"

import type {
    LocationString,
    VillageRanchEntity
} from "./types"

import type { Village } from "./village"

const villagerCache = new Map<string, Villager>()

world.afterEvents.entityRemove.subscribe(event => {
    const removedEntityId = event.removedEntityId
    villagerCache.delete(removedEntityId)
})

const PATH_TIMEOUT_TICKS = 1200

const PATH_PROGRESS_WINDOW_TICKS = 500
const PATH_PROGRESS_MARGIN = 1.5
const PATH_PROGRESS_ARRIVED_DISTANCE = 2

const PATH_PROGRESS_REUSE_GAP_TICKS = 40

const BLOCK_EDGE_THRESHOLD = 0.3

function getBlockSideBias(location: Vector3): SearchBias {
    const side = (position: number): -1 | 0 | 1 => {
        const fraction = position - Math.floor(position)
        if (fraction < BLOCK_EDGE_THRESHOLD) {
            return -1
        }
        return fraction > 1 - BLOCK_EDGE_THRESHOLD ? 1 : 0
    }
    return { x: side(location.x), z: side(location.z) }
}

const IDLE_WAIT_MIN_TICKS = 20
const IDLE_WAIT_MAX_TICKS = 200

const CHAIR_SIT_CHANCE = 0.25
const CHAIR_SIT_MIN_TICKS = 10 * 20
const CHAIR_SIT_MAX_TICKS = 15 * 20

const CHAIR_WALK_GIVE_UP_TICKS = 20 * 20

const GATE_PLAYER_RANGE = 6
const GATE_REACH = 2.5
const GATE_UNREACHABLE_TICKS = 1200
const GATE_PLAYER_COOLDOWN_TICKS = 100
const RANCH_PEN_TYPES = ["pig_pen", "chicken_coop", "sheep_pen", "cow_pen"] as const

function isPenWorkerType(typeId: string) {
    return typeId === "tektopia:villager_rancher" || typeId === "tektopia:villager_butcher"
}

const GATE_OPEN_CLEARANCE = 0.5
const GATE_CLOSE_TRIGGER = 1
const GATE_WAIT_TICKS = 100
const CHEST_OPEN_WAIT_TICKS = 10
const PEN_SKIP_TICKS = 600
const BUTCHER_SKIP_TICKS = 1200
const BUTCHER_GIVE_UP_TICKS = 1200
const unreachableItemEntities = new Set<Entity>()

function getOpenableBlock(block: Block): Block | undefined {
    if (block.isDoor && block.permutation.getState("upper_block_bit") === true) {
        return block.belowSafe()
    }
    return block
}

function isOpenFenceGate(block: Block | undefined): block is Block {
    return block !== undefined
        && Registry.fenceGateTypes.includes(block.typeId)
        && block.permutation.getState("open_bit") === true
}

const SWING_HIT_DELAY_TICKS = 17
const ATTACK_RANGE = 3

const ATTACK_DAMAGE = 4
const ATTACK_COOLDOWN_TICKS = 20

const noop = () => { }
const taskListsByType = new Map<string, typeof globalTasks>()

function isTimeInRange(time: number, start: number, end: number) {
    return start <= end
        ? time >= start && time < end
        : time >= start || time < end
}

export type BedTime = "sleep" | "waking" | "tired" | "working"

export interface Villager extends Entity { }

let pennedEntityMemoTick = -1
const pennedEntityMemo = new Map<string, boolean>()

interface TaskCache {
    item?: Entity
    smithing?: {
        recipes?: CraftingJob[]
        hasItems?: boolean
        items?: Record<string, number>
    }
    cooking?: {
        recipes?: CraftingJob[]
        hasItems?: boolean
        items?: Record<string, number>
    }
    toolCraft?: {
        crafting?: {
            plan: CraftStep[]
            items: Record<string, number>
            doneSteps?: number[]
            hasItems?: boolean
        }
    }
}

interface TaskContext {
    item?: string
    tree?: Vector3
    harvestLocation?: Vector3
    sapling?: Vector3
    tillLocation?: Vector3
    growableCrop?: Vector3
    plant?: {
        location: Vector3
        type: string
    }
    herdEntity?: VillageRanchEntity & { id: string }
    breedableEntity?: VillageRanchEntity & { id: string }
    breedableMate?: VillageRanchEntity & { id: string }
    shearableEntity?: VillageRanchEntity & { id: string }
    milkableEntity?: VillageRanchEntity & { id: string }
    openGate?: Vector3
    mine?: {
        location: Vector3
        rotation: CardinalDirection
    }
    ore?: {
        start: Vector3
        ores: LocationString[]
    }
    guardPost?: Vector3
    abandonedFurnace?: Vector3
    fullAnimalPen?: Vector3
    butcherStructure?: Vector3
    killingEntity?: string
    depositPlan?: DepositPlan
    toolUpgrades?: ToolUpgradePlan[]
    toolCraft?: {
        itemId: string
        amount?: number
    }
    craftedTaskItems?: string[]
    // Furnace smelts this villager is waiting on, keyed by the item being crafted. Living in the context
    // (not the cache) means they are dropped together with the task, which releases the furnace claim
    smelts?: Record<string, SmeltWait>
    smithing?: string[]
    // How many of each item to craft this task, keyed by item id. A missing entry means one, as in older saves
    smithingAmounts?: Record<string, number>
    cooking?: string[]
    cookingAmounts?: Record<string, number>
}

interface SmeltWait {
    amount: number
    outputId: string
    furnace: Vector3
    ticks: number
    maxTicks: number
}

interface CraftingJob {
    itemId: string
    // How many of the item this job crafts (the plan already covers all of them)
    amount: number
    plan: CraftStep[]
    doneSteps?: number[]
}

// Furnaces a villager couldn't reach, mapped to the tick when they may be tried again
const unreachableFurnaces = new Map<string, number>()

const UNREACHABLE_FURNACE_RETRY_TICKS = 1200

// Furnace slots: input, fuel, output
const FURNACE_SLOTS = [0, 1, 2] as const

const SMITH_FURNACE_TYPES = ["minecraft:furnace", "minecraft:lit_furnace", "minecraft:blast_furnace", "minecraft:lit_blast_furnace"]
const COOK_FURNACE_TYPES = ["minecraft:furnace", "minecraft:lit_furnace", "minecraft:smoker", "minecraft:lit_smoker"]

export interface VillagerTask {
    id: string
    context: TaskContext
}

function getHighestRankedTool<T extends ItemFilterResult>(itemFilterResults: T[]) {
    return itemFilterResults.reduce<T | undefined>(
        (highest, current) =>
            highest === undefined || current.item.getToolRank() > highest.item.getToolRank()
                ? current
                : highest,
        undefined
    )
}

// Most of any one smithed item (best tier in storage only) before the blacksmith stops making more
const MAX_SMITHED_PER_ITEM = 5

const smithingCraftingIds = [
    ["minecraft:diamond_chestplate", "minecraft:iron_chestplate", "minecraft:copper_chestplate"],
    ["minecraft:diamond_leggings", "minecraft:iron_leggings", "minecraft:copper_leggings"],
    ["minecraft:diamond_helmet", "minecraft:iron_helmet", "minecraft:copper_helmet"],
    ["minecraft:diamond_boots", "minecraft:iron_boots", "minecraft:copper_boots"],
    ["minecraft:diamond_sword", "minecraft:iron_sword", "minecraft:copper_sword"],
    ["minecraft:diamond_pickaxe", "minecraft:iron_pickaxe", "minecraft:copper_pickaxe"],
    ["minecraft:diamond_axe", "minecraft:iron_axe", "minecraft:copper_axe"],
    ["minecraft:diamond_hoe", "minecraft:iron_hoe", "minecraft:copper_hoe"],
    ["minecraft:shears"],
    ["minecraft:bucket"],
    ["minecraft:gold_ingot"]
]

// Most of any one cooked item the cook crafts in a single task
const MAX_COOKED_BATCH = 8

// Most of any one smithed item the blacksmith crafts in a single task (also never past MAX_SMITHED_PER_ITEM in storage)
const MAX_SMITHED_BATCH = 5

const stackSizes = new Map<string, number>()

function getMaxStackSize(itemId: string): number {
    let size = stackSizes.get(itemId)
    if (size === undefined) {
        try {
            size = new ItemStack(itemId, 1).maxAmount
        }
        catch {
            size = 64
        }
        stackSizes.set(itemId, size)
    }
    return size
}

function countSlots(items: Record<string, number>): number {
    let slots = 0
    for (const [itemId, amount] of Object.entries(items)) {
        if (amount > 0) {
            slots += Math.ceil(amount / getMaxStackSize(itemId))
        }
    }
    return slots
}

// A furnace slot holds one stack, so every smelt step has to fit in a single stack of input, fuel and output
function fitsFurnace(plan: CraftStep[]): boolean {
    return plan.every(step => !step.smelt || (
        step.input.amount * step.times <= getMaxStackSize(step.input.id)
        && step.fuel.amount <= getMaxStackSize(step.fuel.id)
        && step.output.amount * step.times <= getMaxStackSize(step.output.id)
    ))
}

function getPlanOutputs(plan: CraftStep[], itemId: string): Record<string, number> {
    let amount = 0
    for (const step of plan) {
        if (step.output.id === itemId) {
            amount += step.output.amount * step.times
        }
    }
    return { [itemId]: amount }
}

interface BatchJob {
    itemId: string
    amount: number
    maxAmount: number
    required: Record<string, number>
    outputs: Record<string, number>
}

function createBatchJob(itemId: string, maxAmount: number, plan: CraftStep[], required: Record<string, number>): BatchJob {
    return {
        itemId,
        amount: 1,
        maxAmount: Math.max(1, Math.floor(maxAmount)),
        required,
        outputs: getPlanOutputs(plan, itemId)
    }
}

// Inventory slots the villager needs to carry everything the jobs use up and produce
function getBatchSlots(jobs: BatchJob[]): number {
    const inputs: Record<string, number> = {}
    const outputs: Record<string, number> = {}
    for (const job of jobs) {
        for (const [itemId, amount] of Object.entries(job.required)) {
            inputs[itemId] = (inputs[itemId] ?? 0) + amount
        }
        for (const [itemId, amount] of Object.entries(job.outputs)) {
            outputs[itemId] = (outputs[itemId] ?? 0) + amount
        }
    }
    return countSlots(inputs) + countSlots(outputs)
}

// Raises the amount each job crafts, a doubling round at a time so that no single item eats all of the materials.
// `remaining` is what storage still holds after one craft of every job was reserved, and is kept up to date.
// Amounts stop growing once the villager's free inventory slots or a furnace stack can't hold more
function growBatches(jobs: BatchJob[], remaining: Record<string, number>, smelting: boolean, freeSlots: number) {
    const largest = Math.max(...jobs.map(job => job.maxAmount))
    let target = 1

    while (target < largest) {
        target = Math.min(target * 2, largest)

        for (const job of jobs) {
            const wanted = Math.min(target, job.maxAmount)
            if (wanted <= job.amount) {
                continue
            }

            // Storage as it would be without this job's own reservation
            const counts: Record<string, number> = { ...remaining }
            for (const [itemId, amount] of Object.entries(job.required)) {
                counts[itemId] = (counts[itemId] ?? 0) + amount
            }
            counts[job.itemId] = 0

            const amount = getMaxCrafts(job.itemId, counts, wanted, { smelting })
            if (amount <= job.amount) {
                continue
            }

            const plan = getCraftingPlan(job.itemId, counts, amount, { smelting })
            if (plan === undefined || plan.length === 0 || !fitsFurnace(plan)) {
                continue
            }

            const previous = { amount: job.amount, required: job.required, outputs: job.outputs }
            job.amount = amount
            job.required = getRequiredItems(plan)
            job.outputs = getPlanOutputs(plan, job.itemId)

            if (getBatchSlots(jobs) > freeSlots) {
                Object.assign(job, previous)
                continue
            }

            for (const [itemId, count] of Object.entries(previous.required)) {
                remaining[itemId] = (remaining[itemId] ?? 0) + count
            }
            for (const [itemId, count] of Object.entries(job.required)) {
                remaining[itemId] = (remaining[itemId] ?? 0) - count
            }
        }
    }
}

function hasStationsFor(plan: CraftStep[] | undefined, hasCraftingTable: boolean): plan is CraftStep[] {
    return plan !== undefined && plan.length > 0 && (hasCraftingTable || plan.every(step => step.smelt === true))
}

export class Villager {
    public isBlocked = false
    public blockedTimer = 0
    public isPathing = false
    public unblockTimer = 0
    public totalBlockTimer = 0
    public blockingEntityTypeId?: string
    public pathTickId?: number
    public pathError?: string
    private pathProgress?: {
        task: string | undefined
        getTarget: () => Vector3
        targetLocation: Vector3
        best: number
        lastImprovementTick: number
        lastActiveTick: number
    }

    private readonly lastEquipment = new Map<number, string>()
    private nextPathNode?: Vector3
    private taskProgress = 0
    private sitChair?: Vector3
    private sitTicksLeft = 0
    private sitWalkTicks = 0
    private taskCache: TaskCache = {}
    private pendingContext: TaskContext = {}
    private animation?: string
    private lastAnimation?: string
    private attackIntervalId?: number
    private holdingItem?: string
    private lastHoldingItem?: string
    private waiting?: boolean | number
    private openedChest?: Vector3
    private herdPathTarget?: { structure: LocationString, location: Vector3 }
    private readonly skippedGates = new Map<LocationString, number>()
    private gateHold?: { key: LocationString, since: number }
    private readonly skippedPens = new Map<LocationString, number>()
    private readonly skippedButcherEntities = new Map<string, number>()
    private lastButcherLeash?: { id: string, tick: number }
    private static readonly unleashableTypes = new Set<string>()

    private index: number

    private attackCooldownEndTick = 0

    static villagerIndex = 0

    private readonly data: VillagerData = {}

    constructor(private readonly entity: Entity) {
        this.index = Villager.villagerIndex++
        Villager.installDelegates()
        this.loadVillagerData()
    }

    private loadVillagerData() {
        if (!this.entity.isValid) {
            return
        }

        for (const key of this.entity.getDynamicPropertyIds()) {
            const valueString = this.entity.getDynamicProperty(key)
            if (typeof valueString !== "string") {
                continue
            }

            const propertyId = key.replace("tektopia:", "")

            try {
                const value: unknown = JSON.parse(valueString)
                Object.assign(this.data, { [propertyId]: value })
            }
            catch (error) {
                console.warn(`Failed to read villager property ${propertyId}:`, error)
            }
        }

        this.lastSavedTask = JSON.stringify(this.data.currentTask)
        this.lastSavedOpenedDoors = JSON.stringify(this.data.openedDoors ?? [])
    }

    private static delegatesInstalled = false

    private static installDelegates() {
        if (Villager.delegatesInstalled) {
            return
        }
        Villager.delegatesInstalled = true

        const names = [...Object.getOwnPropertyNames(Entity.prototype), "isDead", "unreachable"]

        for (const name of names) {
            if (name === "constructor" || name in Villager.prototype) {
                continue
            }

            const descriptor = Object.getOwnPropertyDescriptor(Entity.prototype, name)

            if (typeof descriptor?.value === "function") {
                Object.defineProperty(Villager.prototype, name, {
                    configurable: true,
                    value(this: Villager, ...args: unknown[]) {
                        return Reflect.apply(Reflect.get(this.entity, name) as () => unknown, this.entity, args)
                    }
                })
            }
            else {
                Object.defineProperty(Villager.prototype, name, {
                    configurable: true,
                    get(this: Villager) {
                        return Reflect.get(this.entity, name)
                    },
                    set(this: Villager, value: unknown) {
                        Reflect.set(this.entity, name, value)
                    }
                })
            }
        }
    }

    private static readonly BED_PROPERTY = "tektopia:bed"

    get hasBed(): boolean {
        return this.getBed() !== undefined
    }

    getBed(): BedInfo | undefined {
        const saved = this.entity.getDynamicProperty(Villager.BED_PROPERTY)

        if (typeof saved !== "string") {
            return undefined
        }

        try {
            const bed = JSON.parse(saved) as Partial<BedInfo> | null
            const location = bed?.location

            if (
                typeof bed?.home !== "string"
                || typeof location?.x !== "number"
                || typeof location.y !== "number"
                || typeof location.z !== "number"
            ) {
                return undefined
            }

            return { location: { x: location.x, y: location.y, z: location.z }, home: bed.home }
        }
        catch {
            return undefined
        }
    }

    claimBed(bed: BedInfo) {
        this.entity.setDynamicProperty(Villager.BED_PROPERTY, JSON.stringify(bed))
    }

    releaseBed() {
        this.entity.setDynamicProperty(Villager.BED_PROPERTY, undefined)
    }

    getViewDirection() {
        return this.entity.getViewDirection()
    }

    getVelocity() {
        return this.entity.getVelocity()
    }

    applyImpulse(...args: Parameters<Entity["applyImpulse"]>) {
        this.entity.applyImpulse(...args)
    }

    applyKnockback(...args: Parameters<Entity["applyKnockback"]>) {
        this.entity.applyKnockback(...args)
    }

    static fromEntity(entity: Entity) {
        const cached = villagerCache.get(entity.id)
        if (cached !== undefined) {
            return cached
        }

        const villager = new Villager(entity)
        villagerCache.set(entity.id, villager)
        return villager
    }

    static fromId(entityId: string) {
        const entity = world.getEntity(entityId)
        if (!entity?.isVillager) {
            return undefined
        }
        return entity instanceof Villager ? entity : Villager.fromEntity(entity)
    }

    lookAt(location: Vector3, ignoreY = false) {
        const entity = this
        const entityLocation = entity.location
        const dx = location.x - entityLocation.x
        const dy = location.y - entityLocation.y
        const dz = location.z - entityLocation.z
        const yaw = (Math.atan2(dz, dx) * (180 / Math.PI)) - 90
        const pitch = -Math.atan2(dy, Math.sqrt((dx * dx) + (dz * dz))) * (180 / Math.PI)
        entity.setRotation({ x: ignoreY ? entity.getRotation().x : pitch, y: yaw })
    }

    attack(target: Entity | Entity[]) {
        if (this.attackIntervalId !== undefined || system.currentTick < this.attackCooldownEndTick) {
            return
        }

        const targets = Array.isArray(target) ? [...target] : [target]
        if (targets.length === 0) {
            return
        }

        const villager = this

        const faceClosestTarget = () => {
            const villagerLocation = villager.location
            let closest: Entity | undefined
            let closestDistance = Infinity
            for (const entity of targets) {
                if (!entity.isValid) {
                    continue
                }
                const distance = calculateDistance(entity.location, villagerLocation)
                if (distance < closestDistance) {
                    closestDistance = distance
                    closest = entity
                }
            }
            if (closest === undefined) {
                return false
            }
            const closestLocation = closest.location
            villager.lookAt({ x: closestLocation.x, y: closestLocation.y + 1, z: closestLocation.z }, true)
            return true
        }

        if (!faceClosestTarget()) {
            return
        }

        villager.stopPath()
        villager.playAnimation("animation.tektopia_villager.hammer")

        let ticks = 0
        villager.attackIntervalId = system.runInterval(() => {
            ticks++

            if (!villager.isValid) {
                villager.finishAttack()
                return
            }

            faceClosestTarget()

            if (ticks < SWING_HIT_DELAY_TICKS) {
                return
            }

            const villagerLocation = villager.location
            for (const entity of targets) {
                if (!entity.isValid || calculateDistance(entity.location, villagerLocation) > ATTACK_RANGE) {
                    continue
                }
                entity.applyDamage(ATTACK_DAMAGE, {
                    cause: EntityDamageCause.entityAttack,
                    damagingEntity: villager.entity
                })
            }

            villager.finishAttack()
        })
    }

    private finishAttack() {
        if (this.attackIntervalId !== undefined) {
            system.clearRun(this.attackIntervalId)
            this.attackIntervalId = undefined
            this.attackCooldownEndTick = system.currentTick + ATTACK_COOLDOWN_TICKS
        }
    }

    private lastSavedTask?: string
    private lastSavedOpenedDoors?: string

    get currentTask(): VillagerTask | undefined {
        return this.data.currentTask
    }

    get happiness() {
        this.data.happiness ??= 100
        return this.data.happiness
    }

    addHappiness(value: number) {
        this.setHappiness((this.data.happiness ?? 100) + value)
    }

    setHappiness(value: number) {
        if (this.data.happiness === value) {
            return
        }
        const change = value - (this.data.happiness ?? 100)
        if (change < 0) {
            if (randomInt(0, 2) == 0) {
                this.playSound(ModSoundEvents.villagerAngry);
            }
        }
        else {
            if (randomInt(0, 6) == 0) {
                this.playSound(ModSoundEvents.villagerHappy);
            }
        }
        if (change < 0) {
            this.dimension.spawnParticle("minecraft:villager_angry", addVector(this.location, "y", 2.5))
        }
        else {
            this.dimension.spawnParticle("minecraft:villager_happy", addVector(this.location, "y", 2.5))
        }

        this.data.happiness = value
        this.saveVillagerData("happiness")
    }

    get knowledge() {
        this.data.knowledge ??= randomInt(0, 20)
        return this.data.knowledge
    }

    set knowledge(value) {
        if (this.data.knowledge === value) {
            return
        }
        this.data.knowledge = value
        this.saveVillagerData("knowledge")
    }

    get hunger() {
        this.data.hunger ??= 100
        return this.data.hunger
    }

    set hunger(value) {
        if (this.data.hunger === value) {
            return
        }
        this.data.hunger = value
        this.saveVillagerData("hunger")
    }

    set currentTask(value: VillagerTask | undefined) {
        this.data.currentTask = value
    }

    get openedDoors(): LocationString[] {
        return this.data.openedDoors ??= []
    }

    set openedDoors(value: LocationString[]) {
        this.data.openedDoors = value
    }

    private saveAllData() {
        this.saveTask()
        this.saveOpenedDoors()
    }

    private saveOpenedDoors() {
        const snapshot = JSON.stringify(this.openedDoors)
        if (snapshot === this.lastSavedOpenedDoors) {
            return
        }
        this.lastSavedOpenedDoors = snapshot
        this.saveVillagerData("openedDoors")
    }

    private saveTask() {
        const snapshot = JSON.stringify(this.currentTask)
        if (snapshot === this.lastSavedTask) {
            return
        }
        this.lastSavedTask = snapshot
        this.saveVillagerData("currentTask")
    }

    setAnimation(animation: string | undefined) {
        this.animation = animation
    }

    getAnimation() {
        return this.animation
    }

    getAllBlocksStandingOn(...args: Parameters<Entity["getAllBlocksStandingOn"]>) {
        return this.entity.getAllBlocksStandingOn(...args)
    }

    stopPath() { }

    getMoveSpeed(ignoreY = false) {
        const entityVelocity = this.entity.getVelocity()
        const { x, y, z } = entityVelocity
        return Math.sqrt((x * x) + (z * z) + (ignoreY ? 0 : y * y))
    }

    getVillage() {
        const entityLocation = this.location
        const entityDimension = this.dimension
        return entityDimension.getVillage(entityLocation)
    }

    getCurrentStructure(): Structure | undefined {
        const village = this.getVillage()
        if (village === undefined) {
            return undefined
        }
        const tile = locationToString(floorVector(addVector(this.location, "y", 0.1)))
        const structureLocation = village.penTiles.get(tile)
        if (structureLocation === undefined) {
            return undefined
        }
        return village.getStructure(stringToLocationCached(structureLocation))
    }

    getConfig() {
        return tektopiaVillagers[this.typeId]
    }

    bedTime(): BedTime {
        const sleepTime = this.getConfig()?.sleepTime

        if (sleepTime === undefined) {
            return "working"
        }

        const time = world.getTimeOfDay()

        if (isTimeInRange(time, sleepTime.startSleep, sleepTime.endSleep)) {
            return "sleep"
        }

        if (isTimeInRange(time, sleepTime.endSleep, sleepTime.working)) {
            return "waking"
        }

        if (isTimeInRange(time, sleepTime.tired, sleepTime.startSleep)) {
            return "tired"
        }

        return "working"
    }

    private getToolContext(village: Village) {
        const inventory = this.getInventory()
        if (inventory === undefined) {
            return undefined
        }

        const toolTypes = this.getToolTypes()
        if (toolTypes === undefined) {
            return undefined
        }

        const storageStructure = village.findStructures({ includedTypes: ["storage"] })[0]
        if (storageStructure === undefined) {
            return undefined
        }

        return { inventory, toolTypes, storageStructure, storage: village.storage }
    }

    getExtraTools(village: Village) {
        const toolContext = this.getToolContext(village)
        if (toolContext === undefined) {
            return []
        }

        const extraTools: ItemFilterResult[] = []

        for (const toolType of toolContext.toolTypes) {
            const villagerTools = toolContext.inventory
                .filterItems({ includesTypes: getToolItems(toolType) })

            const bestVillagerTool = getHighestRankedTool(villagerTools)

            if (bestVillagerTool !== undefined && villagerTools.length > 1) {
                extraTools.push(...villagerTools.filter(tool => tool.item !== bestVillagerTool.item))
            }
        }

        return extraTools
    }

    checkDepositToolTask(village: Village) {
        const toolContext = this.getToolContext(village)
        if (toolContext === undefined) {
            return false
        }

        const extraTools = this.getExtraTools(village)

        if (extraTools.length === 0) {
            return false
        }

        return true
    }

    checkGetToolTask(village: Village) {
        const toolContext = this.getToolContext(village)
        if (toolContext === undefined) {
            return false
        }

        const toolUpgrades: ToolUpgradePlan[] = []

        for (const toolType of toolContext.toolTypes) {
            const toolItems = getToolItems(toolType)

            const bestVillagerTool = getHighestRankedTool(
                toolContext.inventory.filterItems({ includesTypes: toolItems })
            )
            const bestVillagerToolRank = bestVillagerTool?.item.getToolRank() ?? -1

            const bestAvailableTool = getHighestRankedTool(
                toolContext.storage.filterItems({ includesTypes: toolItems })
            )
            const bestAvailableToolRank = bestAvailableTool?.item.getToolRank() ?? -1

            if (bestAvailableTool !== undefined && bestAvailableToolRank > bestVillagerToolRank) {
                toolUpgrades.push({
                    newId: bestAvailableTool.item.typeId,
                    oldId: bestVillagerTool?.item.typeId
                })
            }
        }

        if (toolUpgrades.length === 0) {
            return false
        }

        this.taskContext.toolUpgrades = toolUpgrades
        return true
    }

    canCraftTaskItem(village: Village, itemId: string, amount = 1) {
        const storageStructure = village.findStructures({ includedTypes: ["storage"] })[0]
        if (storageStructure === undefined || storageStructure.getCraftingTables().length === 0) {
            return false
        }

        return village.storage.canCraft(itemId, amount, { smelting: storageStructure.getFurnaces().length > 0 })
    }

    /**
     * Crafts a missing task item by running the crafting flow inside the current task.
     * Returns true while crafting is in progress (or just finished and needs re-checking),
     * false if the item can't be crafted (or crafting already failed once for this task).
     */
    craftTaskItem(village: Village, itemId: string, minAmount: number, targetAmount = minAmount) {
        const context = this.taskContext
        const craft = context.toolCraft

        if (craft === undefined) {
            const attempted = context.craftedTaskItems ??= []
            if (attempted.includes(itemId) || !this.canCraftTaskItem(village, itemId, minAmount)) {
                return false
            }

            // Craft as many as storage allows up to the full target (e.g. 16 torches), not just the minimum
            const smelting = (village.findStructures({ includedTypes: ["storage"] })[0]?.getFurnaces().length ?? 0) > 0
            const amount = Math.max(minAmount, village.storage.getMaxCrafts(itemId, Math.max(minAmount, targetAmount), { smelting }))

            attempted.push(itemId)
            context.toolCraft = { itemId, amount }
            return true
        }

        return this.continueTaskItemCrafting(village)
    }

    /**
     * Keeps running a crafting plan that was started for a task item. Once started, the villager
     * is locked into it until the whole plan is done (or fails), so it doesn't stop after the first
     * batch (e.g. 4 of 16 torches) once the task's minimum is met and leave intermediates behind.
     * Returns true while the villager is busy crafting.
     */
    continueTaskItemCrafting(village: Village) {
        if (this.taskContext.toolCraft === undefined) {
            return false
        }

        if (!this.isWaiting) {
            this.tickCraftToolTask(village)
        }
        return true
    }

    /**
     * Ends the current craft (finished or failed) and resets anything the crafting animation left behind.
     * The normal item check decides whether it worked.
     */
    private finishToolCraft() {
        const craft = this.taskContext.toolCraft
        if (craft !== undefined && this.taskContext.smelts !== undefined) {
            delete this.taskContext.smelts[craft.itemId]
        }
        this.taskContext.toolCraft = undefined
        // The plan, items and doneSteps belong to the craft that just ended, so a later craft in the same task must start fresh
        this.taskCache.toolCraft = undefined
        this.stopPath()
        this.setAnimation(undefined)
        this.holdingItem = undefined
        this.taskProgress = 0
    }

    checkCraftToolTask(village: Village) {
        const toolContext = this.getToolContext(village)
        if (toolContext === undefined) {
            return false
        }

        if (toolContext.storageStructure.getCraftingTables().length === 0) {
            return false
        }

        for (const toolType of toolContext.toolTypes) {
            const toolItems = getToolItems(toolType)

            const hasVillagerTool = toolContext.inventory.filterItems({ includesTypes: toolItems }).length > 0
            if (hasVillagerTool) {
                continue
            }

            const hasAvailableTool = toolContext.storage.filterItems({ includesTypes: toolItems }).length > 0
            if (hasAvailableTool) {
                continue
            }

            const toolCraftingMaterial = upgradableToolTypes.includes(toolType as UpgradableToolType) ? "wooden" : armorTypes.includes(toolType as ArmorType) ? "leather" : undefined
            if (toolCraftingMaterial === undefined) {
                continue
            }

            const craftingId = `minecraft:${toolCraftingMaterial}_${toolType}`

            if (toolContext.storage.canCraft(craftingId, 1, { smelting: toolContext.storageStructure.getFurnaces().length > 0 })) {
                this.taskContext.toolCraft = { itemId: craftingId }
                return true
            }
        }

        return false
    }

    getBestTool(toolType: VillagerToolType) {
        const villagerInventory = this.getInventory()
        if (villagerInventory === undefined) {
            return undefined
        }

        const toolItems = getToolItems(toolType)

        const villagerTools = villagerInventory
            .filterItems({ includesTypes: toolItems })

        return getHighestRankedTool(villagerTools)
    }

    checkDepositTask(village: Village) {
        const villagerConfig = this.getConfig()
        if (villagerConfig === undefined) {
            return false
        }

        const villagerInventory = this.getInventory()
        if (villagerInventory === undefined) {
            return false
        }

        const depositPlan = villagerConfig.depositItems(villagerInventory)
        if (depositPlan === undefined) {
            return false
        }

        const villageStorage = village.storage

        const canDeposit: DepositPlan = {}
        for (const [itemId, amount] of Object.entries(depositPlan)) {
            const items = villagerInventory.filterItems({ includesTypes: [itemId] }).map(itemObject => itemObject.item)
            for (const item of items) {
                const itemClone = item.clone()
                itemClone.amount = Math.min(amount, itemClone.amount)
                const newAmount = villageStorage.getRoomFor(itemClone)
                if (newAmount > 0) {
                    canDeposit[itemClone.typeId] = (canDeposit[itemClone.typeId] ?? 0) + newAmount
                }
            }
        }

        if (Object.keys(canDeposit).length === 0) {
            return false
        }

        this.taskContext.depositPlan = canDeposit

        return true
    }

    getInventory() {
        return this.getComponent(EntityComponentTypes.Inventory)?.container
    }

    findOre(village: Village, preferredOres?: readonly LocationString[], maxStandDistance?: number) {
        const takenOres = new Set<string>()
        for (const villager of world.getVillagers()) {
            if (villager.id === this.id) {
                continue
            }
            const ore = villager.taskContext.ore
            if (ore !== undefined) {
                for (const key of ore.ores) {
                    takenOres.add(key)
                }
            }
        }

        const origin = this.location
        let closestOre: typeof this.taskContext.ore
        let closestDistance = Infinity
        const preferredKeys = preferredOres === undefined ? undefined : new Set(preferredOres)
        const checkedOres = new Set<LocationString>()

        for (const key of village.oreLocations) {
            if (checkedOres.has(key)) {
                continue
            }

            const ores = village.getOreVein(key)
            for (const oreKey of ores) {
                checkedOres.add(oreKey)
            }
            if (ores.length === 0 || (preferredKeys !== undefined && !ores.some(oreKey => preferredKeys.has(oreKey)))) {
                continue
            }
            if (ores.some(oreKey => takenOres.has(oreKey))) {
                continue
            }

            for (const oreKey of ores) {
                const location = stringToLocation(oreKey)
                const stand = village.findOreStandLocation(location)
                if (stand === undefined) {
                    continue
                }
                const distance = calculateDistance(origin, centerVector(stand, true))
                if (maxStandDistance !== undefined && distance >= maxStandDistance) {
                    continue
                }
                if (distance < closestDistance) {
                    closestOre = { start: stand, ores }
                    closestDistance = distance
                }
            }
        }

        if (closestOre === undefined) {
            return false
        }

        this.taskContext.ore = closestOre
        return true
    }

    findTree(village: Village) {
        const takenTrees = new Set<string>()
        for (const villager of world.getVillagers()) {
            if (villager.id === this.id) {
                continue
            }
            const tree = villager.taskContext.tree
            if (tree !== undefined) {
                takenTrees.add(locationToString(tree))
            }
        }

        const closestTree = village.treeLocations.nearestTo(this.location, key => takenTrees.has(key))

        if (closestTree === undefined) {
            return false
        }

        this.taskContext.tree = closestTree
        return true
    }

    findGrowableCrop(village: Village) {
        const takenGrowableCropLocations = new Set<string>()
        for (const villager of world.getVillagers()) {
            if (villager.id === this.id) {
                continue
            }
            const growableCropLocation = villager.taskContext.growableCrop
            if (growableCropLocation !== undefined) {
                takenGrowableCropLocations.add(locationToString(growableCropLocation))
            }
        }

        let bestGrowableCropLocation: Vector3 | undefined
        let bestNeighborhoodCount = -1
        let bestDistance = Infinity

        for (const key of village.growLocations) {
            if (takenGrowableCropLocations.has(key)) {
                continue
            }

            const location = stringToLocationCached(key)
            let neighborCount = 0
            for (let x = -1; x <= 1; x++) {
                for (let z = -1; z <= 1; z++) {
                    if (village.growLocations.has(locationToString({
                        x: location.x + x,
                        y: location.y,
                        z: location.z + z
                    }))) {
                        neighborCount++
                    }
                }
            }

            const distance = calculateDistance(this.location, location)
            if (neighborCount > bestNeighborhoodCount || (neighborCount === bestNeighborhoodCount && distance < bestDistance)) {
                bestGrowableCropLocation = location
                bestNeighborhoodCount = neighborCount
                bestDistance = distance
            }
        }

        if (bestGrowableCropLocation === undefined) {
            return false
        }

        this.taskContext.growableCrop = bestGrowableCropLocation
        return true
    }

    private validateMineFrame(village: Village, block: Block): { rotation: CardinalDirection, doorLocation: Vector3 } | undefined {
        if (
            !block.isValid
            || block.getFrameItem()?.typeId !== "tektopia:structure_mineshaft"
        ) {
            return undefined
        }

        const rotation = getItemFrameRotation(block.permutation.getState("facing_direction"))
        if (rotation === undefined) {
            return undefined
        }

        const validation = village.dimension.validateStructure(
            block,
            rotation,
            "mineshaft",
            true
        )
        let step = validation.next()
        while (!step.done) {
            step = validation.next()
        }

        const result = step.value
        if (
            result.result === true
            && result.village === village
            && result.doorLocation !== undefined
        ) {
            return { rotation, doorLocation: result.doorLocation }
        }
        return undefined
    }

    findMine(village: Village, includeInactiveMines = false, prioritizeDeepMines = false) {
        const takenMines = new Set<string>()
        const villagers = world.getVillagers()
        for (const villager of villagers) {
            if (villager.id === this.id) {
                continue
            }
            const mine = villager.taskContext.mine
            if (mine !== undefined) {
                takenMines.add(locationToString(mine.location))
            }
        }

        const villagerLocation = this.location
        let closestMine: typeof this.taskContext.mine
        let minDist = Infinity
        let closestInactiveMine: typeof this.taskContext.mine
        let minInactiveDist = Infinity
        let deepestMine: typeof this.taskContext.mine
        let deepestMineDepth = 0
        let deepestMineDist = Infinity
        const consideredMines = new Set<string>()

        const considerMine = (location: Vector3, rotation: CardinalDirection, inactive = false) => {
            const locationString = locationToString(location)
            if (takenMines.has(locationString) || consideredMines.has(locationString)) {
                return
            }

            consideredMines.add(locationString)
            const dist = calculateDistance(villagerLocation, location)

            if (prioritizeDeepMines) {
                const mineBlock = getMineshaftMineBlock(village.dimension, location, rotation, false)
                if (mineBlock === undefined) {
                    return
                }
                const firstMineColumn = addVectors(location, directionToVector(rotation))
                const depth = calculateDistance(mineBlock.location, firstMineColumn, true)
                if (depth <= 0) {
                    return
                }
                if (depth > deepestMineDepth || (depth === deepestMineDepth && dist < deepestMineDist)) {
                    deepestMineDepth = depth
                    deepestMineDist = dist
                    deepestMine = { location, rotation }
                }
                return
            }

            if (inactive && dist < minInactiveDist) {
                minInactiveDist = dist
                closestInactiveMine = { location, rotation }
            }
            else if (!inactive && dist < minDist) {
                minDist = dist
                closestMine = { location, rotation }
            }
        }

        const mineshaftStructures = village.findStructures({ includedTypes: ["mineshaft"] })
        for (const mineshaft of mineshaftStructures) {
            considerMine(mineshaft.location, mineshaft.rotation)
        }

        if (includeInactiveMines) {
            for (const itemFrame of world.itemFrameList) {
                if (
                    itemFrame.dimensionId !== village.dimensionId
                    || (itemFrame.structureId !== undefined && itemFrame.structureId !== "mineshaft")
                ) {
                    continue
                }

                const block = village.dimension.getBlockSafe(itemFrame.location)
                if (block === undefined) {
                    continue
                }

                const validMine = this.validateMineFrame(village, block)
                if (validMine !== undefined) {
                    considerMine(validMine.doorLocation, validMine.rotation, true)
                }
            }
        }

        if (prioritizeDeepMines) {
            if (deepestMine === undefined) {
                return false
            }

            this.taskContext.mine = deepestMine
            return true
        }

        if (includeInactiveMines && closestInactiveMine !== undefined) {
            closestMine = closestInactiveMine
        }

        if (closestMine === undefined) {
            return false
        }

        this.taskContext.mine = closestMine
        return true
    }

    findGuardPost(village: Village) {
        const takenGuardPosts = new Set<string>()
        const villagers = world.getVillagers()
        for (const villager of villagers) {
            if (villager.id === this.id) {
                continue
            }
            const guardPost = villager.taskContext.guardPost
            if (guardPost !== undefined) {
                takenGuardPosts.add(locationToString(guardPost))
            }
        }

        const villagerLocation = this.location
        let closestGuardPost: Vector3 | undefined
        let minDist = Infinity

        const guardPostStructures = village.findStructures({ includedTypes: ["guard_post"] })
        for (const guardPost of guardPostStructures) {
            if (takenGuardPosts.has(guardPost.locationString)) {
                continue
            }
            const dist = calculateDistance(villagerLocation, guardPost.location)
            if (dist < minDist) {
                minDist = dist
                closestGuardPost = guardPost.location
            }
        }

        if (closestGuardPost === undefined) {
            return false
        }

        this.taskContext.guardPost = closestGuardPost
        return true
    }

    checkCookTask(village: Village) {
        const villageStorage = village.storage

        const kitchenStructure = village.findStructures({ includedTypes: ["kitchen"] })[0]
        if (kitchenStructure === undefined) {
            this.cancelTask()
            return false
        }

        const availableCounts = villageStorage.getItemCounts()

        const cookingCraftingIds = [
            "minecraft:golden_apple",
            "minecraft:golden_carrot",
            "minecraft:beetroot_soup",
            "minecraft:baked_potato",
            "minecraft:cake",
            "minecraft:bread",
            "minecraft:pumpkin_pie",
            "minecraft:cookie",
            "minecraft:cooked_beef",
            "minecraft:cooked_porkchop",
            "minecraft:cooked_chicken",
            "minecraft:cooked_mutton"
        ]

        const hasFurnace = kitchenStructure.getFurnaces().length > 0
        const hasCraftingTable = kitchenStructure.getCraftingTables().length > 0

        const counts = cookingCraftingIds.flatMap(itemId => {
            const craftingPlan = getCraftingPlan(itemId, { ...availableCounts, [itemId]: 0 }, 1, { smelting: hasFurnace })
            if (!hasStationsFor(craftingPlan, hasCraftingTable)) {
                return []
            }

            return [{ itemId, count: availableCounts[itemId] ?? 0 }]
        }).sort((a, b) => a.count - b.count)

        const lowestCount = counts[0]?.count

        if (lowestCount === undefined) {
            return false
        }

        const jobs: BatchJob[] = []

        outer: for (const item of counts) {
            if (item.count - lowestCount > 16) {
                continue
            }

            const itemId = item.itemId
            // Plan against what is left after earlier plans, so they can't all claim the same materials
            const craftingPlan = getCraftingPlan(itemId, { ...availableCounts, [itemId]: 0 }, 1, { smelting: hasFurnace })
            if (hasStationsFor(craftingPlan, hasCraftingTable)) {
                const required = getRequiredItems(craftingPlan)
                for (const [requiredId, amount] of Object.entries(required)) {
                    availableCounts[requiredId] = (availableCounts[requiredId] ?? 0) - amount
                }
                // Items that are already well stocked get smaller batches, so the cook keeps the stock balanced
                const maxAmount = Math.min(MAX_COOKED_BATCH, lowestCount + 16 - item.count)
                jobs.push(createBatchJob(itemId, maxAmount, craftingPlan, required))
                if (jobs.length >= 5) {
                    break outer
                }
            }
        }

        if (jobs.length === 0) {
            return false
        }

        growBatches(jobs, availableCounts, hasFurnace, this.getInventory()?.emptySlotsCount ?? Infinity)

        this.taskContext.cooking = jobs.map(job => job.itemId)
        this.taskContext.cookingAmounts = Object.fromEntries(jobs.map(job => [job.itemId, job.amount]))

        return true
    }

    checkSmithTask(village: Village) {
        const villageStorage = village.storage

        const blacksmithStructure = village.findStructures({ includedTypes: ["blacksmith"] })[0]
        if (blacksmithStructure === undefined) {
            this.cancelTask()
            return false
        }

        const availableCounts = villageStorage.getItemCounts()

        const hasFurnace = blacksmithStructure.getFurnaces().length > 0

        const counts = smithingCraftingIds.flatMap(itemIds => {
            const bestOwnedIndex = itemIds.findIndex(itemId => (availableCounts[itemId] ?? 0) > 0)
            let allowedIds = itemIds
            let count = 0
            if (bestOwnedIndex !== -1) {
                const bestOwnedId = itemIds[bestOwnedIndex]
                if (bestOwnedId === undefined) {
                    return []
                }
                count = availableCounts[bestOwnedId] ?? 0
                if (count >= MAX_SMITHED_PER_ITEM) {
                    return []
                }

                allowedIds = itemIds.slice(0, bestOwnedIndex + 1)
            }

            const craftable = allowedIds.some(itemId => {
                const craftingPlan = getCraftingPlan(itemId, { ...availableCounts, [itemId]: 0 }, 1, { smelting: hasFurnace })
                return craftingPlan !== undefined && craftingPlan.length > 0
            })
            if (!craftable) {
                return []
            }

            return [{ itemIds: allowedIds, count }]
        }).map(entry => ({ ...entry, tie: Math.random() })).sort((a, b) => {
            if (a.count !== b.count) {
                return a.count - b.count
            }
            return a.tie - b.tie
        })

        const lowestCount = counts[0]?.count

        if (lowestCount === undefined) {
            return false
        }

        // Stock as it is now, because availableCounts shrinks as materials get reserved below
        const stockCounts = { ...availableCounts }
        const jobs: BatchJob[] = []

        outer: for (const item of counts) {
            if (item.count - lowestCount > 2) {
                continue
            }

            const itemIds = item.itemIds
            for (const itemId of itemIds) {
                const craftingPlan = getCraftingPlan(itemId, { ...availableCounts, [itemId]: 0 }, 1, { smelting: hasFurnace })
                if (craftingPlan !== undefined && craftingPlan.length > 0) {
                    const required = getRequiredItems(craftingPlan)
                    for (const [requiredId, amount] of Object.entries(required)) {
                        availableCounts[requiredId] = (availableCounts[requiredId] ?? 0) - amount
                    }
                    // Never craft past the stock limit for this item
                    const maxAmount = Math.min(MAX_SMITHED_BATCH, MAX_SMITHED_PER_ITEM - (stockCounts[itemId] ?? 0))
                    jobs.push(createBatchJob(itemId, maxAmount, craftingPlan, required))
                    if (jobs.length >= 5) {
                        break outer
                    }
                    break
                }
            }
        }

        if (jobs.length === 0) {
            return false
        }

        growBatches(jobs, availableCounts, hasFurnace, this.getInventory()?.emptySlotsCount ?? Infinity)

        this.taskContext.smithing = jobs.map(job => job.itemId)
        this.taskContext.smithingAmounts = Object.fromEntries(jobs.map(job => [job.itemId, job.amount]))

        return true
    }

    findSapling(village: Village) {
        const takenSaplings = new Set<string>()
        for (const villager of world.getVillagers()) {
            if (villager.id === this.id) {
                continue
            }
            const saplingLocation = villager.taskContext.sapling
            if (saplingLocation !== undefined) {
                takenSaplings.add(locationToString(saplingLocation))
            }
        }

        const closestHarvestLocation = village.saplingLocations.nearestTo(this.location, key => takenSaplings.has(key))

        if (closestHarvestLocation === undefined) {
            return false
        }

        this.taskContext.sapling = closestHarvestLocation
        return true
    }

    findHarvestLocation(village: Village) {
        const takenHarvestLocations = new Set<string>()
        for (const villager of world.getVillagers()) {
            if (villager.id === this.id) {
                continue
            }
            const harvestLocation = villager.taskContext.harvestLocation
            if (harvestLocation !== undefined) {
                takenHarvestLocations.add(locationToString(harvestLocation))
            }
        }

        const closestHarvestLocation = village.harvestLocations.nearestTo(this.location, key => takenHarvestLocations.has(key))

        if (closestHarvestLocation === undefined) {
            return false
        }

        this.taskContext.harvestLocation = closestHarvestLocation
        return true
    }

    findButcherStructure(village: Village) {
        const takenButcherStructures = new Set<string>()
        const villagers = world.getVillagers()
        for (const villager of villagers) {
            if (villager.id === this.id) {
                continue
            }
            const butcherStructure = villager.taskContext.butcherStructure
            if (butcherStructure !== undefined) {
                takenButcherStructures.add(locationToString(butcherStructure))
            }
        }

        const villagerLocation = this.location
        let closestButcherStructure: Vector3 | undefined
        let minDist = Infinity

        const butcherStructureStructures = village.findStructures({ includedTypes: ["butcher"] })
        for (const butcherStructure of butcherStructureStructures) {
            if (takenButcherStructures.has(butcherStructure.locationString)) {
                continue
            }
            const dist = calculateDistance(villagerLocation, butcherStructure.location)
            if (dist < minDist) {
                minDist = dist
                closestButcherStructure = butcherStructure.location
            }
        }

        if (closestButcherStructure === undefined) {
            return false
        }

        this.taskContext.butcherStructure = closestButcherStructure
        return true
    }

    findFullPen(village: Village) {
        const takenAnimalPen = new Set<string>()
        const villagers = world.getVillagers()
        for (const villager of villagers) {
            if (villager.id === this.id) {
                continue
            }
            const animalPen = villager.taskContext.fullAnimalPen
            if (animalPen !== undefined) {
                takenAnimalPen.add(locationToString(animalPen))
            }
        }

        const villagerLocation = this.location
        let closestAnimalPen: Vector3 | undefined
        let minDist = Infinity

        const animalPenStructures = village.findStructures({ includedTypes: ["pig_pen", "chicken_coop", "sheep_pen", "cow_pen"] })
        for (const animalPen of animalPenStructures) {
            if (takenAnimalPen.has(animalPen.locationString) || !animalPen.isFull || animalPen.getAnimalCount(true) <= 2) {
                continue
            }
            if (this.isPenSkipped(animalPen.locationString) || this.pickButcherEntity(village, animalPen) === undefined) {
                continue
            }
            const dist = calculateDistance(villagerLocation, animalPen.location)
            if (dist < minDist) {
                minDist = dist
                closestAnimalPen = animalPen.location
            }
        }

        if (closestAnimalPen === undefined) {
            return false
        }

        this.taskContext.fullAnimalPen = closestAnimalPen
        return true
    }

    findShearableEntity(village: Village) {
        const takenRanchEntities = new Set<string>()
        for (const villager of world.getVillagers()) {
            if (villager.id === this.id) {
                continue
            }
            const ranchEntity = villager.taskContext.shearableEntity
            if (ranchEntity !== undefined) {
                takenRanchEntities.add(ranchEntity.id)
            }
        }

        let closestEntity
        let closestDistance = Infinity

        for (const [entityId, entityData] of Object.entries(village.ranchEntities)) {
            if (takenRanchEntities.has(entityId) || !entityData.isShearable || !entityData.inPen) {
                continue
            }

            if (entityData.structure !== undefined && this.isPenSkipped(entityData.structure)) {
                continue
            }

            const distance = calculateDistance(entityData.location, this.location)

            if (distance < closestDistance) {
                closestDistance = distance
                closestEntity = { ...entityData, id: entityId }
            }
        }

        if (closestEntity === undefined) {
            return false
        }

        this.taskContext.shearableEntity = closestEntity
        return true
    }

    findMilkableEntity(village: Village) {
        const takenRanchEntities = new Set<string>()
        for (const villager of world.getVillagers()) {
            if (villager.id === this.id) {
                continue
            }
            const ranchEntity = villager.taskContext.milkableEntity
            if (ranchEntity !== undefined) {
                takenRanchEntities.add(ranchEntity.id)
            }
        }

        let closestEntity
        let closestDistance = Infinity

        for (const [entityId, entityData] of Object.entries(village.ranchEntities)) {
            if (takenRanchEntities.has(entityId) || !entityData.isMilkable || !entityData.inPen) {
                continue
            }

            if (entityData.structure !== undefined && this.isPenSkipped(entityData.structure)) {
                continue
            }

            const distance = calculateDistance(entityData.location, this.location)

            if (distance < closestDistance) {
                closestDistance = distance
                closestEntity = { ...entityData, id: entityId }
            }
        }

        if (closestEntity === undefined) {
            return false
        }

        this.taskContext.milkableEntity = closestEntity
        return true
    }

    findBreedableEntity(village: Village) {
        const takenRanchEntities = new Set<string>()
        for (const villager of world.getVillagers()) {
            if (villager.id === this.id) {
                continue
            }
            if (villager.taskContext.breedableEntity !== undefined) {
                takenRanchEntities.add(villager.taskContext.breedableEntity.id)
            }
            if (villager.taskContext.breedableMate !== undefined) {
                takenRanchEntities.add(villager.taskContext.breedableMate.id)
            }
        }

        let closestEntity: (VillageRanchEntity & { id: string }) | undefined
        let closestMate: (VillageRanchEntity & { id: string }) | undefined
        let closestDistance = Infinity

        const isCandidate = (entityId: string, entityData: VillageRanchEntity) =>
            !takenRanchEntities.has(entityId)
            && entityData.inPen
            && entityData.breedable
            && entityData.structure !== undefined
            && !this.isPenSkipped(entityData.structure)

        for (const [entityId, entityData] of Object.entries(village.ranchEntities)) {
            if (!isCandidate(entityId, entityData) || entityData.structure === undefined) {
                continue
            }

            const structure = village.getStructure(stringToLocation(entityData.structure))

            if (!(structure instanceof AnimalPen)) {
                continue
            }

            if (structure.isFull || structure.isUnderpopulated) {
                continue
            }

            const distance = calculateDistance(entityData.location, this.location)

            if (distance >= closestDistance) {
                continue
            }

            let mate: (VillageRanchEntity & { id: string }) | undefined
            let mateDistance = Infinity
            for (const [mateId, mateData] of Object.entries(village.ranchEntities)) {
                if (
                    mateId === entityId
                    || !isCandidate(mateId, mateData)
                    || mateData.typeId !== entityData.typeId
                    || mateData.structure !== entityData.structure
                ) {
                    continue
                }
                const distanceToEntity = calculateDistance(mateData.location, entityData.location)
                if (distanceToEntity < mateDistance) {
                    mateDistance = distanceToEntity
                    mate = { ...mateData, id: mateId }
                }
            }

            if (mate === undefined) {
                continue
            }

            closestDistance = distance
            closestEntity = { ...entityData, id: entityId }
            closestMate = mate
        }

        if (closestEntity === undefined || closestMate === undefined) {
            return false
        }

        this.taskContext.breedableEntity = closestEntity
        this.taskContext.breedableMate = closestMate
        return true
    }

    findHerdEntity(village: Village) {
        const takenRanchEntities = new Set<string>()
        for (const villager of world.getVillagers()) {
            if (villager.id === this.id) {
                continue
            }
            const ranchEntity = villager.taskContext.herdEntity
            if (ranchEntity !== undefined) {
                takenRanchEntities.add(ranchEntity.id)
            }
        }

        let closestEntity
        let closestDistance = Infinity

        for (const [entityId, entityData] of Object.entries(village.ranchEntities)) {
            if (takenRanchEntities.has(entityId) || entityData.inPen) {
                continue
            }

            const structureType = entityStructures[entityData.typeId]
            if (structureType === undefined) {
                continue
            }

            const structures = village.findStructures({ includedTypes: [structureType] })

            let foundStructure = false
            for (const structure of structures) {
                if ((structure.isUnderpopulated || entityData.villagerEntity) && !structure.isFull && !this.isPenSkipped(structure.locationString)) {
                    foundStructure = true
                    break
                }
            }

            if (!foundStructure) {
                continue
            }

            const distance = calculateDistance(entityData.location, this.location)

            if (distance < closestDistance) {
                closestDistance = distance
                closestEntity = { ...entityData, id: entityId }
            }
        }

        if (closestEntity === undefined) {
            return false
        }

        this.taskContext.herdEntity = closestEntity
        return true
    }

    findTillLocation(village: Village) {
        const takenTillLocations = new Set<string>()
        for (const villager of world.getVillagers()) {
            if (villager.id === this.id) {
                continue
            }
            const tillLocation = villager.taskContext.tillLocation
            if (tillLocation !== undefined) {
                takenTillLocations.add(locationToString(tillLocation))
            }
        }

        const closestTillLocation = village.tillLocations.nearestTo(this.location, key => takenTillLocations.has(key))

        if (closestTillLocation === undefined) {
            return false
        }

        this.taskContext.tillLocation = closestTillLocation
        return true
    }

    canGetSeedFor(village: Village, cropType: string) {
        const seedId = cropSeeds[cropType]
        if (seedId === undefined) {
            return false
        }

        const villagerInventory = this.getInventory()
        if (villagerInventory?.hasItem({ includesTypes: [seedId] }) === true) {
            return true
        }

        if (village.storage.findItems({ includesTypes: [seedId] }, 1).length > 0) {
            return true
        }

        return this.canCraftTaskItem(village, seedId, 1)
    }

    findPlantLocation(village: Village) {
        const takenPlantLocation = new Set<string>()
        const villagers = world.getVillagers()
        for (const villager of villagers) {
            if (villager.id === this.id) {
                continue
            }
            const plantLocation = villager.taskContext.plant
            if (plantLocation !== undefined) {
                takenPlantLocation.add(locationToString(plantLocation.location))
            }
        }

        const villagerLocation = this.location
        let closestPlant: {
            location: Vector3
            type: string
        } | undefined
        let minDist = Infinity

        // Cache seed availability per crop type so we only check inventory/storage once per type
        const seedAvailability = new Map<string, boolean>()
        const canGetSeedFor = (type: string) => {
            let available = seedAvailability.get(type)
            if (available === undefined) {
                available = this.canGetSeedFor(village, type)
                seedAvailability.set(type, available)
            }
            return available
        }

        for (const [plantLocationStr, type] of Object.entries(village.plantLocations)) {
            if (takenPlantLocation.has(plantLocationStr)) {
                continue
            }

            // No seeds for this crop anywhere (inventory or village storage): skip it
            // and fall through to the closest spot we *can* plant instead of giving up.
            if (!canGetSeedFor(type)) {
                continue
            }

            const plantLocationLocation = stringToLocationCached(plantLocationStr as LocationString)
            const dist = calculateDistance(villagerLocation, plantLocationLocation)
            if (dist < minDist) {
                minDist = dist
                closestPlant = { location: { ...plantLocationLocation }, type }
            }
        }

        if (closestPlant === undefined) {
            return false
        }

        this.taskContext.plant = closestPlant
        return true
    }

    checkEatFood(village: Village) {
        if (this.hunger > 30) {
            return false
        }

        const villagerInventory = this.getInventory()
        if (villagerInventory === undefined) {
            return false
        }

        const foodItems = villagerInventory.filterItems({
            includesTypes: Object.keys(Registry.eatableTypes)
        })

        if (foodItems.length > 0) {
            return true
        }

        const villageStorage = village.storage

        const storageFoodItems = villageStorage.filterItems({
            includesTypes: Object.keys(Registry.eatableTypes)
        })

        return storageFoodItems.length > 0
    }

    getBestFoodItem(itemList: ItemStack[]) {
        const bestFood = itemList.reduce((best, current) =>
            this.getFoodScore(current) > this.getFoodScore(best)
                ? current
                : best
        )

        return bestFood
    }

    getFoodScore(itemStack: ItemStack) {
        const foodData = Registry.eatableTypes[itemStack.typeId]
        if (foodData === undefined) {
            return -Infinity
        }

        return foodData.happiness
    }

    findItem(village: Village) {
        let pickupItems = this.getConfig()?.pickupItems
        if (pickupItems === undefined) {
            this.taskContext.item = undefined
            return false
        }

        pickupItems = resolvePickupItems(pickupItems)

        const villagerLocation = this.location
        const nearbyItems = this.dimension.getEntities({
            type: "item",
            location: villagerLocation,
            maxDistance: 9
        })

        let closestItem: Entity | undefined
        let bestDist = Infinity
        for (const item of nearbyItems) {
            if ((!item.isOnGround && !item.isInWater) || item.unreachable > 0) {
                continue
            }

            if (!village.isInBounds(item.location)) {
                continue
            }

            const stack = item.getComponent(EntityComponentTypes.Item)?.itemStack
            if (stack === undefined || !pickupItems.includes(stack.typeId)) {
                continue
            }

            const dist = calculateDistance(item.location, villagerLocation)
            if (dist < bestDist) {
                bestDist = dist
                closestItem = item
            }
        }

        if (closestItem === undefined) {
            return false
        }

        this.taskContext.item = closestItem.id
        return true
    }

    saveData(...args: Parameters<Entity["saveData"]>) {
        this.entity.saveData(...args)
    }

    private saveVillagerData<K extends keyof VillagerData>(propertyId: K) {
        if (!this.entity.isValid) {
            return
        }
        this.entity.setDynamicProperty(`tektopia:${propertyId}`, JSON.stringify(this.data[propertyId]))
    }

    private beginPathProgress(getTarget: () => Vector3) {
        const now = system.currentTick
        const targetLocation = getTarget()
        const previous = this.pathProgress

        const isSameWalk = previous !== undefined
            && previous.task === this.currentTask?.id
            && now - previous.lastActiveTick <= PATH_PROGRESS_REUSE_GAP_TICKS
            && calculateDistance(previous.targetLocation, targetLocation) <= PATH_PROGRESS_MARGIN

        if (isSameWalk) {
            previous.getTarget = getTarget
            previous.targetLocation = targetLocation
            previous.lastActiveTick = now
            return
        }

        this.pathProgress = {
            task: this.currentTask?.id,
            getTarget,
            targetLocation,
            best: calculateDistance(this.location, targetLocation),
            lastImprovementTick: now,
            lastActiveTick: now
        }
    }

    private checkPathProgress() {
        const tracker = this.pathProgress
        if (tracker === undefined) {
            return
        }
        if (!this.isPathing) {
            return
        }

        const now = system.currentTick
        tracker.lastActiveTick = now
        tracker.targetLocation = tracker.getTarget()

        const distance = calculateDistance(this.location, tracker.targetLocation)
        if (distance < PATH_PROGRESS_ARRIVED_DISTANCE || distance < tracker.best - PATH_PROGRESS_MARGIN) {
            tracker.best = Math.min(tracker.best, distance)
            tracker.lastImprovementTick = now
            return
        }

        if (now - tracker.lastImprovementTick >= PATH_PROGRESS_WINDOW_TICKS) {
            this.pathProgress = undefined
            this.pathError = "timeout"
            this.stopPath()
        }
    }

    pathFindTo(target: PathTarget) {
        const villager = this
        if (villager.isPathing) {
            return
        }

        if (isEntityTarget(target) && !target.isValid) {
            return
        }
        const targetId = isEntityTarget(target) ? target.id : undefined
        let lastTargetLocation: Vector3 = isEntityTarget(target) ? target.location : target
        const getTargetLocation = () => {
            if (isEntityTarget(target) && target.isValid) {
                lastTargetLocation = target.location
            }
            return lastTargetLocation
        }

        const village = villager.getVillage()
        if (village === undefined) {
            return
        }

        villager.beginPathProgress(getTargetLocation)

        villager.isPathing = true
        startPathSnapshot(villager)
        villager.nextPathNode = undefined
        const token = { cancelled: false }
        let finished = false
        let pathTimeoutId: number | undefined

        function cancelPath() {
            if (finished) {
                return
            }
            finished = true
            token.cancelled = true
            villager.blockedTimer = 0
            villager.setAnimation(undefined)
            villager.isPathing = false
            stopPathSnapshot(villager)
            villager.nextPathNode = undefined
            if (pathTimeoutId !== undefined) {
                system.clearRun(pathTimeoutId)
                pathTimeoutId = undefined
            }
            if (villager.pathTickId !== undefined) {
                system.clearRun(villager.pathTickId)
                villager.pathTickId = undefined
            }
            villager.stopPath = noop
        }

        pathTimeoutId = system.runTimeout(cancelPath, PATH_TIMEOUT_TICKS)
        villager.stopPath = cancelPath

        try {
            let startLocation = floorVector(villager.location)

            if (village.pathNodes[locationToString(startLocation)] === undefined) {
                const entityStandingOnBlocks = villager.getAllBlocksStandingOn()
                for (const block of entityStandingOnBlocks) {
                    const blockAbove = block.aboveSafe()
                    if (blockAbove === undefined) {
                        continue
                    }
                    const blockAboveLocationString = locationToString(blockAbove)
                    if (village.pathNodes[blockAboveLocationString] !== undefined) {
                        startLocation = blockAbove.location
                        break
                    }
                }
            }

            if (village.pathNodes[locationToString(startLocation)] === undefined) {
                const nearest = findNearestNodeLocation(village.pathNodes, startLocation, 3, getBlockSideBias(villager.location))
                    ?? findNearestNodeLocation(village.pathNodes, startLocation, 3)
                if (nearest !== undefined) {
                    const feetBlock = villager.dimension.getBlockSafe(floorVector(villager.location))
                    if (feetBlock !== undefined && !feetBlock.canWalkThrough()) {
                        const loc = villager.location
                        const dx = (nearest.x + 0.5) - loc.x
                        const dz = (nearest.z + 0.5) - loc.z
                        const dist = Math.hypot(dx, dz)
                        const len = dist === 0 ? 1 : dist
                        villager.applyImpulse({
                            x: (dx / len) * 0.01,
                            y: 0,
                            z: (dz / len) * 0.01
                        })
                    }
                    startLocation = nearest
                }
            }

            const stream = createPathStream()
            villager.followPath(stream, getTargetLocation, cancelPath, () => finished, targetId)

            generatePath(villager, startLocation, target, token, stream).then(result => {
                if (finished || typeof result !== "string") {
                    return
                }
                if ((stream.head ?? 0) >= stream.nodes.length) {
                    if (result !== "cancelled") {
                        villager.pathError = result
                    }
                    cancelPath()
                }
            }).catch(error => {
                if (debugFlags.pathfindingWarnings) {
                    console.warn("pathFindTo failed: ", error)
                }
                cancelPath()
            })
        }
        catch (error) {
            if (debugFlags.pathfindingWarnings) {
                console.warn("pathFindTo setup failed: ", error)
            }
            cancelPath()
        }
    }

    tickAI() {
        const villager = this
        if (villager.isDead) {
            return
        }

        const doorCheckInterval = villager.openedDoors.length > 0 && isPenWorkerType(villager.typeId) ? 2 : 10
        if ((system.currentTick + villager.index) % doorCheckInterval === 0) {
            villager.closeFarDoors()
        }
        if ((system.currentTick + villager.index) % 10 === 0 && debugFlags.rancherAvoidedGateParticles) {
            villager.showAvoidedGateParticles()
        }

        const village = villager.getVillage()
        if (village === undefined) {
            villager.setAnimation(undefined)
            villager.updateAnimation()
            villager.updateDebugNameTag()
            villager.saveAllData()
            return
        }
        villager.checkPathProgress()
        const pathError = villager.pathError

        if (villager.isWaiting && pathError === undefined) {
            if (typeof villager.waiting === "number") {
                villager.waiting--
                if (villager.waiting === 0) {
                    villager.holdingItem = undefined
                }
            }
        }
        else {
            villager.tickTasks(village)
        }

        if (pathError !== undefined) {
            villager.pathError = undefined
        }
        villager.updateEquipment()
        villager.updateAnimation()
        villager.updateDebugNameTag(village, pathError)
        villager.saveAllData()
    }

    private updateDebugNameTag(village?: Village, pathError = this.pathError) {
        if (!debugFlags.villagerDebugNameTags) {
            if (this.nameTag !== "") {
                this.nameTag = ""
            }
            return
        }

        const villagerConfig = this.getConfig()
        let taskName = this.currentTask?.id ?? "Idle"
        if (this.currentTask !== undefined) {
            const task = globalTasks.find(candidate => candidate.id === this.currentTask?.id)
                ?? villagerConfig?.customTasks.find(candidate => candidate.id === this.currentTask?.id)

            taskName = task?.name ?? taskName
        }

        const villagerLocation = this.location
        let nextPathNodeDistance: number | undefined
        if (this.nextPathNode !== undefined) {
            nextPathNodeDistance = calculateDistance(villagerLocation, this.nextPathNode)
        }
        let target = "None"
        let targetLocation: Vector3 | undefined
        switch (this.currentTask?.id) {
            case "chop":
                targetLocation = this.taskContext.tree
                if (targetLocation !== undefined) {
                    target = "Tree"
                }
                break
            case "harvest":
                targetLocation = this.taskContext.harvestLocation
                if (targetLocation !== undefined) {
                    target = "Harvest"
                }
                break
            case "item":
                const entity = this.taskContext.item === undefined ? undefined : world.getEntity(this.taskContext.item)
                if ( entity?.isValid) {
                    targetLocation = entity.location
                    target = `Item ${formatTypeId( entity.typeId)}`
                }
                break
            case "plant":
                if (this.taskContext.plant !== undefined) {
                    targetLocation = this.taskContext.plant.location
                    target = `Plant ${formatTypeId(this.taskContext.plant.type)}`
                }
                break
            case "till":
                targetLocation = this.taskContext.tillLocation
                if (targetLocation !== undefined) {
                    target = "Till"
                }
                break
            case "mine":
            case "refill_mine":
                targetLocation = this.taskContext.mine?.location
                if (targetLocation !== undefined) {
                    target = this.currentTask.id === "refill_mine" ? "Mine to refill" : "Mine"
                }
                break
            case "mine_ore":
                targetLocation = this.taskContext.ore?.start
                if (targetLocation !== undefined) {
                    target = "Ore"
                }
                break
            case "herd":
                if (this.taskContext.herdEntity !== undefined) {
                    targetLocation = world.getEntity(this.taskContext.herdEntity.id)?.location ?? this.taskContext.herdEntity.location
                    target = `Herd ${formatTypeId(this.taskContext.herdEntity.typeId)}`
                }
                break
            case "close_gate":
                targetLocation = this.taskContext.openGate
                if (targetLocation !== undefined) {
                    target = "Gate"
                }
                break
            case undefined:
                break
        }
        let targetDistance: number | undefined
        if (targetLocation !== undefined) {
            target = `${target} @ ${locationToString(fixVector(targetLocation, 2))}`
            targetDistance = calculateDistance(villagerLocation, targetLocation)
        }

        let waiting = "No"
        if (typeof this.waiting === "number") {
            waiting = `${this.waiting} ticks`
        }
        else if (this.waiting) {
            waiting = "Yes"
        }

        const nameTag = village === undefined ? "No Village" : [
            formatTypeId(this.typeId),
            `Task: ${taskName}`,
            `Progress: ${this.taskProgress}`,
            `Waiting: ${waiting}`,
            `Pathing: ${this.isPathing ? "Yes" : "No"}`,
            `Blocked: ${this.isBlocked ? "Yes" : "No"}`,
            `Target: ${target}`,
            `Target distance: ${targetDistance === undefined ? "None" : `${fix(targetDistance, 2)} blocks`}`,
            `Blocked timer: ${this.blockedTimer}`,
            `Blocking entity: ${this.blockingEntityTypeId ?? "None"}`,
            `Next path node distance: ${nextPathNodeDistance === undefined ? "None" : `${fix(nextPathNodeDistance, 2)} blocks`}`,
            `Path error: ${pathError ?? "None"}`
        ].join("\n")

        if (this.nameTag !== nameTag) {
            this.nameTag = nameTag
        }
    }

    get isWaiting() {
        return typeof this.waiting === "number" ? this.waiting > 0 : this.waiting
    }

    private getTaskList() {
        const villagerConfig = this.getConfig()
        if (villagerConfig === undefined) {
            return undefined
        }

        let allTaskList = taskListsByType.get(this.typeId)
        if (allTaskList === undefined) {
            allTaskList = sortTasksByPriority(globalTasks.concat(villagerConfig.customTasks))
            taskListsByType.set(this.typeId, allTaskList)
        }
        return allTaskList
    }

    private trySelectTask(village: Village, allTaskList: typeof globalTasks) {
        const villager = this

        const currentTask = allTaskList.find(task => task.id === villager.currentTask?.id)
        const canPickTask = villager.currentTask === undefined || currentTask?.interruptible === true

        if (!canPickTask || (system.currentTick + villager.index) % 20 !== 0) {
            return
        }

        const leashedEntity = villager.getLeashedEntity()
        if (leashedEntity !== undefined) {
            leashedEntity.getComponent(EntityComponentTypes.Leashable)?.unleash()
        }

        const newTask = pickTask(
            allTaskList,
            task => villager.canDoTask(task, village),
            currentTask?.priority
        )

        if (newTask !== undefined) {
            villager.pendingContext = {}
            villager.currentTask = { id: newTask.id, context: {} }
            villager.taskCache = {}
            newTask.condition(villager, village)

            villager.closeChest()
            villager.stopPath()
            villager.taskProgress = 0
            villager.waiting = 0
            villager.holdingItem = undefined
            if (villager.animation !== "walking") {
                villager.animation = undefined
            }
        }
        else if (villager.currentTask === undefined) {
            villager.pendingContext = {}
        }
    }

    hasToolForTask(task: Task) {
        if (task.requiresTool) {
            const villagerToolTypes = this.getToolTypes()
            if (villagerToolTypes !== undefined) {
                for (const toolType of villagerToolTypes) {
                    if (this.getBestTool(toolType) === undefined) {
                        return false
                    }
                }
            }
        }

        return true
    }

    canDoTask(task: Task, village: Village) {
        const hasTool = this.hasToolForTask(task)
        if (!hasTool) {
            return false
        }

        const requireItems = task.taskItems(this, village)
        if (requireItems !== undefined) {
            const villagerInventory = this.getInventory()
            if (villagerInventory !== undefined) {
                const villageStorage = village.storage
                for (const requiredItem of requireItems) {
                    const itemIds = Array.isArray(requiredItem.id) ? requiredItem.id : [requiredItem.id]
                    const villagerItemCount = villagerInventory.getItemCount({ includesTypes: itemIds })
                    const villagerHasItem = villagerItemCount >= requiredItem.amount
                    if (!villagerHasItem) {
                        const amountLeft = requiredItem.amount - villagerItemCount
                        const foundItems = villageStorage.findItems({ includesTypes: itemIds }, amountLeft)
                        const currentItem = foundItems[0]
                        if (currentItem === undefined && !requiredItem.optional) {
                            const minNeeded = Math.max(1, (requiredItem.min ?? requiredItem.amount) - villagerItemCount)
                            let canCraft = false
                            for (const itemId of itemIds) {
                                if (this.canCraftTaskItem(village, itemId, minNeeded)) {
                                    canCraft = true
                                }
                            }

                            if (!canCraft) {
                                return false
                            }
                        }
                    }
                }
            }
            else {
                return false
            }
        }

        return task.condition(this, village)
    }

    tickTasks(village: Village) {
        const villager = this

        const dimension = villager.dimension
        const allTaskList = villager.getTaskList()
        if (allTaskList === undefined) {
            return
        }

        const villagerLocation = villager.location

        villager.trySelectTask(village, allTaskList)

        if (villager.currentTask !== undefined) {
            let task = allTaskList.find(checkTask => checkTask.id === villager.currentTask?.id)

            if (task !== undefined) {
                if (!this.hasToolForTask(task)) {
                    villager.cancelTask()
                    task = undefined
                }
            }

            if (task !== undefined) {
                let tickTask = !villager.isWaiting

                const requireItems = task.taskItems(villager, village)
                if (requireItems !== undefined && villager.continueTaskItemCrafting(village)) {
                    return
                }

                if (requireItems !== undefined) {
                    const villagerInventory = villager.getInventory()
                    if (villagerInventory !== undefined) {
                        const villageStorage = village.storage
                        for (const requiredItem of requireItems) {
                            const itemIds = Array.isArray(requiredItem.id) ? requiredItem.id : [requiredItem.id]
                            const villagerItemCount = villagerInventory.getItemCount({ includesTypes: itemIds })
                            const villagerHasItem = villagerItemCount >= (requiredItem.min ?? requiredItem.amount)
                            if (!villagerHasItem) {
                                const amountLeft = requiredItem.amount - villagerItemCount
                                const foundItems = villageStorage.findItems({ includesTypes: itemIds }, amountLeft)
                                const currentItem = foundItems[0]
                                if (currentItem !== undefined) {
                                    const chestLocation = currentItem.chest.location
                                    const chestInventory = currentItem.chest.container

                                    const chestDistance = calculateDistance(centerVector(chestLocation, true), this.location)
                                    if (chestDistance > 1.5) {
                                        this.pathFindTo(chestLocation)
                                        return
                                    }

                                    this.stopPath()
                                    if (!this.openChest(chestLocation)) {
                                        return
                                    }

                                    chestInventory.transferItemStack(currentItem.slotIndex, villagerInventory, amountLeft)
                                    this.closeChest()

                                    tickTask = false
                                }
                                else if (!requiredItem.optional) {
                                    tickTask = false

                                    const minNeeded = Math.max(1, (requiredItem.min ?? requiredItem.amount) - villagerItemCount)
                                    let canCraft = false

                                    for (const itemId of itemIds) {
                                        if (this.craftTaskItem(village, itemId, minNeeded, amountLeft)) {
                                            canCraft = true
                                        }
                                    }

                                    if (canCraft) {
                                        return
                                    }

                                    this.cancelTask()
                                    break
                                }
                            }
                        }
                    }
                    else {
                        tickTask = false
                        this.cancelTask()
                    }
                }

                if (tickTask) {
                    task.tick?.(villager, village)
                }
            }

            if (!villager.hasTask && !villager.isWaiting) {
                if (villager.animation !== "walking") {
                    villager.animation = undefined
                }
                villager.holdingItem = undefined
                villager.stopPath()
                villager.taskProgress = randomInt(IDLE_WAIT_MIN_TICKS, IDLE_WAIT_MAX_TICKS)
                villager.taskContext.tree = undefined
                villager.taskContext.harvestLocation = undefined
            }
        }
        else if (!villager.isPathing) {
            if (villager.taskProgress > 0) {
                villager.taskProgress--
            }
            else {
                const offset = {
                    x: randomInt(-10, 10),
                    y: 0,
                    z: randomInt(-10, 10)
                }
                const randomLocation = addVectors(villagerLocation, offset)
                let block = dimension.getBlockSafe(randomLocation)
                if (block !== undefined) {
                    while (block?.isAir) {
                        block = block.belowSafe()
                    }
                    while (block !== undefined && !block.isAir) {
                        block = block.aboveSafe()
                    }
                    if (block !== undefined) {
                        const pathNode = findNearestNodeLocation(
                            village.pathNodes,
                            block.location,
                            3
                        )
                        if (pathNode !== undefined) {
                            villager.taskProgress = randomInt(IDLE_WAIT_MIN_TICKS, IDLE_WAIT_MAX_TICKS)
                            villager.pathFindTo(pathNode)
                        }
                    }
                }
            }
        }
        if (villager.isPathing && villager.typeId === "tektopia:villager_lumberjack" && (system.currentTick + villager.index) % 20 === 0) {
            const minVector = addVectors(villagerLocation, { x: -2, y: -1, z: -2 })
            const maxVector = addVectors(villagerLocation, { x: 2, y: 2, z: 2 })
            const blocksToUpdate = []
            const checkedBlocks = new Set()
            for (let x = minVector.x; x <= maxVector.x; x++) {
                for (let y = minVector.y; y <= maxVector.y; y++) {
                    for (let z = minVector.z; z <= maxVector.z; z++) {
                        const block = dimension.getBlockSafe({ x, y, z })
                        if (block === undefined) {
                            continue
                        }
                        if (block.permutation.getState("persistent_bit") === false) {
                            block.destroy(true)
                            const blockList = [block, block.aboveSafe(), block.belowSafe()]
                            for (const neighbor of blockList) {
                                if (neighbor === undefined) {
                                    continue
                                }
                                const blockString = locationToString(neighbor)
                                if (!checkedBlocks.has(blockString)) {
                                    checkedBlocks.add(blockString)
                                    blocksToUpdate.push(neighbor)
                                }
                            }
                        }
                    }
                }
            }
            updatePathNodes(blocksToUpdate)
        }
    }

    get taskContext(): TaskContext {
        return this.currentTask?.context ?? this.pendingContext
    }

    get currentTaskId() {
        return this.currentTask?.id
    }

    get hasTask() {
        return this.currentTask !== undefined
    }

    get isHoldingLeash() {
        return this.getLeashedEntity() !== undefined
    }

    getLeashedEntity() {
        const nearbyEntities = this.dimension.getEntities({
            location: this.location,
            maxDistance: 14
        })

        for (const entity of nearbyEntities) {
            const leashable = entity.getComponent(EntityComponentTypes.Leashable)

            if (leashable?.leashHolder?.id === this.id) {
                return entity
            }
        }

        return undefined
    }

    tickDepositToolTask(village: Village) {
        const toolDeposits = this.getExtraTools(village)
        if (toolDeposits.length === 0) {
            this.cancelTask()
            return
        }

        const villagerInventory = this.getInventory()
        if (villagerInventory === undefined) {
            this.cancelTask()
            return
        }

        const villageStorage = village.storage

        const toolDeposit = toolDeposits[0]
        if (toolDeposit === undefined) {
            this.cancelTask()
            return
        }

        const item = villagerInventory.getItem(toolDeposit.slotIndex)
        if (item?.typeId !== toolDeposit.item.typeId) {
            toolDeposits.shift()
            return
        }

        const chest = villageStorage.findDepositChest(item, this.location)
        if (chest === undefined) {
            toolDeposits.shift()
            return
        }

        const chestLocation = chest.location

        const chestDistance = calculateDistance(centerVector(chestLocation, true), this.location)
        if (chestDistance > 1.5) {
            this.pathFindTo(chestLocation)
            return
        }

        this.stopPath()
        if (!this.openChest(chestLocation)) {
            return
        }

        villagerInventory.transferItem(toolDeposit.slotIndex, chest.container)
        this.closeChest()
        toolDeposits.shift()
    }

    tickGetToolTask(village: Village) {
        const toolUpgrades = this.taskContext.toolUpgrades
        const toolUpgrade = toolUpgrades?.[0]
        if (toolUpgrades === undefined || toolUpgrade === undefined) {
            this.cancelTask()
            return
        }

        const villagerInventory = this.getInventory()
        if (villagerInventory === undefined) {
            this.cancelTask()
            return
        }

        const villageStorage = village.storage

        const itemResult = villageStorage.findItem({ includesTypes: [toolUpgrade.newId] })
        if (itemResult === undefined) {
            toolUpgrades.shift()
            return
        }

        const chestLocation = itemResult.chest.location
        const chestDistance = calculateDistance(centerVector(chestLocation, true), this.location)

        if (chestDistance > 1.5) {
            this.pathFindTo(chestLocation)
            return
        }

        this.stopPath()
        if (!this.openChest(chestLocation)) {
            return
        }

        const currentTool = toolUpgrade.oldId !== undefined ? villagerInventory.findItem({ includesTypes: [toolUpgrade.oldId] }) : undefined
        if (currentTool === undefined) {
            itemResult.chest.container.transferItem(itemResult.slotIndex, villagerInventory)
        }
        else {
            itemResult.chest.container.swapItems(itemResult.slotIndex, currentTool.slotIndex, villagerInventory)
        }

        this.closeChest()
        toolUpgrades.shift()
    }

    private giveItem(village: Village, inventory: Container, item: ItemStack) {
        const leftover = inventory.addItem(item)
        if (leftover !== undefined && leftover.amount > 0) {
            village.dimension.spawnItem(leftover, this.location)
        }
    }

    private isFurnaceInUse(furnaceLocation: Vector3) {
        const key = locationToString(furnaceLocation)
        for (const villager of world.getVillagers()) {
            for (const smelt of Object.values(villager.taskContext.smelts ?? {})) {
                if (locationToString(smelt.furnace) === key) {
                    return true
                }
            }
        }
        return false
    }

    tickCraftToolTask(village: Village) {
        const craftCache = this.taskCache.toolCraft ??= {}
        const craftTask = this.taskContext.toolCraft
        if (craftTask === undefined) {
            this.cancelTask()
            return
        }

        const villagerInventory = this.getInventory()
        if (villagerInventory === undefined) {
            this.cancelTask()
            return
        }

        const villageStorageStructure = village.findStructures({ includedTypes: ["storage"] })[0]
        if (villageStorageStructure === undefined) {
            this.cancelTask()
            return
        }

        const villageStorage = village.storage

        if (craftCache.crafting === undefined) {
            const craftingPlan = villageStorage.getCraftingPlan(craftTask.itemId, craftTask.amount ?? 1, { smelting: villageStorageStructure.getFurnaces().length > 0 })
            if (craftingPlan === undefined) {
                this.finishToolCraft()
                return
            }

            craftCache.crafting = { plan: craftingPlan, items: getRequiredItems(craftingPlan), doneSteps: [] }
        }

        const recipeContext = craftCache.crafting
        const smelts = this.taskContext.smelts ??= {}

        if (!recipeContext.hasItems) {
            const villagerItemCounts = villagerInventory.getItemCounts()

            for (const [itemId, amount] of Object.entries(recipeContext.items)) {
                const amountNeeded = amount - (villagerItemCounts[itemId] ?? 0)
                if (amountNeeded > 0) {
                    const itemResults = villageStorage.findItems({ includesTypes: [itemId] }, amountNeeded)
                    const targetItem = itemResults[0]
                    if (targetItem === undefined) {
                        this.finishToolCraft()
                        return
                    }

                    const chestLocation = targetItem.chest.location
                    const chestDistance = calculateDistance(centerVector(chestLocation, true), this.location)

                    if (chestDistance > 1.5) {
                        this.pathFindTo(chestLocation)
                        return
                    }

                    this.stopPath()
                    if (!this.openChest(chestLocation)) {
                        return
                    }

                    const moved = targetItem.chest.container.transferItemStack(targetItem.slotIndex, villagerInventory, targetItem.item.amount)
                    this.closeChest()

                    if (moved <= 0) {
                        // Nothing fit in the villager's inventory (or the stack vanished), retrying would loop forever
                        this.finishToolCraft()
                        return
                    }

                    return
                }
            }
        }

        recipeContext.hasItems = true

        recipeContext.doneSteps ??= []

        const waitingForSmelt = smelts[craftTask.itemId]
        if (waitingForSmelt !== undefined) {
            const furnaceLocation = waitingForSmelt.furnace

            const furnaceDistance = calculateDistance(centerVector(furnaceLocation, true), this.location)
            if (furnaceDistance > 1.5) {
                this.pathFindTo(furnaceLocation)
                return
            }

            const furnace = village.dimension.getBlock(furnaceLocation)
            if (furnace === undefined || (furnace.typeId !== "minecraft:furnace" && furnace.typeId !== "minecraft:lit_furnace")) {
                this.finishToolCraft()
                return
            }

            const furnaceInventory = furnace.getComponent(BlockComponentTypes.Inventory)?.container
            if (furnaceInventory === undefined) {
                this.finishToolCraft()
                return
            }

            waitingForSmelt.ticks++
            if (waitingForSmelt.ticks > waitingForSmelt.maxTicks) {
                // The furnace never produced the output (out of fuel, or something else is using it)
                this.finishToolCraft()
                return
            }

            const outputSlot = furnaceInventory.getSlot(2)
            const outputItem = outputSlot.getItem()

            if (outputItem === undefined) {
                return
            }

            if (outputItem.typeId !== waitingForSmelt.outputId) {
                // Something else is in the output slot, so the furnace is blocked
                this.finishToolCraft()
                return
            }

            if (outputSlot.amount >= waitingForSmelt.amount) {
                if (villagerInventory.isFull) {
                    this.finishToolCraft()
                    return
                }

                this.giveItem(village, villagerInventory, outputItem)

                outputSlot.setItem(undefined)
                delete smelts[craftTask.itemId]
            }
            else {
                return
            }
        }

        let currentCraftingStep: CraftStep & { index: number } | undefined

        for (const [index, step] of recipeContext.plan.entries()) {
            const doneStep = recipeContext.doneSteps[index]
            if (doneStep === undefined || doneStep < step.times) {
                currentCraftingStep = { ...step, index }
                break
            }
        }

        if (currentCraftingStep === undefined) {
            this.finishToolCraft()
            return
        }

        if (currentCraftingStep.smelt) {
            const furnaces = villageStorageStructure.getFurnaces()

            if (furnaces.length === 0) {
                this.finishToolCraft()
                return
            }

            // Another villager's smelt is still running in a furnace, so loading it would steal that villager's items.
            // Wait for a free one. Claims are derived from taskContext.smelts, so they release when that villager finishes or gives up
            const freeFurnaces = furnaces.filter(furnace => !this.isFurnaceInUse(furnace.location))
            if (freeFurnaces.length === 0) {
                this.stopPath()
                return
            }

            const closestFurnace = freeFurnaces.reduce((closest, table) =>
                calculateDistance(table.bottomCenter(), this.location)
                    < calculateDistance(closest.bottomCenter(), this.location)
                    ? table
                    : closest
            )

            const furnaceDistance = calculateDistance(closestFurnace.bottomCenter(), this.location)
            if (furnaceDistance > 1.5) {
                this.pathFindTo(closestFurnace.location)
                return
            }

            const furnaceInventory = closestFurnace.getComponent(BlockComponentTypes.Inventory)?.container
            if (furnaceInventory === undefined) {
                this.finishToolCraft()
                return
            }

            this.stopPath()
            this.lookAt(closestFurnace.center())

            const inputSlot = furnaceInventory.getSlot(0)
            const fuelSlot = furnaceInventory.getSlot(1)
            const leftoverOutputSlot = furnaceInventory.getSlot(2)

            // Old output would be mistaken for the new smelt result (or block it if it is a different item)
            if (leftoverOutputSlot.hasItem()) {
                const item = leftoverOutputSlot.getItem()
                if (item !== undefined) {
                    if (villagerInventory.isFull) {
                        this.finishToolCraft()
                        return
                    }
                    this.giveItem(village, villagerInventory, item)
                }
                leftoverOutputSlot.setItem(undefined)
            }

            if (inputSlot.hasItem()) {
                const item = inputSlot.getItem()
                if (item !== undefined) {
                    if (villagerInventory.isFull) {
                        this.finishToolCraft()
                        return
                    }
                    this.giveItem(village, villagerInventory, item)
                }
                inputSlot.setItem(undefined)
            }

            if (fuelSlot.hasItem()) {
                const item = fuelSlot.getItem()
                if (item !== undefined) {
                    if (villagerInventory.isFull) {
                        this.finishToolCraft()
                        return
                    }
                    this.giveItem(village, villagerInventory, item)
                }
                fuelSlot.setItem(undefined)
            }

            // The whole step is loaded at once. The plan is only read here, never modified
            const inputNeeded = currentCraftingStep.input.amount * currentCraftingStep.times
            const fuelNeeded = currentCraftingStep.fuel.amount

            const inputResults = villagerInventory.findItems({ includesTypes: [currentCraftingStep.input.id] }, inputNeeded)
            const fuelResults = villagerInventory.findItems({ includesTypes: [currentCraftingStep.fuel.id] }, fuelNeeded)

            const inputAvailable = inputResults.reduce((sum, result) => sum + result.item.amount, 0)
            const fuelAvailable = fuelResults.reduce((sum, result) => sum + result.item.amount, 0)

            // Furnace slots hold one stack, so a step that doesn't fit in a single stack can't be loaded in one go
            const inputMax = inputResults[0]?.item.maxAmount ?? 0
            const fuelMax = fuelResults[0]?.item.maxAmount ?? 0

            if (inputAvailable < inputNeeded || fuelAvailable < fuelNeeded || inputNeeded > inputMax || fuelNeeded > fuelMax) {
                this.finishToolCraft()
                return
            }

            for (const result of inputResults) {
                const slot = villagerInventory.getSlot(result.slotIndex)
                const item = slot.getItem()
                if (item === undefined) {
                    this.finishToolCraft()
                    return
                }

                const existingInput = inputSlot.getItem()
                if (existingInput !== undefined && !existingInput.isStackableWith(item)) {
                    continue
                }

                const decreaseResult = slot.decreaseAmount(result.item.amount)
                if (decreaseResult === undefined) {
                    continue
                }

                if (existingInput !== undefined) {
                    inputSlot.amount += decreaseResult.item.amount
                }
                else {
                    inputSlot.setItem(decreaseResult.item)
                }
            }

            for (const result of fuelResults) {
                const slot = villagerInventory.getSlot(result.slotIndex)
                const item = slot.getItem()
                if (item === undefined) {
                    this.finishToolCraft()
                    return
                }

                const existingFuel = fuelSlot.getItem()
                if (existingFuel !== undefined && !existingFuel.isStackableWith(item)) {
                    continue
                }

                const decreaseResult = slot.decreaseAmount(result.item.amount)
                if (decreaseResult === undefined) {
                    continue
                }

                if (existingFuel !== undefined) {
                    fuelSlot.amount += decreaseResult.item.amount
                }
                else {
                    fuelSlot.setItem(decreaseResult.item)
                }
            }

            if (!inputSlot.hasItem()) {
                this.finishToolCraft()
                return
            }

            recipeContext.doneSteps[currentCraftingStep.index] = currentCraftingStep.times
            smelts[craftTask.itemId] = {
                amount: currentCraftingStep.output.amount * currentCraftingStep.times,
                outputId: currentCraftingStep.output.id,
                furnace: closestFurnace.location,
                ticks: 0,
                // A furnace smelts one item per 200 ticks
                maxTicks: (inputNeeded * 200) + 400
            }
        }
        else {
            const craftingTables = villageStorageStructure.getCraftingTables()

            if (craftingTables.length === 0) {
                this.finishToolCraft()
                return
            }

            const closestCraftingTable = craftingTables.reduce((closest, table) =>
                calculateDistance(table.bottomCenter(), this.location)
                    < calculateDistance(closest.bottomCenter(), this.location)
                    ? table
                    : closest
            )

            const craftingTableDistance = calculateDistance(closestCraftingTable.bottomCenter(), this.location)
            if (craftingTableDistance > 1.5) {
                this.pathFindTo(closestCraftingTable.location)
                return
            }

            this.stopPath()
            this.setAnimation("crafting")
            this.lookAt(closestCraftingTable.center())
            this.holdingItem = currentCraftingStep.output.id

            this.taskProgress++

            if (this.taskProgress <= 100) {
                return
            }

            this.taskProgress = 0
            this.setAnimation(undefined)
            this.holdingItem = undefined

            const successful = this.craftItem(currentCraftingStep)

            if (!successful) {
                this.finishToolCraft()
                return
            }

            recipeContext.doneSteps[currentCraftingStep.index] = (recipeContext.doneSteps[currentCraftingStep.index] ?? 0) + 1

            this.waiting = 20
        }
    }

    tickEatFood(village: Village) {
        const villagerInventory = this.getInventory()
        if (villagerInventory === undefined) {
            this.cancelTask()
            return
        }

        const foodItems = villagerInventory.filterItems({
            includesTypes: Object.keys(Registry.eatableTypes)
        })

        if (foodItems.length > 0) {
            const bestFood = this.getBestFoodItem(foodItems.map(itemResult => itemResult.item))
            const foodData = Registry.eatableTypes[bestFood.typeId]

            if (foodData === undefined) {
                this.cancelTask()
                return
            }

            this.holdingItem = bestFood.typeId
            this.stopPath()

            if (this.taskProgress === 0) {
                this.playAnimation("animation.tektopia_villager.eat")
            }

            this.taskProgress ++
            if (this.taskProgress <= 100) {
                return
            }

            const successful = villagerInventory.removeItem({ includesTypes: [bestFood.typeId] }, 1, true)
            if (!successful) {
                this.cancelTask()
                return
            }

            this.addHappiness(foodData.happiness)
            this.hunger += foodData.hunger
            this.cancelTask()
            return
        }

        const villageStorage = village.storage

        const currentFoodItem = villageStorage.filterItems({
            includesTypes: Object.keys(Registry.eatableTypes)
        })[0]

        if (currentFoodItem === undefined) {
            this.cancelTask()
            return
        }

        const chest = currentFoodItem.chest
        const chestLocation = chest.location
        const chestDistance = calculateDistance(centerVector(chestLocation, true), this.location)

        if (chestDistance > 1.5) {
            this.pathFindTo(chestLocation)
            return
        }

        this.stopPath()
        if (!this.openChest(chestLocation)) {
            return
        }

        const chestInventory = chest.container

        chestInventory.transferItemStack(currentFoodItem.slotIndex, villagerInventory, currentFoodItem.item.amount)

        this.waiting = 5
    }

    tickDepositTask(village: Village) {
        const depositPlan = this.taskContext.depositPlan
        if (depositPlan === undefined) {
            this.cancelTask()
            return
        }

        const villagerInventory = this.getInventory()
        if (villagerInventory === undefined) {
            this.cancelTask()
            return
        }

        const villageStorage = village.storage
        for (const [itemId, amount] of Object.entries(depositPlan)) {
            if (amount === 0) {
                continue
            }
            const items = villagerInventory.filterItems({ includesTypes: [itemId] })
            for (const itemResult of items) {
                const item = itemResult.item.clone()
                item.amount = Math.min(item.amount, amount)
                const chest = villageStorage.findDepositChest(item, this.location)
                if (chest === undefined) {
                    continue
                }

                const chestLocation = chest.location

                const chestBlock = this.dimension.getBlock(chestLocation)
                if (chestBlock === undefined) {
                    return
                }

                const chestDistance = calculateDistance(centerVector(chestLocation, true), this.location)

                if (chestDistance > 1.5) {
                    this.pathFindTo(chestLocation)
                    return
                }

                this.stopPath()
                if (!this.openChest(chestLocation)) {
                    return
                }

                const chestInventory = chest.container

                const moved = villagerInventory.transferItemStack(itemResult.slotIndex, chestInventory, item.amount)

                if (depositPlan[itemId] !== undefined) {
                    depositPlan[itemId] = moved > 0 ? depositPlan[itemId] - moved : 0
                }

                this.waiting = 5
                return
            }
        }

        this.cancelTask()
    }

    tickBreedEntity() {
        const villager = this

        if (villager.taskContext.breedableEntity === undefined || villager.taskContext.breedableMate === undefined) {
            villager.endBreedTask()
            return
        }

        const pending: Entity[] = []
        for (const found of [villager.taskContext.breedableEntity, villager.taskContext.breedableMate]) {
            const ranchEntity = world.getEntity(found.id)
            if (ranchEntity === undefined || !found.inPen) {
                villager.endBreedTask()
                return
            }
            if (ranchEntity.breeding?.canBreed === true) {
                pending.push(ranchEntity)
            }
        }

        const ranchEntity = pending[0]
        if (ranchEntity === undefined) {
            villager.endBreedTask()
            return
        }

        const ranchEntityDistance = calculateDistance(ranchEntity.location, villager.location)
        if (ranchEntityDistance > 3) {
            villager.pathFindTo(ranchEntity)
            return
        }

        villager.stopPath()

        villager.playAnimation("animation.tektopia_villager.take")

        villager.waiting = 20

        ranchEntity.breeding?.start()

        if (pending.length <= 1) {
            villager.endBreedTask()
        }
    }

    private endBreedTask() {
        this.taskContext.breedableEntity = undefined
        this.taskContext.breedableMate = undefined
        this.cancelTask()
    }

    tickMilkEntity() {
        const villager = this

        const villagerInventory = villager.getInventory()
        if (villagerInventory === undefined) {
            villager.cancelTask()
            return
        }

        if (villager.taskContext.milkableEntity === undefined) {
            villager.cancelTask()
            return
        }

        if (!villagerInventory.hasItem({ includesTypes: ["minecraft:bucket"] })) {
            villager.cancelTask()
            return
        }

        const ranchEntity = world.getEntity(villager.taskContext.milkableEntity.id)
        if (ranchEntity === undefined) {
            villager.cancelTask()
            return
        }

        if (!ranchEntity.isMilkable) {
            villager.cancelTask()
            return
        }

        const ranchEntityLocation = ranchEntity.location

        const ranchEntityDistance = calculateDistance(ranchEntityLocation, villager.location)
        if (ranchEntityDistance > 3) {
            villager.pathFindTo(ranchEntity)
            return
        }

        villager.playAnimation("animation.tektopia_villager.take")
        villager.holdingItem = "minecraft:bucket"

        const successful = villagerInventory.removeItem({ includesTypes: ["minecraft:bucket"] }, 1, true)
        if (!successful) {
            villager.cancelTask()
            return
        }

        villagerInventory.addItem(new ItemStack("minecraft:milk_bucket"))

        ranchEntity.dimension.playSound("mob.cow.milk", ranchEntity.location)

        villager.waiting = 20
        villager.cancelTask()
    }

    tickShearEntity() {
        const villager = this

        if (villager.taskContext.shearableEntity === undefined) {
            villager.cancelTask()
            return
        }

        const ranchEntity = world.getEntity(villager.taskContext.shearableEntity.id)
        if (ranchEntity === undefined) {
            villager.cancelTask()
            return
        }

        if (!ranchEntity.isShearable) {
            villager.cancelTask()
            return
        }

        const ranchEntityLocation = ranchEntity.location

        const ranchEntityDistance = calculateDistance(ranchEntityLocation, villager.location)
        if (ranchEntityDistance > 3) {
            villager.pathFindTo(ranchEntity)
            return
        }

        villager.playAnimation("animation.tektopia_villager.take")
        villager.holdingItem = "tool"

        const woolItem = ranchEntity.getWoolItem()

        if (woolItem !== undefined) {
            if (ranchEntity.villagerEntity) {
                woolItem.makeVillagerItem()
            }

            const amount = randomInt(1, 3)
            for (let i = 0; i < amount; i++) {
                ranchEntity.dimension.spawnItem(woolItem, ranchEntity.location)
            }
        }

        ranchEntity.triggerEvent("minecraft:on_sheared")
        ranchEntity.dimension.playSound("mob.sheep.shear", ranchEntity.location)

        villager.waiting = 5
    }

    private getGatesClaimedByOthers() {
        const claimed = new Set<string>()
        for (const villager of world.getVillagers()) {
            if (villager.id === this.id) {
                continue
            }
            for (const key of villager.openedDoors) {
                claimed.add(key)
            }
            if (villager.currentTask?.id === "close_gate" && villager.taskContext.openGate !== undefined) {
                claimed.add(locationToString(villager.taskContext.openGate))
            }
        }
        return claimed
    }

    private hasPlayerNearGate(gateLocation: Vector3) {
        return this.dimension.getPlayers({
            location: centerVector(gateLocation),
            maxDistance: GATE_PLAYER_RANGE
        }).length > 0
    }

    private isPenSkipped(penKey: LocationString) {
        return this.isSkipped(this.skippedPens, penKey)
    }

    private isSkipped(skipList: Map<LocationString, number>, key: LocationString) {
        const skipUntil = skipList.get(key)
        if (skipUntil === undefined) {
            return false
        }
        if (skipUntil > system.currentTick) {
            return true
        }
        skipList.delete(key)
        return false
    }

    private hasPennedEntityNear(village: Village, center: Vector3, range: number, penKey?: LocationString, ignoreEntityId?: string) {
        const tick = system.currentTick
        if (pennedEntityMemoTick !== tick) {
            pennedEntityMemo.clear()
            pennedEntityMemoTick = tick
        }
        const memoKey = `${village.centerString}|${center.x},${center.y},${center.z}|${range}|${penKey ?? ""}|${ignoreEntityId ?? ""}`
        let result = pennedEntityMemo.get(memoKey)
        if (result === undefined) {
            result = this.computeHasPennedEntityNear(village, center, range, penKey, ignoreEntityId)
            pennedEntityMemo.set(memoKey, result)
        }
        return result
    }

    private computeHasPennedEntityNear(village: Village, center: Vector3, range: number, penKey?: LocationString, ignoreEntityId?: string) {
        for (const [id, data] of Object.entries(village.ranchEntities)) {
            if (id === ignoreEntityId || !data.inPen || (penKey !== undefined && data.structure !== penKey)) {
                continue
            }
            if (calculateDistance(center, data.location) > range + 4) {
                continue
            }
            const entity = world.getEntity(id)
            if (entity === undefined) {
                continue
            }
            if (calculateDistance(center, entity.location) <= range) {
                return true
            }
        }
        return false
    }

    private isGateBlocked(village: Village, gate: Block, ignoreEntityId?: string) {
        if (gate.permutation.getState("open_bit") === true) {
            return false
        }
        const penKey = village.penTiles.get(locationToString(gate.location))
        if (penKey === undefined) {
            return false
        }
        return this.hasPennedEntityNear(village, centerVector(gate.location), GATE_OPEN_CLEARANCE, penKey, ignoreEntityId)
    }

    private hasUnblockedOtherGate(village: Village, penKey: LocationString, gateKey: LocationString, ignoreEntityId?: string) {
        for (const other of village.getPenGates(penKey)) {
            const otherKey = locationToString(other)
            if (otherKey === gateKey) {
                continue
            }
            const node = village.pathNodes[otherKey]
            if (node === undefined || node.neighbors.length === 0) {
                continue
            }
            const block = this.dimension.getBlockSafe(other)
            if (block === undefined || !Registry.fenceGateTypes.includes(block.typeId)) {
                continue
            }
            if (!this.isGateBlocked(village, block, ignoreEntityId)) {
                return true
            }
        }
        return false
    }

    getAvoidedNodes(): ReadonlySet<LocationString> | undefined {
        if (!isPenWorkerType(this.typeId)) {
            return undefined
        }
        const village = this.getVillage()
        if (village === undefined) {
            return undefined
        }

        const ignoreEntityId = this.getLeashedEntity()?.id
        let avoided: Set<LocationString> | undefined
        for (const penKey of village.penCache.keys()) {
            const gates = village.getPenGates(penKey)
            if (gates.length < 2) {
                continue
            }

            const blocked: LocationString[] = []
            for (const gate of gates) {
                const block = this.dimension.getBlockSafe(gate)
                if (block !== undefined && this.isGateBlocked(village, block, ignoreEntityId)) {
                    blocked.push(locationToString(gate))
                }
            }

            if (blocked.length === 0 || blocked.length === gates.length) {
                continue
            }
            avoided ??= new Set()
            for (const key of blocked) {
                avoided.add(key)
            }
        }
        return avoided
    }

    private showAvoidedGateParticles() {
        const avoided = this.getAvoidedNodes()
        if (avoided === undefined) {
            return
        }
        for (const key of avoided) {
            const center = centerVector(stringToLocationCached(key))
            for (const yOffset of [0, 0.5, 1, 1.5]) {
                try {
                    this.dimension.spawnParticle("minecraft:villager_angry", addVector(center, "y", yOffset))
                }
                catch { }
            }
        }
    }

    holdForEscapingEntity(village: Village, gate: Block) {
        if (!isPenWorkerType(this.typeId)) {
            return false
        }

        const key = locationToString(gate.location)
        const ignoreEntityId = this.getLeashedEntity()?.id
        if (!this.isGateBlocked(village, gate, ignoreEntityId)) {
            this.gateHold = undefined
            return false
        }

        const now = system.currentTick
        if (this.gateHold?.key !== key) {
            this.gateHold = { key, since: now }
        }
        if (now - this.gateHold.since < GATE_WAIT_TICKS) {
            return true
        }

        this.gateHold = undefined
        const penKey = village.penTiles.get(key)
        if (penKey !== undefined && this.hasUnblockedOtherGate(village, penKey, key, ignoreEntityId)) {
            this.stopPath()
        }
        else {
            if (penKey !== undefined) {
                this.skippedPens.set(penKey, now + PEN_SKIP_TICKS)
            }
            this.abandonGateBlockedTask()
        }
        return true
    }

    private abandonGateBlockedTask() {
        this.getLeashedEntity()?.getComponent(EntityComponentTypes.Leashable)?.unleash()
        this.stopPath()
        this.taskContext.herdEntity = undefined
        this.taskContext.breedableEntity = undefined
        this.taskContext.breedableMate = undefined
        this.taskContext.shearableEntity = undefined
        this.taskContext.killingEntity = undefined
        this.taskContext.fullAnimalPen = undefined
        this.lastButcherLeash = undefined
        this.cancelTask()
    }

    craftItem(step: CraftStep) {
        if (step.smelt) {
            return false
        }

        const village = this.getVillage()
        if (village === undefined) {
            return false
        }

        const villagerInventory = this.getInventory()
        if (villagerInventory === undefined) {
            return false
        }

        const successful = villagerInventory.removeItems(step.input.map(input => ({ itemFilter: { includesTypes: [input.id] }, amount: input.amount })), true)

        if (!successful) {
            return false
        }

        const outputItem = new ItemStack(step.output.id, step.output.amount)
        outputItem.makeVillagerItem()
        this.giveItem(village, villagerInventory, outputItem)

        return true
    }

    findOpenGate(village: Village) {
        const unavailable = this.getGatesClaimedByOthers()
        for (const key of this.openedDoors) {
            unavailable.add(key)
        }

        const villagerLocation = this.location
        let closestGate: Vector3 | undefined
        let closestDistance = Infinity

        const checkedGates = new Set<LocationString>()
        for (const pen of village.findStructures({ includedTypes: [...RANCH_PEN_TYPES] })) {

            for (const gateLocation of village.getPenGates(pen.locationString)) {
                const key = locationToString(gateLocation)
                if (checkedGates.has(key)) {
                    continue
                }
                checkedGates.add(key)

                if (unavailable.has(key) || this.isSkipped(this.skippedGates, key)) {
                    continue
                }
                if (!isOpenFenceGate(this.dimension.getBlockSafe(gateLocation))) {
                    continue
                }

                const node = village.pathNodes[key]
                if (node === undefined || node.neighbors.length === 0 || !checkRequirement(this.typeId, node.requirement)) {
                    continue
                }

                const distance = calculateDistance(villagerLocation, gateLocation)
                if (distance >= closestDistance) {
                    continue
                }

                if (this.hasPlayerNearGate(gateLocation)) {
                    continue
                }

                closestDistance = distance
                closestGate = gateLocation
            }
        }

        if (closestGate === undefined) {
            return false
        }

        this.taskContext.openGate = closestGate
        return true
    }

    tickSleep() {
        const villager = this

        const bedTime = villager.bedTime()

        if (villager.sitChair !== undefined && bedTime !== "waking" && bedTime !== "tired") {
            villager.stopChairSit()
        }

        if (bedTime === "sleep") {
            const bed = villager.getBed()
            if (bed === undefined) {
                villager.setAnimation(undefined)
                return
            }

            const bedBlock = villager.dimension.getBlock(bed.location)
            if (bedBlock === undefined) {
                return
            }

            const bedDirection = bedBlock.permutation.getState("direction")
            if (bedDirection === undefined) {
                return
            }

            const bedDistance = calculateDistance(centerVector(bed.location, true), villager.location)

            if (bedDistance > 3 || villager.isPathing) {
                villager.pathFindTo(bed.location)
                return
            }

            villager.setAnimation("sleeping")

            const offsetList = [
                { x: 0, y: 0.5625, z: -0.65 },
                { x: 0.65, y: 0.5625, z: 0 },
                { x: 0, y: 0.5625, z: 0.65 },
                { x: -0.65, y: 0.5625, z: 0 }
            ]

            const offset = offsetList[bedDirection]
            if (offset === undefined) {
                return
            }

            villager.teleport(
                addVectors(centerVector(bed.location, true), offset),
                { rotation: { x: 0, y: (bedDirection * 90) - 180 } }
            )
        }
        else if (bedTime === "waking" || bedTime === "tired") {
            villager.setAnimation(undefined)

            if (villager.sitChair !== undefined) {
                villager.tickChairSit()
                return
            }

            if (villager.isPathing) {
                return
            }

            if (villager.taskProgress > 0) {
                villager.taskProgress--
                return
            }

            villager.taskProgress = randomInt(IDLE_WAIT_MIN_TICKS, IDLE_WAIT_MAX_TICKS)

            const village = villager.getVillage()
            const bed = villager.getBed()
            const structure = bed === undefined ? undefined : village?.getStructure(stringToLocationCached(bed.home))

            const floorLocations = structure?.loadFloorLocations()

            if (floorLocations === undefined || floorLocations.length === 0) {
                return
            }

            if (Math.random() < CHAIR_SIT_CHANCE) {
                const chair = villager.findChair(floorLocations)
                if (chair !== undefined) {
                    villager.startChairSit(chair)
                    return
                }
            }

            const target = randomItem(floorLocations)
            if (target !== undefined) {
                villager.pathFindTo(target)
            }
        }
        else {
            villager.cancelTask()
        }
    }

    private getClaimedChairs() {
        const claimedChairs = new Set<LocationString>()
        for (const villager of world.getVillagers()) {
            if (villager.id === this.id || villager.sitChair === undefined) {
                continue
            }
            if (villager.dimension.id !== this.dimension.id) {
                continue
            }
            claimedChairs.add(locationToString(villager.sitChair))
        }
        return claimedChairs
    }

    private findChair(floorLocations: readonly Vector3[]): Vector3 | undefined {
        const claimedChairs = this.getClaimedChairs()
        const chairs: Vector3[] = []
        for (const location of floorLocations) {
            if (claimedChairs.has(locationToString(location))) {
                continue
            }
            if (this.dimension.getBlockSafe(location)?.typeId === "tektopia:chair") {
                chairs.push(location)
            }
        }
        return randomItem(chairs)
    }

    private startChairSit(chair: Vector3) {
        this.sitChair = chair
        this.sitTicksLeft = randomInt(CHAIR_SIT_MIN_TICKS, CHAIR_SIT_MAX_TICKS)
        this.sitWalkTicks = 0
    }

    private stopChairSit() {
        this.sitChair = undefined
        this.sitTicksLeft = 0
        this.sitWalkTicks = 0
        this.taskProgress = randomInt(IDLE_WAIT_MIN_TICKS, IDLE_WAIT_MAX_TICKS)
        this.setAnimation(undefined)
    }

    private tickChairSit() {
        const villager = this
        const chairLocation = villager.sitChair
        if (chairLocation === undefined) {
            return
        }

        const chair = villager.dimension.getBlockSafe(chairLocation)
        const status = villager.sitInChair(chair)

        if (status === "unavailable" || villager.pathError !== undefined) {
            villager.stopChairSit()
            return
        }

        if (status === "walking") {
            if (villager.sitWalkTicks++ > CHAIR_WALK_GIVE_UP_TICKS) {
                villager.stopPath()
                villager.stopChairSit()
            }
            return
        }

        villager.sitTicksLeft--
        if (villager.sitTicksLeft <= 0) {
            villager.stopChairSit()
        }
    }

    sitInChair(chair: Block | undefined): "unavailable" | "walking" | "sitting" {
        const villager = this
        if (chair?.typeId !== "tektopia:chair") {
            return "unavailable"
        }

        const chairDistance = calculateDistance(centerVector(chair.location, true), villager.location)

        if (chairDistance > 1.5) {
            if (!villager.isPathing) {
                villager.pathFindTo(chair.location)
            }
            return "walking"
        }

        const chairDirection = chair.permutation.getState("minecraft:cardinal_direction") as HorizontalDirection | undefined
        if (chairDirection === undefined) {
            return "unavailable"
        }

        const rotation = directionToRotation(chairDirection)
        villager.teleport(centerVector(chair.location, true), { rotation })
        villager.setAnimation("sitting")

        return "sitting"
    }

    tickCloseGate() {
        const villager = this

        const gateLocation = villager.taskContext.openGate
        const gate = gateLocation === undefined ? undefined : villager.dimension.getBlockSafe(gateLocation)
        if (gateLocation === undefined || !isOpenFenceGate(gate)) {
            villager.endCloseGateTask()
            return
        }

        const key = locationToString(gateLocation)
        if (villager.pathError !== undefined) {
            villager.giveUpClosingGate(key, GATE_UNREACHABLE_TICKS)
            return
        }

        const gateCenter = centerVector(gateLocation)
        const arrived = calculateDistance(gateCenter, villager.location) <= GATE_REACH
        if (arrived || (system.currentTick + villager.index) % 10 === 0) {
            if (villager.hasPlayerNearGate(gateLocation)) {
                villager.giveUpClosingGate(key, GATE_PLAYER_COOLDOWN_TICKS)
                return
            }
            if (villager.getGatesClaimedByOthers().has(key)) {
                villager.giveUpClosingGate(key)
                return
            }
        }

        if (!arrived) {
            villager.pathFindTo(gateLocation)
            return
        }

        villager.stopPath()
        villager.lookAt(gateCenter, true)
        villager.playAnimation("animation.tektopia_villager.take")

        gate.setPermutation(gate.permutation.withState("open_bit", false))
        gate.soundEvent("fence_gate.close")

        villager.waiting = 20
        villager.endCloseGateTask()
    }

    private giveUpClosingGate(key: LocationString, skipTicks?: number) {
        if (skipTicks !== undefined) {
            this.skippedGates.set(key, system.currentTick + skipTicks)
        }
        this.stopPath()
        this.endCloseGateTask()
    }

    private endCloseGateTask() {
        this.taskContext.openGate = undefined
        this.cancelTask()
    }

    private isButcherEntitySkipped(entityId: string) {
        const skipUntil = this.skippedButcherEntities.get(entityId)
        if (skipUntil === undefined) {
            return false
        }
        if (skipUntil > system.currentTick) {
            return true
        }
        this.skippedButcherEntities.delete(entityId)
        return false
    }

    private pickButcherEntity(village: Village, pen: AnimalPen) {
        return pen.getEntities(true)
            .filter(entity =>
                village.ranchEntities[entity.id] !== undefined
                && !Villager.unleashableTypes.has(entity.typeId)
                && !this.isButcherEntitySkipped(entity.id)
            )
            .sort((entity1, entity2) =>
                Number(entity1.villagerEntity ?? false) - Number(entity2.villagerEntity ?? false)
            )[0]
    }

    private failButcherTarget(penLocation: Vector3 | undefined, entityId?: string) {
        const until = system.currentTick + BUTCHER_SKIP_TICKS
        if (entityId !== undefined) {
            this.skippedButcherEntities.set(entityId, until)
        }
        else if (penLocation !== undefined) {
            this.skippedPens.set(locationToString(penLocation), until)
        }
        this.lastButcherLeash = undefined
        this.stopPath()
        this.endButcherTask()
    }

    private endButcherTask() {
        this.taskContext.herdEntity = undefined
        this.taskContext.killingEntity = undefined
        this.taskContext.fullAnimalPen = undefined
        this.cancelTask()
    }

    tickButcher(village: Village) {
        const villager = this

        if (villager.taskContext.killingEntity !== undefined) {
            const killingEntity = world.getEntity(villager.taskContext.killingEntity)
            if (killingEntity === undefined) {
                villager.endButcherTask()
                return
            }

            const killingEntityDistance = calculateDistance(centerVector(killingEntity.location, true), villager.location)
            if (killingEntityDistance > ATTACK_RANGE) {
                villager.pathFindTo(killingEntity)
                return
            }

            villager.holdingItem = "tool"

            villager.stopPath()
            villager.attack(killingEntity)
            return
        }

        if (villager.taskContext.butcherStructure === undefined) {
            villager.endButcherTask()
            return
        }

        const butcherStructure = village.getStructure(villager.taskContext.butcherStructure)
        if (butcherStructure === undefined) {
            villager.endButcherTask()
            return
        }

        const leashedEntity = villager.getLeashedEntity()
        if (leashedEntity !== undefined) {
            if (calculateDistance(leashedEntity.location, villager.location) > 8) {
                leashedEntity.teleport(villager.location)
            }

            const floorLocations = butcherStructure.loadFloorLocations()

            const minX = Math.min(...floorLocations.map(location => location.x))
            const maxX = Math.max(...floorLocations.map(location => location.x))
            const minY = Math.min(...floorLocations.map(location => location.y))
            const maxY = Math.max(...floorLocations.map(location => location.y))
            const minZ = Math.min(...floorLocations.map(location => location.z))
            const maxZ = Math.max(...floorLocations.map(location => location.z))

            const centerLocation = {
                x: Math.floor((minX + maxX) / 2),
                y: Math.floor((minY + maxY) / 2),
                z: Math.floor((minZ + maxZ) / 2)
            }

            const pathLocation = floorLocations.reduce((closest, location) => {
                const distance
                    = Math.abs(location.x - centerLocation.x)
                    + Math.abs(location.y - centerLocation.y)
                    + Math.abs(location.z - centerLocation.z)

                const closestDistance
                    = Math.abs(closest.x - centerLocation.x)
                    + Math.abs(closest.y - centerLocation.y)
                    + Math.abs(closest.z - centerLocation.z)

                return distance < closestDistance ? location : closest
            })

            const pathLocationDistance = calculateDistance(centerVector(pathLocation, true), villager.location)
            if (pathLocationDistance > 0.5) {
                villager.pathFindTo(pathLocation)
                return
            }

            if (calculateDistance(leashedEntity.location, villager.location) > 3) {
                leashedEntity.teleport(villager.location)
            }

            leashedEntity.getComponent(EntityComponentTypes.Leashable)?.unleash()
            villager.taskContext.killingEntity = leashedEntity.id
            villager.taskContext.herdEntity = undefined
            return
        }

        if (villager.taskContext.fullAnimalPen === undefined) {
            villager.endButcherTask()
            return
        }

        const animalPen = village.getStructure(villager.taskContext.fullAnimalPen) as AnimalPen | undefined

        if (animalPen === undefined) {
            villager.endButcherTask()
            return
        }

        if (villager.pathError !== undefined || villager.taskProgress++ > BUTCHER_GIVE_UP_TICKS) {
            villager.failButcherTarget(animalPen.location, villager.taskContext.herdEntity?.id)
            return
        }

        const pathLocation = addVectors(animalPen.location, directionToVector(animalPen.rotation))

        const pathLocationDistance = calculateDistance(centerVector(pathLocation, true), villager.location)
        if (pathLocationDistance > 0.5) {
            villager.pathFindTo(pathLocation)
            return
        }

        if (villager.taskContext.herdEntity === undefined) {
            const entity = villager.pickButcherEntity(village, animalPen)
            const ranchEntity = entity === undefined ? undefined : village.ranchEntities[entity.id]
            if (entity !== undefined && ranchEntity !== undefined) {
                const lastLeash = villager.lastButcherLeash
                if (lastLeash?.id === entity.id && system.currentTick - lastLeash.tick < 100) {
                    villager.failButcherTarget(animalPen.location, entity.id)
                    return
                }
                villager.taskContext.herdEntity = { ...ranchEntity, id: entity.id }
            }
        }

        if (villager.taskContext.herdEntity === undefined) {
            villager.endButcherTask()
            return
        }

        const ranchEntity = world.getEntity(villager.taskContext.herdEntity.id)
        if (ranchEntity === undefined) {
            villager.endButcherTask()
            return
        }

        const ranchEntityLocation = ranchEntity.location

        const ranchEntityDistance = calculateDistance(ranchEntityLocation, villager.location)
        if (ranchEntityDistance > 4) {
            villager.pathFindTo(ranchEntity)
            return
        }

        const ranchEntityLeashableComponent = ranchEntity.getComponent(EntityComponentTypes.Leashable)
        if (ranchEntityLeashableComponent === undefined) {
            Villager.unleashableTypes.add(ranchEntity.typeId)
            villager.failButcherTarget(animalPen.location, ranchEntity.id)
            return
        }

        villager.stopPath()

        villager.playAnimation("animation.tektopia_villager.take")

        try {
            ranchEntityLeashableComponent.leashTo(villager.entity)
        }
        catch {
            villager.failButcherTarget(animalPen.location, ranchEntity.id)
            return
        }
        villager.lastButcherLeash = { id: ranchEntity.id, tick: system.currentTick }
        villager.taskContext.herdEntity = undefined

        villager.waiting = 20
    }

    private isFloorLocationBlocked(village: Village, location: Vector3, leashedEntity: Entity) {
        const block = this.dimension.getBlockSafe(location)
        if (block === undefined || !block.canPathThrough() || block.aboveSafe()?.canPathThrough() !== true) {
            return true
        }

        return this.dimension.getEntities({
            location: centerVector(location, true),
            maxDistance: 1
        }).some(entity =>
            entity.isValid
            && entity.id !== this.id
            && entity.id !== leashedEntity.id
            && entity.typeId !== "minecraft:item"
            && village.ranchEntities[entity.id]?.structure === undefined
        )
    }

    private findHerdPathLocation(
        village: Village,
        structure: { locationString: LocationString, loadFloorLocations(): readonly Vector3[] },
        leashedEntity: Entity
    ) {
        const cached = this.herdPathTarget
        if (
            cached?.structure === structure.locationString
            && !this.isFloorLocationBlocked(village, cached.location, leashedEntity)
        ) {
            return cached.location
        }

        const floorLocations = structure.loadFloorLocations()
        if (floorLocations.length === 0) {
            this.herdPathTarget = undefined
            return undefined
        }

        let sumX = 0
        let sumY = 0
        let sumZ = 0
        for (const location of floorLocations) {
            sumX += location.x
            sumY += location.y
            sumZ += location.z
        }
        const center = {
            x: sumX / floorLocations.length,
            y: sumY / floorLocations.length,
            z: sumZ / floorLocations.length
        }

        const byDistanceToCenter = floorLocations
            .map(location => ({
                location,
                distance: ((location.x - center.x) ** 2) + ((location.y - center.y) ** 2) + ((location.z - center.z) ** 2)
            }))
            .sort((a, b) => a.distance - b.distance)

        let chosen = byDistanceToCenter[0]?.location
        for (const { location } of byDistanceToCenter) {
            if (!this.isFloorLocationBlocked(village, location, leashedEntity)) {
                chosen = location
                break
            }
        }

        this.herdPathTarget = chosen === undefined ? undefined : { structure: structure.locationString, location: chosen }
        return chosen
    }

    tickHerdEntity(village: Village) {
        const villager = this

        const leashedEntity = villager.getLeashedEntity()

        if (leashedEntity !== undefined) {
            const structureType = entityStructures[leashedEntity.typeId]
            if (structureType === undefined) {
                leashedEntity.getComponent(EntityComponentTypes.Leashable)?.unleash()
                villager.cancelTask()
                return
            }

            const structures = village.findStructures({ includedTypes: [structureType] })

            if (calculateDistance(leashedEntity.location, villager.location) > 8) {
                leashedEntity.teleport(villager.location)
            }

            let foundStructure = false

            for (const structure of structures) {
                if ((!structure.isUnderpopulated && !leashedEntity.villagerEntity) || structure.isFull || villager.isPenSkipped(structure.locationString)) {
                    continue
                }

                foundStructure = true

                const pathLocation = villager.findHerdPathLocation(village, structure, leashedEntity)

                if (pathLocation === undefined) {
                    continue
                }

                const pathLocationDistance = calculateDistance(centerVector(pathLocation, true), villager.location)
                if (pathLocationDistance > 0.5) {
                    villager.pathFindTo(pathLocation)
                    return
                }

                villager.stopPath()

                if (calculateDistance(leashedEntity.location, villager.location) > 5) {
                    leashedEntity.teleport(villager.location)
                }

                const ranchEntity = village.ranchEntities[leashedEntity.id]

                villager.taskProgress++
                if ((villager.taskProgress <= 60 && (ranchEntity !== undefined && !ranchEntity.inPen)) || villager.taskProgress <= 30) {
                    if (villager.taskProgress === 60) {
                        leashedEntity.teleport(villager.location)
                    }
                    return
                }

                leashedEntity.getComponent(EntityComponentTypes.Leashable)?.unleash()

                if (ranchEntity !== undefined) {
                    ranchEntity.inPen = true
                }

                try {
                    leashedEntity.triggerEvent("tektopia:make_persistent")
                }
                catch { }

                villager.cancelTask()
                break
            }

            if (!foundStructure) {
                leashedEntity.getComponent(EntityComponentTypes.Leashable)?.unleash()
                villager.cancelTask()
            }
            return
        }

        if (villager.taskContext.herdEntity === undefined) {
            const inStructure = villager.getCurrentStructure()
            if (inStructure !== undefined) {
                if (["pig_pen", "chicken_coop", "sheep_pen", "cow_pen"].includes(inStructure.type)) {
                    const pathLocation = addVectors(inStructure.location, directionToVector(inStructure.rotation))

                    const pathLocationDistance = calculateDistance(centerVector(pathLocation, true), villager.location)
                    if (pathLocationDistance > 0.5) {
                        villager.pathFindTo(pathLocation)
                        return
                    }
                }
            }
            villager.cancelTask()
            return
        }

        const ranchEntity = world.getEntity(villager.taskContext.herdEntity.id)
        if (ranchEntity === undefined) {
            villager.cancelTask()
            return
        }

        if (!village.isInBounds(ranchEntity.location)) {
            villager.cancelTask()
            return
        }

        const ranchEntityLocation = ranchEntity.location

        const ranchEntityDistance = calculateDistance(ranchEntityLocation, villager.location)
        if (ranchEntityDistance > 3) {
            villager.pathFindTo(ranchEntity)
            return
        }

        const ranchEntityLeashableComponent = ranchEntity.getComponent(EntityComponentTypes.Leashable)
        if (ranchEntityLeashableComponent === undefined) {
            villager.cancelTask()
            return
        }

        villager.stopPath()

        villager.playAnimation("animation.tektopia_villager.take")

        ranchEntityLeashableComponent.leashTo(villager.entity)

        villager.waiting = 20
    }

    tickMine(village: Village) {
        const villager = this
        if (villager.taskContext.mine === undefined) {
            villager.cancelTask()
            return
        }

        const structure = village.getStructure(villager.taskContext.mine.location) as Mineshaft | undefined

        if (structure === undefined) {
            villager.cancelTask()
            return
        }

        const rotation = structure.rotation
        const oppositeRotation = getOppositeDirection(rotation)

        if (oppositeRotation === undefined) {
            villager.cancelTask()
            return
        }

        const mineTask = structure.getNextTask()

        if (mineTask === undefined) {
            villager.cancelTask()
            return
        }

        if (mineTask.type === "mine") {
            const mineBlock = mineTask.block

            let pathLocation = addVectors(mineBlock.location, directionToVector(oppositeRotation))

            const pathLocationBelow = this.dimension.getBlockSafe(addVector(pathLocation, "y", -1))
            if (pathLocationBelow === undefined) {
                villager.cancelTask()
                return
            }

            if (pathLocationBelow.canPathThrough()) {
                pathLocation = addVector(pathLocation, "y", -1)
            }

            const pathLocationDistance = calculateDistance(centerVector(pathLocation, true), villager.location)

            if (pathLocationDistance >= 1 || (villager.isPathing && pathLocationDistance >= 2)) {
                villager.pathFindTo(pathLocation)
                return
            }

            villager.lookAt(mineBlock.center(), false)

            villager.setAnimation("mining")
            villager.holdingItem = "tool"
            villager.stopPath()

            villager.taskProgress++

            if (villager.taskProgress <= 100) {
                return
            }

            const minedLocation = mineBlock.location

            mineBlock.destroy(true)

            village.scanOreVein(villager.dimension, minedLocation)

            villager.waiting = 15
            villager.setAnimation(undefined)
            updatePathNodes([mineBlock, mineBlock.aboveSafe(), mineBlock.belowSafe()].filter(checkBlock => checkBlock !== undefined))

            villager.cancelTask()
        }
        else if (mineTask.type === "light") {
            const torchBlock = mineTask.block

            const villagerInventory = this.getInventory()
            if (villagerInventory === undefined) {
                villager.cancelTask()
                return
            }

            if (!villagerInventory.hasItem({ includesTypes: ["minecraft:torch"] })) {
                villager.cancelTask()
                return
            }

            const torchBlockDistance = calculateDistance(torchBlock.location, villager.location)

            if (torchBlockDistance >= 1.5) {
                villager.pathFindTo(torchBlock.location)
                return
            }

            const successful = villagerInventory.removeItem({ includesTypes: ["minecraft:torch"] }, 1, true)

            if (successful) {
                torchBlock.replace(BlockPermutation.resolve("minecraft:torch", { torch_facing_direction: "top" }))
            }
        }
        else {
            const fillBlock = mineTask.block
            const pathLocation = addVectors(fillBlock.location, multiplyVector(mineTask.offset, "xyz", -1))

            const pathLocationDistance = calculateDistance(pathLocation, villager.location)

            if (!structure.isInTunnel(villager.location)) {
                if (villager.pathError !== undefined) {
                    villager.stopPath()
                    villager.taskProgress = 0
                    villager.cancelTask()
                    return
                }
                villager.pathFindTo(pathLocation)
                return
            }

            if (pathLocationDistance >= 1 && (villager.isPathing || pathLocationDistance >= 3)) {
                villager.pathFindTo(pathLocation)
                return
            }

            fillBlock.replace("cobblestone")
            villager.waiting = 5

            updatePathNodes([fillBlock, fillBlock.aboveSafe(), fillBlock.belowSafe()].filter(checkBlock => checkBlock !== undefined))
        }

        villager.taskProgress = 0
    }

    tickMineOre(village: Village) {
        const villager = this
        const foundOre = villager.taskContext.ore

        if (foundOre === undefined) {
            villager.cancelTask()
            return
        }

        if (villager.pathError !== undefined) {
            if (villager.pathError === "no_path" || villager.pathError === "timeout") {
                for (const key of foundOre.ores) {
                    const stand = village.findOreStandLocation(stringToLocation(key))
                    if (stand !== undefined && areVectorsEqual(stand, foundOre.start)) {
                        village.oreLocations.remove(key)
                    }
                }
            }
            villager.stopPath()
            villager.taskContext.ore = undefined
            villager.taskProgress = 0
            villager.cancelTask()
            return
        }

        const standDistance = calculateDistance(centerVector(foundOre.start, true), villager.location)

        if (standDistance >= 1 || (villager.isPathing && standDistance >= 2)) {
            villager.pathFindTo(foundOre.start)
            return
        }

        let oreKey: LocationString | undefined
        let oreBlock: Block | undefined
        for (const key of foundOre.ores.slice()) {
            const block = villager.dimension.getBlockSafe(stringToLocation(key))
            if (block?.isOre) {
                oreKey = key
                oreBlock = block
                break
            }
            if (block !== undefined) {
                village.oreLocations.remove(key)
                foundOre.ores.splice(foundOre.ores.indexOf(key), 1)
            }
        }
        if (oreBlock === undefined || oreKey === undefined) {
            villager.taskContext.ore = undefined
            villager.cancelTask()
            return
        }

        villager.lookAt(oreBlock.center(), false)

        villager.setAnimation("mining")
        villager.holdingItem = "tool"
        villager.stopPath()

        villager.taskProgress++

        if (villager.taskProgress <= 100) {
            return
        }

        const oreLocation = oreBlock.location
        village.oreLocations.remove(oreKey)
        foundOre.ores.splice(foundOre.ores.indexOf(oreKey), 1)
        oreBlock.destroy(true)

        const newlyFoundOres = village.scanOreVein(villager.dimension, oreLocation)
        for (const key of newlyFoundOres) {
            if (!foundOre.ores.includes(key)) {
                foundOre.ores.push(key)
            }
        }

        villager.waiting = 15
        villager.setAnimation(undefined)
        villager.taskProgress = 0

        updatePathNodes([oreBlock, oreBlock.aboveSafe(), oreBlock.belowSafe()].filter(checkBlock => checkBlock !== undefined))
    }

    tickRefillMine(village: Village) {
        const villager = this

        if (villager.taskContext.mine === undefined) {
            villager.cancelTask()
            return
        }

        const direction = directionToVector(villager.taskContext.mine.rotation)

        const mine = villager.taskContext.mine
        const frameBlock = villager.dimension.getBlockSafe(
            addVectors(subtractVectors(mine.location, direction), { x: 0, y: 2, z: 0 })
        )
        if (frameBlock === undefined) {
            return
        }

        const isMineStillValid = () => {
            if (!frameBlock.isValid || frameBlock.getFrameItem()?.typeId !== "tektopia:structure_mineshaft") {
                return false
            }
            const validMine = villager.validateMineFrame(village, frameBlock)
            return validMine?.rotation === mine.rotation
                && locationToString(validMine.doorLocation) === locationToString(mine.location)
        }

        const cancelRefill = () => {
            villager.taskContext.mine = undefined
            villager.taskProgress = 0
            villager.stopPath()
            villager.setAnimation(undefined)
            villager.cancelTask()
        }

        if (!frameBlock.isValid || frameBlock.getFrameItem()?.typeId !== "tektopia:structure_mineshaft") {
            cancelRefill()
            return
        }

        const reversedDirection = multiplyVector(direction, "xyz", -1)

        const pathLocation = addVectors(villager.taskContext.mine.location, multiplyVector(reversedDirection, "xyz", 2))

        const pathLocationDistance = calculateDistance(centerVector(pathLocation, true), villager.location)

        if (pathLocationDistance > 0.5) {
            villager.pathFindTo(pathLocation)
            return
        }

        if (villager.taskProgress === 0 && !isMineStillValid()) {
            cancelRefill()
            return
        }

        villager.lookAt(addVectors(villager.location, direction))

        villager.setAnimation("refilling")

        villager.taskProgress++
        villager.stopPath()

        if (villager.taskProgress === 55) {
            const molangVars = new MolangVariableMap
            molangVars.setVector3("direction", direction)
            villager.dimension.spawnParticle("tektopia:cast_forward_beam", villager.location, molangVars)
        }

        if (villager.taskProgress <= 70) {
            return
        }

        if (!isMineStillValid()) {
            cancelRefill()
            return
        }

        const dimension = villager.dimension
        const block = getMineshaftMineBlock(dimension, villager.taskContext.mine.location, villager.taskContext.mine.rotation, false)

        if (block === undefined) {
            villager.cancelTask()
            return
        }

        let currentLocation = { x: block.x, y: villager.taskContext.mine.location.y, z: block.z }

        const firstMineColumn = addVectors(villager.taskContext.mine.location, direction)
        const refillColumnLimit = calculateDistance(block.location, firstMineColumn, true)

        if (refillColumnLimit <= 0) {
            villager.cancelTask()
            return
        }

        const columnAmount = Math.min(randomInt(1, 4), refillColumnLimit)
        const updateBlockList = []

        for (let i = 0; i < columnAmount; i++) {
            currentLocation = addVectors(currentLocation, reversedDirection)

            const currentBlock = dimension.getBlockSafe(currentLocation)
            const fillBlockList = [
                currentBlock,
                currentBlock?.aboveSafe()
            ]

            updateBlockList.push(...fillBlockList)

            for (const fillBlock of fillBlockList) {
                if (fillBlock === undefined) {
                    villager.cancelTask()
                    return
                }

                const possibleBlockWeights = {
                    "minecraft:stone": 12,
                    "minecraft:granite": 4,
                    "minecraft:diorite": 4,
                    "minecraft:andesite": 4,
                    "minecraft:coal_ore": 10,
                    "minecraft:copper_ore": 4,
                    "minecraft:gold_ore": 4,
                    "minecraft:iron_ore": 8,
                    "minecraft:redstone_ore": 3,
                    "minecraft:lapis_ore": 2,
                    "minecraft:diamond_ore": 1
                } as const

                const blockType = randomWeighedItem(possibleBlockWeights)
                if (blockType === undefined) {
                    villager.cancelTask()
                    return
                }

                fillBlock.setType(blockType)
            }
        }

        updatePathNodes(updateBlockList.filter(checkBlock => checkBlock !== undefined))

        villager.taskProgress = 0
    }

    tickChopTree(village: Village) {
        const villager = this

        const dimension = villager.dimension
        const foundTree = villager.taskContext.tree

        if (foundTree === undefined) {
            villager.cancelTask()
            return
        }

        const treeBlock = dimension.getBlockSafe(foundTree)
        if (!treeBlock?.isTree()) {
            village.treeLocations.remove(locationToString(foundTree))
            villager.cancelTask()
            return
        }

        const trunkBlocks = getTrunkBlocks(treeBlock)
        const trunkCenter = {
            x: trunkBlocks.reduce((sum, block) => sum + block.location.x + 0.5, 0) / trunkBlocks.length,
            y: treeBlock.location.y,
            z: trunkBlocks.reduce((sum, block) => sum + block.location.z + 0.5, 0) / trunkBlocks.length
        }
        const treeDist = calculateDistance(trunkCenter, villager.location)
        if (treeDist <= 5) {
            villager.holdingItem = "tool"
        }
        else {
            villager.holdingItem = undefined
        }

        const villagerInventory = this.getInventory()
        if (villagerInventory === undefined) {
            villager.cancelTask()
            return
        }

        if (treeDist >= 0.5 && (villager.isPathing || treeDist >= 3)) {
            villager.pathFindTo(foundTree)
            return
        }

        villager.setAnimation("chopping")
        villager.lookAt({ x: trunkCenter.x, y: trunkCenter.y + 0.5, z: trunkCenter.z })
        villager.taskProgress++
        villager.stopPath()

        if (villager.taskProgress <= 100) {
            return
        }

        const saplingTypeId = treeBlock.typeId.replace(
            "_log",
            "_sapling"
        )
        villager.waiting = true
        villager.setAnimation(undefined)

        const trunkKeys = trunkBlocks.map(block => locationToString(block.location))
        destroyTree(treeBlock, () => {
            village.treeLocations.remove(locationToString(foundTree))
            for (const key of trunkKeys) {
                village.treeLocations.remove(key)
                village.saplingLocations.add(key)
            }
            villager.cancelTask()
            villager.waiting = 30

            const saplingAmount = trunkBlocks.length

            const successful = villagerInventory.removeItem({ includesTypes: [saplingTypeId] }, saplingAmount, true)

            if (successful) {
                for (const trunkBlock of trunkBlocks) {
                    if (!trunkBlock.isValid) {
                        continue
                    }
                    trunkBlock.replace(saplingTypeId)
                }
            }
        })
    }

    checkCollectFurnaceTask(village: Village) {
        const blacksmithStructure = village.findStructures({ includedTypes: ["blacksmith"] })[0]
        if (blacksmithStructure === undefined) {
            return false
        }

        const now = system.currentTick

        // Furnaces another villager is already on their way to empty
        const claimed = new Set<string>()
        for (const villager of world.getVillagers()) {
            if (villager.id === this.id) {
                continue
            }
            const claimedFurnace = villager.taskContext.abandonedFurnace
            if (claimedFurnace !== undefined) {
                claimed.add(locationToString(claimedFurnace))
            }
        }

        let closestFurnace: Block | undefined
        let bestDistance = Infinity
        for (const furnace of blacksmithStructure.getFurnaces()) {
            const key = locationToString(furnace.location)

            if (claimed.has(key) || this.isFurnaceInUse(furnace.location)) {
                continue
            }

            const retryTick = unreachableFurnaces.get(key)
            if (retryTick !== undefined) {
                if (retryTick > now) {
                    continue
                }
                unreachableFurnaces.delete(key)
            }

            // Anything left in the input, fuel or output slot counts as abandoned
            const furnaceContainer = furnace.getComponent(BlockComponentTypes.Inventory)?.container
            if (furnaceContainer === undefined || !FURNACE_SLOTS.some(slotIndex => furnaceContainer.getSlot(slotIndex).getItem() !== undefined)) {
                continue
            }

            const distance = calculateDistance(furnace.bottomCenter(), this.location)
            if (distance < bestDistance) {
                bestDistance = distance
                closestFurnace = furnace
            }
        }

        if (closestFurnace === undefined) {
            return false
        }

        this.taskContext.abandonedFurnace = closestFurnace.location
        return true
    }

    tickCollectFurnaceTask(village: Village) {
        const furnaceLocation = this.taskContext.abandonedFurnace
        if (furnaceLocation === undefined) {
            this.cancelTask()
            return
        }

        const furnace = village.dimension.getBlock(furnaceLocation)
        if (!furnace?.isValid) {
            this.cancelTask()
            return
        }

        // A villager started a smelt in it since this task was picked, so the output is theirs
        if (this.isFurnaceInUse(furnaceLocation)) {
            this.cancelTask()
            return
        }

        const furnaceInventory = furnace.getComponent(BlockComponentTypes.Inventory)?.container
        const villagerInventory = this.getInventory()
        if (furnaceInventory === undefined || villagerInventory === undefined) {
            this.cancelTask()
            return
        }

        const filledSlots = FURNACE_SLOTS.map(slotIndex => furnaceInventory.getSlot(slotIndex)).filter(slot => slot.getItem() !== undefined)
        if (filledSlots.length === 0) {
            this.cancelTask()
            return
        }

        if (calculateDistance(furnace.bottomCenter(), this.location) > 1.5) {
            if (this.pathError !== undefined) {
                unreachableFurnaces.set(locationToString(furnaceLocation), system.currentTick + UNREACHABLE_FURNACE_RETRY_TICKS)
                this.cancelTask()
                return
            }
            this.pathFindTo(furnaceLocation)
            return
        }

        this.stopPath()
        this.lookAt(furnace.center())

        // Whatever doesn't fit stays in the furnace rather than being dropped on the floor
        let anythingLeft = false
        let tookAnything = false
        for (const slot of filledSlots) {
            const item = slot.getItem()
            if (item === undefined) {
                continue
            }
            const leftover = villagerInventory.addItem(item)
            if (leftover === undefined) {
                slot.setItem(undefined)
                tookAnything = true
            }
            else if (leftover.amount < item.amount) {
                slot.amount = leftover.amount
                anythingLeft = true
                tookAnything = true
            }
            else {
                anythingLeft = true
            }
        }

        if (anythingLeft && !tookAnything) {
            unreachableFurnaces.set(locationToString(furnaceLocation), system.currentTick + UNREACHABLE_FURNACE_RETRY_TICKS)
        }

        this.cancelTask()
    }

    getRecipes(village: Village, itemIds: string[], structureType: keyof StructureTypeMap, amounts: Record<string, number> = {}) {
        const villageStorage = village.storage

        const structure = village.findStructures({ includedTypes: [structureType] })[0]
        if (structure === undefined) {
            return []
        }

        if (!(structure instanceof BlackSmith) && !(structure instanceof Kitchen)) {
            return []
        }

        const availableCounts = villageStorage.getItemCounts()

        const hasFurnace = structure.getFurnaces().length > 0
        // Only the kitchen needs this check: the blacksmith's anvil/crafting table choice is made per step later on
        const hasCraftingTable = !(structure instanceof Kitchen) || structure.getCraftingTables().length > 0

        const craftingPlans: CraftingJob[] = []

        outer: for (const itemId of itemIds) {
            const counts = { ...availableCounts, [itemId]: 0 }
            // Storage may have changed since the task was picked, so craft as many as are still possible
            const amount = getMaxCrafts(itemId, counts, Math.max(1, amounts[itemId] ?? 1), { smelting: hasFurnace })
            if (amount < 1) {
                continue
            }

            const craftingPlan = getCraftingPlan(itemId, counts, amount, { smelting: hasFurnace })
            if (hasStationsFor(craftingPlan, hasCraftingTable)) {
                for (const [requiredId, requiredAmount] of Object.entries(getRequiredItems(craftingPlan))) {
                    availableCounts[requiredId] = (availableCounts[requiredId] ?? 0) - requiredAmount
                }
                craftingPlans.push({ itemId, amount, plan: craftingPlan })
                if (craftingPlans.length >= 5) {
                    break outer
                }
            }
        }

        if (craftingPlans.length === 0) {
            return []
        }

        return craftingPlans
    }

    tickCookTask(village: Village) {
        const cookingCache = this.taskCache.cooking ??= {}
        const cookingRecipeIds = this.taskContext.cooking
        if (cookingRecipeIds === undefined) {
            this.cancelTask()
            return
        }

        cookingCache.recipes ??= this.getRecipes(village, cookingRecipeIds, "kitchen", this.taskContext.cookingAmounts)

        const smelts = this.taskContext.smelts ??= {}

        const villageStorage = village.storage

        const villagerInventory = this.getInventory()
        if (villagerInventory === undefined) {
            return
        }

        // Step 1: gather everything every recipe needs from the village storage
        if (!cookingCache.hasItems) {
            const villagerItemCounts = villagerInventory.getItemCounts()

            if (cookingCache.items === undefined) {
                const items: Record<string, number> = {}
                for (const recipe of cookingCache.recipes) {
                    for (const [itemId, amount] of Object.entries(getRequiredItems(recipe.plan))) {
                        items[itemId] = (items[itemId] ?? 0) + amount
                    }
                }

                cookingCache.items = items
            }

            for (const [itemId, amount] of Object.entries(cookingCache.items)) {
                const amountNeeded = amount - (villagerItemCounts[itemId] ?? 0)
                if (amountNeeded > 0) {
                    const itemResults = villageStorage.findItems({ includesTypes: [itemId] }, amountNeeded)
                    const targetItem = itemResults[0]
                    if (targetItem === undefined) {
                        this.cancelTask()
                        return
                    }

                    const chestLocation = targetItem.chest.location
                    const chestDistance = calculateDistance(centerVector(chestLocation, true), this.location)

                    if (chestDistance > 1.5) {
                        this.pathFindTo(chestLocation)
                        return
                    }

                    this.stopPath()
                    if (!this.openChest(chestLocation)) {
                        return
                    }

                    const moved = targetItem.chest.container.transferItemStack(targetItem.slotIndex, villagerInventory, targetItem.item.amount)
                    this.closeChest()

                    if (moved <= 0) {
                        // Nothing fit in the villager's inventory (or the stack vanished), retrying would loop forever
                        this.cancelTask()
                        return
                    }

                    return
                }
            }

            cookingCache.hasItems = true
        }

        const kitchenStructure = village.findStructures({ includedTypes: ["kitchen"] })[0]
        if (kitchenStructure === undefined) {
            this.cancelTask()
            return
        }

        const dropRecipe = (recipe: CraftingJob) => {
            if (cookingCache.recipes === undefined) {
                return
            }

            delete smelts[recipe.itemId]

            const index = cookingCache.recipes.indexOf(recipe)
            if (index !== -1) {
                cookingCache.recipes.splice(index, 1)
            }
        }

        const nextStep = (recipe: CraftingJob) => {
            recipe.doneSteps ??= []
            for (const [index, step] of recipe.plan.entries()) {
                const doneStep = recipe.doneSteps[index]
                if (doneStep === undefined || doneStep < step.times) {
                    return { ...step, index }
                }
            }
            return undefined
        }

        // Step 2: check every furnace in use. Time passes for all of them, whether or not the villager is nearby
        let finishedRecipe: CraftingJob | undefined
        for (const recipe of [...cookingCache.recipes]) {
            const waitingForSmelt = smelts[recipe.itemId]
            if (waitingForSmelt === undefined) {
                continue
            }

            const furnace = village.dimension.getBlock(waitingForSmelt.furnace)
            // The blacksmith prefers blast furnaces, so those count as valid smelting furnaces here too
            if (furnace === undefined || !COOK_FURNACE_TYPES.includes(furnace.typeId)) {
                dropRecipe(recipe)
                continue
            }

            const furnaceInventory = furnace.getComponent(BlockComponentTypes.Inventory)?.container
            if (furnaceInventory === undefined) {
                dropRecipe(recipe)
                continue
            }

            waitingForSmelt.ticks++

            const outputItem = furnaceInventory.getSlot(2).getItem()

            if (outputItem !== undefined && outputItem.typeId !== waitingForSmelt.outputId) {
                // Something else is in the output slot, so the furnace is blocked
                dropRecipe(recipe)
                continue
            }

            if (outputItem !== undefined && outputItem.amount >= waitingForSmelt.amount) {
                finishedRecipe ??= recipe
                continue
            }

            if (waitingForSmelt.ticks > waitingForSmelt.maxTicks) {
                // The furnace never produced the output (out of fuel, or something else is using it)
                dropRecipe(recipe)
            }
        }

        if (cookingCache.recipes.length === 0) {
            this.cancelTask()
            return
        }

        // Step 3: start smelting everything that needs a furnace, as long as a free furnace is available
        const pendingSmelt = cookingCache.recipes.find(recipe => {
            if (smelts[recipe.itemId] !== undefined) {
                return false
            }
            return nextStep(recipe)?.smelt === true
        })

        if (pendingSmelt !== undefined) {
            const smeltStep = nextStep(pendingSmelt)
            if (smeltStep?.smelt === true) {
                const furnaces = kitchenStructure.getFurnaces()

                if (furnaces.length === 0) {
                    dropRecipe(pendingSmelt)
                    return
                }

                const freeFurnaces = furnaces.filter(furnace => !this.isFurnaceInUse(furnace.location)).map(block => ({ block, isSmoker: block.typeId === "minecraft:smoker_furnace" || block.typeId === "minecraft:lit_smoker_furnace" }))

                if (freeFurnaces.length > 0) {
                    const closestFurnace = freeFurnaces.reduce((closest, table) =>
                        (table.isSmoker && !closest.isSmoker)
    || (table.isSmoker === closest.isSmoker
        && calculateDistance(table.block.bottomCenter(), this.location)
        < calculateDistance(closest.block.bottomCenter(), this.location))
                            ? table
                            : closest
                    ).block

                    const furnaceDistance = calculateDistance(closestFurnace.bottomCenter(), this.location)
                    if (furnaceDistance > 1.5) {
                        this.pathFindTo(closestFurnace.location)
                        return
                    }

                    const furnaceInventory = closestFurnace.getComponent(BlockComponentTypes.Inventory)?.container
                    if (furnaceInventory === undefined) {
                        dropRecipe(pendingSmelt)
                        return
                    }

                    this.stopPath()
                    this.lookAt(closestFurnace.center())

                    const inputSlot = furnaceInventory.getSlot(0)
                    const fuelSlot = furnaceInventory.getSlot(1)

                    // Anything already in the furnace is taken out first (old output would be mistaken for the new result)
                    for (const slot of [furnaceInventory.getSlot(2), inputSlot, fuelSlot]) {
                        const item = slot.getItem()
                        if (item === undefined) {
                            continue
                        }
                        if (villagerInventory.isFull) {
                            dropRecipe(pendingSmelt)
                            return
                        }
                        this.giveItem(village, villagerInventory, item)
                        slot.setItem(undefined)
                    }

                    // The whole step is loaded at once. The plan is only read here, never modified
                    const inputNeeded = smeltStep.input.amount * smeltStep.times
                    const fuelNeeded = smeltStep.fuel.amount

                    const inputResults = villagerInventory.findItems({ includesTypes: [smeltStep.input.id] }, inputNeeded)
                    const fuelResults = villagerInventory.findItems({ includesTypes: [smeltStep.fuel.id] }, fuelNeeded)

                    const inputAvailable = inputResults.reduce((sum, result) => sum + result.item.amount, 0)
                    const fuelAvailable = fuelResults.reduce((sum, result) => sum + result.item.amount, 0)

                    // Furnace slots hold one stack, so a step that doesn't fit in a single stack can't be loaded in one go
                    const inputMax = inputResults[0]?.item.maxAmount ?? 0
                    const fuelMax = fuelResults[0]?.item.maxAmount ?? 0

                    if (inputAvailable < inputNeeded || fuelAvailable < fuelNeeded || inputNeeded > inputMax || fuelNeeded > fuelMax) {
                        dropRecipe(pendingSmelt)
                        return
                    }

                    const loadSlot = (results: typeof inputResults, target: typeof inputSlot) => {
                        for (const result of results) {
                            const slot = villagerInventory.getSlot(result.slotIndex)
                            const item = slot.getItem()
                            if (item === undefined) {
                                continue
                            }

                            const existing = target.getItem()
                            if (existing !== undefined && !existing.isStackableWith(item)) {
                                continue
                            }

                            const decreaseResult = slot.decreaseAmount(result.item.amount)
                            if (decreaseResult === undefined) {
                                continue
                            }

                            if (existing !== undefined) {
                                target.amount += decreaseResult.item.amount
                            }
                            else {
                                target.setItem(decreaseResult.item)
                            }
                        }
                    }

                    loadSlot(inputResults, inputSlot)
                    loadSlot(fuelResults, fuelSlot)

                    if (!inputSlot.hasItem()) {
                        dropRecipe(pendingSmelt)
                        return
                    }

                    pendingSmelt.doneSteps ??= []

                    pendingSmelt.doneSteps[smeltStep.index] = smeltStep.times
                    smelts[pendingSmelt.itemId] = {
                        amount: smeltStep.output.amount * smeltStep.times,
                        outputId: smeltStep.output.id,
                        furnace: closestFurnace.location,
                        ticks: 0,
                        // A furnace smelts one item per 200 ticks
                        maxTicks: (inputNeeded * 200) + 400
                    }
                    return
                }
                // No free furnace right now: carry on with crafting or collecting below and come back later
            }
        }

        const finishedSmelt = finishedRecipe === undefined ? undefined : smelts[finishedRecipe.itemId]

        // Step 4: collect smelted items that are finished, so the recipe can continue
        if (finishedRecipe !== undefined && finishedSmelt !== undefined) {
            const waitingForSmelt = finishedSmelt

            const furnaceDistance = calculateDistance(centerVector(waitingForSmelt.furnace, true), this.location)
            if (furnaceDistance > 1.5) {
                this.pathFindTo(waitingForSmelt.furnace)
                return
            }

            const furnaceInventory = village.dimension.getBlock(waitingForSmelt.furnace)?.getComponent(BlockComponentTypes.Inventory)?.container
            if (furnaceInventory === undefined) {
                dropRecipe(finishedRecipe)
                return
            }

            const outputSlot = furnaceInventory.getSlot(2)
            const outputItem = outputSlot.getItem()
            if (outputItem === undefined) {
                return
            }

            if (villagerInventory.isFull) {
                dropRecipe(finishedRecipe)
                return
            }

            this.stopPath()
            this.lookAt(centerVector(waitingForSmelt.furnace, true))
            this.giveItem(village, villagerInventory, outputItem)
            outputSlot.setItem(undefined)
            delete smelts[finishedRecipe.itemId]
            return
        }

        // Step 5: craft whatever is ready (recipes still waiting on a furnace are skipped)
        const readyRecipe = cookingCache.recipes.find(recipe => {
            if (smelts[recipe.itemId] !== undefined) {
                return false
            }
            const step = nextStep(recipe)
            return step !== undefined && !step.smelt
        })

        if (readyRecipe === undefined) {
            // Remove recipes that are completely done
            for (const recipe of [...cookingCache.recipes]) {
                if (smelts[recipe.itemId] === undefined && nextStep(recipe) === undefined) {
                    dropRecipe(recipe)
                }
            }

            if (cookingCache.recipes.length === 0) {
                this.cancelTask()
                return
            }

            // Everything left is waiting for a furnace to finish (or to become free)
            this.stopPath()
            this.setAnimation(undefined)
            return
        }

        const craftingStep = nextStep(readyRecipe)
        if (craftingStep === undefined || craftingStep.smelt) {
            return
        }

        const craftingBlock = kitchenStructure.getCraftingTables()

        if (craftingBlock.length === 0) {
            dropRecipe(readyRecipe)
            return
        }

        const anvilTable = craftingBlock.reduce((closest, table) =>
            calculateDistance(table.bottomCenter(), this.location)
                < calculateDistance(closest.bottomCenter(), this.location)
                ? table
                : closest
        )

        const anvilDistance = calculateDistance(anvilTable.bottomCenter(), this.location)
        if (anvilDistance > 1.5) {
            this.pathFindTo(anvilTable.location)
            return
        }

        this.stopPath()
        this.setAnimation("cooking")
        this.lookAt(anvilTable.center())
        this.holdingItem = craftingStep.output.id

        this.taskProgress++

        if (this.taskProgress <= 100) {
            return
        }

        this.taskProgress = 0
        this.setAnimation(undefined)
        this.holdingItem = undefined

        const successful = this.craftItem(craftingStep)

        if (!successful) {
            dropRecipe(readyRecipe)
            return
        }

        readyRecipe.doneSteps ??= []

        readyRecipe.doneSteps[craftingStep.index] = (readyRecipe.doneSteps[craftingStep.index] ?? 0) + 1

        this.waiting = 20
    }

    tickSmithTask(village: Village) {
        const smithingCache = this.taskCache.smithing ??= {}
        const smithingRecipeIds = this.taskContext.smithing
        if (smithingRecipeIds === undefined) {
            this.cancelTask()
            return
        }

        smithingCache.recipes ??= this.getRecipes(village, smithingRecipeIds, "blacksmith", this.taskContext.smithingAmounts)

        const smelts = this.taskContext.smelts ??= {}

        const villageStorage = village.storage

        const villagerInventory = this.getInventory()
        if (villagerInventory === undefined) {
            return
        }

        // Step 1: gather everything every recipe needs from the village storage
        if (!smithingCache.hasItems) {
            const villagerItemCounts = villagerInventory.getItemCounts()

            if (smithingCache.items === undefined) {
                const items: Record<string, number> = {}
                for (const recipe of smithingCache.recipes) {
                    for (const [itemId, amount] of Object.entries(getRequiredItems(recipe.plan))) {
                        items[itemId] = (items[itemId] ?? 0) + amount
                    }
                }

                smithingCache.items = items
            }

            for (const [itemId, amount] of Object.entries(smithingCache.items)) {
                const amountNeeded = amount - (villagerItemCounts[itemId] ?? 0)
                if (amountNeeded > 0) {
                    const itemResults = villageStorage.findItems({ includesTypes: [itemId] }, amountNeeded)
                    const targetItem = itemResults[0]
                    if (targetItem === undefined) {
                        this.cancelTask()
                        return
                    }

                    const chestLocation = targetItem.chest.location
                    const chestDistance = calculateDistance(centerVector(chestLocation, true), this.location)

                    if (chestDistance > 1.5) {
                        this.pathFindTo(chestLocation)
                        return
                    }

                    this.stopPath()
                    if (!this.openChest(chestLocation)) {
                        return
                    }

                    const moved = targetItem.chest.container.transferItemStack(targetItem.slotIndex, villagerInventory, targetItem.item.amount)
                    this.closeChest()

                    if (moved <= 0) {
                        // Nothing fit in the villager's inventory (or the stack vanished), retrying would loop forever
                        this.cancelTask()
                        return
                    }

                    return
                }
            }

            smithingCache.hasItems = true
        }

        const blacksmithStructure = village.findStructures({ includedTypes: ["blacksmith"] })[0]
        if (blacksmithStructure === undefined) {
            this.cancelTask()
            return
        }

        const dropRecipe = (recipe: CraftingJob) => {
            if ( smithingCache.recipes === undefined) {
                return
            }

            delete smelts[recipe.itemId]

            const index = smithingCache.recipes.indexOf(recipe)
            if (index !== -1) {
                smithingCache.recipes.splice(index, 1)
            }
        }

        const nextStep = (recipe: CraftingJob) => {
            recipe.doneSteps ??= []
            for (const [index, step] of recipe.plan.entries()) {
                const doneStep = recipe.doneSteps[index]
                if (doneStep === undefined || doneStep < step.times) {
                    return { ...step, index }
                }
            }
            return undefined
        }

        // Step 2: check every furnace in use. Time passes for all of them, whether or not the villager is nearby
        let finishedRecipe: CraftingJob | undefined
        for (const recipe of [...smithingCache.recipes]) {
            const waitingForSmelt = smelts[recipe.itemId]
            if (waitingForSmelt === undefined) {
                continue
            }

            const furnace = village.dimension.getBlock(waitingForSmelt.furnace)
            // The blacksmith prefers blast furnaces, so those count as valid smelting furnaces here too
            if (furnace === undefined || !SMITH_FURNACE_TYPES.includes(furnace.typeId)) {
                dropRecipe(recipe)
                continue
            }

            const furnaceInventory = furnace.getComponent(BlockComponentTypes.Inventory)?.container
            if (furnaceInventory === undefined) {
                dropRecipe(recipe)
                continue
            }

            waitingForSmelt.ticks++

            const outputItem = furnaceInventory.getSlot(2).getItem()

            if (outputItem !== undefined && outputItem.typeId !== waitingForSmelt.outputId) {
                // Something else is in the output slot, so the furnace is blocked
                dropRecipe(recipe)
                continue
            }

            if (outputItem !== undefined && outputItem.amount >= waitingForSmelt.amount) {
                finishedRecipe ??= recipe
                continue
            }

            if (waitingForSmelt.ticks > waitingForSmelt.maxTicks) {
                // The furnace never produced the output (out of fuel, or something else is using it)
                dropRecipe(recipe)
            }
        }

        if (smithingCache.recipes.length === 0) {
            this.cancelTask()
            return
        }

        // Step 3: start smelting everything that needs a furnace, as long as a free furnace is available
        const pendingSmelt = smithingCache.recipes.find(recipe => {
            if (smelts[recipe.itemId] !== undefined) {
                return false
            }
            return nextStep(recipe)?.smelt === true
        })

        if (pendingSmelt !== undefined) {
            const smeltStep = nextStep(pendingSmelt)
            if (smeltStep?.smelt === true) {
                const furnaces = blacksmithStructure.getFurnaces()

                if (furnaces.length === 0) {
                    dropRecipe(pendingSmelt)
                    return
                }

                const freeFurnaces = furnaces.filter(furnace => !this.isFurnaceInUse(furnace.location)).map(block => ({ block, isBlastFurnace: block.typeId === "minecraft:blast_furnace" || block.typeId === "minecraft:lit_blast_furnace" }))

                if (freeFurnaces.length > 0) {
                    const closestFurnace = freeFurnaces.reduce((closest, table) =>
                        (table.isBlastFurnace && !closest.isBlastFurnace)
    || (table.isBlastFurnace === closest.isBlastFurnace
        && calculateDistance(table.block.bottomCenter(), this.location)
        < calculateDistance(closest.block.bottomCenter(), this.location))
                            ? table
                            : closest
                    ).block

                    const furnaceDistance = calculateDistance(closestFurnace.bottomCenter(), this.location)
                    if (furnaceDistance > 1.5) {
                        this.pathFindTo(closestFurnace.location)
                        return
                    }

                    const furnaceInventory = closestFurnace.getComponent(BlockComponentTypes.Inventory)?.container
                    if (furnaceInventory === undefined) {
                        dropRecipe(pendingSmelt)
                        return
                    }

                    this.stopPath()
                    this.lookAt(closestFurnace.center())

                    const inputSlot = furnaceInventory.getSlot(0)
                    const fuelSlot = furnaceInventory.getSlot(1)

                    // Anything already in the furnace is taken out first (old output would be mistaken for the new result)
                    for (const slot of [furnaceInventory.getSlot(2), inputSlot, fuelSlot]) {
                        const item = slot.getItem()
                        if (item === undefined) {
                            continue
                        }
                        if (villagerInventory.isFull) {
                            dropRecipe(pendingSmelt)
                            return
                        }
                        this.giveItem(village, villagerInventory, item)
                        slot.setItem(undefined)
                    }

                    // The whole step is loaded at once. The plan is only read here, never modified
                    const inputNeeded = smeltStep.input.amount * smeltStep.times
                    const fuelNeeded = smeltStep.fuel.amount

                    const inputResults = villagerInventory.findItems({ includesTypes: [smeltStep.input.id] }, inputNeeded)
                    const fuelResults = villagerInventory.findItems({ includesTypes: [smeltStep.fuel.id] }, fuelNeeded)

                    const inputAvailable = inputResults.reduce((sum, result) => sum + result.item.amount, 0)
                    const fuelAvailable = fuelResults.reduce((sum, result) => sum + result.item.amount, 0)

                    // Furnace slots hold one stack, so a step that doesn't fit in a single stack can't be loaded in one go
                    const inputMax = inputResults[0]?.item.maxAmount ?? 0
                    const fuelMax = fuelResults[0]?.item.maxAmount ?? 0

                    if (inputAvailable < inputNeeded || fuelAvailable < fuelNeeded || inputNeeded > inputMax || fuelNeeded > fuelMax) {
                        dropRecipe(pendingSmelt)
                        return
                    }

                    const loadSlot = (results: typeof inputResults, target: typeof inputSlot) => {
                        for (const result of results) {
                            const slot = villagerInventory.getSlot(result.slotIndex)
                            const item = slot.getItem()
                            if (item === undefined) {
                                continue
                            }

                            const existing = target.getItem()
                            if (existing !== undefined && !existing.isStackableWith(item)) {
                                continue
                            }

                            const decreaseResult = slot.decreaseAmount(result.item.amount)
                            if (decreaseResult === undefined) {
                                continue
                            }

                            if (existing !== undefined) {
                                target.amount += decreaseResult.item.amount
                            }
                            else {
                                target.setItem(decreaseResult.item)
                            }
                        }
                    }

                    loadSlot(inputResults, inputSlot)
                    loadSlot(fuelResults, fuelSlot)

                    if (!inputSlot.hasItem()) {
                        dropRecipe(pendingSmelt)
                        return
                    }

                    pendingSmelt.doneSteps ??= []

                    pendingSmelt.doneSteps[smeltStep.index] = smeltStep.times
                    smelts[pendingSmelt.itemId] = {
                        amount: smeltStep.output.amount * smeltStep.times,
                        outputId: smeltStep.output.id,
                        furnace: closestFurnace.location,
                        ticks: 0,
                        // A furnace smelts one item per 200 ticks
                        maxTicks: (inputNeeded * 200) + 400
                    }
                    return
                }
                // No free furnace right now: carry on with crafting or collecting below and come back later
            }
        }

        const finishedSmelt = finishedRecipe === undefined ? undefined : smelts[finishedRecipe.itemId]

        // Step 4: collect smelted items that are finished, so the recipe can continue
        if (finishedRecipe !== undefined && finishedSmelt !== undefined) {
            const waitingForSmelt = finishedSmelt

            const furnaceDistance = calculateDistance(centerVector(waitingForSmelt.furnace, true), this.location)
            if (furnaceDistance > 1.5) {
                this.pathFindTo(waitingForSmelt.furnace)
                return
            }

            const furnaceInventory = village.dimension.getBlock(waitingForSmelt.furnace)?.getComponent(BlockComponentTypes.Inventory)?.container
            if (furnaceInventory === undefined) {
                dropRecipe(finishedRecipe)
                return
            }

            const outputSlot = furnaceInventory.getSlot(2)
            const outputItem = outputSlot.getItem()
            if (outputItem === undefined) {
                return
            }

            if (villagerInventory.isFull) {
                dropRecipe(finishedRecipe)
                return
            }

            this.stopPath()
            this.lookAt(centerVector(waitingForSmelt.furnace, true))
            this.giveItem(village, villagerInventory, outputItem)
            outputSlot.setItem(undefined)
            delete smelts[finishedRecipe.itemId]
            return
        }

        // Step 5: craft whatever is ready (recipes still waiting on a furnace are skipped)
        const readyRecipe = smithingCache.recipes.find(recipe => {
            if (smelts[recipe.itemId] !== undefined) {
                return false
            }
            const step = nextStep(recipe)
            return step !== undefined && !step.smelt
        })

        if (readyRecipe === undefined) {
            // Remove recipes that are completely done
            for (const recipe of [...smithingCache.recipes]) {
                if (smelts[recipe.itemId] === undefined && nextStep(recipe) === undefined) {
                    dropRecipe(recipe)
                }
            }

            if (smithingCache.recipes.length === 0) {
                this.cancelTask()
                return
            }

            // Everything left is waiting for a furnace to finish (or to become free)
            this.stopPath()
            this.setAnimation(undefined)
            return
        }

        const craftingStep = nextStep(readyRecipe)
        if (craftingStep === undefined || craftingStep.smelt) {
            return
        }

        const useAnvil = smithingCraftingIds.flat().includes(craftingStep.output.id)

        const craftingBlock = useAnvil ? blacksmithStructure.getAnvils() : blacksmithStructure.getCraftingTables()

        if (craftingBlock.length === 0) {
            dropRecipe(readyRecipe)
            return
        }

        const anvilTable = craftingBlock.reduce((closest, table) =>
            calculateDistance(table.bottomCenter(), this.location)
                < calculateDistance(closest.bottomCenter(), this.location)
                ? table
                : closest
        )

        const anvilDistance = calculateDistance(anvilTable.bottomCenter(), this.location)
        if (anvilDistance > 1.5) {
            this.pathFindTo(anvilTable.location)
            return
        }

        this.stopPath()
        this.setAnimation(useAnvil ? "forging" : "crafting")
        this.lookAt(anvilTable.center())
        this.holdingItem = useAnvil ? "tektopia:iron_hammer" : craftingStep.output.id

        this.taskProgress++

        if (this.taskProgress <= 100) {
            return
        }

        this.taskProgress = 0
        this.setAnimation(undefined)
        this.holdingItem = undefined

        const successful = this.craftItem(craftingStep)

        if (!successful) {
            dropRecipe(readyRecipe)
            return
        }

        readyRecipe.doneSteps ??= []

        readyRecipe.doneSteps[craftingStep.index] = (readyRecipe.doneSteps[craftingStep.index] ?? 0) + 1

        this.waiting = 20
    }

    tickGrowSapling() {
        const villager = this

        const foundSapling = villager.taskContext.sapling
        if (foundSapling === undefined) {
            villager.cancelTask()
            return
        }

        const saplingBlock = this.dimension.getBlockSafe(foundSapling)
        if (saplingBlock === undefined) {
            villager.cancelTask()
            return
        }

        if (!Registry.saplingTypes.includes(saplingBlock.typeId)) {
            villager.cancelTask()
            return
        }

        const saplingDistance = calculateDistance(centerVector(foundSapling, true), villager.location)
        if (saplingDistance >= 7 && (villager.isPathing || saplingDistance >= 10)) {
            villager.pathFindTo(foundSapling)
            return
        }

        villager.stopPath()
        if (villager.taskProgress === 0) {
            villager.playAnimation("animation.tektopia_villager.cast_grow")
        }

        villager.lookAt(centerVector(foundSapling))

        villager.taskProgress++

        villager.dimension.spawnParticle("tektopia:cast_grow_crop_charge", centerVector(foundSapling, true))

        if (villager.taskProgress === 70) {
            villager.dimension.spawnParticle("tektopia:cast_grow_crop_grow", centerVector(foundSapling, true))
        }

        if (villager.taskProgress <= 80) {
            return
        }

        saplingBlock.growTree()

        villager.cancelTask()
        villager.waiting = 10
    }

    tickGrowCrop(village: Village) {
        const villager = this

        const foundGrowableCrop = villager.taskContext.growableCrop
        if (foundGrowableCrop === undefined) {
            villager.cancelTask()
            return
        }

        const cropBlock = this.dimension.getBlockSafe(foundGrowableCrop)
        if (cropBlock === undefined) {
            villager.cancelTask()
            return
        }

        if (cropBlock.isAir || cropBlock.isHarvestableCrop) {
            const cropBlockLocationString = locationToString(cropBlock)
            village.growLocations.remove(cropBlockLocationString)
            villager.cancelTask()
            return
        }

        const cropBlockDistance = calculateDistance(centerVector(foundGrowableCrop, true), villager.location)
        if ((cropBlockDistance >= 7 && (villager.isPathing || cropBlockDistance >= 10)) || Math.floor(foundGrowableCrop.y) !== Math.floor(villager.location.y + 0.25)) {
            villager.pathFindTo(foundGrowableCrop)
            return
        }

        villager.stopPath()
        if (villager.taskProgress === 0) {
            villager.playAnimation("animation.tektopia_villager.cast_grow")
        }

        villager.lookAt(centerVector(foundGrowableCrop))

        villager.taskProgress++

        villager.dimension.spawnParticle("tektopia:cast_grow_crop_charge", centerVector(foundGrowableCrop, true))

        if (villager.taskProgress === 70) {
            villager.dimension.spawnParticle("tektopia:cast_grow_crop_grow", centerVector(foundGrowableCrop, true))
        }

        if (villager.taskProgress <= 80) {
            return
        }

        const north = cropBlock.northSafe()
        const east = cropBlock.eastSafe()
        const south = cropBlock.southSafe()
        const west = cropBlock.westSafe()

        const blockList = [
            cropBlock,
            north,
            east,
            south,
            west,
            north?.eastSafe(),
            east?.southSafe(),
            south?.westSafe(),
            west?.northSafe()
        ]

        for (const block of blockList) {
            if (block === undefined) {
                continue
            }

            if (block.isCrop) {
                const blockGrowth = block.permutation.getState("growth")
                if (blockGrowth !== undefined) {
                    block.setPermutation(block.permutation.withState("growth", Math.min(blockGrowth + randomInt(2, 5), 7)))
                }
            }
            else if (block.isValidSugarCane) {
                const sugarCaneBlockList = [
                    block, block.aboveSafe(), block.aboveSafe(2)
                ]

                for (const sugarCaneBlock of sugarCaneBlockList) {
                    if (!sugarCaneBlock?.isAir) {
                        continue
                    }

                    sugarCaneBlock.setType("minecraft:reeds")
                }
            }
            else if (block.typeId === "minecraft:sweet_berry_bush") {
                const blockGrowth = block.permutation.getState("growth")
                if (blockGrowth !== undefined) {
                    block.setPermutation(block.permutation.withState("growth", Math.min(blockGrowth + randomInt(1, 4), 3)))
                }
            }
        }

        villager.cancelTask()

        villager.waiting = 10
    }

    tickHarvest(village: Village) {
        const villager = this

        const foundHarvest = villager.taskContext.harvestLocation
        const dimension = villager.dimension

        if (foundHarvest === undefined) {
            villager.cancelTask()
            return
        }

        const harvestBlock = dimension.getBlockSafe(foundHarvest)
        if (harvestBlock === undefined) {
            villager.cancelTask()
            return
        }

        const harvestLocationString = locationToString(foundHarvest)

        if (!harvestBlock.isHarvestable) {
            village.harvestLocations.remove(harvestLocationString)
            villager.cancelTask()
            return
        }

        const harvestLocationDist = calculateDistance(centerVector(foundHarvest, true), villager.location)
        if (harvestLocationDist >= 1 && (villager.isPathing || harvestLocationDist >= 2)) {
            villager.pathFindTo(foundHarvest)
            return
        }

        villager.setAnimation("harvesting")
        villager.lookAt(centerVector(foundHarvest))
        villager.taskProgress++
        villager.stopPath()

        if (villager.taskProgress <= 100) {
            return
        }

        if (harvestBlock.isHarvestableCrop) {
            village.plantLocations[harvestLocationString] = harvestBlock.typeId
            harvestBlock.destroy(true)
        }
        else if (harvestBlock.isHarvestableGourd) {
            harvestBlock.destroy(true)
        }
        else if (harvestBlock.isHarvestableSugarCane) {
            const blockList = [harvestBlock.aboveSafe(2), harvestBlock.aboveSafe()]
            for (const block of blockList) {
                block?.destroy(true)
            }
        }
        else if (harvestBlock.isHarvestableSweetBerryBush) {
            const savedPermutation = harvestBlock.permutation.withState("growth", 1)
            harvestBlock.destroy(true)
            harvestBlock.setPermutation(savedPermutation)
        }

        updatePathNodes([harvestBlock, harvestBlock.aboveSafe(), harvestBlock.belowSafe()].filter(checkBlock => checkBlock !== undefined))

        villager.waiting = 30
        villager.setAnimation(undefined)
        villager.cancelTask()
    }

    tickPlant(village: Village) {
        const villager = this

        const foundPlant = villager.taskContext.plant
        const dimension = villager.dimension

        if (foundPlant === undefined) {
            villager.cancelTask()
            return
        }

        const plantBlock = dimension.getBlockSafe(foundPlant.location)
        const plantLocationString = locationToString(foundPlant.location)

        if (!plantBlock?.isAir) {
            delete village.plantLocations[plantLocationString]
            villager.cancelTask()
            return
        }

        const seedId = cropSeeds[foundPlant.type]
        if (seedId === undefined) {
            villager.cancelTask()
            return
        }

        const villagerInventory = this.getInventory()
        if (villagerInventory === undefined) {
            villager.cancelTask()
            return
        }

        if (!villagerInventory.hasItem({ includesTypes: [seedId] })) {
            // Seeds ran out for this crop: try another spot whose seed we can still get.
            // The task loop will fetch the new seed from storage if needed.
            if (!villager.canGetSeedFor(village, foundPlant.type)) {
                if (villager.findPlantLocation(village)) {
                    villager.taskProgress = 0
                    villager.stopPath()
                }
                else {
                    villager.cancelTask()
                }
            }
            return
        }

        const plantLocationDist = calculateDistance(centerVector(foundPlant.location, true), villager.location)
        if (plantLocationDist >= 1.25) {
            villager.pathFindTo(foundPlant.location)
            return
        }

        villager.setAnimation("planting")
        villager.lookAt(centerVector(foundPlant.location))
        villager.taskProgress++
        villager.stopPath()

        if (villager.taskProgress <= 100) {
            return
        }

        const successful = villagerInventory.removeItem({ includesTypes: [seedId] }, 1, true)
        if (successful) {
            plantBlock.replace(foundPlant.type)
        }

        villager.waiting = 20
        villager.setAnimation(undefined)
        villager.cancelTask()
    }

    tickTill(village: Village) {
        const villager = this

        const foundTill = villager.taskContext.tillLocation
        const dimension = villager.dimension

        if (foundTill !== undefined) {
            const tillBlock = dimension.getBlockSafe(foundTill)
            const tillLocationString = locationToString(foundTill)
            const pathLocation = addVector(foundTill, "y", 1)
            const tillResult = tillBlock?.tillResult

            if (tillBlock !== undefined && tillResult !== undefined) {
                const pathLocationDist = calculateDistance(centerVector(pathLocation, true), villager.location)
                if (pathLocationDist <= 5) {
                    villager.holdingItem = "tool"
                }
                else {
                    villager.holdingItem = undefined
                }
                if (pathLocationDist < 2) {
                    villager.setAnimation("tilling")
                    villager.lookAt(centerVector(foundTill))
                    villager.stopPath()

                    villager.taskProgress++
                    if (villager.taskProgress > 100) {
                        villager.waiting = 20
                        villager.setAnimation(undefined)
                        villager.cancelTask()

                        tillBlock.playSound("use.gravel", { pitch: 0.8 })
                        tillBlock.setType(tillResult)

                        if (tillResult === "minecraft:farmland") {
                            village.tillLocations.remove(tillLocationString)
                            village.farmLocations.add(tillLocationString)
                        }
                    }
                }
                else {
                    villager.pathFindTo(pathLocation)
                }
            }
            else {
                village.tillLocations.remove(tillLocationString)
                villager.cancelTask()
            }
        }
        else {
            villager.cancelTask()
        }
    }

    tickGuardPost(village: Village) {
        if (this.taskContext.guardPost === undefined) {
            this.cancelTask()
            return
        }

        if (!this.isPathing) {
            if (this.taskProgress > 0) {
                this.taskProgress--
            }
            else {
                const guardPost = village.getStructure(this.taskContext.guardPost) as StationPost | undefined
                if (guardPost === undefined) {
                    this.cancelTask()
                    return
                }

                const guardLocation = guardPost.getRandomGuardLocation()

                if (guardLocation === undefined) {
                    this.taskProgress = randomInt(20, 200)
                    return
                }

                this.pathFindTo(guardLocation)

                this.taskProgress = randomInt(20, 200)
            }
        }
    }

    tickGuardVillage(village: Village) {
        if (!this.isPathing) {
            if (this.taskProgress > 0) {
                this.taskProgress--
                return
            }

            const otherVillagers = village.getVillagers().filter(otherVillager => otherVillager.id !== this.id)
            const randomVillager = randomItem(otherVillagers)

            if (randomVillager === undefined) {
                this.taskProgress = randomInt(20, 200)
                return
            }

            this.pathFindTo(randomVillager)
            this.taskProgress = randomInt(20, 100)
        }
    }

    tickPickupItem() {
        const villager = this
        this.taskCache.item ??= villager.taskContext.item === undefined ? undefined : world.getEntity(villager.taskContext.item)
        const foundItem = this.taskCache.item
        const pathError = villager.pathError
        if (foundItem?.isValid) {
            const itemDistance = calculateDistance(foundItem.location, villager.location)
            if (itemDistance < 1.75 || (!villager.isPathing && itemDistance < 3)) {
                if (villager.getMoveSpeed() < 0.01) {
                    const item = foundItem.getComponent(EntityComponentTypes.Item)?.itemStack
                    if (item !== undefined) {
                        villager.getComponent(EntityComponentTypes.Inventory)?.container.addItem(item)
                        villager.holdingItem = item.typeId
                    }

                    villager.waiting = 10
                    villager.playAnimation(
                        "animation.tektopia_villager.pickup_item"
                    )
                    foundItem.remove()
                    villager.cancelTask()
                    villager.animation = undefined
                    villager.stopPath()

                    villager.dimension.playSound("random.pop", villager.location, { volume: 0.3, pitch: randomInt(60, 220) / 100 })
                }
            }
            else if (pathError !== undefined) {
                foundItem.unreachable = 20
                unreachableItemEntities.add(foundItem)
                villager.cancelTask()
            }
            else {
                villager.pathFindTo(foundItem)
            }
        }
        else {
            villager.cancelTask()
        }
    }

    private openChest(location: Vector3): boolean {
        if (this.openedChest !== undefined) {
            if (areVectorsEqual(this.openedChest, location)) {
                return true
            }
            this.closeChest()
        }

        const chest = this.dimension.getBlockSafe(location)?.chest
        if (chest === undefined) {

            return true
        }

        chest.open(this.id)
        this.openedChest = { x: location.x, y: location.y, z: location.z }
        this.waiting = CHEST_OPEN_WAIT_TICKS
        return false
    }

    private closeChest() {
        const location = this.openedChest
        if (location === undefined) {
            return
        }

        this.openedChest = undefined
        this.dimension.getBlockSafe(location)?.chest?.close(this.id)
    }

    cancelTask() {
        this.closeChest()
        this.currentTask = undefined
        this.taskCache = {}
        this.pendingContext = {}
        this.stopPath()
        this.setAnimation(undefined)
    }

    updateAnimation() {
        if (this.lastAnimation !== this.animation) {
            this.lastAnimation = this.animation
            this.entity.setProperty("property:animation", this.animation ?? "none")
        }
    }

    getToolTypes() {
        const villagerConfig = this.getConfig()
        if (villagerConfig?.tool === undefined) {
            return undefined
        }

        return Array.isArray(villagerConfig.tool) ? villagerConfig.tool : [villagerConfig.tool]
    }

    getHoldingItemId() {
        if (this.holdingItem === undefined) {
            return undefined
        }

        if (this.holdingItem === "tool") {
            const villagerToolsTypes = this.getToolTypes()
            if (villagerToolsTypes?.[0] === undefined) {
                return undefined
            }

            const toolType = villagerToolsTypes[0]

            return this.getBestTool(toolType)?.item.typeId
        }

        return this.holdingItem
    }

    updateEquipment() {
        const holdingItem = this.getHoldingItemId()
        if (this.lastHoldingItem !== holdingItem) {
            this.lastHoldingItem = holdingItem
            this.entity.runCommand( `replaceitem entity @s slot.weapon.offhand 0 ${holdingItem ?? "air"}`)
        }

        const villagerConfig = this.getConfig()
        if (!villagerConfig?.wearsArmor) {
            return
        }

        for (const [index, toolType] of armorTypes.entries()) {
            const itemId = this.getBestTool(toolType)?.item.typeId
            const slotName = armorSlotNames[index]
            if (slotName === undefined) {
                continue
            }

            const equipmentId = itemId ?? "air"
            if (this.lastEquipment.get(index) === equipmentId) {
                continue
            }

            this.lastEquipment.set(index, equipmentId)

            this.entity.runCommand(`replaceitem entity @s slot.armor.${slotName} 0 ${equipmentId}`)
        }
    }

    private openDoor(block: Block) {
        const openable = getOpenableBlock(block)
        if (openable === undefined) {
            return
        }

        const key = locationToString(openable.location)
        if (!this.openedDoors.includes(key)) {
            this.openedDoors.add(key)
        }

        if (openable.permutation.getState("open_bit") === true) {
            return
        }

        openable.setPermutation(openable.permutation.withState("open_bit", true))
        openable.soundEvent(openable.isDoor ? "door.open" : "fence_gate.open")
    }

    private isOpenableInUseByOthers(center: Vector3) {
        for (const other of world.getVillagers()) {
            if (other.id === this.id || !other.isValid || other.dimension.id !== this.dimension.id) {
                continue
            }
            if (calculateDistance(center, other.location) <= 2.5) {
                return true
            }
            const next = other.nextPathNode
            if (other.isPathing && next !== undefined && calculateDistance(center, next, true) < 1.5) {
                return true
            }
        }
        return false
    }

    private shouldKeepDoorOpen(village: Village, center: Vector3, leashedEntity: Entity | undefined) {
        const nextNode = this.nextPathNode
        if (this.isPathing && nextNode !== undefined && calculateDistance(center, nextNode, true) < 0.75) {
            return true
        }

        if (this.isOpenableInUseByOthers(center)) {
            return true
        }

        if (leashedEntity !== undefined) {
            const ranchEntity = village.ranchEntities[leashedEntity.id]
            const range = ranchEntity?.inPen ? 1 : 5
            if (calculateDistance(center, leashedEntity.location) <= range) {
                return true
            }
        }
        return false
    }

    private closeFarDoors() {
        if (this.openedDoors.length === 0) {
            return
        }

        const dimension = this.dimension
        const villagerLocation = this.location
        const leashedEntity = this.getLeashedEntity()
        const village = this.getVillage()

        if (village === undefined) {
            return
        }

        for (const key of this.openedDoors) {
            const location = stringToLocationCached(key)
            const block = dimension.getBlockSafe(location)
            if (block === undefined) {
                continue
            }

            const door = block.isOpenable ? getOpenableBlock(block) : undefined

            if (door?.permutation.getState("open_bit") !== true) {
                this.openedDoors.remove(key)
                continue
            }

            const center = centerVector(location)
            if (calculateDistance(center, villagerLocation) <= 0.5) {
                continue
            }

            const animalAtGate = isPenWorkerType(this.typeId)
                && this.hasPennedEntityNear(village, center, GATE_CLOSE_TRIGGER, undefined, leashedEntity?.id)
            if (!animalAtGate && this.shouldKeepDoorOpen(village, center, leashedEntity)) {
                continue
            }

            door.setPermutation(door.permutation.withState("open_bit", false))
            door.soundEvent(door.isDoor ? "door.close" : "fence_gate.close")
            this.openedDoors.remove(key)
        }
    }

    followPath(
        stream: PathStream,
        getTargetLocation: () => Vector3,
        cancelPath: () => void,
        isFinished: () => boolean,
        targetId?: string
    ) {
        const villager = this
        const pathNodeList = stream.nodes

        const village = villager.getVillage()
        if (village === undefined) {
            cancelPath()
            return
        }

        const dimension = villager.dimension
        const dimensionId = dimension.id
        const villageBounds = village.bounds

        const KNOCKBACK_SKIP_SPEED_RATIO = 0.8

        function tickFollowPath() {
            if (isFinished()) {
                return
            }

            try {
                if (!villager.isValid || !villager.isPathing || village === undefined || villager.isDead) {
                    cancelPath()
                    return
                }
                const targetLocation = getTargetLocation()
                const targetBlock = dimension.getBlockSafe(targetLocation)
                if (targetBlock !== undefined && !targetBlock.isValidPath(villageBounds) && calculateDistance(centerVector(targetLocation), villager.location) <= 1.25) {
                    cancelPath()
                    return
                }
                villager.pathTickId = system.run(tickFollowPath)
                const pathNodeIndex = stream.head ?? 0
                const pathNode = pathNodeList[pathNodeIndex]
                if (pathNode === undefined) {
                    if (stream.status === "searching") {
                        villager.nextPathNode = undefined
                        villager.setAnimation(undefined)
                        return
                    }
                    const failure = getPathStreamFailure(stream)
                    if (failure !== undefined && failure !== "cancelled") {
                        villager.pathError = failure
                    }
                    cancelPath()
                    return
                }

                if (debugFlags.villagerPathParticles && (system.currentTick + villager.index) % 20 === 0) {
                    for (let i = pathNodeIndex; i < pathNodeList.length; i++) {
                        const debugPathNode = pathNodeList[i]
                        if (debugPathNode === undefined) {
                            continue
                        }
                        try {
                            dimension.spawnParticle(
                                "minecraft:villager_angry",
                                centerVector(debugPathNode)
                            )
                        }
                        catch { }
                    }
                }
                const currentPathNode = centerVector(pathNode, true)
                const entityLocation = villager.location
                if (villager.isOnGround) {
                    villager.lookAt(currentPathNode, true)
                }
                const direction = villager.getViewDirection()
                const speed = villager.isOnGround ? 0.2 : 0.015
                const moveVector = multiplyVector(direction, "xyz", speed)
                const pathNodeBlock = dimension.getBlockSafe(currentPathNode)
                const inBlock = dimension.getBlockSafe(entityLocation)
                if (inBlock !== undefined) {
                    if (inBlock.isOpenable) {
                        villager.openDoor(inBlock)
                    }
                }
                if (pathNodeBlock !== undefined) {
                    if (!pathNodeBlock.isValidPath(villageBounds)) {
                        village.checkNodeValidity(locationToString(pathNodeBlock))
                        cancelPath()
                        return
                    }
                    const pathNodeBlockBelowTypeId = pathNodeBlock.belowSafe()?.typeId
                    if (pathNodeBlockBelowTypeId !== undefined && (Registry.slabTypes.includesFast(pathNodeBlockBelowTypeId) || Registry.stairTypes.includesFast(pathNodeBlockBelowTypeId) || pathNodeBlockBelowTypeId === "minecraft:bed")) {
                        currentPathNode.y -= 0.5
                    }

                    if (pathNodeBlock.isOpenable) {
                        if (villager.holdForEscapingEntity(village, pathNodeBlock)) {
                            villager.setAnimation(undefined)
                            return
                        }
                        villager.openDoor(pathNodeBlock)
                    }
                }
                villager.nextPathNode = currentPathNode

                if (calculateDistance(centerVector(pathNode, true), entityLocation) >= 2.25) {
                    cancelPath()
                    return
                }

                const blocker = findPathBlocker(dimensionId, currentPathNode, villager.id, entityLocation, village, targetId)
                if (blocker?.cancelPath === true) {
                    cancelPath()
                    return
                }

                let isBlocked = blocker !== undefined

                const blockedByTektopiaVillager = blocker === undefined ? false : Registry.villagerTypes.includes(blocker.typeId)
                villager.blockingEntityTypeId = blocker?.typeId

                if (blockedByTektopiaVillager) {
                    villager.unblockTimer += 2
                    if (villager.unblockTimer > 16) {
                        villager.unblockTimer = 16
                    }
                }
                else if (!isBlocked && villager.unblockTimer > 0) {
                    villager.unblockTimer--
                    isBlocked = true
                }

                if (!isBlocked) {
                    villager.totalBlockTimer--
                    villager.blockingEntityTypeId = undefined
                }

                if (villager.totalBlockTimer < 0) {
                    villager.totalBlockTimer = 0
                }

                if (villager.totalBlockTimer > 100) {
                    isBlocked = false
                }

                villager.isBlocked = isBlocked

                if (isBlocked) {
                    villager.totalBlockTimer++
                }

                const velocity = villager.getVelocity()
                const horizontalSpeed = Math.sqrt((velocity.x * velocity.x) + (velocity.z * velocity.z))
                const isMoving = horizontalSpeed > 0.0001
                if (!isMoving || isBlocked) {
                    villager.blockedTimer++
                }
                else {
                    villager.blockedTimer = 0
                }

                if (isBlocked) {
                    if (!isMoving) {
                        villager.setAnimation(undefined)
                    }
                }
                else {
                    villager.setAnimation("none")
                    if (villager.isOnGround) {
                        const directionLength = Math.sqrt((direction.x * direction.x) + (direction.z * direction.z))
                        const speedTowardNode = directionLength > 0.0001
                            ? ((velocity.x * direction.x) + (velocity.z * direction.z)) / directionLength
                            : 0
                        if (speedTowardNode < speed * KNOCKBACK_SKIP_SPEED_RATIO) {
                            villager.applyKnockback(moveVector, 0)
                        }
                        if (currentPathNode.y - villager.location.y > 0.55) {
                            villager.applyImpulse({ x: 0, y: 0.44, z: 0 })
                        }
                    }
                    else {
                        villager.applyImpulse({ x: moveVector.x, y: 0, z: moveVector.z })
                    }
                }
                if (villager.blockedTimer > 40) {
                    cancelPath()
                    return
                }

                if (Math.abs(currentPathNode.y - villager.location.y) <= 0.25 ? calculateChebyshevDistance(currentPathNode, villager.location) <= 0.25 : calculateChebyshevDistance(currentPathNode, villager.location) <= 0.5) {
                    stream.head = pathNodeIndex + 1
                    stream.reached = pathNode
                    shortcutStream(stream, village.graph, pathNode)
                    if (stream.head >= 64 && stream.head * 2 >= pathNodeList.length) {
                        pathNodeList.splice(0, stream.head)
                        stream.head = 0
                    }
                }
            }
            catch (error) {
                if (debugFlags.pathfindingWarnings) {
                    console.warn("Path follow failed: ", error)
                }
                cancelPath()
            }
        }

        villager.pathTickId = system.run(tickFollowPath)
    }
}

World.prototype.getVillager = function (entityId: string) {
    return Villager.fromId(entityId)
}

system.runInterval(() => {
    if (!world.loadedData) {
        return
    }

    const villagers = world.getVillagers()
    for (const villager of shuffle(villagers)) {
        villager.tickAI()
    }
})

system.runInterval(() => {
    for (const entity of unreachableItemEntities) {
        if (!entity.isValid) {
            unreachableItemEntities.delete(entity)
            continue
        }
        if (entity.unreachable > 0) {
            entity.unreachable--
        }
        if (entity.unreachable <= 0) {
            unreachableItemEntities.delete(entity)
        }
    }
}, 20)

ItemStack.prototype.makeVillagerItem = function () {
    this.nameTag = `§r§a${formatTypeId(this.typeId)}`
    this.setLore(["§r§7Villager Item"])
}

Object.defineProperty(ItemStack.prototype, "isVillagerItem", {
    get(this: ItemStack) {
        return this.getLore()[0] === "§r§7Villager Item"
    }
})

Object.defineProperty(Entity.prototype, "isShearable", {
    get(this: Entity): boolean {
        if (this.typeId !== "minecraft:sheep") {
            return false
        }

        return !this.hasComponent(EntityComponentTypes.IsSheared) && !this.hasComponent(EntityComponentTypes.IsBaby)
    }
})

Object.defineProperty(Entity.prototype, "isMilkable", {
    get(this: Entity): boolean {
        if (this.typeId !== "minecraft:cow") {
            return false
        }

        return !this.hasComponent(EntityComponentTypes.IsBaby)
    }
})

world.afterEvents.entitySpawn.subscribe(event => {
    const entity = event.entity
    if (entity.isVillager) {
        const villager = Villager.fromEntity(entity)
        const villagerConfig = villager.getConfig()
        if (villagerConfig?.tool === undefined) {
            return
        }

        const toolType = Array.isArray(villagerConfig.tool) ? villagerConfig.tool[0] : villagerConfig.tool
        if (toolType === undefined) {
            return
        }

        const villagerInventory = villager.getInventory()
        if (villagerInventory === undefined) {
            return
        }

        if (!upgradableToolTypes.includes(toolType as UpgradableToolType)) {
            return
        }

        const toolItem = new ItemStack(`minecraft:wooden_${toolType}`)
        toolItem.makeVillagerItem()

        villagerInventory.addItem(toolItem)
    }
})
