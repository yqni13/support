import {
    MissingApiKeyException,
    InvalidCredentialsException,
} from "../utils/exceptions/auth.exception";
import { Request, Response, NextFunction } from "express";
import { secrets } from "../utils/secrets.utils";
import { EnvMode } from "../utils/enums/env-mode.enum";

/**
 * @description Authentication for admin only access by validating admin-key.
 */
export function authAdmin() {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const adminKey = req.header('Support-Admin-Key');
            if(!adminKey) {
                throw new MissingApiKeyException('support-missing-admin-auth');
            }

            const hasValidKey = adminKey.trim() === secrets.ADMIN_API.trim();
            const isTestMode = secrets.ENV_MODE.trim() === EnvMode.TEST;
            if(!isTestMode && !hasValidKey) {
                throw new InvalidCredentialsException('support-invalid-admin-auth');
            }
            next();
        } catch(err: any) {
            // TODO(yqni13): logging
            if(secrets.ENV_MODE.trim() === EnvMode.DEV || secrets.ENV_MODE.trim() === EnvMode.TEST) {
                console.log('AUTH ERROR ON VERIFICATION (Auth-Admin Middleware): ', err.message);
            }
            err.status = 401;
            next(err);
        }
    }
}