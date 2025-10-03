import * as CustomValidator from "../../../src/utils/customValidator.utils";

describe('CustomValidator test, priority: META', () => {

    describe('Testing valid fn calls', () => {

        test('fn: validateVersionStructure, params: <numOfDelimiter> = 1', () => {
            const mockParam_version = '1.0';
            const mockParam_numOfDelimiter = 1;

            const testFn = CustomValidator.validateVersionStructure(
                mockParam_version, mockParam_numOfDelimiter
            );
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('fn: validateVersionStructure, params: <numOfDelimiter> = 2', () => {
            const mockParam_version = '0.1.5';
            const mockParam_numOfDelimiter = 2;

            const testFn = CustomValidator.validateVersionStructure(
                mockParam_version, mockParam_numOfDelimiter
            );
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('fn: validateVersionStructure, error: wrong number of delimiters', () => {
            const mockParam_version = '0.0.1';
            const mockParam_numOfDelimiter = 1;

            const expectResult = 'backend-invalid-version';

            expect(() => {
                CustomValidator.validateVersionStructure(
                    mockParam_version, mockParam_numOfDelimiter
                );
            }).toThrow(expectResult);
        })

        test('fn: validateVersionStructure, error: invalid content', () => {
            const mockParam_version = '1.0.0-alpha';
            const mockParam_numOfDelimiter = 2;

            const expectResult = 'backend-invalid-version';

            expect(() => {
                CustomValidator.validateVersionStructure(
                    mockParam_version, mockParam_numOfDelimiter
                );
            }).toThrow(expectResult);
        })
    })
})