import {
    system,
    world
} from "@minecraft/server"

import {
    calculateAverage,
    fix
} from "./utils"

const averageTickRateList: number[] = []
let lastTickTime = Date.now()

system.runInterval(() => {
    if (!world.loadedData) {
        return
    }
    const tickSpeed = Math.floor(1000 / (Date.now() - lastTickTime))
    lastTickTime = Date.now()
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
