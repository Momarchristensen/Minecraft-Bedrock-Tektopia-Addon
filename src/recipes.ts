import { itemFuelValues } from "./big_variables"

import { Registry } from "./registry"

export interface ItemAmount {
    id: string
    amount: number
}

interface RecipeInput {
    id: string | string[]
    amount: number
}

export interface CraftingRecipe {
    input: RecipeInput[]
    output: ItemAmount
    usesFurnace?: false
}

export interface FurnaceRecipe {
    input: ItemAmount
    output: ItemAmount
    usesFurnace: true
}

export type Recipe = CraftingRecipe | FurnaceRecipe

interface BaseStep {
    output: ItemAmount
    times: number
}

export interface CraftingStep extends BaseStep {
    smelt: false
    input: ItemAmount[]
}

export interface SmeltStep extends BaseStep {
    smelt: true
    input: ItemAmount

    fuel: ItemAmount
}

export type CraftStep = CraftingStep | SmeltStep

interface InternalStep {
    recipe: Recipe
    times: number
    input: ItemAmount[]
    fuel?: ItemAmount
}

interface RecipeIndex {
    byOutput: Map<string, Recipe[]>
    recipes: Recipe[]
    slotCounts: Int32Array
    consumers: Map<string, number[]>
    slotRecipe: number[]
    totalSlots: number
}

let index: RecipeIndex | undefined

const fuelValues = new Map<string, number>(Object.entries(itemFuelValues))
const fuelIds = [...fuelValues.keys()]

function recipeInputs(recipe: Recipe): RecipeInput[] {
    return recipe.usesFurnace ? [recipe.input] : recipe.input
}

function fuelItemsFor(smelts: number, smeltsPerFuel: number): number {

    return Math.max(1, Math.ceil((smelts / smeltsPerFuel) - 1e-9))
}

function idList(id: string | string[]): string[] {
    return typeof id === "string" ? [id] : id
}

function getIndex(): RecipeIndex {
    if (index !== undefined) {
        return index
    }

    const byOutput = new Map<string, Recipe[]>()
    const recipes: Recipe[] = []
    const consumers = new Map<string, number[]>()
    const slotRecipe: number[] = []
    const slotCounts: number[] = []

    for (const recipe of Registry.craftingRecipes) {
        const recipeIndex = recipes.length
        recipes.push(recipe)

        const list = byOutput.get(recipe.output.id)
        if (list === undefined) {
            byOutput.set(recipe.output.id, [recipe])
        }
        else {
            list.push(recipe)
        }

        const requirements: Array<string | string[]> = recipeInputs(recipe)
            .filter(input => input.amount > 0)
            .map(input => input.id)
        if (recipe.usesFurnace) {
            requirements.push(fuelIds)
        }

        let slots = 0
        for (const requirement of requirements) {
            const slot = slotRecipe.length
            slotRecipe.push(recipeIndex)
            slots++
            for (const id of idList(requirement)) {
                const consumersList = consumers.get(id)
                if (consumersList === undefined) {
                    consumers.set(id, [slot])
                }
                else {
                    consumersList.push(slot)
                }
            }
        }
        slotCounts.push(slots)
    }

    index = {
        byOutput,
        recipes,
        slotCounts: Int32Array.from(slotCounts),
        consumers,
        slotRecipe,
        totalSlots: slotRecipe.length
    }
    return index
}

export function resetRecipeCache(): void {
    index = undefined
}

function getRecipesFor(itemId: string): Recipe[] {
    return getIndex().byOutput.get(itemId) ?? []
}

function computeReachable(initial: Record<string, number>): Set<string> {
    const { recipes, slotCounts, consumers, slotRecipe, totalSlots } = getIndex()
    const reachable = new Set<string>()
    const queue: string[] = []
    const remaining = Int32Array.from(slotCounts)
    const slotDone = new Uint8Array(totalSlots)

    const mark = (id: string) => {
        if (!reachable.has(id)) {
            reachable.add(id)
            queue.push(id)
        }
    }

    for (const [id, count] of Object.entries(initial)) {
        if (count > 0) {
            mark(id)
        }
    }
    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i]
        if (recipe !== undefined && remaining[i] === 0) {
            mark(recipe.output.id)
        }
    }

    while (queue.length > 0) {
        const id = queue.pop() as string
        const slots = consumers.get(id)
        if (slots === undefined) {
            continue
        }
        for (const slot of slots) {
            if (slotDone[slot] === 1) {
                continue
            }
            slotDone[slot] = 1
            const recipeIndex = slotRecipe[slot]
            if (recipeIndex === undefined) {
                continue
            }
            const recipe = recipes[recipeIndex]
            const left = (remaining[recipeIndex] ?? 0) - 1
            remaining[recipeIndex] = left
            if (left === 0 && recipe !== undefined) {
                mark(recipe.output.id)
            }
        }
    }
    return reachable
}

function isViable(recipe: Recipe, reachable: Set<string>): boolean {
    if (recipe.usesFurnace && !fuelIds.some(id => reachable.has(id))) {
        return false
    }
    for (const input of recipeInputs(recipe)) {
        if (input.amount <= 0) {
            continue
        }
        if (typeof input.id === "string") {
            if (!reachable.has(input.id)) {
                return false
            }
        }
        else if (!input.id.some(id => reachable.has(id))) {
            return false
        }
    }
    return true
}

interface PlanState {
    counts: Map<string, number>
    steps: InternalStep[]
    journalIds: string[]
    journalPrev: number[]
}

interface Context {
    initial: Record<string, number>
    reachable: Set<string> | undefined
    visiting: Set<string>
    record: boolean
}

function getCount(state: PlanState, id: string): number {
    return state.counts.get(id) ?? 0
}

function setCount(state: PlanState, id: string, value: number): void {
    state.journalIds.push(id)
    state.journalPrev.push(state.counts.get(id) ?? 0)
    state.counts.set(id, value)
}

function rollback(state: PlanState, journalMark: number, stepMark: number): void {
    const { journalIds, journalPrev, counts } = state
    for (let i = journalIds.length - 1; i >= journalMark; i--) {
        const id = journalIds[i]
        const prev = journalPrev[i]
        if (id !== undefined && prev !== undefined) {
            counts.set(id, prev)
        }
    }
    journalIds.length = journalMark
    journalPrev.length = journalMark
    state.steps.length = stepMark
}

function createState(itemCounts: Record<string, number>): PlanState {
    return {
        counts: new Map(Object.entries(itemCounts)),
        steps: [],
        journalIds: [],
        journalPrev: []
    }
}

function learn(ctx: Context): Set<string> {
    ctx.reachable ??= computeReachable(ctx.initial)
    return ctx.reachable
}

function mergeItems(items: ItemAmount[]): ItemAmount[] {
    const merged = new Map<string, number>()
    for (const { id, amount } of items) {
        merged.set(id, (merged.get(id) ?? 0) + amount)
    }
    return [...merged].map(([id, amount]) => ({ id, amount }))
}

function takeFuel(smelts: number, state: PlanState): ItemAmount | undefined {
    let best: (ItemAmount & { waste: number }) | undefined
    for (const [id, held] of state.counts) {
        const value = fuelValues.get(id)
        if (value === undefined || held <= 0) {
            continue
        }
        const amount = fuelItemsFor(smelts, value)
        if (amount > held) {
            continue
        }
        const waste = (amount * value) - smelts
        if (
            best === undefined
            || amount < best.amount
            || (amount === best.amount && (waste < best.waste || (waste === best.waste && id < best.id)))
        ) {
            best = { id, amount, waste }
        }
    }
    if (best === undefined) {
        return undefined
    }
    setCount(state, best.id, getCount(state, best.id) - best.amount)
    return { id: best.id, amount: best.amount }
}

function obtain(itemId: string, amount: number, state: PlanState, ctx: Context): boolean {
    const have = getCount(state, itemId)
    const used = Math.min(have, amount)
    const missing = amount - used

    if (missing <= 0) {
        setCount(state, itemId, have - used)
        return true
    }

    if (ctx.visiting.has(itemId)) {
        return false
    }

    const recipes = getRecipesFor(itemId)
    if (recipes.length === 0) {
        return false
    }
    if (ctx.reachable !== undefined && !ctx.reachable.has(itemId)) {
        return false
    }

    ctx.visiting.add(itemId)
    const journalMark = state.journalIds.length
    const stepMark = state.steps.length

    try {
        for (const recipe of recipes) {
            if (ctx.reachable !== undefined && !isViable(recipe, ctx.reachable)) {
                continue
            }

            const times = Math.ceil(missing / recipe.output.amount)
            setCount(state, itemId, 0)

            const consumed: ItemAmount[] | undefined = ctx.record ? [] : undefined
            let ok = true
            for (const input of recipeInputs(recipe)) {
                if (!obtainInput(input.id, input.amount * times, state, ctx, consumed)) {
                    ok = false
                    break
                }
            }

            let fuel: ItemAmount | undefined
            if (ok && recipe.usesFurnace) {
                fuel = takeFuel(recipe.input.amount * times, state)
                ok = fuel !== undefined
            }

            if (ok) {
                if (consumed !== undefined) {
                    state.steps.push({ recipe, times, input: mergeItems(consumed), ...fuel !== undefined && { fuel } })
                }
                setCount(state, itemId, getCount(state, itemId) + (times * recipe.output.amount) - missing)
                return true
            }

            rollback(state, journalMark, stepMark)

            if (!learn(ctx).has(itemId)) {
                return false
            }
        }
        return false
    }
    finally {
        ctx.visiting.delete(itemId)
    }
}

function obtainInput(
    ids: string | string[],
    amount: number,
    state: PlanState,
    ctx: Context,
    sink: ItemAmount[] | undefined
): boolean {
    if (typeof ids === "string") {
        if (!obtain(ids, amount, state, ctx)) {
            return false
        }
        sink?.push({ id: ids, amount })
        return true
    }

    const journalMark = state.journalIds.length
    const stepMark = state.steps.length
    const used: ItemAmount[] | undefined = sink !== undefined ? [] : undefined
    let remaining = amount

    const byHeld = ids.length > 1
        ? [...ids].sort((a, b) => getCount(state, b) - getCount(state, a))
        : ids
    for (const id of byHeld) {
        if (remaining <= 0) {
            break
        }
        const held = getCount(state, id)
        const take = Math.min(held, remaining)
        if (take > 0) {
            setCount(state, id, held - take)
            used?.push({ id, amount: take })
            remaining -= take
        }
    }

    if (remaining > 0) {
        let crafted = false
        for (const id of byHeld) {
            if (ctx.reachable !== undefined && !ctx.reachable.has(id)) {
                continue
            }
            if (obtain(id, remaining, state, ctx)) {
                used?.push({ id, amount: remaining })
                crafted = true
                break
            }
            learn(ctx)
        }
        if (!crafted) {
            rollback(state, journalMark, stepMark)
            return false
        }
    }

    if (sink !== undefined && used !== undefined) {
        sink.push(...used)
    }
    return true
}

export function getCraftingPlan(
    itemId: string,
    itemCounts: Record<string, number>,
    amount = 1
): CraftStep[] | undefined {
    const state = createState(itemCounts)
    const ctx: Context = { initial: itemCounts, reachable: undefined, visiting: new Set(), record: true }
    return obtain(itemId, amount, state, ctx) ? mergeSteps(state.steps) : undefined
}

interface MergedStep {
    recipe: Recipe
    times: number

    input: Map<string, number>

    fuelId?: string
}

function splitPerCraft(step: InternalStep): Array<{ times: number, input: Map<string, number> }> {
    const totals = new Map(mergeItems(step.input).map(item => [item.id, item.amount] as const))
    const groups = new Map<string, { times: number, input: Map<string, number> }>()
    for (let craft = 0; craft < step.times; craft++) {
        const input = new Map<string, number>()
        for (const [id, total] of totals) {
            const amount = Math.floor(total / step.times) + (craft < total % step.times ? 1 : 0)
            if (amount > 0) {
                input.set(id, amount)
            }
        }
        const key = JSON.stringify([...input].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0))
        const group = groups.get(key)
        if (group === undefined) {
            groups.set(key, { times: 1, input })
        }
        else {
            group.times++
        }
    }
    return [...groups.values()]
}

function mergeSteps(steps: InternalStep[]): CraftStep[] {
    const byRecipe = new Map<Recipe, Map<string, MergedStep>>()
    for (const step of steps) {
        let variants = byRecipe.get(step.recipe)
        if (variants === undefined) {
            variants = new Map()
            byRecipe.set(step.recipe, variants)
        }
        for (const part of splitPerCraft(step)) {
            const inputKey = JSON.stringify([...part.input].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0))
            const key = step.fuel === undefined ? inputKey : `${inputKey}|${step.fuel.id}`
            const entry = variants.get(key)
            if (entry === undefined) {
                variants.set(key, {
                    recipe: step.recipe,
                    times: part.times,
                    input: part.input,
                    ...step.fuel !== undefined && { fuelId: step.fuel.id }
                })
            }
            else {
                entry.times += part.times
            }
        }
    }
    const merged = [...byRecipe.values()].flatMap(variants => [...variants.values()])

    const producers = new Map<string, MergedStep[]>()
    for (const entry of merged) {
        const list = producers.get(entry.recipe.output.id)
        if (list === undefined) {
            producers.set(entry.recipe.output.id, [entry])
        }
        else {
            list.push(entry)
        }
    }

    const ordered: CraftStep[] = []
    const visited = new Set<MergedStep>()

    const visit = (step: MergedStep) => {
        if (visited.has(step)) {
            return
        }
        visited.add(step)
        const dependencies = step.fuelId === undefined ? [...step.input.keys()] : [...step.input.keys(), step.fuelId]
        for (const id of dependencies) {
            const makers = producers.get(id)
            if (makers !== undefined) {
                for (const maker of makers) {
                    visit(maker)
                }
            }
        }

        const output = { ...step.recipe.output }
        const recipe = step.recipe

        if (recipe.usesFurnace && step.fuelId !== undefined) {

            const smelts = recipe.input.amount * step.times
            ordered.push({
                input: { ...recipe.input },
                output,
                times: step.times,
                smelt: true,
                fuel: { id: step.fuelId, amount: fuelItemsFor(smelts, fuelValues.get(step.fuelId) ?? 1) }
            })
        }
        else {
            ordered.push({
                input: [...step.input].map(([id, amount]) => ({ id, amount })),
                output,
                times: step.times,
                smelt: false
            })
        }
    }

    for (const entry of merged) {
        visit(entry)
    }
    return ordered
}

export function getRequiredItems(plan: CraftStep[]): Record<string, number> {
    const net: Record<string, number> = {}
    for (const step of plan) {
        const inputs = step.smelt ? [step.input] : step.input
        for (const { id, amount } of inputs) {
            net[id] = (net[id] ?? 0) + (amount * step.times)
        }
        if (step.smelt) {

            net[step.fuel.id] = (net[step.fuel.id] ?? 0) + step.fuel.amount
        }
        net[step.output.id] = (net[step.output.id] ?? 0) - (step.output.amount * step.times)
    }

    const required: Record<string, number> = {}
    for (const [id, amount] of Object.entries(net)) {
        if (amount > 0) {
            required[id] = amount
        }
    }
    return required
}

export function canCraft(itemId: string, itemCounts: Record<string, number>, amount = 1): boolean {
    const state = createState(itemCounts)
    const ctx: Context = { initial: itemCounts, reachable: undefined, visiting: new Set(), record: false }
    return obtain(itemId, amount, state, ctx)
}

const UNBOUNDED_LIMIT = (2 ** 31) - 1

export function getMaxCrafts(itemId: string, itemCounts: Record<string, number>, max = Infinity): number {
    const cap = Math.min(Math.floor(max), UNBOUNDED_LIMIT)
    if (!(cap >= 1) || !canCraft(itemId, itemCounts, 1)) {
        return 0
    }

    let good = 1
    let bad = 0
    while (good < cap) {
        const next = Math.min(good * 2, cap)
        if (canCraft(itemId, itemCounts, next)) {
            good = next
        }
        else {
            bad = next
            break
        }
    }
    if (bad === 0) {
        return good
    }

    while (bad - good > 1) {
        const mid = good + Math.floor((bad - good) / 2)
        if (canCraft(itemId, itemCounts, mid)) {
            good = mid
        }
        else {
            bad = mid
        }
    }
    return good
}
