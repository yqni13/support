import { MaintenanceMode } from "../../utils/enums/maintenance-mode.enum";

export interface Meta {
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

export interface Maintenance {
    id: number,
    build_on: string,
    maintenance_mode: MaintenanceMode,
    created_on: string,
    last_modified: string
}