import { Users } from "../../../src/repositories/interfaces/users.entity.interface";
import * as Utils from "../../../src/utils/common.utils";
import { Flag } from "../../../src/utils/enums/flag.enum";
import { TicketStatus } from "../../../src/utils/enums/ticket-status.enum";
import { UserStatus } from "../../../src/utils/enums/user-status.enum";
import { Violation } from "../../../src/utils/enums/violations.enum";
import { secrets } from "../../../src/utils/secrets.utils";

describe('Utils tets, priority: common', () => {

    describe('Testing valid fn calls', () => {

        test('fn: mapKeyToHash', () => {
            const mockParam_key: string = secrets.TEST_APIKEY_RAW;

            const testFn = Utils.mapKeyToHash(mockParam_key);
            const expectResult: string = secrets.TEST_APIKEY_HASH;

            expect(testFn).toEqual(expectResult);
        })

        test('fn: getTimestampUTC, params: <timestamp>', () => {
            const mockParam_timestamp = new Date('2025-01-01 14:00:00.000+00');
            const testFn = Utils.getTimestampUTC(mockParam_timestamp);
            const expectResult: string = '2025-01-01T14:00:00.000Z';

            expect(testFn).toBe(expectResult);
        })

        test('fn: getDateUTC, params: <timestamp>', () => {
            const mockParam_timestamp = new Date('2025-01-01T00:00:01.000Z');
            const testFn = Utils.getDateUTC(mockParam_timestamp);
            const expectResult: string = '2025-01-01';

            expect(testFn).toBe(expectResult);
        })

        test('fn: getNextDayUTC, params: <timestamp>', () => {
            const mockParam_timestamp = new Date('2025-01-31T14:00:00.000Z');
            const testFn = Utils.getNextDayUTC(mockParam_timestamp);
            const expectResult: string = '2025-02-01T00:00:01.000Z';

            expect(testFn).toBe(expectResult);
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

        test('fn: getNextRankEnumValue, params: <Flag>, get FIRST in order', () => {
            const mockParam_enumObj = Flag;
            const mockParam_value = null;

            const mockResult = Flag.WARNING;
            const testFn = Utils.getNextRankEnumValue(mockParam_enumObj, mockParam_value);

            expect(testFn).toBe(mockResult);
        })

        test('fn: getNextRankEnumValue, params: <Violation> get NEXT in order', () => {
            const mockParam_enumObj = Violation;
            const mockParam_value = Violation.USERSFLAG;

            const mockResult = Violation.USERSSTATUS;
            const testFn = Utils.getNextRankEnumValue(mockParam_enumObj, mockParam_value);

            expect(testFn).toBe(mockResult);
        })

        test('fn: getNextRankEnumValue, params: <TicketStatus>, get LAST in order (same value)', () => {
            const mockParam_enumObj = TicketStatus;
            const mockParam_value = TicketStatus.PAUSED;

            const mockResult = TicketStatus.PAUSED;
            const testFn = Utils.getNextRankEnumValue(mockParam_enumObj, mockParam_value);

            expect(testFn).toBe(mockResult);
        })

        test('fn: getPreCharString, params: <text> = "demo-text", <endChar> = "-"', () => {
            const mockParam_text = 'demo-text';
            const mockParam_endChar = '-';
            const mockResult = 'demo';
            const testFn = Utils.getPreCharString(mockParam_text, mockParam_endChar);
            expect(testFn).toBe(mockResult);
        })

        test('fn: getPreCharString, params: <text> = "demo-text", <endChar> = "."', () => {
            const mockParam_text = 'demo-text';
            const mockParam_endChar = '.';
            const mockResult = '';
            const testFn = Utils.getPreCharString(mockParam_text, mockParam_endChar);
            expect(testFn).toBe(mockResult);
        })

        test('fn: getPostCharString, params: <text> = "demotext-", <startChar> = "-"', () => {
            const mockParam_text = 'demotext-';
            const mockParam_startChar = '-';
            const mockResult = '';
            const testFn = Utils.getPostCharString(mockParam_text, mockParam_startChar);
            expect(testFn).toBe(mockResult);
        })

        test('fn: getPostCharString, params: <text> = "-demotext", <startChar> = "-"', () => {
            const mockParam_text = '-demotext';
            const mockParam_startChar = '-';
            const mockResult = 'demotext';
            const testFn = Utils.getPostCharString(mockParam_text, mockParam_startChar);
            expect(testFn).toBe(mockResult);
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