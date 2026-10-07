import {
    Entity,
    EntityComponentTypes,
    ItemStack
} from "@minecraft/server"

declare module "@minecraft/server" {
    interface Entity {
        getWoolItem(): ItemStack | undefined
    }
}

const enum Dye {
    White = 0,
    Orange = 1,
    Magenta = 2,
    LightBlue = 3,
    Yellow = 4,
    Lime = 5,
    Pink = 6,
    Gray = 7,
    LightGray = 8,
    Cyan = 9,
    Purple = 10,
    Blue = 11,
    Brown = 12,
    Green = 13,
    Red = 14,
    Black = 15
}

const WOOL_BY_COLOR: readonly string[] = [
    "minecraft:white_wool",
    "minecraft:orange_wool",
    "minecraft:magenta_wool",
    "minecraft:light_blue_wool",
    "minecraft:yellow_wool",
    "minecraft:lime_wool",
    "minecraft:pink_wool",
    "minecraft:gray_wool",
    "minecraft:light_gray_wool",
    "minecraft:cyan_wool",
    "minecraft:purple_wool",
    "minecraft:blue_wool",
    "minecraft:brown_wool",
    "minecraft:green_wool",
    "minecraft:red_wool",
    "minecraft:black_wool"
]

function pairKey(a: number, b: number): number {
    return a < b ? (a * 16) + b : (b * 16) + a
}

const MIX_RESULTS: ReadonlyMap<number, number> = new Map<number, number>([
    [pairKey(Dye.Red, Dye.Yellow), Dye.Orange],
    [pairKey(Dye.Red, Dye.White), Dye.Pink],
    [pairKey(Dye.Green, Dye.White), Dye.Lime],
    [pairKey(Dye.Blue, Dye.White), Dye.LightBlue],
    [pairKey(Dye.Black, Dye.White), Dye.Gray],
    [pairKey(Dye.Gray, Dye.White), Dye.LightGray],
    [pairKey(Dye.Blue, Dye.Green), Dye.Cyan],
    [pairKey(Dye.Blue, Dye.Red), Dye.Purple],
    [pairKey(Dye.Purple, Dye.Pink), Dye.Magenta]
])

export function getMixedColor(color1: number, color2: number): number {
    const mixed = MIX_RESULTS.get(pairKey(color1, color2))
    if (mixed !== undefined) {
        return mixed
    }

    return Math.random() < 0.5 ? color1 : color2
}

Entity.prototype.getWoolItem = function (this: Entity): ItemStack | undefined {
    if (this.typeId !== "minecraft:sheep") {
        return undefined
    }

    const entityColor = this.getComponent(EntityComponentTypes.Color)?.value ?? 0
    const woolId = WOOL_BY_COLOR[entityColor]
    if (woolId === undefined) {
        return undefined
    }

    return new ItemStack(woolId, 1)
}
