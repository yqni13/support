import { body, param, ValidationChain } from 'express-validator';
import * as CommonValidators from '../common.validation';
import { MaintenanceMode } from '../../utils/enums/maintenance-mode.enum';
import { CommonExceptionMessage as Message } from '../../utils/enums/common-exception-messages.enum';
import { DemoMode } from '../../utils/enums/demo-mode.enum';

export const getMetaByIdSchema: ValidationChain[] = [
    param('id')
        .custom((content: string) => CommonValidators.validateRequestRouteParam(content))
        .bail()
        .isInt()
        .withMessage('support-invalid-entry#meta_id')
];

export const getMetaByNameSchema: ValidationChain[] = [
    param('name')
        .custom((content: string) => CommonValidators.validateRequestRouteParam(content))
];

export const patchMetaSchema: ValidationChain[] = [
    param('id')
        .custom((content: string) => CommonValidators.validateRequestRouteParam(content))
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
        .custom((val) => CommonValidators.validateVersionStructure(val)),
    body('db_version')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .custom((val) => CommonValidators.validateVersionStructure(val)),
    body('docker_image')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED),
    body('docker_version')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .custom((val) => CommonValidators.validateVersionStructure(val)),
    body('jenkins_version')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .custom((val) => CommonValidators.validateVersionStructure(val)),
    body('last_modified')
        .isEmpty()
        .withMessage(Message.FORBIDDEN)
];

export const getMaintenanceSchema: ValidationChain[] = [
    param('name')
        .custom((content: string) => CommonValidators.validateRequestRouteParam(content))
];

export const patchMaintenanceSchema: ValidationChain[] = [
    param('id')
        .custom((content: string) => CommonValidators.validateRequestRouteParam(content))
        .bail()
        .isInt()
        .withMessage('support-invalid-entry#meta_id'),
    body('maintenance_mode')
        .trim()
        .notEmpty()
        .withMessage(Message.REQUIRED)
        .bail()
        .custom((val) => CommonValidators.validateEnum(val, MaintenanceMode, 'maintenanceMode')),
    body('last_modified')
        .isEmpty()
        .withMessage(Message.FORBIDDEN)
];

export const postDemoSchema: ValidationChain[] = [
    body('demo_mode')
        .trim()
        .custom((mode: DemoMode) => CommonValidators.validateEnum(mode, DemoMode, 'demoMode'))
        .optional() // Accept {} as payload.
]