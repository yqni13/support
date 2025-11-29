import { validationResult } from 'express-validator';
import { InvalidPropertiesException } from '../utils/exceptions/validation.exception';
import { Request } from 'express';

export function checkValidation(req: Request) {
    const msg = 'support-invalid-properties';
    const data: any = validationResult(req);
    if(!data.isEmpty()) {
        throw new InvalidPropertiesException(msg, { data: data.errors });
    }
}