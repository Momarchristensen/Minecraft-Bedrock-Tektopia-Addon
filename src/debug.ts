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

import type {
    LocationString,
    NodeRequirement,
    PathNode
} from "./minecraft_extensions"

import type {
    RGB,
    Vector3
} from "@minecraft/server"

export const debugFlags = {
    locationScanParticles: false,
    searchBlocksParticles: false,
    pathNodeParticles: false,
    villageLocationParticles: false,
    villagerDebugNameTags: false,
    rancherDebugNameTags: false,
    structureScanParticles: false,
    pathScanParticles: false,
    villagerPathParticles: false,
    pathfindingWarnings: false,
    nodeUpdatedWarnings: false,
    rancherPenParticles: false
}

export type DebugFlag = keyof typeof debugFlags

export const debugFlagNames = Object.keys(debugFlags) as DebugFlag[]

const PROPERTY_PREFIX = "tektopia:debug:"

const DEFAULT_NODE_COLOR = {
    red: 122 / 255,
    green: 122 / 255,
    blue: 122 / 255
}

const CONNECTION_LAYER_HEIGHT = 0.003

const DEFAULT_CONNECTION_COLOR = {
    red: 255 / 255,
    green: 255 / 255,
    blue: 108 / 255
}

const DIAGONAL_Y_OFFSET = 0.05

interface ConnectionParticle {
    direction: string
    offset: Vector3
    rotation?: number
    particleDirection?: string
}

const CONNECTION_PARTICLES: ConnectionParticle[] = [
    { direction: "north", offset: { x: -0.1, y: 0, z: -0.5 } },
    { direction: "east", offset: { x: 0.5, y: 0, z: -0.1 }, rotation: 90 },
    { direction: "south", offset: { x: 0.1, y: 0, z: 0.5 } },
    { direction: "west", offset: { x: -0.5, y: 0, z: 0.1 }, rotation: 90 },
    { direction: "northeast", offset: { x: 0.43, y: DIAGONAL_Y_OFFSET, z: -0.57 }, rotation: 135 },
    { direction: "northwest", offset: { x: -0.57, y: 0, z: -0.43 }, rotation: 45 },
    { direction: "southeast", offset: { x: 0.57, y: 0, z: 0.43 }, rotation: 45 },
    { direction: "southwest", offset: { x: -0.43, y: DIAGONAL_Y_OFFSET, z: 0.57 }, rotation: 135 },
    { direction: "northdown", offset: { x: -0.1, y: -0.5, z: -0.5 }, particleDirection: "north" },
    { direction: "eastdown", offset: { x: 0.5, y: -0.5, z: -0.1 }, particleDirection: "east" },
    { direction: "southdown", offset: { x: 0.1, y: -0.5, z: 0.5 }, particleDirection: "south" },
    { direction: "westdown", offset: { x: -0.5, y: -0.5, z: 0.1 }, particleDirection: "west" },
    { direction: "northup", offset: { x: -0.1, y: 0.5, z: -0.5 }, particleDirection: "south" },
    { direction: "eastup", offset: { x: 0.5, y: 0.5, z: -0.1 }, particleDirection: "west" },
    { direction: "southup", offset: { x: 0.1, y: 0.5, z: 0.5 }, particleDirection: "north" },
    { direction: "westup", offset: { x: -0.5, y: 0.5, z: 0.1 }, particleDirection: "east" }
]

const VILLAGE_LOCATION_PROPERTIES = [
    "sugarCaneLocations",
    "saplingLocations",
    "farmLocations",
    "harvestLocations",
    "sweetBerryLocations",
    "treeLocations",
    "plantLocations",
    "tillLocations"
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

const COST_CHEAP_SATURATION = 1
const COST_EXPENSIVE_SATURATION = 12
const COST_CHEAP = { red: 0.2, green: 0.5, blue: 1 }
const COST_EXPENSIVE_MID = { red: 1, green: 0.8, blue: 0.2 }
const COST_EXPENSIVE = { red: 1, green: 0.1, blue: 0.1 }

function lerpColor(from: RGB, to: RGB, amount: number): RGB {
    return {
        red: from.red + ((to.red - from.red) * amount),
        green: from.green + ((to.green - from.green) * amount),
        blue: from.blue + ((to.blue - from.blue) * amount)
    }
}

function getCostColor(cost: number | undefined) {
    if (cost === undefined) {
        return undefined
    }

    if (cost < 0) {
        const amount = Math.min(1, -cost / COST_CHEAP_SATURATION)
        return lerpColor(DEFAULT_NODE_COLOR, COST_CHEAP, amount)
    }

    const t = Math.min(1, cost / COST_EXPENSIVE_SATURATION)
    if (t < 0.5) {
        return lerpColor(DEFAULT_NODE_COLOR, COST_EXPENSIVE_MID, t * 2)
    }
    return lerpColor(COST_EXPENSIVE_MID, COST_EXPENSIVE, (t - 0.5) * 2)
}

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

                    const propertyLocations = property === "plantLocations" ?
                        Object.keys(village.plantLocations) as LocationString[] :
                        village[property]

                    for (const location of propertyLocations) {
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
                        catch { }
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

                                let nodeColor
                                if (node.requirement !== undefined) {
                                    nodeColor = requirementColor(node.requirement)
                                }

                                nodeColor ??= DEFAULT_NODE_COLOR

                                colorMap.setColorRGB("color", nodeColor)

                                const costColor = getCostColor(node.cost)

                                try {
                                    player.spawnParticle("tektopia:path_node", particlePos, colorMap)
                                }
                                catch { }

                                if (costColor !== undefined) {
                                    const molangVars = new MolangVariableMap
                                    molangVars.setColorRGBA("color", { ...costColor, alpha: 1 })
                                    player.spawnParticle("minecraft:sparkler_emitter", addVector(particlePos, "y", 0.25), molangVars)
                                }

                                const directionColors = new Map<string, { red: number, green: number, blue: number }>()
                                for (const neighborKey of node.neighbors) {
                                    const neighborPos = stringToLocation(neighborKey)
                                    const direction = vectorToDirection(subtractVectors(neighborPos, checkPos))
                                    if (direction === undefined) {
                                        continue
                                    }

                                    const requirement = connectionRequirement(node, neighborKey, village.pathNodes[neighborKey])

                                    directionColors.set(
                                        direction,
                                        requirement === undefined ? DEFAULT_CONNECTION_COLOR : requirementColor(requirement)
                                    )
                                }

                                const connectionBase = addVector(centerVector(checkPos, true), "y", 0.02)
                                for (const [layer, { direction, offset, rotation, particleDirection }] of CONNECTION_PARTICLES.entries()) {
                                    const connectionColor = directionColors.get(direction)
                                    if (connectionColor === undefined) {
                                        continue
                                    }
                                    try {
                                        player.spawnParticle(
                                            particleDirection === undefined ? "tektopia:node_connection" : `tektopia:node_connection_${particleDirection}`,
                                            addVectors(connectionBase, { x: offset.x, y: offset.y + (layer * CONNECTION_LAYER_HEIGHT), z: offset.z }),
                                            getConnectionMolangMap(connectionColor, particleDirection === undefined ? rotation : undefined)
                                        )
                                    }
                                    catch { }
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

const connectionMolangMaps = new Map<string, MolangVariableMap>()

function getConnectionMolangMap(color: { red: number, green: number, blue: number }, rotation?: number) {
    const cacheKey = `${color.red},${color.green},${color.blue}:${rotation ?? ""}`
    let molangMap = connectionMolangMaps.get(cacheKey)
    if (molangMap === undefined) {
        molangMap = new MolangVariableMap()
        if (rotation !== undefined) {
            molangMap.setFloat("rotation", rotation)
        }
        molangMap.setColorRGB("color", color)
        connectionMolangMaps.set(cacheKey, molangMap)
    }
    return molangMap
}

function connectionRequirement(node: PathNode, neighborKey: LocationString, neighborNode: PathNode | undefined) {
    if (neighborNode === undefined) {
        return undefined
    }
    return neighborNode.requirement ?? node.nodeRequirements?.[neighborKey]
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
