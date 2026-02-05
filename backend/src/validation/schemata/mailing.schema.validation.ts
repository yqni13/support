import { body, ValidationChain } from 'express-validator';
import { CommonExceptionMessage as Message } from '../../utils/enums/common-exception-messages.enum';

export const mailingSchema: ValidationChain[] = [
    body('sender')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED),
    body('subject')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED),
    body('data')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED),
    body('body')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED),
    body('source')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED),
];