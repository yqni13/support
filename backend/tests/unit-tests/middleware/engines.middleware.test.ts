import { RateLimitsResponseDTO } from "../../../src/dtos/rate-limits.dto";
import { RateLimitsEngine } from "../../../src/middleware/engines/rate-limits.engine.middleware";
import { RateLimitsData, RateLimitsResponse, RateLimitsRule } from "../../../src/middleware/interfaces/rate-limits.interface.middleware";
import { ClientsDailyLimitRule } from "../../../src/middleware/rules/rate-limits.rule.middleware";
import rateLimitsService from "../../../src/services/rate-limits.service";

// Ensure correct type by converting secret to number via unary + operator.
import { secrets } from "../../../src/utils/secrets.utils";

describe('Middleware tests category <engines>, priority: RateLimitsEngine', () => {

    describe('Testing valid fn calls', () => {

        let mockValidClientsId: string;
        let mockValidUsersId: string;
        let mockParam_data: RateLimitsData;
        beforeEach(() => {
            mockValidClientsId = 'valid_clients_test_id',
            mockValidUsersId = 'valid_users_test_id';
            mockParam_data = {
                client_id: mockValidClientsId,
                user_id: mockValidUsersId
            };
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        test('Params: <ClientsDailyLimitRule>, result: null', async () => {
            const mockResult_updateRateLimit: RateLimitsResponseDTO | null = null;
            jest.spyOn(rateLimitsService, 'updateRateLimit').mockResolvedValue(mockResult_updateRateLimit);
            jest.spyOn(rateLimitsService, 'createRateLimit').mockImplementation();
            jest.spyOn(ClientsDailyLimitRule.prototype, 'check').mockResolvedValue(null);
            const rule: RateLimitsRule = new ClientsDailyLimitRule(+secrets.RATELIMITS_CLIENTSDAILYLIMIT);
            const engine = new RateLimitsEngine([rule]);

            const mockResponse = null;
            const testFn = await engine.process(mockParam_data);

            expect(testFn).toBe(mockResponse);
        })

        test('Params: <ClientsDailyLimitRule>, result: RateLimitsResponse', async () => {
            const response: RateLimitsResponse = { msg: 'support-ratelimits-clients-daily' };
            jest.spyOn(ClientsDailyLimitRule.prototype, 'check').mockResolvedValue(response);
            const rule: RateLimitsRule = new ClientsDailyLimitRule(+secrets.RATELIMITS_CLIENTSDAILYLIMIT);
            const engine = new RateLimitsEngine([rule]);

            const mockResponse = response;
            const testFn = await engine.process(mockParam_data);

            expect(testFn).toBe(mockResponse);
        })
    })
})