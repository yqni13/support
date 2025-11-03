import { NextFunction, Request, Response } from "express";
import metaService from "../services/meta.service";
import { checkValidation } from "../middleware/validation.middleware";
import { MaintenanceResponseDTO, MaintenanceUpdateDTO, MetaResponseDTO, MetaUpdateDTO } from "../dtos/meta.dto";
import { IRepoError } from "../repositories/interfaces/error.repository.interface";

class MetaController {
    async getMetaData(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const id: number = +(req.params.id);
            const response: MetaResponseDTO | IRepoError | null = await metaService.getMetaData(id);
            res.send(response);
        } catch(err: any) {
            next(err);
        }
    }

    async getAllData(req: Request, res: Response, next: NextFunction) {
        try {
            const response: MetaResponseDTO[] | IRepoError | null = await metaService.getAllData();
            res.send(response);
        } catch(err: any) {
            next(err);
        }
    }

    async updateMetaData(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const id: number = +(req.params.id);
            const dto: MetaUpdateDTO = req.body;
            const response: MetaResponseDTO | IRepoError | null = await metaService.updateMetaData(id, dto);
            res.send(response);
        } catch(err: any) {
            next(err);
        }
    }

    async getMaintenanceMode(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const id: number = +(req.params.id);
            const response: MaintenanceResponseDTO | IRepoError | null = await metaService.getMaintenanceMode(id);
            res.send(response);
        } catch(err: any) {
            next(err);
        }
    }

    async setMaintenanceMode(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const id: number = +(req.params.id);
            const dto: MaintenanceUpdateDTO = req.body;
            const response: MaintenanceResponseDTO | IRepoError | null = await metaService.setMaintenanceMode(id, dto);
            res.send(response);
        } catch(err: any) {
            next(err);
        }
    }
}

export default new MetaController();