import { NextFunction, Request, Response } from "express";
import { checkValidation } from "../middleware/validation.middleware";
import {
    TicketsResponseExtendedDTO,
    TicketsResponseDTO,
    TicketsFilterDTO,
    TicketsCreateDTO,
    TicketsUpdateDTO
} from "../dtos/tickets.dto";
import ticketsService from "../services/tickets.service";

class TicketsController {
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const id = req.params.id;
            const response: TicketsResponseExtendedDTO | null = await ticketsService.findById(id);
            res.send(response);
        } catch(err: any) {
            next(err);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const response: TicketsResponseDTO[] | null = await ticketsService.findAll();
            res.send(response);
        } catch(err: any) {
            next(err);
        }
    }

    async getByFilter(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const dto: TicketsFilterDTO = req.body;
            const response: TicketsResponseDTO[] | null = await ticketsService.findByFilter(dto);
            res.send(response);
        } catch(err: any) {
            next(err);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const dto: TicketsCreateDTO = {
                ...req.body,
                client_id: req.apiClients.client_id,
                user_id: req.apiUsers.user_id
            };
            const response: TicketsResponseDTO = await ticketsService.create(dto);
            res.send(response);
        } catch(err: any) {
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const id: string = req.params.id;
            const dto: TicketsUpdateDTO = req.body;
            const response: TicketsResponseDTO | null = await ticketsService.update(id, dto);
            res.send(response);
        } catch(err: any) {
            next(err);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const id = req.params.id;
            const response: boolean = await ticketsService.delete(id);
            res.send(response);
        } catch(err: any) {
            next(err);
        }
    }
}

export default new TicketsController();