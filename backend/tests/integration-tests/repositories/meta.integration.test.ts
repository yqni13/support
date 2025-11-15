import { Maintenance, Meta } from './../../../src/repositories/interfaces/meta.entity.interface';
import { NextFunction, Request, Response } from "express";
import { DBTestSetup } from "../db-container.setup";
import { runMigrations } from '../../db-migrations.setup';
import request from 'supertest';
import app from '../../../src/app';
import * as Utils from '../../../src/utils/common.utils';
import { ErrorStatusCodes } from '../../../src/utils/errorStatusCodes.utils';
import { MaintenanceMode } from '../../../src/utils/enums/maintenance-mode.enum';

jest.mock('../../../src/middleware/auth.middleware', () => ({
    authAdmin: jest.fn(() =>  (req: Request, res: Response, next: NextFunction) => next())
}));

jest.setTimeout(60000);

describe('Integration test (repository specific), priority: Meta', () => {

    describe('Testing valid fn calls', () => {

        let dbTestSetup: DBTestSetup;
        let apiUrl: string;
        let mockResult: Meta;
        beforeAll(async () => {
            dbTestSetup = new DBTestSetup();
            await dbTestSetup.init();
            await runMigrations();
            apiUrl = '/api/v1/meta';

            mockResult = {
                id: 1,
                app: 'support',
                author: 'yqni13',
                build_on: '2025-01-01T13:00:01.000',
                environment: 'test',
                app_version: '0.1.0',
                db_version: '0.2.0',
                docker_image: 'no-image',
                docker_version: '0.3.0',
                jenkins_version: '0.4.0',
                maintenance_mode: MaintenanceMode.E000,
                last_modified: '',
                created_on: '2025-01-01T13:00:01.000'
            }
        });

        beforeEach(async () => {
            // Clean tables before each test to fill test data individually.
            await dbTestSetup.clearTables();
        });

        afterAll(async () => {
            await dbTestSetup.shutdown();
        });

        test('Repository process fn findById, result: "SUCCESS"', async () => {
            const testParam_id = 1;
            const mockTimestamp = "2025-01-01T14:00:01.000";
            const testResult: Meta = {
                id: testParam_id,
                app: "support",
                author: "yqni13",
                build_on: mockTimestamp,
                environment: "test",
                app_version: "0.0.1",
                db_version: "0.0.2",
                docker_image: "no-image",
                docker_version: "0.0.3",
                jenkins_version: "0.0.4",
                maintenance_mode: MaintenanceMode.E000,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            };

            dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/by-id/${testParam_id}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult)
        })

        test('Repository process fn findByName, result: "SUCCESS"', async () => {
            const testParam_name = "support";
            const mockTimestamp = "2025-01-01T14:00:01.000";
            const testResult: Meta = {
                id: 1,
                app: testParam_name,
                author: "yqni13",
                build_on: mockTimestamp,
                environment: "test",
                app_version: "0.0.1",
                db_version: "0.0.2",
                docker_image: "no-image",
                docker_version: "0.0.3",
                jenkins_version: "0.0.4",
                maintenance_mode: MaintenanceMode.E000,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            };

            dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/by-name/${testParam_name}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult)
        })

        test('Repository process fn findAll, result: "SUCCESS"', async () => {
            const mockTimestamp = "2025-01-01T14:00:01.000";
            const testResult: Meta[] = [{
                id: 1,
                app: "support",
                author: "yqni13",
                build_on: mockTimestamp,
                environment: "test",
                app_version: "0.0.1",
                db_version: "0.0.2",
                docker_image: "no-image",
                docker_version: "0.0.3",
                jenkins_version: "0.0.4",
                maintenance_mode: MaintenanceMode.E000,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            }];

            dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/all`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn update, result: "SUCCESS"', async () => {
            const testParam_id = 1;
            const mockTimeStamp = "2025-02-02T14:00:00.000";
            const mockParam_timeStamp = Utils.getTimestampWithOffsetInfo(new Date(mockTimeStamp));
            const testParam_data: Partial<Meta> = {
                app: 'support',
                author: 'yqni13',
                build_on: '2025-01-01T13:00:01.000',
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

            const testResult = structuredClone(mockResult);
            testResult['id'] = testParam_id;
            testResult['build_on'] = '2025-01-01T14:00:01.000';
            testResult['last_modified'] = mockTimeStamp;
            testResult['created_on'] = '2025-01-01T14:00:01.000';

            dbTestSetup.addTestData();
            const testResponse = await request(app)
                .put(`${apiUrl}/info/${testParam_id}`)
                .send(testParam_data);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult)
        })

        test('Repository process fn findMaintenance, result: "Success"', async () => {
            const testParam_name = 'support';
            const mockTimestamp = "2025-01-01T14:00:01.000";
            const testResult: Maintenance = {
                id: mockResult.id,
                app: testParam_name,
                build_on: mockTimestamp,
                maintenance_mode: MaintenanceMode.E000,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            };

            dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/maintenance/${testParam_name}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult)
        })

        test('Repository process fn updateMaintenance, result: "Success"', async () => {
            const testParam_name = 'support';
            const mockTimeStamp = "2025-02-02T14:00:00.000";
            const mockParam_timeStamp = Utils.getTimestampWithOffsetInfo(new Date(mockTimeStamp));
            const testParam_data = { maintenance_mode: MaintenanceMode.D013 };

            // Mock Utils generated timeStamp for easy comparison.
            jest.spyOn(Utils, "getTimestampWithOffsetInfo").mockReturnValue(mockParam_timeStamp);

            const testTimestamp = "2025-01-01T14:00:01.000";
            const testResult: Maintenance = {
                id: mockResult.id,
                app: testParam_name,
                build_on: testTimestamp,
                maintenance_mode: testParam_data.maintenance_mode,
                last_modified: mockTimeStamp,
                created_on: testTimestamp
            }

            dbTestSetup.addTestData();
            const testResponse = await request(app)
                .put(`${apiUrl}/maintenance/${testParam_name}`)
                .send(testParam_data);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        const apiUrl = '/api/v1/meta';
        let mockError: any;
        beforeEach(() => {
            mockError = {
                type: 'field',
                value: '',
                msg: 'support-arg-required',
                path: '',
                location: 'body'
            };
        });

        describe('Route: PUT/info, priority: express-validators', () => {

            const mockData: Partial<Meta> = {
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

            // "keyof typeof mockData" creates Union-Types of keys to ensure all properties are valid.
            const testedParams = Object.keys(mockData) as (keyof typeof mockData)[];

            test.each(testedParams)('Params: <%s>, validator: notEmpty by undefined', async (invalidParam) => {
                const mockParam_id = 1;
                let mockParam_data = structuredClone(mockData);
                delete mockParam_data[invalidParam];
                const testError = structuredClone(mockError);
                testError['path'] = invalidParam;

                const mockResponse = await request(app)
                    .put(`${apiUrl}/info/${mockParam_id}`)
                    .send(mockParam_data);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(testError);
            })

            
        })

        describe('Route: PUT/maintenance, priority: express-validators', () => {

            test('Params: <maintenance_mode>, validator: notEmpty by undefined', async () => {
                const mockParam_id = 1;
                const mockParam_data = undefined;
                const testError = structuredClone(mockError);
                testError['path'] = 'maintenance_mode';

                const mockResponse = await request(app)
                    .put(`${apiUrl}/maintenance/${mockParam_id}`)
                    .send(mockParam_data);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(testError);
            })
        })
    })
})