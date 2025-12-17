import {
    ClientsBurstLimitRule,
    ClientsDailyLimitRule,
    DemoDailyLimitRule,
    TotalDailyLimitRule,
    UsersBurstLimitRule,
    UsersDailyLimitRule
} from "../../../../src/middleware/rules/rate-limits.rule.middleware";
import { TicketsResponseDTO } from "../../../../src/dtos/tickets.dto";
import { RateLimitsData, RateLimitsResponse } from "../../../../src/middleware/interfaces/rate-limits.interface.middleware";
import * as Utils from "../../../../src/utils/common.utils";
import ticketsService from "../../../../src/services/tickets.service";
import { TicketStatus } from "../../../../src/utils/enums/ticket-status.enum";
import rateLimitsService from "../../../../src/services/rate-limits.service";
import demoLimitsService from "../../../../src/services/demo-limits.service";

// Ensure correct type by converting secret to number via unary + operator.
import { secrets } from "../../../../src/utils/secrets.utils"

describe('Middleware tests category <observation|rate_limits>, priority: rules', () => {

    const mockValidClientsId = 'valid_clients_test_id';
    const mockValidUsersId = 'valid_users_test_id';
    let mockRetryAfter: string;
    let mockParam_data: RateLimitsData;
    let mockBurstContext: TicketsResponseDTO[];
    beforeEach(() => {
        mockRetryAfter = '2025-01-02T00:00:01.000Z';
        mockParam_data = {
            client_id: mockValidClientsId,
            user_id: mockValidUsersId
        };
        mockBurstContext = [
            {
                ticket_id: 'valid_tickets_test_id_0',
                client_id: mockValidClientsId,
                user_id: mockValidUsersId,
                status: TicketStatus.ISSUED,
                message: 'test_message_0',
                flag: null,
                last_modified: '2025-01-01T14:00:04.000Z',
                created_on: '2025-01-01T14:00:04.000Z'
            },
            {
                ticket_id: 'valid_tickets_test_id_1',
                client_id: mockValidClientsId,
                user_id: mockValidUsersId,
                status: TicketStatus.ISSUED,
                message: 'test_message_1',
                flag: null,
                last_modified: '2025-01-01T14:00:11.000Z',
                created_on: '2025-01-01T14:00:11.000Z'
            }
        ];
    })

    describe('Ruleset: <ClientsBurstLimitRule>', () => {

        describe('Testing valid context calls', () => {

            test('Param: <RateLimitContext> with valid number of client calls', async () => {
                const ruleCBL = new ClientsBurstLimitRule(3);
                const mockContext = structuredClone(mockBurstContext);

                jest.spyOn(ticketsService, 'getTicketsByTimeInterval').mockResolvedValue(mockContext);
                const expectResult = null;
                const testFn = await ruleCBL.check(mockParam_data);

                expect(testFn).toBe(expectResult);
            })
        })

        describe('Testing invalid context calls', () => {

            test('Param: <RateLimitContext> with max client calls', async () => {
                const ruleCBL = new ClientsBurstLimitRule(3);
                const mockContext = structuredClone(mockBurstContext);
                mockContext.push({
                    ticket_id: 'valid_tickets_test_id_2',
                    client_id: mockValidClientsId,
                    user_id: mockValidUsersId,
                    status: TicketStatus.ISSUED,
                    message: 'test_message_2',
                    flag: null,
                    last_modified: '2025-01-01T14:00:23.000Z',
                    created_on: '2025-01-01T14:00:23.000Z'
                });

                jest.spyOn(ticketsService, 'getTicketsByTimeInterval').mockResolvedValue(mockContext);
                jest.spyOn(Utils, 'getNextDayUTC').mockReturnValue(mockRetryAfter);

                const expectResult: RateLimitsResponse = {
                    msg: 'support-ratelimits-clients-burst',
                    retryAfter: mockRetryAfter
                };
                const testFn = await ruleCBL.check(mockParam_data);

                expect(testFn).toMatchObject(expectResult);
            })
        })
    })

    describe('Ruleset: <UsersBurstLimitRule>', () => {

        describe('Testing valid context calls', () => {

            test('Param: <RateLimitContext> with valid number of user calls', async () => {
                const ruleUBL = new UsersBurstLimitRule(3);
                const mockContext = structuredClone(mockBurstContext);

                jest.spyOn(ticketsService, 'getTicketsByTimeInterval').mockResolvedValue(mockContext);
                const expectResult = null;
                const testFn = await ruleUBL.check(mockParam_data);

                expect(testFn).toBe(expectResult);
            })
        })

        describe('Testing invalid context calls', () => {

            test('Param: <RateLimitContext> with max user calls', async () => {
                const ruleUBL = new UsersBurstLimitRule(3);
                const mockContext = structuredClone(mockBurstContext);
                mockContext.push({
                    ticket_id: 'valid_tickets_test_id_2',
                    client_id: mockValidClientsId,
                    user_id: mockValidUsersId,
                    status: TicketStatus.ISSUED,
                    message: 'test_message_2',
                    flag: null,
                    last_modified: '2025-01-01T14:00:23.000Z',
                    created_on: '2025-01-01T14:00:23.000Z'
                });

                jest.spyOn(ticketsService, 'getTicketsByTimeInterval').mockResolvedValue(mockContext);
                jest.spyOn(Utils, 'getNextDayUTC').mockReturnValue(mockRetryAfter);

                const expectResult: RateLimitsResponse = {
                    msg: 'support-ratelimits-users-burst',
                    retryAfter: mockRetryAfter
                };
                const testFn = await ruleUBL.check(mockParam_data);

                expect(testFn).toMatchObject(expectResult);
            })
        })
    })

    describe('Ruleset: <ClientsDailyLimitRule>', () => {

        describe('Testing valid context calls', () => {

            test('Param: <RateLimitContext> number of calls within daily limit', async () => {
                const ruleCDL = new ClientsDailyLimitRule(+secrets.RATELIMITS_CLIENTSDAILYLIMIT);
                const mockCount = +(secrets.RATELIMITS_CLIENTSDAILYLIMIT) - 1;

                jest.spyOn(rateLimitsService, 'getRateLimitCount').mockResolvedValue(mockCount);
                const expectResult = null;
                const testFn = await ruleCDL.check(mockParam_data);

                expect(testFn).toBe(expectResult);
            })

            test('Param: <RateLimitContext> no existing entry', async () => {
                const ruleCDL = new ClientsDailyLimitRule(+secrets.RATELIMITS_CLIENTSDAILYLIMIT);
                const mockCount = 0;

                jest.spyOn(rateLimitsService, 'getRateLimitCount').mockResolvedValue(mockCount);
                const expectResult = null;
                const testFn = await ruleCDL.check(mockParam_data);

                expect(testFn).toBe(expectResult);
            })
        })

        describe('Testing invalid context calls', () => {

            test('Param: <RateLimitContext> number of calls beyond daily limit', async () => {
                const ruleCDL = new ClientsDailyLimitRule(+secrets.RATELIMITS_CLIENTSDAILYLIMIT);
                const mockCount = +secrets.RATELIMITS_CLIENTSDAILYLIMIT;

                jest.spyOn(rateLimitsService, 'getRateLimitCount').mockResolvedValue(mockCount);
                jest.spyOn(Utils, 'getNextDayUTC').mockReturnValue(mockRetryAfter);

                const expectResult: RateLimitsResponse = {
                    msg: 'support-ratelimits-clients-daily',
                    retryAfter: mockRetryAfter
                };
                const testFn = await ruleCDL.check(mockParam_data);

                expect(testFn).toMatchObject(expectResult);
            })
        })
    })

    describe('Ruleset: <UsersDailyLimitRule>', () => {

        describe('Testing valid context calls', () => {

            test('Param: <RateLimitContext> number of calls within daily limit', async () => {
                const ruleUDL = new UsersDailyLimitRule(+secrets.RATELIMITS_USERSDAILYLIMIT);
                const mockCount = +(secrets.RATELIMITS_USERSDAILYLIMIT) - 1;

                jest.spyOn(rateLimitsService, 'getRateLimitCount').mockResolvedValue(mockCount);
                const expectResult = null;
                const testFn = await ruleUDL.check(mockParam_data);

                expect(testFn).toBe(expectResult);
            })

            test('Param: <RateLimitContext> no existing entry', async () => {
                const ruleUDL = new UsersDailyLimitRule(+secrets.RATELIMITS_USERSDAILYLIMIT);
                const mockCount = 0;

                jest.spyOn(rateLimitsService, 'getRateLimitCount').mockResolvedValue(mockCount);
                const expectResult = null;
                const testFn = await ruleUDL.check(mockParam_data);

                expect(testFn).toBe(expectResult);
            })
        })

        describe('Testing invalid context calls', () => {

            test('Param: <RateLimitContext> number of calls beyond daily limit', async () => {
                const ruleUDL = new UsersDailyLimitRule(+secrets.RATELIMITS_USERSDAILYLIMIT);
                const mockCount = +secrets.RATELIMITS_USERSDAILYLIMIT;

                jest.spyOn(rateLimitsService, 'getRateLimitCount').mockResolvedValue(mockCount);
                jest.spyOn(Utils, 'getNextDayUTC').mockReturnValue(mockRetryAfter);

                const expectResult: RateLimitsResponse = {
                    msg: 'support-ratelimits-users-daily',
                    retryAfter: mockRetryAfter
                };
                const testFn = await ruleUDL.check(mockParam_data);

                expect(testFn).toMatchObject(expectResult);
            })
        })
    })

    describe('Ruleset: <TotalDailyLimitRule>', () => {

        describe('Testing valid context calls', () => {

            test('Param: <RateLimitContext> number of calls within daily limit', async () => {
                const ruleTDL = new TotalDailyLimitRule(+secrets.RATELIMITS_TOTALDAILYLIMIT);
                const mockCount = +(secrets.RATELIMITS_TOTALDAILYLIMIT) - 1;

                jest.spyOn(rateLimitsService, 'getRateLimitCount').mockResolvedValue(mockCount);
                const expectResult = null;
                const testFn = await ruleTDL.check();

                expect(testFn).toBe(expectResult);
            })

            test('Param: <RateLimitContext> no existing entry', async () => {
                const ruleTDL = new TotalDailyLimitRule(+secrets.RATELIMITS_TOTALDAILYLIMIT);
                const mockCount = 0;

                jest.spyOn(rateLimitsService, 'getRateLimitCount').mockResolvedValue(mockCount);
                const expectResult = null;
                const testFn = await ruleTDL.check();

                expect(testFn).toBe(expectResult);
            })
        })

        describe('Testing invalid context calls', () => {

            test('Param: <RateLimitContext> number of calls beyond daily limit', async () => {
                const ruleTDL = new TotalDailyLimitRule(+secrets.RATELIMITS_TOTALDAILYLIMIT);
                const mockCount = +secrets.RATELIMITS_TOTALDAILYLIMIT;

                jest.spyOn(rateLimitsService, 'getRateLimitCount').mockResolvedValue(mockCount);
                jest.spyOn(Utils, 'getNextDayUTC').mockReturnValue(mockRetryAfter);

                const expectResult: RateLimitsResponse = {
                    msg: 'support-ratelimits-total-daily',
                    retryAfter: mockRetryAfter
                };
                const testFn = await ruleTDL.check();

                expect(testFn).toMatchObject(expectResult);
            })
        })
    })

    describe('Ruleset: <DemoDailyLimitRule>', () => {

        describe('Testing valid context calls', () => {

            test('Param: <RateLimitContext> number of calls within daily limit', async () => {
                const ruleDDL = new DemoDailyLimitRule(+secrets.DEMOLIMITS_TOTALDAILYLIMIT);
                const mockCount = +(secrets.DEMOLIMITS_TOTALDAILYLIMIT) - 1;

                jest.spyOn(demoLimitsService, 'getDemoLimitCount').mockResolvedValue(mockCount);
                const expectResult = null;
                const testFn = await ruleDDL.check();

                expect(testFn).toBe(expectResult);
            })

            test('Param: <RateLimitContext> no existing entry', async () => {
                const ruleDDL = new DemoDailyLimitRule(+secrets.DEMOLIMITS_TOTALDAILYLIMIT);
                const mockCount = 0;

                jest.spyOn(demoLimitsService, 'getDemoLimitCount').mockResolvedValue(mockCount);
                const expectResult = null;
                const testFn = await ruleDDL.check();

                expect(testFn).toBe(expectResult);
            })
        })

        describe('Testing invalid context calls', () => {

            test('Param: <RateLimitContext> number of calls beyond daily limit', async () => {
                const ruleDDL = new DemoDailyLimitRule(+secrets.DEMOLIMITS_TOTALDAILYLIMIT);
                const mockCount = +secrets.DEMOLIMITS_TOTALDAILYLIMIT;

                jest.spyOn(demoLimitsService, 'getDemoLimitCount').mockResolvedValue(mockCount);
                jest.spyOn(Utils, 'getNextDayUTC').mockReturnValue(mockRetryAfter);

                const expectResult: RateLimitsResponse = {
                    msg: 'support-demolimits-total-daily',
                    retryAfter: mockRetryAfter
                };
                const testFn = await ruleDDL.check();

                expect(testFn).toMatchObject(expectResult);
            })
        })
    })
})