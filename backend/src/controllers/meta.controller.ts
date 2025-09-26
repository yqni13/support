import { NextFunction, Request, Response } from "express";
import metaService from "../services/meta.service";

class MetaController {
    async getMetaData(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await metaService.getMetaData();
            res.send(response);
        } catch(err: any) {
            next(err);
        }
    }
}

export default new MetaController();