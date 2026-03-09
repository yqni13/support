export interface Feedback {
    feedback_id: number,
    client_id: string,
    user_id: string,
    rating: number,
    term_accepted: boolean,
    message?: string,
    reviewed_on?: string,
    last_modified: string,
    created_on: string
}