export const debugFlags = {
    locationScanParticles: false,
    searchBlocksParticles: false,
    pathNodeParticles: false,
    villageLocationParticles: false,
    villagerDebugNameTags: false,
    rancherDebugNameTags: false,
    structureScanParticles: false,
    pathScanParticles: false,
    villagerPathParticles: false,
    pathfindingWarnings: false,
    depositWarnings: false,
    nodeUpdatedWarnings: false,
    rancherPenParticles: false
}

export type DebugFlag = keyof typeof debugFlags

export const debugFlagNames = Object.keys(debugFlags) as DebugFlag[]
