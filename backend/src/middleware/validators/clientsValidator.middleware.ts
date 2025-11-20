import { body, param, ValidationChain } from 'express-validator';
import * as CustomValidator from "../../utils/customValidator.utils";
import { ApiKeyStatus } from '../../utils/enums/api-key-status.enum';

export const clientsStatusFindSchema: ValidationChain[] = [
    param('name')
        .trim()
        .notEmpty()
        .withMessage('support-arg-required')
];

// TODO(yqni13): add validation to check unique name constraint
export const clientsCreateSchema: ValidationChain[] = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('support-arg-required')
];

export const clientsStatusUpdateSchema: ValidationChain[] = [
    param('id')
        .trim()
        .notEmpty()
        .withMessage('support-arg-required'),
    body('status')
        .trim()
        .notEmpty()
        .withMessage('support-arg-required')
        .bail()
        .custom((val) => CustomValidator.validateEnum(val, ApiKeyStatus, 'apiKeyStatus')),
    body('last_modified')
        .isEmpty()
        .withMessage('support-arg-forbidden')
];