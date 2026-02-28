import { body, param, ValidationChain } from 'express-validator';
import * as CommonValidators from "../common.validation";
import { CommonExceptionMessage as Message } from '../../utils/enums/common-exception-messages.enum';

export const getFeedbackRatingSchema: ValidationChain[] = [
    param('id')
        .custom((content: string) => CommonValidators.validateRequestRouteParam(content))
        .bail()
        .isUUID(4)
        .withMessage('support-invalid-entry#client_id')
];

export const getExtendedFeedbackRatingSchema: ValidationChain[] = [
    param('client_name')
        .custom((content: string) => CommonValidators.validateRequestRouteParam(content))
];

export const postFeedbackRatingSchema: ValidationChain[] = [
    body('client_id')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .isUUID(4)
        .withMessage('support-invalid-entry#client_id')
];