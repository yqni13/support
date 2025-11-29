import { NextFunction, Request, Response } from "express";
import { InvalidPropertiesException } from "../utils/exceptions/validation.exception";
import { logError } from "../utils/common.utils";

export function requirePayload() {
    return async function(req: Request, res: Response, next: NextFunction) {
        try {
            const msg = 'support-invalid-properties';
            const customError = {
                data: [
                    {
                        type: 'field',
                        value: '',
                        msg: 'support-payload-required',
                        path: 'req.body',
                        location: 'body'
                    }
                ]
            };

            if(!req.body || Array.isArray(req.body) || Object.keys(req.body).length === 0) {
                throw new InvalidPropertiesException(msg, customError);
            }
            next();
        } catch(err: any) {
            logError(
                "VALIDATION MIDDLEWARE ERROR ON PAYLOAD CHECK",
                "SUPPORT_middleware_requirePayload",
                err
            );
            next(err);
        }
    }
}