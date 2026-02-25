import { Request, Response, NextFunction } from "express";
import { ForbiddenApiKeyException, MissingApiKeyException } from "../utils/exceptions/auth.exception";
import { validateApiKey } from "../validation/common.validation";
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
                throw new MissingApiKeyException('support-missing-clients-auth');
            }

            validateApiKey(key);

            let clientData = await clientsService.getClientByActiveKey(key);
            if(!clientData) {
                throw new ForbiddenApiKeyException('support-forbidden-clients-auth')
            }

            clientData = clientData as Clients;
            req.apiClients = clientData;
            await clientsService.updateClientLastUse(clientData.client_id)

            next();
        } catch(err: any) {
            err.status = !err.status ? 401 : err.status;
            logError(
                "AUTH MIDDLEWARE ERROR ON VERIFICATION",
                "SUPPORT_middleware_authClient",
                err
            );
            next(err);
        }
    }
}