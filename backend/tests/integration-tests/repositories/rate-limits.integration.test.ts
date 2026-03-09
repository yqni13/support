import {
    RateLimitsCountDTO,
    RateLimitsCreateDTO,
    RateLimitsResponseDTO,
    RateLimitsUpdateDTO
} from "../../../src/dtos/rate-limits.dto";
import { default as mockId } from "../../mock-data/id.mock-data.json";
import { DBTestSetup } from "../../db-container.setup";
import { runMigrations } from '../../db-migrations.setup';
import * as MockUtils from "../../common.test-utils";
import * as CommonUtils from '../../../src/utils/common.utils';
import rateLimitsService from "../../../src/services/rate-limits.service";
import demoLimitsService from "../../../src/services/demo-limits.service";
import { DemoLimitsCountDTO, DemoLimitsResponseDTO } from "../../../src/dtos/demo-limits.dto";
import { ClientsId } from "../../../src/repositories/interfaces/clients.entity.interface";
import { UsersId } from "../../../src/repositories/interfaces/users.entity.interface";

jest.setTimeout(60000);

const testValidClientId = mockId.clients.valid[0] as ClientsId;
const testValidUserId = mockId.users.valid[0] as UsersId;

describe('Integration-tests (repository), priority: entity RateLimits', () => {

    let dbTestSetup: DBTestSetup;
    beforeAll(async () => {
        dbTestSetup = new DBTestSetup();
        await dbTestSetup.init();
        MockUtils.disableConsoleMessages(); // Surpress multiple messages (migration progress etc). Disable to debug.
        await runMigrations('rate-limits.integration.test.ts');
    });

    beforeEach(async () => {
        await dbTestSetup.clearTables();
    });

    afterAll(async () => {
        await dbTestSetup.shutdown();
    });

    describe('Testing valid fn calls, route: /tickets/create', () => {

        test('Repository process fn getRateLimitCount(), params: <client_id, day>, result: "SUCCESS"', async () => {
            const dto: RateLimitsCountDTO = {
                client_id: testValidClientId,
                day: '2025-01-01'
            };

            await dbTestSetup.addTestData();
            const testResponse: number = await rateLimitsService.getRateLimitCount(dto);
            const mockResponse: number = 1;

            expect(testResponse).toBe(mockResponse);
        })

        test('Repository process fn getRateLimitCount(), params: <day>, result: "SUCCESS"', async () => {
            const dto: RateLimitsCountDTO = {
                day: '2025-01-01'
            };

            await dbTestSetup.addTestData();
            const testResponse: number = await rateLimitsService.getRateLimitCount(dto);
            const mockResponse: number = 1;

            expect(testResponse).toBe(mockResponse);
        })

        test('Repository process fn createRateLimit(), result: "SUCCESS"', async () => {
            const testTimestamp = '2025-01-02T14:00:05.000Z';
            const mockParam_dto: RateLimitsCreateDTO = {
                client_id: testValidClientId,
                user_id: testValidUserId
            };
            const dateUTC = CommonUtils.getDateUTC(new Date(testTimestamp));
            
            jest.spyOn(CommonUtils, 'getDateUTC').mockReturnValue(dateUTC);
            jest.spyOn(CommonUtils, 'getTimestampUTC').mockReturnValue(testTimestamp);

            await dbTestSetup.addTestData();
            const testResponse = await rateLimitsService.createRateLimit(mockParam_dto);
            const mockResponse: RateLimitsResponseDTO = {
                rate_limit_id: 2,
                client_id: testValidClientId,
                user_id: testValidUserId,
                day: '2025-01-02',
                count: 1,
                last_modified: testTimestamp
            };

            expect(testResponse.count).toBe(1);
            expect(testResponse).toMatchObject(mockResponse);
        })

        test('Repository process fn updateRateLimit(), result: "SUCCESS"', async () => {
            const testTimestamp = '2025-01-01T22:22:22.000Z';
            const dto: RateLimitsUpdateDTO = {
                client_id: testValidClientId,
                user_id: testValidUserId
            };

            jest.spyOn(CommonUtils, 'getDateUTC').mockReturnValue(testTimestamp);
            jest.spyOn(CommonUtils, 'getTimestampUTC').mockReturnValue(testTimestamp);

            await dbTestSetup.addTestData();
            const testResponse = await rateLimitsService.updateRateLimit(dto);
            const mockResponse: RateLimitsResponseDTO = {
                rate_limit_id: 1,
                client_id: testValidClientId,
                user_id: testValidUserId,
                day: '2025-01-01',
                count: 2,
                last_modified: testTimestamp
            };

            expect(testResponse?.count).toBe(2);
            expect(testResponse).toMatchObject(mockResponse);
        })

        test('Repository process fn updateRateLimit(), result: null', async () => {
            const testTimestamp = '2025-01-02T22:22:22.000Z';
            const dto: RateLimitsUpdateDTO = {
                client_id: testValidClientId,
                user_id: testValidUserId
            };

            jest.spyOn(CommonUtils, 'getDateUTC').mockReturnValue(testTimestamp);
            jest.spyOn(CommonUtils, 'getTimestampUTC').mockReturnValue(testTimestamp);

            await dbTestSetup.addTestData();
            const testResponse = await rateLimitsService.updateRateLimit(dto);
            const mockResponse: RateLimitsResponseDTO | null = null;

            expect(testResponse).toBe(mockResponse);
        })
    })

    describe('Testing valid fn calls, route: /test/demo', () => {

        test('Repository process fn getDemoLimitCount(), params: <day>, result: "SUCCESS"', async () => {
            const dto: DemoLimitsCountDTO = {
                day: '2025-01-01'
            };

            await dbTestSetup.addTestData();
            const testResponse: number = await demoLimitsService.getDemoLimitCount(dto);
            const mockResponse: number = 1;

            expect(testResponse).toBe(mockResponse);
        })

        test('Repository process fn createDemoLimit(), result: "SUCCESS"', async () => {
            const testTimestamp = '2025-01-02T14:00:05.000Z';
            const dateUTC = CommonUtils.getDateUTC(new Date(testTimestamp));
            
            jest.spyOn(CommonUtils, 'getDateUTC').mockReturnValue(dateUTC);
            jest.spyOn(CommonUtils, 'getTimestampUTC').mockReturnValue(testTimestamp);

            await dbTestSetup.addTestData();
            const testResponse = await demoLimitsService.createDemoLimit();
            const mockResponse: DemoLimitsResponseDTO = {
                demo_limit_id: 2,
                day: '2025-01-02',
                count: 1,
                last_modified: testTimestamp
            };

            expect(testResponse.count).toBe(1);
            expect(testResponse).toMatchObject(mockResponse);
        })

        test('Repository process fn updateDemoLimit(), result: "SUCCESS"', async () => {
            const testTimestamp = '2025-01-01T22:22:22.000Z';

            jest.spyOn(CommonUtils, 'getDateUTC').mockReturnValue(testTimestamp);
            jest.spyOn(CommonUtils, 'getTimestampUTC').mockReturnValue(testTimestamp);

            await dbTestSetup.addTestData();
            const testResponse = await demoLimitsService.updateDemoLimit();
            const mockResponse: DemoLimitsResponseDTO = {
                demo_limit_id: 1,
                day: '2025-01-01',
                count: 2,
                last_modified: testTimestamp
            };

            expect(testResponse?.count).toBe(2);
            expect(testResponse).toMatchObject(mockResponse);
        })

        test('Repository process fn updateDemoLimit(), result: null', async () => {
            const testTimestamp = '2025-01-02T22:22:22.000Z';

            jest.spyOn(CommonUtils, 'getDateUTC').mockReturnValue(testTimestamp);
            jest.spyOn(CommonUtils, 'getTimestampUTC').mockReturnValue(testTimestamp);

            await dbTestSetup.addTestData();
            const testResponse = await demoLimitsService.updateDemoLimit();
            const mockResponse: DemoLimitsResponseDTO | null = null;

            expect(testResponse).toBe(mockResponse);
        })
    })
})