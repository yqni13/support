import {
    ClientsCreateDTO,
    ClientsCreateResponseDTO,
    ClientsExistResponseDTO,
    ClientsLastUseResponseDTO,
    ClientsStatusResponseDTO,
    ClientsStatusUpdateDTO
} from "../dtos/clients.dto";
import { IRepoError } from "../repositories/interfaces/error.repository.interface";
import clientsModel from '../models/clients.model';
import * as Utils from '../utils/common.utils';
import clientsRepository from '../repositories/clients.repository';
import { Clients } from "../repositories/interfaces/clients.entity.interface";

class ClientsService {
    /**
     * @description Usage for apikey authentication in auth.middleware.ts.
     */
    async findByActiveKey(key: string): Promise<ClientsExistResponseDTO | IRepoError | null> {
        const hash = Utils.mapKeyToHash(key);
        let result = await clientsRepository.findByActiveKey(hash);
        result = !result || Utils.isIRepoError(result)
            ? null
            : (clientsModel.mapObjToApi(result as ClientsExistResponseDTO)) as ClientsExistResponseDTO;
        return result;
    }

    async findStatusByName(name: string): Promise<ClientsStatusResponseDTO | IRepoError | null> {
        let result = await clientsRepository.findStatusByName(name);
        if(!result) {
            return result;
        } else if(Utils.isIRepoError(result)) {
            return result as IRepoError;
        } else {
            return clientsModel.mapToStatusResponseDTO(result as Clients);
        }
    }

    async createClient(dto: ClientsCreateDTO): Promise<ClientsCreateResponseDTO | IRepoError | null> {
        const id = Utils.generateUUID();
        const apiKey = clientsModel.generateApiKeyObj();
        let result = await clientsRepository.create(id, apiKey.keyHash, dto);
        if(!result) {
            return result;
        } else if(Utils.isIRepoError(result)) {
            return result as IRepoError;
        } else {
            return clientsModel.mapToCreateResponseDTO(result as Clients, apiKey.keyRaw);
        }
    }

    async updateStatus(id: string, dto: ClientsStatusUpdateDTO): Promise<ClientsStatusResponseDTO | IRepoError | null> {
        let result = await clientsRepository.updateStatus(id, dto);
        if(!result) {
            return result;
        } else if(Utils.isIRepoError(result)) {
            return result as IRepoError;
        } else {
            return clientsModel.mapToStatusResponseDTO(result as Clients);
        }
    }

    async updateLastUse(id: string): Promise<ClientsLastUseResponseDTO | IRepoError | null> {
        let result = await clientsRepository.updateLastUse(id);
        if(!result) {
            return result;
        } else if(Utils.isIRepoError(result)) {
            return result as IRepoError;
        } else {
            return clientsModel.mapToLastUseResponseDTO(result as Clients);
        }
    }
}

export default new ClientsService();