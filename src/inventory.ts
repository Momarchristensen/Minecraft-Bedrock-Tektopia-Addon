import type { Container } from "@minecraft/server"

class Inventory {
    private containers

    constructor(containers: Container[]) {
        this.containers = containers
    }
}
//todo
