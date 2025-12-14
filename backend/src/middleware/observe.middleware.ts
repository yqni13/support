import {
    ClientsBurstLimitRule,
    ClientsDailyLimitRule,
    TotalDailyLimitRule,
    UsersBurstLimitRule,
    UsersDailyLimitRule
} from "./rules/rate-limits.rule.middleware";
import { Request, Response, NextFunction } from "express";
import { secrets } from "../utils/secrets.utils";
import { logError } from "../utils/common.utils";
import { RateLimitsEngine } from "./engines/rate-limits.engine.middleware";
import { RateLimitsData } from "./interfaces/rate-limits.interface.middleware";
import { ExceedMaxEndpointException } from "../utils/exceptions/api.exception";

export function observe() {
    return async function (req: Request, res: Response, next: NextFunction) {
        // TODO(yqni13): handle /meta/demo seperately (SUPPORT-46)
        try {
            // TODO(yqni13): update status of clients and flag of users on violations (SUPPORT-45)
            const engine = new RateLimitsEngine([
                new ClientsBurstLimitRule(secrets.RATELIMITS_CLIENTSBURSTLIMIT),
                new ClientsDailyLimitRule(secrets.RATELIMITS_CLIENTSDAILYLIMIT),
                new UsersBurstLimitRule(secrets.RATELIMITS_USERSBURSTLIMIT),
                new UsersDailyLimitRule(secrets.RATELIMITS_USERSDAILYLIMIT),
                new TotalDailyLimitRule(secrets.RATELIMITS_TOTALDAILYLIMIT)
            ]);
            const rateLimitsData: RateLimitsData = {
                client_id: req.apiClients.client_id,
                user_id: req.apiUsers.user_id
            };
            const rateLimits = await engine.process(rateLimitsData);
            if(rateLimits) {
                throw new ExceedMaxEndpointException(rateLimits.msg);
            }

            // TODO(yqni13): set maintenance mode when exceeding total daily limit (SUPPORT-45)
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