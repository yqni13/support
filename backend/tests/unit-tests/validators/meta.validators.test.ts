import * as CustomValidator from "../../../src/utils/customValidator.utils";

describe('CustomValidator test, priority: META', () => {

    describe('Testing valid fn calls', () => {

        test('fn: validateVersionStructure, params: <context> (main)', () => {
            const mockParam_context = '1.0';

            const testFn = CustomValidator.validateVersionStructure(mockParam_context);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('fn: validateVersionStructure, params: <context> (main)', () => {
            const mockParam_context = '0.1.5';

            const testFn = CustomValidator.validateVersionStructure(mockParam_context);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('fn: validateVersionStructure, params: <context> (pre-release)', () => {
            const mockParam_context = '0.1.5-beta';

            const testFn = CustomValidator.validateVersionStructure(mockParam_context);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('fn: validateVersionStructure, params: <context> (pre-release)', () => {
            const mockParam_context = '0.1.5-beta.7.z';

            const testFn = CustomValidator.validateVersionStructure(mockParam_context);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('fn: validateVersionStructure, params: <context> (pre-release)', () => {
            const mockParam_context = '0.1.5-x.3';

            const testFn = CustomValidator.validateVersionStructure(mockParam_context);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('fn: validateVersionStructure, error: invalid context', () => {
            const mockParam_context = '1.x.0';

            const expectResult = 'support-invalid-version';

            expect(() => {
                CustomValidator.validateVersionStructure(mockParam_context);
            }).toThrow(expectResult);
        })

        test('fn: validateVersionStructure, error: invalid context', () => {
            const mockParam_context = '1.0.0-';

            const expectResult = 'support-invalid-version';

            expect(() => {
                CustomValidator.validateVersionStructure(mockParam_context);
            }).toThrow(expectResult);
        })

        test('fn: validateVersionStructure, error: invalid context', () => {
            const mockParam_context = '1.0.0-alpha.';

            const expectResult = 'support-invalid-version';

            expect(() => {
                CustomValidator.validateVersionStructure(mockParam_context);
            }).toThrow(expectResult);
        })

        test('fn: validateVersionStructure, error: invalid context', () => {
            const mockParam_context = '1.0.0-*';

            const expectResult = 'support-invalid-version';

            expect(() => {
                CustomValidator.validateVersionStructure(mockParam_context);
            }).toThrow(expectResult);
        })

        test('fn: validateVersionStructure, error: invalid context', () => {
            const mockParam_context = 'iaminvalidversion';

            const expectResult = 'support-invalid-version';

            expect(() => {
                CustomValidator.validateVersionStructure(mockParam_context);
            }).toThrow(expectResult);
        })
    })
})