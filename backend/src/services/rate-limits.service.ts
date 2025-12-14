import {
    RateLimitsCountDTO,
    RateLimitsCreateDTO,
    RateLimitsResponseDTO,
    RateLimitsUpdateDTO
} from "../dtos/rate-limits.dto";
import rateLimitsModel from "../models/rate-limits.model";
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

    async createRateLimit(client_id: string, user_id: string): Promise<RateLimitsResponseDTO> {
        const entity: RateLimitsCreateDTO = rateLimitsModel.mapRateLimitsCreateDTO(client_id, user_id);
        const result = await rateLimitsRepository.create(entity);
        return Utils.mapObjTimestamps<RateLimitsResponseDTO>(result, this.timeMapTargets);
    }

    async updateRateLimit(dto: RateLimitsUpdateDTO): Promise<RateLimitsResponseDTO | null> {
        const timestamp = new Date();
        dto['day'] = Utils.getDateUTC(timestamp);
        dto['last_modified'] = Utils.getTimestampUTC(timestamp);
        const result = await rateLimitsRepository.update(dto);
        return !result ? null : Utils.mapObjTimestamps<RateLimitsResponseDTO>(result, this.timeMapTargets);
    }
}

export default new RateLimitsService();