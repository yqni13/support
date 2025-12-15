import { DBConnection } from "../../../src/configs/db";
import * as Utils from "../../../src/utils/common.utils";
import * as MockUtils from "../../common.test-utils";
import { Users } from "../../../src/repositories/interfaces/users.entity.interface";
import { UserStatus } from "../../../src/utils/enums/user-status.enum";
import usersRepository from "../../../src/repositories/users.repository";
import { UsersUpdateDTO } from "../../../src/dtos/users.dto";
import { DBQueryErrorException } from "../../../src/utils/exceptions/db.exception";

jest.mock("../../../src/configs/db", () => {
    return {
        DBConnection: {
            getInstance: jest.fn()
        }
    }
});

const mockTimestamp = '2025-01-03T14:00:03.000Z';
const mockData: Users = {
    user_id: 'valid_users_test_id',
    email: 'user@test.com',
    status: UserStatus.ACTIVE,
    flag: null,
    last_modified: mockTimestamp,
    created_on: mockTimestamp
};
const expectExceptionResult = DBQueryErrorException;
const mockBoolean = false;

describe('Database tests table <users>, priority: findById', () => {

    describe('Testing valid fn calls', () => {

        let sql: string;
        beforeEach(() => {
            sql = `SELECT`;
        });

        test('Return data for existing entry, params: valid <id>', async () => {
            const mockResult: Users = structuredClone(mockData);
            const mockParam_id = 'valid_users_test_id';
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
            const mockParam_id = 'non-existing_users_test_id';
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

        test('Throw DBQueryErrorException by catch-block', async () => {
            const mockParam_id = 'error_users_test_id';
            const mockErrorMsg = "DB ERROR ON SELECT QUERY";
            const mockResult = null;
            jest.spyOn(Utils, "logError").mockReturnValue();
            const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

            await expect(() => usersRepository.findById(mockParam_id))
                .rejects.toThrow(expectExceptionResult);
        })
    })
})

describe('Database tests table <users>, priority: findByEmail', () => {

    describe('Testing valid fn calls', () => {

        let sql: string;
        beforeEach(() => {
            sql = `SELECT`;
        });

        test('Return data for existing entry, params: valid <email>', async () => {
            const mockResult: Users = structuredClone(mockData);
            const mockParam_email = mockResult.email;
            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await usersRepository.findByEmail(mockParam_email);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining([mockParam_email])
            );
        })

        test('Return null for non-existing entry, params: non-existing <email>', async () => {
            const mockParam_email = 'non-existing-user@test.com';
            const mockResult = null;
            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await usersRepository.findByEmail(mockParam_email);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining([mockParam_email])
            );
        })
    })

    describe('Testing invalid fn calls', () => {
    
        test('Throw DBQueryErrorException by catch-block', async () => {
            const mockParam_email = structuredClone(mockData.email);
            const mockErrorMsg = "DB ERROR ON SELECT QUERY";
            const mockResult = null;
            jest.spyOn(Utils, "logError").mockReturnValue();
            const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

            await expect(() => usersRepository.findByEmail(mockParam_email))
                .rejects.toThrow(expectExceptionResult);
        })
    })
})

describe('Database tests table <users>, priority: findAll', () => {

    describe('Testing valid fn calls', () => {

        let sql: string;
        beforeEach(() => {
            sql = `SELECT * FROM users ORDER BY user_id ASC FETCH FIRST 100 ROWS ONLY;`;
        });

        test('Return data for multiple existing entries', async () => {
            const mockData_entry0 = structuredClone(mockData);
            const mockData_entry1 = structuredClone(mockData_entry0);
            mockData_entry1['user_id'] = 'another_valid_users_test_id';
            mockData_entry1['email'] = 'user1@test.com';
            const mockResult: Users[] = [mockData_entry0, mockData_entry1];

            const mockErrorMsg = undefined;
            const mockExpectArray = true;
            const mockClient = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg, mockExpectArray);
            const testFn = await usersRepository.findAll();

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(sql);
        });

        test('Return null for non-existing entry', async () => {
            const mockResult = null;

            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await usersRepository.findAll();

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(sql);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Throw DBQueryErrorException by catch-block', async () => {
            const mockErrorMsg = "DB ERROR ON SELECT QUERY";
            const mockResult = null;
            jest.spyOn(Utils, "logError").mockReturnValue();
            const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

            await expect(() => usersRepository.findAll())
                .rejects.toThrow(expectExceptionResult);
        })
    })
})

describe('Database tests table <users>, priority: findByFilter', () => {

    describe('Testing valid fn calls', () => {

        let sql: string;
        beforeEach(() => {
            sql = `SELECT`;
        });

        test('Return data for existing entry, params: valid <email>', async () => {
            const mockParam_dto = { email: structuredClone(mockData.email) };
            const mockValues = [mockParam_dto.email];
            const mockResult: Users[] = [structuredClone(mockData)];

            const mockErrorMsg = undefined;
            const mockExpectArray = true;
            const mockClient = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg, mockExpectArray);
            const testFn = await usersRepository.findByFilter(mockParam_dto);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining(mockValues)
            );
        })

        test('Return null for non-existing entry, params: non-existing <email>', async () => {
            const mockParam_dto = { email: ['non-existing-user0@test.com', 'non-existing-user1@test.com'] };
            const mockValues = mockParam_dto.email;
            const mockResult = null;

            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await usersRepository.findByFilter(mockParam_dto);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining(mockValues)
            );
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Throw DBQueryErrorException by catch-block', async () => {
            const mockParam_dto = { email: 'error-user@test.com', status: UserStatus.ACTIVE };
            const mockErrorMsg = "DB ERROR ON SELECT QUERY";
            const mockResult = null;
            jest.spyOn(Utils, "logError").mockReturnValue();
            const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

            await expect(() => usersRepository.findByFilter(mockParam_dto))
                .rejects.toThrow(expectExceptionResult);
        })
    })
})

describe('Database tests table <users>, priority: create', () => {

    let sql: string;
    let mockParam_entity: Users;
    beforeEach(() => {
        sql = 'INSERT';
        mockParam_entity = {
            user_id: 'valid_users_test_id',
            email: 'new-user@test.com',
            status: UserStatus.ACTIVE,
            flag: null,
            last_modified: mockTimestamp,
            created_on: mockTimestamp
        }
    })

    describe('Testing valid fn calls', () => {

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
    })

    describe('Testing invalid fn calls', () => {

        test('Throw DBQueryErrorException by catch-block', async () => {
            const mockErrorMsg = "DB ERROR ON INSERT QUERY";
            const mockResult = null;
            jest.spyOn(Utils, "logError").mockReturnValue();
            const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

            await expect(() => usersRepository.create(mockParam_entity))
                .rejects.toThrow(expectExceptionResult);
        })
    })
})

describe('Database tests table <users>, priority: udpate', () => {

    let sql: string;
    let mockParam_dto: UsersUpdateDTO;
    let mockValues: any[];
    beforeEach(() => {
        sql = `UPDATE`;
        mockParam_dto = {
            email: 'user@test.com',
            status: UserStatus.BLACKLISTED,
            flag: null,
            last_modified: mockTimestamp
        };
        mockValues = [];
    });

    describe('Testing valid fn calls', () => {

        test('Return data of changed entry by valid id', async () => {
            const mockParam_id = 'valid_users_test_id';
            Object.values(mockParam_dto).forEach((val) => {
                mockValues.push(val);
            });
            mockValues.push(mockParam_id);
            const mockResult: Users = structuredClone(mockData);
            mockResult['status'] = UserStatus.BLACKLISTED;

            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await usersRepository.update(mockParam_id, mockParam_dto);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining(mockValues)
            );
        })

        test('Return null for no entries by non-existing id', async () => {
            const mockParam_id = 'non-existing_users_test_id';
            Object.values(mockParam_dto).forEach((val) => {
                mockValues.push(val);
            });
            mockValues.push(mockParam_id);

            const mockResult = null;

            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await usersRepository.update(mockParam_id, mockParam_dto);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining(mockValues)
            );
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Throw DBQueryErrorException by catch-block', async () => {
            const mockParam_id = 'error_users_test_id';
            const mockErrorMsg = "DB ERROR ON UPDATE QUERY";
            const mockResult = null;
            jest.spyOn(Utils, "logError").mockReturnValue();
            const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

            await expect(() => usersRepository.update(mockParam_id, mockParam_dto))
                .rejects.toThrow(expectExceptionResult);
        })
    })
})