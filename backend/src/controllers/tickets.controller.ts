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
    async getTicket(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const id = req.params.id;
            const response: TicketsResponseExtendedDTO | null = await ticketsService.getTicketById(id);
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }

    async getAllTickets(req: Request, res: Response, next: NextFunction) {
        try {
            const response: TicketsResponseDTO[] | null = await ticketsService.getAllTickets();
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }

    async postTicketsSearch(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            let response: TicketsResponseDTO[] | null = null;
            if(!req.body) {
                response = await ticketsService.getAllTickets();
            } else {
                const dto: TicketsFilterDTO = req.body;
                response = await ticketsService.searchTicketsByFilter(dto);
            }
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }

    async postTicket(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const dto: TicketsCreateDTO = {
                ...req.body,
                client_id: req.apiClients.client_id,
                user_id: req.apiUsers.user_id
            };
            const files = req.files as Express.Multer.File[] ?? null;
            const response: TicketsResponseDTO = await ticketsService.createTicket(dto, files);
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }

    async patchTicket(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const id: string = req.params.id;
            const dto: TicketsUpdateDTO = req.body;
            const response: TicketsResponseDTO | null = await ticketsService.updateTicket(id, dto);
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }

    async deleteTicket(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const id = req.params.id;
            const response: boolean = await ticketsService.deleteTicket(id);
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }
}

export default new TicketsController();