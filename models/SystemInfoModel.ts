type SystemInfoModel = {
    memory: MemoryInfoModel
    cpu: CPUInfoModel,
    disks: DiskInfoModel[]
}

type MemoryInfoModel = {
    totalMemory: number
    freeMemory: number
    usedMemory: number
}

type CPUInfoModel = {
    cores: number
    brand: string
    speed: number
    currentLoad: number
}

type DiskInfoModel = {
    name: string
    size: number
    usedSize: number
}

export {
    SystemInfoModel,
    MemoryInfoModel,
    CPUInfoModel,
    DiskInfoModel
}