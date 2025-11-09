import { ClientsCreateResponseDTO, ClientsLastUseResponseDTO, ClientsStatusResponseDTO } from "../dtos/clients.dto";
import { Clients } from "../repositories/interfaces/clients.entity.interface";
import { getTimestampWithoutOffsetInfo as convert } from "../utils/common.utils";
import crypto from 'crypto';

class ClientsModel {
    mapObjToApi(data: Clients): Clients {
        return {
            ...data,
            last_use: convert(new Date(data.last_use)),
            last_modified: convert(new Date(data.last_modified)),
            created_on: convert(new Date(data.created_on))
        }
    }

    mapToCreateResponseDTO(data: Clients, apiKey: string): ClientsCreateResponseDTO {
        data = this.mapObjToApi(data);
        return {
            client_id: data.client_id,
            name: data.name,
            api_key: apiKey,
            status: data.status,
            last_use: data.last_use,
            last_modified: data.last_modified,
            created_on: data.created_on
        };
    }

    mapToStatusResponseDTO(data: Clients): ClientsStatusResponseDTO {
        data = this.mapObjToApi(data);
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
        data = this.mapObjToApi(data);
        return {
            client_id: data.client_id,
            name: data.name,
            last_use: data.last_use,
            last_modified: data.last_modified,
            created_on: data.created_on
        };
    }

    generateApiKeyObj(): { keyRaw: string, keyHash: string } {
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

    mapKeyToHash(key: string): string {
        return crypto.createHash('sha256').update(key).digest('hex');
    }
}

export default new ClientsModel();