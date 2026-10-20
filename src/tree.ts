import {
    Block,
    system,
    type Vector3
} from "@minecraft/server"

import { updatePathNodes } from "./path"

import { Registry } from "./registry"

import {
    calculateDistance,
    removeIdentifier,
    locationToString,
    splitIdentifier
} from "./utils"

function getLeafTypeIds(logType: string): Set<string> {
    const leafTypeIds = new Set([`minecraft:${logType}_leaves`])
    if (logType === "oak") {

        leafTypeIds.add("minecraft:azalea_leaves")
        leafTypeIds.add("minecraft:azalea_leaves_flowered")
    }
    else if (logType === "poplar") {
        leafTypeIds.clear()
        leafTypeIds.add("minecraft:orange_poplar_leaves")
        leafTypeIds.add("minecraft:red_poplar_leaves")
        leafTypeIds.add("minecraft:yellow_poplar_leaves")
    }
    return leafTypeIds
}

export function destroyTree(startingBlock: Block, callback?: () => void) {
    system.runJob(destroyTreeGenerator())

    function* destroyTreeGenerator() {
        try {
            const logType = removeIdentifier(startingBlock.typeId).replace("_log", "")
            const logTypeId = `minecraft:${logType}_log`
            const leafTypeIds = getLeafTypeIds(logType)

            const trunks = getTrunkBlocks(startingBlock)
            const logBlocks: Block[] = []
            const checkLogBlocks: Array<Block | undefined> = []
            const checkLeafBlocks: Array<Block | undefined> = []

            let logChecks = 0
            const visitedTrunkLocations = new Set<string>()
            for (const trunk of trunks) {
                logBlocks.push(trunk)
                for (let x = -1; x <= 1; x++) {
                    for (let z = -1; z <= 1; z++) {
                        checkLogBlocks.push(trunk.offsetSafe({ x, y: 0, z }))
                    }
                }

                const pending = [trunk]
                visitedTrunkLocations.add(locationToString(trunk.location))
                while (pending.length > 0) {
                    const current = pending.pop() as Block

                    for (const next of getTrunkContinuations(current)) {
                        const nextKey = locationToString(next.location)
                        if (visitedTrunkLocations.has(nextKey)) {
                            continue
                        }

                        visitedTrunkLocations.add(nextKey)
                        pending.push(next)

                        logBlocks.push(next)
                        checkLeafBlocks.push(
                            next.aboveSafe(),
                            next.belowSafe(),
                            next.northSafe(),
                            next.eastSafe(),
                            next.southSafe(),
                            next.westSafe()
                        )

                        for (let x = -1; x <= 1; x++) {
                            for (let z = -1; z <= 1; z++) {
                                checkLogBlocks.push(next.offsetSafe({ x, y: 0, z }))
                            }
                        }

                        if (++logChecks % 10 === 0) {
                            yield
                        }
                    }
                }
            }

            let alreadyCheckedLocations = new Set()
            let sideLogChecks = 0
            while (checkLogBlocks.length > 0) {
                const checkBlock = checkLogBlocks.pop()
                if (checkBlock === undefined) {
                    continue
                }
                const checkBlockString = locationToString(checkBlock)
                if (alreadyCheckedLocations.has(checkBlockString)) {
                    continue
                }
                alreadyCheckedLocations.add(checkBlockString)

                if (checkBlock.typeId !== logTypeId) {
                    continue
                }

                logBlocks.push(checkBlock)
                checkLeafBlocks.push(
                    checkBlock.aboveSafe(),
                    checkBlock.belowSafe(),
                    checkBlock.northSafe(),
                    checkBlock.eastSafe(),
                    checkBlock.southSafe(),
                    checkBlock.westSafe()
                )

                for (let x = -1; x <= 1; x++) {
                    for (let y = 0; y <= 1; y++) {
                        for (let z = -1; z <= 1; z++) {
                            checkLogBlocks.push(checkBlock.offsetSafe({ x, y, z }))
                        }
                    }
                }

                if (++sideLogChecks % 10 === 0) {
                    yield
                }
            }

            alreadyCheckedLocations = new Set()
            const leafBlocks = []
            const logBlockLocations = new Set(logBlocks.map(block => locationToString(block.location)))

            let leafChecks = 0
            while (checkLeafBlocks.length > 0) {
                const checkBlock = checkLeafBlocks.pop()
                if (!checkBlock?.isValid) {
                    continue
                }
                const checkBlockString = locationToString(checkBlock)
                if (alreadyCheckedLocations.has(checkBlockString)) {
                    continue
                }
                alreadyCheckedLocations.add(checkBlockString)

                if (!leafTypeIds.has(checkBlock.typeId)) {
                    continue
                }
                if (checkBlock.permutation.getState("persistent_bit") !== false) {
                    continue
                }

                let closestLogLocation: Vector3 | undefined
                const maxDistance = 4
                let closestDistance = maxDistance + 1

                outer: for (let dx = -maxDistance; dx <= maxDistance; dx++) {
                    for (let dy = -maxDistance; dy <= maxDistance; dy++) {
                        for (let dz = -maxDistance; dz <= maxDistance; dz++) {
                            if (Math.abs(dx) + Math.abs(dy) + Math.abs(dz) > maxDistance) {
                                continue
                            }

                            const block = checkBlock.offsetSafe({ x: dx, y: dy, z: dz })
                            if (block === undefined) {
                                continue
                            }

                            const distance = calculateDistance(block, checkBlock)
                            if (block.typeId === logTypeId && distance < closestDistance) {
                                closestLogLocation = block.location
                                closestDistance = distance
                                if (closestDistance === 1) {
                                    break outer
                                }
                            }
                        }
                    }
                }

                if (closestLogLocation === undefined || !logBlockLocations.has(locationToString(closestLogLocation))) {
                    continue
                }

                leafBlocks.push(checkBlock)
                checkLeafBlocks.push(
                    checkBlock.aboveSafe(),
                    checkBlock.belowSafe(),
                    checkBlock.northSafe(),
                    checkBlock.eastSafe(),
                    checkBlock.southSafe(),
                    checkBlock.westSafe()
                )

                if (++leafChecks % 3 === 0) {
                    yield
                }
            }

            const blockList = logBlocks.concat(leafBlocks)
            const blocksToUpdate = []
            const checkedBlocks = new Set()

            for (let i = 0; i < blockList.length; i++) {
                const block = blockList[i]
                if (block === undefined) {
                    continue
                }
                block.destroy(true)

                const updateBlockList = [block, block.aboveSafe(), block.belowSafe()]
                for (const updateBlock of updateBlockList) {
                    if (updateBlock === undefined) {
                        continue
                    }
                    const neighborBlockList = [updateBlock, updateBlock.aboveSafe()]
                    for (const neighborBlock of neighborBlockList) {
                        if (neighborBlock === undefined) {
                            continue
                        }
                        const blockString = locationToString(neighborBlock)
                        if (!checkedBlocks.has(blockString)) {
                            checkedBlocks.add(blockString)
                            blocksToUpdate.push(neighborBlock, neighborBlock.aboveSafe())
                        }
                    }
                }

                if (i % 3 === 0) {
                    yield
                }
            }

            updatePathNodes(blocksToUpdate.filter(block => block !== undefined))
        }
        finally {
            if (callback !== undefined) {
                callback()
            }
        }
    }
}

const bigTreeFeatures: Record<string, string> = {
    "minecraft:dark_oak_sapling": "minecraft:roofed_tree_feature",
    "minecraft:jungle_sapling": "minecraft:mega_jungle_tree_feature",
    "minecraft:spruce_sapling": "minecraft:mega_spruce_tree_feature",
    "minecraft:pale_oak_sapling": "minecraft:random_pale_oak_tree_feature"
}

export const bigTreeSaplings = Object.keys(bigTreeFeatures)

const requiresBigTree = new Set(["minecraft:dark_oak_sapling", "minecraft:pale_oak_sapling"])

const diagonalTrunkTypes = new Set(["minecraft:dark_oak_log", "minecraft:acacia_log", "minecraft:jungle_log", "minecraft:cherry_log"])

const diagonalUpOffsets = [
    { x: 1, z: 0 }, { x: -1, z: 0 }, { x: 0, z: 1 }, { x: 0, z: -1 },
    { x: 1, z: 1 }, { x: 1, z: -1 }, { x: -1, z: 1 }, { x: -1, z: -1 }
]

export function getTrunkContinuations(block: Block): Block[] {
    const result: Block[] = []
    const above = block.aboveSafe()
    if (above?.typeId === block.typeId) {
        result.push(above)
    }
    if (diagonalTrunkTypes.has(block.typeId)) {
        for (const offset of diagonalUpOffsets) {
            const diagonal = block.offsetSafe({ x: offset.x, y: 1, z: offset.z })
            if (diagonal?.typeId === block.typeId) {
                result.push(diagonal)
            }
        }
    }
    return result
}

const squareOffsets = [
    { x: 0, z: 0 },
    { x: 1, z: 0 },
    { x: 0, z: 1 },
    { x: 1, z: 1 }
]

export function findTrunkSquare(block: Block): [Block, Block, Block, Block] | undefined {
    for (const dx of [-1, 0]) {
        for (const dz of [-1, 0]) {
            const square: Block[] = []
            for (const offset of squareOffsets) {
                const other = block.offsetSafe({ x: dx + offset.x, y: 0, z: dz + offset.z })
                if (other?.typeId !== block.typeId || getTrunkContinuations(other).length === 0) {
                    break
                }
                square.push(other)
            }
            if (square.length === 4) {
                return square as [Block, Block, Block, Block]
            }
        }
    }
    return undefined
}

export function getTreeOrigin(block: Block): Block {
    return findTrunkSquare(block)?.[0] ?? block
}

export function getTrunkBlocks(block: Block): [Block, Block, Block, Block] | [Block] {
    return findTrunkSquare(block) ?? [block]
}

function findSaplingSquare(block: Block): [Block, Block, Block, Block] | undefined {
    for (const dx of [-1, 0]) {
        for (const dz of [-1, 0]) {
            const square: Block[] = []

            for (const offset of squareOffsets) {
                const other = block.offsetSafe({ x: dx + offset.x, y: 0, z: dz + offset.z })
                if (other?.typeId !== block.typeId) {
                    break
                }
                square.push(other)
            }

            if (square.length === 4) {
                return square as [Block, Block, Block, Block]
            }
        }
    }

    return undefined
}

Block.prototype.growTree = function () {
    const saplingBlockType = this.typeId

    if (!Registry.saplingTypes.includes(saplingBlockType)) {
        return false
    }

    let blocks: [Block] | [Block, Block, Block, Block] = [this]
    const [identifier, woodType] = splitIdentifier(saplingBlockType.replace("_sapling", ""))
    let feature = `${identifier}:select_${woodType}_tree_feature`

    if (feature === "minecraft:select_acacia_tree_feature") {
        feature = "minecraft:savanna_tree_feature"
    }
    else if (feature === "minecraft:select_cherry_tree_feature") {
        feature = "minecraft:random_cherry_tree_feature"
    }

    const bigFeature = bigTreeFeatures[saplingBlockType]
    if (bigFeature !== undefined) {
        const square = findSaplingSquare(this)

        if (square !== undefined) {
            blocks = square
            feature = bigFeature
        }
        else if (requiresBigTree.has(saplingBlockType)) {
            return false
        }
    }

    const origin = blocks[0].location

    for (const block of blocks) {
        block.setType("air")
    }

    try {
        this.dimension.placeFeature(feature, origin, true)
        return true
    }
    catch {
        for (const block of blocks) {
            block.setType(saplingBlockType)
        }
        return false
    }
}

const TRUNK_TOP_SEARCH_LIMIT = 32
const NATURAL_LEAF_RADIUS_XZ = 2
const NATURAL_LEAF_RADIUS_Y = 2

function hasNaturalLeaves(log: Block): boolean {
    const logType = removeIdentifier(log.typeId).replace("_log", "")
    if (logType === removeIdentifier(log.typeId)) {
        return false
    }
    const leafTypeIds = getLeafTypeIds(logType)

    let top = log
    for (let i = 0; i < TRUNK_TOP_SEARCH_LIMIT; i++) {
        const next = getTrunkContinuations(top)[0]
        if (next === undefined) {
            break
        }
        top = next
    }

    for (let y = -NATURAL_LEAF_RADIUS_Y; y <= NATURAL_LEAF_RADIUS_Y; y++) {
        for (let x = -NATURAL_LEAF_RADIUS_XZ; x <= NATURAL_LEAF_RADIUS_XZ; x++) {
            for (let z = -NATURAL_LEAF_RADIUS_XZ; z <= NATURAL_LEAF_RADIUS_XZ; z++) {
                const block = top.offsetSafe({ x, y, z })
                if (block !== undefined && leafTypeIds.has(block.typeId) && block.permutation.getState("persistent_bit") === false) {
                    return true
                }
            }
        }
    }
    return false
}

Block.prototype.isTree = function (checkLeaves = false) {
    const block = this
    if (!Registry.logTypes.includesFast(block.typeId)) {
        return false
    }
    const aboveBlock = getTrunkContinuations(block)[0]
    if (aboveBlock === undefined) {
        return false
    }
    const aboveAboveBlock = getTrunkContinuations(aboveBlock)[0]
    if (aboveAboveBlock === undefined) {
        return false
    }
    const belowBlock = block.belowSafe()
    if (belowBlock === undefined || !Registry.dirtTypesSet.has(belowBlock.typeId)) {
        return false
    }
    return !checkLeaves || hasNaturalLeaves(block)
}
