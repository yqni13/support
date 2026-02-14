import * as CommonValidators from '../../../src/validation/common.validation';
import { MalformedApiKeyException } from '../../../src/utils/exceptions/auth.exception';

describe('Unit-tests (validation), priority: synonym CommonValidators on entity Clients', () => {

    describe('Testing valid fn calls', () => {

        test('fn validateApiKey(), params: <key>', () => {
            const mockParam_key = 'h6O6rPDkVkAvyYTHLlcL2viGlp5sWmfCbUZx9MdnOU';
            const testFn = CommonValidators.validateApiKey(mockParam_key);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('fn validateApiKey(), params: <key>, error: invalid length', () => {
            const mockParam_key = 'h6O6rPD';
            const expectResult = MalformedApiKeyException;

            expect(() => CommonValidators.validateApiKey(mockParam_key))
                .toThrow(expectResult);
        })

        test('fn validateApiKey(), params: <key>, error: invalid charset', () => {
            const mockParam_key = 'h6O6rPDkVkAvyYTHLlc-+-+-lp5sWmfCbUZx9MdnOU';
            const expectResult = MalformedApiKeyException;

            expect(() => CommonValidators.validateApiKey(mockParam_key))
                .toThrow(expectResult);
        })
    })
})