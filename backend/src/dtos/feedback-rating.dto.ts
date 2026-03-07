export interface FeedbackRatingCreateDTO {
    client_id: string,
    count?: number,
    rating_sum?: number
}

export interface FeedbackRatingUpdateDTO {
    count?: number,
    rating: number,
    last_modified?: string
}

export interface FeedbackRatingResponseDTO {
    rating_average: number,
}

export interface FeedbackRatingExtendedResponseDTO extends FeedbackRatingResponseDTO {
    client_id: string,
    count: number,
    rating_sum: number,
    last_modified: string,
    created_on: string
}
