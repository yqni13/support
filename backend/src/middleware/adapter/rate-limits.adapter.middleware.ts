import { RateLimitsCreateDTO, RateLimitsUpdateDTO } from "../../dtos/rate-limits.dto";
import demoLimitsService from "../../services/demo-limits.service";
import rateLimitsService from "../../services/rate-limits.service";
import { RateLimitsCount, RateLimitsData } from "../interfaces/rate-limits.interface.middleware";

export class RateLimitsIncrement implements RateLimitsCount {
    async increment(data: RateLimitsData) {
        const dto: RateLimitsUpdateDTO = data;
        const update = await rateLimitsService.updateRateLimit(data);
        if(!update) {
            await rateLimitsService.createRateLimit(dto as RateLimitsCreateDTO);
        }
    }
}

export class DemoLimitsIncrement implements RateLimitsCount {
    async increment() {
        const update = await demoLimitsService.updateDemoLimit();
        if(!update) {
            await demoLimitsService.createDemoLimit();
        }
    }
}