import { Request, Response, NextFunction } from "express";
import { InvalidApiKeyException, MissingApiKeyException } from "../utils/exceptions/auth.exception";
import { validateApiKey } from "../utils/customValidator.utils";
import clientsService from "../services/clients.service";
import { Clients } from "../repositories/interfaces/clients.entity.interface";
import { logError } from "../utils/common.utils";

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

            let clientData = await clientsService.getClientByActiveKey(key);
            if(!clientData) {
                throw new InvalidApiKeyException()
            }

            clientData = clientData as Clients;
            req.apiClients = clientData;
            await clientsService.updateClientLastUse(clientData.client_id)

            next();
        } catch(err: any) {
            err.status = 401;
            logError(
                "AUTH MIDDLEWARE ERROR ON VERIFICATION",
                "SUPPORT_middleware_authClient",
                err
            );
            next(err);
        }
    }
}