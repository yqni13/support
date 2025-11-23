import { DBConnection } from "../../../src/configs/db";
import * as Utils from "../../../src/utils/common.utils";
import * as MockUtils from "../../common.test-utils";
import { Tickets } from "../../../src/repositories/interfaces/tickets.entity.interface";
import { DBQueryErrorException } from "../../../src/utils/exceptions/db.exception";
import { TicketStatus } from "../../../src/utils/enums/ticket-status.enum";
import ticketsRepository from "../../../src/repositories/tickets.repository";
import { TicketsResponseDTO, TicketsUpdateDTO } from "../../../src/dtos/tickets.dto";

jest.mock("../../../src/configs/db", () => {
    return {
        DBConnection: {
            getInstance: jest.fn()
        }
    }
});

const mockTimestamp = '2025-01-01T14:00:04.000Z';
const mockData: Tickets = {
    ticket_id: 'valid_tickets_test_id',
    client_id: 'valid_clients_test_id',
    user_id: 'valid_users_test_id',
    status: TicketStatus.ISSUED,
    message: 'test-message',
    flag: null,
    last_modified: mockTimestamp,
    created_on: mockTimestamp
};
const expectExceptionResult = DBQueryErrorException;

describe('Database tests table <tickets>, priority: findById', () => {

    describe('Testing valid fn calls', () => {

        let sql: string;
        beforeEach(() => {
            sql = `SELECT`;
        });

        test('Return data for existing entry, params: valid <id>', async () => {
            const mockResult: TicketsResponseDTO = {
                ...structuredClone(mockData),
                client_name: 'TESTCLIENT',
                user_email: 'user@test.com'
            };
            const mockParam_id = mockResult.ticket_id;
            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await ticketsRepository.findById(mockParam_id);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining([mockParam_id])
            );
        })

        test('Return null for non-existing entry, params: non-existing <id>', async () => {
            const mockParam_id = 'invalid_tickets_test_id';
            const mockResult = null;
            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await ticketsRepository.findById(mockParam_id);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining([mockParam_id])
            );
        })
    })

    describe('Testing invalid fn calls', () => {
    
        test('Throw DBQueryErrorException by catch-block', async () => {
            const mockParam_id = structuredClone(mockData.ticket_id);
            const mockErrorMsg = "DB ERROR ON SELECT QUERY, (Tickets TEST Repository, findByEmail)";
            const mockResult = null;
            jest.spyOn(Utils, "logRepoError").mockReturnValue();
            const _ = MockUtils.mapMockDbClient(mockResult, mockErrorMsg);

            await expect(() => ticketsRepository.findById(mockParam_id))
                .rejects.toThrow(expectExceptionResult);
        })
    })
})

describe('Database tests table <tickets>, priority: findAll', () => {

    describe('Testing valid fn calls', () => {

        test('Return data for multiple existing entries', async () => {
            const mockData_entry0: TicketsResponseDTO = {
                ...structuredClone(mockData),
                client_name: 'TESTCLIENT',
                user_email: 'user@test.com'
            };
            const mockData_entry1: TicketsResponseDTO = {
                ticket_id: 'another_valid_tickets_test_id',
                client_id: 'another_valid_clients_test_id',
                client_name: 'TESTCLIENT',
                user_id: 'another_valid_users_test_id',
                user_email: 'another-user@test.com',
                status: TicketStatus.ACTIVE,
                message: 'another-test-message',
                flag: null,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            };
            const mockResult: Tickets[] = [mockData_entry0, mockData_entry1];

            const mockErrorMsg = undefined;
            const mockExpectArray = true;
            const mockClient = MockUtils.mapMockDbClient(mockResult, mockErrorMsg, mockExpectArray);
            const sql = `SELECT * FROM tickets ORDER BY ticket_id ASC FETCH FIRST 100 ROWS ONLY;`;
            const testFn = await ticketsRepository.findAll();

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(sql);
        });
    })

    describe('Testing invalid fn calls', () => {

        test('Throw DBQueryErrorException by catch-block', async () => {
            const mockErrorMsg = "DB ERROR ON SELECT QUERY, (Tickets TEST Repository, findAll)";
            const mockResult = null;
            jest.spyOn(Utils, "logRepoError").mockReturnValue();
            const _ = MockUtils.mapMockDbClient(mockResult, mockErrorMsg);

            await expect(() => ticketsRepository.findAll())
                .rejects.toThrow(expectExceptionResult);
        })
    })
})

describe('Database tests table <tickets>, priority: findByFilter', () => {

    describe('Testing valid fn calls', () => {

        let sql: string;
        beforeEach(() => {
            sql = `SELECT`;
        });

        test('Return data for existing entry, params: valid <user_id>', async () => {
            const mockResult: TicketsResponseDTO[] = [{
                ...structuredClone(mockData),
                client_name: 'TESTCLIENT',
                user_email: 'user@test.com'
            }];
            const mockParam_dto = { user_id: structuredClone(mockData.user_id) };
            const mockValues = [mockParam_dto.user_id];

            const mockErrorMsg = undefined;
            const mockExpectArray = true;
            const mockClient = MockUtils.mapMockDbClient(mockResult, mockErrorMsg, mockExpectArray);
            const testFn = await ticketsRepository.findByFilter(mockParam_dto);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining(mockValues)
            );
        })

        test('Return null for non-existing entry, params: non-existing <user_id>', async () => {
            const mockResult = [null];
            const mockParam_dto = { user_id: ['non-existing_users_test_id_0', 'non-existing_users_test_id_1'] };
            const mockValues = mockParam_dto.user_id;

            const mockErrorMsg = undefined;
            const mockExpectArray = true;
            const mockClient = MockUtils.mapMockDbClient(mockResult, mockErrorMsg, mockExpectArray);
            const testFn = await ticketsRepository.findByFilter(mockParam_dto);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining(mockValues)
            );
        })
    })

    describe('Testing invalid fn calls', () => {
    
        test('Throw DBQueryErrorException by catch-block', async () => {
            const mockErrorMsg = "DB ERROR ON SELECT QUERY, (Tickets TEST Repository, findByFilter)";
            const mockResult = null;
            jest.spyOn(Utils, "logRepoError").mockReturnValue();
            const _ = MockUtils.mapMockDbClient(mockResult, mockErrorMsg);

            await expect(() => ticketsRepository.findByFilter())
                .rejects.toThrow(expectExceptionResult);
        })
    })
})

describe('Database tests table <tickets>, priority: create', () => {

    const mockParam_entity: TicketsResponseDTO = {
        ticket_id: 'new-valid_tickets_test_id',
        client_id: 'valid_clients_test_id',
        client_name: 'valid_clients_testclient',
        user_id: 'new-valid_users_test_id',
        user_email: 'new-user@test.com',
        status: TicketStatus.ISSUED,
        message: 'new-test-message',
        flag: null,
        last_modified: mockTimestamp,
        created_on: mockTimestamp
    }

    describe('Testing valid fn calls', () => {

        test('Return data for created entry, params: <message> = "new-test-message"', async () => {
            const sql = `INSERT`;
            let mockValues: any[] = [];
            Object.values(mockParam_entity).forEach((value) => {
                mockValues.push(value);
            });

            const mockResult: Tickets = structuredClone(mockParam_entity);
            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await ticketsRepository.create(mockParam_entity);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining(mockValues)
            );
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Throw DBQueryErrorException by catch-block', async () => {
            const mockErrorMsg = "DB ERROR ON INSERT QUERY, (Tickets TEST Repository, create)";
            const mockResult = null;
            jest.spyOn(Utils, "logRepoError").mockReturnValue();
            const _ = MockUtils.mapMockDbClient(mockResult, mockErrorMsg);

            await expect(() => ticketsRepository.create(mockParam_entity))
                .rejects.toThrow(expectExceptionResult);
        })
    })
})

describe('Database tests table <tickets>, priority: udpate', () => {

    let sql: string;
    let mockParam_dto: TicketsUpdateDTO;
    let mockValues: any[];
    beforeEach(() => {
        sql = `UPDATE users`; // Keep it simple if it isn't essential.
        mockParam_dto = {
            status: TicketStatus.ACTIVE,
            message: 'update-test-message',
            flag: null,
            last_modified: mockTimestamp
        };
        mockValues = [];
    });

    describe('Testing valid fn calls', () => {

        test('Return data of changed entry by valid id', async () => {
            const mockParam_id = structuredClone(mockData.user_id);
            Object.values(mockParam_dto).forEach((val) => {
                mockValues.push(val);
            });
            mockValues.push(mockParam_id);
            const mockResult: TicketsResponseDTO = {
                ...structuredClone(mockData),
                client_name: 'TESTCLIENT',
                user_email: 'user@test.com'
            };
            mockResult['status'] = TicketStatus.ACTIVE;

            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await ticketsRepository.update(mockParam_id, mockParam_dto);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining(mockValues)
            );
        })

        test('Return null for non-existing entry by invalid id', async () => {
            const mockParam_id = 'invalid_users_test_id';
            Object.values(mockParam_dto).forEach((val) => {
                mockValues.push(val);
            });
            mockValues.push(mockParam_id);

            const mockResult = null;

            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await ticketsRepository.update(mockParam_id, mockParam_dto);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining(mockValues)
            );
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Throw DBQueryErrorException by catch-block', async () => {
            const mockParam_id = 'invalid_users_test_id';
            const mockErrorMsg = "DB ERROR ON PUT QUERY, (Tickets TEST Repository, update)";
            const mockResult = null;
            jest.spyOn(Utils, "logRepoError").mockReturnValue();
            const _ = MockUtils.mapMockDbClient(mockResult, mockErrorMsg);

            await expect(() => ticketsRepository.update(mockParam_id, mockParam_dto))
                .rejects.toThrow(expectExceptionResult);
        })
    })
})

describe('Database tests table <tickets>, priority: delete', () => {

    let sql: string;
    beforeEach(() => {
        sql = `DELETE`;
    });

    describe('Testing valid fn calls', () => {

        test('Return true for deleted entry by valid id', async () => {
            const mockParam_id = structuredClone(mockData.user_id);
            const mockResult = true;

            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await ticketsRepository.delete(mockParam_id);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining([mockParam_id])
            );
        })

        test('Return null for non-existing entry by invalid id', async () => {
            const mockParam_id = 'invalid_tickets_test_id';
            const mockResult = null;
            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await ticketsRepository.delete(mockParam_id);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining([mockParam_id])
            );
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Throw DBQueryErrorException by catch-block', async () => {
            const mockParam_id = 'tickets_test_id';
            const mockErrorMsg = "DB ERROR ON DELETE QUERY, (Tickets TEST Repository, delete)";
            const mockResult = null;
            jest.spyOn(Utils, "logRepoError").mockReturnValue();
            const _ = MockUtils.mapMockDbClient(mockResult, mockErrorMsg);

            await expect(() => ticketsRepository.delete(mockParam_id))
                .rejects.toThrow(expectExceptionResult);
        })
    })
})