import { MetaId } from "../repositories/interfaces/meta.entity.interface"
import { EnvMode } from "../utils/enums/env-mode.enum"
import { MaintenanceMode } from "../utils/enums/maintenance-mode.enum"

export interface MetaUpdateDTO {
    app: string,
    author: string,
    build_on: string,
    environment: EnvMode,
    app_version: string,
    db_version: string,
    docker_image: string,
    docker_version: string,
    jenkins_version: string,
    last_modified?: string
}

export interface MetaResponseDTO {
    id: MetaId,
    app: string,
    author: string,
    build_on: string,
    environment: EnvMode,
    app_version: string,
    db_version: string,
    docker_image: string,
    docker_version: string,
    jenkins_version: string,
    maintenance_mode: MaintenanceMode,
    created_on: string,
    last_modified: string
}

export interface MaintenanceUpdateDTO {
    maintenance_mode: MaintenanceMode,
    last_modified?: string
}

export interface MaintenanceResponseDTO {
    id: MetaId,
    app: string,
    build_on: string,
    maintenance_mode: MaintenanceMode,
    created_on: string,
    last_modified: string
}
