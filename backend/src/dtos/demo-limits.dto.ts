import { DemoLimitsId } from "../repositories/interfaces/demo-limits.entity.interface"

export interface DemoLimitsCountDTO {
    day: string
}

export interface DemoLimitsUpdateDTO {
    day: string,
    last_modified: string
}

export interface DemoLimitsResponseDTO {
    demo_limit_id: DemoLimitsId,
    day: string,
    count: number,
    last_modified: string
}