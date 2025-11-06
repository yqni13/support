import { MaintenanceMode } from "../utils/enums/maintenance-mode.enum"

export interface MetaUpdateDTO {
    app: string,
    author: string,
    build_on: string,
    environment: string,
    app_version: string,
    db_version: string,
    docker_image: string,
    docker_version: string,
    jenkins_version: string,
}

export interface MetaResponseDTO {
    id: number,
    app: string,
    author: string,
    build_on: string,
    environment: string,
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
    maintenance_mode: MaintenanceMode
}

export interface MaintenanceResponseDTO {
    id: number,
    app: string,
    build_on: string,
    maintenance_mode: MaintenanceMode,
    created_on: string,
    last_modified: string
}