import { ClientsId } from "../repositories/interfaces/clients.entity.interface";
import { ApiKeyStatus } from "../utils/enums/api-key-status.enum";
import { Flag } from "../utils/enums/flag.enum";

export interface ClientsCreateDTO {
    name: string
}

export interface ClientsFlagUpdateDTO {
    flag: Flag | null,
    last_modified?: string
}

export interface ClientsStatusUpdateDTO {
    status: ApiKeyStatus,
    last_modified?: string
}

export interface ClientsLastUseUpdateDTO {
    last_use: string
}

export interface ClientsExistResponseDTO {
    client_id: ClientsId,
    name: string,
    api_key_hash: string,
    status: ApiKeyStatus,
    flag: Flag | null,
    last_use: string,
    last_modified: string,
    created_on: string
}

export interface ClientsCreateResponseDTO {
    client_id: ClientsId,
    name: string,
    api_key: string,
    status: ApiKeyStatus,
    flag: Flag | null,
    last_use: string,
    last_modified: string,
    created_on: string
}

export interface ClientsFlagResponseDTO {
    client_id: ClientsId,
    flag: Flag | null,
    last_use: string,
    last_modified: string,
    created_on: string
}

export interface ClientsStatusResponseDTO {
    client_id: ClientsId,
    name: string,
    status: ApiKeyStatus,
    last_use: string,
    last_modified: string,
    created_on: string
}

export interface ClientsLastUseResponseDTO {
    client_id: ClientsId,
    name: string,
    last_use: string,
    last_modified: string,
    created_on: string
}