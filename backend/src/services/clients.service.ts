import {
    ClientsCreateDTO,
    ClientsCreateResponseDTO,
    ClientsExistResponseDTO,
    ClientsFlagResponseDTO,
    ClientsFlagUpdateDTO,
    ClientsLastUseResponseDTO,
    ClientsLastUseUpdateDTO,
    ClientsStatusResponseDTO,
    ClientsStatusUpdateDTO
} from "../dtos/clients.dto";
import clientsModel from '../models/clients.model';
import * as CommonUtils from '../utils/common.utils';
import clientsRepository from '../repositories/clients.repository';
import { Clients, ClientsId } from "../repositories/interfaces/clients.entity.interface";

class ClientsService {
    private timeMapTargets: string[];

    constructor() {
        this.timeMapTargets = ['last_use', 'last_modified', 'created_on'];
    }

    /**
     * @description Usage for testing purpose.
     */
    async getClientById(id: ClientsId): Promise<ClientsExistResponseDTO | null> {
        const result = await clientsRepository.findById(id);
        return !result ? null : CommonUtils.mapObjTimestamps<ClientsExistResponseDTO>(result, this.timeMapTargets);
    }

    /**
     * @description Usage for apikey authentication in auth.middleware.ts.
     */
    async getClientByActiveKey(key: string): Promise<ClientsExistResponseDTO | null> {
        const hash = CommonUtils.mapKeyToHash(key);
        const result = await clientsRepository.findByActiveKey(hash);
        return !result ? null : CommonUtils.mapObjTimestamps<ClientsExistResponseDTO>(result, this.timeMapTargets);
    }

    async getClientStatusByName(name: string): Promise<ClientsStatusResponseDTO | null> {
        const result = await clientsRepository.findStatusByName(name);
        return !result ? null : CommonUtils.mapObjTimestamps<ClientsStatusResponseDTO>(result, this.timeMapTargets);
    }

    async createClient(dto: ClientsCreateDTO): Promise<ClientsCreateResponseDTO> {
        const clientsCreateObj = clientsModel.generateClientsCreateObj(dto);
        const result = await clientsRepository.create(clientsCreateObj.client);
        return clientsModel.mapToCreateResponseDTO(result as Clients, clientsCreateObj.keyRaw);
    }

    async updateClientFlag(id: ClientsId, dto: ClientsFlagUpdateDTO): Promise<ClientsFlagResponseDTO | null> {
        dto.last_modified = CommonUtils.getTimestampUTC();
        const result = await clientsRepository.updateFlag(id, dto);
        return !result ? null : CommonUtils.mapObjTimestamps<ClientsFlagResponseDTO>(result, this.timeMapTargets);
    }

    async updateClientStatus(id: ClientsId, dto: ClientsStatusUpdateDTO): Promise<ClientsStatusResponseDTO | null> {
        dto.last_modified = CommonUtils.getTimestampUTC();
        const result = await clientsRepository.updateStatus(id, dto);
        return !result ? null : CommonUtils.mapObjTimestamps<ClientsStatusResponseDTO>(result, this.timeMapTargets);
    }

    async updateClientLastUse(id: ClientsId): Promise<ClientsLastUseResponseDTO | null> {
        const dto: ClientsLastUseUpdateDTO = { last_use: CommonUtils.getTimestampUTC() };
        const result = await clientsRepository.updateLastUse(id, dto);
        return !result ? null : CommonUtils.mapObjTimestamps<ClientsLastUseResponseDTO>(result, this.timeMapTargets);
    }
}

export default new ClientsService();