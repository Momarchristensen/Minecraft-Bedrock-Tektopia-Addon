import {
    stringToLocation,
    locationToString
} from "./utils"

import type { StructureData } from "./structure"

import type {
    NodeRequirement,
    PathNode,
    LocationString
} from "./types"

import type { Vector3 } from "@minecraft/server"

export interface VillageSaveData {
    center: Vector3
    dimensionId: string
    doorLocation: Vector3
    pathNodes: Record<LocationString, PathNode>
    sugarCaneLocations: LocationString[]
    saplingLocations: LocationString[]
    farmLocations: LocationString[]
    harvestLocations: LocationString[]
    growLocations: LocationString[]
    plantLocations: Record<LocationString, string>
    tillLocations: LocationString[]
    sweetBerryLocations: LocationString[]
    treeLocations: LocationString[]
    oreLocations: LocationString[]
    structures: Record<LocationString, StructureData>
}

const SAVE_PATH_NODES: boolean = true

const SAVE_RESOURCE_LOCATIONS: boolean = true

const SAVE_DERIVED_LOCATIONS: boolean = false

const NAMESPACE = "minecraft:"

type Triple = [number, number, number]

export type CompressedRequirement = [
    whiteList: 0 | 1,
    types: string[],
    nodeIndexDeltas: string
]

export type CompressedCost = [
    cost: number,
    nodeIndexDeltas: string
]

export type PackedStructures = [
    locations: string,
    types: string[],
    typeRotationIndices: string
]

export type CompressedStructures = PackedStructures | Record<LocationString, StructureData> | undefined

export type CompressedVillage = [
    dimensionId?: string,
    center?: Triple,
    doorLocation?: Triple,
    sugarCaneLocations?: string,
    saplingLocations?: string,
    farmLocations?: string,
    treeLocations?: string,
    harvestLocations?: string,
    sweetBerryLocations?: string,
    tillLocations?: string,
    plantLocations?: string,
    nodeLocations?: string,
    neighborMaskPalette?: string,
    neighborMaskIndices?: string,
    nodeRequirements?: CompressedRequirement[],
    plantTypes?: string[] | undefined,
    plantTypeIndices?: string | undefined,
    structures?: CompressedStructures,
    nodeCosts?: CompressedCost[] | undefined,
    connectionRequirements?: CompressedRequirement[] | undefined,
    edgeMode?: 1 | undefined,
    oreLocations?: string,
    growLocations?: string
]

type DecompressibleVillage = CompressedVillage & [
    dimensionId: string,
    center: Triple,
    doorLocation: Triple
]

const DIGITS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
const DIGIT_VALUES: Record<string, number> = {}
const SAVE_BATCH_SIZE = 128

for (let i = 0; i < DIGITS.length; i++) {
    DIGIT_VALUES[DIGITS.charAt(i)] = i
}

function yieldAfterBatch(index: number): boolean {
    return (index + 1) % SAVE_BATCH_SIZE === 0
}

function arrayItem<T>(items: T[], index: number): T {
    const item = items[index]
    if (item === undefined) {
        throw new Error(`Missing array item at index ${index}`)
    }
    return item
}

function isTriple(value: unknown): value is Triple {
    return Array.isArray(value)
        && value.length === 3
        && value.every(component => typeof component === "number" && Number.isFinite(component))
}

function isDecompressibleVillage(value: unknown): value is DecompressibleVillage {
    if (!Array.isArray(value)) {
        return false
    }

    const dimensionId: unknown = value[0]
    return typeof dimensionId === "string"
        && dimensionId.trim().length > 0
        && isTriple(value[1])
        && isTriple(value[2])
}

function* sortInTicks<T>(items: T[], compare: (left: T, right: T) => number): Generator<void, void, void> {
    if (items.length < 2) {
        return
    }

    let source = items
    let target = new Array<T>(items.length)
    let work = 0

    for (let width = 1; width < items.length; width *= 2) {
        for (let start = 0; start < items.length; start += width * 2) {
            const middle = Math.min(start + width, items.length)
            const end = Math.min(start + (width * 2), items.length)
            let left = start
            let right = middle

            for (let i = start; i < end; i++) {
                if (left < middle && (right >= end || compare(arrayItem(source, left), arrayItem(source, right)) <= 0)) {
                    target[i] = arrayItem(source, left)
                    left++
                }
                else {
                    target[i] = arrayItem(source, right)
                    right++
                }

                if (++work % SAVE_BATCH_SIZE === 0) {
                    yield
                }
            }
        }

        const previousSource = source
        source = target
        target = previousSource
    }

    if (source !== items) {
        for (let i = 0; i < items.length; i++) {
            items[i] = arrayItem(source, i)
            if (yieldAfterBatch(i)) {
                yield
            }
        }
    }
}

function* packUnsigned(values: number[]): Generator<void, string, void> {
    let result = ""
    for (let i = 0; i < values.length; i++) {
        let value = arrayItem(values, i)
        while (value >= 32) {
            result += DIGITS.charAt((value % 32) + 32)
            value = Math.floor(value / 32)
        }
        result += DIGITS.charAt(value)
        if (yieldAfterBatch(i)) {
            yield
        }
    }
    return result
}

function unpackUnsigned(text: string): number[] {
    const result: number[] = []
    let value = 0
    let scale = 1
    for (const char of text) {
        const digit = DIGIT_VALUES[char]
        if (digit === undefined) {
            continue
        }
        value += (digit & 31) * scale
        if (digit >= 32) {
            scale *= 32
        }
        else {
            result.push(value)
            value = 0
            scale = 1
        }
    }
    return result
}

function zigzag(value: number) {
    return value >= 0 ? value * 2 : (-value * 2) - 1
}

function unzigzag(value: number) {
    return value % 2 === 0 ? value / 2 : -(value + 1) / 2
}

function* packSigned(values: number[]): Generator<void, string, void> {
    const signedValues: number[] = new Array(values.length)
    for (let i = 0; i < values.length; i++) {
        signedValues[i] = zigzag(arrayItem(values, i))
        if (yieldAfterBatch(i)) {
            yield
        }
    }
    return yield* packUnsigned(signedValues)
}

function unpackSigned(text: string): number[] {
    return unpackUnsigned(text).map(value => unzigzag(value))
}

function comparePoints(vector1: Vector3, vector2: Vector3) {
    const x = vector1.x - vector2.x
    if (x !== 0) {
        return x
    }

    const z = vector1.z - vector2.z
    if (z !== 0) {
        return z
    }

    return vector1.y - vector2.y
}

function* packPoints(sortedPoints: Vector3[], origin: Vector3): Generator<void, string, void> {
    if (sortedPoints.length === 0) {
        return ""
    }
    const dx: number[] = new Array(sortedPoints.length)
    const dy: number[] = new Array(sortedPoints.length)
    const dz: number[] = new Array(sortedPoints.length)
    let px = origin.x
    let py = origin.y
    let pz = origin.z
    for (const [i, point] of sortedPoints.entries()) {
        dx[i] = point.x - px
        dy[i] = point.y - py
        dz[i] = point.z - pz
        px = point.x
        py = point.y
        pz = point.z
        if (yieldAfterBatch(i)) {
            yield
        }
    }
    const packedX = yield* packSigned(dx)
    const packedZ = yield* packSigned(dz)
    const packedY = yield* packSigned(dy)
    return `${packedX}.${packedZ}.${packedY}`
}

function unpackPoints(text: string, origin: Vector3): Vector3[] {
    if (text === "") {
        return []
    }
    const [xText = "", zText = "", yText = ""] = text.split(".")
    const dx = unpackSigned(xText)
    const dz = unpackSigned(zText)
    const dy = unpackSigned(yText)
    const points: Vector3[] = new Array(dx.length)
    let x = origin.x
    let y = origin.y
    let z = origin.z
    for (const [i, deltaX] of dx.entries()) {
        x += deltaX
        y += dy[i] ?? 0
        z += dz[i] ?? 0
        points[i] = { x, y, z }
    }
    return points
}

function* packLocations(locationList: LocationString[], origin: Vector3): Generator<void, string, void> {
    const points: Vector3[] = []
    for (let i = 0; i < locationList.length; i++) {
        points.push(stringToLocation(arrayItem(locationList, i)))
        if (yieldAfterBatch(i)) {
            yield
        }
    }
    yield* sortInTicks(points, comparePoints)
    return yield* packPoints(points, origin)
}

function unpackLocations(text: string, origin: Vector3): LocationString[] {
    return unpackPoints(text, origin).map(point => locationToString(point))
}

function* packTypedLocations(locationRecord: Record<LocationString, string>, origin: Vector3): Generator<void, [locations: string, types: string[], typeIndices: string], void> {
    const entries: Array<{ point: Vector3, type: string }> = []
    const keys = Object.keys(locationRecord) as LocationString[]
    for (let i = 0; i < keys.length; i++) {
        const key = arrayItem(keys, i)
        const type = locationRecord[key]
        if (type === undefined) {
            continue
        }
        entries.push({ point: stringToLocation(key), type })
        if (yieldAfterBatch(i)) {
            yield
        }
    }
    yield* sortInTicks(entries, (a, b) => comparePoints(a.point, b.point))

    const types: string[] = []
    const typeIndexByType = new Map<string, number>()
    const typeIndices: number[] = []
    for (let i = 0; i < entries.length; i++) {
        const entry = arrayItem(entries, i)
        let typeIndex = typeIndexByType.get(entry.type)
        if (typeIndex === undefined) {
            typeIndex = types.length
            types.push(entry.type.startsWith(NAMESPACE) ? entry.type.slice(NAMESPACE.length) : entry.type)
            typeIndexByType.set(entry.type, typeIndex)
        }
        typeIndices.push(typeIndex)
        if (yieldAfterBatch(i)) {
            yield
        }
    }

    const points: Vector3[] = new Array(entries.length)
    for (let i = 0; i < entries.length; i++) {
        points[i] = arrayItem(entries, i).point
        if (yieldAfterBatch(i)) {
            yield
        }
    }
    const locations = yield* packPoints(points, origin)
    const packedTypeIndices = yield* packUnsigned(typeIndices)
    return [locations, types, packedTypeIndices]
}

function unpackTypedLocations(text: string, types: string[] | undefined, typeIndices: string | undefined, origin: Vector3): Record<LocationString, string> {
    const result: Record<LocationString, string> = {}
    if (types === undefined || typeIndices === undefined) {
        return result
    }

    const points = unpackPoints(text, origin)
    const indices = unpackUnsigned(typeIndices)
    for (const [i, point] of points.entries()) {
        const typeIndex = indices[i]
        if (typeIndex === undefined) {
            continue
        }
        const type = types[typeIndex]
        if (type !== undefined) {
            result[locationToString(point)] = type.includes(":") ? type : NAMESPACE + type
        }
    }
    return result
}

const STRUCTURE_ROTATIONS: Array<StructureData["rotation"]> = ["north", "east", "south", "west"]

// Returns the packed form, or the plain record when something doesn't fit the packed form (so nothing is ever lost)
function* compressStructures(structures: Record<LocationString, StructureData>, origin: Vector3): Generator<void, CompressedStructures, void> {
    const entries: Array<{ point: Vector3, type: string, rotation: number }> = []
    const keys = Object.keys(structures) as LocationString[]
    for (let i = 0; i < keys.length; i++) {
        const key = arrayItem(keys, i)
        const structure = structures[key]
        if (structure === undefined) {
            continue
        }

        const rotation = STRUCTURE_ROTATIONS.indexOf(structure.rotation)
        const point = stringToLocation(key)
        if (rotation === -1 || Object.keys(structure).length !== 2 || locationToString(point) !== key) {
            return structures
        }
        entries.push({ point, type: structure.type, rotation })
        if (yieldAfterBatch(i)) {
            yield
        }
    }

    if (entries.length === 0) {
        return undefined
    }
    yield* sortInTicks(entries, (a, b) => comparePoints(a.point, b.point))

    const types: string[] = []
    const typeIndexByType = new Map<string, number>()
    const indices: number[] = []
    for (let i = 0; i < entries.length; i++) {
        const entry = arrayItem(entries, i)
        let typeIndex = typeIndexByType.get(entry.type)
        if (typeIndex === undefined) {
            typeIndex = types.length
            types.push(entry.type)
            typeIndexByType.set(entry.type, typeIndex)
        }
        indices.push((typeIndex * STRUCTURE_ROTATIONS.length) + entry.rotation)
        if (yieldAfterBatch(i)) {
            yield
        }
    }

    const points: Vector3[] = new Array(entries.length)
    for (let i = 0; i < entries.length; i++) {
        points[i] = arrayItem(entries, i).point
        if (yieldAfterBatch(i)) {
            yield
        }
    }
    const locations = yield* packPoints(points, origin)
    const packedIndices = yield* packUnsigned(indices)
    return [locations, types, packedIndices]
}

function decompressStructures(packed: PackedStructures, origin: Vector3): Record<LocationString, StructureData> {
    const [packedLocations, types, packedIndices] = packed
    const points = unpackPoints(packedLocations, origin)
    const indices = unpackUnsigned(packedIndices)
    const result: Record<LocationString, StructureData> = {}
    for (const [i, point] of points.entries()) {
        const packedIndex = indices[i]
        if (packedIndex === undefined) {
            continue
        }

        const type = types[Math.floor(packedIndex / STRUCTURE_ROTATIONS.length)]
        const rotation = STRUCTURE_ROTATIONS[packedIndex % STRUCTURE_ROTATIONS.length]
        if (type === undefined || rotation === undefined) {
            continue
        }
        result[locationToString(point)] = { type: type as StructureData["type"], rotation }
    }
    return result
}

function originOf(center: Vector3): Vector3 {
    return { x: Math.floor(center.x), y: Math.floor(center.y), z: Math.floor(center.z) }
}

const NEIGHBOR_OFFSETS: Vector3[] = []
for (let dx = -1; dx <= 1; dx++) {
    for (let dz = -1; dz <= 1; dz++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx !== 0 || dy !== 0 || dz !== 0) {
                NEIGHBOR_OFFSETS.push({ x: dx, y: dy, z: dz })
            }
        }
    }
}
const FORWARD_START = 13
const FORWARD_BITS = NEIGHBOR_OFFSETS.length - FORWARD_START

function offsetIndex(dx: number, dy: number, dz: number) {
    const index = ((dx + 1) * 9) + ((dz + 1) * 3) + (dy + 1)
    return index > 13 ? index - 1 : index
}

function offsetKey(location: Vector3, offset: Vector3) {
    return locationToString({
        x: location.x + offset.x,
        y: location.y + offset.y,
        z: location.z + offset.z
    })
}

interface MaskStreams {
    palette: number[]
    indices: number[]
    estimatedBits: number
}

function* buildMaskStreams(masks: number[]): Generator<void, MaskStreams, void> {
    const maskCounts = new Map<number, number>()
    for (let i = 0; i < masks.length; i++) {
        const mask = arrayItem(masks, i)
        maskCounts.set(mask, (maskCounts.get(mask) ?? 0) + 1)
        if (yieldAfterBatch(i)) {
            yield
        }
    }

    const palette = [...maskCounts.keys()]
    yield* sortInTicks(palette, (mask1, mask2) => {
        const countDifference = (maskCounts.get(mask2) ?? 0) - (maskCounts.get(mask1) ?? 0)

        return countDifference !== 0 ? countDifference : mask1 - mask2
    })

    const paletteIndexByMask = new Map<number, number>()
    for (let i = 0; i < palette.length; i++) {
        const mask = arrayItem(palette, i)
        paletteIndexByMask.set(mask, i)
        if (yieldAfterBatch(i)) {
            yield
        }
    }

    let estimatedBits = palette.length * FORWARD_BITS
    let maskCountIndex = 0
    for (const count of maskCounts.values()) {
        estimatedBits -= count * Math.log2(count / masks.length)
        if (yieldAfterBatch(maskCountIndex++)) {
            yield
        }
    }

    const indices: number[] = new Array(masks.length)
    for (let i = 0; i < masks.length; i++) {
        indices[i] = paletteIndexByMask.get(arrayItem(masks, i)) ?? 0
        if (yieldAfterBatch(i)) {
            yield
        }
    }

    return {
        palette,
        indices,
        estimatedBits
    }
}

// For every node: the forward neighbors that exist as nodes but are not connected to it
function* buildExceptionMasks(nodeLocations: Vector3[], indexByKey: Map<string, number>, connectedMasks: number[]): Generator<void, number[], void> {
    const exceptionMasks: number[] = new Array(nodeLocations.length).fill(0)
    for (let i = 0; i < nodeLocations.length; i++) {
        const location = arrayItem(nodeLocations, i)
        const connected = connectedMasks[i] ?? 0
        let exceptions = 0
        for (let bitIndex = 0; bitIndex < FORWARD_BITS; bitIndex++) {
            const offset = NEIGHBOR_OFFSETS[FORWARD_START + bitIndex]
            if (offset === undefined || (connected & (1 << bitIndex)) !== 0) {
                continue
            }

            if (indexByKey.has(offsetKey(location, offset))) {
                exceptions |= 1 << bitIndex
            }
        }
        exceptionMasks[i] = exceptions
        if (yieldAfterBatch(i)) {
            yield
        }
    }
    return exceptionMasks
}

export function* compressVillage(data: VillageSaveData): Generator<void, CompressedVillage, void> {
    const center = data.center
    const origin = originOf(center)
    const nodeEntries: Array<{ key: LocationString, location: Vector3 }> = []
    if (SAVE_PATH_NODES) {
        const nodeKeys = Object.keys(data.pathNodes) as LocationString[]
        for (let i = 0; i < nodeKeys.length; i++) {
            const key = arrayItem(nodeKeys, i)
            nodeEntries.push({ key, location: stringToLocation(key) })
            if (yieldAfterBatch(i)) {
                yield
            }
        }
    }
    yield* sortInTicks(nodeEntries, (a, b) => comparePoints(a.location, b.location))

    const indexByKey = new Map<string, number>()
    for (let i = 0; i < nodeEntries.length; i++) {
        const entry = arrayItem(nodeEntries, i)
        indexByKey.set(entry.key, i)
        if (yieldAfterBatch(i)) {
            yield
        }
    }
    const forwardMasks: number[] = new Array(nodeEntries.length).fill(0)

    type RequirementGroups = Map<string, {
        whiteList: 0 | 1
        types: string[]
        deltas: number[]
        last: number
    }>

    const requirementGroups: RequirementGroups = new Map()
    const connectionRequirementGroups: RequirementGroups = new Map()
    const costGroups = new Map<number, { deltas: number[], last: number }>()

    function addToRequirementGroup(groups: RequirementGroups, requirement: NodeRequirement, index: number) {
        const types = requirement.types.slice().sort()
        const groupKey = (requirement.whiteList ? "1" : "0") + types.join(",")
        let group = groups.get(groupKey)
        if (group === undefined) {
            group = { whiteList: requirement.whiteList ? 1 : 0, types, deltas: [], last: 0 }
            groups.set(groupKey, group)
        }
        group.deltas.push(index - group.last)
        group.last = index
    }

    function* packRequirementGroups(groups: RequirementGroups): Generator<void, CompressedRequirement[], void> {
        const result: CompressedRequirement[] = []
        let i = 0
        for (const group of groups.values()) {
            result.push([group.whiteList, group.types, yield* packUnsigned(group.deltas)])
            if (yieldAfterBatch(i++)) {
                yield
            }
        }
        return result
    }

    for (let i = 0; i < nodeEntries.length; i++) {
        const { key, location } = arrayItem(nodeEntries, i)
        yield

        const node = data.pathNodes[key]

        if (node === undefined) {
            continue
        }

        const edgeRequirements: Array<[bit: number, requirement: NodeRequirement]> = []

        for (const neighborKey of node.neighbors) {
            const neighborIndex = indexByKey.get(neighborKey)
            const neighborNode = data.pathNodes[neighborKey]
            if (neighborIndex === undefined || neighborNode === undefined) {
                continue
            }
            const neighborEntry = nodeEntries[neighborIndex]
            if (neighborEntry === undefined) {
                continue
            }
            const neighbor = neighborEntry.location
            const dx = neighbor.x - location.x
            const dy = neighbor.y - location.y
            const dz = neighbor.z - location.z
            if (Math.abs(dx) > 1 || Math.abs(dy) > 1 || Math.abs(dz) > 1) {
                continue
            }
            if (dx === 0 && dy === 0 && dz === 0) {
                continue
            }
            const bit = offsetIndex(dx, dy, dz)
            const edgeRequirement = node.nodeRequirements?.[neighborKey]
            if (edgeRequirement !== undefined) {
                edgeRequirements.push([bit, edgeRequirement])
            }
            if (bit >= FORWARD_START) {
                forwardMasks[i] = (forwardMasks[i] ?? 0) | (1 << (bit - FORWARD_START))
            }
            else if (!neighborNode.neighbors.includes(key)) {
                forwardMasks[neighborIndex] = (forwardMasks[neighborIndex] ?? 0) | (1 << (offsetIndex(-dx, -dy, -dz) - FORWARD_START))
            }
        }

        edgeRequirements.sort((a, b) => a[0] - b[0])
        for (const [bit, requirement] of edgeRequirements) {
            addToRequirementGroup(connectionRequirementGroups, requirement, (i * NEIGHBOR_OFFSETS.length) + bit)
        }

        if (node.requirement !== undefined) {
            addToRequirementGroup(requirementGroups, node.requirement, i)
        }
        if (node.cost !== undefined && node.cost !== 0) {
            let costGroup = costGroups.get(node.cost)
            if (costGroup === undefined) {
                costGroup = { deltas: [], last: 0 }
                costGroups.set(node.cost, costGroup)
            }
            costGroup.deltas.push(i - costGroup.last)
            costGroup.last = i
        }
    }

    yield
    const connectedStreams = yield* buildMaskStreams(forwardMasks)
    yield
    const nodeLocations: Vector3[] = new Array(nodeEntries.length)
    for (let i = 0; i < nodeEntries.length; i++) {
        nodeLocations[i] = arrayItem(nodeEntries, i).location
        if (yieldAfterBatch(i)) {
            yield
        }
    }
    const exceptionMasks = yield* buildExceptionMasks(nodeLocations, indexByKey, forwardMasks)
    const exceptionStreams = yield* buildMaskStreams(exceptionMasks)
    const useExceptions = exceptionStreams.estimatedBits < connectedStreams.estimatedBits
    const maskStreams = useExceptions ? exceptionStreams : connectedStreams

    const nodeRequirements = yield* packRequirementGroups(requirementGroups)
    const connectionRequirements = yield* packRequirementGroups(connectionRequirementGroups)

    const nodeCosts: CompressedCost[] = []
    let costGroupIndex = 0
    for (const [cost, costGroup] of costGroups) {
        nodeCosts.push([cost, yield* packUnsigned(costGroup.deltas)])
        if (yieldAfterBatch(costGroupIndex++)) {
            yield
        }
    }

    const [packedPlantLocations, plantTypes, plantTypeIndices] = SAVE_RESOURCE_LOCATIONS
        ? yield* packTypedLocations(data.plantLocations, origin)
        : ["", [], ""]

    const packedSugarCaneLocations = SAVE_RESOURCE_LOCATIONS ? yield* packLocations(data.sugarCaneLocations, origin) : ""
    const packedSaplingLocations = SAVE_RESOURCE_LOCATIONS ? yield* packLocations(data.saplingLocations, origin) : ""
    const packedFarmLocations = SAVE_RESOURCE_LOCATIONS ? yield* packLocations(data.farmLocations, origin) : ""
    const packedTreeLocations = SAVE_RESOURCE_LOCATIONS ? yield* packLocations(data.treeLocations, origin) : ""
    const packedHarvestLocations = SAVE_RESOURCE_LOCATIONS && SAVE_DERIVED_LOCATIONS ? yield* packLocations(data.harvestLocations, origin) : ""
    const packedGrowLocations = SAVE_RESOURCE_LOCATIONS && SAVE_DERIVED_LOCATIONS ? yield* packLocations(data.growLocations, origin) : ""
    const packedSweetBerryLocations = SAVE_RESOURCE_LOCATIONS ? yield* packLocations(data.sweetBerryLocations, origin) : ""
    const packedTillLocations = SAVE_RESOURCE_LOCATIONS && SAVE_DERIVED_LOCATIONS ? yield* packLocations(data.tillLocations, origin) : ""
    const packedOreLocations = SAVE_RESOURCE_LOCATIONS ? yield* packLocations(data.oreLocations, origin) : ""
    const packedNodeLocations = yield* packPoints(nodeLocations, origin)

    const packedMaskPalette = yield* packUnsigned(maskStreams.palette)
    const packedMaskIndices = yield* packUnsigned(maskStreams.indices)
    const packedStructures = yield* compressStructures(data.structures, origin)

    const dimensionId = data.dimensionId
    const door = data.doorLocation
    return [
        dimensionId.startsWith(NAMESPACE) ? dimensionId.slice(NAMESPACE.length) : dimensionId,
        [center.x, center.y, center.z],
        [door.x - origin.x, door.y - origin.y, door.z - origin.z],
        packedSugarCaneLocations,
        packedSaplingLocations,
        packedFarmLocations,
        packedTreeLocations,
        packedHarvestLocations,
        packedSweetBerryLocations,
        packedTillLocations,
        packedPlantLocations,
        packedNodeLocations,
        packedMaskPalette,
        packedMaskIndices,
        nodeRequirements,
        plantTypes,
        plantTypeIndices,
        packedStructures,
        nodeCosts,
        connectionRequirements,
        useExceptions ? 1 : undefined,
        packedOreLocations,
        packedGrowLocations
    ]
}

export function decompressVillage(compressed: unknown): VillageSaveData | undefined {
    if (!isDecompressibleVillage(compressed)) {
        return undefined
    }

    const [
        dimensionId,
        centerCoords,
        doorOffset,
        packedSugarCaneLocations = "",
        packedSaplingLocations = "",
        packedFarmLocations = "",
        packedTreeLocations = "",
        packedHarvestLocations = "",
        packedSweetBerryLocations = "",
        packedTillLocations = "",
        packedPlantLocations = "",
        packedNodeLocations = "",
        packedMaskPalette = "",
        packedMaskIndices = "",
        compressedRequirements = [],
        plantTypes,
        plantTypeIndices,
        structures,
        compressedNodeCosts,
        compressedConnectionRequirements,
        edgeMode,
        packedOreLocations,
        packedGrowLocations = ""
    ] = compressed

    const center: Vector3 = { x: centerCoords[0], y: centerCoords[1], z: centerCoords[2] }
    const origin = originOf(center)

    const nodePoints = unpackPoints(packedNodeLocations, origin)
    const nodeKeys = nodePoints.map(point => locationToString(point))
    const pathNodes: Record<string, PathNode> = {}

    for (const key of nodeKeys) {
        pathNodes[key] = { neighbors: [] }
    }

    function nodeAt(nodeIndex: number): PathNode | undefined {
        const key = nodeKeys[nodeIndex]
        return key === undefined ? undefined : pathNodes[key]
    }

    const maskPalette = unpackUnsigned(packedMaskPalette)
    const maskPaletteIndices = unpackUnsigned(packedMaskIndices)
    const masksListExceptions = edgeMode === 1

    for (const [nodeIndex, point] of nodePoints.entries()) {
        const paletteIndex = maskPaletteIndices[nodeIndex]
        if (paletteIndex === undefined) {
            continue
        }

        const neighborMask = maskPalette[paletteIndex]
        if (neighborMask === undefined) {
            continue
        }

        const currentKey = nodeKeys[nodeIndex]
        if (currentKey === undefined) {
            continue
        }

        const currentNode = pathNodes[currentKey]
        if (currentNode === undefined) {
            continue
        }

        for (let bitIndex = 0; bitIndex < FORWARD_BITS; bitIndex++) {
            // Normally a set bit means connected; in exception mode a set bit means "adjacent but not connected"
            if (((neighborMask & (1 << bitIndex)) !== 0) === masksListExceptions) {
                continue
            }

            const offset = NEIGHBOR_OFFSETS[FORWARD_START + bitIndex]
            if (offset === undefined) {
                continue
            }

            const neighborKey = offsetKey(point, offset)
            const neighborNode = pathNodes[neighborKey]
            if (neighborNode === undefined) {
                continue
            }

            currentNode.neighbors.push(neighborKey)
            neighborNode.neighbors.push(currentKey)
        }
    }

    function applyCompressedRequirements(groups: CompressedRequirement[]) {
        for (const [whiteListFlag, requiredTypes, packedIndexDeltas] of groups) {
            const indexDeltas = unpackUnsigned(packedIndexDeltas)
            let nodeIndex = 0

            for (const delta of indexDeltas) {
                nodeIndex += delta
                const node = nodeAt(nodeIndex)
                if (node !== undefined) {
                    node.requirement = {
                        whiteList: whiteListFlag === 1,
                        types: requiredTypes.slice()
                    }
                }
            }
        }
    }

    applyCompressedRequirements(compressedRequirements)

    for (const [whiteListFlag, requiredTypes, packedEdgeDeltas] of compressedConnectionRequirements ?? []) {
        let edgeId = 0
        for (const delta of unpackUnsigned(packedEdgeDeltas)) {
            edgeId += delta
            const nodeIndex = Math.floor(edgeId / NEIGHBOR_OFFSETS.length)
            const offset = NEIGHBOR_OFFSETS[edgeId % NEIGHBOR_OFFSETS.length]
            const point = nodePoints[nodeIndex]
            const node = nodeAt(nodeIndex)
            if (node === undefined || point === undefined || offset === undefined) {
                continue
            }
            const neighborKey = offsetKey(point, offset)
            if (!node.neighbors.includes(neighborKey)) {
                continue
            }
            node.nodeRequirements ??= {}
            node.nodeRequirements[neighborKey] = {
                whiteList: whiteListFlag === 1,
                types: requiredTypes.slice()
            }
        }
    }

    for (const [cost, packedIndexDeltas] of compressedNodeCosts ?? []) {
        let nodeIndex = 0
        for (const delta of unpackUnsigned(packedIndexDeltas)) {
            nodeIndex += delta
            const node = nodeAt(nodeIndex)
            if (node !== undefined) {
                node.cost = cost
            }
        }
    }

    return {
        dimensionId: dimensionId.includes(":") ? dimensionId : NAMESPACE + dimensionId,
        center,
        doorLocation: {
            x: doorOffset[0] + origin.x,
            y: doorOffset[1] + origin.y,
            z: doorOffset[2] + origin.z
        },
        pathNodes,
        sugarCaneLocations: unpackLocations(packedSugarCaneLocations, origin),
        saplingLocations: unpackLocations(packedSaplingLocations, origin),
        farmLocations: unpackLocations(packedFarmLocations, origin),
        treeLocations: unpackLocations(packedTreeLocations, origin),
        oreLocations: unpackLocations(packedOreLocations ?? "", origin),
        harvestLocations: unpackLocations(packedHarvestLocations, origin),
        growLocations: unpackLocations(packedGrowLocations, origin),
        sweetBerryLocations: unpackLocations(packedSweetBerryLocations, origin),
        plantLocations: unpackTypedLocations(packedPlantLocations, plantTypes, plantTypeIndices, origin),
        tillLocations: unpackLocations(packedTillLocations, origin),
        structures: Array.isArray(structures) ? decompressStructures(structures, origin) : structures ?? {}
    }
}
