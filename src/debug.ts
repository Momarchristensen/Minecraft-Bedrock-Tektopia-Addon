import {
    MolangVariableMap,
    system,
    world
} from "@minecraft/server"

import {
    addVector,
    addVectors,
    centerVector,
    stringToVector,
    subtractVectors,
    vectorToDirection,
    vectorToString
} from "./utils"

import type { NodeRequirement } from "."

function _tickDrawDebug() {
    system.runJob(drawDebug(_tickDrawDebug))
}

system.run(_tickDrawDebug)

function* drawDebug(callback: () => void) {
    try {
        if (!world.loadedData) {
            callback()
            return
        }
        const players = world.getAllPlayers()

        const rotate45 = new MolangVariableMap()
        rotate45.setFloat("rotation", 45)

        const rotate90 = new MolangVariableMap()
        rotate90.setFloat("rotation", 90)

        const rotate135 = new MolangVariableMap()
        rotate135.setFloat("rotation", 135)

        const villageList = world.getVillages()

        for (const player of players) {
            const playerPos = player.location
            const nearbyRange = 4
            const minY = Math.floor(playerPos.y) - 1
            const maxY = Math.floor(playerPos.y) + 1

            for (const village of villageList) {
                for (let dx = -nearbyRange; dx <= nearbyRange; dx++) {
                    for (let dy = minY - Math.floor(playerPos.y); dy <= maxY - Math.floor(playerPos.y); dy++) {
                        for (let dz = -nearbyRange; dz <= nearbyRange; dz++) {
                            const checkPos = {
                                x: Math.floor(playerPos.x + dx),
                                y: Math.floor(playerPos.y + dy),
                                z: Math.floor(playerPos.z + dz)
                            }
                            const key = vectorToString(checkPos)
                            if (!village.pathNodes.hasOwnProperty(key)) {
                                continue
                            }

                            const node = village.pathNodes[key]
                            if (node === undefined) {
                                continue
                            }

                            const particlePos = addVector(
                                centerVector(checkPos, true),
                                "y",
                                0.01
                            )
                            const colorMap = new MolangVariableMap()

                            let color
                            if (node.requirement !== undefined) {
                                color = requirementColor(node.requirement)
                            }
                            if (color === undefined) {
                                color = {
                                    red: 122 / 255,
                                    green: 122 / 255,
                                    blue: 122 / 255
                                }
                            }
                            colorMap.setColorRGB("color", color)

                            player.spawnParticle("tektopia:path_node", particlePos, colorMap)

                            const directionSet = new Set(
                                node.neighbors.map(neighborString =>
                                    vectorToDirection(
                                        subtractVectors(stringToVector(neighborString), checkPos)
                                    )
                                )
                            )

                            const spawnConnection = (
                                offsetX: number,
                                offsetY: number,
                                offsetZ: number,
                                dir?: MolangVariableMap | string
                            ) => {
                                const pos = addVectors(
                                    addVector(centerVector(checkPos, true), "y", 0.02),
                                    { x: offsetX, y: offsetY, z: offsetZ }
                                )
                                try {
                                    if (typeof dir === "string") {
                                        player.spawnParticle(`tektopia:node_connection_${dir}`, pos)
                                    }
                                    else {
                                        player.spawnParticle("tektopia:node_connection", pos, dir)
                                    }
                                }
                                catch { }
                            }

                            if (directionSet.has("north")) {
                                spawnConnection(-0.1, 0, -0.5)
                            }
                            if (directionSet.has("east")) {
                                spawnConnection(0.5, 0, -0.1, rotate90)
                            }
                            if (directionSet.has("south")) {
                                spawnConnection(0.1, 0, 0.5)
                            }
                            if (directionSet.has("west")) {
                                spawnConnection(-0.5, 0, 0.1, rotate90)
                            }
                            if (directionSet.has("northeast")) {
                                spawnConnection(0.43, 0, -0.57, rotate135)
                            }
                            if (directionSet.has("northwest")) {
                                spawnConnection(-0.57, 0, -0.43, rotate45)
                            }
                            if (directionSet.has("southeast")) {
                                spawnConnection(0.57, 0, 0.43, rotate45)
                            }
                            if (directionSet.has("southwest")) {
                                spawnConnection(-0.43, 0, 0.57, rotate135)
                            }
                            if (directionSet.has("northdown")) {
                                spawnConnection(-0.1, -0.5, -0.5, "north")
                            }
                            if (directionSet.has("eastdown")) {
                                spawnConnection(0.5, -0.5, -0.1, "east")
                            }
                            if (directionSet.has("southdown")) {
                                spawnConnection(0.1, -0.5, 0.5, "south")
                            }
                            if (directionSet.has("westdown")) {
                                spawnConnection(-0.5, -0.5, 0.1, "west")
                            }
                            if (directionSet.has("northup")) {
                                spawnConnection(-0.1, 0.5, -0.5, "south")
                            }
                            if (directionSet.has("eastup")) {
                                spawnConnection(0.5, 0.5, -0.1, "west")
                            }
                            if (directionSet.has("southup")) {
                                spawnConnection(0.1, 0.5, 0.5, "north")
                            }
                            if (directionSet.has("westup")) {
                                spawnConnection(-0.5, 0.5, 0.1, "east")
                            }

                            yield
                        }
                    }
                }
            }
        }
    }
    finally {
        if (callback !== undefined) {
            callback()
        }
    }
}

function requirementColor(requirement: NodeRequirement) {
    if (!requirement?.types?.length) {
        return { red: 0, green: 0, blue: 0 }
    }

    const key = [...requirement.types].sort().join(",") + (requirement.whiteList ? "+w" : "+b")
    const hash = hashString(key)

    let red = hash * 197 % 256
    let green = hash * 293 % 256
    let blue = hash * 503 % 256

    if (!requirement.whiteList) {
        red = red ^ 137
        green = green ^ 251
        blue = blue ^ 61
    }

    return { red: red / 255, green: green / 255, blue: blue / 255 }

    function hashString(str: string) {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
            hash = hash * 31 + str.charCodeAt(i) | 0
        }
        return hash >>> 0
    }
}

export function testLag() {
    if (world.lagTime === undefined) {
        world.lagTime = Date.now()
    }
    else {
        console.warn(Date.now() - world.lagTime)
        world.lagTime = undefined
    }
}
