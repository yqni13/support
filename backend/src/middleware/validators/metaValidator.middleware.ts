import { body, param, ValidationChain } from 'express-validator';
import * as CustomValidator from '../../utils/customValidator.utils';

export const metaFindByIdSchema: ValidationChain[] = [
    param('id')
        .isInt()
        .withMessage('backend-invalid-id')
];

export const metaUpdateSchema: ValidationChain[] = [
    param('id')
        .isInt()
        .withMessage('backend-invalid-id'),
    body('app')
        .trim()
        .notEmpty()
        .withMessage('arg-required'),
    body('author')
        .trim()
        .notEmpty()
        .withMessage('arg-required'),
    body('build_on')
        .trim()
        .notEmpty()
        .withMessage('arg-required'),
    body('environment')
        .trim()
        .notEmpty()
        .withMessage('arg-required'),
    body('app_version')
        .trim()
        .notEmpty()
        .withMessage('arg-required')
        .bail()
        .custom((val) => CustomValidator.validateVersionStructure(val, 2)),
    body('db_version')
        .trim()
        .notEmpty()
        .withMessage('arg-required')
        .bail()
        .custom((val) => CustomValidator.validateVersionStructure(val, 2)),
    body('docker_image')
        .trim()
        .notEmpty()
        .withMessage('arg-required'),
    body('docker_version')
        .trim()
        .notEmpty()
        .withMessage('arg-required')
        .bail()
        .custom((val) => CustomValidator.validateVersionStructure(val, 2)),
    body('jenkins_version')
        .trim()
        .notEmpty()
        .withMessage('arg-required')
        .bail()
        .custom((val) => CustomValidator.validateVersionStructure(val, 2)),
];