import * as CustomValidators from '../../../src/utils/customValidator.utils';

describe('CustomValidator tests, priority: users model', () => {

    describe('Testing valid fn calls', () => {

        test('fn: validateEmail, params: <email> = user@test.com', () => {
            const mockParam_email = 'user@test.com';
            const testFn = CustomValidators.validateEmail(mockParam_email);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('fn: validateEmail, params: <email> = user@test.co.at', () => {
            const mockParam_email = 'user@test.co.at';
            const testFn = CustomValidators.validateEmail(mockParam_email);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('fn: validateEmail, params: invalid <email> by number of "@"', () => {
            const mockParam_email = 'user@@test.com';
            const expectResult = 'support-invalid-length#email<@>$1';

            expect(() => {
                CustomValidators.validateEmail(mockParam_email);
            }).toThrow(expectResult);
        })

        test('fn: validateEmailLength, params: invalid <email> by total length (min)', () => {
            const mockParam_email = 'a@b';
            const mockParam_posATsign = 1;
            const expectResult = 'support-invalid-min#email?6';

            expect(() => {
                CustomValidators.validateEmailLength(mockParam_email, mockParam_posATsign);
            }).toThrow(expectResult);
        })

        test('fn: validateEmailLength, params: invalid <email> by total length (max)', () => {
            const mockParam_email = 'Iam70characterslongAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA@ToExpandOn.TotalOf400CharactersBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB';
            const mockParam_posATsign = 71;
            const expectResult = 'support-invalid-max#email!320';

            expect(() => {
                CustomValidators.validateEmailLength(mockParam_email, mockParam_posATsign);
            }).toThrow(expectResult);
        })

        test('fn: validateEmailLength, params: invalid <email> by length of username (min)', () => {
            const mockParam_email = '@test.com';
            const mockParam_posATsign = 0;
            const expectResult = 'support-invalid-length#email-username';

            expect(() => {
                CustomValidators.validateEmailLength(mockParam_email, mockParam_posATsign);
            }).toThrow(expectResult);
        })

        test('fn: validateEmailLength, params: invalid <email> by length of username (max)', () => {
            const mockParam_email = 'Iam70characterslongAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA@test.com';
            const mockParam_posATsign = 71;
            const expectResult = 'support-invalid-length#email-username';

            expect(() => {
                CustomValidators.validateEmailLength(mockParam_email, mockParam_posATsign);
            }).toThrow(expectResult);
        })

        test('fn: validateEmailLength, params: invalid <email> by length of domain (min)', () => {
            const mockParam_email = 'user@t.c';
            const mockParam_posATsign = 4;
            const expectResult = 'support-invalid-length#email-domain';

            expect(() => {
                CustomValidators.validateEmailLength(mockParam_email, mockParam_posATsign);
            }).toThrow(expectResult);
        })

        test('fn: validateEmailLength, params: invalid <email> by length of domain (max)', () => {
            const mockParam_email = 'user@Iam270characterslong.BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB';
            const mockParam_posATsign = 4;
            const expectResult = 'support-invalid-length#email-domain';

            expect(() => {
                CustomValidators.validateEmailLength(mockParam_email, mockParam_posATsign);
            }).toThrow(expectResult);
        })

        test('fn: validateEmailLength, params: invalid <email> by length of top level domain (min)', () => {
            const mockParam_email = 'user@test.c';
            const mockParam_posATsign = 4;
            const expectResult = 'support-invalid-length#email-topleveldomain?2';

            expect(() => {
                CustomValidators.validateEmailLength(mockParam_email, mockParam_posATsign);
            }).toThrow(expectResult);
        })

        test('fn: validateEmailSyntax, params: invalid <email> by username RegEx', () => {
            const mockParam_email = 'u§er@test.com';
            const mockParam_posATsign = 4;
            const expectResult = 'support-invalid-email#regex-username';

            expect(() => {
                CustomValidators.validateEmailSyntax(mockParam_email, mockParam_posATsign);
            }).toThrow(expectResult);
        })

        test('fn: validateEmailSyntax, params: invalid <email> by domain RegEx', () => {
            const mockParam_email = 'user@te$t.com';
            const mockParam_posATsign = 4;
            const expectResult = 'support-invalid-email#regex-domain';

            expect(() => {
                CustomValidators.validateEmailSyntax(mockParam_email, mockParam_posATsign);
            }).toThrow(expectResult);
        })

        test('fn: validateEmailSyntax, params: invalid <email> by domain missing "."', () => {
            const mockParam_email = 'user@testcom';
            const mockParam_posATsign = 4;
            const expectResult = 'support-invalid-email#regex-domain';

            expect(() => {
                CustomValidators.validateEmailSyntax(mockParam_email, mockParam_posATsign);
            }).toThrow(expectResult);
        })

        test('fn: validateEmailSyntax, params: invalid <email> by hyphens positioned before "@"', () => {
            const mockParam_email = 'user-@test.com';
            const mockParam_posATsign = 5;
            const expectResult = 'support-invalid-email#hyphen<@>';

            expect(() => {
                CustomValidators.validateEmailSyntax(mockParam_email, mockParam_posATsign);
            }).toThrow(expectResult);
        })

        test('fn: validateEmailSyntax, params: invalid <email> by hyphens positioned after "@"', () => {
            const mockParam_email = 'user@-test.com';
            const mockParam_posATsign = 4;
            const expectResult = 'support-invalid-email#hyphen<@>';

            expect(() => {
                CustomValidators.validateEmailSyntax(mockParam_email, mockParam_posATsign);
            }).toThrow(expectResult);
        })

        test('fn: validateEmailSyntax, params: invalid <email> by mail server RegEx', () => {
            const mockParam_email = 'user@§.com';
            const mockParam_posATsign = 4;
            const expectResult = 'support-invalid-email#mailserver';

            expect(() => {
                CustomValidators.validateEmailSyntax(mockParam_email, mockParam_posATsign);
            }).toThrow(expectResult);
        })

        test('fn: validateEmailSyntax, params: invalid <email> by missing mail server', () => {
            const mockParam_email = 'user@.com';
            const mockParam_posATsign = 4;
            const expectResult = 'support-invalid-email#mailserver';

            expect(() => {
                CustomValidators.validateEmailSyntax(mockParam_email, mockParam_posATsign);
            }).toThrow(expectResult);
        })

        test('fn: validateEmailPolicies, params: invalid <email> by forbidden keyword', () => {
            const mockParam_email = 'noreply@test.com';
            const expectResult = 'support-invalid-email#keyword:noreply';

            expect(() => {
                CustomValidators.validateEmailPolicies(mockParam_email);
            }).toThrow(expectResult);
        })

        test('fn: validateEmailPolicies, params: invalid <email> by containing empty spaces', () => {
            const mockParam_email = 'my user@test .com';
            const expectResult = 'support-invalid-email#keyword:emptyspaces';

            expect(() => {
                CustomValidators.validateEmailPolicies(mockParam_email);
            }).toThrow(expectResult);
        })
    })
})