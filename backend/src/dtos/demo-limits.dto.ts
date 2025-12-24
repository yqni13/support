export interface DemoLimitsCountDTO {
    day: string
}

export interface DemoLimitsUpdateDTO {
    day: string,
    last_modified: string
}

export interface DemoLimitsResponseDTO {
    demo_limit_id: number,
    day: string,
    count: number,
    last_modified: string
}