import { Maintenance, Meta } from './../../../src/repositories/interfaces/meta.entity.interface';
import { NextFunction, Request, Response } from "express";
import { DBTestSetup } from "../db-container.setup";
import { runMigrations } from '../../db-migrations.setup';
import request from 'supertest';
import app from '../../../src/app';
import * as Utils from '../../../src/utils/common.utils';
import { ErrorStatusCodes } from '../../../src/utils/errorStatusCodes.utils';
import { MaintenanceMode } from '../../../src/utils/enums/maintenance-mode.enum';
import { MaintenanceUpdateDTO, MetaUpdateDTO } from '../../../src/dtos/meta.dto';
import { CommonExceptionMessage } from '../../../src/utils/enums/common-exception-messages.enum';
import { EnvMode } from '../../../src/utils/enums/env-mode.enum';

jest.mock('../../../src/middleware/auth.middleware', () => ({
    authAdmin: jest.fn(() =>  (req: Request, res: Response, next: NextFunction) => next())
}));

jest.setTimeout(60000);

describe('Integration test (repository specific), priority: Meta', () => {

    describe('Testing valid fn calls', () => {

        let dbTestSetup: DBTestSetup;
        let apiUrl: string;
        let mockTimestamp: string;
        let mockResult: Meta;
        beforeAll(async () => {
            dbTestSetup = new DBTestSetup();
            await dbTestSetup.init();
            await runMigrations();
            apiUrl = '/api/v1/meta';
            mockTimestamp = '2025-01-01T14:00:01.000Z';
            mockResult = {
                id: 1,
                app: 'support',
                author: 'yqni13',
                build_on: mockTimestamp,
                environment: EnvMode.TEST,
                app_version: '0.1.0',
                db_version: '0.2.0',
                docker_image: 'no-image',
                docker_version: '0.3.0',
                jenkins_version: '0.4.0',
                maintenance_mode: MaintenanceMode.E000,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
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
            const testResult: Meta = {
                id: testParam_id,
                app: "support",
                author: "yqni13",
                build_on: mockTimestamp,
                environment: EnvMode.TEST,
                app_version: "0.0.1",
                db_version: "0.0.2",
                docker_image: "no-image",
                docker_version: "0.0.3",
                jenkins_version: "0.0.4",
                maintenance_mode: MaintenanceMode.E000,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            };

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/by-id/${testParam_id}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult)
        })

        test('Repository process fn findByName, result: "SUCCESS"', async () => {
            const testParam_name = "support";
            const testResult: Meta = {
                id: 1,
                app: testParam_name,
                author: "yqni13",
                build_on: mockTimestamp,
                environment: EnvMode.TEST,
                app_version: "0.0.1",
                db_version: "0.0.2",
                docker_image: "no-image",
                docker_version: "0.0.3",
                jenkins_version: "0.0.4",
                maintenance_mode: MaintenanceMode.E000,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            };

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/by-name/${testParam_name}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult)
        })

        test('Repository process fn findAll, result: "SUCCESS"', async () => {
            const testResult: Meta[] = [{
                id: 1,
                app: "support",
                author: "yqni13",
                build_on: mockTimestamp,
                environment: EnvMode.TEST,
                app_version: "0.0.1",
                db_version: "0.0.2",
                docker_image: "no-image",
                docker_version: "0.0.3",
                jenkins_version: "0.0.4",
                maintenance_mode: MaintenanceMode.E000,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            }];

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/all`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn update, result: "SUCCESS"', async () => {
            const testParam_id = 1;
            const testParam_dto: MetaUpdateDTO = {
                app: 'support',
                author: 'yqni13',
                build_on: mockTimestamp,
                environment: EnvMode.TEST,
                app_version: '0.1.0',
                db_version: '0.2.0',
                docker_image: 'no-image',
                docker_version: '0.3.0',
                jenkins_version: '0.4.0'
            };

            // Mock Utils generated timeStamp for easy comparison.
            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(mockTimestamp);

            const testResult = structuredClone(mockResult);
            testResult['id'] = testParam_id;
            testResult['build_on'] = mockTimestamp;
            testResult['last_modified'] = mockTimestamp;
            testResult['created_on'] = mockTimestamp;

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .put(`${apiUrl}/info/${testParam_id}`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult)
        })

        test('Repository process fn findMaintenance, result: "Success"', async () => {
            const testParam_name = 'support';
            const testResult: Maintenance = {
                id: mockResult.id,
                app: testParam_name,
                build_on: mockTimestamp,
                maintenance_mode: MaintenanceMode.E000,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            };

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/maintenance/${testParam_name}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult)
        })

        test('Repository process fn updateMaintenance, result: "Success"', async () => {
            const testParam_name = 'support';
            const testParam_data = { maintenance_mode: MaintenanceMode.D013 };

            // Mock Utils generated timeStamp for easy comparison.
            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(mockTimestamp);

            const testResult: Maintenance = {
                id: mockResult.id,
                app: testParam_name,
                build_on: mockTimestamp,
                maintenance_mode: testParam_data.maintenance_mode,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            }

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .put(`${apiUrl}/maintenance/${testParam_name}`)
                .send(testParam_data);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        const apiUrl = '/api/v1/meta';
        const mockTimestamp = '2025-01-01T14:00:01.000Z';

        describe('All routes, priority: express-validators, location: <params>', () => {

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

            describe('Route: GET/by-id:id', () => {

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

                test('Params: <id>, validator: isInt by string', async () => {
                    const mockParam_id = 'invalid_test_id';
                    const testError = {
                        type: 'field',
                        value: mockParam_id,
                        msg: 'support-invalid-id',
                        path: 'id',
                        location: 'params'
                    };

                    const mockResponse = await request(app)
                        .get(`${apiUrl}/by-id/${mockParam_id}`);

                    expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(mockResponse.body.headers.data).toEqual([testError]);
                })
            })

            describe('Route: GET/by-name/:name', () => {

                test('Params: <name>, validator: notEmpty by undefined', async () => {
                    const mockParam_name = '%20';
                    const testError = structuredClone(mockError);
                    testError['path'] = 'name';
    
                    const mockResponse = await request(app)
                        .get(`${apiUrl}/by-name/${mockParam_name}`);
    
                    expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(mockResponse.body.headers.data).toEqual([testError]);
                })
            })

            describe('Route: PUT/info/:id', () => {

                test('Params: <id>, validator: notEmpty by undefined', async () => {
                    const mockParam_id = '%20';
                    const mockVersion = '0.0.0';
                    const mockParam_dto: MetaUpdateDTO = {
                        app: 'testapp',
                        author: 'testauthor',
                        build_on: mockTimestamp,
                        environment: EnvMode.TEST,
                        app_version: mockVersion,
                        db_version: mockVersion,
                        docker_image: 'testimage',
                        docker_version: mockVersion,
                        jenkins_version: mockVersion,
                    };
    
                    const testError = structuredClone(mockError);
                    testError['path'] = 'id';
    
                    const mockResponse = await request(app)
                        .put(`${apiUrl}/info/${mockParam_id}`)
                        .send(mockParam_dto);
    
                    expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(mockResponse.body.headers.data).toEqual([testError]);
                })
    
                test('Params: <id>, validator: isInt by string', async () => {
                    const mockParam_id = 'invalid_test_id';
                    const mockVersion = '0.0.0';
                    const mockParam_dto: MetaUpdateDTO = {
                        app: 'testapp',
                        author: 'testauthor',
                        build_on: mockTimestamp,
                        environment: EnvMode.TEST,
                        app_version: mockVersion,
                        db_version: mockVersion,
                        docker_image: 'testimage',
                        docker_version: mockVersion,
                        jenkins_version: mockVersion,
                    };
    
                    const testError = {
                        type: 'field',
                        value: mockParam_id,
                        msg: 'support-invalid-id',
                        path: 'id',
                        location: 'params'
                    };
    
                    const mockResponse = await request(app)
                        .put(`${apiUrl}/info/${mockParam_id}`)
                        .send(mockParam_dto);
    
                    expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(mockResponse.body.headers.data).toEqual([testError]);
                })
            })

            describe('Route: GET/maintenance/:name', () => {

                test('Params: <name>, validator: notEmpty by undefined', async () => {
                    const mockParam_name = '%20';
                    const testError = structuredClone(mockError);
                    testError['path'] = 'name';
                    
                    const mockResponse = await request(app)
                    .get(`${apiUrl}/maintenance/${mockParam_name}`);
                    
                    expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(mockResponse.body.headers.data).toEqual([testError]);
                })

                test('Params: <name>, validator: notEmpty by undefined', async () => {
                    const mockParam_name = '%20';
                    const mockParam_dto: MaintenanceUpdateDTO = {
                        maintenance_mode: MaintenanceMode.A008
                    };
    
                    const testError = structuredClone(mockError);
                    testError['path'] = 'name';
    
                    const mockResponse = await request(app)
                        .put(`${apiUrl}/maintenance/${mockParam_name}`)
                        .send(mockParam_dto);
    
                    expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(mockResponse.body.headers.data).toEqual([testError]);
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

            describe('Route: PUT/info/:id', () => {

                const mockData: Partial<Meta> = {
                    app: 'support',
                    author: 'yqni13',
                    build_on: '2025-01-01T14:00:01.000Z',
                    environment: EnvMode.TEST,
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
                    let mockParam_dto = structuredClone(mockData);
                    delete mockParam_dto[invalidParam];
                    const testError = structuredClone(mockError);
                    testError['path'] = invalidParam;

                    const mockResponse = await request(app)
                        .put(`${apiUrl}/info/${mockParam_id}`)
                        .send(mockParam_dto);

                    expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(mockResponse.body.headers.data).toContainEqual(testError);
                })
            })

            describe('Route: PUT/maintenance/:id', () => {

                test('Params: <maintenance_mode>, validator: notEmpty by undefined', async () => {
                    const mockParam_id = 1;
                    const mockParam_dto = undefined;
                    const testError = structuredClone(mockError);
                    testError['path'] = 'maintenance_mode';

                    const mockResponse = await request(app)
                        .put(`${apiUrl}/maintenance/${mockParam_id}`)
                        .send(mockParam_dto);

                    expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(mockResponse.body.headers.data).toContainEqual(testError);
                })
            })
        })
    })
})