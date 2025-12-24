import {
    ClientsCreateDTO,
    ClientsCreateResponseDTO,
    ClientsLastUseResponseDTO,
    ClientsStatusResponseDTO
} from "../dtos/clients.dto";
import { Clients } from "../repositories/interfaces/clients.entity.interface";
import crypto from 'crypto';
import * as Utils from "../utils/common.utils";
import { ApiKeyStatus } from "../utils/enums/api-key-status.enum";

class ClientsModel {
    private timeMapTargets: string[];

    constructor() {
        this.timeMapTargets = ['last_use', 'last_modified', 'created_on'];
    }

    mapToCreateResponseDTO(data: Clients, apiKey: string): ClientsCreateResponseDTO {
        data = Utils.mapObjTimestamps(data, this.timeMapTargets);
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

    mapToStatusResponseDTO(data: Clients): ClientsStatusResponseDTO {
        data = Utils.mapObjTimestamps(data, this.timeMapTargets);
        return {
            client_id: data.client_id,
            name: data.name,
            status: data.status,
            last_use: data.last_use,
            last_modified: data.last_modified,
            created_on: data.created_on
        };
    }

    mapToLastUseResponseDTO(data: Clients): ClientsLastUseResponseDTO {
        data = Utils.mapObjTimestamps(data, this.timeMapTargets);
        return {
            client_id: data.client_id,
            name: data.name,
            last_use: data.last_use,
            last_modified: data.last_modified,
            created_on: data.created_on
        };
    }

    _generateApiKeyObj(): { keyRaw: string, keyHash: string } {
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
        const id = Utils.generateUUID();
        const keyObj = this._generateApiKeyObj();
        const timestamp = Utils.getTimestampUTC();
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