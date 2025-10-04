import { Request, Response, NextFunction } from "express";
import { secrets } from "../utils/secrets.utils";
import { EnvMode } from "../utils/enums/env-mode.enum";
import { InvalidCredentialsException } from "../utils/exceptions/auth.exception";

export function auth(isApiKeyAuth: boolean = false) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            if(isApiKeyAuth) {
                // TODO(yqni13): temporary state => change key-check by SUPPORT-13
                const hasValidKey = req.params.key === 'testkey';

                const isDeployMode = secrets.MODE === EnvMode.PROD || secrets.MODE === EnvMode.STAG ? true : false;
                if(isDeployMode && !hasValidKey) {
                    throw new InvalidCredentialsException('support-invalid-authkey');
                }
            }
            next();
        } catch(err: any) {
            if(secrets.MODE === EnvMode.DEV) {
                console.log('AUTH ERROR ON VERIFICATION (Auth Middleware): ', err.message);
            }
            err.status = 401;
            next(err);
        }
    }
}