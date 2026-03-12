import { DeviceOption } from "../../utils/enums/device-option.enum";
import { Flag } from "../../utils/enums/flag.enum";
import { TicketOption } from "../../utils/enums/ticket-option.enum";
import { TicketStatus } from "../../utils/enums/ticket-status.enum";
import { ClientsId } from "./clients.entity.interface";
import { UsersId } from "./users.entity.interface";

export type TicketsId = string & { readonly brand: unique symbol };

export interface Tickets {
    ticket_id: TicketsId,
    client_id: ClientsId,
    user_id: UsersId,
    status: TicketStatus,
    option: TicketOption,
    title: string,
    message: string,
    resource_paths?: string[],
    flag: Flag | null,
    info_browser?: string,
    info_os?: string,
    info_device?: DeviceOption,
    last_modified: string,
    created_on: string
}