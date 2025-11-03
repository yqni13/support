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
            const maintenanceResult = await metaService.getMaintenanceMode(1);
            const mode = !maintenanceResult || Utils.isIRepoError(maintenanceResult) ? null : maintenanceResult as MaintenanceResponseDTO;            
            if(!mode || mode.maintenance_mode !== MaintenanceMode.E000) {
                throw new MaintenanceException(!mode ? MaintenanceMode.D013 : mode.maintenance_mode);
            }
            next();
        } catch(err: any) {
            if(secrets.MODE === EnvMode.DEV || secrets.MODE === EnvMode.TEST) {
                console.log("MAINTENANCE ERROR ON API CALL: ", err.message);
            }
            err.status = 598;
            next(err);
        }
    }
}