import { RateLimitsCreateDTO } from "../../../src/dtos/rate-limits.dto";
import demoLimitsModel from "../../../src/models/demo-limits.model";
import rateLimitsModel from "../../../src/models/rate-limits.model";
import { DemoLimits } from "../../../src/repositories/interfaces/demo-limits.entity.interface";
import { RateLimits } from "../../../src/repositories/interfaces/rate-limits.entity.interface";
import * as Utils from "../../../src/utils/common.utils";

describe('Model tests, priority: mapCounts', () => {

    describe('Testing valid fn calls', () => {

        test('Class: <rate_limits>, sum up count of entries, param: <RateLimits[].length === 2>', () => {
            const mockParam_data: RateLimits[] = [
                {
                    rate_limit_id: 1,
                    client_id: 'valid_clients_test_id_0',
                    user_id: 'valid_users_test_id_0',
                    day: '2025-01-01',
                    count: 3,
                    last_modified: '2025-01-01T14:00:05.000Z'
                },
                {
                    rate_limit_id: 2,
                    client_id: 'valid_clients_test_id_0',
                    user_id: 'valid_users_test_id_1',
                    day: '2025-01-01',
                    count: 2,
                    last_modified: '2025-01-01T14:00:05.000Z'
                }
            ];

            const mockReturn = mockParam_data[0].count + mockParam_data[1].count;
            const testFn = rateLimitsModel.mapCounts(mockParam_data);

            expect(testFn).toBe(mockReturn);
        })

        test('Class: <rate_limits>, sum up count of entries, param: <RateLimits[].length === 1>', () => {
            const mockParam_data: RateLimits[] = [
                {
                    rate_limit_id: 1,
                    client_id: 'valid_clients_test_id_0',
                    user_id: 'valid_users_test_id_0',
                    day: '2025-01-01',
                    count: 4,
                    last_modified: '2025-01-01T14:00:05.000Z'
                }
            ];

            const mockReturn = mockParam_data[0].count;
            const testFn = rateLimitsModel.mapCounts(mockParam_data);

            expect(testFn).toBe(mockReturn);
        })

        test('Class: <rate_limits>, sum up count of entries, param: <null>', () => {
            const mockParam_data: RateLimits[] | null = null;

            const mockReturn = 0;
            const testFn = rateLimitsModel.mapCounts(mockParam_data);

            expect(testFn).toBe(mockReturn);
        })

        test('Class: <demo_limits>, sum up count of entries, param: <DemoLimits[].length === 1>', () => {
            const mockParam_data: DemoLimits[] = [
                {
                    demo_limit_id: 1,
                    day: '2025-01-01',
                    count: 4,
                    last_modified: '2025-01-01T14:00:05.000Z'
                }
            ];

            const mockReturn = mockParam_data[0].count;
            const testFn = demoLimitsModel.mapCounts(mockParam_data);

            expect(testFn).toBe(mockReturn);
        })

        test('Class: <demo_limits>, sum up count of entries, param: <null>', () => {
            const mockParam_data: DemoLimits[] | null = null;

            const mockReturn = 0;
            const testFn = demoLimitsModel.mapCounts(mockParam_data);

            expect(testFn).toBe(mockReturn);
        })
    })
})

describe('Model tests, class: <rate_limits>, priority: mapNewEntity', () => {

    describe('Testing valid fn calls', () => {

        test('Map timestamp/date values to DTO, entity: <RateLimitsCreateDTO>', () => {
            const mockParam_dto: RateLimitsCreateDTO = {
                client_id: 'valid_clients_test_id',
                user_id: 'valid_users_test_id'
            }
            const mockDate = '2025-01-01';
            const mockTimestamp = '2025-01-01T14:00:05.000Z';

            jest.spyOn(Utils, 'getDateUTC').mockReturnValue(mockDate);
            jest.spyOn(Utils, 'getTimestampUTC').mockReturnValue(mockTimestamp);

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