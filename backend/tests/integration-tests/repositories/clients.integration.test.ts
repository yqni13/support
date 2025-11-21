import { NextFunction, Request, Response } from "express";
import * as Utils from '../../../src/utils/common.utils';
import request from 'supertest';
import app from '../../../src/app';
import { ErrorStatusCodes } from '../../../src/utils/errorStatusCodes.utils';
import { ApiKeyStatus } from "../../../src/utils/enums/api-key-status.enum";
import { DBTestSetup } from "../db-container.setup";
import { runMigrations } from '../../db-migrations.setup';
import { ClientsCreateResponseDTO, ClientsStatusResponseDTO, ClientsStatusUpdateDTO } from "../../../src/dtos/clients.dto";
import clientsModel from "../../../src/models/clients.model";
import { Clients } from "../../../src/repositories/interfaces/clients.entity.interface";
import { CommonExceptionMessage } from "../../../src/utils/enums/common-exception-messages.enum";

jest.mock('../../../src/middleware/auth.middleware', () => ({
    authAdmin: jest.fn(() =>  (req: Request, res: Response, next: NextFunction) => next())
}));
jest.mock('../../../src/middleware/maintenance.middleware', () => ({
    maintain: jest.fn(() =>  (req: Request, res: Response, next: NextFunction) => next())
}));

jest.setTimeout(60000);

describe('Integration test (repository specific), priority: Clients', () => {

    describe('Testing valid fn calls', () => {

        let dbTestSetup: DBTestSetup;
        let apiUrl: string;
        const mockTimestamp = '2025-01-01T14:00:02.000Z';
        const mockVar_apiKey = clientsModel._generateApiKeyObj();
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

        test('Repository process fn findStatusByName, result: "SUCCESS"', async () => {
            const testParam_name = 'TESTCLIENT';
            const testResult: ClientsStatusResponseDTO = {
                client_id: '9e024539-32e8-4317-8007-84a3956e6b57',
                name: testParam_name,
                status: ApiKeyStatus.ACTIVE,
                last_use: mockTimestamp,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            };

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/status/${testParam_name}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn create, result: "SUCCESS"', async () => {
            const testParam_client_id = Utils.generateUUID();
            const testParam_dto = { name: 'testclient_test_create' };

            jest.spyOn(Utils, 'generateUUID').mockReturnValue(testParam_client_id);
            jest.spyOn(clientsModel, '_generateApiKeyObj').mockReturnValue(mockVar_apiKey);
            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(mockTimestamp);

            const testResult: ClientsCreateResponseDTO = {
                client_id: testParam_client_id,
                name: testParam_dto.name,
                api_key: mockVar_apiKey.keyRaw,
                status: ApiKeyStatus.ACTIVE,
                last_use: mockTimestamp,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            };

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/create`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn updateStatus, result: "SUCCESS"', async () => {
            const testParam_id = '9e024539-32e8-4317-8007-84a3956e6b57';
            const testParam_data: Partial<Clients> = {
                status: ApiKeyStatus.DISABLED
            };

            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(mockTimestamp);

            const testResult: ClientsStatusResponseDTO = {
                client_id: testParam_id,
                name: 'TESTCLIENT',
                status: ApiKeyStatus.DISABLED,
                last_use: mockTimestamp,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
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

        describe('All routes, priority: express-validators (param)', () => {

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

            describe('Route: GET/status/:name', () => {

                test('Params: <name>, validator: notEmpty by undefined', async () => {
                    // To test undefined, we need empty string but still match ':name' as part of route:
                    // Simulate by URL-encoded SPACE + trim() => ''
                    const mockParam_name = '%20';
                    const testError = structuredClone(mockError);
                    testError['path'] = 'name';

                    const mockResponse = await request(app)
                        .get(`${apiUrl}/status/${mockParam_name}`);

                    expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(mockResponse.body.headers.data).toEqual([testError]);
                })
            })

            describe('Route: PUT/status/:id', () => {

                test('Params: <id>, validator: notEmpty by undefined', async () => {
                    const mockParam_id = '%20';
                    const mockParam_dto: ClientsStatusUpdateDTO = {
                        status: ApiKeyStatus.EXPIRED
                    };

                    const testError = structuredClone(mockError);
                    testError['path'] = 'id';

                    const mockResponse = await request(app)
                        .put(`${apiUrl}/status/${mockParam_id}`)
                        .send(mockParam_dto);

                    expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(mockResponse.body.headers.data).toEqual([testError]);
                })
            })
        })

        describe('All routes, priority: express-validators (body)', () => {

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

                test('Params: <status>, validator: notEmpty by undefined', async () => {
                    const mockParam_id = 'test_id';
                    const mockParam_dto = undefined;
                    const testError = structuredClone(mockError);
                    testError['path'] = 'status';

                    const mockResponse = await request(app)
                        .put(`${apiUrl}/status/${mockParam_id}`)
                        .send(mockParam_dto);

                    expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(mockResponse.body.headers.data).toContainEqual(testError);
                })
            })
        })
    })
})