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

export interface ClientsResponseDTO {
    client_id: ClientsId,
    name: string,
    status: ApiKeyStatus,
    flag: Flag | null,
    last_use: string,
    last_modified: string,
    created_on: string
}

export interface ClientsExtendedResponseDTO extends ClientsResponseDTO{
    api_key_hash: string
}