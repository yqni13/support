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
import * as Utils from '../utils/common.utils';
import clientsRepository from '../repositories/clients.repository';
import { Clients } from "../repositories/interfaces/clients.entity.interface";

class ClientsService {
    private timeMapTargets: string[];

    constructor() {
        this.timeMapTargets = ['last_use', 'last_modified', 'created_on'];
    }

    /**
     * @description Usage for testing purpose.
     */
    async getClientById(id: string): Promise<ClientsExistResponseDTO | null> {
        const result = await clientsRepository.findById(id);
        return !result ? null : Utils.mapObjTimestamps<ClientsExistResponseDTO>(result, this.timeMapTargets);
    }

    /**
     * @description Usage for apikey authentication in auth.middleware.ts.
     */
    async getClientByActiveKey(key: string): Promise<ClientsExistResponseDTO | null> {
        const hash = Utils.mapKeyToHash(key);
        const result = await clientsRepository.findByActiveKey(hash);
        return !result ? null : Utils.mapObjTimestamps<ClientsExistResponseDTO>(result, this.timeMapTargets);
    }

    async getClientStatusByName(name: string): Promise<ClientsStatusResponseDTO | null> {
        const result = await clientsRepository.findStatusByName(name);
        return !result ? null : clientsModel.mapToStatusResponseDTO(result as Clients);
    }

    async createClient(dto: ClientsCreateDTO): Promise<ClientsCreateResponseDTO> {
        const clientsCreateObj = clientsModel.generateClientsCreateObj(dto);
        const result = await clientsRepository.create(clientsCreateObj.client);
        return clientsModel.mapToCreateResponseDTO(result as Clients, clientsCreateObj.keyRaw);
    }

    async updateClientFlag(id: string, dto: ClientsFlagUpdateDTO): Promise<ClientsFlagResponseDTO | null> {
        dto.last_modified = Utils.getTimestampUTC();
        const result = await clientsRepository.updateFlag(id, dto);
        // TODO(yqni13): customized mappers necessary or mapObjTimestamps all we need?
        return !result ? null : Utils.mapObjTimestamps<Clients>(result, this.timeMapTargets);
    }

    async updateClientStatus(id: string, dto: ClientsStatusUpdateDTO): Promise<ClientsStatusResponseDTO | null> {
        dto.last_modified = Utils.getTimestampUTC();
        const result = await clientsRepository.updateStatus(id, dto);
        return !result ? null : clientsModel.mapToStatusResponseDTO(result as Clients);
    }

    async updateClientLastUse(id: string): Promise<ClientsLastUseResponseDTO | null> {
        const dto: ClientsLastUseUpdateDTO = { last_use: Utils.getTimestampUTC() };
        const result = await clientsRepository.updateLastUse(id, dto);
        return !result ? null : clientsModel.mapToLastUseResponseDTO(result as Clients);
    }
}

export default new ClientsService();