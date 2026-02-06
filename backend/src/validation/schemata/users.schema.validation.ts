import { body, param, ValidationChain } from 'express-validator';
import * as CommonValidators from "../common.validation";
import { UserStatus } from '../../utils/enums/user-status.enum';
import { Flag } from '../../utils/enums/flag.enum';
import { SingleOrArray } from '../../utils/custom-types.utils';
import { CommonExceptionMessage as Message } from '../../utils/enums/common-exception-messages.enum';

export const getUserByIdSchema: ValidationChain[] = [
    param('id')
        .custom((content: string) => CommonValidators.validatePathParam(content))
        .bail()
        .isUUID(4)
        .withMessage('support-invalid-entry#user_id')
];

export const getUserByEmailSchema: ValidationChain[] = [
    param('email')
        .custom((content: string) => CommonValidators.validatePathParam(content))
        .bail()
        .custom((content: string) => CommonValidators.validateEmail(content))
];

export const postUsersSearchSchema: ValidationChain[] = [
    body('email')
        .custom((content: SingleOrArray<string>) => {
            content = Array.isArray(content) ? content : [content];
            content.forEach((email) => CommonValidators.validateEmail(email))
            return true;
        })
        .optional(),
    body('status')
        .custom((content: SingleOrArray<UserStatus>) => {
            content = Array.isArray(content) ? content : [content];
            content.forEach((status) => CommonValidators.validateEnum(status, UserStatus, 'userStatus'))
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

export const postUserSchema: ValidationChain[] = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .custom(async(val: string) => {
            CommonValidators.validateEmail(val);
            await CommonValidators.validateEmailUniqueness(val);
        })
];

export const patchUserSchema: ValidationChain[] = [
    param('id')
        .custom((content: string) => CommonValidators.validatePathParam(content))
        .bail()
        .isUUID(4)
        .withMessage('support-invalid-entry#user_id'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .custom(async(val: string) => {
            CommonValidators.validateEmail(val);
            await CommonValidators.validateEmailUniqueness(val);
        }),
    body('status')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .custom((status: string) => CommonValidators.validateEnum(status, UserStatus, 'userStatus')),
    body('flag')
        .trim()
        .custom((flag: string) => CommonValidators.validateEnum(flag, Flag, 'flag'))
        .optional({values: 'null'}),
    body('last_modified')
        .isEmpty()
        .withMessage(Message.FORBIDDEN)
];