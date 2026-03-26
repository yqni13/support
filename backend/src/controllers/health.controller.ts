import { NextFunction, Request, Response } from "express";
import healthService from "../services/health.service";
import { HealthCheckExtended } from "../services/interfaces/health.interface.service";

class HealthController {
    async getHealthCheck(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json({ status: 200 });
        } catch(err: any) {
            next(err);
        }
    }

    async getHealthCheckDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const response: HealthCheckExtended = await healthService.getHealthCheckDetails();
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }
}

export default new HealthController();