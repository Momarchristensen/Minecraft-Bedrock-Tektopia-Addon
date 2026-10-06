import {
    DimensionTypes,
    system,
    World,
    world
} from "@minecraft/server"

import "./block_extensions"

import "./array_extensions"

import "./villager_extensions"

import "./breed"

import "./saves"

import "./item_frames"

import "./performance"

import "./debug"

import "./minecraft_extensions"

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
