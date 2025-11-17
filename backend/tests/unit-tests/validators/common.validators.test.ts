import { MaintenanceMode } from "../../../src/utils/enums/maintenance-mode.enum";
import * as CustomValidators from "../../../src/utils/customValidator.utils";
import { EnvMode } from "../../../src/utils/enums/env-mode.enum";
import { MailSource } from "../../../src/utils/enums/mail-source.enum";
import { ApiKeyStatus } from "../../../src/utils/enums/api-key-status.enum";
import { UserStatus } from "../../../src/utils/enums/user-status.enum";
import { Flag } from "../../../src/utils/enums/flag.enum";

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
            const mockParam_value = { INVALID: MaintenanceMode.D013 };
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
    })
})