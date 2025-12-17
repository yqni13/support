import {
    RateLimitsCount,
    RateLimitsData,
    RateLimitsResponse,
    RateLimitsRule
} from "../interfaces/rate-limits.interface.middleware";

export class RateLimitsEngine {

    constructor(
        private rules: RateLimitsRule[],
        private count: RateLimitsCount
    ) {
        //
    }

    async process(data: RateLimitsData): Promise<RateLimitsResponse | null> {
        for(const rule of this.rules) {
            const response = await rule.check(data);
            if(response) {
                return response;
            }
        }
        await this.count.increment(data);
        return null;
    }
}