import { Request, Response, NextFunction } from "express";
import { secrets } from "../utils/secrets.utils";
import { EnvMode } from "../utils/enums/env-mode.enum";
import { ExceedMaxEndpointException } from "../utils/exceptions/api.exception";

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
            // TODO(yqni13): logging
            if((secrets.ENV_MODE).trim() === EnvMode.DEV || (secrets.ENV_MODE).trim() === EnvMode.TEST) {
                console.log("OBSERVATION ERROR ON API CALL (Observation Middleware): ", err.message);
            }
            err.status = 429;
            next(err);
        }
    }
}