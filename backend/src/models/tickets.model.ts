import { TicketsCreateDTO, TicketsResponseDTO, TicketsUpdateDTO } from "../dtos/tickets.dto";
import { Tickets } from "../repositories/interfaces/tickets.entity.interface";
import * as Utils from "../utils/common.utils";
import { TicketStatus } from "../utils/enums/ticket-status.enum";
import { FilesService } from "../services/files.service";
import { PermissionException } from "../utils/exceptions/auth.exception";

class TicketsModel {
    async generateTicket(dto: TicketsCreateDTO, files: Express.Multer.File[] | null): Promise<Tickets> {
        const timestamp = Utils.getTimestampUTC();
        const newId = Utils.generateUUID();
        let paths: string[] | null = null;
        if(files) {
            const filesService = new FilesService(files, 'tickets');
            filesService.transformFiles(newId);
            await filesService.uploadFiles();
            paths = filesService.getResourcePaths();
        }
        return {
            ticket_id: newId,
            client_id: dto.client_id,
            user_id: dto.user_id,
            status: TicketStatus.ISSUED,
            option: dto.option,
            message: dto.message,
            resource_paths: paths ?? dto.resource_paths,
            flag: null,
            last_modified: timestamp,
            created_on: timestamp
        };
    }

    mapTicketUpdateDto(dto: TicketsUpdateDTO): TicketsUpdateDTO {
        const timestamp = Utils.getTimestampUTC();
        return {
            ...dto,
            last_modified: timestamp
        };
    }

    async handleTicketBeforeDelete(dto: TicketsResponseDTO) {
        if(dto.resource_paths && dto.resource_paths.length > 0) {
            const filesService = new FilesService([], 'tickets');
            await filesService.deleteFiles(dto.resource_paths);
        }
    }

    isPermittedToDelete(dto: TicketsResponseDTO): boolean {
        const deleteRules = [
            { timeRange: 180, apply: (status: TicketStatus) => status === TicketStatus.PAUSED },
            { timeRange: 30, apply: (status: TicketStatus) => status === TicketStatus.CLOSED },
            { timeRange: 0, apply: (status: TicketStatus) => status === TicketStatus.CANCEL }
        ];
        const factorMilSecToDays = 1 / (1000 * 3600 * 24);
        const days = Math.floor((Utils.now().getTime() - new Date(dto.created_on).getTime()) * factorMilSecToDays);
        const isPermitted = deleteRules.find(rule => days >= rule.timeRange)?.apply(dto.status) ?? false
        if(!isPermitted) {
            throw new PermissionException('support-delete-prohibited');
        }
        return true;
    }
}

export default new TicketsModel();