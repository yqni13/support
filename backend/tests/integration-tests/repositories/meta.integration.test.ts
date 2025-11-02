import { Meta } from './../../../src/repositories/interfaces/meta.entity.interface';
import { NextFunction, Request, Response } from "express"
import { DBTestSetup } from "../db-container.setup";
import { runMigrations } from '../../db-migrations.setup';
import request from 'supertest';
import app from '../../../src/app';
import * as Utils from '../../../src/utils/common.utils';
import { ErrorStatusCodes } from '../../../src/utils/errorStatusCodes.utils';
import { MaintenanceMode } from '../../../src/utils/enums/maintenance-mode.enum';

jest.mock('../../../src/middleware/auth.middleware', () => ({
    auth: jest.fn(() =>  (req: Request, res: Response, next: NextFunction) => next())
}));


describe('Integration test (repository specific), priority: Meta', () => {

    describe('Testing valid fn calls', () => {

        let dbTestSetup: DBTestSetup;
        let apiUrl: string;
        let mockParam_key: string;
        beforeAll(async () => {
            dbTestSetup = new DBTestSetup();
            jest.setTimeout(60000);
            await dbTestSetup.init();
            await runMigrations();
            apiUrl = '/api/v1/meta';
            mockParam_key = 'testkey';
        })

        beforeEach(async () => {
            // Clean tables before each test to fill test data individually.
            await dbTestSetup.clearTables(['meta']);
        })

        afterAll(async () => {
            await dbTestSetup.shutdown();
        })

        test('Repository process fn findById, result: "SUCCESS"', async () => {
            const testParam_id = 1;
            const testResult: Meta = {
                id: testParam_id,
                app: "support",
                author: "yqni13",
                build_on: "2025-01-01T14:00:01.000",
                environment: "test",
                app_version: "0.0.1",
                db_version: "0.0.2",
                docker_image: "no-image",
                docker_version: "0.0.3",
                jenkins_version: "0.0.4",
                maintenance_mode: MaintenanceMode.E000,
                last_modified: "2025-01-01T14:00:01.000",
                created_on: "2025-01-01T14:00:01.000"
            };

            dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/info/${testParam_id}/${mockParam_key}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult)
        })

        test('Repository process fn update, result: "SUCCESS"', async () => {
            const testParam_id = 1;
            const mockTimeStamp = "2025-02-02T14:00:00.000";
            const mockParam_timeStamp = Utils.getTimestampWithOffsetInfo(new Date(mockTimeStamp));
            const testParam_data: Partial<Meta> = {
                app: 'support',
                author: 'yqni13',
                build_on: '2025-01-02T13:00:01.000',
                environment: 'test',
                app_version: '0.1.0',
                db_version: '0.2.0',
                docker_image: 'no-image',
                docker_version: '0.3.0',
                jenkins_version: '0.4.0',
                last_modified: mockParam_timeStamp
            };

            // Mock Utils generated timeStamp for easy comparison.
            jest.spyOn(Utils, "getTimestampWithOffsetInfo").mockReturnValue(mockParam_timeStamp);

            const testResult: Meta = {
                id: testParam_id,
                app: 'support',
                author: 'yqni13',
                build_on: '2025-01-02T14:00:01.000',
                environment: 'test',
                app_version: '0.1.0',
                db_version: '0.2.0',
                docker_image: 'no-image',
                docker_version: '0.3.0',
                jenkins_version: '0.4.0',
                maintenance_mode: MaintenanceMode.E000,
                last_modified: mockTimeStamp,
                created_on: '2025-01-01T14:00:01.000'
            }

            dbTestSetup.addTestData();
            
            const testResponse = await request(app)
                .put(`${apiUrl}/update/${testParam_id}/${mockParam_key}`)
                .send(testParam_data);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult)
        })
    })

    describe('Testing invalid fn calls', () => {

        describe('Route: /update, priority: express-validators', () => {

            const mockData = {
                app: 'support',
                author: 'yqni13',
                build_on: '2025-01-02T14:00:01.000',
                environment: 'test',
                app_version: '0.1.0',
                db_version: '0.2.0',
                docker_image: 'no-image',
                docker_version: '0.3.0',
                jenkins_version: '0.4.0'
            };
            const apiUrl = '/api/v1/meta';
            const mockParam_key = 'testkey';

            // "keyof typeof mockData" creates Union-Types of keys to ensure all properties are valid.
            const testedParams = Object.keys(mockData) as (keyof typeof mockData)[];

            test.each(testedParams)('Params: <%s>, validator: notEmpty by undefined', async (invalidParam) => {
                const mockParam_id = 1;
                let mockParam_data = structuredClone(mockData);
                delete mockParam_data[invalidParam];
                const mockError = {
                    type: 'field',
                    value: '',
                    msg: 'support-arg-required',
                    path: invalidParam,
                    location: 'body'
                }

                const mockResponse = await request(app)
                    .put(`${apiUrl}/update/${mockParam_id}/${mockParam_key}`)
                    .send(mockParam_data);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })
        })
    })
})