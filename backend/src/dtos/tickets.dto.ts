import { SingleOrArray } from "../utils/custom-types.utils";
import { Flag } from "../utils/enums/flag.enum";
import { TicketOption } from "../utils/enums/ticket-option.enum";
import { TicketStatus } from "../utils/enums/ticket-status.enum";

export interface TicketsIntervalDTO {
    client_id?: string,
    user_id?: string,
    intervalTime: string
}

export interface TicketsCreateDTO {
    client_id: string,
    user_id: string,
    option: TicketOption,
    message: string,
    resource_paths?: string[],
}

/**
 * @description Object for request body and testing purposes only.
 */
export interface TicketsRequestCreateDTO {
    user_email: string,
    option: TicketOption,
    message: string,
    resource_paths?: string[],
}

export interface TicketsUpdateDTO {
    status: TicketStatus,
    option: TicketOption,
    message: string,
    flag: Flag | null,
    last_modified?: string,
}

export interface TicketsFilterDTO {
    client_id?: SingleOrArray<string>,
    user_id?: SingleOrArray<string>,
    status?: SingleOrArray<TicketStatus>,
    option?: SingleOrArray<TicketOption>,
    flag?: SingleOrArray<Flag> | null,
    last_modified?: string[],
    created_on?: string[]
}

export interface TicketsResponseDTO {
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

export interface TicketsResponseExtendedDTO {
    ticket_id: string,
    client_id: string,
    client_name: string,
    user_id: string,
    user_email: string,
    status: TicketStatus,
    option: TicketOption,
    message: string,
    resource_paths?: string[],
    flag: Flag | null,
    last_modified: string,
    created_on: string
}
