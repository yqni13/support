import {
    TicketsResponseExtendedDTO,
    TicketsResponseDTO,
    TicketsFilterDTO,
    TicketsCreateDTO,
    TicketsUpdateDTO
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
        let result = await ticketsRepository.findById(id);
        result = !result ? null : Utils.mapObjTimestamps(result, this.timeMapTargets);
        return result;
    }

    async getAllTickets(): Promise<TicketsResponseDTO[] | null> {
        let result = await ticketsRepository.findAll();
        result = !result ? null : Utils.mapArrayTimestamps(result, this.timeMapTargets);
        return result;
    }

    async searchTicketsByFilter(dto: TicketsFilterDTO): Promise<TicketsResponseDTO[] | null> {
        let result = await ticketsRepository.findByFilter(dto);
        result = !result ? null : Utils.mapArrayTimestamps(result, this.timeMapTargets);
        return result;
    }

    async createTicket(dto: TicketsCreateDTO): Promise<TicketsResponseDTO> {
        const ticket = ticketsModel.generateTicket(dto);
        const result = await ticketsRepository.create(ticket);
        return Utils.mapObjTimestamps(result, this.timeMapTargets); 
    }

    async updateTicket(id: string, dto: TicketsUpdateDTO): Promise<TicketsResponseDTO | null> {
        dto = ticketsModel.mapTicketUpdateDto(dto);
        let result = await ticketsRepository.update(id, dto);
        result = !result ? null : Utils.mapObjTimestamps(result, this.timeMapTargets);
        return result;
    }

    async deleteTicket(id: string): Promise<boolean> {
        return await ticketsRepository.delete(id);
    }
}

export default new TicketsService();