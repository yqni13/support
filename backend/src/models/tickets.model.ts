import { TicketsCreateDTO, TicketsUpdateDTO } from "../dtos/tickets.dto";
import { Tickets } from "../repositories/interfaces/tickets.entity.interface";
import * as Utils from "../utils/common.utils";
import { TicketStatus } from "../utils/enums/ticket-status.enum";
import { FilesService } from "../services/files.service";

class TicketsModel {
    generateTicket(dto: TicketsCreateDTO, files: Express.Multer.File[] | null): Tickets {
        const timestamp = Utils.getTimestampUTC();
        const newId = Utils.generateUUID();
        let paths: string[] | null = null;
        if(files) {
            const filesService = new FilesService(files);
            filesService.transformFiles(newId);
            // await filesService.uploadFiles();
            paths = filesService.getResourcePaths();
        }
        return {
            ticket_id: newId,
            client_id: dto.client_id,
            user_id: dto.user_id,
            status: TicketStatus.ISSUED,
            message: dto.message,
            resource_paths: paths ?? dto.resource_paths,
            flag: null,
            last_modified: timestamp,
            created_on: timestamp
        };
    }

    mapTicketUpdateDto(dto: TicketsUpdateDTO): TicketsUpdateDTO {
        const timestamp = Utils.getTimestampUTC();
        // TODO(yqni13): add img-handling at SUPPORT-4
        return {
            ...dto,
            last_modified: timestamp
        };
    }
}

export default new TicketsModel();