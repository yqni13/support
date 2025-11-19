import { body, param, ValidationChain } from 'express-validator';
import * as CustomValidator from "../../utils/customValidator.utils";
import { UserStatus } from '../../utils/enums/user-status.enum';
import { Flag } from '../../utils/enums/flag.enum';
import { SingleOrArray } from '../../utils/custom-types.utils';

export const usersFindByIdSchema: ValidationChain[] = [
    param('id')
        .trim()
        .notEmpty()
        .withMessage('support-arg-required')
];

export const usersFindByFilterSchema: ValidationChain[] = [
    body('email')
        .custom((content: SingleOrArray<string>) => {
            content = Array.isArray(content) ? content : [content];
            content.forEach((email) => CustomValidator.validateEmail(email))
            return true;
        })
        .optional(),
    body('status')
        .custom((content: SingleOrArray<UserStatus>) => {
            content = Array.isArray(content) ? content : [content];
            content.forEach((status) => CustomValidator.validateEnum(status, UserStatus, 'userStatus'))
            return true;
        })
        .optional(),
    body('flag')
        .custom((content: undefined | null | SingleOrArray<UserStatus>) => {
            // Manual check for undefined/null necessary because null is valid value.
            if(content === null || content === undefined) {
                return true;
            }
            content = Array.isArray(content) ? content : [content];
            content.forEach((status: SingleOrArray<UserStatus>) => CustomValidator.validateEnum(status, UserStatus, 'userStatus'))
            return true;
        })
];

export const usersCreateSchema: ValidationChain[] = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('support-arg-required')
        .bail()
        .custom(async(val: string) => {
            CustomValidator.validateEmail(val);
            await CustomValidator.validateEmailUniqueness(val);
        }),
    body('status')
        .trim()
        .notEmpty()
        .withMessage('support-arg-required')
        .bail()
        .custom((val: string) => CustomValidator.validateEnum(val, UserStatus, 'userStatus')),
    body('flag')
        .trim()
        .custom((val: string) => CustomValidator.validateEnum(val, Flag, 'flag'))
        .optional({values: 'null'}),
    body('last_modified')
        .isEmpty()
        .withMessage('support-arg-forbidden')
];

export const usersUpdateSchema: ValidationChain[] = [
    param('id')
        .trim()
        .notEmpty()
        .withMessage('support-arg-required'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('support-arg-required')
        .bail()
        .custom(async(val: string) => {
            CustomValidator.validateEmail(val);
            await CustomValidator.validateEmailUniqueness(val);
        }),
    body('status')
        .trim()
        .notEmpty()
        .withMessage('support-arg-required')
        .bail()
        .custom((val: string) => CustomValidator.validateEnum(val, UserStatus, 'userStatus')),
    body('flag')
        .trim()
        .custom((val: string) => CustomValidator.validateEnum(val, Flag, 'flag'))
        .optional({values: 'null'}),
    body('last_modified')
        .isEmpty()
        .withMessage('support-arg-forbidden')
];