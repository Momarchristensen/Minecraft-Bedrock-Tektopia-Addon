import {
    StructureRotation,
    type Vector3
} from "@minecraft/server"

import type { LocationString } from "./minecraft_extensions"

export type CardinalDirection = "north" | "south" | "east" | "west" | "up" | "down"

export function isVectorBetween(vector: Vector3, vector1: Vector3, vector2: Vector3, ignoreY = false): boolean {
    const centeredVector = centerVector(vector)
    const startingVector = floorVector(minVectors(vector1, vector2))
    const endingVector = ceilVector(maxVectors(vector1, vector2))
    return (
        centeredVector.x >= startingVector.x && centeredVector.x <= endingVector.x && (ignoreY || (centeredVector.y >= startingVector.y && centeredVector.y <= endingVector.y)) && centeredVector.z >= startingVector.z && centeredVector.z <= endingVector.z
    )
}

export function formatTypeId(itemTypeId: string) {
    return capitalizeEveryWord(removeIdentifier(itemTypeId).replace(/_/g, " "))
}

export function capitalizeEveryWord(sentence: string) {
    const words = sentence.split(" ")
    const capitalizedWords = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    const capitalizedSentence = capitalizedWords.join(" ")
    return capitalizedSentence
}

export function fix(number: number, decimalPlaces = 0): number {
    return Number(number.toFixed(decimalPlaces))
}

export function minVectors(...vectors: Vector3[]): Vector3 {
    return {
        x: Math.min(...vectors.map(vector => vector.x)),
        y: Math.min(...vectors.map(vector => vector.y)),
        z: Math.min(...vectors.map(vector => vector.z))
    }
}

export function maxVectors(...vectors: Vector3[]): Vector3 {
    return {
        x: Math.max(...vectors.map(vector => vector.x)),
        y: Math.max(...vectors.map(vector => vector.y)),
        z: Math.max(...vectors.map(vector => vector.z))
    }
}

export function floorVector(vector: Vector3): Vector3 {
    return {
        x: Math.floor(vector.x),
        y: Math.floor(vector.y),
        z: Math.floor(vector.z)
    }
}

export function ceilVector(vector: Vector3): Vector3 {
    return {
        x: Math.ceil(vector.x),
        y: Math.ceil(vector.y),
        z: Math.ceil(vector.z)
    }
}

export function calculateDistance(v1: Vector3, v2: Vector3, ignoreY = false): number {
    const dx = v1.x - v2.x
    const dy = ignoreY ? 0 : v1.y - v2.y
    const dz = v1.z - v2.z
    return Math.sqrt((dx * dx) + (dy * dy) + (dz * dz))
}

export function calculateSquareDistance(v1: Vector3, v2: Vector3, ignoreY = false): number {
    const dx = Math.abs(v1.x - v2.x)
    const dy = ignoreY ? 0 : Math.abs(v1.y - v2.y)
    const dz = Math.abs(v1.z - v2.z)
    return Math.max(dx, dy, dz)
}

export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomItem<T>(list: T[]): T | undefined {
    return list[randomInt(0, list.length - 1)]
}

export function locationToString(vector: Vector3): LocationString {
    return `${vector.x},${vector.y},${vector.z}` as LocationString
}

export function fixVector(vector: Vector3, decimalPlaces = 0): Vector3 {
    return {
        x: fix(vector.x, decimalPlaces),
        y: fix(vector.y, decimalPlaces),
        z: fix(vector.z, decimalPlaces)
    }
}

export function centerVector(vector: Vector3, floorY = false): Vector3 {
    return {
        x: Math.floor(vector.x) + 0.5,
        y: Math.floor(vector.y) + (floorY ? 0 : 0.5),
        z: Math.floor(vector.z) + 0.5
    }
}

export function addVectors(...vectors: Vector3[]): Vector3 {
    let x = 0, y = 0, z = 0
    const len = vectors.length
    for (let i = 0; i < len; i++) {
        const v = vectors[i]
        x += v.x
        y += v.y
        z += v.z
    }
    return { x, y, z }
}

export function addVector(vector: Vector3, axises: string | string[], value: number): Vector3 {
    const result: Vector3 = {
        x: vector.x,
        y: vector.y,
        z: vector.z
    }

    for (const axis of axises) {
        if (axis in result) {
            (result as unknown as Record<string, number>)[axis] += value
        }
    }
    return result
}

export function multiplyVector(vector: Vector3, axises: string | string[], value: number): Vector3 {
    const result: Vector3 = {
        x: vector.x,
        y: vector.y,
        z: vector.z
    }

    for (const axis of axises) {
        if (axis in result) {
            (result as unknown as Record<string, number>)[axis] *= value
        }
    }
    return result
}

export function rotationToStructureRotation(rotation: string): StructureRotation | undefined {
    if (rotation === "north") {
        return StructureRotation.None
    }
    else if (rotation === "east") {
        return StructureRotation.Rotate90
    }
    else if (rotation === "south") {
        return StructureRotation.Rotate180
    }
    else if (rotation === "west") {
        return StructureRotation.Rotate270
    }
    return undefined
}

export function stringToLocation(string: LocationString): Vector3 {
    const index1 = string.indexOf(",")
    const index2 = string.indexOf(",", index1 + 1)
    return {
        x: Number(string.substring(0, index1)),
        y: Number(string.substring(index1 + 1, index2)),
        z: Number(string.substring(index2 + 1))
    }
}

export function subtractLists<T>(list1: T[], list2: T[]): T[] {
    const removalSet = new Set(list2)
    const result: T[] = []
    const len1 = list1.length
    const has = removalSet.has.bind(removalSet)
    for (let i = 0; i < len1; ++i) {
        const item = list1[i]
        if (!has(item)) {
            result.push(item)
        }
    }
    return result
}

export function areVectorsEqual(vector1: Vector3, vector2: Vector3): boolean {
    return vector1.x === vector2.x && vector1.y === vector2.y && vector1.z === vector2.z
}

export function directionToVector(direction: CardinalDirection): Vector3 {
    switch (direction.toLowerCase()) {
        case "north":
            return { x: 0, y: 0, z: -1 }
        case "south":
            return { x: 0, y: 0, z: 1 }
        case "east":
            return { x: 1, y: 0, z: 0 }
        case "west":
            return { x: -1, y: 0, z: 0 }
        case "up":
            return { x: 0, y: 1, z: 0 }
        case "down":
            return { x: 0, y: -1, z: 0 }
    }
    return { x: 0, y: 0, z: 0 }
}

export function getOppositeDirection(direction: CardinalDirection): CardinalDirection | undefined {
    switch (direction.toLowerCase()) {
        case "north":
            return "south"
        case "south":
            return "north"
        case "east":
            return "west"
        case "west":
            return "east"
        case "up":
            return "down"
        case "down":
            return "up"
    }
    return undefined
}

const directionMap: Record<string, string> = {
    "0,0,-1": "north",
    "1,0,0": "east",
    "0,0,1": "south",
    "-1,0,0": "west",
    "0,1,0": "up",
    "0,-1,0": "down",
    "1,0,-1": "northeast",
    "1,0,1": "southeast",
    "-1,0,1": "southwest",
    "-1,0,-1": "northwest",
    "0,1,-1": "northup",
    "1,1,0": "eastup",
    "0,1,1": "southup",
    "-1,1,0": "westup",
    "0,-1,-1": "northdown",
    "1,-1,0": "eastdown",
    "0,-1,1": "southdown",
    "-1,-1,0": "westdown"
}

export function vectorToDirection(vector: Vector3): string | undefined {
    return directionMap[locationToString(vector)]
}

export function subtractVectors(vector1: Vector3, vector2: Vector3): Vector3 {
    return {
        x: vector1.x - vector2.x,
        y: vector1.y - vector2.y,
        z: vector1.z - vector2.z
    }
}

export function splitString(input: string, chunkSize: number): string[] {
    const length = input.length
    const count = Math.ceil(length / chunkSize)
    const out: string[] = new Array(count)
    let offset = 0
    for (let i = 0; i < count; ++i) {
        out[i] = input.slice(offset, offset + chunkSize)
        offset += chunkSize
    }
    return out
}

export function calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) {
        return 0
    }
    const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    const average = sum / numbers.length
    return average
}

export function removeIdentifier(string: string): string {
    return string.includes(":") ? string.split(":")[1] : string
}

export function exclusiveValues<T>(...lists: T[][]): T[] {
    const freq = new Map<T, number>()
    for (const lst of lists) {
        for (const val of new Set(lst)) {
            freq.set(val, (freq.get(val) ?? 0) + 1)
        }
    }
    const result: T[] = []
    for (const [val, count] of freq) {
        if (count === 1) {
            result.push(val)
        }
    }
    return result
}

export function snap(value: number, target: number, epsilon = 1e-6): number {
    return Math.abs(value - target) < epsilon ? target : value
}

export function arraysAreEqual<T>(array1: T[], array2: T[], orderMatters = true): boolean {
    if (!Array.isArray(array1) || !Array.isArray(array2)) {
        return false
    }
    if (array1.length !== array2.length) {
        return false
    }

    if (orderMatters) {
        return array1.every((value, index) => value === array2[index])
    }

    return array1.every(value => array2.includes(value))
}

export function copy<T>(object: T): T {
    if (object === null || typeof object !== "object") {
        return object
    }

    if (Array.isArray(object)) {
        return object.map(copy) as T
    }

    const result: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(object)) {
        result[key] = copy(value)
    }

    return result as T
}
