import { Flag } from "../../utils/enums/flag.enum";
import { TicketStatus } from "../../utils/enums/ticket-status.enum";

export interface Tickets {
    ticket_id: string,
    client_id: string,
    user_id: string,
    status: TicketStatus,
    message: string,
    resource_paths?: string[],
    flag: Flag | null,
    last_modified: string,
    created_on: string
}