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

const BREEDING_DURATION = 30 * 20
const BREEDING_COOLDOWN = 5 * 60 * 20
const MEET_DISTANCE = 1.5
const MEET_TICKS = 20

const activeBreedingStates = new Set<EntityBreeding>()

Entity.prototype.resetEggTimer = function () {
    this.eggLayTimer = randomInt(6000, 12000)
    this.saveData("eggLayTimer")
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
                try {
                    this.entity.dimension.spawnParticle("minecraft:heart_particle", addVectors(this.entity.location, randomOffset))
                }
                catch { }
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

export function getRanchAnimals(): Iterable<Entity> {
    for (const [entityId, entity] of ranchAnimalEntities) {
        if (!entity.isValid) {
            ranchAnimalEntities.delete(entityId)
        }
    }
    return ranchAnimalEntities.values()
}

world.afterEvents.entitySpawn.subscribe(event => {
    const entity = event.entity
    if (RANCH_TYPE_SET.has(entity.typeId)) {
        ranchAnimalEntities.set(entity.id, entity)
        void entity.breeding
    }
})

world.afterEvents.entityLoad.subscribe(event => {
    const entity = event.entity
    if (RANCH_TYPE_SET.has(entity.typeId)) {
        ranchAnimalEntities.set(entity.id, entity)
        void entity.breeding
    }
})

world.afterEvents.entityRemove.subscribe(event => {
    ranchAnimalEntities.delete(event.removedEntityId)
})

const entityLootDict = {
    "minecraft:chicken": "loot_tables/entities/chicken.json",
    "minecraft:cow": "loot_tables/entities/cow.json",
    "minecraft:pig": "loot_tables/entities/pig.json",
    "minecraft:sheep": "loot_tables/entities/sheep.json"
} as Record<string, string>

world.afterEvents.entityDie.subscribe(event => {
    const entity = event.deadEntity
    const damageSource = event.damageSource
    const cause = damageSource.cause
    const damagingEntity = damageSource.damagingEntity

    if (!entity.villagerEntity || !RANCH_TYPE_SET.has(entity.typeId)) {
        return
    }

    const dropVillagerItems = cause === EntityDamageCause.entityAttack && damagingEntity?.isVillager

    let lootTablePath = entityLootDict[entity.typeId]
    if (lootTablePath === undefined) {
        return
    }

    if (entity.hasComponent(EntityComponentTypes.IsSaddled)) {
        lootTablePath = lootTablePath.replace(/\.json$/, "_saddled.json")
    }
    else if (entity.hasComponent(EntityComponentTypes.IsSheared)) {
        lootTablePath = lootTablePath.replace(/\.json$/, "_sheared.json")
    }

    const lootTableManager = world.getLootTableManager()

    const lootTable = lootTableManager.getLootTable(lootTablePath)
    if (lootTable === undefined) {
        return
    }

    const loot = lootTableManager.generateLootFromTable(lootTable)
    if (loot === undefined) {
        return
    }

    for (const item of loot) {
        if (dropVillagerItems) {
            item.makeVillagerItem()
        }
        entity.dimension.spawnItem(item, entity.location)
    }
})

system.runInterval(() => {
    for (const breeding of activeBreedingStates) {
        breeding.tick()
    }

    for (const entity of getRanchAnimals()) {
        if (entity.typeId !== "minecraft:chicken" || !entity.isValid) {
            continue
        }

        if (entity.hasComponent(EntityComponentTypes.IsBaby)) {
            continue
        }

        const rideable = entity.getComponent(EntityComponentTypes.Rideable)
        if ((rideable?.getRiders().length ?? 0) > 0) {
            continue
        }

        if (entity.eggLayTimer === undefined) {
            entity.resetEggTimer()
            continue
        }

        entity.eggLayTimer--
        entity.saveData("eggLayTimer")

        if (entity.eggLayTimer > 0) {
            continue
        }

        const climate = entity.getProperty("minecraft:climate_variant")
        const eggType = climate === "warm"
            ? "minecraft:brown_egg"
            : climate === "cold"
                ? "minecraft:blue_egg"
                : "minecraft:egg"

        const egg = new ItemStack(eggType)
        if (entity.villagerEntity === true) {
            egg.makeVillagerItem()
        }

        try {
            entity.dimension.spawnItem(egg, entity.location)
            entity.resetEggTimer()
        }
        catch { }
    }
})

world.afterEvents.worldLoad.subscribe(() => {
    for (const entity of world.getEntities()) {
        if (RANCH_TYPE_SET.has(entity.typeId)) {
            ranchAnimalEntities.set(entity.id, entity)
            void entity.breeding
        }
    }
})
