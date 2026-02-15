import { NextFunction, Request, Response } from "express";
import { MaintenanceException } from "../utils/exceptions/common.exception";
import metaService from "../services/meta.service";
import { MaintenanceResponseDTO } from "../dtos/meta.dto";
import { MaintenanceMode } from "../utils/enums/maintenance-mode.enum";
import { logError } from "../utils/common.utils";
import * as CommonUtils from "../utils/common.utils";

export function maintain() {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            // TODO(yqni13): implement caching meta data (Memcached, Redis, ...) instead db-query
            // https://www.memcached.org/
            let maintenance = await metaService.getMaintenanceMode('support');
            if(maintenance && maintenance.maintenance_mode === MaintenanceMode.T011) {
                maintenance = await updateTrafficError(maintenance);
            }
            if(!maintenance || maintenance.maintenance_mode !== MaintenanceMode.A000) {
                throw new MaintenanceException(!maintenance ? MaintenanceMode.E013 : maintenance.maintenance_mode);
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

export async function updateTrafficError(maintenanceData: MaintenanceResponseDTO)
: Promise<MaintenanceResponseDTO | null> {
    const nextDay = new Date(CommonUtils.getNextDayUTC(new Date(maintenanceData.last_modified)));
    if(CommonUtils.now() >= nextDay) {
        return await metaService.updateMaintenanceMode(maintenanceData.id, {maintenance_mode: MaintenanceMode.A000});
    }
    return maintenanceData;
}

