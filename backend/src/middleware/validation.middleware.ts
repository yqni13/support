import { validationResult } from 'express-validator';
import { InvalidPropertiesException } from '../utils/exceptions/validation.exception';

export function checkValidation(req: any, hasBodyPayload: boolean = false) {
    const msg = 'support-invalid-properties';
    if(hasBodyPayload && !req.body) {
        throw new InvalidPropertiesException(msg, { data: [
            {
                type: 'field',
                value: 'undefined',
                msg: 'support-payload-required',
                path: 'req.body',
                location: 'body'
            }
        ]});
    }
    const data: any = validationResult(req);
    if(!data.isEmpty()) {
        throw new InvalidPropertiesException(msg, { data: data.errors });
    }
}