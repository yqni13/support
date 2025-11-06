import { Request, Response, NextFunction } from "express";
import { secrets } from "../utils/secrets.utils";
import { EnvMode } from "../utils/enums/env-mode.enum";
import { InvalidCredentialsException } from "../utils/exceptions/auth.exception";

export function auth(isApiKeyAuth: boolean = false) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            if(isApiKeyAuth) {
                const hasValidKey = req.params.key === secrets.ADMIN_API;
                const isDeployMode = secrets.ENV_MODE === EnvMode.PROD || secrets.ENV_MODE === EnvMode.STAG ? true : false;
                if(isDeployMode && !hasValidKey) {
                    throw new InvalidCredentialsException('support-invalid-authkey');
                }
            }
            next();
        } catch(err: any) {
            if(secrets.ENV_MODE === EnvMode.DEV) {
                console.log('AUTH ERROR ON VERIFICATION (Auth Middleware): ', err.message);
            }
            err.status = 401;
            next(err);
        }
    }
}