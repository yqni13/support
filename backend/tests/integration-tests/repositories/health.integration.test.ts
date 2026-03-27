import { NextFunction, Request, Response } from "express";
import * as MockUtils from "../../common.test-utils";
import { DBTestSetup } from "../../db-container.setup";
import { runMigrations } from '../../db-migrations.setup';
import request from 'supertest';
import { HealthCheckExtended } from "../../../src/services/interfaces/health.interface.service";
import { EnvMode } from "../../../src/utils/enums/env-mode.enum";

jest.mock('../../../src/middleware/auth.admin.middleware', () => ({
    authAdmin: jest.fn(() => (req: Request, res: Response, next: NextFunction) => next())
}));

import app from '../../../src/app';

jest.setTimeout(60000);

describe('Integration-tests (repository), priority: HealthCheck', () => {

    let dbTestSetup: DBTestSetup;
    let apiUrl: string;
    beforeAll(async () => {
        dbTestSetup = new DBTestSetup();
        await dbTestSetup.init();
        MockUtils.disableConsoleMessages(); // Surpress multiple messages (migration progress etc). Disable to debug.
        await runMigrations('health.integration.test.ts');
        apiUrl = '/api/v1/health';
    });

    beforeEach(async () => {
        // Clean tables before each test to fill test data individually.
        await dbTestSetup.clearTables();
    });

    afterAll(async () => {
        await dbTestSetup.shutdown();
    });

    describe('Testing valid fn calls', () => {

        test('Repository process fn checkDatabase(), result: ?', async () => {
            const mockResult: Partial<HealthCheckExtended> = {
                status: 200,
                db: {
                    status: 'ok'
                },
                environment: EnvMode.TEST,
            };

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/details`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body['db']).toEqual(mockResult.db);
            expect(testResponse.body['environment']).toEqual(mockResult.environment);
        })
    })
})