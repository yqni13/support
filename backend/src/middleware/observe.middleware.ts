import { Request, Response, NextFunction } from "express";
import { logError } from "../utils/common.utils";

export function observe() {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            // Observation engine: check rate-limits
            /**
             * validate client daily limit
             * 
             * validate user daily limit
             * 
             * validate burst limit (number of request within certain time range)
             * 
             * validate payload redundancy (repeating payload in suspicious time range)
             * 
             * throw new ExceedMaxEndpointException();
             */

            // Detect attack => disable application.
            // await metaService.setMaintenanceMode(MaintenanceMode.D013)
            next();
        } catch(err: any) {
            err.status = 429;
            logError(
                "OBSERVATION ERROR ON API CALL (Observation Middleware)",
                "support_middleware_observe",
                err
            );
            next(err);
        }
    }
}