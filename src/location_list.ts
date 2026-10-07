import { stringToLocation } from "./utils"

import type { LocationString } from "./types"

import type { Vector3 } from "@minecraft/server"

function resized(array: Int32Array, length: number) {
    const result = new Int32Array(length)
    result.set(array)
    return result
}

export class LocationList implements Iterable<LocationString> {
    private xs = new Int32Array(64)
    private ys = new Int32Array(64)
    private zs = new Int32Array(64)
    private readonly indexByKey = new Map<LocationString, number>()

    constructor(readonly items: LocationString[]) {
        const source = items.slice()
        items.length = 0
        for (const key of source) {
            this.add(key)
        }
    }

    get length() {
        return this.items.length
    }

    [Symbol.iterator]() {
        return this.items[Symbol.iterator]()
    }

    has(key: LocationString) {
        return this.indexByKey.has(key)
    }

    at(index: number) {
        return this.items[index]
    }

    locationAt(index: number): Vector3 | undefined {
        const x = this.xs[index]
        const y = this.ys[index]
        const z = this.zs[index]
        if (x === undefined || y === undefined || z === undefined || index >= this.items.length) {
            return undefined
        }
        return { x, y, z }
    }

    add(key: LocationString) {
        if (this.indexByKey.has(key)) {
            return false
        }
        const index = this.items.length
        if (index >= this.xs.length) {
            this.xs = resized(this.xs, index * 2)
            this.ys = resized(this.ys, index * 2)
            this.zs = resized(this.zs, index * 2)
        }
        const location = stringToLocation(key)
        this.xs[index] = location.x
        this.ys[index] = location.y
        this.zs[index] = location.z
        this.items.push(key)
        this.indexByKey.set(key, index)
        return true
    }

    remove(key: LocationString) {
        const index = this.indexByKey.get(key)
        if (index === undefined) {
            return false
        }
        this.removeAt(index)
        return true
    }

    removeAt(index: number) {
        const removed = this.items[index]
        const lastIndex = this.items.length - 1
        const last = this.items[lastIndex]
        if (removed === undefined || last === undefined) {
            return
        }
        if (index !== lastIndex) {
            this.items[index] = last
            this.xs[index] = this.xs[lastIndex] ?? 0
            this.ys[index] = this.ys[lastIndex] ?? 0
            this.zs[index] = this.zs[lastIndex] ?? 0
            this.indexByKey.set(last, index)
        }
        this.items.pop()
        this.indexByKey.delete(removed)
    }

    nearestTo(origin: Vector3, isTaken?: (key: LocationString) => boolean): Vector3 | undefined {
        let bestIndex = -1
        let bestDistance = Infinity
        const count = this.items.length
        for (let i = 0; i < count; i++) {
            const dx = origin.x - (this.xs[i] ?? 0)
            const dy = origin.y - (this.ys[i] ?? 0)
            const dz = origin.z - (this.zs[i] ?? 0)
            const distance = (dx * dx) + (dy * dy) + (dz * dz)
            if (distance >= bestDistance) {
                continue
            }
            if (isTaken !== undefined) {
                const key = this.items[i]
                if (key === undefined || isTaken(key)) {
                    continue
                }
            }
            bestDistance = distance
            bestIndex = i
        }
        return bestIndex === -1 ? undefined : this.locationAt(bestIndex)
    }
}
