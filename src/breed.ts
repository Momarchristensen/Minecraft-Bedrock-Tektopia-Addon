import {
    Entity,
    EntityComponentTypes,
    EntityDamageCause,
    ItemStack,
    system,
    type VanillaEntityIdentifier,
    world
} from "@minecraft/server"

import { getMixedColor } from "./sheepColors"

import {
    addVectors,
    calculateDistance,
    multiplyVector,
    randomInt
} from "./utils"

const RANCH_TYPES = ["minecraft:pig", "minecraft:sheep", "minecraft:cow", "minecraft:chicken"]
const RANCH_TYPE_SET = new Set(RANCH_TYPES)
const ranchAnimalEntities = new Map<string, Entity>()
const chickenEggLayTimers = new Map<string, number>()
let ranchAnimalEntitiesInitialized = false

const BREEDING_DURATION = 30 * 20
const BREEDING_COOLDOWN = 5 * 60 * 20
const MEET_DISTANCE = 1.5
const MEET_TICKS = 20

const activeBreedingStates = new Set<EntityBreeding>()

function initializeChickenEggLayTimer(entity: Entity) {
    if (entity.typeId === "minecraft:chicken" && !chickenEggLayTimers.has(entity.id)) {
        chickenEggLayTimers.set(entity.id, randomInt(300, 600))
    }
}

function spawnRanchDrop(entity: Entity, typeId: string, amount: number, villagerItem: boolean) {
    if (amount <= 0) {
        return
    }

    const item = new ItemStack(typeId, amount)
    if (villagerItem) {
        item.makeVillagerItem()
    }
    entity.dimension.spawnItem(item, entity.location)
}

function dropRanchAnimalLoot(entity: Entity, cause: EntityDamageCause) {
    if (!RANCH_TYPE_SET.has(entity.typeId) || entity.hasComponent(EntityComponentTypes.IsBaby)) {
        return
    }

    const villagerItem = entity.villagerEntity === true
    const cooked = [
        EntityDamageCause.fire,
        EntityDamageCause.fireTick,
        EntityDamageCause.lava,
        EntityDamageCause.campfire
    ].includes(cause)
    const meat = (raw: string, cookedType: string, amount: number) =>
        spawnRanchDrop(entity, cooked ? cookedType : raw, amount, villagerItem)

    switch (entity.typeId) {
        case "minecraft:chicken":
            meat("minecraft:chicken", "minecraft:cooked_chicken", 1)
            spawnRanchDrop(entity, "minecraft:feather", randomInt(0, 2), villagerItem)
            break
        case "minecraft:cow":
            meat("minecraft:beef", "minecraft:cooked_beef", randomInt(1, 3))
            spawnRanchDrop(entity, "minecraft:leather", randomInt(0, 2), villagerItem)
            break
        case "minecraft:pig":
            meat("minecraft:porkchop", "minecraft:cooked_porkchop", randomInt(1, 3))
            if (entity.hasComponent(EntityComponentTypes.IsSaddled)) {
                spawnRanchDrop(entity, "minecraft:saddle", 1, villagerItem)
            }
            break
        case "minecraft:sheep": {
            meat("minecraft:mutton", "minecraft:cooked_mutton", randomInt(1, 2))
            if (!entity.hasComponent(EntityComponentTypes.IsSheared)) {
                const wool = entity.getWoolItem()
                if (wool !== undefined) {
                    if (villagerItem) {
                        wool.makeVillagerItem()
                    }
                    entity.dimension.spawnItem(wool, entity.location)
                }
            }
            break
        }
    }
}

export interface BreedingSaveData {
    time: number
    cooldown: number
}

export class EntityBreeding {
    time = 0
    cooldown = 0
    waitTime = 0
    private _isBreeding: boolean

    constructor(private readonly entity: Entity) {
        this._isBreeding = (entity.getProperty("tektopia:breeding") as boolean | undefined) ?? false
        this.time = entity.breedingData?.time ?? 0
        this.cooldown = entity.breedingData?.cooldown ?? 0
        if (this.time > 0 || this.cooldown > 0 || this._isBreeding) {
            activeBreedingStates.add(this)
        }
    }

    private save() {
        if (!this.entity.isValid) {
            return
        }
        this.entity.breedingData = this.time > 0 || this.cooldown > 0 ? { time: this.time, cooldown: this.cooldown } : undefined
        this.entity.saveData("breedingData")
    }

    get isBreeding() {
        return this._isBreeding
    }

    get canBreed() {
        if (this.entity.hasComponent(EntityComponentTypes.IsBaby)) {
            return false
        }
        return this.cooldown <= 0 && this.time === 0
    }

    start() {
        if (!this.canBreed) {
            return
        }
        this.time = BREEDING_DURATION
        activeBreedingStates.add(this)
        this.save()
    }

    finish() {
        this.time = 0
        this.waitTime = 0
        this.cooldown = BREEDING_COOLDOWN
        this.save()
    }

    tick() {
        if (!this.entity.isValid) {
            activeBreedingStates.delete(this)
            return
        }
        const wasActive = this.time > 0 || this.cooldown > 0

        if (this.time > 0) {
            this.time--
        }
        if (this.cooldown > 0) {
            this.cooldown--
        }
        if (wasActive) {
            this.save()
        }

        const isBreeding = this.time > 0
        if (isBreeding !== this._isBreeding) {
            this.entity.setProperty("tektopia:breeding", isBreeding)
            this._isBreeding = isBreeding
        }

        if (!isBreeding) {
            this.waitTime = 0
            if (this.time <= 0 && this.cooldown <= 0) {
                activeBreedingStates.delete(this)
            }
            return
        }

        if (this.time % 20 === 0) {
            for (let i = 0; i < 3; i++) {
                const randomOffset = { x: randomInt(-10, 10) / 25, y: randomInt(0, 10) / 25, z: randomInt(-10, 10) / 25 }
                this.entity.dimension.spawnParticle("minecraft:heart_particle", addVectors(this.entity.location, randomOffset))
            }
        }

        const target = this.entity.getEntitiesFromViewDirection().find(entityRayCast => entityRayCast.entity.typeId === this.entity.typeId)?.entity
        if (target === undefined
            || !target.isValid
            || target.typeId !== this.entity.typeId
            || target.breeding === undefined
            || target.breeding.time <= 0
        ) {
            this.waitTime = 0
            return
        }

        const distance = calculateDistance(target.location, this.entity.location)
        this.waitTime = distance < MEET_DISTANCE ? this.waitTime + 1 : 0

        if (this.waitTime <= MEET_TICKS) {
            return
        }

        const babySpawnLocation = multiplyVector(addVectors(target.location, this.entity.location), "xyz", 0.5)
        const babyEntity = this.entity.dimension.spawnEntity(
            this.entity.typeId as VanillaEntityIdentifier,
            babySpawnLocation,
            { initialPersistence: true, spawnEvent: "minecraft:entity_born" }
        )
        babyEntity.loadedData = true
        babyEntity.villagerEntity = true
        babyEntity.saveData("villagerEntity")

        if (this.entity.typeId === "minecraft:sheep") {
            const parentColor1 = this.entity.getComponent(EntityComponentTypes.Color)?.value
            const parentColor2 = target.getComponent(EntityComponentTypes.Color)?.value
            const babyColor = babyEntity.getComponent(EntityComponentTypes.Color)

            if (parentColor1 !== undefined && parentColor2 !== undefined && babyColor !== undefined) {
                babyColor.value = getMixedColor(parentColor1, parentColor2)
            }
        }

        this.entity.dimension.spawnXp(babySpawnLocation, randomInt(1, 7))

        this.finish()
        target.breeding.finish()
    }
}

const breedingStates = new WeakMap<Entity, EntityBreeding>()

Object.defineProperty(Entity.prototype, "breeding", {
    get(this: Entity) {
        if (!this.isValid || !RANCH_TYPE_SET.has(this.typeId)) {
            return undefined
        }
        if (!this.loadedData) {
            this.loadData()
        }
        let state = breedingStates.get(this)
        if (state === undefined) {
            state = new EntityBreeding(this)
            breedingStates.set(this, state)
        }
        return state
    }
})

system.runInterval(() => {
    for (const breeding of activeBreedingStates) {
        breeding.tick()
    }
})

export function getRanchAnimals(): Iterable<Entity> {
    for (const [entityId, entity] of ranchAnimalEntities) {
        if (!entity.isValid) {
            ranchAnimalEntities.delete(entityId)
        }
    }
    return ranchAnimalEntities.values()
}

function initializeBreedingStates() {
    ranchAnimalEntitiesInitialized = false
    system.runJob(function* () {
        let processed = 0
        for (const entity of world.getEntities()) {
            if (RANCH_TYPE_SET.has(entity.typeId)) {
                ranchAnimalEntities.set(entity.id, entity)
                initializeChickenEggLayTimer(entity)
                void entity.breeding
            }
            if (++processed % 32 === 0) {
                yield
            }
        }
        ranchAnimalEntitiesInitialized = true
    }())
}

export function isRanchAnimalRegistryInitialized() {
    return ranchAnimalEntitiesInitialized
}

world.afterEvents.entitySpawn.subscribe(event => {
    if (RANCH_TYPE_SET.has(event.entity.typeId)) {
        ranchAnimalEntities.set(event.entity.id, event.entity)
        initializeChickenEggLayTimer(event.entity)
        void event.entity.breeding
    }
})

world.afterEvents.entityLoad.subscribe(event => {
    if (RANCH_TYPE_SET.has(event.entity.typeId)) {
        ranchAnimalEntities.set(event.entity.id, event.entity)
        initializeChickenEggLayTimer(event.entity)
        void event.entity.breeding
    }
})

world.afterEvents.entityRemove.subscribe(event => {
    ranchAnimalEntities.delete(event.removedEntityId)
    chickenEggLayTimers.delete(event.removedEntityId)
})

world.afterEvents.entityDie.subscribe(event => {
    const entity = event.deadEntity
    chickenEggLayTimers.delete(entity.id)
    dropRanchAnimalLoot(entity, event.damageSource.cause)
})

system.runInterval(() => {
    for (const [entityId, secondsRemaining] of chickenEggLayTimers) {
        const chicken = ranchAnimalEntities.get(entityId)
        if (!chicken?.isValid) {
            chickenEggLayTimers.delete(entityId)
            continue
        }
        if (chicken.hasComponent(EntityComponentTypes.IsBaby)) {
            continue
        }

        const rideable = chicken.getComponent(EntityComponentTypes.Rideable)
        if ((rideable?.getRiders().length ?? 0) > 0) {
            continue
        }
        if (secondsRemaining > 0) {
            chickenEggLayTimers.set(entityId, secondsRemaining - 1)
            continue
        }

        const climate = chicken.getProperty("minecraft:climate_variant")
        const eggType = climate === "warm"
            ? "minecraft:brown_egg"
            : climate === "cold"
                ? "minecraft:blue_egg"
                : "minecraft:egg"
        const egg = new ItemStack(eggType)
        if (chicken.villagerEntity === true) {
            egg.makeVillagerItem()
        }

        try {
            chicken.dimension.spawnItem(egg, chicken.location)
            chickenEggLayTimers.set(entityId, randomInt(300, 600))
        }
        catch { }
    }
})

world.afterEvents.worldLoad.subscribe(() => {
    initializeBreedingStates()
})
