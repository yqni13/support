import { ClientsId } from "../repositories/interfaces/clients.entity.interface";
import { TicketsId } from "../repositories/interfaces/tickets.entity.interface";
import { UsersId } from "../repositories/interfaces/users.entity.interface";
import { SingleOrArray } from "../utils/custom-types.utils";
import { DeviceOption } from "../utils/enums/device-option.enum";
import { Flag } from "../utils/enums/flag.enum";
import { TicketOption } from "../utils/enums/ticket-option.enum";
import { TicketStatus } from "../utils/enums/ticket-status.enum";

export interface TicketsIntervalDTO {
    client_id?: ClientsId,
    user_id?: UsersId,
    intervalTime: string
}

export interface TicketsCreateDTO {
    client_id: ClientsId,
    user_id: UsersId,
    option: TicketOption,
    title: string,
    message: string,
    resource_paths?: string[],
    info_browser?: string,
    info_os?: string,
    info_device?: DeviceOption
}

/**
 * @description Object for request body and testing purposes only.
 */
export interface TicketsRequestCreateDTO {
    user_email: string,
    option: TicketOption,
    title: string,
    message: string,
    resource_paths?: string[],
    info_browser?: string,
    info_os?: string,
    info_device?: DeviceOption
}

export interface TicketsUpdateDTO {
    status: TicketStatus,
    option: TicketOption,
    title: string,
    message: string,
    flag: Flag | null,
    info_browser?: string,
    info_os?: string,
    info_device?: DeviceOption,
    last_modified?: string,
}

export interface TicketsFilterDTO {
    client_id?: SingleOrArray<ClientsId>,
    user_id?: SingleOrArray<UsersId>,
    title?: string,
    status?: SingleOrArray<TicketStatus>,
    option?: SingleOrArray<TicketOption>,
    flag?: SingleOrArray<Flag> | null,
    last_modified?: string[],
    created_on?: string[]
}

export interface TicketsResponseDTO {
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

export interface TicketsResponseExtendedDTO {
    ticket_id: TicketsId,
    client_id: ClientsId,
    client_name: string,
    user_id: UsersId,
    user_email: string,
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
