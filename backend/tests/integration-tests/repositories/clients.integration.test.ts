import { NextFunction, Request, Response } from "express";
import {
    ClientsCreateResponseDTO,
    ClientsStatusResponseDTO,
    ClientsCreateDTO,
    ClientsStatusUpdateDTO
} from "../../../src/dtos/clients.dto";
import * as Utils from '../../../src/utils/common.utils';
import request from 'supertest';
import { ErrorStatusCodes } from '../../../src/utils/errorStatusCodes.utils';
import { ApiKeyStatus } from "../../../src/utils/enums/api-key-status.enum";
import { DBTestSetup } from "../db-container.setup";
import { runMigrations } from '../../db-migrations.setup';
import clientsModel from "../../../src/models/clients.model";
import { Clients } from "../../../src/repositories/interfaces/clients.entity.interface";
import { CommonExceptionMessage } from "../../../src/utils/enums/common-exception-messages.enum";
import { default as mockId } from "../../mock-data/id.mock-data.json";

jest.mock('../../../src/middleware/auth.admin.middleware', () => ({
    authAdmin: jest.fn(() =>  (req: Request, res: Response, next: NextFunction) => next())
}));
jest.mock('../../../src/middleware/maintenance.middleware', () => ({
    maintain: jest.fn(() =>  (req: Request, res: Response, next: NextFunction) => next())
}));

import app from '../../../src/app';
import { secrets } from "../../../src/utils/secrets.utils";

jest.setTimeout(60000);
const testTimestamp = '2025-01-01T14:00:02.000Z';

describe('Integration test (repository specific), priority: Clients', () => {

    let dbTestSetup: DBTestSetup;
    let apiUrl: string;
    const testVar_apiKey = { keyRaw: secrets.TEST_APIKEY_RAW, keyHash: secrets.TEST_APIKEY_HASH };
    beforeAll(async () => {
        dbTestSetup = new DBTestSetup();
        await dbTestSetup.init();
        await runMigrations();
        apiUrl = '/api/v1/clients';
    });

    beforeEach(async () => {
        // Clean tables before each test to fill test data individually.
        await dbTestSetup.clearTables();
    });

    afterAll(async () => {
        await dbTestSetup.shutdown();
    });

    describe('Testing valid fn calls', () => {

        test('Repository process fn findStatusByName, result: "SUCCESS"', async () => {
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

        test('Repository process fn findStatusByName, result: "NO-ENTRY-FOUND"', async () => {
            const testParam_name = 'non-existing-client';
            const testResult = {};

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/status/${testParam_name}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn create, result: "SUCCESS"', async () => {
            const testParam_client_id = mockId.clients.new[0];
            const testParam_dto = { name: 'testclient_test_create' };

            jest.spyOn(Utils, 'generateUUID').mockReturnValue(testParam_client_id);
            jest.spyOn(clientsModel, '_generateApiKeyObj').mockReturnValue(testVar_apiKey);
            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(testTimestamp);

            const testResult: ClientsCreateResponseDTO = {
                client_id: testParam_client_id,
                name: testParam_dto.name,
                api_key: testVar_apiKey.keyRaw,
                status: ApiKeyStatus.ACTIVE,
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

        test('Repository process fn updateStatus, result: "SUCCESS"', async () => {
            const testParam_id = mockId.clients.valid[0];
            const testParam_data: Partial<Clients> = {
                status: ApiKeyStatus.DISABLED
            };

            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(testTimestamp);

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

        const apiUrl = '/api/v1/clients';

        describe('All routes, priority: express-validators, location: <params>', () => {

            describe('Route: PUT/status/:id', () => {

                test('Params: <id>, validator: isUUID() by invalid id', async () => {
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

            describe('Route: PUT/status/:id', () => {

                test('Params: <status>, validator: notEmpty() by empty object', async () => {
                    const testParam_id = 'test_id';
                    const testParam_dto = {};
                    const testError = structuredClone(mockError);
                    testError['path'] = 'status';

                    const testResponse = await request(app)
                        .put(`${apiUrl}/status/${testParam_id}`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toContainEqual(testError);
                })
            })

            describe('Route: POST/create, priority: validateClientUniqueness', () => {

                test('Params: <name> by existing "TESTCLIENT" in db', async () => {
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
        })

        describe('All routes, priority: error middleware, location: <body>', () => {

            let mockError: any;
            beforeEach(() => {
                mockError = {
                    type: 'field',
                    value: 'undefined',
                    msg: 'support-payload-required',
                    path: 'req.body',
                    location: 'body'
                };
            })

            describe('Route: POST/create/:id', () => {

                test('Params: <ClientsCreateDTO>, validator: hasBodyPayload by undefined', async () =>{
                    const testParam_dto = undefined;
                    const testError = structuredClone(mockError);

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toContainEqual(testError);
                })
            })

            describe('Route: PUT/status/:id', () => {

                test('Params: <ClientsStatusUpdateDTO>, validator: hasBodyPayload by undefined', async () =>{
                    const testParam_id = mockId.clients.valid[0];
                    const testParam_dto = undefined;
                    const testError = structuredClone(mockError);

                    const testResponse = await request(app)
                        .put(`${apiUrl}/status/${testParam_id}`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toContainEqual(testError);
                })
            })
        })
    })
})