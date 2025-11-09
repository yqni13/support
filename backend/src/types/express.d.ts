import { Clients } from "../repositories/interfaces/clients.entity.interface";

declare global {
    namespace Express {
        export interface Request {
            apiClients: Clients
        }
    }
}