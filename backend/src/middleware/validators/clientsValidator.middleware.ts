import { body, param, ValidationChain } from 'express-validator';
import { ApiKeyStatus } from '../../utils/enums/api-key-status.enum';

export const clientsCreateSchema: ValidationChain[] = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('support-arg-required')
];