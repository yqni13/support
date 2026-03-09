import { ClientsId } from "./clients.entity.interface";
import { UsersId } from "./users.entity.interface";

export type FeedbackId = number & { readonly brand: unique symbol };

export interface Feedback {
    feedback_id: FeedbackId,
    client_id: ClientsId,
    user_id: UsersId,
    rating: number,
    term_accepted: boolean,
    message?: string,
    reviewed_on?: string,
    last_modified: string,
    created_on: string
}