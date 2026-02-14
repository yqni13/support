import { observe } from "../../../src/middleware/observe.middleware";
import * as CommonUtils from "../../../src/utils/common.utils";
import { default as mockId } from "../../mock-data/id.mock-data.json";
import { ApiKeyStatus } from "../../../src/utils/enums/api-key-status.enum";
import { UserStatus } from "../../../src/utils/enums/user-status.enum";
import { RateLimitsEngine } from "../../../src/middleware/engines/rate-limits.engine.middleware";
import { RateLimitsResponse } from "../../../src/middleware/interfaces/rate-limits.interface.middleware";
import { ExceedMaxEndpointException } from "../../../src/utils/exceptions/api.exception";
import { penaltyHandler } from "../../../src/middleware/container/penalty.container.middleware";

describe('Unit-tests (middleware), priority: fn observe()', () => {

    const res: any = {};
    const next = jest.fn();
    const mockTimestamp = '2025-01-01T11:11:11.000Z';
    let req: any;
    beforeEach(() => {
        req = {
            header: jest.fn(),
            body: { test: 'test-content' },
            apiClients: {
                client_id: mockId.clients.valid[0],
                name: 'valid_clients_test_name',
                api_key_hash: 'valid_clients_test_api_key_hash',
                status: ApiKeyStatus.ACTIVE,
                last_use: mockTimestamp,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            },
            apiUsers: {
                user_id: mockId.users.valid[0],
                email: 'valid-users-email@test.com',
                status: UserStatus.ACTIVE,
                flag: null,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            }
        };
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Testing valid fn calls', () => {

        test('Validate caller origin, route: /tickets/create, result: "SUCCESS"', async () => {
            const mockRateLimits: RateLimitsResponse | null = null;

            jest.spyOn(RateLimitsEngine.prototype, 'process').mockResolvedValue(mockRateLimits);

            // middleware == factory fn returning express fn => fn(req, res, next)
            const middleware = observe();
            await middleware(req, res, next);

            expect(next).toHaveBeenCalledWith();
        })

        test('Validate caller origin, route: /meta/demo, result: "SUCCESS"', async () => {
            const mockRateLimits: RateLimitsResponse | null = null;

            jest.spyOn(RateLimitsEngine.prototype, 'process').mockResolvedValue(mockRateLimits);

            // middleware == factory fn returning express fn => fn(req, res, next)
            const middleware = observe(true);
            await middleware(req, res, next);

            expect(next).toHaveBeenCalledWith();
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Validate caller origin, route: /tickets/create, error: ExceedMaxEndpointException', async () => {
            const mockRateLimits: RateLimitsResponse | null = {
                msg: 'support-ratelimits-clients-burst',
                retryAfter: '2025-01-02T00.00.01.000Z'
            };

            jest.spyOn(RateLimitsEngine.prototype, 'process').mockResolvedValue(mockRateLimits);
            jest.spyOn(penaltyHandler, 'apply').mockImplementation();
            jest.spyOn(CommonUtils, 'logError').mockImplementation();

            const middleware = observe();
            await middleware(req, res, next);

            const errArg = next.mock.calls[0][0];
            expect(errArg).toBeInstanceOf(ExceedMaxEndpointException);
            expect(errArg.status).toBe(429);
        })

        test('Validate caller origin, route: /meta/demo, error: ExceedMaxEndpointException', async () => {
            const mockRateLimits: RateLimitsResponse | null = {
                msg: 'support-demolimits-total-daily',
                retryAfter: '2025-01-02T00.00.01.000Z'
            };

            jest.spyOn(RateLimitsEngine.prototype, 'process').mockResolvedValue(mockRateLimits);
            jest.spyOn(penaltyHandler, 'apply').mockImplementation();
            jest.spyOn(CommonUtils, 'logError').mockImplementation();

            const middleware = observe(true);
            await middleware(req, res, next);

            const errArg = next.mock.calls[0][0];
            expect(errArg).toBeInstanceOf(ExceedMaxEndpointException);
            expect(errArg.status).toBe(429);
        })
    })
})