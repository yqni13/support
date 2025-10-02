import { NextFunction, Request, Response } from "express";
import metaService from "../services/meta.service";
import { checkValidation } from "../middleware/validation.middleware";
import { MetaFindDTO, MetaResponseDTO, MetaUpdateDTO } from "../dtos/meta.dto";
import { IRepoError } from "../repositories/interfaces/base.repository.interface";

class MetaController {
    async getMetaData(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const param: MetaFindDTO = { id: +(req.params.id) };
            const response: MetaResponseDTO | IRepoError | null = await metaService.getMetaData(param);
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
}

export default new MetaController();