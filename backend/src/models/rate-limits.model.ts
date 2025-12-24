import { RateLimitsCreateDTO } from "../dtos/rate-limits.dto";
import { RateLimits } from "../repositories/interfaces/rate-limits.entity.interface";
import { getDateUTC, getTimestampUTC } from "../utils/common.utils";

class RateLimitsModel {
    mapCounts(data: RateLimits[] | null): number {
        if(!data || data.length === 0) {
            return 0;
        }
        let count = 0;
        data.forEach((entry) => {
            count += entry.count;
        })
        return count;
    }

    mapNewEntity(dto: RateLimitsCreateDTO): Partial<RateLimits> {
        const timestamp = new Date();
        return {
            client_id: dto.client_id,
            user_id: dto.user_id,
            day: getDateUTC(timestamp),
            count: 1,
            last_modified: getTimestampUTC(timestamp)
        };
    }
}

export default new RateLimitsModel();