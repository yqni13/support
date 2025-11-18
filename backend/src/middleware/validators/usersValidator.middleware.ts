import { body, param, ValidationChain } from 'express-validator';
import * as CustomValidator from "../../utils/customValidator.utils";
import { UserStatus } from '../../utils/enums/user-status.enum';
import { Flag } from '../../utils/enums/flag.enum';

export const usersFindByIdSchema: ValidationChain[] = [
    param('id')
        .trim()
        .notEmpty()
        .withMessage('support-arg-required')
];

export const usersCreateSchema: ValidationChain[] = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('support-arg-required')
        .bail()
        .custom((val: string) => CustomValidator.validateEmail(val)),
    body('status')
        .trim()
        .notEmpty()
        .withMessage('support-arg-required')
        .bail()
        .custom((val: string) => CustomValidator.validateEnum(val, UserStatus, 'userStatus')),
    body('flag')
        .trim()
        .custom((val: string) => CustomValidator.validateEnum(val, Flag, 'flag'))
        .optional({values: 'null'})
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
        .custom((val: string) => CustomValidator.validateEmail(val)),
    body('status')
        .trim()
        .notEmpty()
        .withMessage('support-arg-required')
        .bail()
        .custom((val: string) => CustomValidator.validateEnum(val, UserStatus, 'userStatus')),
    body('flag')
        .trim()
        .custom((val: string) => CustomValidator.validateEnum(val, Flag, 'flag'))
        .optional({values: 'null'})
];