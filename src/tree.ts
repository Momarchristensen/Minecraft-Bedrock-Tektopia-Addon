import {
    type Block,
    system,
    type Vector3
} from "@minecraft/server"

import { updatePathNodes } from "./path"

import {
    areVectorsEqual,
    calculateDistance,
    removeIdentifier,
    vectorToString
} from "./utils"

export function destroyTree(startingBlock: Block, callback?: () => void) {
    system.runJob(destroyTreeGenerator())

    function* destroyTreeGenerator() {
        try {
            let currentBlock: Block | undefined = startingBlock
            const logType = removeIdentifier(startingBlock.typeId).replace("_log", "")
            const logTypeId = `minecraft:${logType}_log`
            const leafTypeId = `minecraft:${logType}_leaves`

            const logBlocks = [startingBlock]
            const checkLogBlocks = []
            for (let x = -1; x <= 1; x++) {
                for (let z = -1; z <= 1; z++) {
                    checkLogBlocks.push(startingBlock.offsetSafe({ x, y: 0, z }))
                }
            }
            const checkLeafBlocks = []

            let logChecks = 0
            while (true) {
                currentBlock = currentBlock.aboveSafe()
                if (currentBlock?.typeId !== logTypeId) {
                    break
                }
                if (currentBlock.permutation.getState("pillar_axis") !== "y") {
                    break
                }

                logBlocks.push(currentBlock)
                checkLeafBlocks.push(
                    currentBlock.aboveSafe(),
                    currentBlock.belowSafe(),
                    currentBlock.northSafe(),
                    currentBlock.eastSafe(),
                    currentBlock.southSafe(),
                    currentBlock.westSafe()
                )

                for (let x = -1; x <= 1; x++) {
                    for (let z = -1; z <= 1; z++) {
                        checkLogBlocks.push(currentBlock.offsetSafe({ x, y: 0, z }))
                    }
                }

                if (++logChecks % 10 === 0) {
                    yield
                }
            }

            let alreadyCheckedLocations = new Set()
            let sideLogChecks = 0
            while (checkLogBlocks.length > 0) {
                const checkBlock = checkLogBlocks.pop()
                if (checkBlock === undefined) {
                    continue
                }
                const checkBlockString = vectorToString(checkBlock)
                if (alreadyCheckedLocations.has(checkBlockString)) {
                    continue
                }
                alreadyCheckedLocations.add(checkBlockString)

                if (checkBlock.typeId !== logTypeId) {
                    continue
                }
                if (checkBlock.permutation.getState("pillar_axis") === "y") {
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
            const logBlockLocations = logBlocks.map(block => block.location)

            let leafChecks = 0
            while (checkLeafBlocks.length > 0) {
                const checkBlock = checkLeafBlocks.pop()
                if (checkBlock === undefined) {
                    continue
                }
                const checkBlockString = vectorToString(checkBlock)
                if (alreadyCheckedLocations.has(checkBlockString)) {
                    continue
                }
                alreadyCheckedLocations.add(checkBlockString)

                if (checkBlock.typeId !== leafTypeId) {
                    continue
                }
                if (checkBlock.permutation.getState("persistent_bit")) {
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

                if (closestLogLocation === undefined) {
                    continue
                }

                if (!logBlockLocations.some(location => areVectorsEqual(closestLogLocation, location))) {
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
                block.destroy()

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
                        const blockString = vectorToString(neighborBlock)
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
