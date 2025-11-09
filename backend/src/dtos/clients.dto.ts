import { ApiKeyStatus } from "../utils/enums/api-key-status.enum";

export interface ClientsStatusUpdateDTO {
    status: ApiKeyStatus
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

export interface ClientsStatusResponseDTO {
    client_id: string,
    name: string,
    status: ApiKeyStatus,
    last_use: string,
    last_modified: string,
    created_on: string
}

export interface ClientsLastUseResponseDTO {
    client_id: string,
    name: string,
    last_use: string,
    last_modified: string,
    created_on: string
}