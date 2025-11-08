import { NextFunction, Request, Response } from "express";
import * as Utils from '../../../src/utils/common.utils';
import request from 'supertest';
import app from '../../../src/app';
import { ErrorStatusCodes } from '../../../src/utils/errorStatusCodes.utils';
import { ApiKeyStatus } from "../../../src/utils/enums/api-key-status.enum";
import { DBTestSetup } from "../db-container.setup";
import { runMigrations } from '../../db-migrations.setup';
import { Clients } from "../../../src/repositories/interfaces/clients.entity.interface";
import { ClientsCreateResponseDTO } from "../../../src/dtos/clients.dto";
import clientsModel from "../../../src/models/clients.model";

jest.mock('../../../src/middleware/auth.middleware', () => ({
    auth: jest.fn(() =>  (req: Request, res: Response, next: NextFunction) => next())
}));

jest.setTimeout(60000);

describe('Integration test (repository specific), priority: Clients', () => {

    describe('Testing valid fn calls', () => {

        let dbTestSetup: DBTestSetup;
        let apiUrl: string;

        let mockParam_authKey: string;
        const mockParam_apiKeyObj = clientsModel.generateApiKeyObj();
        beforeAll(async () => {
            dbTestSetup = new DBTestSetup();
            await dbTestSetup.init();
            await runMigrations();
            apiUrl = '/api/v1/clients';
            mockParam_authKey = 'testkey';
        });

        beforeEach(async () => {
            // Clean tables before each test to fill test data individually.
            await dbTestSetup.clearTables();
        });

        afterAll(async () => {
            await dbTestSetup.shutdown();
        });

        test('Repository process fn create, result: "SUCCESS"', async () => {
            const testParam_client_id = Utils.generateUUID();
            const testParam_name = 'testclient_test_create';
            const mockTimeStamp = '2025-01-01T14:00:01.000';
            const mockParam_timeStamp = Utils.getTimestampWithOffsetInfo(new Date(mockTimeStamp))

            jest.spyOn(Utils, 'generateUUID').mockReturnValue(testParam_client_id);
            jest.spyOn(clientsModel, 'generateApiKeyObj').mockReturnValue(mockParam_apiKeyObj);
            jest.spyOn(Utils, "getTimestampWithOffsetInfo").mockReturnValue(mockParam_timeStamp);

            const testResult: ClientsCreateResponseDTO = {
                client_id: testParam_client_id,
                name: testParam_name,
                api_key: mockParam_apiKeyObj.keyRaw,
                status: ApiKeyStatus.ACTIVE,
                last_use: mockTimeStamp,
                last_modified: mockTimeStamp,
                created_on: mockTimeStamp
            };

            dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/create/${mockParam_authKey}`)
                .send({name: testParam_name});

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult)
        })
    })
})