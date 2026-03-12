import * as CommonUtils from '../../../src/utils/common.utils';
import * as MockUtils from "../../common.test-utils";
import { createTestApp } from '../../test-app.setup';
import request from 'supertest';
import { DBTestSetup } from "../../db-container.setup";
import { runMigrations } from '../../db-migrations.setup';
import { default as mockId } from "../../mock-data/id.mock-data.json";
import { NextFunction, Request, Response } from "express";
import { CommonExceptionMessage } from "../../../src/utils/enums/common-exception-messages.enum";
import { ErrorStatusCodes } from "../../../src/utils/errorStatusCodes.utils";
import { FeedbackCreateDTO, FeedbackFilterDTO, FeedbackRequestCreateDTO, FeedbackResponseDTO } from '../../../src/dtos/feedback.dto';
import { DBTestData } from '../../db-data.setup';
import router from '../../../src/routes/feedback.route';
import feedbackRatingService from '../../../src/services/feedback-rating.service';
import feedbackRepository from '../../../src/repositories/feedback.repository';
import feedbackService from '../../../src/services/feedback.service';
import { DBConstraintErrorException, DBQueryErrorException } from '../../../src/utils/exceptions/db.exception';
import feedbackRatingRepository from '../../../src/repositories/feedback-rating.repository';
import { ClientsId } from '../../../src/repositories/interfaces/clients.entity.interface';
import { UsersId } from '../../../src/repositories/interfaces/users.entity.interface';
import { FeedbackId } from '../../../src/repositories/interfaces/feedback.entity.interface';

jest.mock('../../../src/middleware/auth.admin.middleware', () => ({
    authAdmin: jest.fn(() => (req: Request, res: Response, next: NextFunction) => next())
}));
jest.mock('../../../src/middleware/auth.client.middleware', () => ({
    authClient: jest.fn(() => (req: Request, res: Response, next: NextFunction) => next())
}));
jest.mock('../../../src/middleware/auth.user.middleware', () => ({
    authUser: jest.fn(() => (req: Request, res: Response, next: NextFunction) => next())
}));
jest.mock('../../../src/middleware/maintenance.middleware', () => ({
    maintain: jest.fn(() =>  (req: Request, res: Response, next: NextFunction) => next())
}));
jest.mock('../../../src/middleware/observe.middleware.ts', () => ({
    observe: jest.fn(() => (req: Request, res: Response, next: NextFunction) => next())
}))

jest.setTimeout(60000);

const testValidFeedbackId = mockId.feedback.valid[0] as FeedbackId;
const testValidClientId = mockId.clients.valid[0] as ClientsId;
const testValidUserId = mockId.users.valid[0] as UsersId;
const testTimestamp = '2025-01-01T14:00:08.000Z';

describe('Integration-tests (repository), priority: entity Feedback', () => {

    let dbTestSetup: DBTestSetup;
    let dbTestData: DBTestData;
    let dbData_Feedback: any[];
    let dbData_FeedbackRating: any[];
    let apiUrl: string;
    beforeAll(async () => {
        dbTestSetup = new DBTestSetup();
        dbTestData = DBTestData.getInstance();
        dbData_Feedback = dbTestData.getFeedbackInsertSql().values;
        dbData_FeedbackRating = dbTestData.getFeedbackRatingInsertSql().values;
        await dbTestSetup.init();
        MockUtils.disableConsoleMessages(); // Surpress multiple messages (migration progress etc). Disable to debug.
        await runMigrations('feedback.integration.test.ts');
        apiUrl = '/api/v1/feedback';
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
            const app = createTestApp([], router, apiUrl);
            const testParam_id = testValidFeedbackId;
            const testResult: FeedbackResponseDTO | null = {
                feedback_id: testParam_id,
                client_id: testValidClientId,
                user_id: testValidUserId,
                rating: dbData_Feedback[2],
                term_accepted: dbData_Feedback[3],
                message: dbData_Feedback[4],
                last_modified: testTimestamp,
                created_on: testTimestamp
            };

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/id/${testParam_id}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn findByFilter(), result: "SUCCESS"', async () => {
            const app = createTestApp([], router, apiUrl);
            const testParam_dto: FeedbackFilterDTO = {
                term_accepted: false
            };
            const testResult: FeedbackResponseDTO[] | null = null;

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/search`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toBe(testResult);
        })

        test('Repository process fn upsertInTa(), result: new Feedback on existing FeedbackRating', async () => {
            const app = createTestApp([
                    MockUtils.injectTestClientId(testValidClientId),
                    MockUtils.injectTestUserId(mockId.users.valid[1] as UsersId)
                ], router, apiUrl);
            const email = dbTestData.getUsersInsertSql().values[7]; // name, 2nd insert-row
            const testParam_dto: FeedbackRequestCreateDTO = {
                user_email: email,
                rating: 4,
                term_accepted: false,
            };
            const mockResult_average_rating = 
                Number(((dbData_FeedbackRating[2] + testParam_dto.rating) / (dbData_FeedbackRating[1] + 1)).toFixed(1));

            jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(testTimestamp);

            const testResult: FeedbackResponseDTO = {
                feedback_id: mockId.feedback.new[0] as FeedbackId,
                client_id: testValidClientId,
                user_id: mockId.users.valid[1] as UsersId,
                rating: testParam_dto.rating,
                rating_average_new: mockResult_average_rating,
                term_accepted: testParam_dto.term_accepted,
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

        test('Repository process fn upsertInTa(), result: new Feedback & FeedbackRating', async () => {
            const app = createTestApp([
                    MockUtils.injectTestClientId(mockId.clients.valid[1] as ClientsId),
                    MockUtils.injectTestUserId(testValidUserId)
                ], router, apiUrl);
            const email = dbTestData.getUsersInsertSql().values[7];
            const testParam_dto: FeedbackRequestCreateDTO = {
                user_email: email,
                rating: 5,
                term_accepted: true,
                message: 'test-feedback-message-new-client[1]'
            };

            jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(testTimestamp);

            const testResult: FeedbackResponseDTO = {
                feedback_id: mockId.feedback.new[0] as FeedbackId,
                client_id: mockId.clients.valid[1] as ClientsId,
                user_id: testValidUserId,
                rating: testParam_dto.rating,
                rating_average_new: testParam_dto.rating,
                term_accepted: testParam_dto.term_accepted,
                last_modified: testTimestamp,
                created_on: testTimestamp
            };

            await dbTestSetup.addTestData();
            const testResponse_Feedback = await request(app)
                .post(`${apiUrl}/create`)
                .send(testParam_dto);

            const testResponse_FeedbackRating = 
                await feedbackRatingService.getExtendedFeedbackRatingById(mockId.clients.valid[1] as ClientsId);

            expect(testResponse_Feedback.statusCode).toBe(200);
            expect(testResponse_Feedback.body).toMatchObject(testResult);
            expect(testResponse_FeedbackRating?.count).toBe(1);
            expect(testResponse_FeedbackRating?.rating_sum).toBe(testParam_dto.rating);
        })

        test('Repository process fn upsertInTa(), result: update existing Feedback & FeedbackRating', async () => {
            const app = createTestApp([
                MockUtils.injectTestClientId(testValidClientId),
                MockUtils.injectTestUserId(testValidUserId)
            ], router, apiUrl);
            const email = dbTestData.getUsersInsertSql().values[1];
            const testParam_dto: FeedbackRequestCreateDTO = {
                user_email: email,
                rating: 2,
                term_accepted: true,
            };
            // Test data FeedbackRating => position (count): [1], position (rating_sum): [2]
            const ratingDifference = testParam_dto.rating - dbTestData.getFeedbackInsertSql().values[2];
            const mockResult_rating_sum = dbData_FeedbackRating[2] + ratingDifference;
            const mockResult_average_rating = Number((mockResult_rating_sum / (dbData_FeedbackRating[1])).toFixed(1));
            const testTimestamp_update = '2026-01-01T14:00:08.000Z';

            jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(testTimestamp_update);

            const testResult: FeedbackResponseDTO = {
                feedback_id: testValidFeedbackId,
                client_id: testValidClientId,
                user_id: testValidUserId,
                rating: testParam_dto.rating,
                rating_average_new: mockResult_average_rating,
                term_accepted: testParam_dto.term_accepted,
                last_modified: testTimestamp_update,
                created_on: testTimestamp,
            };

            await dbTestSetup.addTestData();
            // Update reviewed_on from NULL to value, otherwise WHERE clause sets blocked:true => throw exception.
            await feedbackService.updateFeedbackReview(testValidFeedbackId);
            const testResponse_Feedback = await request(app)
                .post(`${apiUrl}/create`)
                .send(testParam_dto);

            const testResponse_FeedbackRating = 
                await feedbackRatingService.getExtendedFeedbackRatingById(testValidClientId);

            expect(testResponse_Feedback.statusCode).toBe(200);
            expect(testResponse_Feedback.body).toMatchObject(testResult);
            expect(testResponse_FeedbackRating?.count).toBe(dbData_FeedbackRating[1]);
            expect(testResponse_FeedbackRating?.rating_sum).toBe(mockResult_rating_sum);
        })

        test('Repository process fn upsertInTa(), result: Exception on Feedback + Rollback', async () => {
            const testParam_dto: FeedbackCreateDTO = {
                client_id: mockId.clients.valid[1] as ClientsId,
                user_id: testValidUserId,
                rating: 5,
                term_accepted: true,
                message: 'test-feedback-message-new-client[1]'
            };
            const mockError = 'feedback-upsert-mock-error';

            jest.spyOn(CommonUtils, 'logError').mockImplementation();
            jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(testTimestamp);
            jest.spyOn(feedbackRepository, 'upsertInTa').mockRejectedValue(new Error(mockError));
            await dbTestSetup.addTestData();

            await expect(() => feedbackService.createFeedback(testParam_dto))
            .rejects.toThrow(new DBQueryErrorException(mockError));

            const testResponse_Feedback = 
                await feedbackService.searchFeedbackEntriesByFilter({client_id: mockId.clients.valid[1] as ClientsId}); 

            expect(testResponse_Feedback).toBe(null); // rollback => no insert
        })

        test('Repository process fn upsertInTa(), result: Exception on FeedbackRating + Rollback', async () => {
            const testParam_dto: FeedbackCreateDTO = {
                client_id: mockId.clients.valid[1] as ClientsId,
                user_id: testValidUserId,
                rating: 5,
                term_accepted: true,
                message: 'test-feedback-message-new-client[1]'
            };
            const mockError = 'FeedbackRating-create-mock-error';

            jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(testTimestamp);
            jest.spyOn(feedbackRatingRepository, 'createInTa').mockRejectedValue(new Error(mockError));

            await dbTestSetup.addTestData();
            const testResponse_Feedback = 
                await feedbackService.searchFeedbackEntriesByFilter({client_id: mockId.clients.valid[1] as ClientsId});
            const testResponse_FeedbackRating = 
                await feedbackRatingService.getExtendedFeedbackRatingById(mockId.clients.valid[1] as ClientsId);

            await expect(() => feedbackService.createFeedback(testParam_dto))
                .rejects.toThrow(new DBQueryErrorException(mockError));

            expect(testResponse_Feedback).toBe(null);
            expect(testResponse_FeedbackRating).toBe(null);
        })

        test('Repository process fn upsertInTa(), result: Exception on `Blocked`', async () => {
            const testParam_dto: FeedbackCreateDTO = {
                client_id: mockId.clients.valid[1] as ClientsId,
                user_id: testValidUserId,
                rating: 3,
                term_accepted: true,
                message: 'test-feedback-message-new-client[1]'
            };
            const testFeedbackId = testValidFeedbackId;
            const testResult: FeedbackResponseDTO | null = {
                feedback_id: testFeedbackId,
                client_id: testValidClientId,
                user_id: testValidUserId,
                rating: dbData_Feedback[2],
                term_accepted: dbData_Feedback[3],
                message: dbData_Feedback[4],
                last_modified: testTimestamp,
                created_on: testTimestamp,
                blocked: true
            };
            const mockError = 'support-constraint-feedback';

            jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(testTimestamp);
            jest.spyOn(feedbackRepository, 'upsertInTa').mockResolvedValue(testResult);

            await dbTestSetup.addTestData();
            await expect(() => feedbackService.createFeedback(testParam_dto))
                .rejects.toThrow(new DBConstraintErrorException(mockError));

            const testCompareResult = await feedbackService.getFeedbackById(testFeedbackId);

            expect(testCompareResult?.rating).not.toBe(testParam_dto.rating);
            expect(testCompareResult?.message).not.toBe(testParam_dto.message);
            expect(testCompareResult?.last_modified).toBe(testResult.last_modified);
        })

        test('Repository process fn updateReview(), result: "SUCCESS"', async () => {
            const app = createTestApp([], router, apiUrl);
            const testParam_id = testValidFeedbackId;
            const mockTimestamp = '2026-01-01T14:00:08.000Z';
            // Test without changing created_on this time to see how .spyOn works with multiple calls in process.
            jest.spyOn(CommonUtils, "getTimestampUTC")
                .mockReturnValueOnce(mockTimestamp) // generateFeedbackUpdateReviewDTO()
                .mockReturnValueOnce(mockTimestamp) // toFeedbackResponseDTO() [reviewed_on]
                .mockReturnValueOnce(mockTimestamp) // toFeedbackResponseDTO() [last_modified]
                .mockReturnValueOnce(testTimestamp);// toFeedbackResponseDTO() [created_on]

            const testResult: FeedbackResponseDTO = {
                feedback_id: testParam_id,
                client_id: testValidClientId,
                user_id: testValidUserId,
                rating: dbData_Feedback[2],
                term_accepted: dbData_Feedback[3],
                message: dbData_Feedback[4],
                reviewed_on: mockTimestamp,
                last_modified: mockTimestamp,
                created_on: testTimestamp
            };

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .put(`${apiUrl}/update/review/${testParam_id}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult)
        })
    })

    describe('Testing invalid fn calls', () => {

        describe('All routes, priority: express-validators, location: <params>', () => {

            let app: any;
            let mockError: any;
            beforeEach(() => {
                app = createTestApp([], router, apiUrl);
                mockError = {
                    type: 'field',
                    value: '',
                    msg: 'support-invalid-entry#feedback_id',
                    path: 'id',
                    location: 'params'
                };
            })

            describe('Route: GET/id/:id', () => {

                test('Params: <id>, validator: fn isInt() by value as string', async () => {
                    const testParam_id = 'invalid-id-number';
                    const testError = structuredClone(mockError);
                    testError['value'] = testParam_id;

                    const testResponse = await request(app)
                        .get(`${apiUrl}/id/${testParam_id}`);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([testError]);
                })
            })

            describe('Route: PUT/update/review/:id', () => {

                test('Params: <id>, validator: fn isInt() by value as string', async () => {
                    const testParam_id = 'invalid-id-number';
                    const testError = structuredClone(mockError);
                    testError['value'] = testParam_id;

                    const testResponse = await request(app)
                        .put(`${apiUrl}/update/review/${testParam_id}`);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([testError]);
                })
            })
        })

        describe('All routes, priority: express-validators, location: <body>', () => {

            let testError: any;
            beforeEach(() => {
                testError = {
                    type: 'field',
                    value: '',
                    msg: CommonExceptionMessage.REQUIRED,
                    path: '',
                    location: 'body'
                };
            });

            describe('Route: POST/search', () => {

                let app: any;
                beforeEach(() => {
                    app = createTestApp([], router, apiUrl);
                })

                test('Params: <client_id>, validator: fn isUUID() by invalid value', async () => {
                    let testParam_dto: FeedbackFilterDTO = {
                        client_id: [testValidClientId, 'invalid-id'] as ClientsId[]
                    }
                    const testError = [{
                        type: 'field',
                        value: 'invalid-id',
                        msg: 'support-invalid-entry#client_id',
                        path: 'client_id[1]',
                        location: 'body'
                    }];

                    const testResponse = await request(app)
                        .post(`${apiUrl}/search`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual(testError);
                })

                test('Params: <user_id>, validator: fn isUUID() by invalid value', async () => {
                    let testParam_dto: FeedbackFilterDTO = {
                        user_id: ['invalid-id-0', testValidUserId, 'invalid-id-1'] as UsersId[]
                    }
                    const testError = [
                        {
                            type: 'field',
                            value: 'invalid-id-0',
                            msg: 'support-invalid-entry#user_id',
                            path: 'user_id[0]',
                            location: 'body'
                        },
                        {
                            type: 'field',
                            value: 'invalid-id-1',
                            msg: 'support-invalid-entry#user_id',
                            path: 'user_id[2]',
                            location: 'body'
                        }
                    ];

                    const testResponse = await request(app)
                        .post(`${apiUrl}/search`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual(testError);
                })

                test('Params: <rating>, validator: fn isEmpty() on empty array', async () => {
                    const testParam_dto = { rating: [] };
                    const mockError = {
                        type: 'field',
                        value: [],
                        msg: CommonExceptionMessage.REQUIRED,
                        path: 'rating',
                        location: 'body'
                    };

                    const testResponse = await request(app)
                        .post(`${apiUrl}/search`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([mockError]);
                })

                test('Params: <rating>, validator: fn isNaN() by empty object', async () => {
                    const testParam_dto = { rating: {} };
                    const mockError = {
                        type: 'field',
                        value: {},
                        msg: 'support-invalid-entry#rating',
                        path: 'rating[0]',
                        location: 'body'
                    };

                    const testResponse = await request(app)
                        .post(`${apiUrl}/search`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([mockError]);
                })

                test('Params: <rating>, validator: fn isNaN() by string value', async () => {
                    const testParam_dto = { rating: 'test' };
                    const mockError = {
                        type: 'field',
                        value: 'test',
                        msg: 'support-invalid-entry#rating',
                        path: 'rating[0]',
                        location: 'body'
                    };

                    const testResponse = await request(app)
                        .post(`${apiUrl}/search`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([mockError]);
                })

                test('Params: <rating>, validator: if(rating < 1) by lower value', async () => {
                    const testParam_dto = { rating: [2, 0] };
                    const mockError = {
                        type: 'field',
                        value: 0,
                        msg: 'support-invalid-min#rating!1',
                        path: 'rating[1]',
                        location: 'body'
                    };

                    const testResponse = await request(app)
                        .post(`${apiUrl}/search`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([mockError]);
                })

                test('Params: <rating>, validator: if(rating > 5) by higher value', async () => {
                    const testParam_dto = { rating: [5, 4, 7] };
                    const mockError = {
                        type: 'field',
                        value: 7,
                        msg: 'support-invalid-max#rating!5',
                        path: 'rating[2]',
                        location: 'body'
                    };

                    const testResponse = await request(app)
                        .post(`${apiUrl}/search`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([mockError]);
                })

                test('Params: <term_accepted>, validator: fn isBoolean({strict:true}) by string value', async () => {
                    const testParam_dto = { term_accepted: 'true' };
                    const mockError = {
                        type: 'field',
                        value: 'true',
                        msg: 'support-invalid-entry#term_accepted',
                        path: 'term_accepted',
                        location: 'body'
                    };

                    const testResponse = await request(app)
                        .post(`${apiUrl}/search`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([mockError]);
                })
            })

            describe('Route: POST/create', () => {

                let app: any;
                let testData: Partial<FeedbackRequestCreateDTO>;
                beforeEach(() => {
                    app = createTestApp([
                        MockUtils.injectTestClientId(testValidClientId),
                        MockUtils.injectTestUserId(testValidUserId)
                    ], router, apiUrl);
                    testData = {
                        user_email: 'max.muster@test.com',
                        rating: 4,
                        term_accepted: false,
                        message: 'test-message',
                    }
                })

                const emptyParams = ['rating', 'term_accepted'] as (keyof typeof testData)[];

                test.each(emptyParams)('Params: <%s>, validator: fn exists() by undefined', async (invalidParam) => {
                    const testParam_dto = structuredClone(testData);
                    delete testParam_dto[invalidParam];
                    const mockError = structuredClone(testError);
                    mockError['path'] = invalidParam;
                    delete mockError['value'];

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([mockError]);
                })

                test('Params: <user_email>, validator: fn notEmpty() by undefined', async () => {
                    const testParam_dto: Partial<FeedbackRequestCreateDTO> = {
                        rating: 4,
                        term_accepted: false,
                        message: 'test-message',
                    }
                    const mockError = structuredClone(testError);
                    mockError['path'] = 'user_email';

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toContainEqual(mockError);
                })

                test('Params: <rating>, validator: fn isInt({min:1}) by lower value', async () => {
                    const testParam_dto: Partial<FeedbackRequestCreateDTO> = {
                        user_email: 'max.muster@test.com',
                        rating: 0,
                        term_accepted: false,
                        message: 'test-message',
                    }
                    const mockError = {
                        type: 'field',
                        value: 0,
                        msg: 'support-invalid-min#rating!1',
                        path: 'rating',
                        location: 'body'
                    };

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([mockError]);
                })

                test('Params: <rating>, validator: fn isInt({max:5}) by higher value', async () => {
                    const testParam_dto: Partial<FeedbackRequestCreateDTO> = {
                        user_email: 'max.muster@test.com',
                        rating: 6,
                        term_accepted: false,
                        message: 'test-message',
                    }
                    const mockError = {
                        type: 'field',
                        value: 6,
                        msg: 'support-invalid-max#rating!5',
                        path: 'rating',
                        location: 'body'
                    };

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([mockError]);
                })

                test('Params: <term_accepted>, validator: fn isBoolean({strict:true}) by number', async () => {
                    const testParam_dto = {
                        user_email: 'max.muster@test.com',
                        rating: 4,
                        term_accepted: 0, // Would not trigger .isBoolean() without {strict:true}.
                        message: 'test-message',
                    };
                    const mockError = {
                        type: 'field',
                        value: 0,
                        msg: 'support-invalid-entry#term_accepted',
                        path: 'term_accepted',
                        location: 'body'
                    };

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([mockError]);
                })

                test('Params: <message>, validator: fn isLength({max:1000}) by bigger length', async () => {
                    const mockMessage = String('').padStart(1001, 'test');
                    const testParam_dto: FeedbackRequestCreateDTO = {
                        user_email: 'max.muster@test.com',
                        rating: 4,
                        term_accepted: false,
                        message: mockMessage,
                    };
                    const mockError = {
                        type: 'field',
                        value: mockMessage,
                        msg: 'support-invalid-max#message!1000',
                        path: 'message',
                        location: 'body'
                    };

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([mockError]);
                })
            })
        })

        describe('All routes, priority: error middleware, location: <body>', () => {

            let testError: any;
            beforeEach(() => {
                testError = {
                    type: 'field',
                    value: '',
                    msg: 'support-payload-required',
                    path: 'req.body',
                    location: 'body'
                };
            })

            describe('Route: POST/create', () => {

                let app: any;
                beforeEach(() => {
                    app = createTestApp([
                        MockUtils.injectTestClientId(testValidClientId),
                        MockUtils.injectTestUserId(testValidUserId)
                    ], router, apiUrl);
                })

                test('Params: <FeedbackRequestCreateDTO>, validator: fn requirePayload() by undefined', async () => {
                    const testParam_dto = undefined;

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