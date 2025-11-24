import { NextFunction, Request, Response } from "express";
import {
    TicketsCreateRequestDTO,
    TicketsFilterDTO,
    TicketsResponseDTO,
    TicketsResponseExtendedDTO,
    TicketsUpdateDTO
} from "../../../src/dtos/tickets.dto";
import * as Utils from '../../../src/utils/common.utils';
import request from 'supertest';
import { DBTestSetup } from "../db-container.setup";
import { runMigrations } from '../../db-migrations.setup';
import { TicketStatus } from "../../../src/utils/enums/ticket-status.enum";
import { Flag } from "../../../src/utils/enums/flag.enum";
import { Tickets } from "../../../src/repositories/interfaces/tickets.entity.interface";
import { CommonExceptionMessage } from "../../../src/utils/enums/common-exception-messages.enum";
import { ErrorStatusCodes } from "../../../src/utils/errorStatusCodes.utils";
import { default as mockId } from "../../mock-data/id.mock-data.json";

const mockClientsId = mockId.clients.valid[0];
const mockUsersId = mockId.users.valid[0];
const mockTimestamp = '2025-01-01T14:00:04.000Z';

jest.mock('../../../src/middleware/auth.admin.middleware', () => ({
    authAdmin: jest.fn(() => (req: Request, res: Response, next: NextFunction) => next())
}));
jest.mock('../../../src/middleware/auth.client.middleware', () => ({
    authClient: jest.fn(() => (req: Request, res: Response, next: NextFunction) => {
        (req as any).apiClients = { client_id: mockClientsId };
        next();
    })
}));
jest.mock('../../../src/middleware/auth.user.middleware', () => ({
    authUser: jest.fn(() => (req: Request, res: Response, next: NextFunction) => {
        (req as any).apiUsers = { user_id: mockUsersId };
        next();
    })
}));
jest.mock('../../../src/middleware/maintenance.middleware', () => ({
    maintain: jest.fn(() =>  (req: Request, res: Response, next: NextFunction) => next())
}));

import app from '../../../src/app';

jest.setTimeout(60000);

describe('Integration test (repository specific), priority: Tickets', () => {

    describe('Testing valid fn calls', () => {

        let dbTestSetup: DBTestSetup;
        let apiUrl: string;
        const mockClientsName = 'TESTCLIENT';
        const mockUsersEmail = 'max.mustermann@yqni13.com';
        const mockNewParam_ticket_id = mockId.tickets.new[0];
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

        test('Repository process fn findById, result: "SUCCESS"', async () => {
            const testParam_id = mockId.tickets.valid[0];
            const testResult: TicketsResponseExtendedDTO = {
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
            const testParam_id = mockId.tickets.valid[0];
            const testResult: TicketsResponseDTO[] = [{
                ticket_id: testParam_id,
                client_id: mockClientsId,
                user_id: mockUsersId,
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
                client_id: mockId.tickets.invalid[0]
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
                user_id: [mockUsersId, mockId.tickets.invalid[0]],
                status: TicketStatus.ISSUED
            };
            const testResult: TicketsResponseDTO[] = [{
                ticket_id: mockId.tickets.valid[0],
                client_id: mockClientsId,
                user_id: mockUsersId,
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
            const mockParam_dto: TicketsCreateRequestDTO = {
                user_email: 'TESTCLIENT',
                message: 'new-test-message',
            };

            // TODO(yqni13): mock img-handling on implementation (SUPPORT-38)
            jest.spyOn(Utils, "generateUUID").mockReturnValue(mockNewParam_ticket_id);
            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(mockTimestamp);

            const testResult: TicketsResponseDTO = {
                ticket_id: mockNewParam_ticket_id,
                client_id: mockClientsId,
                user_id: mockUsersId,
                status: TicketStatus.ISSUED,
                message: mockParam_dto.message,
                flag: null,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            }

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/create`)
                .send(mockParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult)
        })

        test('Repository process fn update, result: "SUCCESS"', async () => {
            const testParam_id = mockId.tickets.valid[0];
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
            const testParam_id = mockId.tickets.valid[0];
            const testResult = true;

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .delete(`${apiUrl}/delete/${testParam_id}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toBe(testResult);
        })

        test('Repository process fn delete, result: "NOT-FOUND-ENTRY"', async () => {
            const testParam_id = mockId.tickets.invalid[0];
            const testResult = false;

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .delete(`${apiUrl}/delete/${testParam_id}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toBe(testResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        let dbTestSetup: DBTestSetup;
        let apiUrl: string;
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

            describe('Route: POST/create', () => {

                test('Arguments: <message>, validator: notEmpty by undefined', async () => {
                    let mockParam_dto = undefined;
                    const mockError = {
                        type: 'field',
                        value: '',
                        msg: CommonExceptionMessage.REQUIRED,
                        path: 'message',
                        location: 'body'
                    };

                    const mockResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(mockParam_dto);

                    expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(mockResponse.body.headers.data).toContainEqual(mockError);
                })

                test('Arguments: <message>, validator: isLength by max > 1000 chars', async () => {
                    let mockParam_dto = {
                        message: `This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>`,
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

                test('Arguments: <resource_paths>, validator: isEmpty by defined value', async () => {
                    const mockParam_dto = {
                        message: 'test-message',
                        resource_paths: ['test/path/img_0.webp']
                    };

                    const testError = {
                        type: 'field',
                        value: mockParam_dto.resource_paths[0],
                        msg: CommonExceptionMessage.FORBIDDEN,
                        path: 'resource_paths',
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

                test('Arguments: <message>, validator: isLength by max > 1000 chars', async () => {
                    let mockParam_dto: TicketsUpdateDTO = {
                        status: TicketStatus.ACTIVE,
                        message: `This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>`,
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
                    const mockParam_id = mockId.tickets.valid[0];
                    const mockParam_dto: TicketsUpdateDTO = {
                        status: TicketStatus.ACTIVE,
                        message: 'modified-test-message',
                        flag: null,
                        last_modified: mockTimestamp
                    };

                    const testError = {
                        type: 'field',
                        value: mockParam_dto.last_modified,
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