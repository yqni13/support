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

    async findById(id: string): Promise<TicketsResponseExtendedDTO | null> {
        let result = await ticketsRepository.findById(id);
        result = !result ? null : Utils.mapObjTimestamps(result, this.timeMapTargets);
        return result;
    }

    async findAll(): Promise<TicketsResponseDTO[] | null> {
        let result = await ticketsRepository.findAll();
        result = !result ? null : Utils.mapArrayTimestamps(result, this.timeMapTargets);
        return result;
    }

    async findByFilter(dto: TicketsFilterDTO): Promise<TicketsResponseDTO[] | null> {
        let result = await ticketsRepository.findByFilter(dto);
        result = !result ? null : Utils.mapArrayTimestamps(result, this.timeMapTargets);
        return result;
    }

    async create(dto: TicketsCreateDTO): Promise<TicketsResponseDTO> {
        const ticket = ticketsModel.generateTicket(dto);
        let result = await ticketsRepository.create(ticket);
        return Utils.mapObjTimestamps(result, this.timeMapTargets); 
    }

    async update(id: string, dto: TicketsUpdateDTO): Promise<TicketsResponseDTO | null> {
        dto = ticketsModel.mapTicketDto(dto);
        let result = await ticketsRepository.update(id, dto);
        result = !result ? null : Utils.mapObjTimestamps(result, this.timeMapTargets);
        return result;
    }

    async delete(id: string): Promise<boolean> {
        const result = await ticketsRepository.delete(id);
        return result;
    }
}

export default new TicketsService();