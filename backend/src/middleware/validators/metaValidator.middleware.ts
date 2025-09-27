import { body, param, ValidationChain } from 'express-validator';
import * as CustomValidator from '../../utils/customValidator.utils';

export const metaFindByIdSchema: ValidationChain[] = [
    param('id')
        .trim()
        .notEmpty()
        .withMessage('data-required')
];

export const metaUpdateSchema: ValidationChain[] = [
    body('id')
        .trim()
        .notEmpty()
        .withMessage('data-required'),
    body('app')
        .trim()
        .notEmpty()
        .withMessage('data-required'),
    body('author')
        .trim()
        .notEmpty()
        .withMessage('data-required'),
    body('build_on')
        .trim()
        .notEmpty()
        .withMessage('data-required'),
    body('environment')
        .trim()
        .notEmpty()
        .withMessage('data-required'),
    body('app_version')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .custom((val) => CustomValidator.validateVersionStructure(val, 2)),
    body('db_version')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .custom((val) => CustomValidator.validateVersionStructure(val, 2)),
    body('docker_image')
        .trim()
        .notEmpty()
        .withMessage('data-required'),
    body('docker_version')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .custom((val) => CustomValidator.validateVersionStructure(val, 2)),
    body('jenkins_version')
        .trim()
        .notEmpty()
        .withMessage('data-required')
        .bail()
        .custom((val) => CustomValidator.validateVersionStructure(val, 2)),
]