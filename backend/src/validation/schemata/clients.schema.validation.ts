import { body, param, ValidationChain } from 'express-validator';
import * as CustomValidator from "../common.validation";
import { ApiKeyStatus } from '../../utils/enums/api-key-status.enum';
import { CommonExceptionMessage as Message } from '../../utils/enums/common-exception-messages.enum';

export const getClientStatusSchema: ValidationChain[] = [
    param('name')
        .custom((content: string) => CustomValidator.validatePathParam(content))
];

export const postClientSchema: ValidationChain[] = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .custom(async(val: string) => await CustomValidator.validateClientUniqueness(val))
];

export const patchClientStatusSchema: ValidationChain[] = [
    param('id')
        .custom((content: string) => CustomValidator.validatePathParam(content))
        .bail()
        .isUUID(4)
        .withMessage('support-invalid-entry#client_id'),
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