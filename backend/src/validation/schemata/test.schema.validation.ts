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
        .optional()
];

export const postDemoSchema: ValidationChain[] = [
    body('demo_mode')
        .trim()
        .custom((mode: DemoMode) => CommonValidators.validateEnum(mode, DemoMode, 'demoMode'))
        .optional() // Accept {} as payload.
];