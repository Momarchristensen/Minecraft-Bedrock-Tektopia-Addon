import {
    system,
    world
} from "@minecraft/server"

import { debugFlags } from "./debug_flags"

import {
    calculateAverage,
    fix
} from "./utils"

const averageTickRateList: number[] = []
let lastTickTime = Date.now()

system.runInterval(() => {
    const now = Date.now()
    const elapsed = now - lastTickTime
    lastTickTime = now
    if (!debugFlags.tickRateActionBar || !world.loadedData || elapsed <= 0) {
        return
    }
    const tickSpeed = Math.floor(1000 / elapsed)
    averageTickRateList.push(tickSpeed)
    if (averageTickRateList.length > 20) {
        averageTickRateList.shift()
    }
    const averageTickRate = calculateAverage(averageTickRateList)

    const players = world.getAllPlayers()
    for (const player of players) {
        player.onScreenDisplay.setActionBar(fix(averageTickRate).toString())
    }
})
