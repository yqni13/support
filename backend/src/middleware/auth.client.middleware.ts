import { Request, Response, NextFunction } from "express";
import { InvalidApiKeyException, MissingApiKeyException } from "../utils/exceptions/auth.exception";
import { validateApiKey } from "../utils/customValidator.utils";
import clientsService from "../services/clients.service";
import { Clients } from "../repositories/interfaces/clients.entity.interface";
import { EnvMode } from "../utils/enums/env-mode.enum";
import { secrets } from "../utils/secrets.utils";

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
            if(secrets.ENV_MODE.trim() === EnvMode.DEV || secrets.ENV_MODE.trim() === EnvMode.TEST) {
                console.log('AUTH ERROR ON VERIFICATION (Auth-Client Middleware): ', err.message);
            }
            err.status = 401;
            next(err);
        }
    }
}