import {
    CommandPermissionLevel,
    CustomCommandParamType,
    type CustomCommandRegistry,
    CustomCommandStatus,
    DimensionTypes,
    type Entity,
    ItemStack,
    type ItemType,
    Player,
    system,
    type Vector3,
    World,
    world
} from "@minecraft/server"

import "./sheepColors"

import "./container_extensions"

import "./item_extensions"

import "./block_extensions"

import "./array_extensions"

import "./villager_extensions"

import "./breed"

import "./saves"

import "./item_frames"

import "./performance"

import "./debug"

import "./minecraft_extensions"

import "./item_entity"

import "./chest"

import {
    blockSounds,
    type SoundEvents
} from "./generated"

import { Registry } from "./registry"

import {
    destroyTree,
    getTrunkBlocks
} from "./tree"

system.beforeEvents.watchdogTerminate.subscribe(event => {
    event.cancel = true
    world.sendMessage(`§cWatch dog tried to terminate: ${event.terminateReason}`)
})

World.prototype.getEntities = function (options) {
    return DimensionTypes.getAll().flatMap(dimension =>
        world.getDimension(dimension.typeId).getEntities(options)
    )
}

world.afterEvents.entityDie.subscribe(event => {
    const deadEntity = event.deadEntity
    deadEntity.isDead = true
})

world.afterEvents.playerSpawn.subscribe(event => {
    const player = event.player
    player.isDead = false
})

const COMMAND_OPENER_ID = "tektopia:command"

system.beforeEvents.startup.subscribe(event => {
    const customCommandRegistry = event.customCommandRegistry

    function registerCommand(...args: Parameters<CustomCommandRegistry["registerCommand"]>) {
        try {
            customCommandRegistry.registerCommand(...args)
        }
        catch (error) {
            console.error(error)
        }
    }

    registerCommand({ name: "tektopia:waila", description: "Get info on the block you are looking", cheatsRequired: true, permissionLevel: CommandPermissionLevel.Admin }, origin => {
        const entity = origin.sourceEntity
        if (entity !== undefined) {
            const block = entity.getBlockFromViewDirection()?.block
            if (block !== undefined) {
                const allStates = block.permutation.getAllStates()
                const formattedStates = JSON.stringify(allStates, null, 2)
                const message = [
                    `Block: ${block.typeId}`,
                    `States: ${formattedStates}`,
                    `Localization: ${block.localizationKey}`,
                    `Item: ${block.getItemStack()?.localizationKey ?? "Unknown"}`
                ].join("\n")

                return { status: CustomCommandStatus.Success, message }
            }
            return { status: CustomCommandStatus.Failure, message: "The target entity is not looking at a block" }
        }
        return { status: CustomCommandStatus.Failure, message: "The target entity is invalid" }
    })

    registerCommand(
        {
            name: "tektopia:give_adv",
            description: "Give items to one or more entities",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                { name: "targets", type: CustomCommandParamType.EntitySelector },
                { name: "item", type: CustomCommandParamType.ItemType }
            ],
            optionalParameters: [
                { name: "amount", type: CustomCommandParamType.Integer }
            ]
        },
        (origin, targets: Entity[], itemType: ItemType, amount = 1) => {
            if (targets.length === 0) {
                return { status: CustomCommandStatus.Failure, message: "No targets matched." }
            }
            if (amount < 1 || amount > 2304) {
                return { status: CustomCommandStatus.Failure, message: "Amount must be between 1 and 2304." }
            }

            system.run(() => {
                for (const entity of targets) {
                    if (!entity.isValid) {
                        continue
                    }

                    const maxStack = new ItemStack(itemType, 1).maxAmount
                    let remaining = amount
                    const container = entity.getComponent("minecraft:inventory")?.container

                    while (remaining > 0) {
                        const count = Math.min(remaining, maxStack)
                        const stack = new ItemStack(itemType, count)
                        remaining -= count

                        const leftover = container !== undefined ? container.addItem(stack) : stack
                        if (leftover !== undefined) {
                            entity.dimension.spawnItem(leftover, entity.location)
                        }
                    }
                }
            })

            return {
                status: CustomCommandStatus.Success,
                message: `Gave ${amount} x ${itemType.id} to ${targets.length} entit${targets.length === 1 ? "y" : "ies"}.`
            }
        }
    )

    registerCommand(
        {
            name: "tektopia:destroy_tree",
            description: "Destroy the tree (trunk, branches and leaves) at a location",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                { name: "location", type: CustomCommandParamType.Location }
            ],
            optionalParameters: [
                { name: "replaceWithSaplings", type: CustomCommandParamType.Boolean }
            ]
        },
        (origin, location: Vector3, replaceWithSaplings: boolean = false) => {
            const dimension = origin.sourceEntity?.dimension ?? origin.sourceBlock?.dimension ?? world.getDimension("overworld")
            const block = dimension.getBlock(location)
            if (block === undefined) {
                return { status: CustomCommandStatus.Failure, message: "That location is not loaded." }
            }
            if (!Registry.logTypes.includes(block.typeId)) {
                return { status: CustomCommandStatus.Failure, message: `${block.typeId} is not a log.` }
            }

            const trunkBlocks = getTrunkBlocks(block)
            const saplingTypeId = block.typeId.replace("_log", "_sapling")

            system.run(() => {
                if (!block.isValid) {
                    return
                }
                destroyTree(block, () => {
                    if (!replaceWithSaplings) {
                        return
                    }
                    for (const trunkBlock of trunkBlocks) {
                        if (trunkBlock.isValid) {
                            trunkBlock.replace(saplingTypeId)
                        }
                    }
                })
            })

            return {
                status: CustomCommandStatus.Success,
                message: `Destroying tree at ${Math.floor(location.x)}, ${Math.floor(location.y)}, ${Math.floor(location.z)}.`
            }
        }
    )

    registerCommand(
        {
            name: "tektopia:grow_tree",
            description: "Grow the sapling at a location into a tree",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                { name: "location", type: CustomCommandParamType.Location }
            ]
        },
        (origin, location: Vector3) => {
            const dimension = origin.sourceEntity?.dimension ?? origin.sourceBlock?.dimension ?? world.getDimension("overworld")
            const block = dimension.getBlock(location)
            if (block === undefined) {
                return { status: CustomCommandStatus.Failure, message: "That location is not loaded." }
            }
            if (!Registry.saplingTypes.includes(block.typeId)) {
                return { status: CustomCommandStatus.Failure, message: `${block.typeId} is not a sapling.` }
            }

            system.run(() => {
                if (block.isValid) {
                    block.growTree()
                }
            })

            return {
                status: CustomCommandStatus.Success,
                message: `Growing tree at ${Math.floor(location.x)}, ${Math.floor(location.y)}, ${Math.floor(location.z)}.`
            }
        }
    )

    registerCommand(
        {
            name: "tektopia:is_tree",
            description: "Test whether the block at a location is the base of a tree, optionally requiring natural leaves",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                { name: "location", type: CustomCommandParamType.Location }
            ],
            optionalParameters: [
                { name: "countLeaves", type: CustomCommandParamType.Boolean }
            ]
        },
        (origin, location: Vector3, countLeaves: boolean = false) => {
            const dimension = origin.sourceEntity?.dimension ?? origin.sourceBlock?.dimension ?? world.getDimension("overworld")
            const block = dimension.getBlock(location)
            if (block === undefined) {
                return { status: CustomCommandStatus.Failure, message: "That location is not loaded." }
            }

            const result = block.isTree(countLeaves)
            return {
                status: CustomCommandStatus.Success,
                message: `${block.typeId} at ${block.x}, ${block.y}, ${block.z}: isTree(${countLeaves}) = ${result}`
            }
        }
    )

    customCommandRegistry.registerEnum("tektopia:property_value_type", [
        "boolean",
        "integer",
        "number",
        "string"
    ])

    registerCommand(
        {
            name: "tektopia:set_property",
            description: "Set a property on one or more entities",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                { name: "targets", type: CustomCommandParamType.EntitySelector },
                { name: "property", type: CustomCommandParamType.String },
                {
                    name: "valueType",
                    type: CustomCommandParamType.Enum,
                    enumName: "tektopia:property_value_type"
                },
                { name: "value", type: CustomCommandParamType.String }
            ]
        },
        (
            origin,
            targets: Entity[],
            property: string,
            valueType: string,
            value: string
        ) => {
            if (targets.length === 0) {
                return {
                    status: CustomCommandStatus.Failure,
                    message: "No targets matched."
                }
            }

            let parsedValue: boolean | number | string

            switch (valueType) {
                case "boolean":
                    if (value !== "true" && value !== "false") {
                        return {
                            status: CustomCommandStatus.Failure,
                            message: "Boolean values must be true or false."
                        }
                    }
                    parsedValue = value === "true"
                    break

                case "integer": {
                    const parsed = Number(value)
                    if (!Number.isInteger(parsed)) {
                        return {
                            status: CustomCommandStatus.Failure,
                            message: "Value must be an integer."
                        }
                    }
                    parsedValue = parsed
                    break
                }

                case "number": {
                    const parsed = Number(value)
                    if (!Number.isFinite(parsed)) {
                        return {
                            status: CustomCommandStatus.Failure,
                            message: "Value must be a finite number."
                        }
                    }
                    parsedValue = parsed
                    break
                }

                case "string":
                    parsedValue = value
                    break

                default:
                    return {
                        status: CustomCommandStatus.Failure,
                        message: `Unknown value type: ${valueType}`
                    }
            }

            system.run(() => {
                for (const entity of targets) {
                    if (!entity.isValid) {
                        continue
                    }

                    try {
                        entity.setProperty(property, parsedValue)
                    }
                    catch (error) {
                        world.sendMessage(
                            `§cFailed to set ${property} on ${entity.typeId}: ${String(error)}`
                        )
                    }
                }
            })

            return {
                status: CustomCommandStatus.Success,
                message: `Setting property "${property}" to ${String(parsedValue)} (${valueType}) on ${targets.length} target(s).`
            }
        }
    )

    registerCommand(
        {
            name: "tektopia:connected_chest",
            description: "Prints the location of the chest connected to the chest at a position (defaults to the block you are looking at)",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
            mandatoryParameters: [
                { name: "position", type: CustomCommandParamType.Location }
            ]
        },
        (origin, position: Vector3) => {
            const player = origin.sourceEntity
            if (!(player instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Must be run by a player" }
            }

            system.run(() => {
                const block = player.dimension.getBlock(position)

                if (block?.chest === undefined) {
                    player.sendMessage("§cNo chest block found")
                    return
                }

                const connected = block.chest.getConnectingChest()
                if (connected === undefined) {
                    player.sendMessage(`§e${block.typeId} at ${block.x}, ${block.y}, ${block.z} has no connected chest`)
                    return
                }

                player.sendMessage(`§a${block.x}, ${block.y}, ${block.z} is connected to ${connected.block.x}, ${connected.block.y}, ${connected.block.z}`)
            })

            return { status: CustomCommandStatus.Success }
        }
    )

    registerCommand(
        {
            name: "tektopia:remove",
            description: "Remove one or more entities without killing them (no death drops or death events)",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                { name: "targets", type: CustomCommandParamType.EntitySelector }
            ]
        },
        (_, targets: Entity[]) => {
            const removable = targets.filter(entity => entity.isValid && !(entity instanceof Player))

            if (removable.length === 0) {
                return { status: CustomCommandStatus.Failure, message: "No removable targets matched." }
            }

            system.run(() => {
                for (const entity of removable) {
                    if (!entity.isValid) {
                        continue
                    }

                    try {
                        entity.remove()
                    }
                    catch (error) {
                        world.sendMessage(`§cFailed to remove ${entity.typeId}: ${String(error)}`)
                    }
                }
            })

            const skipped = targets.length - removable.length
            const skippedMessage = skipped > 0 ? ` (skipped ${skipped} player${skipped === 1 ? "" : "s"}/invalid)` : ""

            return {
                status: CustomCommandStatus.Success,
                message: `Removed ${removable.length} entit${removable.length === 1 ? "y" : "ies"}${skippedMessage}.`
            }
        }
    )

    const soundEventIds = [...new Set(Object.values(blockSounds).flatMap(sounds => Object.keys(sounds)))]
    customCommandRegistry.registerEnum("tektopia:soundevent", soundEventIds)

    registerCommand(
        {
            name: "tektopia:soundevent",
            description: "Play a block sound event (e.g. break, place, chest.open) for the block at a position",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
            mandatoryParameters: [
                { name: "position", type: CustomCommandParamType.Location },
                { name: "tektopia:soundevent", type: CustomCommandParamType.Enum }
            ]
        },
        (origin, position: Vector3, eventId: string) => {
            const dimension = origin.sourceEntity?.dimension ?? origin.sourceBlock?.dimension ?? world.getDimension("overworld")
            const block = dimension.getBlock(position)
            if (block === undefined) {
                return { status: CustomCommandStatus.Failure, message: "That location is not loaded." }
            }
            if (block.isAir) {
                return { status: CustomCommandStatus.Failure, message: "There is no block at that position." }
            }

            system.run(() => {
                if (block.isValid) {
                    block.soundEvent(eventId as SoundEvents)
                }
            })

            return {
                status: CustomCommandStatus.Success,
                message: `Played ${eventId} for ${block.typeId} at ${block.x}, ${block.y}, ${block.z}.`
            }
        }
    )

    customCommandRegistry.registerEnum("tektopia:chestaction", ["open", "close"])

    registerCommand(
        {
            name: "tektopia:chest",
            description: "Open or close the chest at a position",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
            mandatoryParameters: [
                { name: "tektopia:chestaction", type: CustomCommandParamType.Enum },
                { name: "position", type: CustomCommandParamType.Location }
            ]
        },
        (origin, action: string, position: Vector3) => {
            const dimension = origin.sourceEntity?.dimension ?? origin.sourceBlock?.dimension ?? world.getDimension("overworld")
            const block = dimension.getBlock(position)
            if (block === undefined) {
                return { status: CustomCommandStatus.Failure, message: "That location is not loaded." }
            }
            if (block.chest === undefined) {
                return { status: CustomCommandStatus.Failure, message: `${block.typeId} is not a chest.` }
            }

            system.run(() => {
                if (!block.isValid) {
                    return
                }
                if (action === "open") {
                    block.chest?.open(COMMAND_OPENER_ID)
                }
                else {
                    block.chest?.close(COMMAND_OPENER_ID)
                }
            })

            return {
                status: CustomCommandStatus.Success,
                message: `${action === "open" ? "Opened" : "Closed"} chest at ${block.x}, ${block.y}, ${block.z}.`
            }
        }
    )
})
