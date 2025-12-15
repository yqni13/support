import { RateLimitsCreateUpdateDTO } from "../../dtos/rate-limits.dto";
import rateLimitsService from "../../services/rate-limits.service";
import { RateLimitsData, RateLimitsResponse, RateLimitsRule } from "../interfaces/rate-limits.interface.middleware";

export class RateLimitsEngine {

    constructor(private rules: RateLimitsRule[]) {
        //
    }

    async process(data: RateLimitsData): Promise<RateLimitsResponse | null> {
        const dto: RateLimitsCreateUpdateDTO = { client_id: data.client_id, user_id: data.user_id };
        for(const rule of this.rules) {
            const response = await rule.check(data);
            if(response) {
                return response;
            }
        }
        // Update table 'rate_limits' or create when no entry is found to update.
        const update = await rateLimitsService.updateRateLimit(dto);
        if(!update) {
            await rateLimitsService.createRateLimit(dto);
        }
        return null;
    }
}