import {
    Block,
    Dimension
} from "@minecraft/server"

Block.prototype.northSafe = function (...args) {
    try {
        return this.north(...args)
    }
    catch {
        return undefined
    }
}

Block.prototype.eastSafe = function (...args) {
    try {
        return this.east(...args)
    }
    catch {
        return undefined
    }
}

Block.prototype.southSafe = function (...args) {
    try {
        return this.south(...args)
    }
    catch {
        return undefined
    }
}

Block.prototype.westSafe = function (...args) {
    try {
        return this.west(...args)
    }
    catch {
        return undefined
    }
}

Block.prototype.aboveSafe = function (...args) {
    try {
        return this.above(...args)
    }
    catch {
        return undefined
    }
}

Block.prototype.belowSafe = function (...args) {
    try {
        return this.below(...args)
    }
    catch {
        return undefined
    }
}

Block.prototype.offsetSafe = function (...args) {
    try {
        return this.offset(...args)
    }
    catch {
        return undefined
    }
}

Dimension.prototype.getBlockSafe = function (...args) {
    try {
        return this.getBlock(...args)
    }
    catch {
        return undefined
    }
}
