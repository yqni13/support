import {
    MissingApiKeyException,
    InvalidCredentialsException,
} from "../utils/exceptions/auth.exception";
import { Request, Response, NextFunction } from "express";
import { secrets } from "../utils/secrets.utils";
import { EnvMode } from "../utils/enums/env-mode.enum";
import { logError } from "../utils/common.utils";

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
            err.status = 401;
            logError(
                "AUTH MIDDLEWARE ERROR ON VERIFICATION",
                "SUPPORT_middleware_authAdmin",
                err
            );
            next(err);
        }
    }
}