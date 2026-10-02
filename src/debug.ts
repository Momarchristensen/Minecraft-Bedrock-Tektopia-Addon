import {
    CommandPermissionLevel,
    CustomCommandParamType,
    CustomCommandStatus,
    MolangVariableMap,
    system,
    world
} from "@minecraft/server"

import {
    addVector,
    addVectors,
    calculateDistance,
    centerVector,
    stringToLocation,
    subtractVectors,
    vectorToDirection,
    locationToString
} from "./utils"

import type { NodeRequirement } from "."

export const debugFlags = {
    scanParticles: false,
    pathNodeParticles: false,
    villageLocationParticles: false,
    villagerDebugNameTags: false,
    itemFrameScanParticles: false,
    villagerPathParticles: false,
    pathfindingWarnings: false,
    nodeUpdatedWarnings: false
}

export type DebugFlag = keyof typeof debugFlags

export const debugFlagNames = Object.keys(debugFlags) as DebugFlag[]

const PROPERTY_PREFIX = "tektopia:debug:"
const VILLAGE_LOCATION_PROPERTIES = [
    "sugarCaneLocations",
    "saplingLocations",
    "farmLocations",
    "harvestLocations",
    "sweetBerryLocations",
    "treeLocations"
] as const

export function isDebugFlag(value: string): value is DebugFlag {
    return value in debugFlags
}

export function setDebugFlag(flag: DebugFlag, enabled: boolean) {
    debugFlags[flag] = enabled
    world.setDynamicProperty(PROPERTY_PREFIX + flag, enabled ? true : undefined)
}

export function loadDebugFlags() {
    for (const flag of debugFlagNames) {
        const saved = world.getDynamicProperty(PROPERTY_PREFIX + flag)
        if (typeof saved === "boolean") {
            debugFlags[flag] = saved
        }
    }
}

system.beforeEvents.startup.subscribe(event => {
    const customCommandRegistry = event.customCommandRegistry

    customCommandRegistry.registerEnum("tektopia:debugflag", debugFlagNames)

    customCommandRegistry.registerCommand({
        name: "tektopia:debug",
        cheatsRequired: false,
        description: "Toggle a debug flag (omit the value to flip it)",
        mandatoryParameters: [{ type: CustomCommandParamType.Enum, name: "tektopia:debugflag" }],
        optionalParameters: [{ type: CustomCommandParamType.Boolean, name: "enabled" }],
        permissionLevel: CommandPermissionLevel.Admin
    }, (_, flag: string, enabled?: boolean) => {
        if (!isDebugFlag(flag)) {
            return {
                status: CustomCommandStatus.Failure,
                message: `Unknown flag. Options: ${debugFlagNames.join(", ")}`
            }
        }

        const newValue = enabled ?? !debugFlags[flag]

        system.run(() => setDebugFlag(flag, newValue))

        return {
            status: CustomCommandStatus.Success,
            message: `${flag} is now ${newValue ? "on" : "off"}`
        }
    })
})

function tickDrawDebug() {
    system.runJob(drawDebug(tickDrawDebug))
}

system.run(tickDrawDebug)

function* drawDebug(callback?: () => void) {
    try {
        if (!world.loadedData) {
            return
        }
        const players = world.getAllPlayers()

        if (debugFlags.villageLocationParticles) {
            for (const player of players) {
                const village = player.dimension.getVillage(player.location)
                if (village === undefined) {
                    continue
                }

                const playerLocation = player.location
                const nearbyLocations = new Map<string, {
                    locationVector: ReturnType<typeof stringToLocation>
                    properties: Array<typeof VILLAGE_LOCATION_PROPERTIES[number]>
                }>()
                const colorMaps = new Map<typeof VILLAGE_LOCATION_PROPERTIES[number], MolangVariableMap>()

                for (const property of VILLAGE_LOCATION_PROPERTIES) {
                    const colorMap = new MolangVariableMap()
                    colorMap.setColorRGB("color", stringColor(property))
                    colorMaps.set(property, colorMap)

                    for (const location of village[property]) {
                        const locationVector = stringToLocation(location)
                        if (calculateDistance(playerLocation, locationVector) > 20) {
                            continue
                        }

                        let nearbyLocation = nearbyLocations.get(location)
                        if (nearbyLocation === undefined) {
                            nearbyLocation = { locationVector, properties: [] }
                            nearbyLocations.set(location, nearbyLocation)
                        }
                        nearbyLocation.properties.push(property)
                    }
                }

                for (const nearbyLocation of nearbyLocations.values()) {
                    const { locationVector, properties } = nearbyLocation
                    for (const [index, property] of properties.entries()) {
                        const particlePos = addVector(
                            centerVector(locationVector, true),
                            "y",
                            (index + 1) / (properties.length + 1)
                        )
                        try {
                            player.spawnParticle("tektopia:path_node", particlePos, colorMaps.get(property))
                        }
                        catch {}
                        yield
                    }
                }
            }
        }

        if (debugFlags.pathNodeParticles) {
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
                                const key = locationToString(checkPos)
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

                                color ??= {
                                    red: 122 / 255,
                                    green: 122 / 255,
                                    blue: 122 / 255
                                }

                                colorMap.setColorRGB("color", color)

                                player.spawnParticle("tektopia:path_node", particlePos, colorMap)

                                const directionSet = new Set(
                                    node.neighbors.map(neighborString =>
                                        vectorToDirection(
                                            subtractVectors(stringToLocation(neighborString), checkPos)
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
    }
    finally {
        if (callback !== undefined) {
            callback()
        }
    }
}

function requirementColor(requirement?: NodeRequirement) {
    if (requirement === undefined || requirement.types.length === 0) {
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

}

function stringColor(value: string) {
    const hash = hashString(value)
    return {
        red: (hash * 197 % 256) / 255,
        green: (hash * 293 % 256) / 255,
        blue: (hash * 503 % 256) / 255
    }
}

function hashString(value: string) {
    let hash = 0
    for (let i = 0; i < value.length; i++) {
        hash = (hash * 31) + value.charCodeAt(i) | 0
    }
    return hash >>> 0
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

world.afterEvents.worldLoad.subscribe(() => {
    main()
})

function main() {
    loadDebugFlags()
}
