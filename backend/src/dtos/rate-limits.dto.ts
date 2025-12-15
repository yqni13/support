export interface RateLimitsCountDTO {
    client_id?: string,
    user_id?: string,
    day: string
}

export interface RateLimitsCreateUpdateDTO {
    client_id: string,
    user_id: string,
    day?: string,
    last_modified?: string
}

export interface RateLimitsResponseDTO {
    rate_limit_id: number,
    client_id: string,
    user_id: string,
    day: string,
    count: number,
    last_modified: string
}