import {
    ApiKeyMissingException,
    InvalidApiKeyException,
    InvalidCredentialsException
} from "../utils/exceptions/auth.exception";
import { Request, Response, NextFunction } from "express";
import { validateApiKey } from "../utils/customValidator.utils";
import { secrets } from "../utils/secrets.utils";
import { EnvMode } from "../utils/enums/env-mode.enum";
import clientsService from "../services/clients.service";
import { Clients } from "../repositories/interfaces/clients.entity.interface";

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

export function verifyApiKey() {
    return async function(req: Request, res: Response, next: NextFunction) {
        try {
            // Header naming convention (also noted in GLOSSARY) regarding:
            // https://stackoverflow.com/questions/3561381/custom-http-headers-naming-conventions
            const key = req.header('Support-Api-Key');

            if(!key) {
                throw new ApiKeyMissingException();
            }

            validateApiKey(key);

            let clientData = await clientsService.findByKey(key);
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