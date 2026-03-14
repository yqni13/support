import { TicketsCreateDTO, TicketsCreateResponseDTO, TicketsResponseDTO, TicketsUpdateDTO } from "../dtos/tickets.dto";
import { Tickets, TicketsId } from "../repositories/interfaces/tickets.entity.interface";
import * as CommonUtils from "../utils/common.utils";
import { TicketStatus } from "../utils/enums/ticket-status.enum";
import { FilesService } from "../services/files.service";
import { PermissionException } from "../utils/exceptions/auth.exception";

class TicketsModel {
    async generateTicketEntity(dto: TicketsCreateDTO, files: Express.Multer.File[] | null): Promise<Tickets> {
        const timestamp = CommonUtils.getTimestampUTC();
        const newId = CommonUtils.generateUUID<TicketsId>();
        let paths: string[] | undefined = undefined;
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
            title: dto.title,
            message: dto.message,
            resource_paths: paths,
            flag: null,
            info_browser: dto.info_browser,
            info_os: dto.info_os,
            info_device: dto.info_device,
            last_modified: timestamp,
            created_on: timestamp
        };
    }

    mapTicketUpdateDto(dto: TicketsUpdateDTO): TicketsUpdateDTO {
        const timestamp = CommonUtils.getTimestampUTC();
        return {
            ...dto,
            last_modified: timestamp
        };
    }

    toTicketsCreateResponseDTO(entity: Tickets): TicketsCreateResponseDTO {
        return {
            status: entity.status,
            option: entity.option,
            flag: entity.flag,
            created_on: CommonUtils.getTimestampUTC(new Date(entity.created_on))
        }
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
        const convertedTS = (ts: string) => {
            const offSetInMs = new Date(ts).getTimezoneOffset();
            const conversion = 60 * 1000;
            // Javascript turns - (-) => +
            return offSetInMs < 0
                ? new Date(ts).getTime() - ((-1) * offSetInMs * conversion)
                : new Date(ts).getTime() - (offSetInMs * conversion);
        }

        const days = Math.floor((CommonUtils.now().getTime() - convertedTS(dto.created_on)) * factorMilSecToDays);
        const isPermitted = deleteRules.find(rule => days >= rule.timeRange)?.apply(dto.status) ?? false;
        if(!isPermitted) {
            throw new PermissionException('support-delete-prohibited');
        }
        return true;
    }
}

export default new TicketsModel();