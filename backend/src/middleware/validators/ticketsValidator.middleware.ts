import { body, param, ValidationChain } from 'express-validator';
import * as CustomValidator from "../../utils/customValidator.utils";
import { Flag } from '../../utils/enums/flag.enum';
import { TicketStatus } from '../../utils/enums/ticket-status.enum';
import { SingleOrArray } from '../../utils/custom-types.utils';
import { CommonExceptionMessage as Message } from '../../utils/enums/common-exception-messages.enum';

export const ticketsFindByIdSchema: ValidationChain[] = [
    param('id')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
];

export const ticketsFindByFilterSchema: ValidationChain[] = [
    body('client_id')
        .not().isInt()
        .withMessage('support-invalid-id')
        .optional(),
    body('user_id')
        .not().isInt()
        .withMessage('support-invalid-id')
        .optional(),
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
        })
];

export const ticketsCreateSchema: ValidationChain[] = [
    // Body('user_email') validated in combination with authentication process (authUser).
    body('message')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .isLength({max: 1000})
        .withMessage('support-invalid-max#message!1000'),
    body('resource_paths')
        .isEmpty()
        .withMessage(Message.FORBIDDEN)
];

export const ticketsUpdateSchema: ValidationChain[] = [
    param('id')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED),
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

export const ticketsDeleteSchema: ValidationChain[] = [
    param('id')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
];