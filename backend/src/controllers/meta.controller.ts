import { NextFunction, Request, Response } from "express";
import metaService from "../services/meta.service";
import { checkValidation } from "../middleware/validation.middleware";
import { MaintenanceResponseDTO, MaintenanceUpdateDTO, MetaResponseDTO, MetaUpdateDTO } from "../dtos/meta.dto";
import { MetaId } from "../repositories/interfaces/meta.entity.interface";

class MetaController {
    async getMetaById(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const id = (+req.params.id) as MetaId;
            const response: MetaResponseDTO | null = await metaService.getMetaById(id);
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }

    async getMetaByName(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const name: string = req.params.name;
            const response: MetaResponseDTO | null = await metaService.getMetaByName(name);
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }

    async getAllMeta(req: Request, res: Response, next: NextFunction) {
        try {
            const response: MetaResponseDTO[] | null = await metaService.getAllMeta();
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }

    async patchMeta(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const id = (+req.params.id) as MetaId;
            const dto: MetaUpdateDTO = req.body;
            const response: MetaResponseDTO | null = await metaService.updateMeta(id, dto);
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }

    async getMaintenanceMode(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const name: string = req.params.name;
            const response: MaintenanceResponseDTO | null = await metaService.getMaintenanceMode(name);
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }

    async patchMaintenanceMode(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const id = (+req.params.id) as MetaId;
            const dto: MaintenanceUpdateDTO = req.body;
            const response: MaintenanceResponseDTO | null = await metaService.updateMaintenanceMode(id, dto);
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }
}

export default new MetaController();