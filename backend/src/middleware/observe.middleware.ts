import {
    ClientsBurstLimitRule,
    ClientsDailyLimitRule,
    DemoDailyLimitRule,
    TotalDailyLimitRule,
    UsersBurstLimitRule,
    UsersDailyLimitRule
} from "./rules/rate-limits.rule.middleware";
import { Request, Response, NextFunction } from "express";
import { secrets } from "../utils/secrets.utils";
import { logError } from "../utils/common.utils";
import { RateLimitsEngine } from "./engines/rate-limits.engine.middleware";
import { RateLimitsData, RateLimitsResponse } from "./interfaces/rate-limits.interface.middleware";
import { ExceedMaxEndpointException } from "../utils/exceptions/api.exception";
import { DemoLimitsIncrement, RateLimitsIncrement } from "./adapter/rate-limits.adapter.middleware";
import { penaltyHandler } from "./container/penalty.container.middleware";

export function observe(isDemo: boolean = false) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const rateLimits = !isDemo ? await checkRateLimits(req) : await checkDemoLimits();
            if(rateLimits) {
                await penaltyHandler.apply(rateLimits.penalty);
                throw new ExceedMaxEndpointException(rateLimits.msg, rateLimits.retryAfter);
            }

            // TODO(yqni13): set maintenance mode when exceeding total daily limit (SUPPORT-51)
            // Detect attack => disable application.
            // await metaService.setMaintenanceMode(MaintenanceMode.D013)
            next();
        } catch(err: any) {
            err.status = !err.status ? 429 : err.status;
            logError(
                "OBSERVATION MIDDLEWARE ERROR ON API CALL",
                err.message ? err.message : "SUPPORT_middleware_observe",
                err
            );
            next(err);
        }
    }
}

async function checkRateLimits(req: Request): Promise<RateLimitsResponse | null> {
    const engine = new RateLimitsEngine(
        [
            new ClientsBurstLimitRule(secrets.RATELIMITS_CLIENTSBURSTLIMIT),
            new ClientsDailyLimitRule(secrets.RATELIMITS_CLIENTSDAILYLIMIT),
            new UsersBurstLimitRule(secrets.RATELIMITS_USERSBURSTLIMIT),
            new UsersDailyLimitRule(secrets.RATELIMITS_USERSDAILYLIMIT),
            new TotalDailyLimitRule(secrets.RATELIMITS_TOTALDAILYLIMIT)
        ],
        new RateLimitsIncrement()
    );
    const rateLimitsData: RateLimitsData = {
        client_id: req.apiClients.client_id,
        user_id: req.apiUsers.user_id,
        client: req.apiClients,
        user: req.apiUsers
    };
    return await engine.process(rateLimitsData);
}

async function checkDemoLimits(): Promise<RateLimitsResponse | null> {
    const engine = new RateLimitsEngine(
        [
            new DemoDailyLimitRule(secrets.DEMOLIMITS_TOTALDAILYLIMIT)
        ],
        new DemoLimitsIncrement()
    );
    return await engine.process({ client_id: 'demo', user_id: 'demo'});
}