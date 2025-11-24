import { TicketsCreateDTO, TicketsUpdateDTO } from "../dtos/tickets.dto";
import { Tickets } from "../repositories/interfaces/tickets.entity.interface";
import * as Utils from "../utils/common.utils";
import { TicketStatus } from "../utils/enums/ticket-status.enum";

class TicketsModel {
    generateTicket(dto: TicketsCreateDTO): Tickets {
        const timestamp = Utils.getTimestampUTC();
        return {
            ticket_id: Utils.generateUUID(),
            client_id: dto.client_id,
            user_id: dto.user_id,
            status: TicketStatus.ISSUED,
            message: dto.message,
            resource_paths: dto.resource_paths,
            flag: null,
            last_modified: timestamp,
            created_on: timestamp
        };
    }

    mapTicketDto(dto: TicketsUpdateDTO): TicketsUpdateDTO {
        const timestamp = Utils.getTimestampUTC();
        // TODO(yqni13): add img-handling (SUPPORT-38)
        return {
            ...dto,
            last_modified: timestamp
        };
    }
}

export default new TicketsModel();