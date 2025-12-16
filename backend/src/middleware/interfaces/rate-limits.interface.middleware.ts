export interface RateLimitsData {
    client_id: string,
    user_id: string,
}

export interface RateLimitsResponse {
    msg: string,
    retryAfter: string
}

export interface RateLimitsRule {
    check(data?: RateLimitsData): Promise<RateLimitsResponse | null>;
}