import { TicketsCreateDTO, TicketsUpdateDTO } from "../../../src/dtos/tickets.dto";
import * as Utils from "../../../src/utils/common.utils";
import { TicketStatus } from "../../../src/utils/enums/ticket-status.enum";
import { Tickets } from "../../../src/repositories/interfaces/tickets.entity.interface";
import ticketsModel from "../../../src/models/tickets.model";

const mockTimestamp = '2025-01-01T14:00:04.000Z';

describe('Model tests, class: <tickets>, priority: generateTicket', () => {

    describe('Testing valid fn calls', () => {

        test('Generate new ticket object, entity: <Tickets>', () => {
            const mockParam_id = 'valid_tickets_test_id';
            const mockParam_dto: TicketsCreateDTO = {
                client_id: 'valid_clients_test_id',
                user_id: 'valid_users_test_id',
                message: 'test-message'
            };

            jest.spyOn(Utils, "generateUUID").mockReturnValue(mockParam_id);
            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(mockTimestamp);

            const testFn = ticketsModel.generateTicket(mockParam_dto);
            const expectResult: Tickets = {
                ticket_id: mockParam_id,
                client_id: mockParam_dto.client_id,
                user_id: mockParam_dto.user_id,
                status: TicketStatus.ISSUED,
                message: mockParam_dto.message,
                flag: null,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            };

            expect(testFn).toEqual(expectResult);
        })

        test('Map timestamp value to DTO, entity: <TicketsUpdateDTO>', () => {
            const mockTimestamp = '2025-01-01T14:00:04.000Z';
            const mockParam_dto: TicketsUpdateDTO = {
                status: TicketStatus.PAUSED,
                message: 'test-message',
                flag: null
            };

            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(mockTimestamp);

            const testFn = ticketsModel.mapTicketUpdateDto(mockParam_dto);
            const expectResult: TicketsUpdateDTO = {
                ...mockParam_dto,
                last_modified: mockTimestamp
            };

            expect(testFn).toEqual(expectResult);
        })
    })
})