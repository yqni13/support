import { NextFunction, Request, Response } from "express";
import { secrets } from "../utils/secrets.utils";
import { EnvMode } from "../utils/enums/env-mode.enum";
import { MaintenanceException } from "../utils/exceptions/common.exception";
import metaService from "../services/meta.service";
import * as Utils from "../utils/common.utils";
import { MaintenanceResponseDTO } from "../dtos/meta.dto";
import { MaintenanceMode } from "../utils/enums/maintenance-mode.enum";

export function maintain() {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            let mode = await metaService.getMaintenanceMode('support');
            mode = !mode || Utils.isIRepoError(mode) ? null : mode as MaintenanceResponseDTO;            
            if(!mode || mode.maintenance_mode !== MaintenanceMode.E000) {
                throw new MaintenanceException(!mode ? MaintenanceMode.D013 : mode.maintenance_mode);
            }
            next();
        } catch(err: any) {
            // TODO(yqni13): logging
            if(secrets.ENV_MODE.trim() === EnvMode.DEV || secrets.ENV_MODE.trim() === EnvMode.TEST) {
                console.log("MAINTENANCE ERROR ON API CALL (Maintenance Middleware): ", err.message);
            }
            err.status = 598;
            next(err);
        }
    }
}

