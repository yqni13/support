import { UserStatus } from "../utils/enums/user-status.enum";
import { Flag } from "../utils/enums/flag.enum";

export interface UsersCreateUpdateDTO {
    email: string,
    status: UserStatus,
    flag: Flag | null,
    last_modified?: string
}

export interface UsersResponseDTO {
    user_id: string,
    email: string,
    status: UserStatus,
    flag: Flag | null,
    last_modified: string,
    created_on: string
}