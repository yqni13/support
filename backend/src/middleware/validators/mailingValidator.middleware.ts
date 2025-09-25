import { body, ValidationChain } from 'express-validator';

export const mailingSchema: ValidationChain[] = [
    body('sender')
        .trim()
        .notEmpty()
        .withMessage('data-required'),
    body('subject')
        .trim()
        .notEmpty()
        .withMessage('data-required'),
    body('data')
        .trim()
        .notEmpty()
        .withMessage('data-required'),
    body('body')
        .trim()
        .notEmpty()
        .withMessage('data-required'),
    body('source')
        .trim()
        .notEmpty()
        .withMessage('data-required'),
];