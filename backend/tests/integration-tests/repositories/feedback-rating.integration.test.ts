import { NextFunction, Request, Response } from "express";
import * as CommonUtils from '../../../src/utils/common.utils';
import * as MockUtils from "../../common.test-utils";
import request from 'supertest';
import { DBTestSetup } from "../../db-container.setup";
import { runMigrations } from '../../db-migrations.setup';
import { default as mockId } from "../../mock-data/id.mock-data.json";
import { FeedbackRatingCreateDTO, FeedbackRatingExtendedResponseDTO, FeedbackRatingResponseDTO, FeedbackRatingUpdateDTO } from "../../../src/dtos/feedback-rating.dto";
import { FeedbackRating } from "../../../src/repositories/interfaces/feedback-rating.entity.interface";
import feedbackRatingService from "../../../src/services/feedback-rating.service";
import { ErrorStatusCodes } from "../../../src/utils/errorStatusCodes.utils";
import { CommonExceptionMessage } from "../../../src/utils/enums/common-exception-messages.enum";


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

jest.setTimeout(60000);

const testTimestamp = '2025-01-01T14:00:09.000Z';

describe('Integration-tests (repository), priority: entity FeedbackRating', () => {

    let dbTestSetup: DBTestSetup;
    let apiUrl: string;
    beforeAll(async () => {
        dbTestSetup = new DBTestSetup();
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
                count: 16,
                rating_sum: 67,
                rating_average: 4.2,
                last_modified: testTimestamp,
                created_on: testTimestamp
            };

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/by-id/${testParam_id}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn findByClientName(), result: "SUCCESS"', async () => {
            const testParam_client_name = 'TESTCLIENT';
            const testResult: FeedbackRatingResponseDTO | null = {
                rating_average: 4.2,
            };

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/by-name/${testParam_client_name}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn findAll(), result: "SUCCESS"', async () => {
            const testResult: FeedbackRatingExtendedResponseDTO[] | null = [
                {
                    client_id: mockId.clients.valid[0],
                    count: 16,
                    rating_sum: 67,
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

        test('Repository process fn create(), result: "SUCCESS"', async () => {
            // TicketsCreateRequestDTO interface necessary to mock auth middleware (data for client_id & user_id).
            const testParam_dto: FeedbackRatingCreateDTO = {
                client_id: mockId.clients.valid[1]
            };

            jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(testTimestamp);

            const testResult: FeedbackRating = {
                client_id: testParam_dto.client_id,
                count: 0,
                rating_sum: 0,
                last_modified: testTimestamp,
                created_on: testTimestamp
            };

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/create`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult)
        })

        test('Repository process fn update(), result: "SUCCESS"', async () => {
            const testParam_id: string = mockId.clients.valid[0];
            const testParam_dto: FeedbackRatingUpdateDTO = { rating: 1 };

            jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(testTimestamp);

            const testResult: FeedbackRatingResponseDTO | null = {
                rating_average: 4.0
            };

            await dbTestSetup.addTestData();
            const testResponse = await feedbackRatingService.updateFeedbackRating(testParam_id, testParam_dto);

            expect(testResponse).toMatchObject(testResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        describe('All routes, priority: express-validators, location <params>', () => {

            describe('Route: GET/by-id/:id', () => {

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
                        .get(`${apiUrl}/by-id/${testParam_id}`);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([testError]);
                })
            })
        })

        describe('All routes, priority: express-validators, location <body>', () => {

            describe('Route: POST/create', () => {

                test('Params: <client_id>, validator: fn notEmpty() by empty string', async () => {
                    const testParam_dto: FeedbackRatingCreateDTO = { client_id: '' };
                    const mockError = {
                        type: 'field',
                        value: '',
                        msg: CommonExceptionMessage.REQUIRED,
                        path: 'client_id',
                        location: 'body'
                    };

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toContainEqual(mockError);
                })

                test('Params: <client_id>, validator: fn isUUID() by invalid id', async () => {
                    const testParam_dto: FeedbackRatingCreateDTO = { client_id: 'invalid-id' };
                    const testError = {
                        type: 'field',
                        value: testParam_dto.client_id,
                        msg: 'support-invalid-entry#client_id',
                        path: 'client_id',
                        location: 'body'
                    };

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([testError]);
                })
            })
        })

        describe('All routes, priority: error middleware, location: <body>', () => {

            describe('Route: POST/create', () => {

                test('Params: <FeedbackRatingCreateDTO>, validator: fn requirePayload() by undefined', async () =>{
                    const testParam_dto = undefined;
                    const testError = {
                        type: 'field',
                        value: '',
                        msg: 'support-payload-required',
                        path: 'req.body',
                        location: 'body'
                    };

                    jest.spyOn(CommonUtils, 'logError').mockImplementation();

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([testError]);
                })
            })
        })
    })
})