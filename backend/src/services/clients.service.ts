import {
    ClientsCreateDTO,
    ClientsCreateResponseDTO,
    ClientsExtendedResponseDTO,
    ClientsFlagUpdateDTO,
    ClientsLastUseUpdateDTO,
    ClientsResponseDTO,
    ClientsStatusUpdateDTO
} from "../dtos/clients.dto";
import clientsModel from '../models/clients.model';
import * as CommonUtils from '../utils/common.utils';
import clientsRepository from '../repositories/clients.repository';
import { Clients, ClientsId } from "../repositories/interfaces/clients.entity.interface";

class ClientsService {

    /**
     * @description Usage for testing purpose.
     */
    async getClientById(id: ClientsId): Promise<ClientsExtendedResponseDTO | null> {
        const result: Clients | null = await clientsRepository.findById(id);
        return !result ? null : clientsModel.toClientsResponseDTO(result, true);
    }

    /**
     * @description Usage for apikey authentication in auth.middleware.ts.
     */
    async getClientByActiveKey(key: string): Promise<ClientsExtendedResponseDTO | null> {
        const hash = CommonUtils.mapKeyToHash(key);
        const result: Clients | null = await clientsRepository.findByActiveKey(hash);
        return !result ? null : clientsModel.toClientsResponseDTO(result, true);
    }

    async getClientStatusByName(name: string): Promise<ClientsResponseDTO | null> {
        const result: Clients | null = await clientsRepository.findStatusByName(name);
        return !result ? null : clientsModel.toClientsResponseDTO(result, false);
    }

    async createClient(dto: ClientsCreateDTO): Promise<ClientsCreateResponseDTO> {
        const clientsCreateObj = clientsModel.generateClientsCreateObj(dto);
        const result: Clients = await clientsRepository.create(clientsCreateObj.client);
        return clientsModel.toClientsCreateResponseDTO(result as Clients, clientsCreateObj.keyRaw);
    }

    async updateClientFlag(id: ClientsId, dto: ClientsFlagUpdateDTO): Promise<ClientsResponseDTO | null> {
        dto.last_modified = CommonUtils.getTimestampUTC();
        const result: Clients | null = await clientsRepository.updateFlag(id, dto);
        return !result ? null : clientsModel.toClientsResponseDTO(result, false);
    }

    async updateClientStatus(id: ClientsId, dto: ClientsStatusUpdateDTO): Promise<ClientsResponseDTO | null> {
        dto.last_modified = CommonUtils.getTimestampUTC();
        const result: Clients | null = await clientsRepository.updateStatus(id, dto);
        return !result ? null : clientsModel.toClientsResponseDTO(result, false);
    }

    async updateClientLastUse(id: ClientsId): Promise<ClientsResponseDTO | null> {
        const dto: ClientsLastUseUpdateDTO = { last_use: CommonUtils.getTimestampUTC() };
        const result: Clients | null = await clientsRepository.updateLastUse(id, dto);
        return !result ? null : clientsModel.toClientsResponseDTO(result, false);
    }
}

export default new ClientsService();