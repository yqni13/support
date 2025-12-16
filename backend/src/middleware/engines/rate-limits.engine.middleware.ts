import { RateLimitsCreateUpdateDTO } from "../../dtos/rate-limits.dto";
import demoLimitsService from "../../services/demo-limits.service";
import rateLimitsService from "../../services/rate-limits.service";
import { RateLimitsData, RateLimitsResponse, RateLimitsRule } from "../interfaces/rate-limits.interface.middleware";

export class RateLimitsEngine {

    constructor(private rules: RateLimitsRule[]) {
        //
    }

    async process(data: RateLimitsData, isDemo: boolean = false): Promise<RateLimitsResponse | null> {
        const dto: RateLimitsCreateUpdateDTO = { client_id: data.client_id, user_id: data.user_id };
        for(const rule of this.rules) {
            const response = await rule.check(data);
            if(response) {
                return response;
            }
        }
        // Update respective table (rate_limits/demo_limits) or create when no entry is found to update.
        const update = !isDemo 
            ? await rateLimitsService.updateRateLimit(dto)
            : await demoLimitsService.updateDemoLimit();
        if(!update) {
            const _ = !isDemo
                ? await rateLimitsService.createRateLimit(dto)
                : await demoLimitsService.createDemoLimit();
        }
        return null;
    }
}