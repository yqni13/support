export interface MetaFindDTO {
    id: number
}

export interface MetaUpdateDTO {
    id: number,
    app: string,
    author: string,
    build_on: string,
    environment: string,
    app_version: string,
    db_version: string,
    docker_image: string,
    docker_version: string,
    jenkins_version: string
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
    jenkins_version: string
}