import { NextFunction, Request, Response } from "express";
import * as Utils from '../../../src/utils/common.utils';
import * as MockUtils from "../../common.test-utils";
import request from 'supertest';
import { ErrorStatusCodes } from '../../../src/utils/errorStatusCodes.utils';
import { DBTestSetup } from "../db-container.setup";
import { runMigrations } from '../../db-migrations.setup';
import { UsersUpdateDTO, UsersFilterDTO, UsersResponseDTO, UsersCreateDTO } from "../../../src/dtos/users.dto";
import { Users } from "../../../src/repositories/interfaces/users.entity.interface";
import { UserStatus } from "../../../src/utils/enums/user-status.enum";
import { Flag } from "../../../src/utils/enums/flag.enum";
import { default as mockId } from "../../mock-data/id.mock-data.json";
import { CommonExceptionMessage } from "../../../src/utils/enums/common-exception-messages.enum";

jest.mock('../../../src/middleware/auth.admin.middleware', () => ({
    authAdmin: jest.fn(() =>  (req: Request, res: Response, next: NextFunction) => next())
}));
jest.mock('../../../src/middleware/maintenance.middleware', () => ({
    maintain: jest.fn(() =>  (req: Request, res: Response, next: NextFunction) => next())
}));

import app from '../../../src/app';

jest.setTimeout(60000);
const testTimestamp = '2025-01-01T14:00:03.000Z';

describe('Integration test (repository specific), priority: Users', () => {

    let dbTestSetup: DBTestSetup;
    let apiUrl: string;
    beforeAll(async () => {
        dbTestSetup = new DBTestSetup();
        await dbTestSetup.init();
        MockUtils.disableConsoleMessages(); // Surpress multiple messages (migration progress etc). Disable to debug.
        await runMigrations('users.integration.test.ts');
        apiUrl = '/api/v1/users';
    });

    beforeEach(async () => {
        await dbTestSetup.clearTables();
    });

    afterAll(async () => {
        await dbTestSetup.shutdown();
    });

    describe('Testing valid fn calls', () => {

        test('Repository process fn findById, result: "SUCCESS"', async () => {
            const testParam_id = mockId.users.valid[0];
            const testResult: UsersResponseDTO = {
                user_id: testParam_id,
                email: 'max.mustermann@yqni13.com',
                status: UserStatus.ACTIVE,
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

        test('Repository process fn findByEmail, result: "SUCCESS"', async () => {
            const testParam_email = 'max.mustermann@yqni13.com';
            const testResult: UsersResponseDTO = {
                user_id: mockId.users.valid[0],
                email: testParam_email,
                status: UserStatus.ACTIVE,
                flag: null,
                last_modified: testTimestamp,
                created_on: testTimestamp
            };

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/by-email/${testParam_email}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn findAll, result: "SUCCESS"', async () => {
            const testParam_id = mockId.users.valid[0];
            const testResult: Users[] = [{
                user_id: testParam_id,
                email: 'max.mustermann@yqni13.com',
                status: UserStatus.ACTIVE,
                flag: null,
                last_modified: testTimestamp,
                created_on: testTimestamp
            }];

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/all`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn findByFilter, params: <email> result: []', async () => {
            const testParam_dto: UsersFilterDTO = {
                email: 'user@test.com'
            };
            // No entry exists in db with email value from dto.
            const testResult: UsersResponseDTO[] = [];

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/search`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn findByFilter, params: <email[], status> result: "SUCCESS"', async () => {
            const testParam_dto: UsersFilterDTO = {
                email: ['max.mustermann@yqni13.com', 'user@test.com'],
                status: UserStatus.ACTIVE
            };
            const testResult: UsersResponseDTO[] = [{
                user_id: mockId.users.valid[0],
                email: 'max.mustermann@yqni13.com',
                status: UserStatus.ACTIVE,
                flag: null,
                last_modified: testTimestamp,
                created_on: testTimestamp
            }];

            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(testTimestamp);

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/search`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn findByFilter, params: <flag> result: "SUCCESS"', async () => {
            const testParam_dto: UsersFilterDTO = {
                flag: null
            };
            const testResult: UsersResponseDTO[] = [{
                user_id: mockId.users.valid[0],
                email: 'max.mustermann@yqni13.com',
                status: UserStatus.ACTIVE,
                flag: null,
                last_modified: testTimestamp,
                created_on: testTimestamp
            }];

            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(testTimestamp);

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/search`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn create, result: "SUCCESS"', async () => {
            const testParam_id = mockId.users.new[0];
            const testParam_dto: UsersCreateDTO = {
                email: 'new-user@test.com'
            };

            jest.spyOn(Utils, "generateUUID").mockReturnValue(testParam_id);
            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(testTimestamp);

            const testResult: UsersResponseDTO = {
                ...structuredClone(testParam_dto),
                user_id: testParam_id,
                status: UserStatus.ACTIVE,
                flag: null,
                last_modified: testTimestamp,
                created_on: testTimestamp
            };

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/create`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult)
        })

        test('Repository process fn update, result: "SUCCESS"', async () => {
            const testParam_id = mockId.users.valid[0];
            const testParam_dto: Partial<Users> = {
                email: 'user@test.com',
                status: UserStatus.ACTIVE,
                flag: Flag.WARNING
            };

            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(testTimestamp);

            const testResult = structuredClone(testParam_dto);
            Object.assign(testResult, {
                user_id: testParam_id,
                last_modified: testTimestamp,
                created_on: testTimestamp
            });

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .put(`${apiUrl}/update/${testParam_id}`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult)
        })
    })

    describe('Testing invalid fn calls', () => {

        const apiUrl = '/api/v1/users';

        describe('All routes, priority: express-validators, location: <params>', () => {

            describe('Route: GET/by-id/:id', () => {

                test('Params: <id>, validator: isUUID() by invalid id', async () => {
                    const testParam_id = 'invalid-id';
                    const testError = {
                        type: 'field',
                        value: testParam_id,
                        msg: 'support-invalid-entry#user_id',
                        path: 'id',
                        location: 'params'
                    }

                    const testResponse = await request(app)
                        .get(`${apiUrl}/by-id/${testParam_id}`);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([testError]);
                })
            })

            describe('Route: PUT/update/:id', () => {

                test('Params: <id>, validator: isUUID() by invalid id', async () => {
                    const testParam_id = 'invalid-id';
                    const testParam_dto: UsersUpdateDTO = {
                        email: 'new-user@test.com',
                        status: UserStatus.ACTIVE,
                        flag: null
                    };
                    const testError = {
                        type: 'field',
                        value: testParam_id,
                        msg: 'support-invalid-entry#user_id',
                        path: 'id',
                        location: 'params'
                    }

                    const testResponse = await request(app)
                        .put(`${apiUrl}/update/${testParam_id}`)
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

            describe('Route: PUT/update/:id', () => {

                const testData: Partial<Users> = {
                    email: 'updated-user@test.com',
                    status: UserStatus.BLACKLISTED
                };

                const testedParams = Object.keys(testData) as (keyof typeof testData)[];

                test.each(testedParams)('Params: <%s>, validator: notEmpty() by undefined', async (invalidParam) => {
                    const testParam_id = mockId.users.valid[0];
                    let mockParam_dto = structuredClone(testData);
                    delete mockParam_dto[invalidParam];

                    const testError = structuredClone(mockError);
                    testError['path'] = invalidParam;

                    const testResponse = await request(app)
                        .put(`${apiUrl}/update/${testParam_id}`)
                        .send(mockParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toContainEqual(testError);
                })
            })

            describe('Route: POST/create, priority: validateEmailUniqueness', () => {
                
                test('Params: <email> by existing "max.mustermann@yqni13.com" in db', async () => {
                    const testParam_dto: UsersCreateDTO = {
                        email: 'max.mustermann@yqni13.com'
                    };

                    const testError = [{
                        type: 'field',
                        value: testParam_dto.email,
                        msg: 'support-nonunique-email',
                        path: 'email',
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

            describe('Route: POST/create', () => {

                test('Params: <UsersCreateDTO>, validator: requirePayload by undefined', async () =>{
                    const testParam_dto = undefined;
                    const testError = structuredClone(mockError);

                    jest.spyOn(Utils, 'logError').mockImplementation();

                    const testResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(testParam_dto);

                    expect(testResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(testResponse.body.headers.data).toEqual([testError]);
                })
            })

            describe('Route: PUT/update/:id', () => {

                test('Params: <UsersUpdateDTO>, validator: requirePayload by undefined', async () =>{
                    const testParam_id = mockId.users.valid[0];
                    const testParam_dto = undefined;
                    const testError = structuredClone(mockError);

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