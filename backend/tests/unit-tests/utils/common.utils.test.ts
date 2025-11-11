import * as Utils from "../../../src/utils/common.utils";
import { secrets } from "../../../src/utils/secrets.utils";

describe('Utils tets, priority: common', () => {

    describe('Testing valid fn calls', () => {

        test('fn: mapKeyToHash', () => {
            const mockParam_key: string = secrets.TEST_APIKEY_RAW;

            const testFn = Utils.mapKeyToHash(mockParam_key);
            const expectResult: string = secrets.TEST_APIKEY_HASH;

            expect(testFn).toEqual(expectResult);
        })

        test('fn: isIRepoError', () => {
            const mockParam_obj = { method: 'support_IRepoError_test', error: null };
            const testFn = Utils.isIRepoError(mockParam_obj);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('fn: getTimestampWithoutOffsetInfo', () => {
            const mockParam_time = new Date('2025-01-01 10:00:01+01');
            const testFn = Utils.getTimestampWithoutOffsetInfo(mockParam_time);
            const expectResult = '2025-01-01T09:00:01.000';

            expect(testFn).toBe(expectResult);
        })

        test('fn: getTimestampWithOffsetInfo', () => {
            const mockParam_time = new Date('2025-01-01T10:00:01.000Z');
            const gmtData = Utils.getPropertiesFromTimezoneOffset(mockParam_time);

            const testFn = Utils.getTimestampWithOffsetInfo(mockParam_time);
            const expectResult = `2025-01-01 ${10+(+gmtData.offset)}:00:01${gmtData.prefix}${gmtData.offset}`;

            expect(testFn).toBe(expectResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('fn: isIRepoError, result as null', () => {
            const mockParam_obj = null;
            const testFn = Utils.isIRepoError(mockParam_obj);
            const expectResult = false;

            expect(testFn).toBe(expectResult);
        })

        test('fn: isIRepoError, result as undefined', () => {
            const mockParam_obj = undefined;
            const testFn = Utils.isIRepoError(mockParam_obj);
            const expectResult = false;

            expect(testFn).toBe(expectResult);
        })

        test('fn: isIRepoError, result as object', () => {
            const mockParam_obj = { app: 'support', author: 'yqni13' };
            const testFn = Utils.isIRepoError(mockParam_obj);
            const expectResult = false;

            expect(testFn).toBe(expectResult);
        })

        test('fn: isIRepoError, result as array', () => {
            const mockParam_obj = [{app: 'taxi-varga', author: 'yqni13'}, {app: 'artcreation-dv', author: 'yqni13'}];
            const testFn = Utils.isIRepoError(mockParam_obj);
            const expectResult = false;

            expect(testFn).toBe(expectResult);
        })
    })
})