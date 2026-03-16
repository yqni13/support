import { ApiKeyStatus } from "../../utils/enums/api-key-status.enum";
import { Flag } from "../../utils/enums/flag.enum";

export type ClientsId = string & { readonly brand: unique symbol };

export interface Clients {
    client_id: ClientsId,
    name: string,
    api_key_hash: string,
    status: ApiKeyStatus,
    flag: Flag | null,
    last_use: string,
    last_modified: string,
    created_on: string
}