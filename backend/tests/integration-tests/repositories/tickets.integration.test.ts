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
import { CommonExceptionMessage } from "../../../src/utils/enums/common-exception-messages.enum";
import { ErrorStatusCodes } from "../../../src/utils/errorStatusCodes.utils";
import { default as mockId } from "../../mock-data/id.mock-data.json";

const testValidClientsId = mockId.clients.valid[0];
const testValidUsersId = mockId.users.valid[0];
const testTimestamp = '2025-01-01T14:00:04.000Z';

jest.mock('../../../src/middleware/auth.admin.middleware', () => ({
    authAdmin: jest.fn(() => (req: Request, res: Response, next: NextFunction) => next())
}));
jest.mock('../../../src/middleware/auth.client.middleware', () => ({
    authClient: jest.fn(() => (req: Request, res: Response, next: NextFunction) => {
        (req as any).apiClients = { client_id: testValidClientsId };
        next();
    })
}));
jest.mock('../../../src/middleware/auth.user.middleware', () => ({
    authUser: jest.fn(() => (req: Request, res: Response, next: NextFunction) => {
        (req as any).apiUsers = { user_id: testValidUsersId };
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
        const testClientsName = 'TESTCLIENT';
        const testUsersEmail = 'max.mustermann@yqni13.com';
        const testNewParam_ticket_id = mockId.tickets.new[0];
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
                client_id: testValidClientsId,
                client_name: testClientsName,
                user_id: testValidUsersId,
                user_email: testUsersEmail,
                status: TicketStatus.ISSUED,
                message: 'test-message',
                flag: null,
                last_modified: testTimestamp,
                created_on: testTimestamp
            };

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/by-id/${testParam_id}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn findAll, result: "SUCCESS"', async () => {
            const testResult: TicketsResponseDTO[] = [{
                ticket_id: mockId.tickets.valid[0],
                client_id: testValidClientsId,
                user_id: testValidUsersId,
                status: TicketStatus.ISSUED,
                message: 'test-message',
                flag: null,
                last_modified: testTimestamp,
                created_on: testTimestamp
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
                user_id: [testValidUsersId, mockId.tickets.invalid[0]],
                status: TicketStatus.ISSUED
            };
            const testResult: TicketsResponseDTO[] = [{
                ticket_id: mockId.tickets.valid[0],
                client_id: testValidClientsId,
                user_id: testValidUsersId,
                status: TicketStatus.ISSUED,
                message: 'test-message',
                flag: null,
                last_modified: testTimestamp,
                created_on: testTimestamp
            }];

            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(testTimestamp);

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

            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(testTimestamp);

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/search`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn create, result: "SUCCESS"', async () => {
            // TicketsCreateRequestDTO interface necessary to mock auth middleware (data for client_id & user_id).
            const testParam_dto: TicketsCreateRequestDTO = {
                user_email: 'TESTCLIENT',
                message: 'new-test-message',
            };

            // TODO(yqni13): mock img-handling on implementation at SUPPORT-4
            jest.spyOn(Utils, "generateUUID").mockReturnValue(testNewParam_ticket_id);
            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(testTimestamp);

            const testResult: TicketsResponseDTO = {
                ticket_id: testNewParam_ticket_id,
                client_id: testValidClientsId,
                user_id: testValidUsersId,
                status: TicketStatus.ISSUED,
                message: testParam_dto.message,
                flag: null,
                last_modified: testTimestamp,
                created_on: testTimestamp
            }

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/create`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult)
        })

        test('Repository process fn update, result: "SUCCESS"', async () => {
            const testParam_id = mockId.tickets.valid[0];
            const testParam_dto: TicketsUpdateDTO = {
                status: TicketStatus.ACTIVE,
                message: 'updated-test-message',
                flag: null
            };

            // TODO(yqni13): mock img-handling on implementation at SUPPORT-4
            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(testTimestamp);

            const testResult: TicketsResponseDTO = {
                ...structuredClone(testParam_dto),
                ticket_id: testParam_id,
                client_id: testValidClientsId,
                user_id: testValidUsersId,
                last_modified: testTimestamp,
                created_on: testTimestamp
            };

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
            await dbTestSetup.clearTables();
        });

        afterAll(async () => {
            await dbTestSetup.shutdown();
        });

        describe('All routes, priority: express-validators, location <params>', () => {

            let testError: any;
            beforeEach(() => {
                testError = {
                    type: 'field',
                    value: '',
                    msg: 'support-invalid-entry#ticket_id',
                    path: 'id',
                    location: 'params'
                }
            })

            describe('Route: GET/by-id/:id', () => {

                test('Params: <id>, validator: isUUID() by invalid id', async () => {
                    const testParam_id = 'invalid-id';
                    testError = structuredClone(testError);
                    testError['value'] = testParam_id;

                    const testResponse = await request(app)
                        .get(`${apiUrl}/by-id/${testParam_id}`);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([testError]);
                })
            })

            describe('Route: PUT/update/:id', () => {

                test('Params: <id>, validator: isUUID() by invalid id', async () => {
                    const testParam_id = 'invalid-id';
                    const testParam_dto: TicketsUpdateDTO = {
                        status: TicketStatus.ACTIVE,
                        message: 'test-message',
                        flag: null
                    }
                    testError = structuredClone(testError);
                    testError['value'] = testParam_id;

                    const testResponse = await request(app)
                        .put(`${apiUrl}/update/${testParam_id}`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([testError]);
                })
            })

            describe('Route: DELETE/delete/:id', () => {

                test('Params: <id>, validator: isUUID() by invalid id', async () => {
                    const testParam_id = 'invalid-id';
                    testError = structuredClone(testError);
                    testError['value'] = testParam_id;

                    const testResponse = await request(app)
                        .delete(`${apiUrl}/delete/${testParam_id}`);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([testError]);
                })
            })
        })

        describe('All routes, priority: express-validators, location <body>', () => {

            describe('Route: POST/search', () => {

                test('Params: <client_id>, validator: isUUID() by invalid value', async () => {
                    let testParam_dto: TicketsFilterDTO = {
                        client_id: [mockId.clients.valid[0], 'invalid-id']
                    }
                    const testError = {
                        type: 'field',
                        value: 'invalid-id',
                        msg: 'support-invalid-entry#client_id',
                        path: 'client_id[1]',
                        location: 'body'
                    };

                    const testResponse = await request(app)
                        .post(`${apiUrl}/search`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([testError]);
                })

                test('Params: <user_id>, validator: isUUID() by invalid value', async () => {
                    let testParam_dto: TicketsFilterDTO = {
                        user_id: ['invalid-id-0', mockId.clients.valid[0], 'invalid-id-1']
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
                    ]

                    const testResponse = await request(app)
                        .post(`${apiUrl}/search`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual(testError);
                })
            })
            
            describe('Route: POST/create', () => {

                test('Params: <message>, validator: notEmpty() by undefined', async () => {
                    let mockParam_dto = undefined;
                    const testError = {
                        type: 'field',
                        value: '',
                        msg: CommonExceptionMessage.REQUIRED,
                        path: 'message',
                        location: 'body'
                    };

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(mockParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toContainEqual(testError);
                })

                test('Params: <message>, validator: isLength() by max > 1000 chars', async () => {
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

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(mockParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toContainEqual(testError);
                })

                test('Params: <resource_paths>, validator: isEmpty() by defined value', async () => {
                    const testParam_dto = {
                        message: 'test-message',
                        resource_paths: ['test/path/img_0.webp']
                    };

                    const testError = {
                        type: 'field',
                        value: testParam_dto.resource_paths[0],
                        msg: CommonExceptionMessage.FORBIDDEN,
                        path: 'resource_paths',
                        location: 'body'
                    };

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toContainEqual(testError);
                })
            })

            describe('Route: PUT/update/:id', () => {

                test('Params: <message>, validator: isLength() by max > 1000 chars', async () => {
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

                    const testResponse = await request(app)
                        .put(`${apiUrl}/update/${mockParam_dto}`)
                        .send(mockParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toContainEqual(testError);
                })

                test('Params: <last_modified>, validator: isEmpty() by defined value', async () => {
                    const testParam_id = mockId.tickets.valid[0];
                    const testParam_dto: TicketsUpdateDTO = {
                        status: TicketStatus.ACTIVE,
                        message: 'modified-test-message',
                        flag: null,
                        last_modified: testTimestamp
                    };

                    const testError = {
                        type: 'field',
                        value: testParam_dto.last_modified,
                        msg: CommonExceptionMessage.FORBIDDEN,
                        path: 'last_modified',
                        location: 'body'
                    };

                    const testResponse = await request(app)
                        .put(`${apiUrl}/update/${testParam_id}`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toContainEqual(testError);
                })
            })
        })
    })
})