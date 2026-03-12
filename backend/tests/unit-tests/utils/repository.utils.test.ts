import { DBConnection } from "../../../src/configs/db";
import { TicketsFilterDTO } from "../../../src/dtos/tickets.dto";
import { TimestampFilters } from "../../../src/repositories/interfaces/common.repository.interface"
import { Flag } from "../../../src/utils/enums/flag.enum";
import { TicketStatus } from "../../../src/utils/enums/ticket-status.enum";
import { DBQueryErrorException } from "../../../src/utils/exceptions/db.exception";
import * as RepoUtils from "../../../src/utils/repository.utils";
import * as CommonUtils from "../../../src/utils/common.utils";

describe('Unit-tests (utils), priority: synonym RepoUtils', () => {

    describe('Testing valid fn calls', () => {

        test('Fn mapTimestampFilters(), params: <data> = {last_modified[]}, <valueIndex> = 0', () => {
            const mockParam_data: TimestampFilters = {
                last_modified: ['2024-12-31T10:00:00.000Z', '2025-12-05T10:00:00.000Z']
            };
            const mockParam_valueIndex = 1;
            const testFn = RepoUtils.mapTimestampFilters(mockParam_data, mockParam_valueIndex);
            const mockResult = {
                sql: '(last_modified >= $1::timestamp AND last_modified <= $2::timestamp)',
                values: ['2024-12-31T10:00:00.000Z', '2025-12-05T10:00:00.000Z']
            };

            expect(testFn).toMatchObject(mockResult);
        })

        test('Fn mapTimestampFilters(), params: <data> = {last_modified[], created_on[]}, <valueIndex> = 0', () => {
            const mockParam_data: TimestampFilters = {
                last_modified: ['2024-12-31T10:00:00.000Z', '2025-12-05T10:00:00.000Z'],
                created_on: ['2024-12-31T10:00:00.000Z', '2025-12-05T10:00:00.000Z']
            };
            const mockParam_valueIndex = 1;
            const testFn = RepoUtils.mapTimestampFilters(mockParam_data, mockParam_valueIndex);
            const mockResult = {
                sql: '(last_modified >= $1::timestamp AND last_modified <= $2::timestamp) AND (created_on >= $3::timestamp AND created_on <= $4::timestamp)',
                values: ['2024-12-31T10:00:00.000Z', '2025-12-05T10:00:00.000Z', '2024-12-31T10:00:00.000Z', '2025-12-05T10:00:00.000Z']
            };

            expect(testFn).toMatchObject(mockResult);
        })

        test('Fn mapFilteredQueryValues(), params: <dto> = TicketsFilterDTO without timestamps', () => {
            const mockParam_dto: TicketsFilterDTO = {
                status: TicketStatus.ACTIVE,
                flag: [Flag.ERROR, Flag.WARNING]
            };
            const mockParam_table = 'tickets';
            const testFn = RepoUtils.mapFilteredQueryValues<TicketsFilterDTO>(mockParam_dto, mockParam_table);

            const mockResult = {
                sql: 'SELECT * FROM tickets WHERE status = $1 AND (flag = $2 OR flag = $3);',
                values: [TicketStatus.ACTIVE, Flag.ERROR, Flag.WARNING]
            };

            expect(testFn).toMatchObject(mockResult);
        })

        test('Fn mapFilteredQueryValues(), params: <dto> = TicketsFilterDTO with 1 timestamp', () => {
            const mockParam_dto: TicketsFilterDTO = {
                status: TicketStatus.ACTIVE,
                flag: [Flag.ERROR, Flag.WARNING],
                last_modified: ['2024-12-31T10:00:00.000Z', '2025-12-05T10:00:00.000Z']
            };
            const mockParam_table = 'tickets';
            const testFn = RepoUtils.mapFilteredQueryValues<TicketsFilterDTO>(mockParam_dto, mockParam_table);

            const mockResult = {
                sql: `SELECT * FROM tickets WHERE status = $1 AND (flag = $2 OR flag = $3) AND (last_modified >= $4::timestamp AND last_modified <= $5::timestamp);`,
                values: [TicketStatus.ACTIVE, Flag.ERROR, Flag.WARNING, mockParam_dto.last_modified![0], mockParam_dto.last_modified![1]]
            };

            expect(testFn).toMatchObject(mockResult);
        })

        test('Fn mapFilteredQueryValues(), params: <dto> = TicketsFilterDTO with 2 timestamps', () => {
            const mockParam_dto: TicketsFilterDTO = {
                status: TicketStatus.ACTIVE,
                flag: [Flag.ERROR, Flag.WARNING],
                last_modified: ['2024-12-31T10:00:00.000Z', '2025-12-05T10:00:00.000Z'],
                created_on: ['2024-12-31T10:00:00.000Z', '2025-12-05T10:00:00.000Z']
            };
            const mockParam_table = 'tickets';
            const testFn = RepoUtils.mapFilteredQueryValues<TicketsFilterDTO>(mockParam_dto, mockParam_table);

            const mockResult = {
                sql: `SELECT * FROM tickets WHERE status = $1 AND (flag = $2 OR flag = $3) AND (last_modified >= $4::timestamp AND last_modified <= $5::timestamp) AND (created_on >= $6::timestamp AND created_on <= $7::timestamp);`,
                values: [TicketStatus.ACTIVE, Flag.ERROR, Flag.WARNING, mockParam_dto.last_modified![0], mockParam_dto.last_modified![1], mockParam_dto.created_on![0], mockParam_dto.created_on![1]]
            };

            expect(testFn).toMatchObject(mockResult);
        })

        test('Fn mapFilteredQueryValues(), params: <dto> = TicketsFilterDTO with timestamps only', () => {
            const mockParam_dto: TicketsFilterDTO = {
                last_modified: ['2024-12-31T10:00:00.000Z', '2025-12-05T10:00:00.000Z'],
                created_on: ['2024-12-31T10:00:00.000Z', '2025-12-05T10:00:00.000Z']
            };
            const mockParam_table = 'tickets';
            const testFn = RepoUtils.mapFilteredQueryValues<TicketsFilterDTO>(mockParam_dto, mockParam_table);

            const mockResult = {
                sql: 'SELECT * FROM tickets WHERE (last_modified >= $1::timestamp AND last_modified <= $2::timestamp) AND (created_on >= $3::timestamp AND created_on <= $4::timestamp);',
                values: ['2024-12-31T10:00:00.000Z', '2025-12-05T10:00:00.000Z', '2024-12-31T10:00:00.000Z', '2025-12-05T10:00:00.000Z']
            };

            expect(testFn).toMatchObject(mockResult);
        })

        test('Fn asTransaction(), params: <message, method, fn()> for successful transaction', async () => {
            const mockParam_message = 'DB ERROR ON REPO-UTILS TRANSACTION';
            const mockParam_method = 'SUPPORT_RepoUtils_asTransaction';
            const mockQuery = jest.fn();
            const mockClient = { query: mockQuery };
            const mockDbClose = jest.fn();
            const mockDbConnect = jest.fn().mockResolvedValue(mockClient);

            jest.spyOn(DBConnection, 'getInstance').mockReturnValue({
                connect: mockDbConnect,
                close: mockDbClose
            } as any);

            const testResult = 'test-logic-within-transaction';
            const mockFn = jest.fn().mockResolvedValue(testResult);
            const testFn = await RepoUtils.asTransaction(mockParam_message, mockParam_method, mockFn);

            expect(mockDbConnect).toHaveBeenCalled();
            expect(mockQuery).toHaveBeenNthCalledWith(1, 'BEGIN');
            expect(mockQuery).toHaveBeenNthCalledWith(2, 'COMMIT');
            expect(mockFn).toHaveBeenCalledWith(mockClient);
            expect(mockDbClose).toHaveBeenCalledWith(mockClient);
            expect(testFn).toBe(testResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Fn asTransaction(), params: <message, method, fn()> for failed transaction => ROLLBACK', async () => {
            const mockParam_message = 'DB ERROR ON REPO-UTILS TRANSACTION';
            const mockParam_method = 'SUPPORT_RepoUtils_asTransaction';
            const mockQuery = jest.fn();
            const mockClient = { query: mockQuery };
            const mockDbClose = jest.fn();
            const mockDbConnect = jest.fn().mockResolvedValue(mockClient);

            jest.spyOn(DBConnection, 'getInstance').mockReturnValue({
                connect: mockDbConnect,
                close: mockDbClose
            } as any);
            jest.spyOn(CommonUtils, 'logError').mockImplementation();

            const mockFn = jest.fn().mockRejectedValue(new Error('test-error-rollback'));
            
            await expect(RepoUtils.asTransaction(
                mockParam_message, mockParam_method, mockFn
            )).rejects.toThrow(DBQueryErrorException);
            expect(mockQuery).toHaveBeenNthCalledWith(1, 'BEGIN');
            expect(mockQuery).toHaveBeenNthCalledWith(2, 'ROLLBACK');
            expect(mockDbClose).toHaveBeenCalledWith(mockClient);
        })
    })
})