import {
    addVector,
    addVectors,
    calculateDistance,
    type CardinalDirection,
    directionToVector,
    multiplyVector,
    stringToLocation,
    subtractVectors
} from "./utils"

import type { LocationString } from "./minecraft_extensions"

import type {
    Block,
    Dimension,
    Vector3
} from "@minecraft/server"

export interface StructureTypeMap {
    mineshaft: Mineshaft
    storage: Structure
    townhall: Structure
    home_2: Structure
}

export type StructureType = keyof StructureTypeMap

export interface StructureData {
    type: StructureType
    rotation: CardinalDirection
}

export interface MineshaftData extends StructureData {
    type: "mineshaft"
}

type StructureFactory = (locationString: LocationString, data: StructureData, dimension: Dimension) => Structure

export class Structure<T extends StructureData = StructureData> {
    private static cache = new WeakMap<StructureData, Structure>()
    private static factories = new Map<string, StructureFactory>()

    readonly location: Vector3
    readonly locationString
    private readonly data
    readonly dimension

    protected constructor(locationString: LocationString, data: T, dimension: Dimension) {
        this.location = stringToLocation(locationString)
        this.locationString = locationString
        this.data = data
        this.dimension = dimension
    }

    static register(type: string, factory: StructureFactory) {
        Structure.factories.set(type, factory)
    }

    static from(locationString: LocationString, data: MineshaftData, dimension: Dimension): Mineshaft
    static from(locationString: LocationString, data: StructureData, dimension: Dimension): Structure
    static from(locationString: LocationString, data: StructureData, dimension: Dimension): Structure {
        let structure = Structure.cache.get(data)
        if (structure === undefined) {
            const factory = Structure.factories.get(data.type)
            structure = factory !== undefined ?
                factory(locationString, data, dimension) :
                new Structure(locationString, data, dimension)
            Structure.cache.set(data, structure)
        }
        return structure
    }

    get type() {
        return this.data.type
    }

    get rotation() {
        return this.data.rotation
    }
}

type MineshaftTask = { type: "fill", block: Block, offset: Vector3 } | { type: "mine", block: Block } | { type: "light", block: Block }

export class Mineshaft extends Structure<MineshaftData> {
    constructor(locationString: LocationString, data: MineshaftData, dimension: Dimension) {
        super(locationString, data, dimension)
    }

    getMineBlock() {
        const mineshaftDirection = directionToVector(this.rotation)

        const doorLocations = [this.location, addVector(this.location, "y", 1)]

        let shortestRay
        for (const doorLocation of doorLocations) {
            const rayCast = this.dimension.getBlockFromRay(doorLocation, mineshaftDirection, { includeLiquidBlocks: true, includePassableBlocks: false })

            if (rayCast === undefined) {
                continue
            }

            const rayCastBlock = rayCast.block
            const rayCastDistance = calculateDistance(rayCastBlock.location, doorLocation)
            if (shortestRay === undefined || rayCastDistance < shortestRay.distance) {
                shortestRay = {
                    distance: rayCastDistance,
                    block: rayCastBlock
                }
            }
        }

        return shortestRay?.block
    }

    getNextTask(): MineshaftTask | undefined {
        const mineBlock = this.getMineBlock()
        if (mineBlock === undefined) {
            return undefined
        }

        const mineshaftDirection = directionToVector(this.rotation)
        const offsetDirection = { x: mineshaftDirection.z, y: mineshaftDirection.y, z: mineshaftDirection.x }
        const reverseOffsetDirection = multiplyVector(offsetDirection, "xyz", -1)

        const checkLocations = [
            addVector(this.location, "y", -1),
            addVector(this.location, "y", 2),
            addVectors(addVector(this.location, "y", 1), offsetDirection),
            addVectors(addVector(this.location, "y", 1), reverseOffsetDirection),
            addVectors(this.location, offsetDirection),
            addVectors(this.location, reverseOffsetDirection)
        ]

        const checkBlocks = checkLocations.map(location => ({
            offset: subtractVectors(location, this.location),
            block: this.dimension.getBlockSafe(location)
        }))

        const distanceToMineBlock =
            ((mineBlock.location.x - this.location.x) * mineshaftDirection.x) +
            ((mineBlock.location.y - this.location.y) * mineshaftDirection.y) +
            ((mineBlock.location.z - this.location.z) * mineshaftDirection.z)

        let lightBlock = this.dimension.getBlockSafe(this.location)
        for (let step = 0; step < distanceToMineBlock; step++) {
            for (let i = 0; i < checkBlocks.length; i++) {
                const { offset, block } = checkBlocks[i]
                if (block === undefined) {
                    return undefined
                }

                if (block.isAir) {
                    return { type: "fill", block, offset }
                }


                checkBlocks[i] = { block: block.offsetSafe(mineshaftDirection), offset }
            }

            if (lightBlock === undefined) {
                return undefined
            }

            if (step > 4 && lightBlock.getLightLevel() < 3 && lightBlock.isAir) {
                return { type: "light", block: lightBlock }
            }

            lightBlock = lightBlock.offsetSafe(mineshaftDirection)
        }

        return { type: "mine", block: mineBlock }
    }
}

Structure.register("mineshaft", (locationString, data, dimension) => new Mineshaft(locationString, data as MineshaftData, dimension))
