import { body, ValidationChain } from 'express-validator';

export const clientsCreateSchema: ValidationChain[] = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('support-arg-required')
];