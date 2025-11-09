import { NextFunction, Request, Response } from "express";
import { checkValidation } from "../middleware/validation.middleware";
import { ClientsCreateResponseDTO, ClientsStatusResponseDTO, ClientsStatusUpdateDTO } from "../dtos/clients.dto";
import { IRepoError } from "../repositories/interfaces/error.repository.interface";
import clientsService from "../services/clients.service";

class ClientsController {
    async getStatus(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const name = req.params.name;
            const response: ClientsStatusResponseDTO | IRepoError | null = await clientsService.findStatusByName(name);
            res.send(response);
        } catch(err: any) {
            next(err);
        }
    }

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

    async setStatus(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const id: string = req.params.id;
            const dto: ClientsStatusUpdateDTO = req.body;
            const response: ClientsStatusResponseDTO | IRepoError | null = await clientsService.updateStatus(id, dto);
            res.send(response);
        } catch(err: any) {
            next(err);
        }
    }
}

export default new ClientsController();