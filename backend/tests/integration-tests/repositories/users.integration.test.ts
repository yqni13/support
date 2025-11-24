import { NextFunction, Request, Response } from "express";
import * as Utils from '../../../src/utils/common.utils';
import request from 'supertest';
import { ErrorStatusCodes } from '../../../src/utils/errorStatusCodes.utils';
import { DBTestSetup } from "../db-container.setup";
import { runMigrations } from '../../db-migrations.setup';
import { UsersCreateUpdateDTO, UsersFilterDTO, UsersResponseDTO } from "../../../src/dtos/users.dto";
import { Users } from "../../../src/repositories/interfaces/users.entity.interface";
import { UserStatus } from "../../../src/utils/enums/user-status.enum";
import { Flag } from "../../../src/utils/enums/flag.enum";
import { default as mockId } from "../../mock-data/id.mock-data.json";
import { CommonExceptionMessage } from "../../../src/utils/enums/common-exception-messages.enum";

jest.mock('../../../src/middleware/auth.admin.middleware', () => ({
    authAdmin: jest.fn(() =>  (req: Request, res: Response, next: NextFunction) => next())
}));

import app from '../../../src/app';

jest.setTimeout(60000);
const mockTimestamp = '2025-01-01T14:00:03.000Z';

describe('Integration test (repository specific), priority: Users', () => {

    let dbTestSetup: DBTestSetup;
    let apiUrl: string;
    beforeAll(async () => {
        dbTestSetup = new DBTestSetup();
        await dbTestSetup.init();
        await runMigrations();
        apiUrl = '/api/v1/users';
    });

    beforeEach(async () => {
        // Clean tables before each test to fill test data individually.
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
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            };

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/by-id/${testParam_id}`);

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
                last_modified: mockTimestamp,
                created_on: mockTimestamp
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
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            }];

            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(mockTimestamp);

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
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            }];

            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(mockTimestamp);

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/search`)
                .send(testParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn create, result: "SUCCESS"', async () => {
            const mockParam_id = mockId.users.new[0];
            const mockParam_dto: Partial<Users> = {
                email: 'new-user@test.com',
                status: UserStatus.ACTIVE,
                flag: null
            };

            jest.spyOn(Utils, "generateUUID").mockReturnValue(mockParam_id);
            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(mockTimestamp);

            const testResult = structuredClone(mockParam_dto);
            Object.assign(testResult, {
                user_id: mockParam_id,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            });

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/create`)
                .send(mockParam_dto);

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

            // Mock Utils generated timeStamp for easy comparison.
            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(mockTimestamp);

            const testResult = structuredClone(testParam_dto);
            Object.assign(testResult, {
                user_id: testParam_id,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
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

            describe('Route: GET/by-id/:id', () => {

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
            })

            describe('Route: PUT/update/:id', () => {

                test('Params: <id>, validator: notEmpty by undefined', async () => {
                    const mockParam_id = '%20';
                    const mockParam_dto: UsersCreateUpdateDTO = {
                        email: 'new-user@test.com',
                        status: UserStatus.ACTIVE,
                        flag: null
                    };
    
                    const testError = structuredClone(mockError);
                    testError['path'] = 'id';
    
                    const mockResponse = await request(app)
                        .put(`${apiUrl}/update/${mockParam_id}`)
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

            describe('Route: POST/create', () => {

                const mockData: Partial<Users> = {
                    email: 'new-user@test.com',
                    status: UserStatus.ACTIVE
                };

                const testedParams = Object.keys(mockData) as (keyof typeof mockData)[];

                test.each(testedParams)('Params: <%s>, validator: notEmpty by undefined', async (invalidParam) => {
                    let mockParam_dto = structuredClone(mockData);
                    delete mockParam_dto[invalidParam];

                    const testError = structuredClone(mockError);
                    testError['path'] = invalidParam;

                    const mockResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(mockParam_dto);

                    expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(mockResponse.body.headers.data).toContainEqual(testError);
                })
            })

            describe('Route: PUT/update/:id', () => {

                const mockData: Partial<Users> = {
                    email: 'updated-user@test.com',
                    status: UserStatus.BLACKLISTED
                };

                const testedParams = Object.keys(mockData) as (keyof typeof mockData)[];

                test.each(testedParams)('Params: <%s>, validator: notEmpty by undefined', async (invalidParam) => {
                    const mockParam_id = mockId.users.valid[0];
                    let mockParam_dto = structuredClone(mockData);
                    delete mockParam_dto[invalidParam];

                    const testError = structuredClone(mockError);
                    testError['path'] = invalidParam;

                    const mockResponse = await request(app)
                        .put(`${apiUrl}/update/${mockParam_id}`)
                        .send(mockParam_dto);

                    expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(mockResponse.body.headers.data).toContainEqual(testError);
                })
            })

            describe('Route: POST/create, priority: validateEmailUniqueness', () => {
                
                test('Params: <email> by existing "max.mustermann@yqni13.com" in db', async () => {
                    const mockParam_dto: Partial<Users> = {
                        email: 'max.mustermann@yqni13.com',
                        status: UserStatus.ACTIVE,
                        flag: null
                    };

                    const testError = [{
                        type: 'field',
                        value: mockParam_dto.email,
                        msg: 'support-nonunique-email',
                        path: 'email',
                        location: 'body'
                    }];

                    await dbTestSetup.addTestData();
                    const mockResponse = await request(app)
                        .post(`${apiUrl}/create`)
                        .send(mockParam_dto);

                    expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                    expect(mockResponse.body.headers.data).toStrictEqual(testError);
                })
            })
        })
    })
})