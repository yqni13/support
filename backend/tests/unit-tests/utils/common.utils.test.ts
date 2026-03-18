import { Users, UsersId } from "../../../src/repositories/interfaces/users.entity.interface";
import * as CommonUtils from "../../../src/utils/common.utils";
import { Flag } from "../../../src/utils/enums/flag.enum";
import { TicketStatus } from "../../../src/utils/enums/ticket-status.enum";
import { UserStatus } from "../../../src/utils/enums/user-status.enum";
import { Violation } from "../../../src/utils/enums/violations.enum";
import { secrets } from "../../../src/utils/secrets.utils";
import { default as mockId } from "../../mock-data/id.mock-data.json";

describe('Unit-tests (utils), priority: synonym CommonUtils', () => {

    const mockValidUserId = mockId.users.valid[0] as UsersId;

    describe('Testing valid fn calls', () => {

        test('Fn mapKeyToHash()', () => {
            const mockParam_key: string = secrets.TEST_APIKEY_RAW;

            const testFn = CommonUtils.mapKeyToHash(mockParam_key);
            const expectResult: string = secrets.TEST_APIKEY_HASH;

            expect(testFn).toEqual(expectResult);
        })

        test('Fn getTimestampUTC(), params: <timestamp>', () => {
            const mockParam_timestamp = new Date('2025-01-01 14:00:00.000+00');
            const testFn = CommonUtils.getTimestampUTC(mockParam_timestamp);
            const expectResult: string = '2025-01-01T14:00:00.000Z';

            expect(testFn).toBe(expectResult);
        })

        test('Fn getDateUTC(), params: <timestamp>', () => {
            const mockParam_timestamp = new Date('2025-01-01T00:00:01.000Z');
            const testFn = CommonUtils.getDateUTC(mockParam_timestamp);
            const expectResult: string = '2025-01-01';

            expect(testFn).toBe(expectResult);
        })

        test('Fn getNextDayUTC(), params: <timestamp>', () => {
            const mockParam_timestamp = new Date('2025-01-31T14:00:00.000Z');
            const testFn = CommonUtils.getNextDayUTC(mockParam_timestamp);
            const expectResult: string = '2025-02-01T00:00:01.000Z';

            expect(testFn).toBe(expectResult);
        })

        test('Fn isEmptyObj()', () => {
            const mockParam_obj = {};
            const testFn = CommonUtils.isEmptyObj(mockParam_obj);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('Fn mapObjTimestamps()', () => {
            const mockParam_data: Users = {
                user_id: mockValidUserId,
                email: 'user@test.com',
                status: UserStatus.ACTIVE,
                flag: null,
                last_modified: '2025-01-01 14:00:03.000+01',
                created_on: '2025-01-01 14:00:03.000+01'
            };
            const mockParam_timeMapTargets = ['last_modified', 'created_on'];

            const testFn = CommonUtils.mapObjTimestamps(mockParam_data, mockParam_timeMapTargets);
            const expectResult: Users = {
                user_id: mockValidUserId,
                email: 'user@test.com',
                status: UserStatus.ACTIVE,
                flag: null,
                last_modified: '2025-01-01T13:00:03.000Z',
                created_on: '2025-01-01T13:00:03.000Z'
            };

            expect(testFn).toStrictEqual(expectResult);
        })

        test('Fn mapArrayTimestamps()', () => {
            const mockParam_data: Users[] = [
                {
                    user_id: mockValidUserId,
                    email: 'user0@test.com',
                    status: UserStatus.ACTIVE,
                    flag: null,
                    last_modified: '2025-01-01 14:00:03.000+01',
                    created_on: '2025-01-01 14:00:03.000+01'
                },
                {
                    user_id: mockId.users.new[0] as UsersId,
                    email: 'user1@test.com',
                    status: UserStatus.ACTIVE,
                    flag: null,
                    last_modified: '2025-01-01 14:00:03.000+01',
                    created_on: '2025-01-01 14:00:03.000+01'
                }
            ];
            const mockParam_timeMapTargets = ['last_modified', 'created_on'];

            const testFn = CommonUtils.mapArrayTimestamps(mockParam_data, mockParam_timeMapTargets);
            const expectResult: Users[] = [
                {
                    user_id: mockValidUserId,
                    email: 'user0@test.com',
                    status: UserStatus.ACTIVE,
                    flag: null,
                    last_modified: '2025-01-01T13:00:03.000Z',
                    created_on: '2025-01-01T13:00:03.000Z'
                },
                {
                    user_id: mockId.users.new[0] as UsersId,
                    email: 'user1@test.com',
                    status: UserStatus.ACTIVE,
                    flag: null,
                    last_modified: '2025-01-01T13:00:03.000Z',
                    created_on: '2025-01-01T13:00:03.000Z'
                }
            ];

            expect(testFn).toStrictEqual(expectResult);
        })

        test('Fn getNextRankEnumValue(), params: <Flag>, get FIRST in order', () => {
            const mockParam_enumObj = Flag;
            const mockParam_value = null;

            const mockResult = Flag.WARNING;
            const testFn = CommonUtils.getNextRankEnumValue(mockParam_enumObj, mockParam_value);

            expect(testFn).toBe(mockResult);
        })

        test('Fn getNextRankEnumValue(), params: <Violation> get NEXT in order', () => {
            const mockParam_enumObj = Violation;
            const mockParam_value = Violation.USERSFLAG;

            const mockResult = Violation.USERSSTATUS;
            const testFn = CommonUtils.getNextRankEnumValue(mockParam_enumObj, mockParam_value);

            expect(testFn).toBe(mockResult);
        })

        test('Fn getNextRankEnumValue(), params: <TicketStatus>, get LAST in order (same value)', () => {
            const mockParam_enumObj = TicketStatus;
            const mockParam_value = TicketStatus.CANCEL;

            const mockResult = TicketStatus.CANCEL;
            const testFn = CommonUtils.getNextRankEnumValue(mockParam_enumObj, mockParam_value);

            expect(testFn).toBe(mockResult);
        })

        test('Fn getPreCharString(), params: <text> = "demo-text", <endChar> = "-"', () => {
            const mockParam_text = 'demo-text';
            const mockParam_endChar = '-';
            const mockResult = 'demo';
            const testFn = CommonUtils.getPreCharString(mockParam_text, mockParam_endChar);
            expect(testFn).toBe(mockResult);
        })

        test('Fn getPreCharString(), params: <text> = "demo-text", <endChar> = "."', () => {
            const mockParam_text = 'demo-text';
            const mockParam_endChar = '.';
            const mockResult = '';
            const testFn = CommonUtils.getPreCharString(mockParam_text, mockParam_endChar);
            expect(testFn).toBe(mockResult);
        })

        test('Fn getPostCharString(), params: <text> = "demotext-", <startChar> = "-"', () => {
            const mockParam_text = 'demotext-';
            const mockParam_startChar = '-';
            const mockResult = '';
            const testFn = CommonUtils.getPostCharString(mockParam_text, mockParam_startChar);
            expect(testFn).toBe(mockResult);
        })

        test('Fn getPostCharString(), params: <text> = "-demotext", <startChar> = "-"', () => {
            const mockParam_text = '-demotext';
            const mockParam_startChar = '-';
            const mockResult = 'demotext';
            const testFn = CommonUtils.getPostCharString(mockParam_text, mockParam_startChar);
            expect(testFn).toBe(mockResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Fn isEmptyObj(), result: null', () => {
            const mockParam_obj = null;
            const testFn = CommonUtils.isEmptyObj(mockParam_obj);
            const expectResult = false;

            expect(testFn).toBe(expectResult);
        })

        test('Fn isEmptyObj(), result: undefined', () => {
            const mockParam_obj = undefined;
            const testFn = CommonUtils.isEmptyObj(mockParam_obj);
            const expectResult = false;

            expect(testFn).toBe(expectResult);
        })

        test('Fn isEmptyObj(), result: filled obj', () => {
            const mockParam_obj = { test: 'test' };
            const testFn = CommonUtils.isEmptyObj(mockParam_obj);
            const expectResult = false;

            expect(testFn).toBe(expectResult);
        })

        test('Fn isEmptyObj(), result: empty array', () => {
            const mockParam_obj: any[] = [];
            const testFn = CommonUtils.isEmptyObj(mockParam_obj);
            const expectResult = false;

            expect(testFn).toBe(expectResult);
        })

        test('Fn isEmptyObj(), result: array with empty obj', () => {
            const mockParam_obj = [{}];
            const testFn = CommonUtils.isEmptyObj(mockParam_obj);
            const expectResult = false;

            expect(testFn).toBe(expectResult);
        })

        test('Fn isEmptyObj(), result: array with filled obj', () => {
            const mockParam_obj = [ { test: 'test' } ];
            const testFn = CommonUtils.isEmptyObj(mockParam_obj);
            const expectResult = false;

            expect(testFn).toBe(expectResult);
        })
    })
})