import {
    TicketsResponseExtendedDTO,
    TicketsResponseDTO,
    TicketsFilterDTO,
    TicketsCreateDTO,
    TicketsUpdateDTO,
    TicketsIntervalDTO
} from "../dtos/tickets.dto";
import ticketsModel from "../models/tickets.model";
import ticketsRepository from "../repositories/tickets.repository";
import * as Utils from "../utils/common.utils";

class TicketsService {
    private timeMapTargets: string[];

    constructor() {
        this.timeMapTargets = ['last_modified', 'created_on'];
    }

    async getTicketById(id: string): Promise<TicketsResponseExtendedDTO | null> {
        const result = await ticketsRepository.findById(id);
        return !result ? null : Utils.mapObjTimestamps<TicketsResponseExtendedDTO>(result, this.timeMapTargets);
    }

    async getAllTickets(): Promise<TicketsResponseDTO[] | null> {
        const result = await ticketsRepository.findAll();
        return !result ? null : Utils.mapArrayTimestamps<TicketsResponseDTO>(result, this.timeMapTargets);
    }

    async getTicketsByTimeInterval(dto: TicketsIntervalDTO): Promise<TicketsResponseDTO[] | null> {
        const result = await ticketsRepository.findByTimeInterval(dto);
        return !result ? null : Utils.mapArrayTimestamps<TicketsResponseDTO>(result, this.timeMapTargets);
    }

    async searchTicketsByFilter(dto: TicketsFilterDTO): Promise<TicketsResponseDTO[] | null> {
        const result = await ticketsRepository.findByFilter(dto);
        return !result ? null : Utils.mapArrayTimestamps<TicketsResponseDTO>(result, this.timeMapTargets);
    }

    async createTicket(dto: TicketsCreateDTO, files: Express.Multer.File[] | null): Promise<TicketsResponseDTO> {
        const ticket = await ticketsModel.generateTicket(dto, files);
        const result = await ticketsRepository.create(ticket);
        return Utils.mapObjTimestamps<TicketsResponseDTO>(result, this.timeMapTargets); 
    }

    async updateTicket(id: string, dto: TicketsUpdateDTO): Promise<TicketsResponseDTO | null> {
        dto = ticketsModel.mapTicketUpdateDto(dto);
        const result = await ticketsRepository.update(id, dto);
        return !result ? null : Utils.mapObjTimestamps<TicketsResponseDTO>(result, this.timeMapTargets);
    }

    async deleteTicket(id: string): Promise<boolean> {
        const ticket = await ticketsRepository.findById(id);
        if(ticket && ticketsModel.hasPermissionToDelete(ticket)) {
            await ticketsModel.handleTicketBeforeDelete(ticket as TicketsResponseDTO);
            return await ticketsRepository.delete(id);
        } else {
            return false;
        }
    }
}

export default new TicketsService();