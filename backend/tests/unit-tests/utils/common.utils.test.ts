import * as Utils from "../../../src/utils/common.utils";

describe('Utils tets, priority: common', () => {

    describe('Testing valid fn calls', () => {

        test('fn: getCustomTimeString', () => {
            const mockParam_time = new Date('2025-01-01 10:00:01+01');
            const testFn = Utils.getCustomTimeString(mockParam_time);
            const expectResult = '2025-01-01T10:00:01.000';

            expect(testFn).toBe(expectResult);
        })

        test('fn: getTimestampByTimezone', () => {
            const mockParam_time = new Date('2025-01-01T09:00:01.000Z');
            const gmtData = Utils.getPropertiesFromTimezoneOffset(mockParam_time);

            const testFn = Utils.getTimestampByTimezone(mockParam_time);
            const expectResult = `2025-01-01 ${9+(+gmtData.offset)}:00:01${gmtData.prefix}${gmtData.offset}`;

            expect(testFn).toBe(expectResult);
        })
    })
})