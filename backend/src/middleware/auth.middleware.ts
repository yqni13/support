import {
    MissingApiKeyException,
    InvalidApiKeyException,
    InvalidCredentialsException
} from "../utils/exceptions/auth.exception";
import { Request, Response, NextFunction } from "express";
import { validateApiKey } from "../utils/customValidator.utils";
import { secrets } from "../utils/secrets.utils";
import { EnvMode } from "../utils/enums/env-mode.enum";
import clientsService from "../services/clients.service";
import { Clients } from "../repositories/interfaces/clients.entity.interface";

/**
 * @description Authentication for admin only access.
 */
export function auth() {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const adminKey = req.header('Support-Admin-Key');
            if(!adminKey) {
                throw new MissingApiKeyException('support-missing-admin-auth');
            }

            const hasValidKey = (adminKey.trim()) === secrets.ADMIN_API;
            const isTestMode = (secrets.ENV_MODE.trim()) === EnvMode.TEST;
            if(!isTestMode && !hasValidKey) {
                throw new InvalidCredentialsException('support-invalid-admin-auth');
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

/**
 * @description Verify request by checking on validity and status of api key.
 */
export function verify() {
    return async function(req: Request, res: Response, next: NextFunction) {
        try {
            // Header naming convention (also noted in GLOSSARY) regarding:
            // https://stackoverflow.com/questions/3561381/custom-http-headers-naming-conventions
            const key = req.header('Support-Api-Key');

            if(!key) {
                throw new MissingApiKeyException();
            }

            validateApiKey(key);

            let clientData = await clientsService.findByActiveKey(key);
            if(!clientData) {
                throw new InvalidApiKeyException()
            }

            clientData = clientData as Clients;
            req.apiClients = clientData;
            await clientsService.updateLastUse(clientData.client_id)

            next();
        } catch(err: any) {
            if(secrets.ENV_MODE === EnvMode.DEV) {
                console.log('VALIDATE API_KEY ERROR ON VERIFICATION (Auth Middleware): ', err.message);
            }
            err.status = 401;
            next(err);
        }
    }
}