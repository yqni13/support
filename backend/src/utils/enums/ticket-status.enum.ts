export type TicketStatus = 'issued' | 'active' | 'closed' | 'paused' | 'cancel';

export const TicketStatus = {
    ISSUED: 'issued' as TicketStatus,
    ACTIVE: 'active' as TicketStatus,
    CLOSED: 'closed' as TicketStatus,
    PAUSED: 'paused' as TicketStatus,
    CANCEL: 'cancel' as TicketStatus // immediate deletion
}