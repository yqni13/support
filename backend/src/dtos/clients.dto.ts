import { ApiKeyStatus } from "../utils/enums/api-key-status.enum";

export interface ClientsUpdateStatusDTO {
    client_id: string,
    status: ApiKeyStatus
}

export interface ClientsUpdateUseDTO {
    client_id: string
}

export interface ClientsExistResponseDTO {
    client_id: string,
    name: string,
    api_key_hash: string,
    status: ApiKeyStatus,
    last_use: string,
    last_modified: string,
    created_on: string
}

export interface ClientsCreateResponseDTO {
    client_id: string,
    name: string,
    api_key: string,
    status: ApiKeyStatus,
    last_use: string,
    last_modified: string,
    created_on: string
}

export interface ClientsResponseStatusDTO {
    client_id: string,
    name: string,
    status: ApiKeyStatus,
    last_use: string,
    last_modified: string,
    created_on: string
}

export interface ClientsResponseUseDTO {
    client_id: string,
    name: string,
    last_use: string,
    last_modified: string,
    created_on: string
}