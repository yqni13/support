import { DeviceOption } from "../../utils/enums/device-option.enum";
import { Flag } from "../../utils/enums/flag.enum";
import { TicketOption } from "../../utils/enums/ticket-option.enum";
import { TicketStatus } from "../../utils/enums/ticket-status.enum";

export interface Tickets {
    ticket_id: string,
    client_id: string,
    user_id: string,
    status: TicketStatus,
    option: TicketOption,
    title: string,
    message: string,
    resource_paths?: string[],
    flag: Flag | null,
    info_browser?: string,
    info_os?: string,
    info_device?: DeviceOption
    last_modified: string,
    created_on: string
}