import { FeedbackId } from "../../repositories/interfaces/feedback.entity.interface";
import { TicketsId } from "../../repositories/interfaces/tickets.entity.interface";
import { TicketOption } from "../../utils/enums/ticket-option.enum";
import { Violation } from "../../utils/enums/violations.enum";

export interface NotificationPostParams {
    text: string,
    logMsg: string,
    logMethod: string
}

export interface NotificationParams {
    client_name: string,
    user_email: string,
    created_on: string
}

export interface NotificationTicketsParams extends NotificationParams {
    ticket_id: TicketsId,
    option: TicketOption,
    title: string,
}

export interface NotificationFeedbackParams extends NotificationParams {
    feedback_id: FeedbackId,
    rating: number,
    rating_average: number,
    term_accepted: boolean
}

/**
 * @description Due to less priority and structure id and entity are used only instead name and email.
 */
export interface NotificationPenaltyParams {
    id: string | number,
    entity: string,
    client_name?: string,
    user_email?: string,
    violation: Violation,
    penalty: any,
}