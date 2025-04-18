const { body } = require('express-validator');

exports.mailingSchema = [
    body('sender')
        .trim()
        .notEmpty()
        .withMessage('data-required')
];