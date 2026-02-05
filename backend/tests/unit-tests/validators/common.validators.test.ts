import { MaintenanceMode } from "../../../src/utils/enums/maintenance-mode.enum";
import * as CustomValidators from "../../../src/validation/common.validation";
import { EnvMode } from "../../../src/utils/enums/env-mode.enum";
import { MailSource } from "../../../src/utils/enums/mail-source.enum";
import { ApiKeyStatus } from "../../../src/utils/enums/api-key-status.enum";
import { UserStatus } from "../../../src/utils/enums/user-status.enum";
import { Flag } from "../../../src/utils/enums/flag.enum";
import { CommonExceptionMessage } from "../../../src/utils/enums/common-exception-messages.enum";
import { DemoMode } from "../../../src/utils/enums/demo-mode.enum";

describe('CustomValidator tests, priority: no model specification', () => {

    describe('Testing valid fn calls', () => {

        test('fn: validateEnum, params: <enumObj> = MaintenanceMode', () => {
            const mockParam_enumObj = MaintenanceMode;
            const mockParam_enumName = 'maintenanceMode';
            const expectResult = true;

            Object.values(mockParam_enumObj).forEach((value) => {
                expect(CustomValidators.validateEnum(
                    value,
                    mockParam_enumObj,
                    mockParam_enumName
                )).toBe(expectResult);
            })
        })

        test('fn: validateEnum, params: <enumObj> = EnvMode', () => {
            const mockParam_enumObj = EnvMode;
            const mockParam_enumName = 'envMode';
            const expectResult = true;

            Object.values(mockParam_enumObj).forEach((value) => {
                expect(CustomValidators.validateEnum(
                    value,
                    mockParam_enumObj,
                    mockParam_enumName
                )).toBe(expectResult);
            })
        })

        test('fn: validateEnum, params: <enumObj> = MailSource', () => {
            const mockParam_enumObj = MailSource;
            const mockParam_enumName = 'mailSource';
            const expectResult = true;

            Object.values(mockParam_enumObj).forEach((value) => {
                expect(CustomValidators.validateEnum(
                    value,
                    mockParam_enumObj,
                    mockParam_enumName
                )).toBe(expectResult);
            })
        })

        test('fn: validateEnum, params: <enumObj> = ApiKeyStatus', () => {
            const mockParam_enumObj = ApiKeyStatus;
            const mockParam_enumName = 'apiKeyStatus';
            const expectResult = true;

            Object.values(mockParam_enumObj).forEach((value) => {
                expect(CustomValidators.validateEnum(
                    value,
                    mockParam_enumObj,
                    mockParam_enumName
                )).toBe(expectResult);
            })
        })

        test('fn: validateEnum, params <enumObj> = UserStatus', () => {
            const mockParam_enumObj = UserStatus;
            const mockParam_enumName = 'userStatus';
            const expectResult = true;

            Object.values(mockParam_enumObj).forEach((value) => {
                expect(CustomValidators.validateEnum(
                    value,
                    mockParam_enumObj,
                    mockParam_enumName
                )).toBe(expectResult);
            })
        })

        test('fn: validateEnum, params <enumObj> = Flag', () => {
            const mockParam_enumObj = Flag;
            const mockParam_enumName = 'flag';
            const expectResult = true;

            Object.values(mockParam_enumObj).forEach((value) => {
                expect(CustomValidators.validateEnum(
                    value,
                    mockParam_enumObj,
                    mockParam_enumName
                )).toBe(expectResult);
            })
        })

        test('fn: validateEnum, params <enumObj> = DemoMode', () => {
            const mockParam_enumObj = DemoMode;
            const mockParam_enumName = 'demoMode';
            const expectResult = true;

            Object.values(mockParam_enumObj).forEach((value) => {
                expect(CustomValidators.validateEnum(
                    value,
                    mockParam_enumObj,
                    mockParam_enumName
                )).toBe(expectResult);
            })
        })

        test('fn: validatePathParam, params <param> = "valid-test-id"', () => {
            const mockParam_param = 'valid-test-id';
            const testFn = CustomValidators.validatePathParam(mockParam_param);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('fn: validateTimestamp, params <timestamp> = "2025-01-01T14:00:00.000Z"', () => {
            const mockParam_timestamp = "2025-01-01T14:00:00.000Z";
            const testFn = CustomValidators.validateTimestamp(mockParam_timestamp)
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('fn: validateTimestampFilter, params <timestamps> = ["older", "younger"]', () => {
            const mockParam_timestamps = ['2025-01-01T14:00:00.000Z', '2025-01-10T13:00:00.000Z'];
            const testFn = CustomValidators.validateTimestampFilter(mockParam_timestamps);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('fn: validateEnum, params: invalid <value> by value', () => {
            const mockParam_value = 'invalid-value';
            const mockParam_enumObj = MaintenanceMode;
            const mockParam_enumName = 'maintenanceMode';
            const expectResult = `support-invalid-entry#${mockParam_enumName}`;

            expect(() => {
                CustomValidators.validateEnum(
                    mockParam_value,
                    mockParam_enumObj,
                    mockParam_enumName
                );
            }).toThrow(expectResult);
        })

        test('fn: validateEnum, params: invalid <language> by key', () => {
            const mockParam_value = { INVALID: MaintenanceMode.T011 };
            const mockParam_enumObj = MaintenanceMode;
            const mockParam_enumName = 'maintenanceMode';
            const expectResult = `support-invalid-entry#${mockParam_enumName}`;
            
            expect(() => {
                CustomValidators.validateEnum(
                    mockParam_value,
                    mockParam_enumObj,
                    mockParam_enumName
                );
            }).toThrow(expectResult);
        })

        test.each([null, undefined, ' ', ':id'])('fn: validatePathParam, params <param> = null', (invalidArg) => {
            const mockParam_arg = invalidArg;
            const expectResult = CommonExceptionMessage.REQUIRED;

            expect(() => {
                CustomValidators.validatePathParam(mockParam_arg);
            }).toThrow(expectResult);
        })

        test('fn: validateTimestamp, params <timestamp> = "abc"', () => {
            const mockParam_timestamp = "abc";
            const expectResult = 'support-invalid-entry#timestamp';

            expect(() => { CustomValidators.validateTimestamp(mockParam_timestamp) }).toThrow(expectResult);
        })

        test('fn: validateTimestampFilter, params <timestamps> = ["younger", "older"]', () => {
            const mockParam_timestamps = ['2025-01-10T13:00:00.000Z', '2025-01-01T14:00:00.000Z'];
            const expectResult = 'support-invalid-entry#timestamps';

            expect(() => { CustomValidators.validateTimestampFilter(mockParam_timestamps)}).toThrow(expectResult);
        })

        test('fn: validateTimestampFilter, params <timestamps> = ["single_value"]', () => {
            const mockParam_timestamps = ['2025-01-01T14:00:00.000Z'];
            const expectResult = 'support-invalid-entry#timestamps';

            expect(() => { CustomValidators.validateTimestampFilter(mockParam_timestamps)}).toThrow(expectResult);
        })
    })
})