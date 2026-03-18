import { body, ValidationChain } from 'express-validator';
import { DemoMode } from '../../utils/enums/demo-mode.enum';
import * as CommonValidators from '../common.validation';
import { CommonExceptionMessage as Message } from '../../utils/enums/common-exception-messages.enum';

export const postErrorSchema: ValidationChain[] = [
    body('error')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED),
    body('errorMsg')
        // Some exceptions require enum values instead individual strings for the error message.
        .custom((msg, {req}) => CommonValidators.validateTestErrorMsg(req.body.error, msg))
        .optional()
];

export const postDemoSchema: ValidationChain[] = [
    body('demo_mode')
        .trim()
        .custom((mode: DemoMode) => CommonValidators.validateEnum(mode, DemoMode, 'demoMode'))
        .optional() // Accept {} as payload.
];