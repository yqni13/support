import { ApiKeyStatus } from "../../utils/enums/api-key-status.enum";

export interface Clients {
    client_id: string,
    name: string,
    api_key_hash: string,
    status: ApiKeyStatus,
    last_use: string,
    last_modified: string,
    created_on: string
}