import { NextFunction, Request, Response } from "express";
import {
    TicketsFilterDTO,
    TicketsRequestCreateDTO,
    TicketsResponseDTO,
    TicketsResponseExtendedDTO,
    TicketsUpdateDTO
} from "../../../src/dtos/tickets.dto";
import * as Utils from '../../../src/utils/common.utils';
import * as MockUtils from "../../common.test-utils";
import request from 'supertest';
import { DBTestSetup } from "../../db-container.setup";
import { runMigrations } from '../../db-migrations.setup';
import { TicketStatus } from "../../../src/utils/enums/ticket-status.enum";
import { Flag } from "../../../src/utils/enums/flag.enum";
import { CommonExceptionMessage } from "../../../src/utils/enums/common-exception-messages.enum";
import { ErrorStatusCodes } from "../../../src/utils/errorStatusCodes.utils";
import { default as mockId } from "../../mock-data/id.mock-data.json";
import { FilesService } from "../../../src/services/files.service";
import ticketsModel from "../../../src/models/tickets.model";
import { CloudService } from "../../../src/services/cloud.service";
import { TicketOption } from "../../../src/utils/enums/ticket-option.enum";

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
jest.mock('../../../src/middleware/observe.middleware.ts', () => ({
    observe: jest.fn(() => (req: Request, res: Response, next: NextFunction) => next())
}))

import app from '../../../src/app';

jest.setTimeout(60000);

describe('Integration test (repository specific), priority: Tickets', () => {

    let dbTestSetup: DBTestSetup;
    let apiUrl: string;
    const testClientsName = 'TESTCLIENT';
    const testUsersEmail = 'max.mustermann@yqni13.com';
    const testNewParam_ticket_id = mockId.tickets.new[0];
    beforeAll(async () => {
        dbTestSetup = new DBTestSetup();
        await dbTestSetup.init();
        MockUtils.disableConsoleMessages(); // Surpress multiple messages (migration progress etc). Disable to debug.
        await runMigrations('tickets.integration.test.ts');
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
            const testParam_id = mockId.tickets.valid[0];
            const testResult: TicketsResponseExtendedDTO = {
                ticket_id: testParam_id,
                client_id: testValidClientsId,
                client_name: testClientsName,
                user_id: testValidUsersId,
                user_email: testUsersEmail,
                status: TicketStatus.ISSUED,
                option: TicketOption.SUPPORT,
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
            const testResult: TicketsResponseDTO[] = [
                {
                    ticket_id: mockId.tickets.valid[0],
                    client_id: testValidClientsId,
                    user_id: testValidUsersId,
                    status: TicketStatus.ISSUED,
                    option: TicketOption.SUPPORT,
                    message: 'test-message',
                    resource_paths: ['test/path/num0', 'test/path/num1'],
                    flag: null,
                    last_modified: testTimestamp,
                    created_on: testTimestamp
                },
                {
                    ticket_id: mockId.tickets.valid[1],
                    client_id: testValidClientsId,
                    user_id: testValidUsersId,
                    status: TicketStatus.ISSUED,
                    option: TicketOption.SUPPORT,
                    message: 'test-message-without-resource_paths',
                    flag: null,
                    last_modified: '2025-01-01T14:00:07.000Z',
                    created_on: '2025-01-01T14:00:07.000Z'
                }
            ];

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/all`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn findByFilter, params: <client_id> result: null', async () => {
            const testParam_dto: TicketsFilterDTO = {
                client_id: mockId.tickets.invalid[0]
            };
            const testResult: TicketsResponseDTO[] | null = null;

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/search`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toBe(testResult);
        })

        test('Repository process fn findByFilter, params: <user_id[], status> result: "SUCCESS"', async () => {
            const testParam_dto: TicketsFilterDTO = {
                user_id: [testValidUsersId, mockId.tickets.invalid[0]],
                status: TicketStatus.ISSUED
            };
            const testResult: TicketsResponseDTO[] = [
                {
                    ticket_id: mockId.tickets.valid[0],
                    client_id: testValidClientsId,
                    user_id: testValidUsersId,
                    status: TicketStatus.ISSUED,
                    option: TicketOption.SUPPORT,
                    message: 'test-message',
                    resource_paths: ['test/path/num0', 'test/path/num1'],
                    flag: null,
                    last_modified: testTimestamp,
                    created_on: testTimestamp
                },
                {
                    ticket_id: mockId.tickets.valid[1],
                    client_id: testValidClientsId,
                    user_id: testValidUsersId,
                    status: TicketStatus.ISSUED,
                    option: TicketOption.SUPPORT,
                    message: 'test-message-without-resource_paths',
                    flag: null,
                    last_modified: '2025-01-01T14:00:07.000Z',
                    created_on: '2025-01-01T14:00:07.000Z'
                }
            ];

            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(testTimestamp);

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/search`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn findByFilter, params: <option> result: "SUCCESS"', async () => {
            const testParam_dto: TicketsFilterDTO = {
                option: TicketOption.SUPPORT
            };
            const testResult: TicketsResponseDTO[] = [
                {
                    ticket_id: mockId.tickets.valid[0],
                    client_id: testValidClientsId,
                    user_id: testValidUsersId,
                    status: TicketStatus.ISSUED,
                    option: TicketOption.SUPPORT,
                    message: 'test-message',
                    resource_paths: ['test/path/num0', 'test/path/num1'],
                    flag: null,
                    last_modified: testTimestamp,
                    created_on: testTimestamp
                },
                {
                    ticket_id: mockId.tickets.valid[1],
                    client_id: testValidClientsId,
                    user_id: testValidUsersId,
                    status: TicketStatus.ISSUED,
                    option: TicketOption.SUPPORT,
                    message: 'test-message-without-resource_paths',
                    flag: null,
                    last_modified: '2025-01-01T14:00:07.000Z',
                    created_on: '2025-01-01T14:00:07.000Z'
                }
            ];

            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(testTimestamp);

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/search`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn findByFilter, params: <created_on[]> result: "SUCCESS"', async () => {
            const testParam_dto: TicketsFilterDTO = {
                created_on: ['2024-12-01T00:00:00.000Z', '2025-01-02T14:00:00.000Z']
            };
            const testResult: TicketsResponseDTO[] = [
                {
                    ticket_id: mockId.tickets.valid[0],
                    client_id: testValidClientsId,
                    user_id: testValidUsersId,
                    status: TicketStatus.ISSUED,
                    option: TicketOption.SUPPORT,
                    message: 'test-message',
                    resource_paths: ['test/path/num0', 'test/path/num1'],
                    flag: null,
                    last_modified: testTimestamp,
                    created_on: testTimestamp
                },
                {
                    ticket_id: mockId.tickets.valid[1],
                    client_id: testValidClientsId,
                    user_id: testValidUsersId,
                    status: TicketStatus.ISSUED,
                    option: TicketOption.SUPPORT,
                    message: 'test-message-without-resource_paths',
                    flag: null,
                    last_modified: '2025-01-01T14:00:07.000Z',
                    created_on: '2025-01-01T14:00:07.000Z'
                }
            ];

            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(testTimestamp);

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/search`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn findByFilter, params: <flag> result: null', async () => {
            const testParam_dto: TicketsFilterDTO = {
                flag: Flag.ERROR
            };
            const testResult: TicketsResponseDTO[] | null = null;

            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(testTimestamp);

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/search`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toBe(testResult);
        })

        test('Repository process fn create, priority: without files, result: "SUCCESS"', async () => {
            // TicketsCreateRequestDTO interface necessary to mock auth middleware (data for client_id & user_id).
            const testParam_dto: TicketsRequestCreateDTO = {
                user_email: 'new-user0@test.com',
                option: TicketOption.SUPPORT,
                message: 'new-test-message0',
            };

            jest.spyOn(Utils, "generateUUID").mockReturnValue(testNewParam_ticket_id);
            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(testTimestamp);

            const testResult: TicketsResponseDTO = {
                ticket_id: testNewParam_ticket_id,
                client_id: testValidClientsId,
                user_id: testValidUsersId,
                status: TicketStatus.ISSUED,
                option: TicketOption.SUPPORT,
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

        test('Repository process fn create, priority: with single file, result: "SUCCESS"', async () => {
            const testParam_dto: TicketsRequestCreateDTO = {
                user_email: 'new-user1@test.com',
                option: TicketOption.SUPPORT,
                message: 'new-test-message1',
            };
            const mockFile = {
                filename: 'test-image1.webp', // mapped to originalname as Express.Multer.File
                buffer: Buffer.alloc(1024 * 1024 * 0.2, 0) // 200kb
            };
            const mockPaths = [`tickets/${testNewParam_ticket_id}/0_${testNewParam_ticket_id}.webp`];

            jest.spyOn(Utils, "generateUUID").mockReturnValue(testNewParam_ticket_id);
            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(testTimestamp);
            jest.spyOn(FilesService.prototype, 'transformFiles').mockImplementation();
            jest.spyOn(FilesService.prototype, 'uploadFiles').mockImplementation();
            jest.spyOn(FilesService.prototype, 'getResourcePaths').mockReturnValue(mockPaths);

            const testResult: TicketsResponseDTO = {
                ticket_id: testNewParam_ticket_id,
                client_id: testValidClientsId,
                user_id: testValidUsersId,
                status: TicketStatus.ISSUED,
                option: TicketOption.SUPPORT,
                message: testParam_dto.message,
                resource_paths: mockPaths,
                flag: null,
                last_modified: testTimestamp,
                created_on: testTimestamp
            };

            await dbTestSetup.addTestData();

            // Without file attachment => request content-type: application/json (use .send(dto))
            // With file attachment => request content-type: multipart/form-data (use .field(property))
            const testResponse = await request(app)
                .post(`${apiUrl}/create`)
                .attach('attachment', mockFile.buffer, mockFile.filename)
                .field('user_email', testParam_dto.user_email)
                .field('option', testParam_dto.option)
                .field('message', testParam_dto.message);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult)
        })

        test('Repository process fn create, priority: with multiple files, result: "SUCCESS"', async () => {
            const testParam_dto: TicketsRequestCreateDTO = {
                user_email: 'new-user2@test.com',
                option: TicketOption.SUPPORT,
                message: 'new-test-message2',
            };
            const mockFiles = [
                {
                    filename: 'test1-image2.webp', // mapped to originalname as Express.Multer.File
                    buffer: Buffer.alloc(1024 * 1024 * 0.2, 0) // 200kb
                },
                {
                    filename: 'test2-image2.webp', // mapped to originalname as Express.Multer.File
                    buffer: Buffer.alloc(1024 * 1024 * 0.3, 0) // 300kb
                }
            ];
            const mockPaths = [
                `tickets/${testNewParam_ticket_id}/0_${testNewParam_ticket_id}.webp`,
                `tickets/${testNewParam_ticket_id}/1_${testNewParam_ticket_id}.webp`
            ];

            jest.spyOn(Utils, "generateUUID").mockReturnValue(testNewParam_ticket_id);
            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(testTimestamp);
            jest.spyOn(FilesService.prototype, 'transformFiles').mockImplementation();
            jest.spyOn(FilesService.prototype, 'uploadFiles').mockImplementation();
            jest.spyOn(FilesService.prototype, 'getResourcePaths').mockReturnValue(mockPaths);

            const testResult: TicketsResponseDTO = {
                ticket_id: testNewParam_ticket_id,
                client_id: testValidClientsId,
                user_id: testValidUsersId,
                status: TicketStatus.ISSUED,
                option: TicketOption.SUPPORT,
                message: testParam_dto.message,
                resource_paths: mockPaths,
                flag: null,
                last_modified: testTimestamp,
                created_on: testTimestamp
            };

            await dbTestSetup.addTestData();

            const testResponse = await request(app)
                .post(`${apiUrl}/create`)
                .attach('attachment', mockFiles[0].buffer, mockFiles[0].filename)
                .attach('attachment', mockFiles[1].buffer, mockFiles[1].filename)
                .field('user_email', testParam_dto.user_email)
                .field('option', testParam_dto.option)
                .field('message', testParam_dto.message);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult)
        })

        test('Repository process fn update without resource_paths, result: "SUCCESS"', async () => {
            const testParam_id = mockId.tickets.valid[1];
            const testParam_dto: TicketsUpdateDTO = {
                status: TicketStatus.ACTIVE,
                option: TicketOption.SUPPORT,
                message: 'updated-test-message-without-resource_paths',
                flag: null
            };

            const mockTimestampNoPaths = '2025-01-01T14:00:07.000Z';
            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(mockTimestampNoPaths);

            const testResult: TicketsResponseDTO = {
                ...structuredClone(testParam_dto),
                ticket_id: testParam_id,
                client_id: testValidClientsId,
                user_id: testValidUsersId,
                last_modified: mockTimestampNoPaths,
                created_on: mockTimestampNoPaths
            };

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .put(`${apiUrl}/update/${testParam_id}`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult)
        })

        test('Repository process fn update with resource_paths, result: "SUCCESS"', async () => {
            const testParam_id = mockId.tickets.valid[0];
            const testParam_dto: TicketsUpdateDTO = {
                status: TicketStatus.ACTIVE,
                option: TicketOption.BUG,
                message: 'updated-test-message',
                flag: null
            };

            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(testTimestamp);

            const testResult: TicketsResponseDTO = {
                ...structuredClone(testParam_dto),
                resource_paths: ['test/path/num0', 'test/path/num1'],
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

        test('Repository process fn delete with empty resource_paths, result: "SUCCESS"', async () => {
            const testParam_id = mockId.tickets.valid[1];
            const testResult = true;
            jest.spyOn(ticketsModel, 'isPermittedToDelete').mockReturnValue(true);

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .delete(`${apiUrl}/delete/${testParam_id}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toBe(testResult);
        })

        test('Repository process fn delete with existing data for resource_paths, result: "SUCCESS"', async () => {
            const testParam_id = mockId.tickets.valid[0];
            const testResult = true;

            jest.spyOn(ticketsModel, 'isPermittedToDelete').mockReturnValue(true);
            jest.spyOn(ticketsModel, 'handleTicketBeforeDelete').mockImplementation();
            jest.spyOn(CloudService.prototype, 'delete').mockImplementation();

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

        describe('All routes, priority: validation middleware, location: <files>', () => {

            describe('Route: POST/create', () => {

                let testParam_dto: TicketsRequestCreateDTO;
                beforeEach(() => {
                    testParam_dto = {
                        user_email: 'invalid-new-user@test.com',
                        option: TicketOption.SUPPORT,
                        message: 'invalid-new-test-message',
                    };
                })

                test('Files: invalid number of files, validator: validateFilesMaxNumber', async () =>{
                    const mockFiles = [
                        {
                            filename: 'test-file0.webp',
                            buffer: Buffer.alloc(1024 * 1024 * 0.2, 0) // 200kb
                        },
                        {
                            filename: 'test-file1.webp',
                            buffer: Buffer.alloc(1024 * 1024 * 0.3, 0) // 300kb
                        },
                        {
                            filename: 'test-file2.webp',
                            buffer: Buffer.alloc(1024 * 1024 * 0.2, 0) // 200kb
                        },
                        {
                            filename: 'test-file3.webp',
                            buffer: Buffer.alloc(1024 * 1024 * 0.4, 0) // 400kb
                        },
                        {
                            filename: 'test-file4.webp',
                            buffer: Buffer.alloc(1024 * 1024 * 0.3, 0) // 300kb
                        },
                        {
                            filename: 'test-file5.webp',
                            buffer: Buffer.alloc(1024 * 1024 * 0.18, 0) // 180kb
                        }
                    ];
                    const errorMsg = 'support-invalid-max#files!5';

                    jest.spyOn(Utils, 'logError').mockImplementation();

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .attach('attachment', mockFiles[0].buffer, mockFiles[0].filename)
                        .attach('attachment', mockFiles[1].buffer, mockFiles[1].filename)
                        .attach('attachment', mockFiles[2].buffer, mockFiles[2].filename)
                        .attach('attachment', mockFiles[3].buffer, mockFiles[3].filename)
                        .attach('attachment', mockFiles[4].buffer, mockFiles[4].filename)
                        .attach('attachment', mockFiles[5].buffer, mockFiles[5].filename)
                        .field('user_email', testParam_dto.user_email)
                        .field('message', testParam_dto.message);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidFilesException);
                    expect(testResponse.body.headers.message).toEqual(errorMsg);
                })

                test('Files: 1x invalid name, validator: validateFilesNames', async () =>{
                    const mockFile = {
                        filename: 'test-file-no-type',
                        buffer: Buffer.alloc(1024 * 1024 * 0.5, 0) // 500kb
                    };
                    const errorMsg = 'support-files-invalid-name';

                    jest.spyOn(Utils, 'logError').mockImplementation();

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .attach('attachment', mockFile.buffer, mockFile.filename)
                        .field('user_email', testParam_dto.user_email)
                        .field('message', testParam_dto.message);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidFilesException);
                    expect(testResponse.body.headers.message).toEqual(errorMsg);
                })

                test('Files: 1x invalid type, validator: validateFilesType', async () =>{
                    const mockFile = {
                        filename: 'test-file.doxc', // Multer gets type from filename.
                        buffer: Buffer.alloc(1024 * 1024 * 0.1, 0) // 100kb
                    };
                    const errorMsg = 'support-files-mimetype';

                    jest.spyOn(Utils, 'logError').mockImplementation();

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .attach('attachment', mockFile.buffer, mockFile.filename)
                        .field('user_email', testParam_dto.user_email)
                        .field('message', testParam_dto.message);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidFilesException);
                    expect(testResponse.body.headers.message).toEqual(errorMsg);
                })

                test('Files: 1x invalid size, validator: validateFilesSizeEach', async () =>{
                    const mockFile = {
                        filename: 'test-file.webp',
                        buffer: Buffer.alloc(1024 * 1024 * 1.5, 0) // 1.5mb
                    };
                    const errorMsg = 'support-files-size-each';

                    jest.spyOn(Utils, 'logError').mockImplementation();

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .attach('attachment', mockFile.buffer, mockFile.filename)
                        .field('user_email', testParam_dto.user_email)
                        .field('message', testParam_dto.message);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidFilesException);
                    expect(testResponse.body.headers.message).toEqual(errorMsg);
                })
            })
        })

        describe('All routes, priority: express-validators, location <params>', () => {

            let mockError: any;
            beforeEach(() => {
                mockError = {
                    type: 'field',
                    value: '',
                    msg: 'support-invalid-entry#ticket_id',
                    path: 'id',
                    location: 'params'
                };
            })

            describe('Route: GET/by-id/:id', () => {

                test('Params: <id>, validator: isUUID() by invalid id', async () => {
                    const testParam_id = 'invalid-id';
                    const testError = structuredClone(mockError);
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
                        option: TicketOption.SUPPORT,
                        message: 'test-message',
                        flag: null
                    }
                    const testError = structuredClone(mockError);
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
                    const testError = structuredClone(mockError);
                    testError['value'] = testParam_id;

                    const testResponse = await request(app)
                        .delete(`${apiUrl}/delete/${testParam_id}`);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([testError]);
                })
            })
        })

        describe('All routes, priority: express-validators, location <body>', () => {

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

                test('Params: <client_id>, validator: isUUID() by invalid value', async () => {
                    let testParam_dto: TicketsFilterDTO = {
                        client_id: [mockId.clients.valid[0], 'invalid-id']
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
                    ];

                    const testResponse = await request(app)
                        .post(`${apiUrl}/search`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual(testError);
                })
            })
            
            describe('Route: POST/create', () => {

                const testData: Partial<TicketsRequestCreateDTO> = {
                    user_email: 'invalid-demo-user@test.com',
                    option: TicketOption.SUPPORT,
                    message: 'test-message',
                };

                const notEmptyParams = Object.keys(testData) as (keyof typeof testData)[];

                test.each(notEmptyParams)('Params: <%s>, validator: notEmpty() by undefined', async (invalidParam) => {
                    const testParam_dto = structuredClone(testData);
                    delete testParam_dto[invalidParam];
                    const mockError = structuredClone(testError);
                    mockError['path'] = invalidParam;

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toContainEqual(mockError);
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

                const testData: Partial<TicketsUpdateDTO> = {
                    status: TicketStatus.ACTIVE,
                    option: TicketOption.SUPPORT,
                    message: 'test-message-express-validation-notEmpty',
                    flag: null
                };

                const notEmptyParams = ['status', 'option', 'message'] as (keyof typeof testData)[];

                test.each(notEmptyParams)('Params: <%s>, validator: notEmpty() by undefined', async (invalidParam) => {
                    const testParam_id = mockId.tickets.invalid[0];
                    const testParam_dto = structuredClone(testData);
                    delete testParam_dto[invalidParam];
                    const mockError = structuredClone(testError);
                    mockError['path'] = invalidParam;

                    const testResponse = await request(app)
                        .put(`${apiUrl}/update/${testParam_id}`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toContainEqual(mockError);
                })

                test('Params: <message>, validator: isLength() by max > 1000 chars', async () => {
                    const testParam_id = mockId.tickets.invalid[0];
                    const testParam_dto: TicketsUpdateDTO = {
                        status: TicketStatus.ACTIVE,
                        option: TicketOption.SUPPORT,
                        message: `This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>This-message-contains-more-than-1000-characters-throwing-<support-invalid-max#message!1000>`,
                        flag: null
                    };

                    const testError = {
                        type: 'field',
                        value: testParam_dto.message,
                        msg: 'support-invalid-max#message!1000',
                        path: 'message',
                        location: 'body'
                    };

                    const testResponse = await request(app)
                        .put(`${apiUrl}/update/${testParam_id}`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toContainEqual(testError);
                })

                test('Params: <last_modified>, validator: isEmpty() by defined value', async () => {
                    const testParam_id = mockId.tickets.valid[0];
                    const testParam_dto: TicketsUpdateDTO = {
                        status: TicketStatus.ACTIVE,
                        option: TicketOption.SUPPORT,
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

                test('Params: <TicketsCreateDTO>, validator: requirePayload by undefined', async () =>{
                    const testParam_dto = undefined;

                    jest.spyOn(Utils, 'logError').mockImplementation();

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([testError]);
                })
            })

            describe('Route: PUT/update/:id', () => {

                test('Params: <TicketsUpdateDTO>, validator: hasBodyPayload by undefined', async () =>{
                    const testParam_id = mockId.tickets.valid[0];
                    const testParam_dto = undefined;

                    jest.spyOn(Utils, 'logError').mockImplementation();

                    const testResponse = await request(app)
                        .put(`${apiUrl}/update/${testParam_id}`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([testError]);
                })
            })
        })
    })
})