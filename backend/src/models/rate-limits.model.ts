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

    mapRateLimitsCreateDTO(client_id: string, user_id: string): RateLimitsCreateDTO {
        const timestamp = new Date();
        return {
            client_id: client_id,
            user_id: user_id,
            day: getDateUTC(timestamp),
            last_modified: getTimestampUTC(timestamp)
        };
    }
}

export default new RateLimitsModel();