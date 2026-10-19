import {
    diagnosticsManager,
    DiagnosticsChartDisplayType,
    DiagnosticsTableDisplayType,
    type DiagnosticsChartViewOptions,
    type DiagnosticsStat,
    type DiagnosticsTableViewOptions,
    type DiagnosticsView
} from "@minecraft/debug-utilities"

import {
    CommandPermissionLevel,
    CustomCommandParamType,
    CustomCommandStatus,
    MolangVariableMap,
    system,
    world
} from "@minecraft/server"

import {
    type DebugFlag,
    debugFlagNames,
    debugFlags
} from "./debug_flags"

import { getItemFrameStructureLocation } from "./item_frames"

import { getPathNodeBlockState } from "./path"

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
} from "./types"

import type {
    RGB,
    Vector3
} from "@minecraft/server"

const PROPERTY_PREFIX = "tektopia:debug:"

const DEFAULT_NODE_COLOR = {
    red: 122 / 255,
    green: 122 / 255,
    blue: 122 / 255
}

const BLOCKED_NODE_COLOR = {
    red: 1,
    green: 0,
    blue: 0
}

const OCCUPIED_NODE_COLOR = {
    red: 1,
    green: 0.5,
    blue: 0
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
    "oreLocations",
    "plantLocations",
    "tillLocations",
    "growLocations"
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

        if (debugFlags.itemFrameFloorParticles) {
            const villages = world.getVillages()

            for (const player of players) {
                if (!player.isValid) {
                    continue
                }

                for (const itemFrame of world.itemFrameList) {
                    const structureLocation = getItemFrameStructureLocation(itemFrame)
                    if (structureLocation === undefined || itemFrame.dimensionId !== player.dimension.id) {
                        continue
                    }

                    const village = villages.find(candidate =>
                        candidate.dimensionId === itemFrame.dimensionId
                        && candidate.data.structures[structureLocation] !== undefined
                    )
                    if (village === undefined) {
                        continue
                    }

                    const colorMap = new MolangVariableMap()
                    colorMap.setColorRGB("color", stringColor(structureLocation))

                    for (const floorLocation of village.getClaimedFloorLocations(structureLocation)) {
                        const location = stringToLocation(floorLocation)
                        if (calculateDistance(player.location, location) > 20) {
                            continue
                        }

                        const particleLocation = addVector(centerVector(location, true), "y", 0.02)
                        try {
                            player.spawnParticle("tektopia:path_node", particleLocation, colorMap)
                        }
                        catch { }
                        yield
                    }
                }
            }
        }

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

                    const propertyLocations = property === "plantLocations"
                        ? Object.keys(village.plantLocations) as LocationString[]
                        : village[property]

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
                if (!player.isValid) {
                    continue
                }

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
                                const blockState = getPathNodeBlockState(village.dimensionId, checkPos)
                                if (blockState === 2) {
                                    nodeColor = BLOCKED_NODE_COLOR
                                }
                                else if (blockState === 1) {
                                    nodeColor = OCCUPIED_NODE_COLOR
                                }
                                else if (node.requirement !== undefined) {
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

interface DiagnosticViewDefinition {
    statName: string
    options: DiagnosticsChartViewOptions | DiagnosticsTableViewOptions
    getStats: () => DiagnosticsStat[]
}

interface DiagnosticFeed {
    view: DiagnosticsView
    getStats: () => DiagnosticsStat[]
}

const diagnosticFeeds: DiagnosticFeed[] = []
let lastDiagnosticUpdate = Date.now()
let diagnosticTickRate = 20
let diagnosticUpdateIntervalMs = 1000
let ticksSinceDiagnosticUpdate = 0

function registerDiagnosticTab(tabName: string, definitions: DiagnosticViewDefinition[]) {
    let tab = diagnosticsManager.tabs.find(candidate => candidate.tabName === tabName)
    tab ??= diagnosticsManager.createTab(tabName)

    for (const [index, definition] of definitions.entries()) {
        let view = tab.views[index]
        if (view === undefined) {
            view = diagnosticsManager.createView(definition.statName, definition.options)
            tab.addView(view)
        }

        diagnosticFeeds.push({ view, getStats: definition.getStats })
    }
}

function tableView(statName: string, labels: string[], getStats: () => DiagnosticsStat[]): DiagnosticViewDefinition {
    return {
        statName,
        options: {
            tableType: DiagnosticsTableDisplayType.MultiColumnTable,
            keyLabel: "Metric",
            valueLabels: labels
        },
        getStats
    }
}

function chartView(statName: string, getStats: () => DiagnosticsStat[]): DiagnosticViewDefinition {
    return {
        statName,
        options: {
            chartType: DiagnosticsChartDisplayType.LineChart,
            yAxisLabel: "Ticks per second",
            targetValue: 20,
            tickRange: 60
        },
        getStats
    }
}

function registerDiagnostics() {
    lastDiagnosticUpdate = Date.now()

    const singleValue = (stats: Array<[string, number | string]>): DiagnosticsStat[] =>
        stats.map(([name, value]) => ({ name, values: [value] }))

    registerDiagnosticTab("Tektopia - Overview", [
        tableView("World overview", ["Value"], () => singleValue([
            ["World data", world.loadedData ? "Loaded" : "Loading"],
            ["Game tick", system.currentTick],
            ["Players", world.getAllPlayers().length],
            ["Villages", world.getVillages().length],
            ["Villagers", world.getVillagers().length]
        ]))
    ])

    registerDiagnosticTab("Tektopia - Performance", [
        tableView("Runtime", ["Value"], () => singleValue([
            ["Estimated tick rate", diagnosticTickRate],
            ["Game tick", system.currentTick],
            ["Update interval (ms)", diagnosticUpdateIntervalMs]
        ])),
        chartView("Tick rate history", () => [{ name: "TPS", values: [diagnosticTickRate] }])
    ])

    registerDiagnosticTab("Tektopia - Villager Population", [
        tableView("Villagers by type", ["Count"], () => {
            const counts = new Map<string, number>()
            for (const villager of world.getVillagers()) {
                counts.set(villager.typeId, (counts.get(villager.typeId) ?? 0) + 1)
            }
            return [...counts]
                .sort(([left], [right]) => left.localeCompare(right))
                .map(([typeId, count]) => ({ name: typeId, values: [count] }))
        })
    ])

    registerDiagnosticTab("Tektopia - Villager State", [
        tableView("Villager states", ["Count", "Percent"], () => {
            const villagers = world.getVillagers().filter(villager => villager.isValid)
            const states: Array<[string, (villager: typeof villagers[number]) => boolean]> = [
                ["Alive", villager => !villager.isDead],
                ["Blocked", villager => villager.isBlocked],
                ["Pathing", villager => villager.isPathing],
                ["Unreachable", villager => villager.unreachable > 0],
                ["Path errors", villager => villager.pathError !== undefined]
            ]
            return states.map(([name, matches]) => {
                const count = villagers.filter(matches).length
                const percent = villagers.length === 0 ? 0 : Math.round((count / villagers.length) * 100)
                return { name, values: [count, `${percent}%`] }
            })
        })
    ])

    registerDiagnosticTab("Tektopia - Villager Issues", [
        tableView("Blocked or failing villagers", ["State", "Details"], () => {
            const villagers = world.getVillagers()
                .filter(villager => villager.isValid && (villager.isBlocked || villager.pathError !== undefined || villager.unreachable > 0))
                .slice(0, 100)
            return villagers.map(villager => ({
                name: villager.nameTag.length > 0 ? villager.nameTag : villager.id,
                values: [
                    villager.isBlocked ? "Blocked" : "Path issue",
                    villager.pathError ?? `Unreachable: ${villager.unreachable}`
                ]
            }))
        })
    ])

    registerDiagnosticTab("Tektopia - Players", [
        tableView("Online players", ["Dimension", "X", "Y", "Z"], () =>
            world.getAllPlayers().map(player => ({
                name: player.name,
                values: [
                    player.dimension.id,
                    Math.floor(player.location.x),
                    Math.floor(player.location.y),
                    Math.floor(player.location.z)
                ]
            })))
    ])

    registerDiagnosticTab("Tektopia - Village Registry", [
        tableView("Village summary", ["Dimension", "Villagers", "Paths", "Structures"], () => {
            const villages = world.getVillages()
            const villagers = world.getVillagers().filter(villager => villager.isValid)
            return villages.map((village, index) => {
                const { start, end } = village.bounds
                const villagerCount = villagers.filter(villager =>
                    villager.dimension.id === village.dimensionId
                    && villager.location.x >= start.x && villager.location.x <= end.x
                    && villager.location.z >= start.z && villager.location.z <= end.z
                ).length
                return {
                    name: `Village ${index + 1} (${village.centerString})`,
                    values: [
                        village.dimensionId,
                        villagerCount,
                        Object.keys(village.pathNodes).length,
                        Object.keys(village.data.structures).length
                    ]
                }
            })
        })
    ])

    registerDiagnosticTab("Tektopia - Path Network", [
        tableView("Path graph by village", ["Nodes", "Neighbor links", "Costed nodes", "Requirements"], () =>
            world.getVillages().map((village, index) => {
                const nodes = Object.values(village.pathNodes)
                return {
                    name: `Village ${index + 1}`,
                    values: [
                        nodes.length,
                        nodes.reduce((total, node) => total + node.neighbors.length, 0),
                        nodes.filter(node => node.cost !== undefined).length,
                        nodes.reduce((total, node) =>
                            total + Number(node.requirement !== undefined) + Object.keys(node.nodeRequirements ?? {}).length, 0)
                    ]
                }
            }))
    ])

    registerDiagnosticTab("Tektopia - Resource Locations", [
        tableView("Tracked resource locations", ["Count"], () => {
            const totals = new Map<string, number>()
            for (const village of world.getVillages()) {
                const resources: Array<[string, number]> = [
                    ["Sugar cane", village.data.sugarCaneLocations.length],
                    ["Saplings", village.data.saplingLocations.length],
                    ["Farm plots", village.data.farmLocations.length],
                    ["Harvest locations", village.data.harvestLocations.length],
                    ["Grow locations", village.data.growLocations.length],
                    ["Till locations", village.data.tillLocations.length],
                    ["Sweet berries", village.data.sweetBerryLocations.length],
                    ["Trees", village.data.treeLocations.length],
                    ["Ore", village.data.oreLocations.length],
                    ["Plants", Object.keys(village.plantLocations).length]
                ]
                for (const [name, count] of resources) {
                    totals.set(name, (totals.get(name) ?? 0) + count)
                }
            }
            return [...totals].map(([name, count]) => ({ name, values: [count] }))
        })
    ])

    registerDiagnosticTab("Tektopia - Structures", [
        tableView("Structures by type", ["Count"], () => {
            const counts = new Map<string, number>()
            for (const village of world.getVillages()) {
                for (const structure of Object.values(village.data.structures)) {
                    counts.set(structure.type, (counts.get(structure.type) ?? 0) + 1)
                }
            }
            return [...counts]
                .sort(([left], [right]) => left.localeCompare(right))
                .map(([type, count]) => ({ name: type, values: [count] }))
        })
    ])

    registerDiagnosticTab("Tektopia - Item Frame Floors", [
        tableView("Frame floor claims", ["Structure", "Structure location", "Claimed floor locations"], () => {
            const villages = world.getVillages()
            return world.itemFrameList.map(itemFrame => {
                const structureLocation = getItemFrameStructureLocation(itemFrame)
                const village = structureLocation === undefined
                    ? undefined
                    : villages.find(candidate =>
                        candidate.dimensionId === itemFrame.dimensionId
                        && candidate.data.structures[structureLocation] !== undefined
                    )
                const floorLocations = structureLocation === undefined || village === undefined
                    ? undefined
                    : village.getClaimedFloorLocations(structureLocation)

                return {
                    name: `${itemFrame.dimensionId} ${locationToString(itemFrame.location)}`,
                    values: [
                        itemFrame.structureId ?? "Unrecognized or unloaded",
                        structureLocation ?? "No validated structure",
                        floorLocations === undefined
                            ? "No current village claim"
                            : floorLocations.length === 0
                                ? "No floor locations"
                                : [...floorLocations].sort().join("; ")
                    ]
                }
            })
        })
    ])

    registerDiagnosticTab("Tektopia - Ranches", [
        tableView("Ranch entities", ["Count", "In pen", "Breedable"], () => {
            const counts = new Map<string, { total: number, inPen: number, breedable: number }>()
            for (const village of world.getVillages()) {
                for (const animal of Object.values(village.ranchEntities)) {
                    const count = counts.get(animal.typeId) ?? { total: 0, inPen: 0, breedable: 0 }
                    count.total++
                    count.inPen += Number(animal.inPen)
                    count.breedable += Number(animal.breedable)
                    counts.set(animal.typeId, count)
                }
            }
            return [...counts]
                .sort(([left], [right]) => left.localeCompare(right))
                .map(([type, count]) => ({
                    name: type,
                    values: [count.total, count.inPen, count.breedable]
                }))
        })
    ])

    registerDiagnosticTab("Tektopia - Debug Flags", [
        tableView("Debug flag switches", ["Enabled"], () =>
            debugFlagNames.map(flag => ({
                name: flag,
                values: [debugFlags[flag] ? "On" : "Off"]
            })))
    ])
}

function updateDiagnostics() {
    if (!world.loadedData) {
        return
    }

    const ticksIntoUpdate = ticksSinceDiagnosticUpdate + 1
    const firstFeedIndex = Math.floor(ticksSinceDiagnosticUpdate * diagnosticFeeds.length / 20)
    const lastFeedIndex = Math.floor(ticksIntoUpdate * diagnosticFeeds.length / 20)
    for (let index = firstFeedIndex; index < lastFeedIndex; index++) {
        const feed = diagnosticFeeds[index]
        if (feed !== undefined) {
            feed.view.pushStats(feed.getStats())
        }
    }

    ticksSinceDiagnosticUpdate = ticksIntoUpdate % 20
    if (ticksSinceDiagnosticUpdate === 0) {
        const now = Date.now()
        diagnosticUpdateIntervalMs = Math.max(1, now - lastDiagnosticUpdate)
        diagnosticTickRate = Math.round((20_000 / diagnosticUpdateIntervalMs) * 10) / 10
        lastDiagnosticUpdate = now
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

world.afterEvents.worldLoad.subscribe(() => {
    main()
})

function main() {
    loadDebugFlags()
    registerDiagnostics()
    system.runInterval(updateDiagnostics)
}
