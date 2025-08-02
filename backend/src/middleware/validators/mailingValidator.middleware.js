const { body } = require('express-validator');

exports.mailingSchema = [
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