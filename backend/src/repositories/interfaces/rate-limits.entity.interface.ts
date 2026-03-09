import { ClientsId } from "./clients.entity.interface";
import { UsersId } from "./users.entity.interface";

export type RateLimitId = number & { readonly brand: unique symbol };

export interface RateLimits {
    rate_limit_id: RateLimitId,
    client_id: ClientsId,
    user_id: UsersId,
    day: string,
    count: number,
    last_modified: string
}