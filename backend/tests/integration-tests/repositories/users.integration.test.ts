import { NextFunction, Request, Response } from "express";
import * as Utils from '../../../src/utils/common.utils';
import request from 'supertest';
import app from '../../../src/app';
import { ErrorStatusCodes } from '../../../src/utils/errorStatusCodes.utils';
import { DBTestSetup } from "../db-container.setup";
import { runMigrations } from '../../db-migrations.setup';
import { UsersResponseDTO } from "../../../src/dtos/users.dto";
import { Users } from "../../../src/repositories/interfaces/users.entity.interface";
import { UserStatus } from "../../../src/utils/enums/user-status.enum";
import { Flag } from "../../../src/utils/enums/flag.enum";


jest.mock('../../../src/middleware/auth.middleware', () => ({
    authAdmin: jest.fn(() =>  (req: Request, res: Response, next: NextFunction) => next())
}));

jest.setTimeout(60000);

describe('Integration test (repository specific), priority: Users', () => {

    describe('Testing valid fn calls', () => {

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

        test('Repository process fn findById, result: "SUCCESS"', async () => {
            const testParam_id = '87e4d6e3-d678-4de0-8806-e89135cbd38c';
            const mockTimeStamp = '2025-01-01T13:00:03.000';
            const testResult: UsersResponseDTO = {
                user_id: testParam_id,
                email: 'max.mustermann@yqni13.com',
                status: UserStatus.ACTIVE,
                flag: null,
                last_modified: mockTimeStamp,
                created_on: mockTimeStamp
            };

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/by-id/${testParam_id}`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn findAll, result: "SUCCESS"', async () => {
            const testParam_id = '87e4d6e3-d678-4de0-8806-e89135cbd38c';
            const mockTimeStamp = '2025-01-01T13:00:03.000';
            const testResult: Users[] = [{
                user_id: testParam_id,
                email: 'max.mustermann@yqni13.com',
                status: UserStatus.ACTIVE,
                flag: null,
                last_modified: mockTimeStamp,
                created_on: mockTimeStamp
            }];

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .get(`${apiUrl}/all`);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult);
        })

        test('Repository process fn create, result: "SUCCESS"', async () => {
            const mockParam_id = '92f22e89-237b-4775-b170-1df288acad54';
            const mockTimeStamp = '2025-02-04T14:00:03.000';
            const mockParam_dto: Partial<Users> = {
                email: 'new-user@test.com',
                status: UserStatus.ACTIVE,
                flag: null
            };

            jest.spyOn(Utils, "generateUUID").mockReturnValue(mockParam_id);
            jest.spyOn(Utils, "getCustomUTCString").mockReturnValue(mockTimeStamp);

            const testResult = structuredClone(mockParam_dto);
            Object.assign(testResult, {
                user_id: mockParam_id,
                last_modified: mockTimeStamp,
                created_on: mockTimeStamp
            });

            await dbTestSetup.addTestData();
            const testResponse = await request(app)
                .post(`${apiUrl}/create`)
                .send(mockParam_dto);

            expect(testResponse.statusCode).toBe(200);
            expect(testResponse.body).toMatchObject(testResult)
        })

        test('Repository process fn update, result: "SUCCESS"', async () => {
            const testParam_id = '87e4d6e3-d678-4de0-8806-e89135cbd38c';
            const mockTimeStamp = '2025-02-04T14:00:03.000';
            const testParam_dto: Partial<Users> = {
                email: 'user@test.com',
                status: UserStatus.ACTIVE,
                flag: Flag.WARNING,
                last_modified: mockTimeStamp
            };

            // Mock Utils generated timeStamp for easy comparison.
            jest.spyOn(Utils, "getCustomUTCString").mockReturnValue(mockTimeStamp);

            const testResult = structuredClone(testParam_dto);
            Object.assign(testResult, {
                user_id: testParam_id,
                created_on: mockTimeStamp
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

        describe('Route: POST/create, priority: express-validators', () => {

            const mockData: Partial<Users> = {
                email: 'new-user@test.com',
                status: UserStatus.ACTIVE
            };

            // "keyof typeof mockData" creates Union-Types of keys to ensure all properties are valid.
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

        describe('Route: PUT/update, priority: express-validators', () => {

            const mockData: Partial<Users> = {
                email: 'updated-user@test.com',
                status: UserStatus.BLACKLISTED
            };

            // "keyof typeof mockData" creates Union-Types of keys to ensure all properties are valid.
            const testedParams = Object.keys(mockData) as (keyof typeof mockData)[];

            test.each(testedParams)('Params: <%s>, validator: notEmpty by undefined', async (invalidParam) => {
                const mockParam_id = '87e4d6e3-d678-4de0-8806-e89135cbd38c';
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
    })
})