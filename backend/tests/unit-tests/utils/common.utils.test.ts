import { Users } from "../../../src/repositories/interfaces/users.entity.interface";
import * as Utils from "../../../src/utils/common.utils";
import { UserStatus } from "../../../src/utils/enums/user-status.enum";
import { secrets } from "../../../src/utils/secrets.utils";

describe('Utils tets, priority: common', () => {

    describe('Testing valid fn calls', () => {

        test('fn: mapKeyToHash', () => {
            const mockParam_key: string = secrets.TEST_APIKEY_RAW;

            const testFn = Utils.mapKeyToHash(mockParam_key);
            const expectResult: string = secrets.TEST_APIKEY_HASH;

            expect(testFn).toEqual(expectResult);
        })

        test('fn: isEmptyObj', () => {
            const mockParam_obj = {};
            const testFn = Utils.isEmptyObj(mockParam_obj);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('fn: mapObjTimestamps', () => {
            const mockParam_data: Users = {
                user_id: 'valid_users_test_id',
                email: 'user@test.com',
                status: UserStatus.ACTIVE,
                flag: null,
                last_modified: '2025-01-01 14:00:03.000+01',
                created_on: '2025-01-01 14:00:03.000+01'
            };
            const mockParam_timeMapTargets = ['last_modified', 'created_on'];

            const testFn = Utils.mapObjTimestamps(mockParam_data, mockParam_timeMapTargets);
            const expectResult: Users = {
                user_id: 'valid_users_test_id',
                email: 'user@test.com',
                status: UserStatus.ACTIVE,
                flag: null,
                last_modified: '2025-01-01T13:00:03.000Z',
                created_on: '2025-01-01T13:00:03.000Z'
            };

            expect(testFn).toStrictEqual(expectResult);
        })

        test('fn: mapArrayTimestamps', () => {
            const mockParam_data: Users[] = [
                {
                    user_id: 'valid_users_test_id_0',
                    email: 'user0@test.com',
                    status: UserStatus.ACTIVE,
                    flag: null,
                    last_modified: '2025-01-01 14:00:03.000+01',
                    created_on: '2025-01-01 14:00:03.000+01'
                },
                {
                    user_id: 'valid_users_test_id_1',
                    email: 'user1@test.com',
                    status: UserStatus.ACTIVE,
                    flag: null,
                    last_modified: '2025-01-01 14:00:03.000+01',
                    created_on: '2025-01-01 14:00:03.000+01'
                }
            ];
            const mockParam_timeMapTargets = ['last_modified', 'created_on'];

            const testFn = Utils.mapArrayTimestamps(mockParam_data, mockParam_timeMapTargets);
            const expectResult: Users[] = [
                {
                    user_id: 'valid_users_test_id_0',
                    email: 'user0@test.com',
                    status: UserStatus.ACTIVE,
                    flag: null,
                    last_modified: '2025-01-01T13:00:03.000Z',
                    created_on: '2025-01-01T13:00:03.000Z'
                },
                {
                    user_id: 'valid_users_test_id_1',
                    email: 'user1@test.com',
                    status: UserStatus.ACTIVE,
                    flag: null,
                    last_modified: '2025-01-01T13:00:03.000Z',
                    created_on: '2025-01-01T13:00:03.000Z'
                }
            ];

            expect(testFn).toStrictEqual(expectResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('fn: isEmptyObj, result as null', () => {
            const mockParam_obj = null;
            const testFn = Utils.isEmptyObj(mockParam_obj);
            const expectResult = false;

            expect(testFn).toBe(expectResult);
        })

        test('fn: isEmptyObj, result as undefined', () => {
            const mockParam_obj = undefined;
            const testFn = Utils.isEmptyObj(mockParam_obj);
            const expectResult = false;

            expect(testFn).toBe(expectResult);
        })

        test('fn: isEmptyObj, result as filled obj', () => {
            const mockParam_obj = { test: 'test' };
            const testFn = Utils.isEmptyObj(mockParam_obj);
            const expectResult = false;

            expect(testFn).toBe(expectResult);
        })

        test('fn: isEmptyObj, result as empty array', () => {
            const mockParam_obj: any[] = [];
            const testFn = Utils.isEmptyObj(mockParam_obj);
            const expectResult = false;

            expect(testFn).toBe(expectResult);
        })

        test('fn: isEmptyObj, result as array with empty obj', () => {
            const mockParam_obj = [{}];
            const testFn = Utils.isEmptyObj(mockParam_obj);
            const expectResult = false;

            expect(testFn).toBe(expectResult);
        })

        test('fn: isEmptyObj, result as array with filled obj', () => {
            const mockParam_obj = [ { test: 'test' } ];
            const testFn = Utils.isEmptyObj(mockParam_obj);
            const expectResult = false;

            expect(testFn).toBe(expectResult);
        })
    })
})