export interface RateLimitsData {
    client_id: string,
    user_id: string,
    user_email: string,
    last_modified: string,
    created_on: string
}

export interface RateLimitsResponse {
    msg: string,
    retryAfter?: string
}

export interface RateLimitsRule {
    check(data: RateLimitsData): Promise<RateLimitsResponse | null>;
}