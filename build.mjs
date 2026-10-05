import * as esbuild from "esbuild"
import { glob } from "tinyglobby"

const watch = process.argv.includes("--watch")

const entryPoints = await glob([
    "src/**/*.ts",
    "!src/**/*.d.ts"
])

const options = {
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
}

if (watch) {
    const ctx = await esbuild.context(options)
    await ctx.watch()
    console.log("Watching src/ for changes...")
} else {
    await esbuild.build(options)
    console.log("Build complete.")
}