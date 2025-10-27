import * as Utils from "../../../src/utils/common.utils";

describe('Utils tets, priority: common', () => {

    describe('Testing valid fn calls', () => {

        test('fn: isIRepoError', () => {
            const mockParam_obj = { method: 'support_IRepoError_test', error: null };
            const testFn = Utils.isIRepoError(mockParam_obj);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('fn: getTimestampWithoutOffsetInfo', () => {
            const mockParam_time = new Date('2025-01-01 10:00:01+01');
            const testFn = Utils.getTimestampWithoutOffsetInfo(mockParam_time);
            const expectResult = '2025-01-01T10:00:01.000';

            expect(testFn).toBe(expectResult);
        })

        test('fn: getTimestampWithOffsetInfo', () => {
            const mockParam_time = new Date('2025-01-01T09:00:01.000Z');
            const gmtData = Utils.getPropertiesFromTimezoneOffset(mockParam_time);

            const testFn = Utils.getTimestampWithOffsetInfo(mockParam_time);
            const expectResult = `2025-01-01 ${9+(+gmtData.offset)}:00:01${gmtData.prefix}${gmtData.offset}`;

            expect(testFn).toBe(expectResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('fn: isIRepoError', () => {
            const mockParam_obj = { rows: [{ app: 'support', author: 'yqni13'}] };
            const testFn = Utils.isIRepoError(mockParam_obj);
            const expectResult = false;

            expect(testFn).toBe(expectResult);
        })
    })
})