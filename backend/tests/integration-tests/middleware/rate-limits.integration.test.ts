import { default as mockId } from "../../mock-data/id.mock-data.json";
import { DBTestSetup } from "../../db-container.setup";
import { runMigrations } from '../../db-migrations.setup';
import * as MockUtils from "../../common.test-utils";
import * as Utils from '../../../src/utils/common.utils';
import rateLimitsService from "../../../src/services/rate-limits.service";
import { RateLimitsCountDTO, RateLimitsResponseDTO, RateLimitsCreateUpdateDTO } from "../../../src/dtos/rate-limits.dto";

jest.setTimeout(60000);

const testValidClientsId = mockId.clients.valid[0];
const testValidUsersId = mockId.users.valid[0];

describe('Integration test (repository specific without Route/Controller), priority: RateLimits', () => {

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

    describe('Testing valid fn calls', () => {

        test('Repository process fn count, params: <client_id, day>, result: "SUCCESS"', async () => {
            const dto: RateLimitsCountDTO = {
                client_id: mockId.clients.valid[0],
                day: '2025-01-01'
            };

            await dbTestSetup.addTestData();
            const testResponse: number = await rateLimitsService.getRateLimitCount(dto);
            const mockResponse: number = 1;

            expect(testResponse).toBe(mockResponse);
        })

        test('Repository process fn count, params: <day>, result: "SUCCESS"', async () => {
            const dto: RateLimitsCountDTO = {
                day: '2025-01-01'
            };

            await dbTestSetup.addTestData();
            const testResponse: number = await rateLimitsService.getRateLimitCount(dto);
            const mockResponse: number = 1;

            expect(testResponse).toBe(mockResponse);
        })

        test('Repository process fn create, result: "SUCCESS"', async () => {
            const testTimestamp = '2025-01-02T14:00:05.000Z';
            const mockParam_dto: RateLimitsCreateUpdateDTO = {
                client_id: testValidClientsId,
                user_id: testValidUsersId
            };
            const dateUTC = Utils.getDateUTC(new Date(testTimestamp));
            
            jest.spyOn(Utils, 'getDateUTC').mockReturnValue(dateUTC);
            jest.spyOn(Utils, 'getTimestampUTC').mockReturnValue(testTimestamp);

            await dbTestSetup.addTestData();
            const testResponse = await rateLimitsService.createRateLimit(mockParam_dto);
            const mockResponse: RateLimitsResponseDTO = {
                rate_limit_id: 2,
                client_id: testValidClientsId,
                user_id: testValidUsersId,
                day: '2025-01-02',
                count: 1,
                last_modified: testTimestamp
            };

            expect(testResponse.count).toBe(1);
            expect(testResponse).toMatchObject(mockResponse);
        })

        test('Repository process fn update, result: "SUCCESS"', async () => {
            const testTimestamp = '2025-01-01T22:22:22.000Z';
            const dto: RateLimitsCreateUpdateDTO = {
                client_id: testValidClientsId,
                user_id: testValidUsersId
            };

            jest.spyOn(Utils, 'getDateUTC').mockReturnValue(testTimestamp);
            jest.spyOn(Utils, 'getTimestampUTC').mockReturnValue(testTimestamp);

            await dbTestSetup.addTestData();
            const testResponse = await rateLimitsService.updateRateLimit(dto);
            const mockResponse: RateLimitsResponseDTO = {
                rate_limit_id: 1,
                client_id: testValidClientsId,
                user_id: testValidUsersId,
                day: '2025-01-01',
                count: 2,
                last_modified: testTimestamp
            };

            expect(testResponse?.count).toBe(2);
            expect(testResponse).toMatchObject(mockResponse);
        })

        test('Repository process fn update, result: null', async () => {
            const testTimestamp = '2025-01-02T22:22:22.000Z';
            const dto: RateLimitsCreateUpdateDTO = {
                client_id: testValidClientsId,
                user_id: testValidUsersId
            };

            jest.spyOn(Utils, 'getDateUTC').mockReturnValue(testTimestamp);
            jest.spyOn(Utils, 'getTimestampUTC').mockReturnValue(testTimestamp);

            await dbTestSetup.addTestData();
            const testResponse = await rateLimitsService.updateRateLimit(dto);
            const mockResponse: RateLimitsResponseDTO | null = null;

            expect(testResponse).toBe(mockResponse);
        })
    })
})