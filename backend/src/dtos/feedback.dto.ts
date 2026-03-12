import { ClientsId } from "../repositories/interfaces/clients.entity.interface"
import { FeedbackId } from "../repositories/interfaces/feedback.entity.interface"
import { UsersId } from "../repositories/interfaces/users.entity.interface"

export interface FeedbackCreateDTO {
    client_id: ClientsId,
    user_id: UsersId,
    rating: number,
    term_accepted: boolean,
    message?: string,
}

export interface FeedbackRequestCreateDTO {
    user_email: string,
    rating: number,
    term_accepted: boolean,
    message?: string
}

export interface FeedbackUpdateReviewDTO {
    reviewed_on: string,
    last_modified: string
}

export interface FeedbackFilterDTO {
    client_id?: ClientsId | ClientsId[],
    user_id?: UsersId | UsersId[],
    rating?: number | number[],
    term_accepted?: boolean,
    reviewed_on?: string | string[],
    last_modified?: string | string[],
    created_on?: string | string[]
}

export interface FeedbackResponseDTO {
    feedback_id: FeedbackId,
    client_id: ClientsId,
    user_id: UsersId,
    rating: number,
    rating_average_new?: number,
    rating_old?: number,
    term_accepted: boolean,
    message?: string,
    reviewed_on?: string,
    last_modified: string,
    created_on: string,
    blocked?: boolean
}
