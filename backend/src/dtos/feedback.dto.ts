export interface FeedbackCreateDTO {
    client_id: string,
    user_id: string,
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
    client_id?: string | string[],
    user_id?: string | string[],
    rating?: number | number[],
    term_accepted?: boolean,
    reviewed_on?: string | string[],
    last_modified?: string | string[],
    created_on?: string | string[]
}

export interface FeedbackResponseDTO {
    feedback_id: number,
    client_id: string,
    user_id: string,
    rating: number,
    rating_average_new?: number,
    rating_old?: number,
    term_accepted: boolean,
    message?: string,
    reviewed_on?: string,
    last_modified: string,
    created_on: string
}
