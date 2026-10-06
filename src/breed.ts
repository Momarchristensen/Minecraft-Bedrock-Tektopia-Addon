import {
    Entity,
    EntityComponentTypes,
    system,
    type VanillaEntityIdentifier,
    world
} from "@minecraft/server"

import {
    addVectors,
    calculateDistance,
    multiplyVector,
    randomInt
} from "./utils"

const RANCH_TYPES = ["minecraft:pig", "minecraft:sheep", "minecraft:cow", "minecraft:chicken"]

const BREEDING_DURATION = 30 * 20
const BREEDING_COOLDOWN = 5 * 60 * 20
const MEET_DISTANCE = 1.5
const MEET_TICKS = 20

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
        return this.cooldown <= 0
    }

    start() {
        if (!this.canBreed) {
            return
        }
        this.time = BREEDING_DURATION
        this.save()
    }

    finish() {
        this.time = 0
        this.waitTime = 0
        this.cooldown = BREEDING_COOLDOWN
        this.save()
    }

    tick() {
        if (this.time > 0) {
            this.time--
        }
        if (this.cooldown > 0) {
            this.cooldown--
        }
        if (this.time > 0 || this.cooldown > 0) {
            this.save()
        }

        const isBreeding = this.time > 0
        if (isBreeding !== this._isBreeding) {
            this.entity.setProperty("tektopia:breeding", isBreeding)
            this._isBreeding = isBreeding
        }

        const target = this.entity.target
        if (
            !this.entity.isValid ||
            !isBreeding ||
            target === undefined ||
            !target.isValid ||
            target.typeId !== this.entity.typeId ||
            target.breeding.time <= 0
        ) {
            this.waitTime = 0
            return
        }

        if (this.time % 20 === 0) {
            this.entity.dimension.spawnParticle("minecraft:heart_particle", this.entity.location)
        }

        const distance = calculateDistance(target.location, this.entity.location)
        this.waitTime = distance < MEET_DISTANCE ? this.waitTime + 1 : 0

        if (this.waitTime <= MEET_TICKS) {
            return
        }

        const babySpawnLocation = multiplyVector(addVectors(target.location, this.entity.location), "xyz", 0.5)
        this.entity.dimension.spawnEntity(
            this.entity.typeId as VanillaEntityIdentifier,
            babySpawnLocation,
            { initialPersistence: true, spawnEvent: "minecraft:entity_born" }
        )

        this.entity.dimension.spawnXp(babySpawnLocation, randomInt(1, 7))

        this.finish()
        target.breeding.finish()
    }
}

const breedingStates = new WeakMap<Entity, EntityBreeding>()

Object.defineProperty(Entity.prototype, "breeding", {
    get(this: Entity) {
        let state = breedingStates.get(this)
        if (state === undefined) {
            state = new EntityBreeding(this)
            breedingStates.set(this, state)
        }
        return state
    }
})

system.runInterval(() => {
    for (const entity of world.getEntities()) {
        if (RANCH_TYPES.includes(entity.typeId)) {
            entity.breeding.tick()
        }
    }
})
