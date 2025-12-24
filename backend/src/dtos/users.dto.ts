import { UserStatus } from "../utils/enums/user-status.enum";
import { Flag } from "../utils/enums/flag.enum";
import { SingleOrArray } from "../utils/custom-types.utils";

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
    email?: SingleOrArray<string>,
    status?: SingleOrArray<UserStatus>,
    flag?: SingleOrArray<Flag> | null,
    last_modified?: string[],
    created_on?: string[]
}

export interface UsersResponseDTO {
    user_id: string,
    email: string,
    status: UserStatus,
    flag: Flag | null,
    last_modified: string,
    created_on: string
}