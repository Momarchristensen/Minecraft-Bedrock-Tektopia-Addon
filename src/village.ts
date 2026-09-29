import {
    Block,
    Dimension,
    system,
    Vector3,
    World,
    world
} from "@minecraft/server"

import {
    centerVector,
    randomItem,
    stringToVector,
    vectorToString
} from "./utils"

import {
    PathNode,
    VillageBounds
} from "."

import { minecraftDirtTypes } from "./variables"

import { Registry } from "./registry"

/**
 * Set to false to leave path nodes out of the save. The 100 tick door scan
 * (searchBlocks with overwrite) rebuilds them after load, but villagers have
 * no paths until it finishes and unloaded chunks can't be scanned.
 */
const SAVE_PATH_NODES = true

/**
 * Set to false to leave the farm / sugar cane / sapling / tree lists out of
 * the save. scanVillageBlocks finds them again, but only by flooding outward
 * from resources it has already found, so recovery is slower and patchier.
 */
const SAVE_RESOURCE_LOCATIONS = true

const NAMESPACE = "minecraft:"

type Triple = [number, number, number]

export type CompressedRequirement = [
    whiteList: 0 | 1,
    types: string[],
    nodeIndexDeltas: string
]

/**
 * Saved as a tuple so no key names end up in the JSON.
 * Every string field is either a packed number list or packed points, see the
 * codec section below.
 */
export type CompressedVillage = [
    dimensionId: string,
    center: Triple,
    doorLocation: Triple,
    sugarCaneLocations: string,
    saplingLocations: string,
    farmLocations: string,
    treeLocations: string,
    nodeLocations: string,
    neighborMaskPalette: string,
    neighborMaskIndices: string,
    nodeRequirements: CompressedRequirement[]
]

// ---------------------------------------------------------------------------
// Number codec
//
// Every number becomes a run of characters from a 64 character alphabet that is
// safe inside JSON. Each character holds 5 bits of the number and 1 bit that
// says "more characters follow" (indexes 32 to 63). The low bits come first.
// 0 to 31 take one character, 32 to 1023 take two. Signed numbers are zigzag
// encoded first, so -16 to 15 take one character.
// ---------------------------------------------------------------------------

const DIGITS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
const DIGIT_VALUES: Record<string, number> = {}
for (let i = 0; i < DIGITS.length; i++) {
    DIGIT_VALUES[DIGITS[i]] = i
}

function packUnsigned(values: number[]): string {
    let result = ""
    for (let i = 0; i < values.length; i++) {
        let value = values[i]
        while (value >= 32) {
            result += DIGITS[value % 32 + 32]
            value = Math.floor(value / 32)
        }
        result += DIGITS[value]
    }
    return result
}

function unpackUnsigned(text: string): number[] {
    const result: number[] = []
    let value = 0
    let scale = 1
    for (let i = 0; i < text.length; i++) {
        const digit = DIGIT_VALUES[text[i]]
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
    return value >= 0 ? value * 2 : -value * 2 - 1
}

function unzigzag(value: number) {
    return value % 2 === 0 ? value / 2 : -(value + 1) / 2
}

function packSigned(values: number[]): string {
    return packUnsigned(values.map((value) => zigzag(value)))
}

function unpackSigned(text: string): number[] {
    return unpackUnsigned(text).map((value) => unzigzag(value))
}

// ---------------------------------------------------------------------------
// Point lists
//
// Points are sorted by x, then z, then y, and stored as three separate columns
// of deltas ("dx.dz.dy"). Sorted data gives mostly 0s and 1s, and keeping each
// axis in its own run gives LZString long repeats to work with. The first point
// is relative to the origin.
// ---------------------------------------------------------------------------

function comparePoints(a: Vector3, b: Vector3) {
    return a.x - b.x || a.z - b.z || a.y - b.y
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
    for (let i = 0; i < sortedPoints.length; i++) {
        const point = sortedPoints[i]
        dx[i] = point.x - px
        dy[i] = point.y - py
        dz[i] = point.z - pz
        px = point.x
        py = point.y
        pz = point.z
    }
    return packSigned(dx) + "." + packSigned(dz) + "." + packSigned(dy)
}

function unpackPoints(text: string, origin: Vector3): Vector3[] {
    if (text === "") {
        return []
    }
    const [xText, zText, yText] = text.split(".")
    const dx = unpackSigned(xText)
    const dz = unpackSigned(zText)
    const dy = unpackSigned(yText)
    const points: Vector3[] = new Array(dx.length)
    let x = origin.x
    let y = origin.y
    let z = origin.z
    for (let i = 0; i < dx.length; i++) {
        x += dx[i]
        y += dy[i]
        z += dz[i]
        points[i] = { x, y, z }
    }
    return points
}

function packLocations(locationList: string[], origin: Vector3): string {
    const points = locationList.map((location) => stringToVector(location))
    points.sort(comparePoints)
    return packPoints(points, origin)
}

function unpackLocations(text: string, origin: Vector3): string[] {
    return unpackPoints(text, origin).map((point) => vectorToString(point))
}

// The village center is a block center (x.5), so deltas are taken from the
// block it sits in to keep every stored number an integer.
function originOf(center: Vector3): Vector3 {
    return { x: Math.floor(center.x), y: Math.floor(center.y), z: Math.floor(center.z) }
}

// ---------------------------------------------------------------------------
// Neighbor links
//
// A neighbor is always within 1 block on every axis, which gives 26 possible
// offsets. They are listed in the same x, z, y order the nodes are sorted in,
// so the first 13 point at nodes that come earlier ("backward") and the last 13
// at nodes that come later ("forward").
//
// Every link is stored once, as a forward bit on the earlier of its two nodes.
// Links are always symmetric when loaded: a link listed by only one of its two
// nodes is restored on both, and links to nodes that no longer exist or to
// the node itself are dropped.
// ---------------------------------------------------------------------------

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
    const index = (dx + 1) * 9 + (dz + 1) * 3 + (dy + 1)
    return index > 13 ? index - 1 : index
}

function offsetKey(location: Vector3, offset: Vector3) {
    return vectorToString({
        x: location.x + offset.x,
        y: location.y + offset.y,
        z: location.z + offset.z
    })
}

export const VILLAGE_RADIUS = 100

export interface VillageSaveData {
    center: Vector3
    dimensionId: string
    doorLocation: Vector3
    pathNodes: Record<string, PathNode>
    sugarCaneLocations: string[]
    saplingLocations: string[]
    farmLocations: string[]
    treeLocations: string[]
}

export class Village {
    private static cache = new WeakMap<VillageSaveData, Village>()

    readonly center: Vector3
    readonly centerString: string
    readonly bounds: VillageBounds

    searchingBlocks = false
    deletingInvalidNodes = false

    private constructor(readonly data: VillageSaveData) {
        this.center = data.center
        this.centerString = vectorToString(data.center)
        this.bounds = {
            start: { x: data.center.x - VILLAGE_RADIUS, y: -64, z: data.center.z - VILLAGE_RADIUS },
            end: { x: data.center.x + VILLAGE_RADIUS, y: 320, z: data.center.z + VILLAGE_RADIUS }
        }
    }

    static from(data: VillageSaveData): Village {
        let village = Village.cache.get(data)
        if (!village) {
            village = new Village(data)
            Village.cache.set(data, village)
        }
        return village
    }

    static createData(center: Vector3, dimensionId: string, doorLocation: Vector3): VillageSaveData {
        return {
            center,
            dimensionId,
            doorLocation,
            pathNodes: {},
            sugarCaneLocations: [],
            saplingLocations: [],
            farmLocations: [],
            treeLocations: []
        }
    }

    static compress(data: VillageSaveData): CompressedVillage {
        const center = data.center
        const origin = originOf(center)
        const nodeEntries = SAVE_PATH_NODES ? Object.keys(data.pathNodes).map((key) => ({ key, location: stringToVector(key) })) : []
        nodeEntries.sort((a, b) => comparePoints(a.location, b.location))

        const indexByKey = new Map<string, number>()
        for (let i = 0; i < nodeEntries.length; i++) {
            indexByKey.set(nodeEntries[i].key, i)
        }
        const forwardMasks: number[] = new Array(nodeEntries.length).fill(0)

        const requirementGroups = new Map<string, {
            whiteList: 0 | 1
            types: string[]
            deltas: number[]
            last: number
        }>()

        for (let i = 0; i < nodeEntries.length; i++) {
            const { key, location } = nodeEntries[i]
            const node = data.pathNodes[key]

            for (let j = 0; j < node.neighbors.length; j++) {
                const neighborKey = node.neighbors[j]
                const neighborIndex = indexByKey.get(neighborKey)
                if (neighborIndex === undefined) {
                    continue
                }
                const neighbor = nodeEntries[neighborIndex].location
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
                if (bit >= FORWARD_START) {
                    forwardMasks[i] |= 1 << bit - FORWARD_START
                }
                else if (!data.pathNodes[neighborKey].neighbors.includes(key)) {
                    // Only this node lists the link, so record it on the earlier node
                    forwardMasks[neighborIndex] |= 1 << offsetIndex(-dx, -dy, -dz) - FORWARD_START
                }
            }

            const requirement = node.requirement
            if (requirement !== undefined) {
                const types = requirement.types.slice().sort()
                const groupKey = (requirement.whiteList ? "1" : "0") + types.join(",")
                let group = requirementGroups.get(groupKey)
                if (group === undefined) {
                    group = { whiteList: requirement.whiteList ? 1 : 0, types, deltas: [], last: 0 }
                    requirementGroups.set(groupKey, group)
                }
                group.deltas.push(i - group.last)
                group.last = i
            }
        }


        const maskCounts = new Map<number, number>()
        for (let i = 0; i < forwardMasks.length; i++) {
            maskCounts.set(forwardMasks[i], (maskCounts.get(forwardMasks[i]) ?? 0) + 1)
        }
        const palette = [...maskCounts.keys()].sort(
            (a, b) => maskCounts.get(b)! - maskCounts.get(a)! || a - b
        )
        const paletteIndexByMask = new Map<number, number>()
        for (let i = 0; i < palette.length; i++) {
            paletteIndexByMask.set(palette[i], i)
        }
        const maskIndices = forwardMasks.map((mask) => paletteIndexByMask.get(mask)!)

        const nodeRequirements: CompressedRequirement[] = []
        for (const group of requirementGroups.values()) {
            nodeRequirements.push([group.whiteList, group.types, packUnsigned(group.deltas)])
        }

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
            packPoints(nodeEntries.map((entry) => entry.location), origin),
            packUnsigned(palette),
            packUnsigned(maskIndices),
            nodeRequirements
        ]
    }

    static decompress(compressed: CompressedVillage): VillageSaveData {
        const [
            dimensionId,
            centerTriple,
            doorTriple,
            sugarCaneText,
            saplingText,
            farmText,
            treeText,
            nodeText,
            paletteText,
            maskIndexText
        ] = compressed
        // Saves from before the one way list was removed have an extra element before
        // the requirements, so read the requirements from the end.
        const nodeRequirements = compressed[compressed.length - 1] as CompressedRequirement[]

        const center: Vector3 = { x: centerTriple[0], y: centerTriple[1], z: centerTriple[2] }
        const origin = originOf(center)

        const points = unpackPoints(nodeText, origin)
        const keys = points.map((point) => vectorToString(point))
        const pathNodes: Record<string, PathNode> = {}
        for (let i = 0; i < keys.length; i++) {
            pathNodes[keys[i]] = { neighbors: [] }
        }

        // Links stored once: add them to both nodes
        const palette = unpackUnsigned(paletteText)
        const maskIndices = unpackUnsigned(maskIndexText)
        for (let i = 0; i < points.length; i++) {
            const mask = palette[maskIndices[i]]
            if (!mask) {
                continue
            }
            const node = pathNodes[keys[i]]
            for (let bit = 0; bit < 13; bit++) {
                if (!(mask & 1 << bit)) {
                    continue
                }
                const neighborKey = offsetKey(points[i], NEIGHBOR_OFFSETS[FORWARD_START + bit])
                const neighborNode = pathNodes[neighborKey]
                if (neighborNode === undefined) {
                    continue
                }
                node.neighbors.push(neighborKey)
                neighborNode.neighbors.push(keys[i])
            }
        }

        for (let i = 0; i < nodeRequirements.length; i++) {
            const [whiteList, types, deltaText] = nodeRequirements[i]
            const deltas = unpackUnsigned(deltaText)
            let index = 0
            for (let j = 0; j < deltas.length; j++) {
                index += deltas[j]
                const node = pathNodes[keys[index]]
                if (node !== undefined) {
                    node.requirement = { whiteList: whiteList === 1, types: types.slice() }
                }
            }
        }

        return {
            dimensionId: dimensionId.includes(":") ? dimensionId : NAMESPACE + dimensionId,
            center,
            doorLocation: {
                x: doorTriple[0] + origin.x,
                y: doorTriple[1] + origin.y,
                z: doorTriple[2] + origin.z
            },
            pathNodes,
            sugarCaneLocations: unpackLocations(sugarCaneText, origin),
            saplingLocations: unpackLocations(saplingText, origin),
            farmLocations: unpackLocations(farmText, origin),
            treeLocations: unpackLocations(treeText, origin)
        }

    }

    get dimensionId() {
        return this.data.dimensionId
    }
    get doorLocation() {
        return this.data.doorLocation
    }
    get pathNodes() {
        return this.data.pathNodes
    }
    get sugarCaneLocations() {
        return this.data.sugarCaneLocations
    }
    get saplingLocations() {
        return this.data.saplingLocations
    }
    get farmLocations() {
        return this.data.farmLocations
    }
    get treeLocations() {
        return this.data.treeLocations
    }

    get dimension(): Dimension {
        return world.getDimension(this.data.dimensionId)
    }

    get isValid() {
        return world.villageList.includes(this.data)
    }

    public link(aKey: string, bKey: string) {
        const village = this
        if (aKey === bKey) {
            return
        }
        const node1 = village.pathNodes[aKey]
        const node2 = village.pathNodes[bKey]
        if (!node1 || !node2) {
            return
        }
        if (!node1.neighbors.includes(bKey)) {
            node1.neighbors.push(bKey)
        }
        if (!node2.neighbors.includes(aKey)) {
            node2.neighbors.push(aKey)
        }
    }

    public unlink(aKey: string, bKey: string) {
        const village = this
        const node1 = village.pathNodes[aKey]
        const node2 = village.pathNodes[bKey]
        if (node1) {
            node1.neighbors = node1.neighbors.filter((k) => k !== bKey)
        }
        if (node2) {
            node2.neighbors = node2.neighbors.filter((k) => k !== aKey)
        }
    }

    public removeNode(key: string) {
        const village = this
        const node = village.pathNodes[key]
        if (!node) {
            return
        }
        for (const neighborKey of [...node.neighbors]) {
            this.unlink(key, neighborKey)
        }
        delete village.pathNodes[key]
    }
}

export interface VillageExtraData {
    searchingBlocks: boolean
    deletingInvalidNodes?: boolean
}



World.prototype.getVillages = function () {
    return this.villageList.map((data) => Village.from(data))
}


export function blockIsTree(block: Block) {
    const aboveBlock = block.aboveSafe()
    if (!Registry.logTypes.includesFast(block.typeId)) {
        return false
    }
    if (aboveBlock === undefined || aboveBlock.typeId !== block.typeId) {
        return false
    }
    const aboveAboveBlock = aboveBlock.aboveSafe()
    if (aboveAboveBlock === undefined || aboveAboveBlock.typeId !== block.typeId) {
        return false
    }
    const belowBlock = block.belowSafe()
    if (belowBlock === undefined || !minecraftDirtTypes.includesFast(belowBlock.typeId)) {
        return false
    }
    return true
}


function tickScanVillage() {
    system.runJob(scanVillageBlocks(tickScanVillage))
}

system.run(tickScanVillage)
function* scanVillageBlocks(callback: () => void) {
    try {
        if (!world.loadedData) {
            return
        }
        const villageList = world.getVillages()
        for (const village of villageList) {
            const locationString = randomItem(Object.keys(village.pathNodes))
            const locationStringList = [locationString]
            const alreadyCheckedLocations = new Set()
            while (locationStringList.length) {
                const locationString = locationStringList.pop()
                if (alreadyCheckedLocations.has(locationString) || locationString === undefined) {
                    continue
                }
                alreadyCheckedLocations.add(locationString)
                const node = village.pathNodes[locationString]
                const location = stringToVector(locationString)
                const dimension = world.getDimension(village.dimensionId)
                const block = dimension.getBlockSafe(location)
                if (block === undefined || node === undefined) {
                    continue
                }
                try {
                    dimension.spawnParticle(
                        "minecraft:basic_flame_particle",
                        centerVector(block)
                    )
                }
                catch { }
                try {
                    const checkBlockList = [
                        block,
                        block.northSafe(),
                        block.eastSafe(),
                        block.southSafe(),
                        block.westSafe(),
                        block.belowSafe()
                    ]
                    for (let i = 0; i < checkBlockList.length; i++) {
                        const checkBlock = checkBlockList[i]
                        if (checkBlock === undefined) {
                            continue
                        }
                        let checkNearbyNodes = false
                        const checkBlockString = vectorToString(checkBlock)
                        if (blockIsFarm(checkBlock)) {
                            checkNearbyNodes = true
                            if (!village.farmLocations.includes(checkBlockString)) {
                                village.farmLocations.push(checkBlockString)
                            }
                        }
                        else if (checkBlock.typeId === "minecraft:reeds") {
                            checkNearbyNodes = true
                            if (!village.sugarCaneLocations.includes(checkBlockString)) {
                                village.sugarCaneLocations.push(checkBlockString)
                            }
                        }
                        else if (Registry.saplingTypes.includesFast(checkBlock.typeId)) {
                            checkNearbyNodes = true
                            if (!village.saplingLocations.includes(checkBlockString)) {
                                village.saplingLocations.push(checkBlockString)
                            }
                        }
                        else if (blockIsTree(checkBlock)) {
                            checkNearbyNodes = true
                            if (!village.treeLocations.includes(checkBlockString)) {
                                village.treeLocations.push(checkBlockString)
                            }
                        }
                        if (checkNearbyNodes) {
                            locationStringList.push(...node.neighbors)
                        }
                    }
                }
                catch { }

                yield
            }

            yield
        }
    }
    finally {
        if (callback) {
            callback()
        }
    }
}


function blockIsFarm(block: Block): boolean {
    const blockAbove = block.aboveSafe()
    if (blockAbove === undefined) {
        return false
    }
    const blockAboveAbove = blockAbove.aboveSafe()
    if (blockAboveAbove === undefined) {
        return false
    }
    return block.typeId === "minecraft:farmland" && blockAbove.isAir && blockAboveAbove.isAir
}