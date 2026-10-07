import {
    Block,
    BlockPermutation,
    Entity,
    EntityComponentTypes,
    EntityDamageCause,
    ItemStack,
    system,
    type Vector3,
    World,
    world
} from "@minecraft/server"

import { debugFlags } from "./debug"

import { blockSounds } from "./generated"

import {
    createPathStream,
    findNearestNodeLocation,
    findPathBlocker,
    generatePath,
    getPathStreamFailure,
    isEntityTarget,
    startPathSnapshot,
    stopPathSnapshot,
    updatePathNodes,
    type PathStream,
    type PathTarget
} from "./path"

import { Registry } from "./registry"

import {
    AnimalPen,
    entityStructures,
    type StationPost,
    type Mineshaft,
    type Structure
} from "./structure"

import { destroyTree } from "./tree"

import {
    addVectors,
    calculateDistance,
    calculateChebyshevDistance,
    centerVector,
    floorVector,
    formatTypeId,
    fix,
    multiplyVector,
    randomInt,
    removeIdentifier,
    locationToString,
    fixVector,
    addVector,
    getOppositeDirection,
    directionToVector,
    stringToLocationCached,
    randomItem,
    stringToLocation
} from "./utils"

import {
    globalTasks,
    tektopiaVillagers
} from "./villager_tasks"

import type { LocationString } from "./minecraft_extensions"

import type {
    Village,
    VillageRanchEntity
} from "./village"

const villagerCache = new Map<string, Villager>()

world.afterEvents.entityRemove.subscribe(event => {
    const removedEntityId = event.removedEntityId
    villagerCache.delete(removedEntityId)
})

const PATH_TIMEOUT_TICKS = 1200
const unreachableItemEntities = new Set<Entity>()

Object.defineProperty(Block.prototype, "isDoor", {
    get(this: Block) {
        return Registry.openableDoorTypes.includes(this.typeId)
    }
})

Object.defineProperty(Block.prototype, "isOpenable", {
    get(this: Block) {
        return this.isDoor || Registry.fenceGateTypes.includes(this.typeId)
    }
})

function getOpenableBlock(block: Block): Block | undefined {
    if (block.isDoor && block.permutation.getState("upper_block_bit") === true) {
        return block.belowSafe()
    }
    return block
}

const SWING_HIT_DELAY_TICKS = 17
const ATTACK_RANGE = 3
const ATTACK_DAMAGE = 4
const ATTACK_COOLDOWN_TICKS = 20

const noop = () => { }
const taskListsByType = new Map<string, typeof globalTasks>()

export interface Villager extends Entity { }

export class Villager {
    public isBlocked = false
    public blockedTimer = 0
    public isPathing = false
    public unblockTimer = 0
    public totalBlockTimer = 0
    public blockingEntityTypeId?: string
    public pathTickId?: number
    public pathError?: string
    private nextPathNode?: Vector3
    private taskProgress = 0
    private currentTask?: string
    private animation?: string
    private lastAnimation?: string
    private attackIntervalId?: number
    private holdingItem?: string
    private lastHoldingItem?: string
    private waiting?: boolean | number
    private foundItem?: Entity
    private foundTree?: Vector3
    private foundHarvest?: Vector3
    private foundTill?: Vector3
    private foundPlant?: {
        location: Vector3
        type: string
    }

    private foundHerdEntity?: VillageRanchEntity & { id: string }
    private foundBreedableEntity?: VillageRanchEntity & { id: string }
    private foundShearableEntity?: VillageRanchEntity & { id: string }

    private index: number

    private foundMine?: Vector3
    private foundGuardPost?: Vector3
    private foundFullAnimalPen?: Vector3
    private foundButcherStructure?: Vector3

    private foundKillingEntity?: string

    private attackCooldownEndTick = 0

    static villagerIndex = 0

    constructor(private readonly entity: Entity) {
        this.index = Villager.villagerIndex++
        Villager.installDelegates()
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

    findTree(village: Village): Vector3 | undefined {
        const takenTrees = new Set<string>()
        for (const villager of world.getVillagers()) {
            if (villager.id === this.id) {
                continue
            }
            const tree = villager.foundTree
            if (tree !== undefined) {
                takenTrees.add(locationToString(tree))
            }
        }

        const closestTree = village.treeLocations.nearestTo(this.location, key => takenTrees.has(key))
        this.foundTree = closestTree
        return closestTree
    }

    findMine(village: Village) {
        const takenMines = new Set<string>()
        const villagers = world.getVillagers()
        for (const villager of villagers) {
            if (villager.id === this.id) {
                continue
            }
            const mine = villager.foundMine
            if (mine !== undefined) {
                takenMines.add(locationToString(mine))
            }
        }

        const villagerLocation = this.location
        let closestMine: Vector3 | undefined
        let minDist = Infinity

        const mineshaftStructures = village.findStructures({ includedTypes: ["mineshaft"] })
        for (const mineshaft of mineshaftStructures) {
            if (takenMines.has(mineshaft.locationString)) {
                continue
            }
            const dist = calculateDistance(villagerLocation, mineshaft.location)
            if (dist < minDist) {
                minDist = dist
                closestMine = mineshaft.location
            }
        }

        this.foundMine = closestMine
        return closestMine
    }

    findGuardPost(village: Village) {
        const takenGuardPosts = new Set<string>()
        const villagers = world.getVillagers()
        for (const villager of villagers) {
            if (villager.id === this.id) {
                continue
            }
            const guardPost = villager.foundGuardPost
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

        this.foundGuardPost = closestGuardPost
        return closestGuardPost
    }

    findHarvestLocation(village: Village): Vector3 | undefined {
        const takenHarvestLocations = new Set<string>()
        for (const villager of world.getVillagers()) {
            if (villager.id === this.id) {
                continue
            }
            const harvestLocation = villager.foundHarvest
            if (harvestLocation !== undefined) {
                takenHarvestLocations.add(locationToString(harvestLocation))
            }
        }

        const closestHarvestLocation = village.harvestLocations.nearestTo(this.location, key => takenHarvestLocations.has(key))
        this.foundHarvest = closestHarvestLocation
        return closestHarvestLocation
    }

    findButcherStructure(village: Village) {
        const takenButcherStructures = new Set<string>()
        const villagers = world.getVillagers()
        for (const villager of villagers) {
            if (villager.id === this.id) {
                continue
            }
            const butcherStructure = villager.foundButcherStructure
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

        this.foundButcherStructure = closestButcherStructure
        return closestButcherStructure
    }

    findFullPen(village: Village) {
        const takenAnimalPen = new Set<string>()
        const villagers = world.getVillagers()
        for (const villager of villagers) {
            if (villager.id === this.id) {
                continue
            }
            const animalPen = villager.foundFullAnimalPen
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
            const dist = calculateDistance(villagerLocation, animalPen.location)
            if (dist < minDist) {
                minDist = dist
                closestAnimalPen = animalPen.location
            }
        }

        this.foundFullAnimalPen = closestAnimalPen
        return closestAnimalPen
    }

    findShearableEntity(village: Village) {
        const takenRanchEntities = new Set<string>()
        for (const villager of world.getVillagers()) {
            if (villager.id === this.id) {
                continue
            }
            const ranchEntity = villager.foundShearableEntity
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

            const distance = calculateDistance(entityData.location, this.location)

            if (distance < closestDistance) {
                closestDistance = distance
                closestEntity = { ...entityData, id: entityId }
            }
        }

        this.foundShearableEntity = closestEntity
        return closestEntity
    }

    findBreedableEntity(village: Village) {
        const takenRanchEntities = new Set<string>()
        for (const villager of world.getVillagers()) {
            if (villager.id === this.id) {
                continue
            }
            const ranchEntity = villager.foundBreedableEntity
            if (ranchEntity !== undefined) {
                takenRanchEntities.add(ranchEntity.id)
            }
        }

        let closestEntity
        let closestDistance = Infinity

        for (const [entityId, entityData] of Object.entries(village.ranchEntities)) {
            if (takenRanchEntities.has(entityId) || !entityData.inPen || !entityData.breedable || entityData.structure === undefined) {
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

            if (distance < closestDistance) {
                closestDistance = distance
                closestEntity = { ...entityData, id: entityId }
            }
        }

        this.foundBreedableEntity = closestEntity
        return closestEntity
    }

    findHerdEntity(village: Village) {
        const takenRanchEntities = new Set<string>()
        for (const villager of world.getVillagers()) {
            if (villager.id === this.id) {
                continue
            }
            const ranchEntity = villager.foundHerdEntity
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
                if ((structure.isUnderpopulated || entityData.villagerEntity) && !structure.isFull) {
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

        this.foundHerdEntity = closestEntity
        return closestEntity
    }

    findTillLocation(village: Village): Vector3 | undefined {
        const takenTillLocations = new Set<string>()
        for (const villager of world.getVillagers()) {
            if (villager.id === this.id) {
                continue
            }
            const tillLocation = villager.foundTill
            if (tillLocation !== undefined) {
                takenTillLocations.add(locationToString(tillLocation))
            }
        }

        const closestTillLocation = village.tillLocations.nearestTo(this.location, key => takenTillLocations.has(key))
        this.foundTill = closestTillLocation
        return closestTillLocation
    }

    findPlantLocation(village: Village) {
        const takenPlantLocation = new Set<string>()
        const villagers = world.getVillagers()
        for (const villager of villagers) {
            if (villager.id === this.id) {
                continue
            }
            const plantLocation = villager.foundPlant
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

        for (const [plantLocationStr, type] of Object.entries(village.plantLocations)) {
            if (takenPlantLocation.has(plantLocationStr)) {
                continue
            }
            const plantLocationLocation = stringToLocationCached(plantLocationStr as LocationString)
            const dist = calculateDistance(villagerLocation, plantLocationLocation)
            if (dist < minDist) {
                minDist = dist
                closestPlant = { location: { ...plantLocationLocation }, type }
            }
        }

        this.foundPlant = closestPlant
        return closestPlant
    }

    findItem(village: Village): Entity | undefined {
        let pickupItems = tektopiaVillagers[this.typeId]?.pickupItems
        if (pickupItems === undefined) {
            this.foundItem = undefined
            return undefined
        }

        if (typeof pickupItems === "function") {
            pickupItems = pickupItems()
        }

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

        this.foundItem = closestItem
        return closestItem
    }

    pathFindTo(target: PathTarget) {
        const villager = this
        if (villager.isPathing) {
            return
        }

        // An entity target is followed: its current location is used as the destination while pathing.
        if (isEntityTarget(target) && !target.isValid) {
            return
        }
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
                const nearest = findNearestNodeLocation(village.pathNodes, startLocation, 3)
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

            // Following starts right away; nodes arrive in the stream while the path is still being generated.
            const stream = createPathStream()
            villager.followPath(stream, getTargetLocation, cancelPath, () => finished)

            generatePath(villager, startLocation, target, token, stream).then(result => {
                if (finished || typeof result !== "string") {
                    return
                }
                // Nodes that were already streamed stay valid: the follower finishes them and then reports the failure.
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

        if ((system.currentTick + villager.index) % 10 === 0) {
            villager.closeFarDoors()
        }

        const village = villager.getVillage()
        if (village === undefined) {
            villager.setAnimation(undefined)
            villager.updateAnimation()
            villager.updateDebugNameTag()
            return
        }
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
        villager.updateHoldingItem()
        villager.updateAnimation()
        villager.updateDebugNameTag(village, pathError)
    }

    private updateDebugNameTag(village?: Village, pathError = this.pathError) {
        if (!debugFlags.villagerDebugNameTags) {
            if (this.nameTag !== "") {
                this.nameTag = ""
            }
            return
        }

        const villagerProps = tektopiaVillagers[this.typeId]
        let taskName = this.currentTask ?? "Idle"
        if (this.currentTask !== undefined) {
            const task = globalTasks.find(candidate => candidate.id === this.currentTask) ??
                villagerProps?.customTasks.find(candidate => candidate.id === this.currentTask)

            taskName = task?.name ?? taskName
        }

        const villagerLocation = this.location
        let nextPathNodeDistance: number | undefined
        if (this.nextPathNode !== undefined) {
            nextPathNodeDistance = calculateDistance(villagerLocation, this.nextPathNode)
        }
        let target = "None"
        let targetLocation: Vector3 | undefined
        switch (this.currentTask) {
            case "chop":
                targetLocation = this.foundTree
                if (targetLocation !== undefined) {
                    target = "Tree"
                }
                break
            case "harvest":
                targetLocation = this.foundHarvest
                if (targetLocation !== undefined) {
                    target = "Harvest"
                }
                break
            case "item":
                if (this.foundItem?.isValid) {
                    targetLocation = this.foundItem.location
                    target = `Item ${formatTypeId(this.foundItem.typeId)}`
                }
                break
            case "plant":
                if (this.foundPlant !== undefined) {
                    targetLocation = this.foundPlant.location
                    target = `Plant ${formatTypeId(this.foundPlant.type)}`
                }
                break
            case "till":
                targetLocation = this.foundTill
                if (targetLocation !== undefined) {
                    target = "Till"
                }
                break
            case "mine":
                targetLocation = this.foundMine
                if (targetLocation !== undefined) {
                    target = "Mine"
                }
                break
            case "herd":
                if (this.foundHerdEntity !== undefined) {
                    targetLocation = world.getEntity(this.foundHerdEntity.id)?.location ?? this.foundHerdEntity.location
                    target = `Herd ${formatTypeId(this.foundHerdEntity.typeId)}`
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
            `Villager: ${formatTypeId(this.typeId)}`,
            `Village: ${village.centerString ?? "None"}`,
            `Task: ${taskName}`,
            `Progress: ${this.taskProgress}`,
            `Pathing: ${this.isPathing ? "Yes" : "No"}`,
            `Blocked: ${this.isBlocked ? "Yes" : "No"}`,
            `Blocking entity: ${this.blockingEntityTypeId ?? "None"}`,
            `Blocked timer: ${this.blockedTimer}`,
            `Unblock timer: ${this.unblockTimer}`,
            `Total Block Timer: ${this.totalBlockTimer}`,
            `Waiting: ${waiting}`,
            `Target: ${target}`,
            `Target distance: ${targetDistance === undefined ? "None" : `${fix(targetDistance, 2)} blocks`}`,
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

    tickTasks(village: Village) {
        const villager = this

        const dimension = villager.dimension
        const villagerProps = tektopiaVillagers[villager.typeId]
        if (villagerProps === undefined) {
            return
        }

        const villagerLocation = villager.location
        let allTaskList = taskListsByType.get(villager.typeId)
        if (allTaskList === undefined) {
            allTaskList = globalTasks.concat(villagerProps.customTasks)
            taskListsByType.set(villager.typeId, allTaskList)
        }
        const currentTaskIndex = allTaskList.findIndex(task => task.id === villager.currentTask)
        const currentTask = currentTaskIndex === -1 ? undefined : allTaskList[currentTaskIndex]
        const canPickTask = villager.currentTask === undefined || currentTask?.interruptible === true

        if (canPickTask && (system.currentTick + villager.index) % 20 === 0) {
            const leashedEntity = villager.getLeashedEntity()
            if (leashedEntity !== undefined) {
                leashedEntity.getComponent(EntityComponentTypes.Leashable)?.unleash()
            }

            const candidates = villager.currentTask === undefined ? allTaskList : allTaskList.slice(0, currentTaskIndex)
            const newTask = candidates.find(task => task.condition(villager, village))

            if (newTask !== undefined) {
                villager.foundTree = undefined
                villager.foundItem = undefined
                villager.foundHarvest = undefined
                newTask.condition(villager, village)

                villager.currentTask = newTask.id
                villager.stopPath()
                villager.taskProgress = 0
                villager.waiting = 0
                villager.holdingItem = undefined
                if (villager.animation !== "walking") {
                    villager.animation = undefined
                }
            }
            else if (villager.currentTask === undefined) {
                villager.foundTree = undefined
                villager.foundItem = undefined
                villager.foundHarvest = undefined
            }
        }

        if (villager.currentTask !== undefined) {
            const task = allTaskList.find(checkTask => checkTask.id === villager.currentTask)
            task?.tick?.(villager, village)

            if (!villager.hasTask && !villager.isWaiting) {
                if (villager.animation !== "walking") {
                    villager.animation = undefined
                }
                villager.holdingItem = undefined
                villager.stopPath()
                villager.taskProgress = 0
                villager.foundTree = undefined
                villager.foundHarvest = undefined
            }
        }
        else if (!villager.isPathing) {
            const offset = {
                x: randomInt(-10, 10),
                y: 0,
                z: randomInt(-10, 10)
            }
            const randomLocation = addVectors(villagerLocation, offset)
            if (villager.taskProgress > 0) {
                villager.taskProgress--
            }
            else {
                let block = dimension.getBlockSafe(randomLocation)
                if (block !== undefined) {
                    while (block?.isAir) {
                        block = block.belowSafe()
                    }
                    while (block !== undefined && !block.isAir) {
                        block = block.aboveSafe()
                    }
                    if (block !== undefined) {
                        if (village.pathNodes[locationToString(block)] !== undefined) {
                            villager.pathFindTo(block.location)
                            villager.taskProgress = randomInt(20, 200)
                        }
                    }
                }
            }
        }
        if (villager.isPathing && villager.typeId === "tektopia:lumberjack" && (system.currentTick + villager.index) % 20 === 0) {
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
                            block.destroy()
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

    tickBreedEntity() {
        const villager = this

        if (villager.foundBreedableEntity === undefined) {
            // const inStructure = villager.getCurrentStructure()
            // if (inStructure !== undefined) {
            //     if (["pig_pen", "chicken_coop", "sheep_pen", "cow_pen"].includes(inStructure.type)) {
            //         const pathLocation = addVectors(inStructure.location, directionToVector(inStructure.rotation))

            //         const pathLocationDistance = calculateDistance(centerVector(pathLocation, true), villager.location)
            //         if (pathLocationDistance > 0.5) {
            //             villager.pathFindTo(pathLocation)
            //             return
            //         }
            //     }
            // }
            villager.currentTask = undefined
            return
        }

        if (!villager.foundBreedableEntity.inPen) {
            villager.currentTask = undefined
            return
        }

        const ranchEntity = world.getEntity(villager.foundBreedableEntity.id)
        if (ranchEntity === undefined) {
            villager.currentTask = undefined
            return
        }

        const ranchEntityLocation = ranchEntity.location

        const ranchEntityDistance = calculateDistance(ranchEntityLocation, villager.location)
        if (ranchEntityDistance > 3) {
            villager.pathFindTo(ranchEntity)
            return
        }

        villager.stopPath()

        villager.playAnimation("animation.tektopia_villager.take")

        villager.waiting = 20

        ranchEntity.breeding?.start()

        villager.currentTask = undefined
    }

    tickShearEntity() {
        const villager = this

        if (villager.foundShearableEntity === undefined) {
            villager.currentTask = undefined
            return
        }

        const ranchEntity = world.getEntity(villager.foundShearableEntity.id)
        if (ranchEntity === undefined) {
            villager.currentTask = undefined
            return
        }

        if (!ranchEntity.isShearable) {
            villager.currentTask = undefined
            return
        }

        const ranchEntityLocation = ranchEntity.location

        const ranchEntityDistance = calculateDistance(ranchEntityLocation, villager.location)
        if (ranchEntityDistance > 3) {
            villager.pathFindTo(ranchEntity)
            return
        }

        villager.playAnimation("animation.tektopia_villager.take")

        const woolItem = ranchEntity.getWoolItem()

        if (woolItem !== undefined) {
            if (ranchEntity.villagerEntity) {
                woolItem.makeVillageItem()
            }

            const amount = randomInt(1, 3)
            for (let i = 0; i < amount; i++) {
                ranchEntity.dimension.spawnItem(woolItem, ranchEntity.location)
            }
        }

        ranchEntity.triggerEvent("minecraft:on_sheared")
    }

    private endButcherTask() {
        this.foundHerdEntity = undefined
        this.foundKillingEntity = undefined
        this.foundFullAnimalPen = undefined
        this.currentTask = undefined
    }

    tickButcher(village: Village) {
        const villager = this

        if (villager.foundKillingEntity !== undefined) {
            const killingEntity = world.getEntity(villager.foundKillingEntity)
            if (killingEntity === undefined) {
                villager.endButcherTask()
                return
            }

            const killingEntityDistance = calculateDistance(centerVector(killingEntity.location, true), villager.location)
            if (killingEntityDistance > ATTACK_RANGE) {
                villager.pathFindTo(killingEntity)
                return
            }

            villager.holdingItem = "minecraft:wooden_axe"

            villager.stopPath()
            villager.attack(killingEntity)
            return
        }

        if (villager.foundButcherStructure === undefined) {
            villager.endButcherTask()
            return
        }

        const butcherStructure = village.getStructure(villager.foundButcherStructure)
        if (butcherStructure === undefined) {
            villager.endButcherTask()
            return
        }

        const leashedEntity = villager.getLeashedEntity()
        if (leashedEntity !== undefined) {
            if (calculateDistance(leashedEntity.location, villager.location) > 8) {
                leashedEntity.teleport(villager.location)
            }

            const floorLocations = butcherStructure.getFloorLocations()

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
                const distance =
                    Math.abs(location.x - centerLocation.x) +
                    Math.abs(location.y - centerLocation.y) +
                    Math.abs(location.z - centerLocation.z)

                const closestDistance =
                    Math.abs(closest.x - centerLocation.x) +
                    Math.abs(closest.y - centerLocation.y) +
                    Math.abs(closest.z - centerLocation.z)

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
            villager.foundKillingEntity = leashedEntity.id
            villager.foundHerdEntity = undefined
            return
        }

        if (villager.foundFullAnimalPen === undefined) {
            villager.endButcherTask()
            return
        }

        const animalPen = village.getStructure(villager.foundFullAnimalPen) as AnimalPen | undefined

        if (animalPen === undefined) {
            villager.endButcherTask()
            return
        }

        const pathLocation = addVectors(animalPen.location, directionToVector(animalPen.rotation))

        const pathLocationDistance = calculateDistance(centerVector(pathLocation, true), villager.location)
        if (pathLocationDistance > 0.5) {
            villager.pathFindTo(pathLocation)
            return
        }

        if (villager.foundHerdEntity === undefined) {
            const entities = animalPen.getEntities(true).sort((entity1, entity2) =>
                Number(entity1.villagerEntity ?? false) - Number(entity2.villagerEntity ?? false)
            )

            for (const entity of entities) {
                const ranchEntity = village.ranchEntities[entity.id]
                if (ranchEntity === undefined) {
                    continue
                }

                villager.foundHerdEntity = { ...ranchEntity, id: entity.id }
                break
            }
        }

        if (villager.foundHerdEntity === undefined) {
            villager.endButcherTask()
            return
        }

        const ranchEntity = world.getEntity(villager.foundHerdEntity.id)
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
            villager.endButcherTask()
            return
        }

        villager.stopPath()

        villager.playAnimation("animation.tektopia_villager.take")

        ranchEntityLeashableComponent.leashTo(villager.entity)
        villager.foundHerdEntity = undefined

        villager.waiting = 20
    }

    tickHerdEntity(village: Village) {
        const villager = this

        const leashedEntity = villager.getLeashedEntity()

        if (leashedEntity !== undefined) {
            const structureType = entityStructures[leashedEntity.typeId]
            if (structureType === undefined) {
                leashedEntity.getComponent(EntityComponentTypes.Leashable)?.unleash()
                villager.currentTask = undefined
                return
            }

            const structures = village.findStructures({ includedTypes: [structureType] })

            if (calculateDistance(leashedEntity.location, villager.location) > 8) {
                leashedEntity.teleport(villager.location)
            }

            let foundStructure = false

            for (const structure of structures) {
                if ((!structure.isUnderpopulated && !leashedEntity.villagerEntity) || structure.isFull) {
                    continue
                }

                foundStructure = true

                const pathLocation = structure.getFloorLocations().at(-1)

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

                villager.currentTask = undefined
                break
            }

            if (!foundStructure) {
                leashedEntity.getComponent(EntityComponentTypes.Leashable)?.unleash()
                villager.currentTask = undefined
            }
            return
        }

        if (villager.foundHerdEntity === undefined) {
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
            villager.currentTask = undefined
            return
        }

        const ranchEntity = world.getEntity(villager.foundHerdEntity.id)
        if (ranchEntity === undefined) {
            villager.currentTask = undefined
            return
        }

        if (!village.isInBounds(ranchEntity.location)) {
            villager.currentTask = undefined
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
            villager.currentTask = undefined
            return
        }

        villager.stopPath()

        villager.playAnimation("animation.tektopia_villager.take")

        ranchEntityLeashableComponent.leashTo(villager.entity)

        villager.waiting = 20
    }

    tickMine(village: Village) {
        const villager = this
        if (villager.foundMine === undefined) {
            villager.currentTask = undefined
            return
        }

        const structure = village.getStructure(villager.foundMine) as Mineshaft | undefined

        if (structure === undefined) {
            villager.currentTask = undefined
            return
        }

        const rotation = structure.rotation
        const oppositeRotation = getOppositeDirection(rotation)

        if (oppositeRotation === undefined) {
            villager.currentTask = undefined
            return
        }

        const mineTask = structure.getNextTask()

        if (mineTask === undefined) {
            villager.currentTask = undefined
            return
        }

        if (mineTask.type === "mine") {
            const mineBlock = mineTask.block

            let pathLocation = addVectors(mineBlock.location, directionToVector(oppositeRotation))

            const pathLocationBelow = this.dimension.getBlockSafe(addVector(pathLocation, "y", -1))
            if (pathLocationBelow === undefined) {
                villager.currentTask = undefined
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
            villager.holdingItem = "wooden_pickaxe"
            villager.stopPath()

            villager.taskProgress++

            if (villager.taskProgress <= 100 || villager.isWaiting) {
                return
            }

            mineBlock.destroy()
            villager.waiting = 15
            villager.setAnimation(undefined)
            villager.currentTask = undefined

            updatePathNodes([mineBlock, mineBlock.aboveSafe(), mineBlock.belowSafe()].filter(checkBlock => checkBlock !== undefined))
        }
        else if (mineTask.type === "light") {
            const torchBlock = mineTask.block

            const torchBlockDistance = calculateDistance(torchBlock.location, villager.location)

            if (torchBlockDistance >= 1.5) {
                villager.pathFindTo(torchBlock.location)
                return
            }

            torchBlock.replace(BlockPermutation.resolve("torch", { torch_facing_direction: "top" }))
        }
        else {
            const fillBlock = mineTask.block
            const pathLocation = addVectors(fillBlock.location, multiplyVector(mineTask.offset, "xyz", -1))

            const pathLocationDistance = calculateDistance(pathLocation, villager.location)

            if (pathLocationDistance >= 1 && (villager.isPathing || pathLocationDistance >= 3)) {
                villager.pathFindTo(pathLocation)
                return
            }

            fillBlock.replace("cobblestone")
            villager.waiting = 5
            villager.currentTask = undefined

            updatePathNodes([fillBlock, fillBlock.aboveSafe(), fillBlock.belowSafe()].filter(checkBlock => checkBlock !== undefined))
        }
    }

    tickChop(village: Village) {
        const villager = this

        const dimension = villager.dimension
        const foundTree = villager.foundTree

        if (foundTree !== undefined) {
            const treeBlock = dimension.getBlockSafe(foundTree)
            if (treeBlock?.isTree) {
                const treeDist = calculateDistance(centerVector(foundTree, true), villager.location)
                if (treeDist <= 5) {
                    villager.holdingItem = "wooden_axe"
                }
                else {
                    villager.holdingItem = undefined
                }
                if (treeDist < 0.5 || (!villager.isPathing && treeDist < 3)) {
                    villager.setAnimation("chopping")
                    villager.lookAt(centerVector(foundTree))
                    villager.taskProgress++
                    villager.stopPath()

                    if (villager.taskProgress > 100 && !villager.isWaiting) {
                        const saplingTypeId = treeBlock.typeId.replace(
                            "_log",
                            "_sapling"
                        )
                        villager.waiting = true
                        villager.setAnimation(undefined)

                        const treeKey = locationToString(treeBlock)
                        destroyTree(treeBlock, () => {
                            village.treeLocations.remove(treeKey)
                            village.saplingLocations.add(treeKey)
                            villager.currentTask = undefined
                            villager.waiting = 20
                            if (!treeBlock.isValid) {
                                return
                            }
                            treeBlock.replace(saplingTypeId)
                        })
                    }
                }
                else {
                    villager.pathFindTo(foundTree)
                }
            }
            else {
                village.treeLocations.remove(locationToString(foundTree))
                villager.currentTask = undefined
            }
        }
        else {
            villager.currentTask = undefined
        }
    }

    tickHarvest(village: Village) {
        const villager = this

        const foundHarvest = villager.foundHarvest
        const dimension = villager.dimension

        if (foundHarvest !== undefined) {
            const harvestBlock = dimension.getBlockSafe(foundHarvest)
            const harvestLocationString = locationToString(foundHarvest)

            if (harvestBlock?.isHarvestable) {
                const harvestLocationDist = calculateDistance(centerVector(foundHarvest, true), villager.location)
                if (harvestLocationDist < 1 || (!villager.isPathing && harvestLocationDist < 2)) {
                    villager.setAnimation("harvesting")
                    villager.lookAt(centerVector(foundHarvest))
                    villager.taskProgress++
                    villager.stopPath()

                    if (villager.taskProgress > 100 && !villager.isWaiting) {
                        if (harvestBlock.isHarvestableCrop) {
                            village.plantLocations[harvestLocationString] = harvestBlock.typeId
                            harvestBlock.destroy()
                        }
                        else if (harvestBlock.isHarvestableGourd) {
                            harvestBlock.destroy()
                        }
                        else if (harvestBlock.isHarvestableSugarCane) {
                            const blockList = [harvestBlock.aboveSafe(2), harvestBlock.aboveSafe()]
                            for (const block of blockList) {
                                block?.destroy()
                            }
                        }
                        else if (harvestBlock.isHarvestableSweetBerryBush) {
                            const savedPermutation = harvestBlock.permutation.withState("growth", 1)
                            harvestBlock.destroy()
                            harvestBlock.setPermutation(savedPermutation)
                        }

                        updatePathNodes([harvestBlock, harvestBlock.aboveSafe(), harvestBlock.belowSafe()].filter(checkBlock => checkBlock !== undefined))

                        villager.waiting = 20
                        villager.setAnimation(undefined)
                        villager.currentTask = undefined
                    }
                }
                else {
                    villager.pathFindTo(foundHarvest)
                }
            }
            else {
                village.harvestLocations.remove(harvestLocationString)
                villager.currentTask = undefined
            }
        }
        else {
            villager.currentTask = undefined
        }
    }

    tickPlant(village: Village) {
        const villager = this

        const foundPlant = villager.foundPlant
        const dimension = villager.dimension

        if (foundPlant !== undefined) {
            const plantBlock = dimension.getBlockSafe(foundPlant.location)
            const plantLocationString = locationToString(foundPlant.location)

            if (plantBlock?.isAir) {
                const plantLocationDist = calculateDistance(centerVector(foundPlant.location, true), villager.location)
                if (plantLocationDist < 1.25) {
                    villager.setAnimation("planting")
                    villager.lookAt(centerVector(foundPlant.location))
                    villager.taskProgress++
                    villager.stopPath()

                    if (villager.taskProgress > 100 && !villager.isWaiting) {
                        plantBlock.replace(foundPlant.type)

                        villager.waiting = 20
                        villager.setAnimation(undefined)
                        villager.currentTask = undefined
                    }
                }
                else {
                    villager.pathFindTo(foundPlant.location)
                }
            }
            else {
                delete village.plantLocations[plantLocationString]
                villager.currentTask = undefined
            }
        }
        else {
            villager.currentTask = undefined
        }
    }

    tickTill(village: Village) {
        const villager = this

        const foundTill = villager.foundTill
        const dimension = villager.dimension

        if (foundTill !== undefined) {
            const tillBlock = dimension.getBlockSafe(foundTill)
            const tillLocationString = locationToString(foundTill)
            const pathLocation = addVector(foundTill, "y", 1)
            const tillResult = tillBlock?.tillResult

            if (tillBlock !== undefined && tillResult !== undefined) {
                const pathLocationDist = calculateDistance(centerVector(pathLocation, true), villager.location)
                if (pathLocationDist <= 5) {
                    villager.holdingItem = "wooden_hoe"
                }
                else {
                    villager.holdingItem = undefined
                }
                if (pathLocationDist < 2) {
                    villager.setAnimation("tilling")
                    villager.lookAt(centerVector(foundTill))
                    villager.stopPath()

                    villager.taskProgress++
                    if (villager.taskProgress > 100 && !villager.isWaiting) {
                        villager.waiting = 20
                        villager.setAnimation(undefined)
                        villager.currentTask = undefined

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
                villager.currentTask = undefined
            }
        }
        else {
            villager.currentTask = undefined
        }
    }

    tickGuardPost(village: Village) {
        if (this.foundGuardPost === undefined) {
            this.currentTask = undefined
            return
        }

        if (!this.isPathing) {
            if (this.taskProgress > 0) {
                this.taskProgress--
            }
            else {
                const guardPost = village.getStructure(this.foundGuardPost) as StationPost | undefined
                if (guardPost === undefined) {
                    this.currentTask = undefined
                    return
                }

                const guardLocation = guardPost.getRandomGuardLocation()

                if (guardLocation === undefined) {
                    return
                }

                this.pathFindTo(guardLocation)

                this.taskProgress = randomInt(20, 200)
            }
        }
    }

    tickGuardVillage(village: Village) {
        if (!this.isPathing) {
            const otherVillagers = village.getVillagers().filter(otherVillager => otherVillager.id !== this.id)
            const randomVillager = randomItem(otherVillagers)

            if (randomVillager === undefined) {
                return
            }

            this.pathFindTo(randomVillager)
        }
    }

    tickPickupItem() {
        const villager = this
        const foundItem = villager.foundItem
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
                    villager.currentTask = undefined
                    villager.animation = undefined
                    villager.stopPath()
                }
            }
            else if (pathError !== undefined) {
                foundItem.unreachable = 20
                unreachableItemEntities.add(foundItem)
                villager.currentTask = undefined
            }
            else {
                villager.pathFindTo(foundItem)
            }
        }
        else {
            villager.currentTask = undefined
        }
    }

    updateAnimation() {
        if (this.lastAnimation !== this.animation) {
            this.lastAnimation = this.animation
            this.entity.setProperty("property:animation", this.animation ?? "none")
        }
    }

    updateHoldingItem() {
        if (this.lastHoldingItem !== this.holdingItem) {
            this.lastHoldingItem = this.holdingItem
            this.entity.runCommand(
                this.holdingItem !== undefined ? `replaceitem entity @s slot.weapon.offhand 0 ${this.holdingItem}` : "replaceitem entity @s slot.weapon.offhand 0 air"
            )
        }
    }

    public openedDoors: LocationString[] = []

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

            const ESCAPE_RANGE = 3

            if (leashedEntity !== undefined) {
                const escaping = Object.entries(village.ranchEntities).some(([id, other]) =>
                    id !== leashedEntity.id &&
                    other.inPen &&
                    calculateDistance(center, other.location) <= ESCAPE_RANGE
                )

                if (!escaping) {
                    const ranchEntity = village.ranchEntities[leashedEntity.id]
                    const leashedLocation = leashedEntity.location
                    const range = !ranchEntity?.inPen ? 5 : 1
                    if (calculateDistance(center, leashedLocation) <= range) {
                        continue
                    }
                }
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
        isFinished: () => boolean
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

        function tickFollowPath() {
            if (isFinished()) {
                return
            }

            try {
                if (!villager.isValid || !villager.isPathing || village === undefined) {
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
                        // The path is still being generated; wait for more nodes.
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
                if (pathNodeBlock !== undefined) {
                    if (!pathNodeBlock.isValidPath(villageBounds)) {
                        village.checkNodeValidity(locationToString(pathNodeBlock))
                        cancelPath()
                        return
                    }
                    const pathNodeBlockBelowTypeId = pathNodeBlock.belowSafe()?.typeId
                    if (pathNodeBlockBelowTypeId !== undefined && (Registry.slabTypes.includesFast(pathNodeBlockBelowTypeId) || Registry.stairTypes.includesFast(pathNodeBlockBelowTypeId))) {
                        currentPathNode.y -= 0.5
                    }

                    if (pathNodeBlock.isOpenable) {
                        villager.openDoor(pathNodeBlock)
                    }
                }
                villager.nextPathNode = currentPathNode
                if (calculateDistance(currentPathNode, entityLocation) >= 2) {
                    cancelPath()
                    return
                }
                const blocker = findPathBlocker(dimensionId, currentPathNode, villager.id, entityLocation, village)
                if (blocker?.cancelPath === true) {
                    cancelPath()
                    return
                }
                let isBlocked = blocker !== undefined
                const blockedByTektopiaVillager = blocker?.typeId.startsWith("tektopia:") === true
                villager.blockingEntityTypeId = blocker?.typeId

                if (blockedByTektopiaVillager) {
                    villager.unblockTimer += 4
                    if (villager.unblockTimer > 20) {
                        villager.unblockTimer = 20
                    }
                }
                else if (!isBlocked && villager.unblockTimer > 0) {
                    villager.unblockTimer--
                    isBlocked = true
                }

                if (!isBlocked) {
                    villager.totalBlockTimer --
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

                const isMoving = villager.getMoveSpeed(true) > 0.0001
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
                        villager.applyKnockback(moveVector, 0)
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
    for (const villager of villagers) {
        try {
            villager.tickAI()
        }
        catch (error) {
            console.warn("Villager tick failed: ", error)
        }
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

Block.prototype.destroy = function () {
    if (!this.isValid) {
        return
    }
    const lootTableManager = world.getLootTableManager()
    const itemList = lootTableManager.generateLootFromBlock(this, new ItemStack("minecraft:netherite_pickaxe")) ?? []
    const dimension = this.dimension
    for (const item of itemList) {
        item.makeVillageItem()
        dimension.spawnItem(item, this.center())
    }
    this.soundEvent("break")
    this.setType("air")
}

Block.prototype.replace = function (blockType) {
    if (blockType instanceof BlockPermutation) {
        this.setPermutation(blockType)
    }
    else {
        this.setType(blockType)
    }

    this.soundEvent("place")
}

ItemStack.prototype.makeVillageItem = function () {
    this.nameTag = `§r§a${formatTypeId(this.typeId)}`
    this.setLore(["§r§7Village Item"])
}

Block.prototype.soundEvent = function (eventId, soundOptions) {
    let options = soundOptions !== undefined ? { ...soundOptions } : undefined
    if (this.isAir) {
        return
    }
    const sound = blockSounds[removeIdentifier(this.typeId)]?.[eventId]
    if (sound === undefined) {
        console.warn(`Missing sound: ${this.typeId}`)
        return
    }

    if (typeof sound === "object" && sound !== null) {
        options = {
            pitch: resolveValue(sound.pitch ?? 1),
            volume: resolveValue(sound.volume ?? 1),
            ...options
        }
    }

    function resolveValue(value: number | [number, number]) {
        if (Array.isArray(value)) {
            return randomInt(value[0] * 10, value[1] * 10) / 10
        }
        return value
    }

    if (sound !== null) {
        this.playSound(typeof sound === "string" ? sound : sound.sound, options)
    }
}

Block.prototype.playSound = function (soundId, soundOptions) {
    this.dimension.playSound(soundId, this.center(), soundOptions)
}

Object.defineProperty(Entity.prototype, "isShearable", {
    get(this: Entity): boolean {
        if (this.typeId !== "minecraft:sheep") {
            return false
        }

        return !this.hasComponent(EntityComponentTypes.IsSheared)
    }
})

