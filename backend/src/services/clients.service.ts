import { ClientsCreateResponseDTO, ClientsExistResponseDTO } from "../dtos/clients.dto";
import { IRepoError } from "../repositories/interfaces/error.repository.interface";
import clientsModel from '../models/clients.model';
import * as Utils from '../utils/common.utils';
import clientsRepository from '../repositories/clients.repository';
import { Clients } from "../repositories/interfaces/clients.entity.interface";


class ClientsService {
    /**
     * @description Usage for apikey authentication in auth.middleware.ts.
     */
    async findByKey(key: string): Promise<ClientsExistResponseDTO | IRepoError | null> {
        const hash = clientsModel.mapKeyToHash(key);
        let result = await clientsRepository.findByKey(hash);
        result = !result || Utils.isIRepoError(result)
            ? null
            : (clientsModel.mapObjToApi(result as ClientsExistResponseDTO)) as ClientsExistResponseDTO;
        return result;
    }

    async createClient(name: string): Promise<ClientsCreateResponseDTO | IRepoError | null> {
        const id = Utils.generateUUID();
        const apiKey = clientsModel.generateApiKeyObj();
        let result = await clientsRepository.create(id, name, apiKey.keyHash);
        if(!result) {
            return result;
        } else if(Utils.isIRepoError(result)) {
            return result as IRepoError;
        } else {
            return clientsModel.mapToResponseDTO(result as Clients, apiKey.keyRaw);
        }
    }
}

export default new ClientsService();