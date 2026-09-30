import {
    Block,
    Dimension
} from "@minecraft/server"

Block.prototype.northSafe = function () {
    try {
        return this.north()
    }
    catch {
        return undefined
    }
}

Block.prototype.eastSafe = function () {
    try {
        return this.east()
    }
    catch {
        return undefined
    }
}

Block.prototype.southSafe = function () {
    try {
        return this.south()
    }
    catch {
        return undefined
    }
}

Block.prototype.westSafe = function () {
    try {
        return this.west()
    }
    catch {
        return undefined
    }
}

Block.prototype.aboveSafe = function () {
    try {
        return this.above()
    }
    catch {
        return undefined
    }
}

Block.prototype.belowSafe = function () {
    try {
        return this.below()
    }
    catch {
        return undefined
    }
}

Block.prototype.offsetSafe = function (offset) {
    try {
        return this.offset(offset)
    }
    catch {
        return undefined
    }
}

Dimension.prototype.getBlockSafe = function (location) {
    try {
        return this.getBlock(location)
    }
    catch {
        return undefined
    }
}
