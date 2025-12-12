import { RateLimitsCreateDTO } from "../../../src/dtos/rate-limits.dto";
import rateLimitsModel from "../../../src/models/rate-limits.model";
import { RateLimits } from "../../../src/repositories/interfaces/rate-limits.entity.interface";
import * as Utils from "../../../src/utils/common.utils";

describe('Model tests, class: <rate_limits>, priority: mapCounts', () => {

    describe('Testing valid fn calls', () => {

        test('Sum up count of entries, param: <RateLimits[].length === 2>', () => {
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

            const mockReturn = 5;
            const testFn = rateLimitsModel.mapCounts(mockParam_data);

            expect(testFn).toBe(mockReturn);
        })

        test('Sum up count of entries, param: <RateLimits[].length === 1>', () => {
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

            const mockReturn = 4;
            const testFn = rateLimitsModel.mapCounts(mockParam_data);

            expect(testFn).toBe(mockReturn);
        })

        test('Sum up count of entries, param: <null>', () => {
            const mockParam_data: RateLimits[] | null = null;

            const mockReturn = 0;
            const testFn = rateLimitsModel.mapCounts(mockParam_data);

            expect(testFn).toBe(mockReturn);
        })
    })
})

describe('Model tests, class: <rate_limits>, priority: mapRateLimitsCreateDTO', () => {

    describe('Testing valid fn calls', () => {

        test('Map timestamp/date values to DTO, entity: <RateLimitsCreateDTO>', () => {
            const mockParam_client_id = 'valid_clients_test_id';
            const mockParam_user_id = 'valid_users_test_id';
            const mockDate = '2025-01-01';
            const mockTimestamp = '2025-01-01T14:00:05.000Z';

            jest.spyOn(Utils, 'getDateUTC').mockReturnValue(mockDate);
            jest.spyOn(Utils, 'getTimestampUTC').mockReturnValue(mockTimestamp);

            const mockReturn: RateLimitsCreateDTO = {
                client_id: mockParam_client_id,
                user_id: mockParam_user_id,
                day: mockDate,
                last_modified: mockTimestamp
            };
            const testFn = rateLimitsModel.mapRateLimitsCreateDTO(mockParam_client_id, mockParam_user_id);

            expect(testFn).toMatchObject(mockReturn);
        })
    })
})