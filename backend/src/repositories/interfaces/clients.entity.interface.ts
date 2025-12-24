import { ApiKeyStatus } from "../../utils/enums/api-key-status.enum";
import { Flag } from "../../utils/enums/flag.enum";

export interface Clients {
    client_id: string,
    name: string,
    api_key_hash: string,
    status: ApiKeyStatus,
    flag: Flag | null,
    last_use: string,
    last_modified: string,
    created_on: string
}