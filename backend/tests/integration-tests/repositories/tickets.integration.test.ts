import { NextFunction, Request, Response } from "express";
import * as Utils from '../../../src/utils/common.utils';
import request from 'supertest';
import app from '../../../src/app';
import { DBTestSetup } from "../db-container.setup";
import { runMigrations } from '../../db-migrations.setup';
import { TicketsCreateDTO, TicketsFilterDTO, TicketsResponseDTO, TicketsUpdateDTO } from "../../../src/dtos/tickets.dto";
import { TicketStatus } from "../../../src/utils/enums/ticket-status.enum";
import { Flag } from "../../../src/utils/enums/flag.enum";
import { Tickets } from "../../../src/repositories/interfaces/tickets.entity.interface";
import { CommonExceptionMessage } from "../../../src/utils/enums/common-exception-messages.enum";
import { ErrorStatusCodes } from "../../../src/utils/errorStatusCodes.utils";


jest.mock('../../../src/middleware/auth.middleware', () => ({
    authAdmin: jest.fn(() =>  (req: Request, res: Response, next: NextFunction) => next()),
    authClient: jest.fn(() =>  (req: Request, res: Response, next: NextFunction) => next())
}));
jest.mock('../../../src/middleware/maintenance.middleware', () => ({
    maintain: jest.fn(() =>  (req: Request, res: Response, next: NextFunction) => next())
}));

jest.setTimeout(60000);

describe('Integration test (repository specific), priority: Clients', () => {

    let dbTestSetup: DBTestSetup;
    let apiUrl: string;
    const mockTimestamp = '2025-01-01T14:00:04.000Z';
    const mockClientsId = '9e024539-32e8-4317-8007-84a3956e6b57';
    const mockClientsName = 'TESTCLIENT';
    const mockUsersId = '87e4d6e3-d678-4de0-8806-e89135cbd38c';
    const mockUsersEmail = 'max.mustermann@yqni13.com';
    beforeAll(async () => {
        dbTestSetup = new DBTestSetup();
        await dbTestSetup.init();
        await runMigrations();
        apiUrl = '/api/v1/tickets';
    });

    beforeEach(async () => {
        // Clean tables before each test to fill test data individually.
        await dbTestSetup.clearTables();
    });

    afterAll(async () => {
        await dbTestSetup.shutdown();
    });

    describe('Testing valid fn calls', () => {

        test('Repository process fn findById, result: "SUCCESS"', async () => {
            const testParam_id = 'ae9550fc-16fd-4e9a-8ab5-d6ab55b84cb4';
            const testResult: TicketsResponseDTO = {
                ticket_id: testParam_id,
                client_id: mockClientsId,
                client_name: mockClientsName,
                user_id: mockUsersId,
                user_email: mockUsersEmail,
                status: TicketStatus.ISSUED,
                message: 'test-message',
                flag: null,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            };

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/by-id/${testParam_id}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn findAll, result: "SUCCESS"', async () => {
            const testParam_id = 'ae9550fc-16fd-4e9a-8ab5-d6ab55b84cb4';
            const testResult: TicketsResponseDTO[] = [{
                ticket_id: testParam_id,
                client_id: mockClientsId,
                client_name: mockClientsName,
                user_id: mockUsersId,
                user_email: mockUsersEmail,
                status: TicketStatus.ISSUED,
                message: 'test-message',
                flag: null,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            }];

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/all`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn findByFilter, params: <client_id> result: []', async () => {
            const testParam_dto: TicketsFilterDTO = {
                client_id: 'non-existing_clients_test_id'
            };
            // No entry exists in db with client_id value from dto.
            const testResult: TicketsResponseDTO[] = [];

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/search`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn findByFilter, params: <user_id[], status> result: "SUCCESS"', async () => {
            const testParam_dto: TicketsFilterDTO = {
                user_id: [mockUsersId, 'non-existing_clients_test_id'],
                status: TicketStatus.ISSUED
            };
            const testResult: TicketsResponseDTO[] = [{
                ticket_id: 'ae9550fc-16fd-4e9a-8ab5-d6ab55b84cb4',
                client_id: mockClientsId,
                client_name: mockClientsName,
                user_id: mockUsersId,
                user_email: mockUsersEmail,
                status: TicketStatus.ISSUED,
                message: 'test-message',
                flag: null,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            }];

            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(mockTimestamp);

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/search`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn findByFilter, params: <flag> result: []', async () => {
            const testParam_dto: TicketsFilterDTO = {
                flag: Flag.ERROR
            };
            const testResult: TicketsResponseDTO[] = [];

            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(mockTimestamp);

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/search`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn create, result: "SUCCESS"', async () => {
            const mockParam_id = 'ae9550fc-16fd-4e9a-8ab5-d6ab55b84cb4';
            const mockParam_dto: Partial<Tickets> = {
                client_id: mockClientsId,
                user_id: mockUsersId,
                status: TicketStatus.ISSUED,
                message: 'new-test-message',
                flag: null
            };

            // TODO(yqni13): mock img-handling on implementation (SUPPORT-38)
            jest.spyOn(Utils, "generateUUID").mockReturnValue(mockParam_id);
            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(mockTimestamp);

            const testResult = structuredClone(mockParam_dto);
            Object.assign(testResult, {
                ticket_id: mockParam_id,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            });

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/create`)
                .send(mockParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult)
        })

        test('Repository process fn update, result: "SUCCESS"', async () => {
            const testParam_id = 'ae9550fc-16fd-4e9a-8ab5-d6ab55b84cb4';
            const testParam_dto: Partial<Tickets> = {
                status: TicketStatus.ACTIVE,
                message: 'updated-test-message',
                flag: null
            };

            // TODO(yqni13): mock img-handling on implementation (SUPPORT-38)
            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(mockTimestamp);

            const testResult = structuredClone(testParam_dto);
            Object.assign(testResult, {
                ticket_id: testParam_id,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            });

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .put(`${apiUrl}/update/${testParam_id}`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult)
        })

        test('Repository process fn delete, result: "SUCCESS"', async () => {
            const testParam_id = 'ae9550fc-16fd-4e9a-8ab5-d6ab55b84cb4';
            const testResult = true;

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .delete(`${apiUrl}/delete/${testParam_id}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        const apiUrl = '/api/v1/tickets';

        describe('All routes, priority: express-validators, location <params>', () => {

            let mockError: any;
            beforeEach(() => {
                mockError = {
                    type: 'field',
                    value: '',
                    msg: CommonExceptionMessage.REQUIRED,
                    path: '',
                    location: 'params'
                };
            });

            describe('Route: GET/by-id/:id', () => {

                test('Params: <id>, validator: notEmpty by undefined', async () => {
                    // To test undefined, we need empty string but still match ':id' as part of route:
                    // Simulate by URL-encoded SPACE + trim() => ''
                    const mockParam_id = '%20';
                    const testError = structuredClone(mockError);
                    testError['path'] = 'id';

                    const mockResponse = await request(app)
                        .get(`${apiUrl}/by-id/${mockParam_id}`);

                    expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(mockResponse.body.headers.data).toEqual([testError]);
                })
            })

            describe('Route: PUT/update/:id', () => {

                test('Params: <id>, validator: notEmpty by undefined', async () => {
                    const mockParam_id = '%20';
                    const mockParam_dto: TicketsUpdateDTO = {
                        status: TicketStatus.ACTIVE,
                        message: 'test-message',
                        flag: null
                    }

                    const testError = structuredClone(mockError);
                    testError['path'] = 'id';

                    const mockResponse = await request(app)
                        .put(`${apiUrl}/update/${mockParam_id}`)
                        .send(mockParam_dto);

                    expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(mockResponse.body.headers.data).toEqual([testError]);
                })
            })

            describe('Route: DELETE/delete/:id', () => {

                test('Params: <id>, validator: notEmpty by undefined', async () => {
                    const mockParam_id = '%20';
                    const testError = structuredClone(mockError);
                    testError['path'] = 'id';

                    const mockResponse = await request(app)
                        .delete(`${apiUrl}/delete/${mockParam_id}`);

                    expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(mockResponse.body.headers.data).toEqual([testError]);
                })
            })
        })

        describe('All routes, priority: express-validators, location <body>', () => {

            let mockError: any;
            beforeEach(() => {
                mockError = {
                    type: 'field',
                    value: '',
                    msg: CommonExceptionMessage.REQUIRED,
                    path: '',
                    location: 'body'
                };
            });

            describe('Route: POST/create', () => {

                const mockData: Partial<Tickets> = {
                    client_id: 'forbidden_clients_test_id',
                    user_id: 'forbidden_users_test_id',
                    status: TicketStatus.ISSUED,
                    flag: null,
                    last_modified: mockTimestamp
                }

                const testedArgs = Object.keys(mockData) as (keyof typeof mockData)[];

                // Testing on forbidden value because these properties are assigned automatically in model.
                test.each(testedArgs)('Arguments: <%s>, validator: isEmpty by defined value', async (invalidArg) => {
                    let mockParam_dto: TicketsCreateDTO = { message: 'test-message' };
                    Object.assign(mockParam_dto, structuredClone(mockData[invalidArg]));

                    const testError = {
                        type: 'field',
                        value: mockData[invalidArg],
                        msg: CommonExceptionMessage.FORBIDDEN,
                        path: invalidArg,
                        location: 'body'
                    };

                    const mockResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(mockParam_dto);

                    expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(mockResponse.body.headers.data).toContainEqual(testError);
                })

                test('Arguments: <message>, validator: notEmpty by undefined', async () => {
                    let mockParam_dto = undefined;

                    const testError = structuredClone(mockError);
                    testError['path'] = 'message';

                    const mockResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(mockParam_dto);

                    expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(mockResponse.body.headers.data).toContainEqual(testError);
                })

                test('Arguments: <message>, validator: isLength by max > 1000 chars', async () => {
                    let mockParam_dto: TicketsCreateDTO = {
                        message: `
                        This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>
                        This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>
                        This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>
                        This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>
                        This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>
                        This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>
                        This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>
                        This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>
                        This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>
                        This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>
                        This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>+
                        `
                    };

                    const testError = {
                        type: 'field',
                        value: mockParam_dto.message,
                        msg: 'support-invalid-max#message!1000',
                        path: 'message',
                        location: 'body'
                    };

                    const mockResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(mockParam_dto);

                    expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(mockResponse.body.headers.data).toContainEqual(testError);
                })
            })

            describe('Route: PUT/update/:id', () => {

                const mockData: Partial<Tickets> = {
                    status: TicketStatus.PAUSED,
                    message: 'loop-test-message',
                    flag: Flag.ERROR
                }

                const testedArgs = Object.keys(mockData) as (keyof typeof mockData)[];

                test.each(testedArgs)('Arguments: <%s>, validator: notEmpty by undefined', async (invalidArg) => {
                    const mockParam_id = 'ae9550fc-16fd-4e9a-8ab5-d6ab55b84cb4';
                    let mockParam_dto = structuredClone(mockData);
                    delete mockParam_dto[invalidArg];

                    const testError = structuredClone(mockError);
                    testError['path'] = invalidArg;

                    const mockResponse = await request(app)
                        .put(`${apiUrl}/update/${mockParam_id}`)
                        .send(mockParam_dto);

                    expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(mockResponse.body.headers.data).toContainEqual(testError);
                })

                test('Arguments: <message>, validator: isLength by max > 1000 chars', async () => {
                    let mockParam_dto: TicketsUpdateDTO = {
                        status: TicketStatus.ACTIVE,
                        message: `
                        This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>
                        This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>
                        This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>
                        This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>
                        This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>
                        This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>
                        This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>
                        This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>
                        This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>
                        This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>
                        This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>+
                        `,
                        flag: null
                    };

                    const testError = {
                        type: 'field',
                        value: mockParam_dto.message,
                        msg: 'support-invalid-max#message!1000',
                        path: 'message',
                        location: 'body'
                    };

                    const mockResponse = await request(app)
                        .put(`${apiUrl}/update/${mockParam_dto}`)
                        .send(mockParam_dto);

                    expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(mockResponse.body.headers.data).toContainEqual(testError);
                })

                test('Arguments: <last_modified>, validator: isEmpty by defined value', async () => {
                    const mockParam_id = 'ae9550fc-16fd-4e9a-8ab5-d6ab55b84cb4';
                    const mockParam_dto = { last_modified: mockTimestamp };

                    const testError = {
                        type: 'field',
                        value: mockParam_dto,
                        msg: CommonExceptionMessage.FORBIDDEN,
                        path: 'last_modified',
                        location: 'body'
                    };

                    const mockResponse = await request(app)
                        .put(`${apiUrl}/update/${mockParam_id}`)
                        .send(mockParam_dto);

                    expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(mockResponse.body.headers.data).toContainEqual(testError);
                })
            })
        })
    })
})