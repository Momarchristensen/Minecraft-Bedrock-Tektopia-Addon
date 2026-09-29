import * as esbuild from "esbuild"
import { glob } from "tinyglobby"

const entryPoints = await glob([
    "src/**/*.ts",
    "!src/**/*.d.ts"
])

const ctx = await esbuild.context({
    entryPoints,

    bundle: true,
    format: "esm",

    external: [
        "@minecraft/server",
        "@minecraft/server-ui"
    ],

    outdir: "behavior_packs/Tektopia/scripts",
    outbase: "src",

    sourcemap: true,
    sourcesContent: true
})

await ctx.watch()

console.log("Watching src/ for changes...")