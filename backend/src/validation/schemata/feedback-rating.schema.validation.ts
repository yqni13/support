import { param, ValidationChain } from 'express-validator';
import * as CommonValidators from "../common.validation";

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