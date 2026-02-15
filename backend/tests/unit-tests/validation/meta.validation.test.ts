import * as CommonValidators from "../../../src/validation/common.validation";

describe('Unit-tests (validation), priority: synonym CommonValidators on entity Meta', () => {

    describe('Testing valid fn calls', () => {

        test('Fn validateVersionStructure(), params: <context> (main)', () => {
            const mockParam_context = '1.0';

            const testFn = CommonValidators.validateVersionStructure(mockParam_context);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('Fn validateVersionStructure(), params: <context> (main)', () => {
            const mockParam_context = '0.1.5';

            const testFn = CommonValidators.validateVersionStructure(mockParam_context);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('Fn validateVersionStructure(), params: <context> (pre-release)', () => {
            const mockParam_context = '0.1.5-beta';

            const testFn = CommonValidators.validateVersionStructure(mockParam_context);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('Fn validateVersionStructure(), params: <context> (pre-release)', () => {
            const mockParam_context = '0.1.5-beta.7.z';

            const testFn = CommonValidators.validateVersionStructure(mockParam_context);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('Fn validateVersionStructure(), params: <context> (pre-release)', () => {
            const mockParam_context = '0.1.5-x.3';

            const testFn = CommonValidators.validateVersionStructure(mockParam_context);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Fn validateVersionStructure(), error: invalid context', () => {
            const mockParam_context = '1.x.0';

            const expectResult = 'support-invalid-version';

            expect(() => {
                CommonValidators.validateVersionStructure(mockParam_context);
            }).toThrow(expectResult);
        })

        test('Fn validateVersionStructure(), error: invalid context', () => {
            const mockParam_context = '1.0.0-';

            const expectResult = 'support-invalid-version';

            expect(() => {
                CommonValidators.validateVersionStructure(mockParam_context);
            }).toThrow(expectResult);
        })

        test('Fn validateVersionStructure(), error: invalid context', () => {
            const mockParam_context = '1.0.0-alpha.';

            const expectResult = 'support-invalid-version';

            expect(() => {
                CommonValidators.validateVersionStructure(mockParam_context);
            }).toThrow(expectResult);
        })

        test('Fn validateVersionStructure(), error: invalid context', () => {
            const mockParam_context = '1.0.0-*';

            const expectResult = 'support-invalid-version';

            expect(() => {
                CommonValidators.validateVersionStructure(mockParam_context);
            }).toThrow(expectResult);
        })

        test('Fn validateVersionStructure(), error: invalid context', () => {
            const mockParam_context = 'iaminvalidversion';

            const expectResult = 'support-invalid-version';

            expect(() => {
                CommonValidators.validateVersionStructure(mockParam_context);
            }).toThrow(expectResult);
        })
    })
})