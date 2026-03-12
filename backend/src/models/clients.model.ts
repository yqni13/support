import {
    ClientsCreateDTO,
    ClientsCreateResponseDTO,
} from "../dtos/clients.dto";
import { Clients, ClientsId } from "../repositories/interfaces/clients.entity.interface";
import crypto from 'crypto';
import * as CommonUtils from "../utils/common.utils";
import { ApiKeyStatus } from "../utils/enums/api-key-status.enum";

class ClientsModel {
    private timeMapTargets: string[];

    constructor() {
        this.timeMapTargets = ['last_use', 'last_modified', 'created_on'];
    }

    toClientsCreateResponseDTO(data: Clients, apiKey: string): ClientsCreateResponseDTO {
        data = CommonUtils.mapObjTimestamps(data, this.timeMapTargets);
        return {
            client_id: data.client_id,
            name: data.name,
            api_key: apiKey,
            status: data.status,
            flag: data.flag,
            last_use: data.last_use,
            last_modified: data.last_modified,
            created_on: data.created_on
        };
    }

    private generateApiKeyObj(): { keyRaw: string, keyHash: string } {
        const keyLength = 42;
        const charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const bytes = crypto.randomBytes(keyLength);

        let key = '';
        for(let i = 0; i < keyLength; i++) {
            key += charset[bytes[i] % charset.length];
        }

        const hash = crypto.createHash('sha256').update(key).digest('hex');
        return { keyRaw: key, keyHash: hash };
    }

    generateClientsCreateObj(dto: ClientsCreateDTO): { client: Clients, keyRaw: string } {
        const id = CommonUtils.generateUUID<ClientsId>();
        const keyObj = this.generateApiKeyObj();
        const timestamp = CommonUtils.getTimestampUTC();
        const client: Clients = {
            client_id: id,
            name: dto.name,
            api_key_hash: keyObj.keyHash,
            status: ApiKeyStatus.ACTIVE,
            flag: null,
            last_use: timestamp,
            last_modified: timestamp,
            created_on: timestamp
        };
        return { client: client, keyRaw: keyObj.keyRaw };
    }
}

export default new ClientsModel();