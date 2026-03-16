import {
    RateLimitsCountDTO,
    RateLimitsResponseDTO,
    RateLimitsUpdateDTO,
    RateLimitsCreateDTO
} from "../dtos/rate-limits.dto";
import rateLimitsModel from "../models/rate-limits.model";
import { RateLimits } from "../repositories/interfaces/rate-limits.entity.interface";
import rateLimitsRepository from "../repositories/rate-limits.repository";
import * as CommonUtils from "../utils/common.utils";

class RateLimitsService {
    private timeMapTargets: string[];

    constructor() {
        this.timeMapTargets = ['last_modified'];
    }

    async getRateLimitCount(dto: RateLimitsCountDTO): Promise<number> {
        const result: RateLimits[] | null = await rateLimitsRepository.count(dto);
        return rateLimitsModel.mapCounts(result);
        // TODO(yqni13): null-value handling missing!
    }

    async createRateLimit(dto: RateLimitsCreateDTO): Promise<RateLimitsResponseDTO> {
        const entity: Partial<RateLimits> = rateLimitsModel.mapNewEntity(dto);
        const result: RateLimits = await rateLimitsRepository.create(entity);
        return CommonUtils.mapObjTimestamps<RateLimitsResponseDTO>(result, this.timeMapTargets);
        // TODO(yqni13): mapping from entity to dto missing!
    }

    async updateRateLimit(dto: RateLimitsUpdateDTO): Promise<RateLimitsResponseDTO | null> {
        const timestamp = new Date();
        dto['day'] = CommonUtils.getDateUTC(timestamp);
        dto['last_modified'] = CommonUtils.getTimestampUTC(timestamp);
        const result: RateLimits | null = await rateLimitsRepository.update(dto);
        return !result ? null : CommonUtils.mapObjTimestamps<RateLimitsResponseDTO>(result, this.timeMapTargets);
    }
}

export default new RateLimitsService();