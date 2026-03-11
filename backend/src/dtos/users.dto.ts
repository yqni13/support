import { UserStatus } from "../utils/enums/user-status.enum";
import { Flag } from "../utils/enums/flag.enum";
import { UsersId } from "../repositories/interfaces/users.entity.interface";

export interface UsersCreateDTO {
    email: string,
}

export interface UsersUpdateDTO {
    email: string,
    status: UserStatus,
    flag: Flag | null,
    last_modified?: string
}

export interface UsersFlagUpdateDTO {
    flag: Flag | null,
    last_modified?: string
}

export interface UsersFilterDTO {
    email?: string | string[],
    status?: UserStatus | UserStatus[],
    flag?: Flag | Flag[] | null,
    last_modified?: string[],
    created_on?: string[]
}

export interface UsersResponseDTO {
    user_id: UsersId,
    email: string,
    status: UserStatus,
    flag: Flag | null,
    last_modified: string,
    created_on: string
}