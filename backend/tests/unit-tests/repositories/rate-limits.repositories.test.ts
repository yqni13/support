import {
    RateLimitsCountDTO,
    RateLimitsResponseDTO,
    RateLimitsUpdateDTO
} from "../../../src/dtos/rate-limits.dto";
import { DBConnection } from "../../../src/configs/db";
import rateLimitsRepository from "../../../src/repositories/rate-limits.repository";
import { DBQueryErrorException } from "../../../src/utils/exceptions/db.exception";
import * as MockUtils from "../../common.test-utils";
import * as CommonUtils from "../../../src/utils/common.utils";
import { default as mockId } from "../../mock-data/id.mock-data.json";
import { RateLimitsId, RateLimits } from "../../../src/repositories/interfaces/rate-limits.entity.interface";
import { DemoLimitsId, DemoLimits } from "../../../src/repositories/interfaces/demo-limits.entity.interface";
import { DemoLimitsCountDTO, DemoLimitsResponseDTO, DemoLimitsUpdateDTO } from "../../../src/dtos/demo-limits.dto";
import demoLimitsRepository from "../../../src/repositories/demo-limits.repository";
import { ClientsId } from "../../../src/repositories/interfaces/clients.entity.interface";
import { UsersId } from "../../../src/repositories/interfaces/users.entity.interface";

jest.mock("../../../src/configs/db", () => {
    return {
        DBConnection: {
            getInstance: jest.fn()
        }
    }
});

const mockValidRateLimitId = mockId.rate_limits.valid[0] as RateLimitsId;
const mockValidClientId = mockId.clients.valid[0] as ClientsId;
const mockValidUserId = mockId.users.valid[0] as UsersId;
const mockTimestamp = '2025-01-01T14:00:05.000Z';
const mockDate = '2025-01-01';
const expectExceptionResult = DBQueryErrorException;
const mockBoolean = false;

describe('Unit-tests (repository), priority: entity RateLimits', () => {

    describe('Route: /tickets/create', () => {

        describe('Database tests table <rate_limits>, priority: fn count()', () => {

            let mockParam_dto_countById: RateLimitsCountDTO;
            let mockParam_dto_countByDate: RateLimitsCountDTO;
            beforeEach(() => {
                mockParam_dto_countById = { client_id: mockValidClientId, day: '2025-01-01' };
                mockParam_dto_countByDate = { day: '2025-02-05' };
            })

            describe('Testing valid fn calls', () => {

                test('Return entries by id and day, params: <RateLimitsCountDTO>', async () => {
                    const mockResult: RateLimits[] = [ 
                        {
                            rate_limit_id: mockValidRateLimitId,
                            client_id: mockValidClientId,
                            user_id: mockValidUserId,
                            day: '2025-01-01',
                            count: 3,
                            last_modified: '2025-01-01T14:00:05.000Z'
                        }
                    ];
                    const mockValues: string[] = [mockResult[0].client_id, '2025-01-01'];

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
                            rate_limit_id: mockId.rate_limits.new[0] as RateLimitsId,
                            client_id: mockValidClientId,
                            user_id: mockValidUserId,
                            day: '2025-02-05',
                            count: 1,
                            last_modified: '2025-02-05T04:17:05.000Z'
                        },
                        {
                            rate_limit_id: mockId.rate_limits.new[1] as RateLimitsId,
                            client_id: mockValidClientId,
                            user_id: mockValidUserId,
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
                    jest.spyOn(CommonUtils, "logError").mockReturnValue();
                    const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                    await expect(() => rateLimitsRepository.count(mockParam_dto_countById))
                        .rejects.toThrow(expectExceptionResult);
                })
            })
        })

        describe('Database tests table <rate_limits>, priority: fn create()', () => {

            let mockParam_entity: Partial<RateLimits>;
            beforeEach(() => {
                mockParam_entity = {
                    client_id: mockValidClientId,
                    user_id: mockValidUserId,
                    day: mockDate,
                    count: 1,
                    last_modified: mockTimestamp
                };
            })

            describe('Testing valid fn calls', () => {

                test('Return data for created entry, params: <RateLimitsCreateDTO>', async () => {
                    const mockResult: RateLimitsResponseDTO = {
                        rate_limit_id: mockValidRateLimitId,
                        client_id: mockValidClientId,
                        user_id: mockValidUserId,
                        day: mockDate,
                        count: 1,
                        last_modified: mockTimestamp
                    };
                    const mockValues: any[] = Object.values(mockParam_entity).map(value => value);
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
                    jest.spyOn(CommonUtils, "logError").mockReturnValue();
                    const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                    await expect(() => rateLimitsRepository.create(mockParam_entity))
                        .rejects.toThrow(expectExceptionResult);
                })
            })
        })

        describe('Database tests table <rate_limits>, priority: fn update()', () => {

            describe('Testing valid fn calls', () => {

                let sql: string;
                let mockParam_dto: RateLimitsUpdateDTO;
                beforeEach(() => {
                    sql = 'UPDATE';
                    mockParam_dto = {
                        client_id: mockValidClientId,
                        user_id: mockValidUserId,
                        day: '2025-01-01',
                        last_modified: mockTimestamp
                    };
                });

                test('Return data of changed entry, params: valid <client_id, user_id, day>', async () => {
                    const mockResult: RateLimitsResponseDTO | null = {
                        rate_limit_id:mockValidRateLimitId,
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

                test('Return null for non-existing entry, params: invalid <client_id, user_id>', async () => {
                    const mockParam_dto_null: RateLimitsUpdateDTO = {
                        client_id: mockValidClientId,
                        user_id: mockValidUserId,
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
                    const mockParam_dto: RateLimitsUpdateDTO = {
                        client_id: mockValidClientId,
                        user_id: mockValidUserId,
                        day: '2025-01-01',
                        last_modified: mockTimestamp
                    };
                    const mockErrorMsg = "DB ERROR ON UPDATE QUERY";
                    const mockResult = null;
                    jest.spyOn(CommonUtils, "logError").mockReturnValue();
                    const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                    await expect(() => rateLimitsRepository.update(mockParam_dto))
                        .rejects.toThrow(expectExceptionResult);
                })
            })
        })
    })

    describe('Route: /test/demo', () => {

        describe('Database tests table <demo_limits>, priority: fn count()', () => {

            let mockParam_dto: DemoLimitsCountDTO;
            beforeEach(() => {
                mockParam_dto = { day: '2025-02-05' };
            })

            describe('Testing valid fn calls', () => {

                test('Return entries by day, params: <DemoLimitsCountDTO>', async () => {
                    const mockResult: DemoLimits[] = [ 
                        {
                            demo_limit_id: 2 as DemoLimitsId,
                            day: mockParam_dto.day,
                            count: 1,
                            last_modified: '2025-02-05T04:17:05.000Z'
                        }
                    ];
                    const mockValues: string[] = [mockParam_dto.day];
                    const mockErrorMsg = undefined;
                    const mockExpectArray = true;
                    const mockClient = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg, mockExpectArray);
                    const testFn = await demoLimitsRepository.count(mockParam_dto);

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
                    jest.spyOn(CommonUtils, "logError").mockReturnValue();
                    const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                    await expect(() => demoLimitsRepository.count(mockParam_dto))
                        .rejects.toThrow(expectExceptionResult);
                })
            })
        })

        describe('Database tests table <demo_limits>, priority: fn create()', () => {

            let mockParam_entity: Partial<DemoLimits>;
            beforeEach(() => {
                mockParam_entity = {
                    day: mockDate,
                    count: 1,
                    last_modified: mockTimestamp
                };
            })

            describe('Testing valid fn calls', () => {

                test('Return data for created entry, params: <Partial<DemoLimits>>', async () => {
                    const mockResult: DemoLimitsResponseDTO = {
                        demo_limit_id: 1 as DemoLimitsId,
                        day: mockDate,
                        count: 1,
                        last_modified: mockTimestamp
                    };
                    const mockValues: any[] = Object.values(mockParam_entity).map((value: string | number) => value as any);
                    const mockClient = MockUtils.mapMockDbClient(mockResult);
                    const testFn = await demoLimitsRepository.create(mockParam_entity);

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
                    jest.spyOn(CommonUtils, "logError").mockReturnValue();
                    const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                    await expect(() => demoLimitsRepository.create(mockParam_entity))
                        .rejects.toThrow(expectExceptionResult);
                })
            })
        })

        describe('Database tests table <demo_limits>, priority: fn update()', () => {

            describe('Testing valid fn calls', () => {

                let sql: string;
                let mockParam_dto: DemoLimitsUpdateDTO;
                beforeEach(() => {
                    sql = 'UPDATE';
                    mockParam_dto = {
                        day: '2025-01-01',
                        last_modified: mockTimestamp
                    };
                });

                test('Return data of changed entry, params: valid <day>', async () => {
                    const mockResult: DemoLimitsResponseDTO | null = {
                        demo_limit_id: 1 as DemoLimitsId,
                        day: '2025-01-01',
                        count: 1,
                        last_modified: mockTimestamp
                    };
                    const mockValues = [mockTimestamp, mockParam_dto.day];
                    const mockClient = MockUtils.mapMockDbClient(mockResult);
                    const testFn = await demoLimitsRepository.update(mockParam_dto);

                    expect(testFn).toEqual(mockResult);
                    expect(DBConnection.getInstance).toHaveBeenCalled();
                    expect(mockClient.query).toHaveBeenCalledWith(
                        expect.stringContaining(sql),
                        expect.arrayContaining(mockValues)
                    );
                })

                test('Return null for non-existing entry, params: invalid <day>', async () => {
                    const mockParam_dto_null: DemoLimitsUpdateDTO = {
                        day: '2025-01-01',
                        last_modified: mockTimestamp
                    };
                    const mockResult: DemoLimitsResponseDTO | null = null;
                    const mockValues = [mockTimestamp, mockParam_dto_null.day];

                    const mockClient = MockUtils.mapMockDbClient(mockResult);
                    const testFn = await demoLimitsRepository.update(mockParam_dto_null);

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
                    const mockParam_dto: DemoLimitsUpdateDTO = {
                        day: '2025-01-01',
                        last_modified: mockTimestamp
                    };
                    const mockErrorMsg = "DB ERROR ON UPDATE QUERY";
                    const mockResult = null;
                    jest.spyOn(CommonUtils, "logError").mockReturnValue();
                    const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                    await expect(() => demoLimitsRepository.update(mockParam_dto))
                        .rejects.toThrow(expectExceptionResult);
                })
            })
        })
    })
})