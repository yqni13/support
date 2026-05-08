import { EnvMode } from "../../utils/enums/env-mode.enum"

export interface HealthCheck {
    status: number
}

export interface HealthCheckExtended extends HealthCheck {
    environment: EnvMode,
    db: HealthCheckDatabase,
    memory: HealthCheckMemory,
}

export interface HealthCheckDatabase {
    status: string,
    message?: string
}

export interface HealthCheckMemory {
    heapUsed: string,
    heapTotal: string,
    rss: string
}