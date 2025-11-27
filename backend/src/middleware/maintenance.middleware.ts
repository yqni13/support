import { NextFunction, Request, Response } from "express";
import { MaintenanceException } from "../utils/exceptions/common.exception";
import metaService from "../services/meta.service";
import { MaintenanceResponseDTO } from "../dtos/meta.dto";
import { MaintenanceMode } from "../utils/enums/maintenance-mode.enum";
import { logError } from "../utils/common.utils";

export function maintain() {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            let mode = await metaService.getMaintenanceMode('support');
            mode = !mode ? null : mode as MaintenanceResponseDTO;            
            if(!mode || mode.maintenance_mode !== MaintenanceMode.E000) {
                throw new MaintenanceException(!mode ? MaintenanceMode.D013 : mode.maintenance_mode);
            }
            next();
        } catch(err: any) {
            err.status = 598;
            logError(
                "MAINTENANCE ERROR ON API CALL (Maintenance Middleware)",
                "support_middleware_maintain",
                err
            );
            next(err);
        }
    }
}

