import { DBConnection } from "../../../src/configs/db";
import * as Utils from "../../../src/utils/common.utils";
import * as MockUtils from "../../common.test-utils";
import { Users } from "../../../src/repositories/interfaces/users.entity.interface";
import { UserStatus } from "../../../src/utils/enums/user-status.enum";
import usersRepository from "../../../src/repositories/users.repository";
import { IRepoError } from "../../../src/repositories/interfaces/error.repository.interface";

jest.mock("../../../src/configs/db", () => {
    return {
        DBConnection: {
            getInstance: jest.fn()
        }
    }
});

const mockVar_timestamp = '2025-01-03T14:00:01.000'
const mockData: Users = {
    user_id: 'valid_users_test_id',
    email: 'user@test.com',
    status: UserStatus.ACTIVE,
    flag: null,
    last_modified: mockVar_timestamp,
    created_on: mockVar_timestamp
}

describe('Database tests table <users>, priority: findById', () => {

    describe('Testing valid fn calls', () => {

        let sql: string;
        beforeEach(() => {
            sql = `SELECT`;
        });

        test('Return data for existing entry, params: valid <id>', async () => {
            const mockResult: Users = structuredClone(mockData);
            const mockParam_id = mockResult.user_id;
            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await usersRepository.findById(mockParam_id);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining([mockParam_id])
            );
        })

        test('Return null for non-existing entry, params: non-existing <id>', async () => {
            const mockParam_id = 'invalid_users_test_id';
            const mockResult = null;
            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await usersRepository.findById(mockParam_id);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining([mockParam_id])
            );
        })
    })

    describe('Testing invalid fn calls', () => {
    
        test('Return IRepoError by catch-block', async () => {
            const mockParam_id = structuredClone(mockData.user_id);
            const mockErrorMsg = "DB ERROR ON SELECT QUERY, (Users TEST Repository, findById)";
            const mockResult = null;
            jest.spyOn(Utils, "logRepoError").mockReturnValue();
            const _ = MockUtils.mapMockDbClient(mockResult, mockErrorMsg);
            const testFn = await usersRepository.findById(mockParam_id);

            expect(testFn).toEqual<IRepoError>({
                method: 'support_users_findById',
                error: expect.any(Error)
            });
            expect((testFn as IRepoError).error.message).toBe(mockErrorMsg);
        })
    })
})

describe('Database tests table <users>, priority: findAll', () => {

    describe('Testing valid fn calls', () => {

        test('Return data for multiple existing entries', async () => {
            const mockData_entry0 = structuredClone(mockData);
            const mockData_entry1 = structuredClone(mockData_entry0);
            mockData_entry1['user_id'] = 'another_valid_users_test_id';
            mockData_entry1['email'] = 'user2@test.com';
            const mockResult: Users[] = [mockData_entry0, mockData_entry1];

            const mockErrorMsg = undefined;
            const mockExpectArray = true;
            const mockClient = MockUtils.mapMockDbClient(mockResult, mockErrorMsg, mockExpectArray);
            const sql = `SELECT * FROM users ORDER BY user_id ASC FETCH FIRST 100 ROWS ONLY;`;
            const testFn = await usersRepository.findAll();

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(sql);
        });
    })

    describe('Testing invalid fn calls', () => {

        test('Return IRepoError by catch-block', async () => {
            const mockErrorMsg = "DB ERROR ON SELECT QUERY, (Users TEST Repository, findAll)";
            const mockResult = null;
            jest.spyOn(Utils, "logRepoError").mockReturnValue();
            const _ = MockUtils.mapMockDbClient(mockResult, mockErrorMsg);
            const testFn = await usersRepository.findAll();

            expect(testFn).toEqual<IRepoError>({
                method: 'support_users_findAll',
                error: expect.any(Error)
            });
            expect((testFn as IRepoError).error.message).toBe(mockErrorMsg);
        })
    })
})

describe('Database tests table <clients>, priority: create', () => {

    describe('Testing valid fn calls', () => {

        let sql: string;
        let mockParam_entity: Users;
        beforeEach(() => {
            sql = `INSERT`;
            mockParam_entity = {
                user_id: '92f22e89-237b-4775-b170-1df288acad54',
                email: 'new-user@test.com',
                status: UserStatus.ACTIVE,
                flag: null,
                last_modified: mockVar_timestamp,
                created_on: mockVar_timestamp
            }
        });

        test('Return data for created entry, params: <name> = "testclient"', async () => {
            let mockValues: any[] = [];
            Object.values(mockParam_entity).forEach((value) => {
                mockValues.push(value);
            });

            const mockResult: Users = structuredClone(mockParam_entity);
            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await usersRepository.create(mockParam_entity);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining(mockValues)
            );
        })

        test('Return null for non-existing entry by non-unique email', async () => {
            let testParam_entity = structuredClone(mockParam_entity);
            testParam_entity['email'] = 'user@test.com';
            let mockValues: any[] = [];
            Object.values(testParam_entity).forEach((value) => {
                mockValues.push(value);
            });

            const mockResult = null;

            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await usersRepository.create(testParam_entity);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining(mockValues)
            );
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Return IRepoError by catch-block', async () => {
            const mockParam_entity: Users = {
                user_id: '92f22e89-237b-4775-b170-1df288acad54',
                email: 'new-user@test.com',
                status: UserStatus.ACTIVE,
                flag: null,
                last_modified: mockVar_timestamp,
                created_on: mockVar_timestamp
            }
            const mockErrorMsg = "DB ERROR ON SELECT QUERY, (Users TEST Repository, create)";
            const mockResult = null;
            jest.spyOn(Utils, "logRepoError").mockReturnValue();
            const _ = MockUtils.mapMockDbClient(mockResult, mockErrorMsg);
            const testFn = await usersRepository.create(mockParam_entity);

            expect(testFn).toEqual<IRepoError>({
                method: 'support_users_create',
                error: expect.any(Error)
            });
            expect((testFn as IRepoError).error.message).toBe(mockErrorMsg);
        })
    })
})

describe('Database tests table <meta>, priority: udpate', () => {

    describe('Testing valid fn calls', () => {

        let sql: string;
        let mockParam_data: Partial<Users>;
        let mockValues: any[];
        beforeEach(() => {
            sql = `UPDATE users`; // Keep it simple if it isn't essential.
            mockParam_data = {
                email: 'user@test.com',
                status: UserStatus.BLACKLISTED,
                flag: null,
                last_modified: structuredClone(mockData.last_modified)
            };
            mockValues = [];
        });

        test('Return data of changed entry by valid id', async () => {
            const mockParam_id = structuredClone(mockData.user_id);
            Object.values(mockParam_data).forEach((val) => {
                mockValues.push(val);
            });
            mockValues.push(mockParam_id);
            const mockResult: Users = structuredClone(mockData);
            mockResult['status'] = UserStatus.BLACKLISTED;

            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await usersRepository.update(mockParam_id, mockParam_data);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining(mockValues)
            );
        })

        test('Return null for non-existing entry by invalid id', async () => {
            const mockParam_id = 'invalid_users_test_id';
            Object.values(mockParam_data).forEach((val) => {
                mockValues.push(val);
            });
            mockValues.push(mockParam_id);

            const mockResult = null;

            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await usersRepository.update(mockParam_id, mockParam_data);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining(mockValues)
            );
        })
    })

    describe('Testing invalid fn calls', () => {

        let mockParam_data: Partial<Users>;
        beforeEach(() => {
            mockParam_data = {
                email: 'user@test.com',
                status: UserStatus.BLACKLISTED,
                flag: null,
                last_modified: structuredClone(mockData.last_modified)
            };
        });

        test('Return IRepoError by catch-block', async () => {
            const mockParam_id = structuredClone(mockData.user_id);
            const mockErrorMsg = "DB ERROR ON UPDATE QUERY, (Users TEST Repository, update)";
            const mockResult = null;
            jest.spyOn(Utils, "logRepoError").mockReturnValue();
            const _ = MockUtils.mapMockDbClient(mockResult, mockErrorMsg);
            const testFn = await usersRepository.update(mockParam_id, mockParam_data);

            expect(testFn).toEqual<IRepoError>({
                method: 'support_users_update',
                error: expect.any(Error)
            });
            expect((testFn as IRepoError).error.message).toBe(mockErrorMsg);
        })
    })
})