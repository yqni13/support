import { DBConnection } from "../../../src/configs/db";
import { RateLimitsCountDTO, RateLimitsResponseDTO, RateLimitsCreateUpdateDTO } from "../../../src/dtos/rate-limits.dto";
import rateLimitsRepository from "../../../src/repositories/rate-limits.repository";
import { DBQueryErrorException } from "../../../src/utils/exceptions/db.exception";
import * as MockUtils from "../../common.test-utils";
import * as Utils from "../../../src/utils/common.utils";
import { RateLimits } from "../../../src/repositories/interfaces/rate-limits.entity.interface";

jest.mock("../../../src/configs/db", () => {
    return {
        DBConnection: {
            getInstance: jest.fn()
        }
    }
});

const mockTimestamp = '2025-01-01T14:00:05.000Z';
const mockDate = '2025-01-01';
const expectExceptionResult = DBQueryErrorException;
const mockBoolean = false;

describe('Database tests table <rate_limits>, priority: count', () => {

    let mockParam_dto_countById: RateLimitsCountDTO;
    let mockParam_dto_countByDate: RateLimitsCountDTO;
    beforeEach(() => {
        mockParam_dto_countById = { client_id: 'valid_clients_test_id', day: '2025-01-01' };
        mockParam_dto_countByDate = { day: '2025-02-05' };
    })

    describe('Testing valid fn calls', () => {

        test('Return entries by id and day, params: <RateLimitsCountDTO>', async () => {
            const mockResult: RateLimits[] = [ 
                {
                    rate_limit_id: 1,
                    client_id: 'valid_clients_test_id',
                    user_id: 'valid_users_test_id',
                    day: '2025-01-01',
                    count: 3,
                    last_modified: '2025-01-01T14:00:05.000Z'
                }
            ];
            const mockValues: string[] = ['valid_clients_test_id', '2025-01-01'];

            const mockErrorMsg = undefined;
            const mockExpectArray = true;
            const mockClient = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg, mockExpectArray);
            const testFn = await rateLimitsRepository.count(mockParam_dto_countById);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT'),
                expect.arrayContaining(mockValues)
            );
        })

        test('Return entries by day, params: <RateLimitsCountDTO>', async () => {
            const mockResult: RateLimits[] = [ 
                {
                    rate_limit_id: 2,
                    client_id: 'valid_clients_test_id',
                    user_id: 'valid_users_test_id',
                    day: '2025-02-05',
                    count: 1,
                    last_modified: '2025-02-05T04:17:05.000Z'
                },
                {
                    rate_limit_id: 3,
                    client_id: 'valid_clients_test_id',
                    user_id: 'valid_users_test_id',
                    day: '2025-02-05',
                    count: 1,
                    last_modified: '2025-02-05T04:38:05.000Z'
                }
            ];
            const mockValues: string[] = ['2025-02-05'];

            const mockErrorMsg = undefined;
            const mockExpectArray = true;
            const mockClient = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg, mockExpectArray);
            const testFn = await rateLimitsRepository.count(mockParam_dto_countByDate);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT'),
                expect.arrayContaining(mockValues)
            );
        })
    })

    describe('Testing invalid fn calls', () => {
    
        test('Throw DBQueryErrorException by catch-block', async () => {
            const mockErrorMsg = "DB ERROR ON SELECT QUERY";
            const mockResult = null;
            jest.spyOn(Utils, "logError").mockReturnValue();
            const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

            await expect(() => rateLimitsRepository.count(mockParam_dto_countById))
                .rejects.toThrow(expectExceptionResult);
        })
    })
})

describe('Database tests table <rate_limits>, priority: create', () => {

    let mockParam_entity: RateLimitsCreateUpdateDTO;
    beforeEach(() => {
        mockParam_entity = {
            client_id: 'valid_clients_test_id',
            user_id: 'valid_users_test_id',
            day: mockDate,
            last_modified: mockTimestamp
        };
    })

    describe('Testing valid fn calls', () => {

        test('Return data for created entry, params: <RateLimitsCreateUpdateDTO>', async () => {
            const mockResult: RateLimitsResponseDTO = {
                rate_limit_id: 1,
                client_id: mockParam_entity.client_id,
                user_id: mockParam_entity.user_id,
                day: mockDate,
                count: 1,
                last_modified: mockTimestamp
            };
            const mockValues: string[] = [];
            Object.values(mockParam_entity).forEach((value) => {
                mockValues.push(value);
            })

            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await rateLimitsRepository.create(mockParam_entity);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT'),
                expect.arrayContaining(mockValues)
            );
        })
    })

    describe('Testing invalid fn calls', () => {
    
        test('Throw DBQueryErrorException by catch-block', async () => {
            const mockErrorMsg = "DB ERROR ON INSERT QUERY";
            const mockResult = null;
            jest.spyOn(Utils, "logError").mockReturnValue();
            const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

            await expect(() => rateLimitsRepository.create(mockParam_entity))
                .rejects.toThrow(expectExceptionResult);
        })
    })
})

describe('Database tests table <rate_limits>, priority: update', () => {

    describe('Testing valid fn calls', () => {

        let sql: string;
        let mockParam_dto: RateLimitsCreateUpdateDTO;
        beforeEach(() => {
            sql = 'UPDATE';
            mockParam_dto = {
                client_id: 'valid_clients_test_id',
                user_id: 'valid_users_test_id',
                day: '2025-01-01',
                last_modified: mockTimestamp
            };
        });

        test('Return data of changed entry by valid id`s and day', async () => {
            const mockResult: RateLimitsResponseDTO | null = {
                rate_limit_id: 1,
                client_id: mockParam_dto.client_id,
                user_id: mockParam_dto.user_id,
                day: '2025-01-01',
                count: 1,
                last_modified: mockTimestamp
            };
            const mockValues = [mockTimestamp, mockParam_dto.client_id, mockParam_dto.user_id, mockParam_dto.day];
            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await rateLimitsRepository.update(mockParam_dto);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining(mockValues)
            );
        })

        test('Return null for non-existing entry by invalid ids', async () => {
            const mockParam_dto_null: RateLimitsCreateUpdateDTO = {
                client_id: 'non-existing_clients_test_id',
                user_id: 'non-existing_users_test_id',
                day: '2025-01-01',
                last_modified: mockTimestamp
            };
            const mockResult: RateLimitsResponseDTO | null = null;
            const mockValues = [mockTimestamp, mockParam_dto_null.client_id, mockParam_dto_null.user_id, mockParam_dto_null.day];

            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await rateLimitsRepository.update(mockParam_dto_null);

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
            const mockParam_dto: RateLimitsCreateUpdateDTO = {
                client_id: 'invalid_clients_test_id',
                user_id: 'invalid_users_test_id',
                day: '2025-01-01',
                last_modified: mockTimestamp
            };
            const mockErrorMsg = "DB ERROR ON UPDATE QUERY";
            const mockResult = null;
            jest.spyOn(Utils, "logError").mockReturnValue();
            const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

            await expect(() => rateLimitsRepository.update(mockParam_dto))
                .rejects.toThrow(expectExceptionResult);
        })
    })
})