import {
    CommandPermissionLevel,
    CustomCommandParamType,
    CustomCommandStatus,
    EntityComponentTypes,
    ItemComponentTypes,
    ItemStack,
    Player,
    system,
    world,
    type Container,
    type Entity
} from "@minecraft/server"

interface InventoryView {
    targetId: string
    // The viewer's own inventory, restored on /stop_view or when the target disappears
    original: Array<ItemStack | undefined>
}

const views = new Map<string, InventoryView>()

function getContainer(entity: Entity): Container | undefined {
    const container = entity.getComponent(EntityComponentTypes.Inventory)?.container
    return container?.isValid ? container : undefined
}

function getDamage(item: ItemStack) {
    return item.getComponent(ItemComponentTypes.Durability)?.damage
}

function isSameItem(a: ItemStack | undefined, b: ItemStack | undefined) {
    if (a === undefined || b === undefined) {
        return a === b
    }

    return a.amount === b.amount && a.isStackableWith(b) && getDamage(a) === getDamage(b)
}

function snapshot(container: Container) {
    const items: Array<ItemStack | undefined> = []
    for (let slot = 0; slot < container.size; slot++) {
        items.push(container.getItem(slot)?.clone())
    }
    return items
}

function restore(player: Player, items: Array<ItemStack | undefined>) {
    const container = getContainer(player)
    if (container === undefined) {
        return
    }

    for (let slot = 0; slot < container.size; slot++) {
        container.setItem(slot, items[slot])
    }
}

function stopView(playerId: string, restoreInventory: boolean) {
    const view = views.get(playerId)
    if (view === undefined) {
        return false
    }

    views.delete(playerId)

    if (restoreInventory) {
        const player = world.getEntity(playerId)
        if (player instanceof Player && player.isValid) {
            restore(player, view.original)
        }
    }

    return true
}

system.runInterval(() => {
    for (const [playerId, view] of views) {
        const player = world.getEntity(playerId)
        const target = world.getEntity(view.targetId)

        if (!(player instanceof Player) || !player.isValid) {
            views.delete(playerId)
            continue
        }

        if (target === undefined || !target.isValid) {
            stopView(playerId, true)
            player.sendMessage("§eThe viewed entity is gone; your inventory was restored.")
            continue
        }

        const source = getContainer(target)
        const destination = getContainer(player)
        if (source === undefined || destination === undefined) {
            stopView(playerId, true)
            player.sendMessage("§eThe viewed entity no longer has an inventory; your inventory was restored.")
            continue
        }

        for (let slot = 0; slot < destination.size; slot++) {
            const item = slot < source.size ? source.getItem(slot) : undefined
            if (!isSameItem(destination.getItem(slot), item)) {
                destination.setItem(slot, item)
            }
        }
    }
})

world.afterEvents.playerLeave.subscribe(event => {
    views.delete(event.playerId)
})

system.beforeEvents.startup.subscribe(event => {
    const registry = event.customCommandRegistry

    registry.registerCommand({
        name: "tektopia:view_inv",
        description: "Mirror an entity's inventory into your own every tick",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        cheatsRequired: true,
        mandatoryParameters: [{ name: "entity", type: CustomCommandParamType.EntitySelector }]
    }, (origin, targets: Entity[]) => {
        const viewer = origin.sourceEntity
        if (!(viewer instanceof Player)) {
            return { status: CustomCommandStatus.Failure, message: "This command must be run by a player." }
        }

        if (targets.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No entity matched." }
        }

        if (targets.length > 1) {
            return { status: CustomCommandStatus.Failure, message: "Select exactly one entity." }
        }

        const target = targets[0]
        if (target === undefined || getContainer(target) === undefined) {
            return { status: CustomCommandStatus.Failure, message: `${target?.typeId ?? "Entity"} does not have an inventory component.` }
        }

        if (target.id === viewer.id) {
            return { status: CustomCommandStatus.Failure, message: "You can't view your own inventory." }
        }

        const viewerId = viewer.id
        const targetId = target.id
        const targetName = target.typeId

        system.run(() => {
            const player = world.getEntity(viewerId)
            const playerContainer = player instanceof Player ? getContainer(player) : undefined
            if (playerContainer === undefined) {
                return
            }

            // Switching targets keeps the original snapshot so stop_view still restores the real inventory
            const existing = views.get(viewerId)
            views.set(viewerId, {
                targetId,
                original: existing?.original ?? snapshot(playerContainer)
            })
        })

        return { status: CustomCommandStatus.Success, message: `Viewing the inventory of ${targetName}. Use /tektopia:stop_view to stop.` }
    })

    registry.registerCommand({
        name: "tektopia:stop_view",
        description: "Stop mirroring an entity's inventory and restore your own",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        cheatsRequired: true
    }, origin => {
        const viewer = origin.sourceEntity
        if (!(viewer instanceof Player)) {
            return { status: CustomCommandStatus.Failure, message: "This command must be run by a player." }
        }

        if (!views.has(viewer.id)) {
            return { status: CustomCommandStatus.Failure, message: "You aren't viewing an inventory." }
        }

        const viewerId = viewer.id
        system.run(() => stopView(viewerId, true))

        return { status: CustomCommandStatus.Success, message: "Stopped viewing. Your inventory was restored." }
    })
})