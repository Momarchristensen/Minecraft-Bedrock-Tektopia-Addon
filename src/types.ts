import type { Vector3 } from "@minecraft/server"

export type LocationString = string & {
    readonly __vectorString: unique symbol
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

export interface VillageRanchEntity {
    typeId: string
    location: Vector3
    inPen: boolean
    structure: LocationString | undefined
    breedable: boolean
    villagerEntity: boolean
    isShearable: boolean
}
