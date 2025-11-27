import { Clients } from "../repositories/interfaces/clients.entity.interface";
import { Users } from "../repositories/interfaces/users.entity.interface";

/**
 * Typescript has fixed interface for Express Request.
 * To add new properties, expand interface with new types/interfaces.
 * Additionally, tsconfig.json needs modification on "types" and "include".
 * Command to run application also needs the flag "--files" to accept changes.
 * Reference: https://stackoverflow.com/questions/58957228/property-does-not-exist-on-type-requestparamsdictionary
 * */
declare global {
    namespace Express {
        export interface Request {
            apiClients: Clients,
            apiUsers: Users
        }
    }
}