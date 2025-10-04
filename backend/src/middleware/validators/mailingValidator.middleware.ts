import { body, ValidationChain } from 'express-validator';

export const mailingSchema: ValidationChain[] = [
    body('sender')
        .trim()
        .notEmpty()
        .withMessage('support-arg-required'),
    body('subject')
        .trim()
        .notEmpty()
        .withMessage('support-arg-required'),
    body('data')
        .trim()
        .notEmpty()
        .withMessage('support-arg-required'),
    body('body')
        .trim()
        .notEmpty()
        .withMessage('support-arg-required'),
    body('source')
        .trim()
        .notEmpty()
        .withMessage('support-arg-required'),
];