import { ClientsId } from "./clients.entity.interface";

// Use Clients FK as PK => 1:1 relationship as client is unique for each feedback-rating.
export interface FeedbackRating {
    client_id: ClientsId,
    count: number,
    rating_sum: number,
    last_modified: string,
    created_on: string
}