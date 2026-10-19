const setCache = new WeakMap<object, { set: Set<unknown>, length: number }>()

Array.prototype.includesFast = function (value) {
    let entry = setCache.get(this)

    if (entry?.length !== this.length) {
        entry = { set: new Set(this), length: this.length }
        setCache.set(this, entry)
    }

    return entry.set.has(value)
}

Array.prototype.remove = function (value) {
    const index = this.indexOf(value)
    if (index === -1) {
        return false
    }
    this.splice(index, 1)
    return true
}

Array.prototype.add = function (...values) {
    for (const value of values) {
        if (!this.includes(value)) {
            this.push(value)
        }
    }
}
