import { NextFunction, Request, Response } from "express";
import { checkValidation } from "../middleware/validation.middleware";
import {
    ClientsCreateResponseDTO,
    ClientsStatusResponseDTO,
    ClientsCreateDTO,
    ClientsStatusUpdateDTO
} from "../dtos/clients.dto";
import clientsService from "../services/clients.service";

class ClientsController {
    async getClientStatus(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const name = req.params.name;
            const response: ClientsStatusResponseDTO | null = await clientsService.getClientStatusByName(name);
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }

    async postClient(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const dto: ClientsCreateDTO = req.body;
            const response: ClientsCreateResponseDTO = await clientsService.createClient(dto);
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }

    async patchClientStatus(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const id: string = req.params.id;
            const dto: ClientsStatusUpdateDTO = req.body;
            const response: ClientsStatusResponseDTO | null = await clientsService.updateClientStatus(id, dto);
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }
}

export default new ClientsController();