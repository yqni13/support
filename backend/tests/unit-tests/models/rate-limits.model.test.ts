import { RateLimitsCreateDTO } from "../../../src/dtos/rate-limits.dto";
import demoLimitsModel from "../../../src/models/demo-limits.model";
import rateLimitsModel from "../../../src/models/rate-limits.model";
import { ClientsId } from "../../../src/repositories/interfaces/clients.entity.interface";
import { DemoLimitsId, DemoLimits } from "../../../src/repositories/interfaces/demo-limits.entity.interface";
import { RateLimitsId, RateLimits } from "../../../src/repositories/interfaces/rate-limits.entity.interface";
import { UsersId } from "../../../src/repositories/interfaces/users.entity.interface";
import * as CommonUtils from "../../../src/utils/common.utils";
import { default as mockId } from "../../mock-data/id.mock-data.json";

describe('Unit-tests (model), priority: entity RateLimits', () => {

    const mockValidRateLimitId = mockId.rate_limits.valid[0] as RateLimitsId;
    const mockValidClientId = mockId.clients.valid[0] as ClientsId;
    const mockValidUserId = mockId.users.valid[0] as UsersId;

    describe('Priority: fn mapCounts()', () => {

        describe('Testing valid fn calls', () => {

            test('Sum up count of entries, params: <RateLimits>[].length === 2', () => {
                const mockParam_data: RateLimits[] = [
                    {
                        rate_limit_id: mockValidRateLimitId,
                        client_id: mockValidClientId,
                        user_id: mockValidUserId,
                        day: '2025-01-01',
                        count: 3,
                        last_modified: '2025-01-01T14:00:05.000Z'
                    },
                    {
                        rate_limit_id: mockId.rate_limits.valid[1] as RateLimitsId,
                        client_id: mockValidClientId,
                        user_id: mockId.users.valid[1] as UsersId,
                        day: '2025-01-01',
                        count: 2,
                        last_modified: '2025-01-01T14:00:05.000Z'
                    }
                ];

                const mockReturn = mockParam_data[0].count + mockParam_data[1].count;
                const testFn = rateLimitsModel.mapCounts(mockParam_data);

                expect(testFn).toBe(mockReturn);
            })

            test('Sum up count of entries, params: <RateLimits>[].length === 1', () => {
                const mockParam_data: RateLimits[] = [
                    {
                        rate_limit_id: mockValidRateLimitId,
                        client_id: mockValidClientId,
                        user_id: mockValidUserId,
                        day: '2025-01-01',
                        count: 4,
                        last_modified: '2025-01-01T14:00:05.000Z'
                    }
                ];

                const mockReturn = mockParam_data[0].count;
                const testFn = rateLimitsModel.mapCounts(mockParam_data);

                expect(testFn).toBe(mockReturn);
            })

            test('Sum up count of entries, params: <null>', () => {
                const mockParam_data: RateLimits[] | null = null;

                const mockReturn = 0;
                const testFn = rateLimitsModel.mapCounts(mockParam_data);

                expect(testFn).toBe(mockReturn);
            })
        })
    })

    describe('Priority: fn mapNewEntity()', () => {

        describe('Testing valid fn calls', () => {

            test('Map timestamp/date values to DTO, result: entity Partial<RateLimitsCreateDTO>', () => {
                const mockParam_dto: RateLimitsCreateDTO = {
                    client_id: mockValidClientId,
                    user_id: mockValidUserId,
                }
                const mockDate = '2025-01-01';
                const mockTimestamp = '2025-01-01T14:00:05.000Z';

                jest.spyOn(CommonUtils, 'getDateUTC').mockReturnValue(mockDate);
                jest.spyOn(CommonUtils, 'getTimestampUTC').mockReturnValue(mockTimestamp);

                const mockReturn: Partial<RateLimits> = {
                    client_id: mockParam_dto.client_id,
                    user_id: mockParam_dto.user_id,
                    day: mockDate,
                    count: 1,
                    last_modified: mockTimestamp
                };
                const testFn = rateLimitsModel.mapNewEntity(mockParam_dto);

                expect(testFn).toMatchObject(mockReturn);
            })
        })
    })
})

describe('Unit-tests (model), priority: entity DemoLimits', () => {

    describe('Priority: fn mapCounts()', () => {

        describe('Testing valid fn calls', () => {

            test('Sum up count of entries, params: <DemoLimits>[].length === 1', () => {
                const mockParam_data: DemoLimits[] = [
                    {
                        demo_limit_id: 1 as DemoLimitsId,
                        day: '2025-01-01',
                        count: 4,
                        last_modified: '2025-01-01T14:00:05.000Z'
                    }
                ];

                const mockReturn = mockParam_data[0].count;
                const testFn = demoLimitsModel.mapCounts(mockParam_data);

                expect(testFn).toBe(mockReturn);
            })

            test('Sum up count of entries, params: <null>', () => {
                const mockParam_data: DemoLimits[] | null = null;

                const mockReturn = 0;
                const testFn = demoLimitsModel.mapCounts(mockParam_data);

                expect(testFn).toBe(mockReturn);
            })
        })
    })
})