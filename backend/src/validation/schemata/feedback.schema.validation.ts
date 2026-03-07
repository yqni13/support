import { body, param, ValidationChain } from 'express-validator';
import * as CommonValidators from "../common.validation";
import { CommonExceptionMessage as Message } from '../../utils/enums/common-exception-messages.enum';

export const getFeedbackSchema: ValidationChain[] = [
    param('id')
        .custom((content: number) => CommonValidators.validateRequestRouteParam(JSON.stringify(content)))
        .bail()
        .isInt()
        .withMessage('support-invalid-entry#feedback_id')
];

export const postFeedbackSearchSchema: ValidationChain[] = [
    body('client_id')
        .customSanitizer(content => Array.isArray(content) ? content : [content])
        .optional(),
    body('client_id.*')
        .isUUID(4)
        .withMessage('support-invalid-entry#client_id'),
    body('user_id')
        .customSanitizer(content => Array.isArray(content) ? content : [content])
        .optional(),
    body('user_id.*')
        .isUUID(4)
        .withMessage('support-invalid-entry#user_id'),
    body('rating')
        .custom((content: any) => {
            // Handle empty array as intention to send data => throw require-msg.
            if(Array.isArray(content) && content.length === 0) {
                throw new Error(Message.REQUIRED);
            }
            return true;
        })
        .bail()
        .customSanitizer(content => Array.isArray(content) ? content : [content])
        .optional(),
    body('rating.*')
        .custom((rating: any) => {
            if(isNaN(rating)) { // Can handle empty object but not empty array.
                throw new Error('support-invalid-entry#rating');
            }
            return true;
        })
        .bail()
        .isInt({min:1})
        .withMessage('support-invalid-min#rating!1')
        .bail()
        .isInt({max:5})
        .withMessage('support-invalid-max#rating!5'),
    body('term_accepted')
        .isBoolean({strict: true})
        .withMessage('support-invalid-entry#term_accepted')
        .optional(),
    body('reviewed_on')
        .custom((timestamps) => CommonValidators.validateTimestampFilter(timestamps))
        .optional(),
    body('last_modified')
        .custom((timestamps) => CommonValidators.validateTimestampFilter(timestamps))
        .optional(),
    body('created_on')
        .custom((timestamps) => CommonValidators.validateTimestampFilter(timestamps))
        .optional()
];

export const postFeedbackSchema: ValidationChain[] = [
    body('user_email')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED),
        // validateEmail() is already executed in auth.user.middleware.ts
    body('rating')
        .exists({values: 'null'})
        .withMessage(Message.REQUIRED)
        .bail()
        .isInt({min:1})
        .withMessage('support-invalid-min#rating!1')
        .bail()
        .isInt({max:5})
        .withMessage('support-invalid-max#rating!5'),
    body('term_accepted')
        .exists({values: 'null'})
        .withMessage(Message.REQUIRED)
        .bail()
        .isBoolean({strict: true})
        .withMessage('support-invalid-entry#term_accepted'),
    body('message')
        .trim()
        .isLength({max: 1000})
        .withMessage('support-invalid-max#message!1000')
        .optional()
];

export const patchFeedbackReviewSchema: ValidationChain[] = [
    param('id')
        .custom((content: number) => CommonValidators.validateRequestRouteParam(JSON.stringify(content)))
        .bail()
        .isInt()
        .withMessage('support-invalid-entry#feedback_id')
];