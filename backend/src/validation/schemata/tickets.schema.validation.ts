import { body, param, ValidationChain } from 'express-validator';
import * as CustomValidator from "../common.validation";
import { Flag } from '../../utils/enums/flag.enum';
import { TicketStatus } from '../../utils/enums/ticket-status.enum';
import { SingleOrArray } from '../../utils/custom-types.utils';
import { CommonExceptionMessage as Message } from '../../utils/enums/common-exception-messages.enum';

export const getTicketSchema: ValidationChain[] = [
    param('id')
        .custom((content: string) => CustomValidator.validatePathParam(content))
        .bail()
        .isUUID(4)
        .withMessage('support-invalid-entry#ticket_id')
];

export const postTicketsSearchSchema: ValidationChain[] = [
    // How to validate content with express-validator methods as possible array:
    // #1 Convert content via customSanitizer
    // #2 Validate every value in array sperately by calling body with postfix '.*'
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
    body('status')
        .custom((content: SingleOrArray<TicketStatus>) => {
            content = Array.isArray(content) ? content : [content];
            content.forEach((status) => CustomValidator.validateEnum(status, TicketStatus, 'ticketStatus'))
            return true;
        })
        .optional(),
    body('flag')
        .custom((content: undefined | null | SingleOrArray<Flag>) => {
            // Manual check for undefined/null necessary because null is valid value.
            if(content === null || content === undefined) {
                return true;
            }
            content = Array.isArray(content) ? content : [content];
            content.forEach((flag) => CustomValidator.validateEnum(flag, Flag, 'flag'))
            return true;
        }),
    body('last_modified')
        .custom((timestamps) => CustomValidator.validateTimestampFilter(timestamps))
        .optional(),
    body('created_on')
        .custom((timestamps) => CustomValidator.validateTimestampFilter(timestamps))
        .optional()
];

export const postTicketSchema: ValidationChain[] = [
    body('user_email')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .custom((content: string) => CustomValidator.validateEmail(content)),
    body('message')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .isLength({max: 1000})
        .withMessage('support-invalid-max#message!1000'),
    body('resource_paths')
        .isEmpty()
        .withMessage(Message.FORBIDDEN)
];

export const patchTicketSchema: ValidationChain[] = [
    param('id')
        .custom((content: string) => CustomValidator.validatePathParam(content))
        .bail()
        .isUUID(4)
        .withMessage('support-invalid-entry#ticket_id'),
    body('status')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .custom((status: TicketStatus) => CustomValidator.validateEnum(status, TicketStatus, 'ticketStatus')),
    body('message')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .isLength({max: 1000})
        .withMessage('support-invalid-max#message!1000'),
    body('resource_paths')
        .isEmpty()
        .withMessage(Message.FORBIDDEN),
    body('flag')
        .trim()
        .custom((flag: string) => CustomValidator.validateEnum(flag, Flag, 'flag'))
        .optional({values: 'null'}),
    body('last_modified')
        .isEmpty()
        .withMessage(Message.FORBIDDEN)
];

export const deleteTicketSchema: ValidationChain[] = [
    param('id')
        .custom((content: string) => CustomValidator.validatePathParam(content))
        .bail()
        .isUUID(4)
        .withMessage('support-invalid-entry#ticket_id')
];