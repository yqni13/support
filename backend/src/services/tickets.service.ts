import {
    TicketsResponseExtendedDTO,
    TicketsResponseDTO,
    TicketsFilterDTO,
    TicketsCreateDTO,
    TicketsUpdateDTO,
    TicketsIntervalDTO,
    TicketsCreateResponseDTO
} from "../dtos/tickets.dto";
import ticketsModel from "../models/tickets.model";
import { Tickets, TicketsId } from "../repositories/interfaces/tickets.entity.interface";
import ticketsRepository from "../repositories/tickets.repository";
import * as CommonUtils from "../utils/common.utils";
import { NotificationService } from "./notificiation.service";

class TicketsService {
    private timeMapTargets: string[];

    constructor() {
        this.timeMapTargets = ['last_modified', 'created_on'];
    }

    async getTicketById(id: TicketsId): Promise<TicketsResponseExtendedDTO | null> {
        const result = await ticketsRepository.findById(id);
        return !result ? null : CommonUtils.mapObjTimestamps<TicketsResponseExtendedDTO>(result, this.timeMapTargets);
    }

    async getAllTickets(): Promise<TicketsResponseDTO[] | null> {
        const result = await ticketsRepository.findAll();
        return !result ? null : CommonUtils.mapArrayTimestamps<TicketsResponseDTO>(result, this.timeMapTargets);
    }

    async getTicketsByTimeInterval(dto: TicketsIntervalDTO): Promise<TicketsResponseDTO[] | null> {
        const result = await ticketsRepository.findByTimeInterval(dto);
        return !result ? null : CommonUtils.mapArrayTimestamps<TicketsResponseDTO>(result, this.timeMapTargets);
    }

    async searchTicketsByFilter(dto: TicketsFilterDTO): Promise<TicketsResponseDTO[] | null> {
        const result = await ticketsRepository.findByFilter(dto);
        return !result ? null : CommonUtils.mapArrayTimestamps<TicketsResponseDTO>(result, this.timeMapTargets);
    }

    async createTicket(dto: TicketsCreateDTO, files: Express.Multer.File[] | null): Promise<TicketsCreateResponseDTO> {
        const ticket = await ticketsModel.generateTicketEntity(dto, files);
        const result: TicketsResponseExtendedDTO = await ticketsRepository.create(ticket);
        const notificationService = NotificationService.getInstance();
        await notificationService.sendTicketInfo({
            ticket_id: result.ticket_id,
            client_name: result.client_name,
            user_email: result.user_email,
            option: result.option,
            title: result.title,
            created_on: result.created_on
        });
        return ticketsModel.toTicketsCreateResponseDTO(result); 
    }

    async updateTicket(id: TicketsId, dto: TicketsUpdateDTO): Promise<TicketsResponseDTO | null> {
        dto = ticketsModel.mapTicketUpdateDto(dto);
        const result = await ticketsRepository.update(id, dto);
        return !result ? null : CommonUtils.mapObjTimestamps<TicketsResponseDTO>(result, this.timeMapTargets);
    }

    async deleteTicket(id: TicketsId): Promise<boolean> {
        const ticket = await ticketsRepository.findById(id);
        if(ticket && ticketsModel.isPermittedToDelete(ticket)) {
            await ticketsModel.handleTicketBeforeDelete(ticket);
            return await ticketsRepository.delete(id);
        } else {
            return false;
        }
    }
}

export default new TicketsService();