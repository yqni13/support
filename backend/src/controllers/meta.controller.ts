import { NextFunction, Request, Response } from "express";
import metaService from "../services/meta.service";
import { checkValidation } from "../middleware/validation.middleware";
import { MetaFindDTO } from "../dtos/meta.dto";

class MetaController {
    async getMetaData(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const param: MetaFindDTO = { id: +(req.params.id) };
            const response = await metaService.getMetaData(param);
            res.send(response);
        } catch(err: any) {
            next(err);
        }
    }
}

export default new MetaController();