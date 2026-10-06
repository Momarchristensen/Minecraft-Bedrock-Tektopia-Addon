import {
    stringToLocation,
    locationToString
} from "./utils"

import type {
    NodeRequirement,
    PathNode,
    LocationString
} from "./minecraft_extensions"

import type { StructureData } from "./structure"

import type { VillageSaveData } from "./village"

import type { Vector3 } from "@minecraft/server"

const SAVE_PATH_NODES: boolean = true

const SAVE_RESOURCE_LOCATIONS: boolean = true

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

export type CompressedVillage = [
    dimensionId: string,
    center: Triple,
    doorLocation: Triple,
    sugarCaneLocations: string,
    saplingLocations: string,
    farmLocations: string,
    treeLocations: string,
    harvestLocations: string,
    sweetBerryLocations: string,
    tillLocations: string,
    plantLocations: string,
    nodeLocations: string,
    neighborMaskPalette: string,
    neighborMaskIndices: string,
    nodeRequirements: CompressedRequirement[],
    plantTypes: string[] | undefined,
    plantTypeIndices: string | undefined,
    legacyStepRequirements: unknown, // no longer used: per-node step requirements were replaced by connectionRequirements
    structures: Record<LocationString, StructureData> | undefined,
    nodeCosts: CompressedCost[] | undefined,
    connectionRequirements: CompressedRequirement[] | undefined // indices are edge ids: (nodeIndex * 26) + offsetIndex to the neighbor
]

const DIGITS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
const DIGIT_VALUES: Record<string, number> = {}
for (let i = 0; i < DIGITS.length; i++) {
    DIGIT_VALUES[DIGITS.charAt(i)] = i
}

function packUnsigned(values: number[]): string {
    let result = ""
    for (let value of values) {
        while (value >= 32) {
            result += DIGITS.charAt((value % 32) + 32)
            value = Math.floor(value / 32)
        }
        result += DIGITS.charAt(value)
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

function packSigned(values: number[]): string {
    return packUnsigned(values.map(value => zigzag(value)))
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

function packPoints(sortedPoints: Vector3[], origin: Vector3): string {
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
    }
    return `${packSigned(dx)}.${packSigned(dz)}.${packSigned(dy)}`
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

function packLocations(locationList: LocationString[], origin: Vector3): string {
    const points = locationList.map(location => stringToLocation(location))
    points.sort(comparePoints)
    return packPoints(points, origin)
}

function unpackLocations(text: string, origin: Vector3): LocationString[] {
    return unpackPoints(text, origin).map(point => locationToString(point))
}

function packTypedLocations(locationRecord: Record<LocationString, string>, origin: Vector3): [locations: string, types: string[], typeIndices: string] {
    const entries: Array<{ point: Vector3, type: string }> = []
    for (const key of Object.keys(locationRecord) as LocationString[]) {
        const type = locationRecord[key]
        if (type === undefined) {
            continue
        }
        entries.push({ point: stringToLocation(key), type })
    }
    entries.sort((a, b) => comparePoints(a.point, b.point))

    const types: string[] = []
    const typeIndexByType = new Map<string, number>()
    const typeIndices: number[] = []
    for (const entry of entries) {
        let typeIndex = typeIndexByType.get(entry.type)
        if (typeIndex === undefined) {
            typeIndex = types.length
            types.push(entry.type)
            typeIndexByType.set(entry.type, typeIndex)
        }
        typeIndices.push(typeIndex)
    }

    return [packPoints(entries.map(entry => entry.point), origin), types, packUnsigned(typeIndices)]
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
            result[locationToString(point)] = type
        }
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

export function compressVillage(data: VillageSaveData): CompressedVillage {
    const center = data.center
    const origin = originOf(center)
    const nodeEntries = SAVE_PATH_NODES ? (Object.keys(data.pathNodes) as LocationString[]).map(key => ({ key, location: stringToLocation(key) })) : []
    nodeEntries.sort((a, b) => comparePoints(a.location, b.location))

    const indexByKey = new Map<string, number>()
    for (const [i, entry] of nodeEntries.entries()) {
        indexByKey.set(entry.key, i)
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

    function packRequirementGroups(groups: RequirementGroups) {
        const result: CompressedRequirement[] = []
        for (const group of groups.values()) {
            result.push([group.whiteList, group.types, packUnsigned(group.deltas)])
        }
        return result
    }

    for (const [i, { key, location }] of nodeEntries.entries()) {
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

    const maskCounts = new Map<number, number>()
    for (const mask of forwardMasks) {
        maskCounts.set(mask, (maskCounts.get(mask) ?? 0) + 1)
    }

    const palette = [...maskCounts.keys()].sort((mask1, mask2) => {
        const countDifference = (maskCounts.get(mask2) ?? 0) - (maskCounts.get(mask1) ?? 0)

        return countDifference !== 0 ? countDifference : mask1 - mask2
    })

    const paletteIndexByMask = new Map<number, number>()
    for (const [i, mask] of palette.entries()) {
        paletteIndexByMask.set(mask, i)
    }
    const maskIndices = forwardMasks.map(mask => paletteIndexByMask.get(mask) ?? 0)

    const nodeRequirements = packRequirementGroups(requirementGroups)
    const connectionRequirements = packRequirementGroups(connectionRequirementGroups)

    const nodeCosts: CompressedCost[] = []
    for (const [cost, costGroup] of costGroups) {
        nodeCosts.push([cost, packUnsigned(costGroup.deltas)])
    }

    const [packedPlantLocations, plantTypes, plantTypeIndices]: ReturnType<typeof packTypedLocations> = SAVE_RESOURCE_LOCATIONS ? packTypedLocations(data.plantLocations, origin) : ["", [], ""]

    const dimensionId = data.dimensionId
    const door = data.doorLocation
    return [
        dimensionId.startsWith(NAMESPACE) ? dimensionId.slice(NAMESPACE.length) : dimensionId,
        [center.x, center.y, center.z],
        [door.x - origin.x, door.y - origin.y, door.z - origin.z],
        SAVE_RESOURCE_LOCATIONS ? packLocations(data.sugarCaneLocations, origin) : "",
        SAVE_RESOURCE_LOCATIONS ? packLocations(data.saplingLocations, origin) : "",
        SAVE_RESOURCE_LOCATIONS ? packLocations(data.farmLocations, origin) : "",
        SAVE_RESOURCE_LOCATIONS ? packLocations(data.treeLocations, origin) : "",
        SAVE_RESOURCE_LOCATIONS ? packLocations(data.harvestLocations, origin) : "",
        SAVE_RESOURCE_LOCATIONS ? packLocations(data.sweetBerryLocations, origin) : "",
        SAVE_RESOURCE_LOCATIONS ? packLocations(data.tillLocations, origin) : "",
        packedPlantLocations,
        packPoints(nodeEntries.map(entry => entry.location), origin),
        packUnsigned(palette),
        packUnsigned(maskIndices),
        nodeRequirements,
        plantTypes,
        plantTypeIndices,
        undefined,
        data.structures,
        nodeCosts,
        connectionRequirements
    ]
}

export function decompressVillage(compressed: CompressedVillage): VillageSaveData {
    const [
        dimensionId,
        centerCoords,
        doorOffset,
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
        compressedRequirements,
        plantTypes,
        plantTypeIndices,
        legacyStepRequirements,
        structures,
        compressedNodeCosts,
        compressedConnectionRequirements
    ] = compressed
    void legacyStepRequirements

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

        for (let bitIndex = 0; bitIndex < 13; bitIndex++) {
            if ((neighborMask & (1 << bitIndex)) === 0) {
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
        harvestLocations: unpackLocations(packedHarvestLocations, origin),
        sweetBerryLocations: unpackLocations(packedSweetBerryLocations, origin),
        plantLocations: unpackTypedLocations(packedPlantLocations, plantTypes, plantTypeIndices, origin),
        tillLocations: unpackLocations(packedTillLocations, origin),
        structures: structures ?? {}
    }
}
