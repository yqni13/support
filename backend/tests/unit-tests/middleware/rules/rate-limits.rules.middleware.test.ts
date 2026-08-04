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
import * as CommonUtils from "../../../../src/utils/common.utils";
import { default as mockId } from "../../../mock-data/id.mock-data.json";
import ticketsService from "../../../../src/services/tickets.service";
import { TicketStatus } from "../../../../src/utils/enums/ticket-status.enum";
import rateLimitsService from "../../../../src/services/rate-limits.service";
import demoLimitsService from "../../../../src/services/demo-limits.service";
import { Violation } from "../../../../src/utils/enums/violations.enum";
import { MaintenanceMode } from "../../../../src/utils/enums/maintenance-mode.enum";
import { TicketOption } from "../../../../src/utils/enums/ticket-option.enum";
import { ClientsId } from "../../../../src/repositories/interfaces/clients.entity.interface";
import { UsersId } from "../../../../src/repositories/interfaces/users.entity.interface";
import { TicketsId } from "../../../../src/repositories/interfaces/tickets.entity.interface";
import { secrets } from "../../../../src/utils/secrets.utils"
import { MetaId } from "../../../../src/repositories/interfaces/meta.entity.interface";

describe('Unit-tests (middleware), priority: implementation RateLimitsRule', () => {

    const mockValidTicketId = mockId.tickets.valid[0] as TicketsId;
    const mockValidClientId = mockId.clients.valid[0] as ClientsId;
    const mockValidUserId = mockId.users.valid[0] as UsersId;
    let mockRetryAfter: string;
    let mockParam_data: RateLimitsData;
    let mockBurstContext: TicketsResponseDTO[];
    beforeEach(() => {
        mockRetryAfter = '2025-01-02T00:00:01.000Z';
        mockParam_data = {
            client_id: mockValidClientId,
            user_id: mockValidUserId
        };
        mockBurstContext = [
            {
                ticket_id: mockValidTicketId,
                client_id: mockValidClientId,
                user_id: mockValidUserId,
                status: TicketStatus.ISSUED,
                option: TicketOption.SUPPORT,
                title: 'test_title_0',
                message: 'test_message_0',
                flag: null,
                last_modified: '2025-01-01T14:00:04.000Z',
                created_on: '2025-01-01T14:00:04.000Z'
            },
            {
                ticket_id: 'valid_tickets_test_id_1' as TicketsId,
                client_id: mockValidClientId,
                user_id: mockValidUserId,
                status: TicketStatus.ISSUED,
                option: TicketOption.SUPPORT,
                title: 'test_title_1',
                message: 'test_message_1',
                flag: null,
                last_modified: '2025-01-01T14:00:11.000Z',
                created_on: '2025-01-01T14:00:11.000Z'
            }
        ];
    })

    describe('Ruleset: <ClientsBurstLimitRule>', () => {

        describe('Testing valid context calls', () => {

            test('Params: <RateLimitContext> with valid number of client calls', async () => {
                const ruleCBL = new ClientsBurstLimitRule(3);
                const mockContext = structuredClone(mockBurstContext);

                jest.spyOn(ticketsService, 'getTicketsByTimeInterval').mockResolvedValue(mockContext);
                const expectResult = null;
                const testFn = await ruleCBL.check(mockParam_data);

                expect(testFn).toBe(expectResult);
            })
        })

        describe('Testing invalid context calls', () => {

            test('Params: <RateLimitContext> with max client calls', async () => {
                const ruleCBL = new ClientsBurstLimitRule(3);
                const mockContext = structuredClone(mockBurstContext);
                mockContext.push({
                    ticket_id: 'valid_tickets_test_id_2' as TicketsId,
                    client_id: mockValidClientId,
                    user_id: mockValidUserId,
                    status: TicketStatus.ISSUED,
                    option: TicketOption.SUPPORT,
                    title: 'test_title_2',
                    message: 'test_message_2',
                    flag: null,
                    last_modified: '2025-01-01T14:00:23.000Z',
                    created_on: '2025-01-01T14:00:23.000Z'
                });

                jest.spyOn(ticketsService, 'getTicketsByTimeInterval').mockResolvedValue(mockContext);
                jest.spyOn(CommonUtils, 'getNextDayUTC').mockReturnValue(mockRetryAfter);

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

            test('Params: <RateLimitContext> with valid number of user calls', async () => {
                const ruleUBL = new UsersBurstLimitRule(3);
                const mockContext = structuredClone(mockBurstContext);

                jest.spyOn(ticketsService, 'getTicketsByTimeInterval').mockResolvedValue(mockContext);
                const expectResult = null;
                const testFn = await ruleUBL.check(mockParam_data);

                expect(testFn).toBe(expectResult);
            })
        })

        describe('Testing invalid context calls', () => {

            test('Params: <RateLimitContext> with max user calls', async () => {
                const ruleUBL = new UsersBurstLimitRule(3);
                const mockContext = structuredClone(mockBurstContext);
                mockContext.push({
                    ticket_id: 'valid_tickets_test_id_2' as TicketsId,
                    client_id: mockValidClientId,
                    user_id: mockValidUserId,
                    status: TicketStatus.ISSUED,
                    option: TicketOption.SUPPORT,
                    title: 'test_title_2',
                    message: 'test_message_2',
                    flag: null,
                    last_modified: '2025-01-01T14:00:23.000Z',
                    created_on: '2025-01-01T14:00:23.000Z'
                });

                jest.spyOn(ticketsService, 'getTicketsByTimeInterval').mockResolvedValue(mockContext);
                jest.spyOn(CommonUtils, 'getNextDayUTC').mockReturnValue(mockRetryAfter);

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

            test('Params: <RateLimitContext> number of calls within daily limit', async () => {
                const ruleCDL = new ClientsDailyLimitRule(Number(secrets.RATELIMITS_CLIENTSDAILYLIMIT));
                const mockCount = Number(secrets.RATELIMITS_CLIENTSDAILYLIMIT) - 1;

                jest.spyOn(rateLimitsService, 'getRateLimitCount').mockResolvedValue(mockCount);
                const expectResult = null;
                const testFn = await ruleCDL.check(mockParam_data);

                expect(testFn).toBe(expectResult);
            })

            test('Params: <RateLimitContext> no existing entry', async () => {
                const ruleCDL = new ClientsDailyLimitRule(Number(secrets.RATELIMITS_CLIENTSDAILYLIMIT));
                const mockCount = 0;

                jest.spyOn(rateLimitsService, 'getRateLimitCount').mockResolvedValue(mockCount);
                const expectResult = null;
                const testFn = await ruleCDL.check(mockParam_data);

                expect(testFn).toBe(expectResult);
            })
        })

        describe('Testing invalid context calls', () => {

            test('Params: <RateLimitContext> number of calls beyond daily limit', async () => {
                const ruleCDL = new ClientsDailyLimitRule(Number(secrets.RATELIMITS_CLIENTSDAILYLIMIT));
                const mockCount = Number(secrets.RATELIMITS_CLIENTSDAILYLIMIT);
                const testParam_data = structuredClone(mockParam_data);
                Object.assign(testParam_data, { clients: { flag: null }});

                jest.spyOn(rateLimitsService, 'getRateLimitCount').mockResolvedValue(mockCount);
                jest.spyOn(CommonUtils, 'getNextDayUTC').mockReturnValue(mockRetryAfter);

                const expectResult: RateLimitsResponse = {
                    msg: 'support-ratelimits-clients-daily',
                    retryAfter: mockRetryAfter,
                    penalty: {
                        type: Violation.CLIENTSFLAG,
                        id: mockValidClientId,
                        penaltyValue: null
                    }
                };
                const testFn = await ruleCDL.check(testParam_data);

                expect(testFn).toMatchObject(expectResult);
            })
        })
    })

    describe('Ruleset: <UsersDailyLimitRule>', () => {

        describe('Testing valid context calls', () => {

            test('Params: <RateLimitContext> number of calls within daily limit', async () => {
                const ruleUDL = new UsersDailyLimitRule(Number(secrets.RATELIMITS_USERSDAILYLIMIT));
                const mockCount = Number(secrets.RATELIMITS_USERSDAILYLIMIT) - 1;

                jest.spyOn(rateLimitsService, 'getRateLimitCount').mockResolvedValue(mockCount);
                const expectResult = null;
                const testFn = await ruleUDL.check(mockParam_data);

                expect(testFn).toBe(expectResult);
            })

            test('Params: <RateLimitContext> no existing entry', async () => {
                const ruleUDL = new UsersDailyLimitRule(Number(secrets.RATELIMITS_USERSDAILYLIMIT));
                const mockCount = 0;

                jest.spyOn(rateLimitsService, 'getRateLimitCount').mockResolvedValue(mockCount);
                const expectResult = null;
                const testFn = await ruleUDL.check(mockParam_data);

                expect(testFn).toBe(expectResult);
            })
        })

        describe('Testing invalid context calls', () => {

            test('Params: <RateLimitContext> number of calls beyond daily limit', async () => {
                const ruleUDL = new UsersDailyLimitRule(Number(secrets.RATELIMITS_USERSDAILYLIMIT));
                const mockCount = Number(secrets.RATELIMITS_USERSDAILYLIMIT);
                const testParam_data = structuredClone(mockParam_data);
                Object.assign(testParam_data, { users: { flag: null }});

                jest.spyOn(rateLimitsService, 'getRateLimitCount').mockResolvedValue(mockCount);
                jest.spyOn(CommonUtils, 'getNextDayUTC').mockReturnValue(mockRetryAfter);

                const expectResult: RateLimitsResponse = {
                    msg: 'support-ratelimits-users-daily',
                    retryAfter: mockRetryAfter,
                    penalty: {
                        type: Violation.USERSFLAG,
                        id: mockValidUserId,
                        penaltyValue: null
                    }
                };
                const testFn = await ruleUDL.check(testParam_data);

                expect(testFn).toMatchObject(expectResult);
            })
        })
    })

    describe('Ruleset: <TotalDailyLimitRule>', () => {

        describe('Testing valid context calls', () => {

            test('Params: <RateLimitContext> number of calls within daily limit', async () => {
                const ruleTDL = new TotalDailyLimitRule(Number(secrets.RATELIMITS_TOTALDAILYLIMIT));
                const mockCount = Number(secrets.RATELIMITS_TOTALDAILYLIMIT) - 1;

                jest.spyOn(rateLimitsService, 'getRateLimitCount').mockResolvedValue(mockCount);
                const expectResult = null;
                const testFn = await ruleTDL.check();

                expect(testFn).toBe(expectResult);
            })

            test('Params: <RateLimitContext> no existing entry', async () => {
                const ruleTDL = new TotalDailyLimitRule(Number(secrets.RATELIMITS_TOTALDAILYLIMIT));
                const mockCount = 0;

                jest.spyOn(rateLimitsService, 'getRateLimitCount').mockResolvedValue(mockCount);
                const expectResult = null;
                const testFn = await ruleTDL.check();

                expect(testFn).toBe(expectResult);
            })
        })

        describe('Testing invalid context calls', () => {

            test('Params: <RateLimitContext> number of calls beyond daily limit', async () => {
                const ruleTDL = new TotalDailyLimitRule(Number(secrets.RATELIMITS_TOTALDAILYLIMIT));
                const mockCount = Number(secrets.RATELIMITS_TOTALDAILYLIMIT);

                jest.spyOn(rateLimitsService, 'getRateLimitCount').mockResolvedValue(mockCount);
                jest.spyOn(CommonUtils, 'getNextDayUTC').mockReturnValue(mockRetryAfter);

                const expectResult: RateLimitsResponse = {
                    msg: 'support-ratelimits-total-daily',
                    retryAfter: mockRetryAfter,
                    penalty: {
                        type: Violation.MAINTENANCE_TRAFFIC,
                        id: mockId.meta.valid[0] as MetaId,
                        penaltyValue: MaintenanceMode.T011
                    }
                };
                const testFn = await ruleTDL.check();

                expect(testFn).toMatchObject(expectResult);
            })
        })
    })

    describe('Ruleset: <DemoDailyLimitRule>', () => {

        describe('Testing valid context calls', () => {

            test('Params: <RateLimitContext> number of calls within daily limit', async () => {
                const ruleDDL = new DemoDailyLimitRule(Number(secrets.DEMOLIMITS_TOTALDAILYLIMIT));
                const mockCount = Number(secrets.DEMOLIMITS_TOTALDAILYLIMIT) - 1;

                jest.spyOn(demoLimitsService, 'getDemoLimitCount').mockResolvedValue(mockCount);
                const expectResult = null;
                const testFn = await ruleDDL.check();

                expect(testFn).toBe(expectResult);
            })

            test('Params: <RateLimitContext> no existing entry', async () => {
                const ruleDDL = new DemoDailyLimitRule(Number(secrets.DEMOLIMITS_TOTALDAILYLIMIT));
                const mockCount = 0;

                jest.spyOn(demoLimitsService, 'getDemoLimitCount').mockResolvedValue(mockCount);
                const expectResult = null;
                const testFn = await ruleDDL.check();

                expect(testFn).toBe(expectResult);
            })
        })

        describe('Testing invalid context calls', () => {

            test('Params: <RateLimitContext> number of calls beyond daily limit', async () => {
                const ruleDDL = new DemoDailyLimitRule(Number(secrets.DEMOLIMITS_TOTALDAILYLIMIT));
                const mockCount = Number(secrets.DEMOLIMITS_TOTALDAILYLIMIT);

                jest.spyOn(demoLimitsService, 'getDemoLimitCount').mockResolvedValue(mockCount);
                jest.spyOn(CommonUtils, 'getNextDayUTC').mockReturnValue(mockRetryAfter);

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