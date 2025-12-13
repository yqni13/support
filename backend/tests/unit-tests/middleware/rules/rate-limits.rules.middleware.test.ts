import {
    ClientsBurstLimitRule,
    ClientsDailyLimitRule,
    UsersBurstLimitRule,
    UsersDailyLimitRule
} from "../../../../src/middleware/rules/rate-limits.rule.middleware"
import { TicketsResponseDTO } from "../../../../src/dtos/tickets.dto"
import { RateLimitsData, RateLimitsResponse } from "../../../../src/middleware/interfaces/rate-limits.interface.middleware"
import { secrets } from "../../../../src/utils/secrets.utils"
import ticketsService from "../../../../src/services/tickets.service"
import { TicketStatus } from "../../../../src/utils/enums/ticket-status.enum"
import rateLimitsService from "../../../../src/services/rate-limits.service"

describe('Middleware tests category <observation|rate_limits>, priority: rules', () => {

    const mockValidClientsId = 'valid_clients_test_id';
    const mockValidUsersId = 'valid_users_test_id';
    let mockParam_data: RateLimitsData;
    let mockBurstContext: TicketsResponseDTO[];
    beforeEach(() => {
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
                const clientsBLR = new ClientsBurstLimitRule(3);
                const mockContext = structuredClone(mockBurstContext);

                jest.spyOn(ticketsService, 'getTicketsByTimeInterval').mockResolvedValue(mockContext);
                const expectResult = null;
                const testFn = await clientsBLR.check(mockParam_data);

                expect(testFn).toBe(expectResult);
            })
        })
        describe('Testing invalid context calls', () => {

            test('Param: <RateLimitContext> with max client calls', async () => {
                const clientsBLR = new ClientsBurstLimitRule(3);
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
                const expectResult: RateLimitsResponse = { msg: 'support-ratelimits-clients-burst' };
                const testFn = await clientsBLR.check(mockParam_data);

                expect(testFn).toMatchObject(expectResult);
            })
        })
    })

    describe('Ruleset: <UsersBurstLimitRule>', () => {

        describe('Testing valid context calls', () => {
    
            test('Param: <RateLimitContext> with valid number of user calls', async () => {
                const usersBLR = new UsersBurstLimitRule(3);
                const mockContext = structuredClone(mockBurstContext);

                jest.spyOn(ticketsService, 'getTicketsByTimeInterval').mockResolvedValue(mockContext);
                const expectResult = null;
                const testFn = await usersBLR.check(mockParam_data);

                expect(testFn).toBe(expectResult);
            })
        })

        describe('Testing invalid context calls', () => {
    
            test('Param: <RateLimitContext> with max user calls', async () => {
                const usersBLR = new UsersBurstLimitRule(3);
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
                const expectResult: RateLimitsResponse = { msg: 'support-ratelimits-users-burst' };
                const testFn = await usersBLR.check(mockParam_data);

                expect(testFn).toMatchObject(expectResult);
            })
        })
    })

    describe('Ruleset: <ClientsDailyLimitRule>', () => {

        describe('Testing valid context calls', () => {

            test('Param: <RateLimitContext> number of calls within daily limit', async () => {
                const clientsDLR = new ClientsDailyLimitRule(secrets.RATELIMITS_CLIENTSDAILYLIMIT);
                const mockCount = secrets.RATELIMITS_CLIENTSDAILYLIMIT - 1;

                jest.spyOn(rateLimitsService, 'getCountById').mockResolvedValue(mockCount);
                const expectResult = null;
                const testFn = await clientsDLR.check(mockParam_data);

                expect(testFn).toBe(expectResult);
            })

            test('Param: <RateLimitContext> no existing entry', async () => {
                const clientsDLR = new ClientsDailyLimitRule(secrets.RATELIMITS_CLIENTSDAILYLIMIT);
                const mockCount = 0;

                jest.spyOn(rateLimitsService, 'getCountById').mockResolvedValue(mockCount);
                const expectResult = null;
                const testFn = await clientsDLR.check(mockParam_data);

                expect(testFn).toBe(expectResult);
            })
        })
        describe('Testing invalid context calls', () => {

            test('Param: <RateLimitContext> number of calls beyond daily limit', async () => {
                const clientsDLR = new ClientsDailyLimitRule(secrets.RATELIMITS_CLIENTSDAILYLIMIT);
                const mockCount = secrets.RATELIMITS_CLIENTSDAILYLIMIT;

                jest.spyOn(rateLimitsService, 'getCountById').mockResolvedValue(mockCount);
                const expectResult: RateLimitsResponse = { msg: 'support-ratelimits-clients-daily' };
                const testFn = await clientsDLR.check(mockParam_data);

                expect(testFn).toMatchObject(expectResult);
            })
        })
    })

    describe('Ruleset: <UsersDailyLimitRule>', () => {

        describe('Testing valid context calls', () => {

            test('Param: <RateLimitContext> number of calls within daily limit', async () => {
                const usersDLR = new UsersDailyLimitRule(secrets.RATELIMITS_USERSDAILYLIMIT);
                const mockCount = secrets.RATELIMITS_USERSDAILYLIMIT - 1;

                jest.spyOn(rateLimitsService, 'getCountById').mockResolvedValue(mockCount);
                const expectResult = null;
                const testFn = await usersDLR.check(mockParam_data);

                expect(testFn).toBe(expectResult);
            })

            test('Param: <RateLimitContext> no existing entry', async () => {
                const usersDLR = new UsersDailyLimitRule(secrets.RATELIMITS_USERSDAILYLIMIT);
                const mockCount = 0;

                jest.spyOn(rateLimitsService, 'getCountById').mockResolvedValue(mockCount);
                const expectResult = null;
                const testFn = await usersDLR.check(mockParam_data);

                expect(testFn).toBe(expectResult);
            })
        })
        describe('Testing invalid context calls', () => {

            test('Param: <RateLimitContext> number of calls beyond daily limit', async () => {
                const usersDLR = new UsersDailyLimitRule(secrets.RATELIMITS_USERSDAILYLIMIT);
                const mockCount = secrets.RATELIMITS_USERSDAILYLIMIT;

                jest.spyOn(rateLimitsService, 'getCountById').mockResolvedValue(mockCount);
                const expectResult: RateLimitsResponse = { msg: 'support-ratelimits-users-daily' };
                const testFn = await usersDLR.check(mockParam_data);

                expect(testFn).toMatchObject(expectResult);
            })
        })
    })
})