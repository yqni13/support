import { Request, Response, NextFunction } from "express";
import { secrets } from "../utils/secrets.utils";
import { EnvMode } from "../utils/enums/env-mode.enum";
import { ExceedMaxEndpointException } from "../utils/exceptions/api.exception";

export function observe() {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            // Validate rate-limit of client.
            /**
             * validate client daily limit
             * 
             * throw new ExceedMaxEndpointException('support-daily-max-request-client');
             */


            // Validate rate-limit of user:
            /**
             * validate user time interval within same client
             * 
             * validate user time interval of all clients
             * 
             * throw new ExceedMaxEndpointException('support-daily-max-request-user');
             */

            // Detect attack => disable application.
            // await metaService.setMaintenanceMode(MaintenanceMode.A001
            // TODO(yqni13) update MaintenanceMode (A001 => A008)
            
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