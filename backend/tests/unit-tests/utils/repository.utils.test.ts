import { TicketsFilterDTO } from "../../../src/dtos/tickets.dto";
import { TimestampFilters } from "../../../src/repositories/interfaces/common.repository.interface"
import { Flag } from "../../../src/utils/enums/flag.enum";
import { TicketStatus } from "../../../src/utils/enums/ticket-status.enum";
import * as RepoUtils from "../../../src/utils/repository.utils";

describe('Utils tets, priority: repository', () => {

    describe('Testing valid fn calls', () => {

        test('fn: mapTimestampFilters, params: <data> = {last_modified[]}, <valueIndex> = 0', () => {
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

        test('fn: mapTimestampFilters, params: <data> = {last_modified[], created_on[]}, <valueIndex> = 0', () => {
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

        test('fn: mapFilteredQueryValues, params: <dto> = TicketsFilterDTO without timestamps', () => {
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

        test('fn: mapFilteredQueryValues, params: <dto> = TicketsFilterDTO with 1 timestamp', () => {
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

        test('fn: mapFilteredQueryValues, params: <dto> = TicketsFilterDTO with 2 timestamps', () => {
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

        test('fn: mapFilteredQueryValues, params: <dto> = TicketsFilterDTO with timestamps only', () => {
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
    })
})