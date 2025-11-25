import { body, param, ValidationChain } from 'express-validator';
import * as CustomValidator from '../../utils/customValidator.utils';
import { MaintenanceMode } from '../../utils/enums/maintenance-mode.enum';
import { CommonExceptionMessage as Message } from '../../utils/enums/common-exception-messages.enum';

export const getMetaByIdSchema: ValidationChain[] = [
    param('id')
        .custom((content: string) => CustomValidator.validatePathParam(content))
        .bail()
        .isInt()
        .withMessage('support-invalid-entry#meta_id')
];

export const getMetaByNameSchema: ValidationChain[] = [
    param('name')
        .custom((content: string) => CustomValidator.validatePathParam(content))
];

export const patchMetaSchema: ValidationChain[] = [
    param('id')
        .custom((content: string) => CustomValidator.validatePathParam(content))
        .bail()
        .isInt()
        .withMessage('support-invalid-entry#meta_id'),
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

export const getMaintenanceSchema: ValidationChain[] = [
    param('name')
        .custom((content: string) => CustomValidator.validatePathParam(content))
];

export const patchMaintenanceSchema: ValidationChain[] = [
    param('name')
        .custom((content: string) => CustomValidator.validatePathParam(content)),
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