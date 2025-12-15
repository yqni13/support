import {
    RateLimitsCountDTO,
    RateLimitsResponseDTO,
    RateLimitsCreateUpdateDTO
} from "../dtos/rate-limits.dto";
import rateLimitsModel from "../models/rate-limits.model";
import { RateLimits } from "../repositories/interfaces/rate-limits.entity.interface";
import rateLimitsRepository from "../repositories/rate-limits.repository";
import * as Utils from "../utils/common.utils";

class RateLimitsService {
    private timeMapTargets: string[];

    constructor() {
        this.timeMapTargets = ['last_modified'];
    }

    async getRateLimitCount(dto: RateLimitsCountDTO): Promise<number> {
        const result = await rateLimitsRepository.count(dto);
        return rateLimitsModel.mapCounts(result);
    }

    async createRateLimit(dto: RateLimitsCreateUpdateDTO): Promise<RateLimitsResponseDTO> {
        const entity: Partial<RateLimits> = rateLimitsModel.mapRateLimitsCreateUpdateDTO(dto);
        const result = await rateLimitsRepository.create(entity);
        return Utils.mapObjTimestamps<RateLimitsResponseDTO>(result, this.timeMapTargets);
    }

    async updateRateLimit(dto: RateLimitsCreateUpdateDTO): Promise<RateLimitsResponseDTO | null> {
        const timestamp = new Date();
        dto['day'] = Utils.getDateUTC(timestamp);
        dto['last_modified'] = Utils.getTimestampUTC(timestamp);
        const result = await rateLimitsRepository.update(dto);
        return !result ? null : Utils.mapObjTimestamps<RateLimitsResponseDTO>(result, this.timeMapTargets);
    }
}

export default new RateLimitsService();