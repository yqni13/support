import { Flag } from "../../utils/enums/flag.enum";
import { UserStatus } from "../../utils/enums/user-status.enum";

export type UsersId = string & { readonly brand: unique symbol };

export interface Users {
    user_id: UsersId,
    email: string,
    status: UserStatus,
    flag: Flag | null,
    last_modified: string,
    created_on: string
}