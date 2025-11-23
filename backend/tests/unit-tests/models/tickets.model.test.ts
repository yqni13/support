import { TicketsCreateDTO } from "../../../src/dtos/tickets.dto";
import * as Utils from "../../../src/utils/common.utils";
import { TicketStatus } from "../../../src/utils/enums/ticket-status.enum";
import { Tickets } from "../../../src/repositories/interfaces/tickets.entity.interface";

const mockTimestamp = '2025-01-01T14:00:04.000Z';

describe('Model tests, class: <tickets>, priority: generateTicket', () => {

    describe('Testing valid fn calls', () => {

        test('Generate new ticket object, entity: <Tickets>', () => {
            const mockParam_id = 'valid_tickets_test_id';
            const mockParam_dto: TicketsCreateDTO = {
                client_id: 'valid_clients_test_id',
                user_id: 'valid_users_test_id',
                status: TicketStatus.ISSUED,
                message: 'test-message',
                flag: null,
            };

            jest.spyOn(Utils, "generateUUID").mockReturnValue(mockParam_id);
            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(mockTimestamp);

            const testFn = ticketsModel.generateTicket(mockParam_dto);
            const expectResult: Tickets = {
                ticket_id: mockParam_id,
                client_id: mockParam_dto.client_id ?? '',
                user_id: mockParam_dto.user_id ?? '',
                status: mockParam_dto.status ?? TicketStatus.ISSUED,
                message: mockParam_dto.message,
                flag: mockParam_dto.flag ?? null,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            };

            expect(testFn).toEqual(expectResult);
        })
    })
})