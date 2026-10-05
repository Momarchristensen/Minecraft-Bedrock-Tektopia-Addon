import {
    Block,
    BlockPermutation,
    type Entity,
    EntityComponentTypes,
    ItemStack,
    system,
    type Vector3,
    World,
    world
} from "@minecraft/server"

import { debugFlags } from "./debug"

import { blockSounds } from "./generated"

import {
    generatePath,
    getCheckPathEntities,
    updatePathNodes
} from "./path"

import { Registry } from "./registry"

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
    stringToLocation,
    locationToString,
    fixVector,
    addVector,
    getOppositeDirection,
    directionToVector
} from "./utils"

import {
    globalTasks,
    tektopiaVillagers
} from "./villager_tasks"

import type { LocationString } from "./minecraft_extensions"

import type { Mineshaft } from "./structure"

import type { Village } from "./village"

const villagerCache = new Map<string, Villager>()

world.afterEvents.entityRemove.subscribe(event => {
    const removedEntityId = event.removedEntityId
    villagerCache.delete(removedEntityId)
})

const PATH_TIMEOUT_TICKS = 1200
const activePaths = new Map<object, { deadline: number, cancel: () => void }>()

system.runInterval(() => {
    const now = system.currentTick
    for (const [_, entry] of activePaths) {
        if (now >= entry.deadline) {
            entry.cancel()
        }
    }
}, 20)

const noop = () => { }

export interface Villager extends Entity { }

export class Villager {
    public isBlocked = false
    public blockedTimer = 0
    public isPathing = false
    public unblockTimer = 0
    public totalBlockTimer = 0
    public pathTickId?: number
    public pathError?: string
    private nextPathNode?: Vector3
    private taskProgress = 0
    private currentTask?: string
    private animation?: string
    private lastAnimation?: string
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

    private foundMine?: Vector3

    constructor(private readonly entity: Entity) {
        return new Proxy(this, {
            get(target, prop, receiver) {
                if (!(prop in target) && prop in target.entity) {
                    const value = Reflect.get(target.entity, prop)
                    return typeof value === "function" ? value.bind(target.entity) : value
                }
                return Reflect.get(target, prop, receiver)
            },
            set(target, prop, value) {
                if (!(prop in target) && prop in target.entity) {
                    return Reflect.set(target.entity, prop, value)
                }
                return Reflect.set(target, prop, value)
            }
        })
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

    findTree(village: Village): Vector3 | undefined {
        const takenTrees = new Set<string>()
        const villagers = world.getVillagers()
        for (const villager of villagers) {
            if (villager.id === this.id) {
                continue
            }
            const tree = villager.foundTree
            if (tree !== undefined) {
                takenTrees.add(locationToString(tree))
            }
        }

        const villagerLoc = this.location
        let closestTree: Vector3 | undefined
        let minDist = Infinity
        for (const treeStr of village.treeLocations) {
            if (takenTrees.has(treeStr)) {
                continue
            }
            const treeVec = stringToLocation(treeStr)
            const dist = calculateDistance(villagerLoc, treeVec)
            if (dist < minDist) {
                minDist = dist
                closestTree = treeVec
            }
        }

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

        const mineshaftStructures = village.findStructures("mineshaft")
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

    findHarvestLocation(village: Village): Vector3 | undefined {
        const takenHarvestLocation = new Set<string>()
        const villagers = world.getVillagers()
        for (const villager of villagers) {
            if (villager.id === this.id) {
                continue
            }
            const harvestLocation = villager.foundHarvest
            if (harvestLocation !== undefined) {
                takenHarvestLocation.add(locationToString(harvestLocation))
            }
        }

        const villagerLocation = this.location
        let closestHarvest: Vector3 | undefined
        let minDist = Infinity
        for (const harvestLocationStr of village.harvestLocations) {
            if (takenHarvestLocation.has(harvestLocationStr)) {
                continue
            }
            const harvestLocationLocation = stringToLocation(harvestLocationStr)
            const dist = calculateDistance(villagerLocation, harvestLocationLocation)
            if (dist < minDist) {
                minDist = dist
                closestHarvest = harvestLocationLocation
            }
        }

        this.foundHarvest = closestHarvest
        return closestHarvest
    }

    findTillLocation(village: Village): Vector3 | undefined {
        const takenTillLocation = new Set<string>()
        const villagers = world.getVillagers()
        for (const villager of villagers) {
            if (villager.id === this.id) {
                continue
            }
            const tillLocation = villager.foundTill
            if (tillLocation !== undefined) {
                takenTillLocation.add(locationToString(tillLocation))
            }
        }

        const villagerLocation = this.location
        let closestTill: Vector3 | undefined
        let minDist = Infinity
        for (const tillLocationStr of village.tillLocations) {
            if (takenTillLocation.has(tillLocationStr)) {
                continue
            }
            const tillLocationLocation = stringToLocation(tillLocationStr)
            const dist = calculateDistance(villagerLocation, tillLocationLocation)
            if (dist < minDist) {
                minDist = dist
                closestTill = tillLocationLocation
            }
        }

        this.foundTill = closestTill
        return closestTill
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
            const plantLocationLocation = stringToLocation(plantLocationStr as LocationString)
            const dist = calculateDistance(villagerLocation, plantLocationLocation)
            if (dist < minDist) {
                minDist = dist
                closestPlant = { location: plantLocationLocation, type }
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

    pathFindTo(targetLocation: Vector3) {
        const villager = this
        if (villager.isPathing) {
            return
        }

        const village = villager.getVillage()
        if (village === undefined) {
            return
        }

        villager.isPathing = true
        villager.nextPathNode = undefined
        const token = { cancelled: false }
        let finished = false

        function cancelPath() {
            if (finished) {
                return
            }
            finished = true
            activePaths.delete(token)
            token.cancelled = true
            villager.blockedTimer = 0
            villager.setAnimation(undefined)
            villager.isPathing = false
            villager.nextPathNode = undefined
            if (villager.pathTickId !== undefined) {
                system.clearRun(villager.pathTickId)
                villager.pathTickId = undefined
            }
            villager.stopPath = noop
        }

        activePaths.set(token, { deadline: system.currentTick + PATH_TIMEOUT_TICKS, cancel: cancelPath })
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

            generatePath(villager, startLocation, targetLocation, token).then(result => {
                if (finished) {
                    return
                }
                if (typeof result === "string") {
                    if (result !== "cancelled") {
                        villager.pathError = result
                    }
                    cancelPath()
                    return
                }
                if (result.length === 0) {
                    cancelPath()
                    return
                }
                villager.followPath(result, targetLocation, cancelPath, () => finished)
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

        const village = villager.getVillage()
        if (village === undefined) {
            villager.setAnimation(undefined)
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
        let targetDistance: number | undefined
        if (this.foundTree !== undefined) {
            target = `Tree @ ${locationToString(this.foundTree)}`
            targetDistance = calculateDistance(villagerLocation, this.foundTree)
        }
        else if (this.foundHarvest !== undefined) {
            target = `Harvest @ ${locationToString(this.foundHarvest)}`
            targetDistance = calculateDistance(villagerLocation, this.foundHarvest)
        }
        else if (this.foundItem?.isValid) {
            const itemLocation = this.foundItem.location
            target = `Item ${formatTypeId(this.foundItem.typeId)} @ ${locationToString(fixVector(itemLocation, 2))}`
            targetDistance = calculateDistance(villagerLocation, itemLocation)
        }

        let waiting = "No"
        if (typeof this.waiting === "number") {
            waiting = `${this.waiting} ticks`
        }
        else if (this.waiting) {
            waiting = "Yes"
        }

        const nameTag = [
            `Villager: ${formatTypeId(this.typeId)}`,
            `Village: ${village?.centerString ?? "None"}`,
            `Task: ${taskName}`,
            `Progress: ${this.taskProgress}`,
            `Pathing: ${this.isPathing ? "Yes" : "No"}`,
            `Blocked: ${this.isBlocked ? "Yes" : "No"}`,
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
        const allTaskList = globalTasks.concat(villagerProps.customTasks)
        const taskList = villager.currentTask !== undefined ? allTaskList.filter(task => task.canInterrupt) : allTaskList

        if (villager.currentTask === undefined) {
            villager.foundTree = undefined
            villager.foundItem = undefined
            villager.foundHarvest = undefined

            for (const task of taskList) {
                if (task.condition(villager, village)) {
                    villager.currentTask = task.id
                    villager.stopPath()
                    villager.taskProgress = 0
                    break
                }
            }

            if (villager.currentTask === undefined) {
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
        if (villager.isPathing && villager.typeId === "tektopia:lumberjack" && system.currentTick % 20 === 0) {
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
            const mineBlockBelow = mineBlock.belowSafe()
            if (mineBlockBelow === undefined) {
                villager.currentTask = undefined
                return
            }

            let pathLocation = addVectors(mineBlock.location, directionToVector(oppositeRotation))
            if (mineBlockBelow.canPathThrough()) {
                pathLocation = addVector(pathLocation, "y", -1)
            }

            const pathLocationDistance = calculateDistance(pathLocation, villager.location)

            if (pathLocationDistance >= 1) {
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
                            village.saplingLocations.push(treeKey)
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
                villager.currentTask = undefined
            }
            else {
                villager.pathFindTo(foundItem.location)
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

    followPath(
        pathNodeList: Vector3[],
        targetLocation: Vector3,
        cancelPath: () => void,
        isFinished: () => boolean
    ) {
        const villager = this

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
                const targetBlock = dimension.getBlockSafe(targetLocation)
                if (targetBlock !== undefined && !targetBlock.isValidPath(villageBounds) && calculateDistance(centerVector(targetLocation), villager.location) <= 1.25) {
                    cancelPath()
                    return
                }
                villager.pathTickId = system.run(tickFollowPath)
                if (pathNodeList.length === 0) {
                    cancelPath()
                    return
                }
                if (debugFlags.villagerPathParticles && system.currentTick % 20 === 0) {
                    pathNodeList.forEach(pathNode => {
                        try {
                            dimension.spawnParticle(
                                "minecraft:villager_angry",
                                centerVector(pathNode)
                            )
                        }
                        catch { }
                    })
                }
                const currentPathNode = centerVector(pathNodeList[0], true)
                const entityLocation = villager.location
                if (villager.isOnGround) {
                    villager.lookAt(currentPathNode, true)
                }
                const direction = villager.getViewDirection()
                const speed = villager.isOnGround ? 0.2 : 0.015
                const moveVector = multiplyVector(direction, "xyz", speed)
                const checkEntityList = getCheckPathEntities(dimensionId, villager)
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
                }
                villager.nextPathNode = currentPathNode
                if (calculateDistance(currentPathNode, entityLocation) >= 2) {
                    cancelPath()
                    return
                }
                let isBlocked = false
                let blockedByTektopiaVillager = false
                for (const checkEntity of checkEntityList) {
                    if (!checkEntity.isBlocked) {
                        const checkEntityLocation = checkEntity.location
                        const checkEntityIsTektopiaVillager = checkEntity.typeId.startsWith("tektopia:")
                        if (calculateChebyshevDistance(checkEntityLocation, currentPathNode) < 1.75) {
                            if (checkEntity.cancelPath) {
                                cancelPath()
                                return
                            }
                            blockedByTektopiaVillager = checkEntityIsTektopiaVillager
                            isBlocked = true
                            break
                        }
                    }
                }

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
                    villager.totalBlockTimer = 0
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
                    pathNodeList.shift()
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
    const itemEntities = world.getEntities({ type: "item" })
    for (const entity of itemEntities) {
        if (entity.unreachable > 0) {
            entity.unreachable--
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
