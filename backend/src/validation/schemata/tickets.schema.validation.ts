import { body, param, ValidationChain } from 'express-validator';
import * as CommonValidators from "../common.validation";
import { Flag } from '../../utils/enums/flag.enum';
import { TicketStatus } from '../../utils/enums/ticket-status.enum';
import { SingleOrArray } from '../../utils/custom-types.utils';
import { CommonExceptionMessage as Message } from '../../utils/enums/common-exception-messages.enum';
import { TicketOption } from '../../utils/enums/ticket-option.enum';

export const getTicketSchema: ValidationChain[] = [
    param('id')
        .custom((content: string) => CommonValidators.validateRequestRouteParam(content))
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
    body('title')
        .trim()
        .isLength({max: 100})
        .withMessage('support-invalid-max#title!100')
        .optional(),
    body('status')
        .custom((content: SingleOrArray<TicketStatus>) => {
            content = Array.isArray(content) ? content : [content];
            content.forEach((status) => CommonValidators.validateEnum(status, TicketStatus, 'ticketStatus'))
            return true;
        })
        .optional(),
    body('option')
        .custom((content: SingleOrArray<TicketOption>) => {
            content = Array.isArray(content) ? content : [content];
            content.forEach((option) => CommonValidators.validateEnum(option, TicketOption, 'ticketOption'))
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
            content.forEach((flag) => CommonValidators.validateEnum(flag, Flag, 'flag'))
            return true;
        }),
    body('last_modified')
        .custom((timestamps) => CommonValidators.validateTimestampFilter(timestamps))
        .optional(),
    body('created_on')
        .custom((timestamps) => CommonValidators.validateTimestampFilter(timestamps))
        .optional()
];

export const postTicketSchema: ValidationChain[] = [
    body('user_email')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .custom((content: string) => CommonValidators.validateEmail(content)),
    body('option')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .custom((option: TicketOption) => CommonValidators.validateEnum(option, TicketOption, 'ticketOption')),
    body('title')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .isLength({max: 100})
        .withMessage('support-invalid-max#title!100'),
    body('message')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .isLength({max: 5000})
        .withMessage('support-invalid-max#message!5000'),
    body('resource_paths')
        .isEmpty()
        .withMessage(Message.FORBIDDEN),
    body('info_browser')
        .trim()
        .isLength({max: 100})
        .withMessage('support-invalid-max#info_browser!100')
        .optional(),
    body('info_os')
        .trim()
        .isLength({max: 100})
        .withMessage('support-invalid-max#info_os!100')
        .optional(),
    body('info_device')
        .trim()
        .isLength({max: 50})
        .withMessage('support-invalid-max#info_device!50')
        .optional()
];

export const patchTicketSchema: ValidationChain[] = [
    param('id')
        .custom((content: string) => CommonValidators.validateRequestRouteParam(content))
        .bail()
        .isUUID(4)
        .withMessage('support-invalid-entry#ticket_id'),
    body('status')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .custom((status: TicketStatus) => CommonValidators.validateEnum(status, TicketStatus, 'ticketStatus')),
    body('option')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .custom((option: TicketOption) => CommonValidators.validateEnum(option, TicketOption, 'ticketOption')),
    body('title')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .isLength({max: 100})
        .withMessage('support-invalid-max#title!100'),
    body('message')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .isLength({max: 5000})
        .withMessage('support-invalid-max#message!5000'),
    body('flag')
        .trim()
        .custom((flag: string) => CommonValidators.validateEnum(flag, Flag, 'flag'))
        .optional({values: 'null'}),
    body('info_browser')
        .trim()
        .isLength({max: 100})
        .withMessage('support-invalid-max#info_browser!100')
        .optional(),
    body('info_os')
        .trim()
        .isLength({max: 100})
        .withMessage('support-invalid-max#info_os!100')
        .optional(),
    body('info_device')
        .trim()
        .isLength({max: 50})
        .withMessage('support-invalid-max#info_device!50')
        .optional(),
    body('last_modified')
        .isEmpty()
        .withMessage(Message.FORBIDDEN)
];

export const deleteTicketSchema: ValidationChain[] = [
    param('id')
        .custom((content: string) => CommonValidators.validateRequestRouteParam(content))
        .bail()
        .isUUID(4)
        .withMessage('support-invalid-entry#ticket_id')
];