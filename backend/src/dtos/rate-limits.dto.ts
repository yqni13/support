import { ClientsId } from "../repositories/interfaces/clients.entity.interface"
import { UsersId } from "../repositories/interfaces/users.entity.interface"

export interface RateLimitsCountDTO {
    client_id?: ClientsId,
    user_id?: UsersId,
    day: string
}

export interface RateLimitsCreateDTO {
    client_id: ClientsId,
    user_id: UsersId
}

export interface RateLimitsUpdateDTO {
    client_id: ClientsId,
    user_id: UsersId,
    day?: string,
    last_modified?: string
}

export interface RateLimitsResponseDTO {
    rate_limit_id: number,
    client_id: ClientsId,
    user_id: UsersId,
    day: string,
    count: number,
    last_modified: string
}