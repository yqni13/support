import { NextFunction, Request, Response } from "express";
import * as MockUtils from "../../common.test-utils";
import request from 'supertest';
import { DBTestSetup } from "../../db-container.setup";
import { runMigrations } from '../../db-migrations.setup';
import { default as mockId } from "../../mock-data/id.mock-data.json";
import { FeedbackRatingExtendedResponseDTO, FeedbackRatingResponseDTO } from "../../../src/dtos/feedback-rating.dto";
import { ErrorStatusCodes } from "../../../src/utils/errorStatusCodes.utils";

jest.mock('../../../src/middleware/auth.admin.middleware', () => ({
    authAdmin: jest.fn(() => (req: Request, res: Response, next: NextFunction) => next())
}));
jest.mock('../../../src/middleware/auth.client.middleware', () => ({
    authClient: jest.fn(() => (req: Request, res: Response, next: NextFunction) => {
        (req as any).apiClients = { client_id: mockId.clients.valid[0] };
        next();
    })
}));
jest.mock('../../../src/middleware/maintenance.middleware', () => ({
    maintain: jest.fn(() =>  (req: Request, res: Response, next: NextFunction) => next())
}));

import app from '../../../src/app';
import { DBTestData } from "../../db-data.setup";

jest.setTimeout(60000);

const testTimestamp = '2025-01-01T14:00:09.000Z';

describe('Integration-tests (repository), priority: entity FeedbackRating', () => {

    let dbTestSetup: DBTestSetup;
    let dbTestData: DBTestData;
    let dbData_FeedbackRating: any[];
    let apiUrl: string;
    beforeAll(async () => {
        dbTestSetup = new DBTestSetup();
        dbTestData = DBTestData.getInstance();
        dbData_FeedbackRating = dbTestData.getFeedbackRatingInsertSql().values;
        await dbTestSetup.init();
        MockUtils.disableConsoleMessages(); // Surpress multiple messages (migration progress etc). Disable to debug.
        await runMigrations('feedback-rating.integration.test.ts');
        apiUrl = '/api/v1/feedback-rating';
    });
    beforeEach(async () => {
        // Clean tables before each test to fill test data individually.
        await dbTestSetup.clearTables();
    });
    afterAll(async () => {
        await dbTestSetup.shutdown();
    });

    describe('Testing valid fn calls', () => {

        test('Repository process fn findById(), result: "SUCCESS"', async () => {
            const testParam_id = mockId.clients.valid[0];
            const testResult: FeedbackRatingExtendedResponseDTO | null = {
                client_id: testParam_id,
                count: dbData_FeedbackRating[1],
                rating_sum: dbData_FeedbackRating[2],
                rating_average: 4.2,
                last_modified: testTimestamp,
                created_on: testTimestamp
            };

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/id/${testParam_id}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn findByClientName(), result: "SUCCESS"', async () => {
            const dbData_Clients = dbTestData.getClientsInsertSql().values;
            const testParam_client_name = dbData_Clients[1];
            const testResult: FeedbackRatingResponseDTO | null = {
                rating_average: 4.2,
            };

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/name/${testParam_client_name}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn findAll(), result: "SUCCESS"', async () => {
            const testResult: FeedbackRatingExtendedResponseDTO[] | null = [
                {
                    client_id: mockId.clients.valid[0],
                    count: dbData_FeedbackRating[1],
                    rating_sum: dbData_FeedbackRating[2],
                    rating_average: 4.2,
                    last_modified: testTimestamp,
                    created_on: testTimestamp
                }
            ];

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/all`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        // Create/Update process tested in feedback.integration.test.ts file.
    })

    describe('Testing invalid fn calls', () => {

        describe('All routes, priority: express-validators, location <params>', () => {

            describe('Route: GET/id/:id', () => {

                test('Params: <id>, validator: fn isUUID() by invalid id', async () => {
                    const testParam_id = 'invalid-id';
                    const testError = {
                        type: 'field',
                        value: testParam_id,
                        msg: 'support-invalid-entry#client_id',
                        path: 'id',
                        location: 'params'
                    };

                    const testResponse = await request(app)
                        .get(`${apiUrl}/id/${testParam_id}`);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([testError]);
                })
            })
        })
    })
})