import { NextFunction, Request, Response } from "express";
import {
    ClientsCreateResponseDTO,
    ClientsStatusResponseDTO,
    ClientsCreateDTO,
    ClientsStatusUpdateDTO,
    ClientsFlagResponseDTO,
    ClientsFlagUpdateDTO,
    ClientsExistResponseDTO
} from "../../../src/dtos/clients.dto";
import * as CommonUtils from '../../../src/utils/common.utils';
import * as MockUtils from "../../common.test-utils";
import request from 'supertest';
import { ErrorStatusCodes } from '../../../src/utils/errorStatusCodes.utils';
import { ApiKeyStatus } from "../../../src/utils/enums/api-key-status.enum";
import { DBTestSetup } from "../../db-container.setup";
import { runMigrations } from '../../db-migrations.setup';
import clientsModel from "../../../src/models/clients.model";
import { Clients } from "../../../src/repositories/interfaces/clients.entity.interface";
import { CommonExceptionMessage } from "../../../src/utils/enums/common-exception-messages.enum";
import { default as mockId } from "../../mock-data/id.mock-data.json";
import { secrets } from "../../../src/utils/secrets.utils";
import { Flag } from "../../../src/utils/enums/flag.enum";
import clientsService from "../../../src/services/clients.service";

jest.mock('../../../src/middleware/auth.admin.middleware', () => ({
    authAdmin: jest.fn(() =>  (req: Request, res: Response, next: NextFunction) => next())
}));
jest.mock('../../../src/middleware/maintenance.middleware', () => ({
    maintain: jest.fn(() =>  (req: Request, res: Response, next: NextFunction) => next())
}));

import app from '../../../src/app';

jest.setTimeout(60000);
const testTimestamp = '2025-01-01T14:00:02.000Z';

describe('Integration-tests (repository), priority: entity Clients', () => {

    let dbTestSetup: DBTestSetup;
    let apiUrl: string;
    const testVar_apiKey = { keyRaw: secrets.TEST_APIKEY_RAW, keyHash: secrets.TEST_APIKEY_HASH };
    beforeAll(async () => {
        dbTestSetup = new DBTestSetup();
        await dbTestSetup.init();
        MockUtils.disableConsoleMessages();
        await runMigrations('clients.integration.test.ts');
        apiUrl = '/api/v1/clients';
    });

    beforeEach(async () => {
        await dbTestSetup.clearTables();
    });

    afterAll(async () => {
        await dbTestSetup.shutdown();
    });

    describe('Testing valid fn calls', () => {

        test('Repository process fn findById(), result: "SUCCESS"', async () => {
            const testParam_id = mockId.clients.valid[0];
            const testResult: ClientsExistResponseDTO | null = {
                client_id: mockId.clients.valid[0],
                name: 'TESTCLIENT',
                api_key_hash: secrets.TEST_APIKEY_HASH,
                status: ApiKeyStatus.ACTIVE,
                flag: null,
                last_use: testTimestamp,
                last_modified: testTimestamp,
                created_on: testTimestamp
            };

            await dbTestSetup.addTestData();
            const testResponse = await clientsService.getClientById(testParam_id);

            expect(testResponse).toMatchObject(testResult);
        })
        
        test('Repository process fn findByName(), result: "SUCCESS"', async () => {
            const mockParam_name = 'TESTCLIENT';
            const testResult: ClientsExistResponseDTO | null = {
                client_id: mockId.clients.valid[0],
                name: 'TESTCLIENT',
                api_key_hash: secrets.TEST_APIKEY_HASH,
                status: ApiKeyStatus.ACTIVE,
                flag: null,
                last_use: testTimestamp,
                last_modified: testTimestamp,
                created_on: testTimestamp
            };

            await dbTestSetup.addTestData();
            const testResponse = await clientsService.getClientByName(mockParam_name);

            expect(testResponse).toMatchObject(testResult);
        })

        test('Repository process fn findStatusByName(), result: "SUCCESS"', async () => {
            const testParam_name = 'TESTCLIENT';
            const testResult: ClientsStatusResponseDTO = {
                client_id: mockId.clients.valid[0],
                name: testParam_name,
                status: ApiKeyStatus.ACTIVE,
                last_use: testTimestamp,
                last_modified: testTimestamp,
                created_on: testTimestamp
            };

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/status/${testParam_name}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn findStatusByName(), result: "NO-ENTRY-FOUND"', async () => {
            const testParam_name = 'non-existing-client';
            const testResult = null;

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/status/${testParam_name}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toBe(testResult);
        })

        test('Repository process fn create(), result: "SUCCESS"', async () => {
            const testParam_client_id = mockId.clients.new[0];
            const testParam_dto = { name: 'testclient_test_create' };

            jest.spyOn(CommonUtils, 'generateUUID').mockReturnValue(testParam_client_id);
            jest.spyOn(clientsModel, '_generateApiKeyObj').mockReturnValue(testVar_apiKey);
            jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(testTimestamp);

            const testResult: ClientsCreateResponseDTO = {
                client_id: testParam_client_id,
                name: testParam_dto.name,
                api_key: testVar_apiKey.keyRaw,
                status: ApiKeyStatus.ACTIVE,
                flag: null,
                last_use: testTimestamp,
                last_modified: testTimestamp,
                created_on: testTimestamp
            };

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/create`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn updateFlag(), result: "SUCCESS"', async () => {
            const testParam_id = mockId.clients.valid[0];
            const testParam_dto: ClientsFlagUpdateDTO = {
                flag: Flag.WARNING
            };

            jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(testTimestamp);

            const testResult: ClientsFlagResponseDTO | null = {
                client_id: testParam_id,
                flag: Flag.WARNING,
                last_use: testTimestamp,
                last_modified: testTimestamp,
                created_on: testTimestamp
            };

            await dbTestSetup.addTestData();
            const testResponse = await clientsService.updateClientFlag(testParam_id, testParam_dto);

            expect(testResponse).toMatchObject(testResult);
        })

        test('Repository process fn updateFlag(), result: null', async () => {
            const testParam_id = mockId.clients.invalid[0];
            const testParam_dto: ClientsFlagUpdateDTO = {
                flag: Flag.WARNING
            };

            jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(testTimestamp);

            const testResult: ClientsFlagResponseDTO | null = null;

            await dbTestSetup.addTestData();
            const testResponse = await clientsService.updateClientFlag(testParam_id, testParam_dto);

            expect(testResponse).toBe(testResult);
        })

        test('Repository process fn updateStatus(), result: "SUCCESS"', async () => {
            const testParam_id = mockId.clients.valid[0];
            const testParam_data: Partial<Clients> = {
                status: ApiKeyStatus.DISABLED
            };

            jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(testTimestamp);

            const testResult: ClientsStatusResponseDTO = {
                client_id: testParam_id,
                name: 'TESTCLIENT',
                status: ApiKeyStatus.DISABLED,
                last_use: testTimestamp,
                last_modified: testTimestamp,
                created_on: testTimestamp
            };

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .put(`${apiUrl}/status/${testParam_id}`)
                .send(testParam_data);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        describe('All routes, priority: express-validators, location: <params>', () => {

            describe('Route: PUT/status/:id', () => {

                test('Params: <id>, validator: fn isUUID() by invalid id', async () => {
                    const testParam_id = 'invalid-id';
                    const testParam_dto: ClientsStatusUpdateDTO = {
                        status: ApiKeyStatus.EXPIRED
                    };
                    const testError = {
                        type: 'field',
                        value: testParam_id,
                        msg: 'support-invalid-entry#client_id',
                        path: 'id',
                        location: 'params'
                    }

                    const testResponse = await request(app)
                        .put(`${apiUrl}/status/${testParam_id}`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([testError]);
                })
            })
        })

        describe('All routes, priority: express-validators, location: <body>', () => {

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

                test('Params: <name>, validator: fn validateClientUniqueness() by existing client in db', async () => {
                    const testParam_dto: ClientsCreateDTO = {
                        name: 'TESTCLIENT'
                    };

                    const testError = [{
                        type: 'field',
                        value: testParam_dto.name,
                        msg: 'support-nonunique-client',
                        path: 'name',
                        location: 'body'
                    }];

                    await dbTestSetup.addTestData();
                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toStrictEqual(testError);
                })
            })

            // (Route: PUT/status/:id) No test for notEmpty() => single property in dto => requirePayload() catches {}
        })

        describe('All routes, priority: require middleware, location: <body>', () => {

            let mockError: any;
            beforeEach(() => {
                mockError = {
                    type: 'field',
                    value: '',
                    msg: 'support-payload-required',
                    path: 'req.body',
                    location: 'body'
                };
            })

            describe('Route: POST/create/:id', () => {

                test('Params: <ClientsCreateDTO>, validator: fn requirePayload() by undefined', async () =>{
                    const testParam_dto = undefined;
                    const testError = structuredClone(mockError);

                    jest.spyOn(CommonUtils, 'logError').mockImplementation();

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([testError]);
                })
            })

            describe('Route: PUT/status/:id', () => {

                test('Params: <ClientsStatusUpdateDTO>, validator: fn requirePayload() by undefined', async () =>{
                    const testParam_id = mockId.clients.valid[0];
                    const testParam_dto = undefined;
                    const testError = structuredClone(mockError);

                    jest.spyOn(CommonUtils, 'logError').mockImplementation();

                    const testResponse = await request(app)
                        .put(`${apiUrl}/status/${testParam_id}`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([testError]);
                })
            })
        })
    })
})