import { DBConnection } from "../../../src/configs/db";
import * as CommonUtils from "../../../src/utils/common.utils";
import * as MockUtils from "../../common.test-utils";
import { default as mockId } from "../../mock-data/id.mock-data.json";
import { Tickets, TicketsId } from "../../../src/repositories/interfaces/tickets.entity.interface";
import { DBQueryErrorException } from "../../../src/utils/exceptions/db.exception";
import { TicketStatus } from "../../../src/utils/enums/ticket-status.enum";
import ticketsRepository from "../../../src/repositories/tickets.repository";
import { TicketsFilterDTO, TicketsIntervalDTO, TicketsResponseDTO, TicketsResponseExtendedDTO, TicketsUpdateDTO } from "../../../src/dtos/tickets.dto";
import { TicketOption } from "../../../src/utils/enums/ticket-option.enum";
import { DeviceOption } from "../../../src/utils/enums/device-option.enum";
import { UsersId } from "../../../src/repositories/interfaces/users.entity.interface";
import { ClientsId } from "../../../src/repositories/interfaces/clients.entity.interface";

jest.mock("../../../src/configs/db", () => {
    return {
        DBConnection: {
            getInstance: jest.fn()
        }
    }
});

const mockValidTicketId = mockId.tickets.valid[0] as TicketsId;
const mockValidClientId = mockId.clients.valid[0] as ClientsId;
const mockValidUserId = mockId.users.valid[0] as UsersId;
const mockTimestamp = '2025-01-01T14:00:04.000Z';
const mockData: Tickets = {
    ticket_id: mockValidTicketId,
    client_id: mockValidClientId,
    user_id: mockValidUserId,
    status: TicketStatus.ISSUED,
    option: TicketOption.SUPPORT,
    title: 'test-title',
    message: 'test-message',
    flag: null,
    info_browser: 'Brave 1.87.190 (Official Build) (64-Bit)',
    info_os: 'Windows 11',
    info_device: DeviceOption.COMPUTER,
    last_modified: mockTimestamp,
    created_on: mockTimestamp
};
const expectExceptionResult = DBQueryErrorException;
const mockBoolean = false;

describe('Unit-tests (repository), priority: entity Tickets', () => {

    describe('Database tests table <tickets>, priority: fn findById()', () => {

        describe('Testing valid fn calls', () => {

            let sql: string;
            beforeEach(() => {
                sql = `SELECT`;
            });

            test('Return data for existing entry, params: valid <id>', async () => {
                const mockResult: TicketsResponseExtendedDTO = {
                    ...structuredClone(mockData),
                    client_name: 'TESTCLIENT',
                    user_email: 'user@test.com'
                };
                const mockParam_id = mockData.ticket_id;
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
                const mockParam_id = mockId.tickets.invalid[0] as TicketsId;
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
                const mockParam_id = mockId.tickets.invalid[0] as TicketsId;
                const mockErrorMsg = "DB ERROR ON SELECT QUERY";
                const mockResult = null;
                jest.spyOn(CommonUtils, "logError").mockReturnValue();
                const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                await expect(() => ticketsRepository.findById(mockParam_id))
                    .rejects.toThrow(expectExceptionResult);
            })
        })
    })

    describe('Database tests table <tickets>, priority: fn findAll()', () => {

        describe('Testing valid fn calls', () => {

            let sql: string;
            beforeEach(() => {
                sql = 'SELECT';
            });

            test('Return data for multiple existing entries', async () => {
                const mockData_entry0: TicketsResponseDTO = structuredClone(mockData);
                const mockData_entry1: TicketsResponseDTO = {
                    ticket_id: mockId.tickets.valid[1] as TicketsId,
                    client_id: mockId.clients.valid[1] as ClientsId,
                    user_id: mockId.users.valid[1] as UsersId,
                    status: TicketStatus.ACTIVE,
                    option: TicketOption.SUPPORT,
                    title: 'another-test-title',
                    message: 'another-test-message',
                    flag: null,
                    info_browser: 'Brave 1.87.190 (Official Build) (64-Bit)',
                    info_os: 'Windows 11',
                    info_device: DeviceOption.COMPUTER,
                    last_modified: mockTimestamp,
                    created_on: mockTimestamp
                };
                const mockResult: Tickets[] = [mockData_entry0, mockData_entry1];

                const mockErrorMsg = undefined;
                const mockExpectArray = true;
                const mockClient = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg, mockExpectArray);
                const testFn = await ticketsRepository.findAll();

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql)
                );
            });

            test('Return null for non-existing entry', async () => {
                const mockResult: TicketsResponseDTO[] | null = null;

                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await ticketsRepository.findAll();

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql)
                );
            })
        })

        describe('Testing invalid fn calls', () => {

            test('Throw DBQueryErrorException by catch-block', async () => {
                const mockErrorMsg = "DB ERROR ON SELECT QUERY";
                const mockResult = null;
                jest.spyOn(CommonUtils, "logError").mockReturnValue();
                const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                await expect(() => ticketsRepository.findAll())
                    .rejects.toThrow(expectExceptionResult);
            })
        })
    })

    describe('Database tests table <tickets>, priority: fn findByTimeInterval()', () => {

        describe('Testing valid fn calls', () => {

            let sql: string;
            let mockTimestamp_now: Date;
            beforeEach(() => {
                sql = `SELECT`;
                mockTimestamp_now = new Date('2025-01-01T14:01:50.000Z');
            });

            test('Return data for existing entry, params: <client_id>', async () => {
                const mockParam_dto: TicketsIntervalDTO = {
                    client_id: mockValidClientId,
                    intervalTime: '1 minute'
                };
                const mockResult: TicketsResponseDTO[] = [
                    mockData,
                    {
                        ticket_id: mockId.tickets.valid[1] as TicketsId,
                        client_id: mockValidClientId,
                        user_id: mockId.users.valid[1] as UsersId,
                        status: TicketStatus.ACTIVE,
                        option: TicketOption.SUPPORT,
                        title: 'valid-test-title',
                        message: 'valid-test-message',
                        flag: null,
                        last_modified: '2025-01-01T13:59:48.000Z',
                        created_on: '2025-01-01T13:59:48.000Z'
                    }
                ];

                jest.spyOn(CommonUtils, 'now').mockReturnValue(mockTimestamp_now);

                const mockErrorMsg = undefined;
                const mockExpectArray = true;
                const mockClient = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg, mockExpectArray);
                const testFn = await ticketsRepository.findByTimeInterval(mockParam_dto);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining([mockValidClientId, mockTimestamp_now, mockParam_dto.intervalTime])
                );
            })

            test('Return data for existing entry, params: <user_id>', async () => {
                const mockParam_dto: TicketsIntervalDTO = {
                    user_id: mockValidUserId,
                    intervalTime: '1 minute'
                };
                const mockResult: TicketsResponseDTO[] = [
                    mockData,
                    {
                        ticket_id: mockId.tickets.valid[1] as TicketsId,
                        client_id: mockId.clients.valid[1] as ClientsId,
                        user_id: mockValidUserId,
                        status: TicketStatus.ACTIVE,
                        option: TicketOption.SUPPORT,
                        title: 'valid-test-title',
                        message: 'valid-test-message',
                        flag: null,
                        last_modified: '2025-01-01T13:59:48.000Z',
                        created_on: '2025-01-01T13:59:48.000Z'
                    }
                ];

                jest.spyOn(CommonUtils, 'now').mockReturnValue(mockTimestamp_now);

                const mockErrorMsg = undefined;
                const mockExpectArray = true;
                const mockClient = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg, mockExpectArray);
                const testFn = await ticketsRepository.findByTimeInterval(mockParam_dto);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining([mockValidUserId, mockTimestamp_now, mockParam_dto.intervalTime])
                );
            })

            test('Return null for existing entry beyond time interval', async () => {
                const mockParam_dto: TicketsIntervalDTO = {
                    client_id: mockValidClientId,
                    intervalTime: '1 minute'
                };
                const mockResult = null;
                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await ticketsRepository.findByTimeInterval(mockParam_dto);

                jest.spyOn(CommonUtils, 'now').mockReturnValue(mockTimestamp_now);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining([mockValidClientId, mockTimestamp_now, mockParam_dto.intervalTime])
                );
            })
        })

        describe('Testing invalid fn calls', () => {

            test('Throw DBQueryErrorException by catch-block', async () => {
                const mockParam_dto = {
                    user_id: mockValidUserId,
                    intervalTime: '1 minute'
                };
                const mockErrorMsg = "DB ERROR ON SELECT QUERY";
                const mockResult = null;
                jest.spyOn(CommonUtils, "logError").mockReturnValue();
                const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                await expect(() => ticketsRepository.findByTimeInterval(mockParam_dto))
                    .rejects.toThrow(expectExceptionResult);
            })
        })
    })

    describe('Database tests table <tickets>, priority: fn findByFilter()', () => {

        describe('Testing valid fn calls', () => {

            let sql: string;
            beforeEach(() => {
                sql = `SELECT`;
            });

            test('Return data for existing entry, params: valid <user_id>', async () => {
                const mockParam_dto: TicketsFilterDTO = { user_id: mockData.user_id };
                const mockValues = [mockParam_dto.user_id];
                const mockResult: Tickets[] = [structuredClone(mockData)];

                const mockErrorMsg = undefined;
                const mockExpectArray = true;
                const mockClient = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg, mockExpectArray);
                const testFn = await ticketsRepository.findByFilter(mockParam_dto);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining(mockValues)
                );
            })

            test('Return null for non-existing entry, params: non-existing <user_id>', async () => {
                const mockParam_dto = {
                    user_id: [mockId.users.invalid[0], mockId.users.invalid[1]] as UsersId[] 
                };
                const mockValues = mockParam_dto.user_id;
                const mockResult: Tickets[] | null = null;

                const mockClient = MockUtils.mapMockDbClient(mockResult);
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
                const mockErrorMsg = "DB ERROR ON SELECT QUERY";
                const mockResult = null;
                const mockParam_dto = {};
                jest.spyOn(CommonUtils, "logError").mockReturnValue();
                const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                await expect(() => ticketsRepository.findByFilter(mockParam_dto))
                    .rejects.toThrow(expectExceptionResult);
            })
        })
    })

    describe('Database tests table <tickets>, priority: fn create()', () => {

        const mockParam_entity: Tickets = {
            ticket_id: mockId.tickets.new[0] as TicketsId,
            client_id: mockValidClientId,
            user_id: mockValidUserId,
            status: TicketStatus.ISSUED,
            option: TicketOption.SUPPORT,
            title: 'new-test-title',
            message: 'new-test-message',
            flag: null,
            info_browser: 'Brave 1.87.190 (Official Build) (64-Bit)',
            info_os: 'Windows 11',
            info_device: DeviceOption.COMPUTER,
            last_modified: mockTimestamp,
            created_on: mockTimestamp
        }

        describe('Testing valid fn calls', () => {

            test('Return data for created entry, params: <message> = "new-test-message"', async () => {
                const sql = `INSERT`;
                const mockValues: any[] = Object.values(mockParam_entity).map(value => value);
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
                const mockErrorMsg = "DB ERROR ON INSERT QUERY";
                const mockResult = null;
                jest.spyOn(CommonUtils, "logError").mockReturnValue();
                const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                await expect(() => ticketsRepository.create(mockParam_entity))
                    .rejects.toThrow(expectExceptionResult);
            })
        })
    })

    describe('Database tests table <tickets>, priority: fn udpate()', () => {

        let sql: string;
        let mockParam_dto: TicketsUpdateDTO;
        beforeEach(() => {
            sql = `UPDATE`;
            mockParam_dto = {
                status: TicketStatus.ACTIVE,
                option: TicketOption.SUPPORT,
                title: 'updated-test-title',
                message: 'updated-test-message',
                flag: null,
                info_browser: 'Brave 1.87.190 (Official Build) (64-Bit)',
                info_os: 'Windows 11',
                info_device: DeviceOption.COMPUTER,
                last_modified: mockTimestamp
            };
        });

        describe('Testing valid fn calls', () => {

            test('Return data of changed entry, params: valid <id, dto>', async () => {
                const mockParam_id = mockData.ticket_id;
                const mockValues: any[] = Object.values(mockParam_dto).map(value => value);
                mockValues.push(mockParam_id);
                const mockResult: Tickets = structuredClone(mockData);
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

            test('Return null for non-existing entry, params: invalid <id, dto>', async () => {
                const mockParam_id = mockId.tickets.invalid[0] as TicketsId;
                const mockValues: any[] = Object.values(mockParam_dto).map(value => value);
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
                const mockParam_id = mockId.tickets.invalid[0] as TicketsId;
                const mockErrorMsg = "DB ERROR ON UPDATE QUERY";
                const mockResult = null;
                jest.spyOn(CommonUtils, "logError").mockReturnValue();
                const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                await expect(() => ticketsRepository.update(mockParam_id, mockParam_dto))
                    .rejects.toThrow(expectExceptionResult);
            })
        })
    })

    describe('Database tests table <tickets>, priority: fn delete()', () => {

        let sql: string;
        beforeEach(() => {
            sql = `DELETE`;
        });

        describe('Testing valid fn calls', () => {

            test('Return true for deleted entry, params: valid <id>', async () => {
                const mockParam_id = mockData.ticket_id;
                const mockBoolean = true
                const mockResult = true;
                const mockClient = MockUtils.mapMockDbClient(mockResult, mockBoolean);
                const testFn = await ticketsRepository.delete(mockParam_id);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining([mockParam_id])
                );
            })

            test('Return false for non-existing entry, params: invalid <id>', async () => {
                const mockParam_id = mockId.tickets.invalid[0] as TicketsId;
                const mockResult = false;
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
                const mockParam_id = mockId.tickets.invalid[0] as TicketsId;
                const mockErrorMsg = "DB ERROR ON DELETE QUERY";
                const mockResult = null;
                jest.spyOn(CommonUtils, "logError").mockReturnValue();
                const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                await expect(() => ticketsRepository.delete(mockParam_id))
                    .rejects.toThrow(expectExceptionResult);
            })
        })
    })
})
