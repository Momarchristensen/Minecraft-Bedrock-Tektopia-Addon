import { stringToLocation } from "./utils"

import type {
    LocationString,
    NodeRequirement,
    PathNode
} from "./minecraft_extensions"

import type { Vector3 } from "@minecraft/server"

export const MAX_DEGREE = 26 // getNodeNeighbors never yields more than 18; lower this to save ~25% memory

type NumericArray = Int32Array | Float32Array | Float64Array | Uint8Array

function resized<T extends NumericArray>(array: T, length: number): T {
    const result = new (array.constructor as new (size: number) => T)(length)
    result.set(array)
    return result
}

export class IntHeap {
    keys = new Float64Array(1024)
    values = new Int32Array(1024)
    size = 0

    push(value: number, priority: number): void {
        if (this.size === this.keys.length) {
            this.keys = resized(this.keys, this.size * 2)
            this.values = resized(this.values, this.size * 2)
        }
        let index = this.size++
        while (index > 0) {
            const parent = (index - 1) >> 1
            const parentPriority = this.keys[parent] ?? Number.POSITIVE_INFINITY
            const parentValue = this.values[parent] ?? 0
            if (parentPriority <= priority) {
                break
            }
            this.keys[index] = parentPriority
            this.values[index] = parentValue
            index = parent
        }
        this.keys[index] = priority
        this.values[index] = value
    }

    pop(): number {
        if (this.size === 0) {
            return -1
        }

        const top = this.values[0] ?? -1
        const last = --this.size
        if (last > 0) {
            const priority = this.keys[last] ?? Number.POSITIVE_INFINITY
            const value = this.values[last] ?? -1
            let index = 0
            while (true) {
                const left = (2 * index) + 1
                const right = left + 1
                let smallest = index
                let smallestPriority = priority

                if (left < last) {
                    const leftPriority = this.keys[left] ?? Number.POSITIVE_INFINITY
                    if (leftPriority < smallestPriority) {
                        smallest = left
                        smallestPriority = leftPriority
                    }
                }

                if (right < last) {
                    const rightPriority = this.keys[right] ?? Number.POSITIVE_INFINITY
                    if (rightPriority < smallestPriority) {
                        smallest = right
                        smallestPriority = rightPriority
                    }
                }

                if (smallest === index) {
                    break
                }

                this.keys[index] = this.keys[smallest] ?? Number.POSITIVE_INFINITY
                this.values[index] = this.values[smallest] ?? -1
                index = smallest
            }

            this.keys[index] = priority
            this.values[index] = value
        }

        return top
    }
}

export class PathGraph {
    capacity = 1024
    x = new Int32Array(1024)
    y = new Int32Array(1024)
    z = new Int32Array(1024)
    cost = new Float32Array(1024)
    reqId = new Uint8Array(1024)
    alive = new Uint8Array(1024)
    degree = new Uint8Array(1024)
    adj = new Int32Array(1024 * MAX_DEGREE)
    // requirement id for each edge in adj (same indexing as adj); 0 = no requirement
    adjReq = new Uint8Array(1024 * MAX_DEGREE)

    // index 0 = "no requirement" (a blacklist with no types, always allowed)
    readonly requirements: NodeRequirement[] = [{ whiteList: false, types: [] }]

    private nextId = 0
    private readonly ids = new Map<string, number>()
    private readonly coordToId = new Map<number, number>()
    private readonly requirementIds = new Map<string, number>()
    private freeIds: number[] = []
    private pendingFreeIds: number[] = []
    private activeSearches = 0
    private readonly originX: number
    private readonly originZ: number

    constructor(private readonly nodes: Record<LocationString, PathNode>, center: Vector3) {
        this.originX = Math.floor(center.x)
        this.originZ = Math.floor(center.z)
        for (const [key, node] of Object.entries(nodes)) {
            this.refreshNode(key)
            for (const neighborKey of node.neighbors) {
                this.addEdge(key, neighborKey, node.nodeRequirements?.[neighborKey])
            }
        }
    }

    beginSearch() {
        this.activeSearches++
    }

    endSearch() {
        if (--this.activeSearches === 0 && this.pendingFreeIds.length > 0) {
            this.freeIds.push(...this.pendingFreeIds)
            this.pendingFreeIds = []
        }
    }

    idOf(key: string) {
        const id = this.ids.get(key)
        return id !== undefined && this.alive[id] === 1 ? id : -1
    }

    idAt(x: number, y: number, z: number) {
        const coordKey = this.coordKey(x, y, z)
        if (coordKey === -1) {
            return -1
        }
        const id = this.coordToId.get(coordKey)
        return id !== undefined && this.alive[id] === 1 ? id : -1
    }

    addEdge(fromKey: string, toKey: string, requirement?: NodeRequirement) {
        const from = this.ensureId(fromKey)
        const to = this.ensureId(toKey)
        this.alive[from] = 1
        const degree = this.degree[from]
        if (degree === undefined) {
            return
        }
        const base = from * MAX_DEGREE
        const requirementId = this.intern(requirement)
        for (let i = 0; i < degree; i++) {
            if (this.adj[base + i] === to) {
                this.adjReq[base + i] = requirementId
                return
            }
        }
        if (degree < MAX_DEGREE) {
            this.adj[base + degree] = to
            this.adjReq[base + degree] = requirementId
            this.degree[from] = degree + 1
        }
    }

    removeEdge(fromKey: string, toKey: string) {
        const from = this.ids.get(fromKey)
        const to = this.ids.get(toKey)
        if (from === undefined || to === undefined) {
            return
        }
        const base = from * MAX_DEGREE
        const degree = this.degree[from]
        if (degree === undefined || degree === 0) {
            return
        }
        const last = this.adj[base + degree - 1]
        if (last === undefined) {
            return
        }
        const lastRequirement = this.adjReq[base + degree - 1] ?? 0

        for (let i = 0; i < degree; i++) {
            if (this.adj[base + i] === to) {
                this.adj[base + i] = last
                this.adjReq[base + i] = lastRequirement
                this.degree[from] = degree - 1
                return
            }
        }
    }

    refreshNode(key: string) {
        const node = this.nodes[key as LocationString]
        if (node === undefined) {
            this.removeNode(key)
            return
        }
        const id = this.ensureId(key)
        this.alive[id] = 1
        this.cost[id] = node.cost ?? 0
        this.reqId[id] = this.intern(node.requirement)
    }

    removeNode(key: string) {
        const id = this.ids.get(key)
        if (id === undefined) {
            return
        }
        this.ids.delete(key)

        const x = this.x[id]
        const y = this.y[id]
        const z = this.z[id]
        if (x !== undefined && y !== undefined && z !== undefined) {
            this.coordToId.delete(this.coordKey(x, y, z))
        }

        this.alive[id] = 0
        this.degree[id] = 0
        if (this.activeSearches > 0) {
            this.pendingFreeIds.push(id)
        }
        else {
            this.freeIds.push(id)
        }
    }

    private coordKey(x: number, y: number, z: number) {
        const dx = x - this.originX + 512
        const dz = z - this.originZ + 512
        if (dx < 0 || dx >= 1024 || dz < 0 || dz >= 1024 || y < -64 || y >= 448) {
            return -1
        }
        return (((dx * 1024) + dz) * 512) + (y + 64)
    }

    private ensureId(key: string) {
        let id = this.ids.get(key)
        if (id !== undefined) {
            return id
        }
        id = this.freeIds.pop() ?? this.nextId++
        if (id >= this.capacity) {
            this.grow()
        }
        const location = stringToLocation(key as LocationString)
        this.x[id] = location.x
        this.y[id] = location.y
        this.z[id] = location.z
        this.cost[id] = 0
        this.reqId[id] = 0
        this.alive[id] = 0
        this.degree[id] = 0
        this.ids.set(key, id)
        const coordKey = this.coordKey(location.x, location.y, location.z)
        if (coordKey !== -1) {
            this.coordToId.set(coordKey, id)
        }
        return id
    }

    private intern(requirement: NodeRequirement | undefined) {
        if (requirement === undefined) {
            return 0
        }
        const key = `${requirement.whiteList ? "w" : "b"}:${[...requirement.types].sort().join(",")}`
        let id = this.requirementIds.get(key)
        if (id === undefined) {
            id = this.requirements.length
            if (id > 255) {
                throw new Error("Too many distinct path requirements")
            }
            this.requirements.push(requirement)
            this.requirementIds.set(key, id)
        }
        return id
    }

    private grow() {
        const capacity = this.capacity * 2
        this.x = resized(this.x, capacity)
        this.y = resized(this.y, capacity)
        this.z = resized(this.z, capacity)
        this.cost = resized(this.cost, capacity)
        this.reqId = resized(this.reqId, capacity)
        this.alive = resized(this.alive, capacity)
        this.degree = resized(this.degree, capacity)
        this.adj = resized(this.adj, capacity * MAX_DEGREE)
        this.adjReq = resized(this.adjReq, capacity * MAX_DEGREE)
        this.capacity = capacity
    }
}
