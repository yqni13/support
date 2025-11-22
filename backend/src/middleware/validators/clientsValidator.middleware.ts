import { body, param, ValidationChain } from 'express-validator';
import * as CustomValidator from "../../utils/customValidator.utils";
import { ApiKeyStatus } from '../../utils/enums/api-key-status.enum';
import { CommonExceptionMessage as Message } from '../../utils/enums/common-exception-messages.enum';

export const clientsStatusFindSchema: ValidationChain[] = [
    param('name')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
];

export const clientsCreateSchema: ValidationChain[] = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .custom(async(val: string) => await CustomValidator.validateClientUniqueness(val))
];

export const clientsStatusUpdateSchema: ValidationChain[] = [
    param('id')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED),
    body('status')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .custom((val) => CustomValidator.validateEnum(val, ApiKeyStatus, 'apiKeyStatus')),
    body('last_modified')
        .isEmpty()
        .withMessage(Message.FORBIDDEN)
];