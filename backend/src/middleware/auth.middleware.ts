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
 * @description Authentication for admin only access by validating admin-key.
 */
export function authAdmin() {
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
            // TODO(yqni13): logging
            if((secrets.ENV_MODE).trim() === EnvMode.DEV || (secrets.ENV_MODE).trim() === EnvMode.TEST) {
                console.log('AUTH ERROR ON VERIFICATION (Auth-Admin Middleware): ', err.message);
            }
            err.status = 401;
            next(err);
        }
    }
}

/**
 * @description Authentication of client request by checking on validity and status of api key.
 */
export function authClient() {
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
            // TODO(yqni13): logging
            if((secrets.ENV_MODE).trim() === EnvMode.DEV || (secrets.ENV_MODE).trim() === EnvMode.TEST) {
                console.log('AUTH ERROR ON VERIFICATION (Auth-Client Middleware): ', err.message);
            }
            err.status = 401;
            next(err);
        }
    }
}