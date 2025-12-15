export interface RateLimits {
    rate_limit_id: number,
    client_id: string,
    user_id: string,
    day: string,
    count: number,
    last_modified: string
}