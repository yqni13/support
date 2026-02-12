import { Flag } from "../../utils/enums/flag.enum";
import { TicketOption } from "../../utils/enums/ticket-option.enum";
import { TicketStatus } from "../../utils/enums/ticket-status.enum";

export interface Tickets {
    ticket_id: string,
    client_id: string,
    user_id: string,
    status: TicketStatus,
    option: TicketOption,
    message: string,
    resource_paths?: string[],
    flag: Flag | null,
    last_modified: string,
    created_on: string
}