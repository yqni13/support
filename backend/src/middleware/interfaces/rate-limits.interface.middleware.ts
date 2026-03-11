import { Clients, ClientsId } from "../../repositories/interfaces/clients.entity.interface";
import { Users, UsersId } from "../../repositories/interfaces/users.entity.interface";
import { PenaltyContext } from "./penalties.interface.middleware";

export interface RateLimitsData {
    client_id: ClientsId,
    user_id: UsersId,
    client?: Clients,
    user?: Users,
}

export interface RateLimitsResponse {
    msg: string,
    retryAfter: string,
    penalty?: PenaltyContext;
}

export interface RateLimitsRule {
    check(data?: RateLimitsData): Promise<RateLimitsResponse | null>;
}

export interface RateLimitsCount {
    increment(data?: RateLimitsData): Promise<void>;
}