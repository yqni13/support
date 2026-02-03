import { NextFunction, Request, Response } from "express";
import { MaintenanceException } from "../utils/exceptions/common.exception";
import metaService from "../services/meta.service";
import { MaintenanceResponseDTO } from "../dtos/meta.dto";
import { MaintenanceMode } from "../utils/enums/maintenance-mode.enum";
import { logError } from "../utils/common.utils";

export function maintain() {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            // TODO(yqni13): implement caching meta data (Memcached, Redis, ...) instead db-query
            // https://www.memcached.org/
            let mode = await metaService.getMaintenanceMode('support');
            mode = !mode ? null : mode as MaintenanceResponseDTO;            
            if(!mode || mode.maintenance_mode !== MaintenanceMode.A000) {
                throw new MaintenanceException(!mode ? MaintenanceMode.E013 : mode.maintenance_mode);
            }
            next();
        } catch(err: any) {
            err.status = !err.status ? 598 : err.status;
            logError(
                "MAINTENANCE MIDDLEWARE ERROR ON API CALL",
                "SUPPORT_middleware_maintain",
                err
            );
            next(err);
        }
    }
}

