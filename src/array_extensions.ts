const setCache = new WeakMap()

Array.prototype.includesFast = function (value) {
    let set = setCache.get(this)

    if (set === undefined) {
        set = new Set(this)
        setCache.set(this, set)
    }

    return set.has(value)
}

Array.prototype.remove = function (value) {
    const index = this.indexOf(value)
    if (index !== -1) {
        this.splice(index, 1)
    }
    return this
}
