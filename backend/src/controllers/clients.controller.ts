import { NextFunction, Request, Response } from "express";
import { checkValidation } from "../middleware/validation.middleware";
import { ClientsCreateResponseDTO } from "../dtos/clients.dto";
import { IRepoError } from "../repositories/interfaces/error.repository.interface";
import clientsService from "../services/clients.service";

class ClientsController {
    async createClient(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const name = req.body.name;
            const response: ClientsCreateResponseDTO | IRepoError | null = await clientsService.createClient(name);
            res.send(response);
        } catch(err: any) {
            next(err);
        }
    }
}

export default new ClientsController();