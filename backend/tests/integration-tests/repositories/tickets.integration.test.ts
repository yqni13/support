import { NextFunction, Request, Response } from "express";
import {
    TicketsCreateResponseDTO,
    TicketsFilterDTO,
    TicketsRequestCreateDTO,
    TicketsResponseDTO,
    TicketsResponseExtendedDTO,
    TicketsUpdateDTO
} from "../../../src/dtos/tickets.dto";
import * as CommonUtils from '../../../src/utils/common.utils';
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
import { DeviceOption } from "../../../src/utils/enums/device-option.enum";
import { UsersId } from "../../../src/repositories/interfaces/users.entity.interface";
import { ClientsId } from "../../../src/repositories/interfaces/clients.entity.interface";
import { TicketsId } from "../../../src/repositories/interfaces/tickets.entity.interface";
import ticketsService from "../../../src/services/tickets.service";
import { NotificationService } from "../../../src/services/notificiation.service";
import { DBTestData } from "../../db-data.setup";

const testValidTicketId = mockId.tickets.valid[0] as TicketsId;
const testValidClientId = mockId.clients.valid[0] as ClientsId;
const testValidUserId = mockId.users.valid[0] as UsersId;
const testTimestamp = '2025-01-01T14:00:04.000Z';

jest.mock('../../../src/middleware/auth.admin.middleware', () => ({
    authAdmin: jest.fn(() => (req: Request, res: Response, next: NextFunction) => next())
}));
jest.mock('../../../src/middleware/auth.client.middleware', () => ({
    authClient: jest.fn(() => (req: Request, res: Response, next: NextFunction) => {
        (req as any).apiClients = { client_id: testValidClientId };
        next();
    })
}));
jest.mock('../../../src/middleware/auth.user.middleware', () => ({
    authUser: jest.fn(() => (req: Request, res: Response, next: NextFunction) => {
        (req as any).apiUsers = { user_id: testValidUserId };
        next();
    })
}));
jest.mock('../../../src/middleware/parser/form-data.parser.middleware.ts', () => ({
    parseFormData: jest.fn(() => (req: Request, res: Response, next: NextFunction) => next())
}))
jest.mock('../../../src/middleware/maintenance.middleware', () => ({
    maintain: jest.fn(() =>  (req: Request, res: Response, next: NextFunction) => next())
}));
jest.mock('../../../src/middleware/observe.middleware.ts', () => ({
    observe: jest.fn(() => (req: Request, res: Response, next: NextFunction) => next())
}))

import app from '../../../src/app';

jest.setTimeout(60000);

describe('Integration-tests (repository), priority: entity Tickets', () => {

    let dbTestSetup: DBTestSetup;
    let dbTestData: DBTestData;
    let testValidClientName: string;
    let testValidUserEmail: string;
    let apiUrl: string;
    const testNewParam_ticket_id = mockId.tickets.new[0] as TicketsId;
    beforeAll(async () => {
        dbTestSetup = new DBTestSetup();
        dbTestData = DBTestData.getInstance();
        testValidClientName = dbTestData.getClientsInsertSql().values[1];
        testValidUserEmail = dbTestData.getUsersInsertSql().values[1];
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

        test('Repository process fn findById(), result: "SUCCESS"', async () => {
            const testParam_id = testValidTicketId;
            const testResult: TicketsResponseExtendedDTO = {
                ticket_id: testParam_id,
                client_id: testValidClientId,
                client_name: testValidClientName,
                user_id: testValidUserId,
                user_email: testValidUserEmail,
                status: TicketStatus.ISSUED,
                option: TicketOption.SUPPORT,
                title: 'test-title',
                message: 'test-message',
                resource_paths: ['test/path/num0', 'test/path/num1'],
                flag: null,
                info_browser: 'Brave 1.87.190 (Official Build) (64-Bit)',
                info_os: 'Windows 11',
                info_device: DeviceOption.COMPUTER,
                last_modified: testTimestamp,
                created_on: testTimestamp
            };

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/id/${testParam_id}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn findAll(), result: "SUCCESS"', async () => {
            const testResult: TicketsResponseDTO[] = [
                {
                    ticket_id: testValidTicketId,
                    client_id: testValidClientId,
                    user_id: testValidUserId,
                    status: TicketStatus.ISSUED,
                    option: TicketOption.SUPPORT,
                    title: 'test-title',
                    message: 'test-message',
                    resource_paths: ['test/path/num0', 'test/path/num1'],
                    flag: null,
                    info_browser: 'Brave 1.87.190 (Official Build) (64-Bit)',
                    info_os: 'Windows 11',
                    info_device: DeviceOption.COMPUTER,
                    last_modified: testTimestamp,
                    created_on: testTimestamp
                },
                {
                    ticket_id: mockId.tickets.valid[1] as TicketsId,
                    client_id: testValidClientId,
                    user_id: testValidUserId,
                    status: TicketStatus.ISSUED,
                    option: TicketOption.SUPPORT,
                    title: 'test-title',
                    message: 'test-message-without-resource_paths',
                    flag: null,
                    info_browser: 'Brave 1.87.190 (Official Build) (64-Bit)',
                    info_os: 'Android 15',
                    info_device: DeviceOption.MOBILE,
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

        // Testing new HTTP method .query()
        // test('Repository process fn findByFilter(), params: <client_id> result: null', async () => {
        //     const testParam_dto: TicketsFilterDTO = {
        //         client_id: mockId.clients.invalid[0] as ClientsId
        //     };
        //     const testResult: TicketsResponseDTO[] | null = null;

        //     await dbTestSetup.addTestData();
        //     const testResponse = await request(app)
        //         .query(`${apiUrl}/search`)
        //         .send(testParam_dto);

        //     expect(testResponse.statusCode).toBe(200);
        //     expect(testResponse.body).toBe(testResult);
        // })

        test('Repository process fn findByFilter(), params: <client_id> result: null', async () => {
            const testParam_dto: TicketsFilterDTO = {
                client_id: mockId.clients.invalid[0] as ClientsId
            };
            const testResult: TicketsResponseDTO[] | null = null;

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/search`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toBe(testResult);
        })

        test('Repository process fn findByFilter(), params: <user_id[], status> result: "SUCCESS"', async () => {
            const testParam_dto: TicketsFilterDTO = {
                user_id: [testValidUserId, mockId.users.invalid[0]] as UsersId[],
                status: TicketStatus.ISSUED
            };
            const testResult: TicketsResponseDTO[] = [
                {
                    ticket_id: testValidTicketId,
                    client_id: testValidClientId,
                    user_id: testValidUserId,
                    status: TicketStatus.ISSUED,
                    option: TicketOption.SUPPORT,
                    title: 'test-title',
                    message: 'test-message',
                    resource_paths: ['test/path/num0', 'test/path/num1'],
                    flag: null,
                    info_browser: 'Brave 1.87.190 (Official Build) (64-Bit)',
                    info_os: 'Windows 11',
                    info_device: DeviceOption.COMPUTER,
                    last_modified: testTimestamp,
                    created_on: testTimestamp
                },
                {
                    ticket_id: mockId.tickets.valid[1] as TicketsId,
                    client_id: testValidClientId,
                    user_id: testValidUserId,
                    status: TicketStatus.ISSUED,
                    option: TicketOption.SUPPORT,
                    title: 'test-title',
                    message: 'test-message-without-resource_paths',
                    flag: null,
                    info_browser: 'Brave 1.87.190 (Official Build) (64-Bit)',
                    info_os: 'Android 15',
                    info_device: DeviceOption.MOBILE,
                    last_modified: '2025-01-01T14:00:07.000Z',
                    created_on: '2025-01-01T14:00:07.000Z'
                }
            ];

            jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(testTimestamp);

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/search`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn findByFilter(), params: <title> result: "SUCCESS"', async () => {
            const testParam_dto: TicketsFilterDTO = {
                title: 'test-title'
            };
            const testResult: TicketsResponseDTO[] = [
                {
                    ticket_id: testValidTicketId,
                    client_id: testValidClientId,
                    user_id: testValidUserId,
                    status: TicketStatus.ISSUED,
                    option: TicketOption.SUPPORT,
                    title: 'test-title',
                    message: 'test-message',
                    resource_paths: ['test/path/num0', 'test/path/num1'],
                    flag: null,
                    info_browser: 'Brave 1.87.190 (Official Build) (64-Bit)',
                    info_os: 'Windows 11',
                    info_device: DeviceOption.COMPUTER,
                    last_modified: testTimestamp,
                    created_on: testTimestamp
                },
                {
                    ticket_id: mockId.tickets.valid[1] as TicketsId,
                    client_id: testValidClientId,
                    user_id: testValidUserId,
                    status: TicketStatus.ISSUED,
                    option: TicketOption.SUPPORT,
                    title: 'test-title',
                    message: 'test-message-without-resource_paths',
                    flag: null,
                    info_browser: 'Brave 1.87.190 (Official Build) (64-Bit)',
                    info_os: 'Android 15',
                    info_device: DeviceOption.MOBILE,
                    last_modified: '2025-01-01T14:00:07.000Z',
                    created_on: '2025-01-01T14:00:07.000Z'
                }
            ];

            jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(testTimestamp);

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/search`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn findByFilter(), params: <option> result: "SUCCESS"', async () => {
            const testParam_dto: TicketsFilterDTO = {
                option: TicketOption.SUPPORT
            };
            const testResult: TicketsResponseDTO[] = [
                {
                    ticket_id: testValidTicketId,
                    client_id: testValidClientId,
                    user_id: testValidUserId,
                    status: TicketStatus.ISSUED,
                    option: TicketOption.SUPPORT,
                    title: 'test-title',
                    message: 'test-message',
                    resource_paths: ['test/path/num0', 'test/path/num1'],
                    flag: null,
                    info_browser: 'Brave 1.87.190 (Official Build) (64-Bit)',
                    info_os: 'Windows 11',
                    info_device: DeviceOption.COMPUTER,
                    last_modified: testTimestamp,
                    created_on: testTimestamp
                },
                {
                    ticket_id: mockId.tickets.valid[1] as TicketsId,
                    client_id: testValidClientId,
                    user_id: testValidUserId,
                    status: TicketStatus.ISSUED,
                    option: TicketOption.SUPPORT,
                    title: 'test-title',
                    message: 'test-message-without-resource_paths',
                    flag: null,
                    info_browser: 'Brave 1.87.190 (Official Build) (64-Bit)',
                    info_os: 'Android 15',
                    info_device: DeviceOption.MOBILE,
                    last_modified: '2025-01-01T14:00:07.000Z',
                    created_on: '2025-01-01T14:00:07.000Z'
                }
            ];

            jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(testTimestamp);

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/search`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn findByFilter(), params: <created_on[]> result: "SUCCESS"', async () => {
            const testParam_dto: TicketsFilterDTO = {
                created_on: ['2024-12-01T00:00:00.000Z', '2025-01-02T14:00:00.000Z']
            };
            const testResult: TicketsResponseDTO[] = [
                {
                    ticket_id: testValidTicketId,
                    client_id: testValidClientId,
                    user_id: testValidUserId,
                    status: TicketStatus.ISSUED,
                    option: TicketOption.SUPPORT,
                    title: 'test-title',
                    message: 'test-message',
                    resource_paths: ['test/path/num0', 'test/path/num1'],
                    flag: null,
                    info_browser: 'Brave 1.87.190 (Official Build) (64-Bit)',
                    info_os: 'Windows 11',
                    info_device: DeviceOption.COMPUTER,
                    last_modified: testTimestamp,
                    created_on: testTimestamp
                },
                {
                    ticket_id: mockId.tickets.valid[1] as TicketsId,
                    client_id: testValidClientId,
                    user_id: testValidUserId,
                    status: TicketStatus.ISSUED,
                    option: TicketOption.SUPPORT,
                    title: 'test-title',
                    message: 'test-message-without-resource_paths',
                    flag: null,
                    info_browser: 'Brave 1.87.190 (Official Build) (64-Bit)',
                    info_os: 'Android 15',
                    info_device: DeviceOption.MOBILE,
                    last_modified: '2025-01-01T14:00:07.000Z',
                    created_on: '2025-01-01T14:00:07.000Z'
                }
            ];

            jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(testTimestamp);

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/search`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn findByFilter(), params: <flag> result: null', async () => {
            const testParam_dto: TicketsFilterDTO = {
                flag: Flag.ERROR
            };
            const testResult: TicketsResponseDTO[] | null = null;

            jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(testTimestamp);

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/search`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toBe(testResult);
        })

        test('Repository process fn create(), priority: without files, result: "SUCCESS"', async () => {
            // TicketsCreateRequestDTO interface necessary to mock auth middleware (data for client_id & user_id).
            const testParam_dto: TicketsRequestCreateDTO = {
                user_email: 'new-user0@test.com',
                option: TicketOption.SUPPORT,
                title: 'new-test-title0',
                message: 'new-test-message0',
            };

            jest.spyOn(CommonUtils, "generateUUID").mockReturnValue(testNewParam_ticket_id);
            jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(testTimestamp);
            jest.spyOn(NotificationService.prototype, 'sendTicketInfo').mockImplementation();

            const testResult: TicketsCreateResponseDTO = {
                status: TicketStatus.ISSUED,
                option: TicketOption.SUPPORT,
                flag: null,
                created_on: testTimestamp
            };

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/create`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn create(), priority: with single file, result: "SUCCESS"', async () => {
            const testParam_dto: TicketsRequestCreateDTO = {
                user_email: 'new-user1@test.com',
                option: TicketOption.SUPPORT,
                title: 'new-test-title1',
                message: 'new-test-message1',
            };
            const mockFile = {
                filename: 'test-image1.webp', // mapped to originalname as Express.Multer.File
                buffer: Buffer.alloc(1024 * 1024 * 0.2, 0) // 200kb
            };
            const mockPaths = [`tickets/${testNewParam_ticket_id}/0_${testNewParam_ticket_id}.webp`];

            jest.spyOn(CommonUtils, "generateUUID").mockReturnValue(testNewParam_ticket_id);
            jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(testTimestamp);
            jest.spyOn(NotificationService.prototype, 'sendTicketInfo').mockImplementation();
            jest.spyOn(FilesService.prototype, 'transformFiles').mockImplementation();
            jest.spyOn(FilesService.prototype, 'uploadFiles').mockImplementation();
            jest.spyOn(FilesService.prototype, 'getResourcePaths').mockReturnValue(mockPaths);

            const testResult: TicketsCreateResponseDTO = {
                status: TicketStatus.ISSUED,
                option: TicketOption.SUPPORT,
                flag: null,
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
                .field('title', testParam_dto.title)
                .field('message', testParam_dto.message);

            const testFindByIdResponse = await ticketsService.getTicketById(testNewParam_ticket_id);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
            expect(testFindByIdResponse?.resource_paths).toEqual(mockPaths);
        })

        test('Repository process fn create(), priority: with multiple files, result: "SUCCESS"', async () => {
            const testParam_dto: TicketsRequestCreateDTO = {
                user_email: 'new-user2@test.com',
                option: TicketOption.SUPPORT,
                title: 'new-test-title2',
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

            jest.spyOn(CommonUtils, "generateUUID").mockReturnValue(testNewParam_ticket_id);
            jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(testTimestamp);
            jest.spyOn(NotificationService.prototype, 'sendTicketInfo').mockImplementation();
            jest.spyOn(FilesService.prototype, 'transformFiles').mockImplementation();
            jest.spyOn(FilesService.prototype, 'uploadFiles').mockImplementation();
            jest.spyOn(FilesService.prototype, 'getResourcePaths').mockReturnValue(mockPaths);

            const testResult: TicketsCreateResponseDTO = {
                status: TicketStatus.ISSUED,
                option: TicketOption.SUPPORT,
                flag: null,
                created_on: testTimestamp
            };

            await dbTestSetup.addTestData();

            const testResponse = await request(app)
                .post(`${apiUrl}/create`)
                .attach('attachment', mockFiles[0].buffer, mockFiles[0].filename)
                .attach('attachment', mockFiles[1].buffer, mockFiles[1].filename)
                .field('user_email', testParam_dto.user_email)
                .field('option', testParam_dto.option)
                .field('title', testParam_dto.title)
                .field('message', testParam_dto.message);

            const testFindByIdResponse = await ticketsService.getTicketById(testNewParam_ticket_id);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
            expect(testFindByIdResponse?.resource_paths).toEqual(mockPaths);
        })

        test('Repository process fn update() without resource_paths, result: "SUCCESS"', async () => {
            const testParam_id = mockId.tickets.valid[1] as TicketsId;
            const testParam_dto: TicketsUpdateDTO = {
                status: TicketStatus.ACTIVE,
                option: TicketOption.SUPPORT,
                title: 'updated-test-title-without-resource_paths',
                message: 'updated-test-message-without-resource_paths',
                flag: null,
                info_browser: 'Brave 1.87.190 (Official Build) (64-Bit)',
                info_os: 'Android 15',
                info_device: DeviceOption.MOBILE,
            };

            const mockTimestampNoPaths = '2025-01-01T14:00:07.000Z';
            jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(mockTimestampNoPaths);

            const testResult: TicketsResponseDTO = {
                ...structuredClone(testParam_dto),
                info_browser: 'Brave 1.87.190 (Official Build) (64-Bit)',
                info_os: 'Android 15',
                info_device: DeviceOption.MOBILE,
                ticket_id: testParam_id,
                client_id: testValidClientId,
                user_id: testValidUserId,
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

        test('Repository process fn update() with resource_paths, result: "SUCCESS"', async () => {
            const testParam_id = testValidTicketId;
            const testParam_dto: TicketsUpdateDTO = {
                status: TicketStatus.ACTIVE,
                option: TicketOption.BUG,
                title: 'updated-test-title',
                message: 'updated-test-message',
                flag: null,
                info_browser: 'Brave 1.87.190 (Official Build) (64-Bit)',
                info_os: 'Windows 11',
                info_device: DeviceOption.COMPUTER,
            };

            jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(testTimestamp);

            const testResult: TicketsResponseDTO = {
                ...structuredClone(testParam_dto),
                resource_paths: ['test/path/num0', 'test/path/num1'],
                info_browser: 'Brave 1.87.190 (Official Build) (64-Bit)',
                info_os: 'Windows 11',
                info_device: DeviceOption.COMPUTER,
                ticket_id: testParam_id,
                client_id: testValidClientId,
                user_id: testValidUserId,
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

        test('Repository process fn delete() with empty resource_paths, result: "SUCCESS"', async () => {
            const testParam_id = mockId.tickets.valid[1];
            const testResult = true;
            jest.spyOn(ticketsModel, 'isPermittedToDelete').mockReturnValue(true);

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .delete(`${apiUrl}/delete/${testParam_id}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toBe(testResult);
        })

        test('Repository process fn delete() with existing data for resource_paths, result: "SUCCESS"', async () => {
            const testParam_id = testValidTicketId;
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

        test('Repository process fn delete(), result: "NOT-FOUND-ENTRY"', async () => {
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
                        title: 'invalid-new-test-title',
                        message: 'invalid-new-test-message',
                    };
                })

                test('Files: invalid number of files, validator: fn validateFilesMaxNumber()', async () =>{
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

                    jest.spyOn(CommonUtils, 'logError').mockImplementation();

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

                test('Files: 1x invalid name, validator: fn validateFilesNames()', async () =>{
                    const mockFile = {
                        filename: 'test-file-no-type',
                        buffer: Buffer.alloc(1024 * 1024 * 0.5, 0) // 500kb
                    };
                    const errorMsg = 'support-files-invalid-name';

                    jest.spyOn(CommonUtils, 'logError').mockImplementation();

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .attach('attachment', mockFile.buffer, mockFile.filename)
                        .field('user_email', testParam_dto.user_email)
                        .field('message', testParam_dto.message);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidFilesException);
                    expect(testResponse.body.headers.message).toEqual(errorMsg);
                })

                test('Files: 1x invalid type, validator: fn validateFilesType()', async () =>{
                    const mockFile = {
                        filename: 'test-file.doxc', // Multer gets type from filename.
                        buffer: Buffer.alloc(1024 * 1024 * 0.1, 0) // 100kb
                    };
                    const errorMsg = 'support-files-mimetype';

                    jest.spyOn(CommonUtils, 'logError').mockImplementation();

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .attach('attachment', mockFile.buffer, mockFile.filename)
                        .field('user_email', testParam_dto.user_email)
                        .field('message', testParam_dto.message);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidFilesException);
                    expect(testResponse.body.headers.message).toEqual(errorMsg);
                })

                test('Files: 1x invalid size, validator: fn validateFilesSizeEach()', async () =>{
                    const mockFile = {
                        filename: 'test-file.webp',
                        buffer: Buffer.alloc(1024 * 1024 * 1.5, 0) // 1.5mb
                    };
                    const errorMsg = 'support-files-size-each';

                    jest.spyOn(CommonUtils, 'logError').mockImplementation();

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

            describe('Route: GET/id/:id', () => {

                test('Params: <id>, validator: fn isUUID() by invalid id', async () => {
                    const testParam_id = 'invalid-UUID';
                    const testError = structuredClone(mockError);
                    testError['value'] = testParam_id;

                    const testResponse = await request(app)
                        .get(`${apiUrl}/id/${testParam_id}`);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([testError]);
                })
            })

            describe('Route: PUT/update/:id', () => {

                test('Params: <id>, validator: fn isUUID() by invalid id', async () => {
                    const testParam_id = 'invalid-UUID';
                    const testParam_dto: TicketsUpdateDTO = {
                        status: TicketStatus.ACTIVE,
                        option: TicketOption.SUPPORT,
                        title: 'test-title',
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

                test('Params: <id>, validator: fn isUUID() by invalid id', async () => {
                    const testParam_id = 'invalid-UUID';
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

                test('Params: <client_id>, validator: fn isUUID() by invalid value', async () => {
                    let testParam_dto: TicketsFilterDTO = {
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
                    let testParam_dto: TicketsFilterDTO = {
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
            })
            
            describe('Route: POST/create', () => {

                let testData: Partial<TicketsRequestCreateDTO>;
                beforeEach(() => {
                    testData = {
                        user_email: 'invalid-demo-user@test.com',
                        option: TicketOption.SUPPORT,
                        title: 'test-title',
                        message: 'test-message',
                    };
                })

                const emptyParams = ['user_email', 'option', 'title', 'message'] as (keyof typeof testData)[];

                test.each(emptyParams)('Params: <%s>, validator: fn notEmpty() by undefined', async (invalidParam) => {
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

                test('Params: <title>, validator: fn isLength() by max > 100 chars', async () => {
                    const mockParam_dto = structuredClone(testData);
                    mockParam_dto.title = String('').padStart(101, 'test');
                    const testError = {
                        type: 'field',
                        value: mockParam_dto.title,
                        msg: 'support-invalid-max#title!100',
                        path: 'title',
                        location: 'body'
                    };

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(mockParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toContainEqual(testError);
                })

                test('Params: <message>, validator: fn isLength() by max > 5000 chars', async () => {
                    const mockParam_dto = structuredClone(testData);
                    mockParam_dto.message = String('').padStart(5001, 'test');
                    const testError = {
                        type: 'field',
                        value: mockParam_dto.message,
                        msg: 'support-invalid-max#message!5000',
                        path: 'message',
                        location: 'body'
                    };

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(mockParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toContainEqual(testError);
                })

                test('Params: <resource_paths>, validator: fn isEmpty() by defined value', async () => {
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

                test('Params: <info_browser>, validator: fn isLength() by max > 100 chars', async () => {
                    const mockParam_dto = structuredClone(testData);
                    mockParam_dto.info_browser = String('').padStart(101, 'test');
                    const testError = {
                        type: 'field',
                        value: mockParam_dto.info_browser,
                        msg: 'support-invalid-max#info_browser!100',
                        path: 'info_browser',
                        location: 'body'
                    };

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(mockParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toContainEqual(testError);
                })

                test('Params: <info_os>, validator: fn isLength() by max > 100 chars', async () => {
                    const mockParam_dto = structuredClone(testData);
                    mockParam_dto.info_os = String('').padStart(101, 'test');
                    const testError = {
                        type: 'field',
                        value: mockParam_dto.info_os,
                        msg: 'support-invalid-max#info_os!100',
                        path: 'info_os',
                        location: 'body'
                    };

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(mockParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toContainEqual(testError);
                })

                test('Params: <info_device>, validator: fn isLength() by max > 50 chars', async () => {
                    const mockParam_dto = structuredClone(testData);
                    mockParam_dto.info_device = String('').padStart(51, 'test') as DeviceOption;
                    const testError = {
                        type: 'field',
                        value: mockParam_dto.info_device,
                        msg: 'support-invalid-max#info_device!50',
                        path: 'info_device',
                        location: 'body'
                    };

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(mockParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toContainEqual(testError);
                })
            })

            describe('Route: PUT/update/:id', () => {

                let testParam_id: TicketsId;
                let testData: Partial<TicketsUpdateDTO>;
                beforeEach(() => {
                    testParam_id = mockId.tickets.invalid[0] as TicketsId;
                    testData = {
                        status: TicketStatus.ACTIVE,
                        option: TicketOption.SUPPORT,
                        title: 'test-title-express-validation-notEmpty',
                        message: 'test-message-express-validation-notEmpty',
                        flag: null
                    };
                })

                const emptyParams = ['status', 'option', 'title', 'message'] as (keyof typeof testData)[];

                test.each(emptyParams)('Params: <%s>, validator: fn notEmpty() by undefined', async (invalidParam) => {
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

                test('Params: <title>, validator: fn isLength() by max > 100 chars', async () => {
                    const testParam_dto = structuredClone(testData);
                    testParam_dto.title = String('').padStart(101, 'test');
                    const testError = {
                        type: 'field',
                        value: testParam_dto.title,
                        msg: 'support-invalid-max#title!100',
                        path: 'title',
                        location: 'body'
                    };

                    const testResponse = await request(app)
                        .put(`${apiUrl}/update/${testParam_id}`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toContainEqual(testError);
                })

                test('Params: <message>, validator: fn isLength() by max > 5000 chars', async () => {
                    const testParam_dto = structuredClone(testData);
                    testParam_dto.message = String('').padStart(5001, 'test');

                    const testError = {
                        type: 'field',
                        value: testParam_dto.message,
                        msg: 'support-invalid-max#message!5000',
                        path: 'message',
                        location: 'body'
                    };

                    const testResponse = await request(app)
                        .put(`${apiUrl}/update/${testParam_id}`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toContainEqual(testError);
                })

                test('Params: <info_browser>, validator: fn isLength() by max > 100 chars', async () => {
                    const testParam_dto = structuredClone(testData);
                    testParam_dto.info_browser = String('').padStart(101, 'test');
                    const testError = {
                        type: 'field',
                        value: testParam_dto.info_browser,
                        msg: 'support-invalid-max#info_browser!100',
                        path: 'info_browser',
                        location: 'body'
                    };

                    const testResponse = await request(app)
                        .put(`${apiUrl}/update/${testParam_id}`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toContainEqual(testError);
                })

                test('Params: <info_os>, validator: fn isLength() by max > 100 chars', async () => {
                    const testParam_dto = structuredClone(testData);
                    testParam_dto.info_os = String('').padStart(101, 'test');
                    const testError = {
                        type: 'field',
                        value: testParam_dto.info_os,
                        msg: 'support-invalid-max#info_os!100',
                        path: 'info_os',
                        location: 'body'
                    };

                    const testResponse = await request(app)
                        .put(`${apiUrl}/update/${testParam_id}`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toContainEqual(testError);
                })

                test('Params: <info_device>, validator: fn isLength() by max > 50 chars', async () => {
                    const testParam_dto = structuredClone(testData);
                    testParam_dto.info_device = String('').padStart(51, 'test') as DeviceOption;
                    const testError = {
                        type: 'field',
                        value: testParam_dto.info_device,
                        msg: 'support-invalid-max#info_device!50',
                        path: 'info_device',
                        location: 'body'
                    };

                    const testResponse = await request(app)
                        .put(`${apiUrl}/update/${testParam_id}`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toContainEqual(testError);
                })

                test('Params: <last_modified>, validator: fn isEmpty() by defined value', async () => {
                    const testParam_dto = structuredClone(testData);
                    testParam_dto.last_modified = testTimestamp;

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

            // Route: POST/search => no requirePayload() test for empty body as controller calls findAll() instead.

            describe('Route: POST/create', () => {

                test('Params: <TicketsCreateDTO>, validator: fn requirePayload() by undefined', async () =>{
                    const testParam_dto = undefined;

                    jest.spyOn(CommonUtils, 'logError').mockImplementation();

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([testError]);
                })
            })

            describe('Route: PUT/update/:id', () => {

                test('Params: <TicketsUpdateDTO>, validator: fn hasBodyPayload() by undefined', async () =>{
                    const testParam_id = testValidTicketId;
                    const testParam_dto = undefined;

                    jest.spyOn(CommonUtils, 'logError').mockImplementation();

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