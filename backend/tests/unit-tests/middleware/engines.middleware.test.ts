import { DemoLimitsResponseDTO } from "../../../src/dtos/demo-limits.dto";
import { RateLimitsResponseDTO } from "../../../src/dtos/rate-limits.dto";
import { RateLimitsEngine } from "../../../src/middleware/engines/rate-limits.engine.middleware";
import { RateLimitsData, RateLimitsResponse, RateLimitsRule } from "../../../src/middleware/interfaces/rate-limits.interface.middleware";
import { ClientsDailyLimitRule, DemoDailyLimitRule } from "../../../src/middleware/rules/rate-limits.rule.middleware";
import demoLimitsService from "../../../src/services/demo-limits.service";
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

        describe('Route: /tickets/create', () => {

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
                const response: RateLimitsResponse = {
                    msg: 'support-ratelimits-clients-daily',
                    retryAfter: '2025-01-02T00.00.01.000Z'
                };
    
                jest.spyOn(ClientsDailyLimitRule.prototype, 'check').mockResolvedValue(response);
    
                const rule: RateLimitsRule = new ClientsDailyLimitRule(+secrets.RATELIMITS_CLIENTSDAILYLIMIT);
                const engine = new RateLimitsEngine([rule]);
    
                const mockResponse = response;
                const testFn = await engine.process(mockParam_data);
    
                expect(testFn).toBe(mockResponse);
            })
        })

        describe('Route: /meta/demo', () => {

            test('Params: <DemoDailyLimitRule>, result: null', async () => {
                const mockParam_isDemo = true;
                const mockResult_updateDemoLimit: DemoLimitsResponseDTO | null = null;

                jest.spyOn(demoLimitsService, 'updateDemoLimit').mockResolvedValue(mockResult_updateDemoLimit);
                jest.spyOn(demoLimitsService, 'createDemoLimit').mockImplementation();
                jest.spyOn(DemoDailyLimitRule.prototype, 'check').mockResolvedValue(null);

                const rule: RateLimitsRule = new DemoDailyLimitRule(+secrets.DEMOLIMITS_TOTALDAILYLIMIT);
                const engine = new RateLimitsEngine([rule]);

                const mockResponse = null;
                const testFn = await engine.process({ client_id: 'demo', user_id: 'demo' }, mockParam_isDemo);

                expect(testFn).toBe(mockResponse);
            })

            test('Params: <DemoDailyLimitRule>, result: RateLimitsResponse', async () => {
                const mockParam_isDemo = true;
                const response: RateLimitsResponse = {
                    msg: 'support-demolimits-total-daily',
                    retryAfter: '2025-01-02T00.00.01.000Z'
                };

                jest.spyOn(DemoDailyLimitRule.prototype, 'check').mockResolvedValue(response);

                const rule: RateLimitsRule = new DemoDailyLimitRule(+secrets.DEMOLIMITS_TOTALDAILYLIMIT);
                const engine = new RateLimitsEngine([rule]);

                const mockResponse = response;
                const testFn = await engine.process({ client_id: 'demo', user_id: 'demo' }, mockParam_isDemo);

                expect(testFn).toBe(mockResponse);
            })
        })
    })
})