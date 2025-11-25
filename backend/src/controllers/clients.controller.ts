import { NextFunction, Request, Response } from "express";
import { checkValidation } from "../middleware/validation.middleware";
import { ClientsCreateDTO, ClientsCreateResponseDTO, ClientsStatusResponseDTO, ClientsStatusUpdateDTO } from "../dtos/clients.dto";
import { IRepoError } from "../repositories/interfaces/error.repository.interface";
import clientsService from "../services/clients.service";

class ClientsController {
    async getClientStatus(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const name = req.params.name;
            const response: ClientsStatusResponseDTO | IRepoError | null = await clientsService.getClientStatusByName(name);
            res.send(response);
        } catch(err: any) {
            next(err);
        }
    }

    async postClient(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const dto: ClientsCreateDTO = req.body;
            const response: ClientsCreateResponseDTO | IRepoError | null = await clientsService.createClient(dto);
            res.send(response);
        } catch(err: any) {
            next(err);
        }
    }

    async patchClientStatus(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const id: string = req.params.id;
            const dto: ClientsStatusUpdateDTO = req.body;
            const response: ClientsStatusResponseDTO | IRepoError | null = await clientsService.updateClientStatus(id, dto);
            res.send(response);
        } catch(err: any) {
            next(err);
        }
    }
}

export default new ClientsController();