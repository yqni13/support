import { MaintenanceMode } from "../../../src/utils/enums/maintenance-mode.enum";
import * as CommonValidators from "../../../src/validation/common.validation";
import { EnvMode } from "../../../src/utils/enums/env-mode.enum";
import { MailSource } from "../../../src/utils/enums/mail-source.enum";
import { ApiKeyStatus } from "../../../src/utils/enums/api-key-status.enum";
import { UserStatus } from "../../../src/utils/enums/user-status.enum";
import { Flag } from "../../../src/utils/enums/flag.enum";
import { CommonExceptionMessage } from "../../../src/utils/enums/common-exception-messages.enum";
import { DemoMode } from "../../../src/utils/enums/demo-mode.enum";
import { TicketOption } from "../../../src/utils/enums/ticket-option.enum";
import { TicketStatus } from "../../../src/utils/enums/ticket-status.enum";
import { Violation } from "../../../src/utils/enums/violations.enum";

describe('Unit-tests (validation), priority: synonym CommonValidators', () => {

    describe('Testing valid fn calls', () => {

        const enumCollection = [
            { enumObj: ApiKeyStatus, enumName: 'apiKeyStatus' },
            { enumObj: CommonExceptionMessage, enumName: 'commonExceptionMessage' },
            { enumObj: DemoMode, enumName: 'demoMode' },
            { enumObj: EnvMode, enumName: 'envMode' },
            { enumObj: Flag, enumName: 'flag' },
            { enumObj: MailSource, enumName: 'mailSource' },
            { enumObj: MaintenanceMode, enumName: 'maintenanceMode' },
            { enumObj: TicketOption, enumName: 'ticketOption' },
            { enumObj: TicketStatus, enumName: 'ticketStatus' },
            { enumObj: UserStatus, enumName: 'userStatus' },
            { enumObj: Violation, enumName: 'violation' }
        ];

        test.each(enumCollection)('Fn validateEnum(), params: <%s>', (entry) => {
            const mockParam_enumObj = entry.enumObj;
            const mockParam_enumName = entry.enumName;
            const expectResult = true;

            Object.values(mockParam_enumObj).forEach((value) => {
                expect(CommonValidators.validateEnum(
                    value,
                    mockParam_enumObj,
                    mockParam_enumName
                )).toBe(expectResult);
            })
        })

        test('Fn validateRequestRouteParam(), params: <param> = "valid-test-param"', () => {
            const mockParam_param = 'valid-test-param';
            const testFn = CommonValidators.validateRequestRouteParam(mockParam_param);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('Fn validateTimestamp(), params: valid <timestamp>', () => {
            const mockParam_timestamp = "2025-01-01T14:00:00.000Z";
            const testFn = CommonValidators.validateTimestamp(mockParam_timestamp)
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('Fn validateTimestampFilter(), params: <timestamps> = ["older", "younger"]', () => {
            const mockParam_timestamps = ['2025-01-01T14:00:00.000Z', '2025-01-10T13:00:00.000Z'];
            const testFn = CommonValidators.validateTimestampFilter(mockParam_timestamps);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('Fn validateTestErrorMsg(), params: <exception> = MaintenanceException, <msg> = "M-008"', () => {
            const mockParam_exception = 'MaintenanceException';
            const mockParam_msg = MaintenanceMode.M008;
            const testFn = CommonValidators.validateTestErrorMsg(mockParam_exception, mockParam_msg);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Fn validateEnum(), params: invalid <value> by value', () => {
            const mockParam_value = 'invalid-value';
            const mockParam_enumObj = MaintenanceMode;
            const mockParam_enumName = 'maintenanceMode';
            const expectResult = `support-invalid-entry#${mockParam_enumName}`;

            expect(() => {
                CommonValidators.validateEnum(
                    mockParam_value,
                    mockParam_enumObj,
                    mockParam_enumName
                );
            }).toThrow(expectResult);
        })

        test('Fn validateEnum(), params: invalid <language> by key', () => {
            const mockParam_value = { INVALID: MaintenanceMode.T011 };
            const mockParam_enumObj = MaintenanceMode;
            const mockParam_enumName = 'maintenanceMode';
            const expectResult = `support-invalid-entry#${mockParam_enumName}`;
            
            expect(() => {
                CommonValidators.validateEnum(
                    mockParam_value,
                    mockParam_enumObj,
                    mockParam_enumName
                );
            }).toThrow(expectResult);
        })

        test.each([null, undefined, ' ', ':id'])('Fn validateRequestRouteParam(), params: <%s>', (invalidArg) => {
            const mockParam_arg = invalidArg;
            const expectResult = CommonExceptionMessage.REQUIRED;

            expect(() => {
                CommonValidators.validateRequestRouteParam(mockParam_arg);
            }).toThrow(expectResult);
        })

        test('Fn validateTimestamp(), params: invalid <timestamp>', () => {
            const mockParam_timestamp = "abc";
            const expectResult = 'support-invalid-entry#timestamp';

            expect(() => { CommonValidators.validateTimestamp(mockParam_timestamp) }).toThrow(expectResult);
        })

        test('Fn validateTimestampFilter(), params: <timestamps> = ["younger", "older"]', () => {
            const mockParam_timestamps = ['2025-01-10T13:00:00.000Z', '2025-01-01T14:00:00.000Z'];
            const expectResult = 'support-invalid-entry#timestamps';

            expect(() => { CommonValidators.validateTimestampFilter(mockParam_timestamps)}).toThrow(expectResult);
        })

        test('Fn validateTimestampFilter(), params: <timestamps> = ["single_value"]', () => {
            const mockParam_timestamps = ['2025-01-01T14:00:00.000Z'];
            const expectResult = 'support-invalid-entry#timestamps';

            expect(() => { CommonValidators.validateTimestampFilter(mockParam_timestamps)}).toThrow(expectResult);
        })

        test('Fn validateTestErrorMsg(), params: <exception> = MaintenanceException, <msg> = "test-test"', () => {
            const mockParam_exception = 'MaintenanceException';
            const mockParam_msg = 'test-test';
            const expectResult = 'support-invalid-entry#maintenanceMode';

            expect(() => { 
                CommonValidators.validateTestErrorMsg(mockParam_exception, mockParam_msg)
            }).toThrow(expectResult);
        })
    })
})