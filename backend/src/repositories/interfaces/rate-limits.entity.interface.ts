import { ClientsId } from "./clients.entity.interface";
import { UsersId } from "./users.entity.interface";

export interface RateLimits {
    rate_limit_id: number,
    client_id: ClientsId,
    user_id: UsersId,
    day: string,
    count: number,
    last_modified: string
}