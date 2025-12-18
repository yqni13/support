import { Clients } from "../../repositories/interfaces/clients.entity.interface";
import { Users } from "../../repositories/interfaces/users.entity.interface";
import { Violation } from "../../utils/enums/violations.enum";
import { PenaltyContext } from "./penalties.interface.middleware";

export interface RateLimitsData {
    client_id: string,
    user_id: string,
    client?: Clients,
    user?: Users,
}

export interface RateLimitsResponse {
    msg: string,
    retryAfter: string,
    penalty?: PenaltyContext;
    type?: Violation
}

export interface RateLimitsRule {
    check(data?: RateLimitsData): Promise<RateLimitsResponse | null>;
}

export interface RateLimitsCount {
    increment(data?: RateLimitsData): Promise<void>;
}