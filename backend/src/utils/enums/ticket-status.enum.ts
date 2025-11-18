export type TicketStatus = 'active' | 'closed' | 'paused' | 'issued';

export const TicketStatus = {
    ACTIVE: 'active' as TicketStatus,
    CLOSED: 'closed' as TicketStatus,
    PAUSED: 'paused' as TicketStatus,
    ISSUED: 'issued' as TicketStatus
}