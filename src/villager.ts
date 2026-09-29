import {
    Block,
    Entity,
    EntityComponentReturnType,
    EntityComponentTypes,
    system,
    Vector3,
    World,
    world
} from "@minecraft/server"

import {
    addVectors,
    areVectorsEqual,
    calculateDistance,
    centerVector,
    isVectorBetween,
    randomInt,
    removeIdentifier,
    stringToVector,
    vectorToString
} from "./utils"

import {
    Task,
    VillagerConfig
} from "."

import { Registry } from "./registry"

import {
    pathFindTo,
    updatePathNodes
} from "./path"

import {
    blockIsTree,
    Village
} from "./village"

const originalFunctions = {
    "getEntity": World.prototype.getEntity as (id: string) => Entity | undefined
}

Object.defineProperty(Entity.prototype, "isVillager", {
    get: function (this: Entity) {
        return Registry.villagerTypes.includes(this.typeId)
    }
})

World.prototype.getEntity = function (entityId: string) {
    const entity = originalFunctions.getEntity.call(this, entityId)
    if (entity !== undefined && entity.isVillager) {
        return Villager.fromEntity(entity)
    }
    return entity
}

World.prototype.getVillagers = function () {
    return this.getEntities().filter((entity) =>
        Registry.villagerTypes.includes(entity.typeId)
    ).map(entity => Villager.fromEntity(entity))
}


const villagerCache = new Map<string, Villager>()

world.afterEvents.entityRemove.subscribe(event => {
    const removedEntityId = event.removedEntityId
    villagerCache.delete(removedEntityId)
})

export interface Villager extends Entity { }

export class Villager {
    public isBlocked = false
    public blockedTimer = 0
    public isPathing = false
    public unblockTimer = 0
    public pathTickId?: number
    public pathError?: string
    private taskProgress = 0
    private currentTask?: string
    private animation?: string
    private lastAnimation?: string
    private holdingItem?: string
    private lastHoldingItem?: string
    private waiting?: boolean | number
    private foundItem?: Entity
    private foundTree?: Vector3

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
        if (entity === undefined || !entity.isVillager) {
            return undefined
        }
        return entity instanceof Villager ? entity : Villager.fromEntity(entity)
    }

    get location() {
        return this.entity.location
    }

    get dimension() {
        return this.entity.dimension
    }

    get isDead() {
        return this.entity.isDead
    }

    get id() {
        return this.entity.id
    }

    get typeId() {
        return this.entity.typeId
    }

    get isOnGround() {
        return this.entity.isOnGround
    }

    get isValid() {
        return this.entity.isValid
    }

    get nameTag() {
        return this.entity.nameTag
    }

    set nameTag(value: string) {
        this.entity.nameTag = value
    }

    applyKnockback(...args: Parameters<Entity["applyKnockback"]>) {
        return this.entity.applyKnockback(...args)
    }

    applyImpulse(...args: Parameters<Entity["applyImpulse"]>) {
        return this.entity.applyImpulse(...args)
    }

    getViewDirection(...args: Parameters<Entity["getViewDirection"]>) {
        return this.entity.getViewDirection(...args)
    }

    lookAt(...args: Parameters<Entity["lookAt"]>) {
        return this.entity.lookAt(...args)
    }

    getComponent<T extends string>(componentId: T): EntityComponentReturnType<T> | undefined {
        return this.entity.getComponent(componentId)
    }

    playAnimation(...args: Parameters<Entity["playAnimation"]>) {
        return this.entity.playAnimation(...args)
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
        return Math.sqrt(x * x + z * z + (ignoreY ? 0 : y * y))
    }

    getVillage() {
        const entityLocation = this.location
        const villages = world.getVillages()
        for (let i = 0; i < villages.length; i++) {
            const village = villages[i]
            if (isVectorBetween(entityLocation, village.bounds.start, village.bounds.end, true)) {
                return village
            }
        }
        return undefined
    }

    findTree(village: Village): Vector3 | undefined {
        const takenTrees = new Set<string>()
        const villagers = world.getVillagers()
        for (let i = 0; i < villagers.length; i++) {
            if (villagers[i].id === this.id) {
                continue
            }
            const tree = villagers[i].foundTree
            if (tree) {
                takenTrees.add(vectorToString(tree))
            }
        }

        const villagerLoc = this.location
        let closestTree: Vector3 | undefined
        let minDist = Infinity
        for (let i = 0; i < village.treeLocations.length; i++) {
            const treeStr = village.treeLocations[i]
            if (takenTrees.has(treeStr)) {
                continue
            }
            const treeVec = stringToVector(treeStr)
            const dist = calculateDistance(villagerLoc, treeVec)
            if (dist < minDist) {
                minDist = dist
                closestTree = treeVec
            }
        }

        this.foundTree = closestTree
        return closestTree
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


        const villagerLoc = this.location
        const nearbyItems = this.dimension.getEntities({
            type: "item",
            location: villagerLoc,
            maxDistance: 9
        })

        let closestItem: Entity | undefined
        let bestDist = Infinity
        for (let i = 0; i < nearbyItems.length; i++) {
            const item = nearbyItems[i]
            if (!item.isOnGround || item.unreachable) {
                continue
            }
            if (Math.abs(item.location.y - villagerLoc.y) > 1.1) {
                continue
            }
            if (!isVectorBetween(item.location, village.bounds.start, village.bounds.end)) {
                continue
            }
            const stack = item.getComponent(EntityComponentTypes.Item)?.itemStack
            if (stack === undefined || !pickupItems.includes(stack.typeId)) {
                continue
            }
            const dist = calculateDistance(item.location, villagerLoc)
            if (dist < bestDist) {
                bestDist = dist
                closestItem = item
            }
        }

        this.foundItem = closestItem
        return closestItem
    }

    pathFindTo(targetLocation: Vector3) {
        pathFindTo(this, targetLocation)
    }

    tickAI() {
        const villager = this
        if (villager.isDead) {
            return
        }

        const village = villager.getVillage()
        if (village === undefined) {
            villager.nameTag = "No Village"
            villager.setAnimation(undefined)
            return
        }
        const pathError = villager.pathError

        if (villager.waiting && pathError === undefined) {
            let nameTag = `Waiting${".".repeat(Math.floor(system.currentTick / 5) % 3 + 1)}`
            if (typeof villager.waiting === "number") {
                villager.waiting--
                if (villager.waiting === 0) {
                    villager.holdingItem = undefined
                }
                nameTag = `(${villager.waiting}) ${nameTag}`
            }
            villager.nameTag = nameTag
        }
        else {
            villager.tickTasks(village)
        }

        if (pathError !== undefined) {
            villager.pathError = undefined
        }
        villager.updateHoldingItem()
        villager.updateAnimation()
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
        const taskList = villager.currentTask ? allTaskList.filter((task) => task.canInterrupt) : allTaskList
        villager.taskProgress ??= 0
        if (!villager.currentTask) {
            villager.foundTree = undefined
            villager.foundItem = undefined

            for (let i = 0; i < taskList.length; i++) {
                const task = taskList[i]
                if (task.condition(villager, village)) {
                    villager.currentTask = task.id
                    villager.stopPath()
                    villager.taskProgress = 0
                    break
                }
            }

            if (!villager.currentTask) {
                villager.foundTree = undefined
                villager.foundItem = undefined
            }
        }
        if (villager.currentTask !== undefined) {
            const task = allTaskList.find((task) => task.id === villager.currentTask)
            task?.tick?.(villager, village)

            if (!villager.currentTask && !villager.waiting) {
                if (villager.animation !== "walking") {
                    villager.animation = undefined
                }
                villager.holdingItem = undefined
                villager.stopPath()
                villager.taskProgress = 0
                villager.foundTree = undefined
            }
            for (let i = 0; i < allTaskList.length; i++) {
                const task = allTaskList[i]
                if (task.id === villager.currentTask) {
                    villager.nameTag = `${task.name}\n${villager.blockedTimer}`
                    break
                }
            }
        }
        else {
            if (!villager.isPathing) {
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
                        while (block !== undefined && block.isAir) {
                            block = block.belowSafe()
                        }
                        while (block !== undefined && !block.isAir) {
                            block = block.aboveSafe()
                        }
                        if (block !== undefined) {
                            if (village.pathNodes[vectorToString(block)]) {
                                villager.pathFindTo(block.location)
                                villager.taskProgress = randomInt(20, 200)
                            }
                        }
                    }
                }
            }
        }
        if (villager.currentTask === undefined) {
            villager.nameTag = "Idle"
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
                        if (!block) {
                            continue
                        }
                        if (block.permutation.getState("persistent_bit") === false) {
                            block.destroy()
                            const blockList = [block, block.aboveSafe(), block.belowSafe()]
                            for (const neighbor of blockList) {
                                if (neighbor === undefined) {
                                    continue
                                }
                                const blockString = vectorToString(neighbor)
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

    tickChop(village: Village) {
        const villager = this


        const dimension = villager.dimension
        const foundTree = villager.foundTree

        if (foundTree !== undefined) {
            const treeBlock = dimension.getBlockSafe(foundTree)
            if (treeBlock !== undefined && blockIsTree(treeBlock)) {
                const treeDist = calculateDistance(foundTree, villager.location)
                if (treeDist <= 5) {
                    villager.holdingItem = "wooden_axe"
                }
                else {
                    villager.holdingItem = undefined
                }
                if (treeDist < 0.5 || !villager.isPathing && treeDist < 3) {
                    villager.animation = "chopping"
                    villager.lookAt(centerVector(foundTree))
                    villager.taskProgress++
                    if (villager.taskProgress > 100 && !villager.waiting) {
                        const saplingTypeId = treeBlock.typeId.replace(
                            "_log",
                            "_sapling"
                        )
                        villager.waiting = true
                        villager.animation = undefined
                        destroyTree(treeBlock, function () {
                            village.saplingLocations.push(vectorToString(treeBlock))
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
                village.treeLocations.remove(vectorToString(foundTree))
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
        if (foundItem !== undefined && foundItem.isValid) {
            if (calculateDistance(foundItem.location, villager.location) < 1.75) {
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
                this.holdingItem ? `replaceitem entity @s slot.weapon.offhand 0 ${this.holdingItem}` : "replaceitem entity @s slot.weapon.offhand 0 air"
            )
        }
    }
}





World.prototype.getVillager = function (entityId: string) {
    return Villager.fromId(entityId)
}


const globalTasks: Task[] = [
    {
        id: "eat",
        name: "Eat",
        required: true,
        condition: () => false,
        canInterrupt: true
    },
    {
        id: "sleep",
        name: "Sleep",
        required: true,
        condition: () => false
    },
    {
        id: "item",
        name: "Pickup Items",
        required: true,
        condition: (villager: Villager, village: Village) => villager.findItem(village) !== undefined,
        tick: (villager: Villager) => villager.tickPickupItem()
    },
    {
        id: "tool",
        name: "Get Tool",
        required: true,
        condition: () => false
    },
    {
        id: "craft",
        name: "Craft Tools",
        required: false,
        condition: () => false
    }
]


function destroyTree(startingBlock: Block, callback: () => void) {
    system.runJob(destroyTreeGenerator())

    function* destroyTreeGenerator() {
        try {
            let currentBlock: Block | undefined = startingBlock
            const logType = removeIdentifier(startingBlock.typeId).replace("_log", "")
            const logTypeId = `minecraft:${logType}_log`
            const leafTypeId = `minecraft:${logType}_leaves`

            const logBlocks = [startingBlock]
            const checkLogBlocks = []
            const y = 0
            for (let x = -1; x <= 1; x++) {
                for (let z = -1; z <= 1; z++) {
                    checkLogBlocks.push(startingBlock.offsetSafe({ x, y, z }))
                }
            }
            const checkLeafBlocks = []

            let logChecks = 0
            while (true) {
                currentBlock = currentBlock.aboveSafe()
                if (currentBlock === undefined || currentBlock.typeId !== logTypeId) {
                    break
                }
                if (currentBlock.permutation.getState("pillar_axis") !== "y") {
                    break
                }

                logBlocks.push(currentBlock)
                checkLeafBlocks.push(
                    currentBlock.aboveSafe(),
                    currentBlock.belowSafe(),
                    currentBlock.northSafe(),
                    currentBlock.eastSafe(),
                    currentBlock.southSafe(),
                    currentBlock.westSafe()
                )

                for (let x = -1; x <= 1; x++) {
                    for (let z = -1; z <= 1; z++) {
                        checkLogBlocks.push(currentBlock.offsetSafe({ x, y, z }))
                    }
                }

                if (++logChecks % 10 === 0) {
                    yield
                }
            }

            let alreadyCheckedLocations = new Set()
            let sideLogChecks = 0
            while (checkLogBlocks.length > 0) {
                const checkBlock = checkLogBlocks.pop()
                if (checkBlock === undefined) {
                    continue
                }
                const checkBlockString = vectorToString(checkBlock)
                if (alreadyCheckedLocations.has(checkBlockString)) {
                    continue
                }
                alreadyCheckedLocations.add(checkBlockString)

                if (checkBlock.typeId !== logTypeId) {
                    continue
                }
                if (checkBlock.permutation.getState("pillar_axis") === "y") {
                    continue
                }

                logBlocks.push(checkBlock)
                checkLeafBlocks.push(
                    checkBlock.aboveSafe(),
                    checkBlock.belowSafe(),
                    checkBlock.northSafe(),
                    checkBlock.eastSafe(),
                    checkBlock.southSafe(),
                    checkBlock.westSafe()
                )

                for (let x = -1; x <= 1; x++) {
                    for (let y = 0; y <= 1; y++) {
                        for (let z = -1; z <= 1; z++) {
                            checkLogBlocks.push(checkBlock.offsetSafe({ x, y, z }))
                        }
                    }
                }

                if (++sideLogChecks % 10 === 0) {
                    yield
                }
            }

            alreadyCheckedLocations = new Set()
            const leafBlocks = []
            const logBlockLocations = logBlocks.map((block) => block.location)


            let leafChecks = 0
            while (checkLeafBlocks.length > 0) {
                const checkBlock = checkLeafBlocks.pop()
                if (checkBlock === undefined) {
                    continue
                }
                const checkBlockString = vectorToString(checkBlock)
                if (alreadyCheckedLocations.has(checkBlockString)) {
                    continue
                }
                alreadyCheckedLocations.add(checkBlockString)

                if (checkBlock.typeId !== leafTypeId) {
                    continue
                }
                if (checkBlock.permutation.getState("persistent_bit")) {
                    continue
                }

                let closestLogLocation
                const maxDistance = 4
                let closestDistance = maxDistance + 1

                outer: for (let dx = -maxDistance; dx <= maxDistance; dx++) {
                    for (let dy = -maxDistance; dy <= maxDistance; dy++) {
                        for (let dz = -maxDistance; dz <= maxDistance; dz++) {
                            if (Math.abs(dx) + Math.abs(dy) + Math.abs(dz) > maxDistance) {
                                continue
                            }

                            const block = checkBlock.offsetSafe({ x: dx, y: dy, z: dz })
                            if (!block) {
                                continue
                            }

                            const distance = calculateDistance(block, checkBlock)
                            if (block.typeId === logTypeId && distance < closestDistance) {
                                closestLogLocation = block.location
                                closestDistance = distance
                                if (closestDistance === 1) {
                                    break outer
                                }
                            }
                        }
                    }
                }

                if (!closestLogLocation) {
                    continue
                }
                if (
                    !logBlockLocations.some((loc) =>
                        areVectorsEqual(closestLogLocation, loc)
                    )
                ) {
                    continue
                }

                leafBlocks.push(checkBlock)
                checkLeafBlocks.push(
                    checkBlock.aboveSafe(),
                    checkBlock.belowSafe(),
                    checkBlock.northSafe(),
                    checkBlock.eastSafe(),
                    checkBlock.southSafe(),
                    checkBlock.westSafe()
                )

                if (++leafChecks % 3 === 0) {
                    yield
                }
            }

            const blockList = logBlocks.concat(leafBlocks)
            const blocksToUpdate = []
            const checkedBlocks = new Set()

            for (let i = 0; i < blockList.length; i++) {
                const block = blockList[i]
                block.destroy()

                const updateBlockList = [block, block.aboveSafe(), block.belowSafe()]
                for (let j = 0; j < updateBlockList.length; j++) {
                    const block = updateBlockList[j]
                    if (block === undefined) {
                        continue
                    }
                    const list = [block, block.aboveSafe()]
                    for (let k = 0; k < list.length; k++) {
                        const block = list[k]
                        if (block === undefined) {
                            continue
                        }
                        const blockString = vectorToString(block)
                        if (!checkedBlocks.has(blockString)) {
                            checkedBlocks.add(blockString)
                            blocksToUpdate.push(block, block.aboveSafe())
                        }
                    }
                }

                if (i % 3 === 0) {
                    yield
                }
            }

            updatePathNodes(blocksToUpdate.filter((block) => block !== undefined))
        }
        finally {
            if (callback !== undefined) {
                callback()
            }
        }
    }
}

const tektopiaVillagers: Record<string, VillagerConfig> = {
    "tektopia:farmer": {
        customTasks: [
            {
                id: "till",
                name: "Till",
                required: false,
                condition: () => false
            },
            {
                id: "plant",
                name: "Plant",
                required: false,
                condition: () => false
            },
            {
                id: "harvest",
                name: "Harvest",
                required: false,
                condition: () => false
            }
        ],
        pickupItems: [
            "minecraft:wheat_seeds",
            "minecraft:beetroot_seeds",
            "minecraft:pumpkin_seeds",
            "minecraft:melon_seeds",
            "minecraft:sugarcane",
            "minecraft:potato",
            "minecraft:carrot",
            "minecraft:pumpkin",
            "minecraft:melon_slice"
        ]
    },
    "tektopia:lumberjack": {
        customTasks: [
            {
                id: "chop",
                name: "Chop Trees",
                required: false,
                condition: (villager: Villager, village: Village) => villager.findTree(village) !== undefined,
                tick: (villager: Villager, village: Village) => villager.tickChop(village)
            }
        ],
        pickupItems: () => ["minecraft:apple", ...Registry.saplingTypes, ...Registry.logTypes]
    }
}