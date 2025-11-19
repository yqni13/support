import { Flag } from "../../utils/enums/flag.enum";
import { UserStatus } from "../../utils/enums/user-status.enum";

export interface Users {
    user_id: string,
    email: string,
    status: UserStatus,
    flag: Flag | null,
    last_modified: string,
    created_on: string
}