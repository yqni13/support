import { body, param, ValidationChain } from 'express-validator';
import * as CustomValidator from '../../utils/customValidator.utils';
import { MaintenanceMode } from '../../utils/enums/maintenance-mode.enum';
import { CommonExceptionMessage as Message } from '../../utils/enums/common-exception-messages.enum';

export const metaFindByIdSchema: ValidationChain[] = [
    param('id')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .isInt()
        .withMessage('support-invalid-id')
];

export const metaFindByNameSchema: ValidationChain[] = [
    param('name')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
];

export const metaUpdateSchema: ValidationChain[] = [
    param('id')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .isInt()
        .withMessage('support-invalid-id'),
    body('app')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED),
    body('author')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED),
    body('build_on')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED),
    body('environment')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED),
    body('app_version')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .custom((val) => CustomValidator.validateVersionStructure(val, 2)),
    body('db_version')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .custom((val) => CustomValidator.validateVersionStructure(val, 2)),
    body('docker_image')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED),
    body('docker_version')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .custom((val) => CustomValidator.validateVersionStructure(val, 2)),
    body('jenkins_version')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .custom((val) => CustomValidator.validateVersionStructure(val, 2)),
    body('last_modified')
        .isEmpty()
        .withMessage(Message.FORBIDDEN)
];

export const maintenanceFindSchema: ValidationChain[] = [
    param('name')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
];

export const maintenanceUpdateSchema: ValidationChain[] = [
    param('name')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED),
    body('maintenance_mode')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .custom((val) => CustomValidator.validateEnum(val, MaintenanceMode, 'maintenanceMode')),
    body('last_modified')
        .isEmpty()
        .withMessage(Message.FORBIDDEN)
];