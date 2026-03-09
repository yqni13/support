import { Maintenance, Meta, MetaId } from './../../../src/repositories/interfaces/meta.entity.interface';
import { NextFunction, Request, Response } from "express";
import { DBTestSetup } from "../../db-container.setup";
import { runMigrations } from '../../db-migrations.setup';
import request from 'supertest';
import * as CommonUtils from '../../../src/utils/common.utils';
import * as MockUtils from "../../common.test-utils";
import { ErrorStatusCodes } from '../../../src/utils/errorStatusCodes.utils';
import { MaintenanceMode } from '../../../src/utils/enums/maintenance-mode.enum';
import { MaintenanceUpdateDTO, MetaUpdateDTO } from '../../../src/dtos/meta.dto';
import { CommonExceptionMessage } from '../../../src/utils/enums/common-exception-messages.enum';
import { EnvMode } from '../../../src/utils/enums/env-mode.enum';
import { DemoMode } from '../../../src/utils/enums/demo-mode.enum';
import { default as mockId } from "../../mock-data/id.mock-data.json";

jest.mock('../../../src/middleware/auth.admin.middleware', () => ({
    authAdmin: jest.fn(() =>  (req: Request, res: Response, next: NextFunction) => next())
}));
jest.mock('../../../src/middleware/maintenance.middleware', () => ({
    maintain: jest.fn(() =>  (req: Request, res: Response, next: NextFunction) => next())
}));

import app from '../../../src/app';

jest.setTimeout(60000);

const testValidMetaId = mockId.meta.valid[0] as MetaId;
const testTimestamp = '2025-01-01T14:00:01.000Z';

describe('Integration-tests (repository), priority: entity Meta', () => {

    let dbTestSetup: DBTestSetup;
    let apiUrl: string;
    let mockResult: Meta;
    beforeAll(async () => {
        dbTestSetup = new DBTestSetup();
        await dbTestSetup.init();
        MockUtils.disableConsoleMessages(); // Surpress multiple messages (migration progress etc). Disable to debug.
        await runMigrations('meta.integration.test.ts');
        apiUrl = '/api/v1/meta';
        mockResult = {
            id: testValidMetaId,
            app: 'support',
            author: 'yqni13',
            build_on: testTimestamp,
            environment: EnvMode.TEST,
            app_version: '0.1.0',
            db_version: '0.2.0',
            docker_image: 'no-image',
            docker_version: '0.3.0',
            jenkins_version: '0.4.0',
            maintenance_mode: MaintenanceMode.A000,
            last_modified: testTimestamp,
            created_on: testTimestamp
        }
    });

    describe('Testing valid fn calls', () => {

        beforeEach(async () => {
            // Clean tables before each test to fill test data individually.
            await dbTestSetup.clearTables();
        });

        afterAll(async () => {
            await dbTestSetup.shutdown();
        });

        test('Repository process fn findById(), result: "SUCCESS"', async () => {
            const testParam_id = testValidMetaId;
            const testResult: Meta = {
                id: testParam_id,
                app: "support",
                author: "yqni13",
                build_on: testTimestamp,
                environment: EnvMode.TEST,
                app_version: "0.0.1",
                db_version: "0.0.2",
                docker_image: "no-image",
                docker_version: "0.0.3",
                jenkins_version: "0.0.4",
                maintenance_mode: MaintenanceMode.A000,
                last_modified: testTimestamp,
                created_on: testTimestamp
            };

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/id/${testParam_id}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult)
        })

        test('Repository process fn findByName(), result: "SUCCESS"', async () => {
            const testParam_name = "support";
            const testResult: Meta = {
                id: testValidMetaId,
                app: testParam_name,
                author: "yqni13",
                build_on: testTimestamp,
                environment: EnvMode.TEST,
                app_version: "0.0.1",
                db_version: "0.0.2",
                docker_image: "no-image",
                docker_version: "0.0.3",
                jenkins_version: "0.0.4",
                maintenance_mode: MaintenanceMode.A000,
                last_modified: testTimestamp,
                created_on: testTimestamp
            };

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/name/${testParam_name}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult)
        })

        test('Repository process fn findAll(), result: "SUCCESS"', async () => {
            const testResult: Meta[] = [{
                id: testValidMetaId,
                app: "support",
                author: "yqni13",
                build_on: testTimestamp,
                environment: EnvMode.TEST,
                app_version: "0.0.1",
                db_version: "0.0.2",
                docker_image: "no-image",
                docker_version: "0.0.3",
                jenkins_version: "0.0.4",
                maintenance_mode: MaintenanceMode.A000,
                last_modified: testTimestamp,
                created_on: testTimestamp
            }];

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/all`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn update(), result: "SUCCESS"', async () => {
            const testParam_id = testValidMetaId;
            const testParam_dto: MetaUpdateDTO = {
                app: 'support',
                author: 'yqni13',
                build_on: testTimestamp,
                environment: EnvMode.TEST,
                app_version: '0.1.0',
                db_version: '0.2.0',
                docker_image: 'no-image',
                docker_version: '0.3.0',
                jenkins_version: '0.4.0'
            };

            // Mock Utils generated timeStamp for easy comparison.
            jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(testTimestamp);

            const testResult = structuredClone(mockResult);
            testResult['id'] = testParam_id;
            testResult['build_on'] = testTimestamp;
            testResult['last_modified'] = testTimestamp;
            testResult['created_on'] = testTimestamp;

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .put(`${apiUrl}/info/${testParam_id}`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult)
        })

        test('Repository process fn findMaintenance(), result: "SUCCESS"', async () => {
            const testParam_name = 'support';
            const testResult: Maintenance = {
                id: mockResult.id,
                app: testParam_name,
                build_on: testTimestamp,
                maintenance_mode: MaintenanceMode.A000,
                last_modified: testTimestamp,
                created_on: testTimestamp
            };

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/maintenance/${testParam_name}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult)
        })

        test('Repository process fn updateMaintenance(), result: "SUCCESS"', async () => {
            const testParam_id = mockId.meta.valid[0];
            const testParam_data = { maintenance_mode: MaintenanceMode.E013 };

            // Mock Utils generated timeStamp for easy comparison.
            jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(testTimestamp);

            const testResult: Maintenance = {
                id: mockResult.id,
                app: 'support',
                build_on: testTimestamp,
                maintenance_mode: testParam_data.maintenance_mode,
                last_modified: testTimestamp,
                created_on: testTimestamp
            }

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .put(`${apiUrl}/maintenance/${testParam_id}`)
                .send(testParam_data);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        describe('Testing results from demo route', () => {

            test('Service process fn searchDemoByPayload(), result: "SUCCESS"', async () =>{
                const testParam_dto = { demo_mode: DemoMode.SUCCESS };

                const testResult = { app_version: '0.0.1' };

                await dbTestSetup.addTestData();
                const testResponse = await request(app)
                    .post('/api/v1/test/demo')
                    .send(testParam_dto);

                expect(testResponse.statusCode).toBe(200);
                expect(testResponse.body).toMatchObject(testResult);
            })

            test('Service process fn searchDemoByPayload(), result: "DBQueryErrorException"', async () =>{
                const testParam_dto = { demo_mode: DemoMode.ERROR };
                const testResultExceptionMessage = 'support-dbquery-error';

                jest.spyOn(CommonUtils, 'logError').mockImplementation();

                await dbTestSetup.addTestData();
                const testResponse = await request(app)
                    .post('/api/v1/test/demo')
                    .send(testParam_dto);

                expect(testResponse.statusCode).toBe(500);
                expect(testResponse.body.headers.message).toBe(testResultExceptionMessage);
            })
        })
    })

    describe('Testing invalid fn calls', () => {

        describe('All routes, priority: express-validators, location: <params>', () => {

            describe('Route: GET/id:id', () => {

                test('Params: <id>, validator: fn isInt() by string', async () => {
                    const testParam_id = 'invalid_test_id';
                    const testError = {
                        type: 'field',
                        value: testParam_id,
                        msg: 'support-invalid-entry#meta_id',
                        path: 'id',
                        location: 'params'
                    };

                    const testResponse = await request(app)
                        .get(`${apiUrl}/id/${testParam_id}`);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([testError]);
                })
            })

            describe('Route: PUT/info/:id', () => {

                test('Params: <id>, validator: fn isInt() by string', async () => {
                    const testParam_id = 'invalid_test_id';
                    const testVersion = '0.0.0';
                    const testParam_dto: MetaUpdateDTO = {
                        app: 'testapp',
                        author: 'testauthor',
                        build_on: testTimestamp,
                        environment: EnvMode.TEST,
                        app_version: testVersion,
                        db_version: testVersion,
                        docker_image: 'testimage',
                        docker_version: testVersion,
                        jenkins_version: testVersion,
                    };

                    const testError = {
                        type: 'field',
                        value: testParam_id,
                        msg: 'support-invalid-entry#meta_id',
                        path: 'id',
                        location: 'params'
                    };

                    const testResponse = await request(app)
                        .put(`${apiUrl}/info/${testParam_id}`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([testError]);
                })
            })

            describe('Route: PUT/maintenance/:id', () => {

                test('Params: <id>, validator: fn isInt() by string', async () => {
                    const testParam_id = 'invalid_test_id';
                    const testParam_dto: MaintenanceUpdateDTO = {
                        maintenance_mode: MaintenanceMode.M008
                    };

                    const testError = {
                        type: 'field',
                        value: testParam_id,
                        msg: 'support-invalid-entry#meta_id',
                        path: 'id',
                        location: 'params'
                    };

                    const testResponse = await request(app)
                        .put(`${apiUrl}/maintenance/${testParam_id}`)
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

            describe('Route: PUT/info/:id', () => {

                const testData: Partial<Meta> = {
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
                const testedParams = Object.keys(testData) as (keyof typeof testData)[];

                test.each(testedParams)('Params: <%s>, validator: fn notEmpty() by undefined', async (invalidParam) => {
                    const testParam_id = 1;
                    let mockParam_dto = structuredClone(testData);
                    delete mockParam_dto[invalidParam];
                    const testError = structuredClone(mockError);
                    testError['path'] = invalidParam;

                    const testResponse = await request(app)
                        .put(`${apiUrl}/info/${testParam_id}`)
                        .send(mockParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toContainEqual(testError);
                })
            })
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

            describe('Route: PUT/info/:id', () => {

                test('Params: <MetaUpdateDTO>, validator: fn requirePayload() by undefined', async () =>{
                    const testParam_id = 1;
                    const testParam_dto = undefined;
                    const testError = structuredClone(mockError);

                    jest.spyOn(CommonUtils, 'logError').mockImplementation();

                    const testResponse = await request(app)
                        .put(`${apiUrl}/info/${testParam_id}`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([testError]);
                })
            })

            describe('Route: PUT/maintenance/:id', () => {

                test('Params: <MaintenanceUpdateDTO>, validator: fn requirePayload() by undefined', async () =>{
                    const testParam_id = mockId.meta.valid[0];
                    const testParam_dto = undefined;
                    const testError = structuredClone(mockError);

                    jest.spyOn(CommonUtils, 'logError').mockImplementation();

                    const testResponse = await request(app)
                        .put(`${apiUrl}/maintenance/${testParam_id}`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([testError]);
                })
            })

            describe('Route: POST/demo', () => {

                test('Params: <MetaDemoDTO>, validator: fn requirePayload() by undefined', async () =>{
                    const testParam_dto = undefined;
                    const testError = structuredClone(mockError);

                    jest.spyOn(CommonUtils, 'logError').mockImplementation();

                    const testResponse = await request(app)
                        .post('/api/v1/test/demo')
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([testError]);
                })
            })
        })
    })
})