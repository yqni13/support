import { validationResult } from 'express-validator';
import { InvalidPropertiesException } from '../utils/exceptions/validation.exception';

export function checkValidation(req: any) {
    const data: any = validationResult(req);
    if(!data.isEmpty()) {
        throw new InvalidPropertiesException('support-invalid-properties', { data: data.errors });
    }
}