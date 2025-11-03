import { MaintenanceResponseDTO, MaintenanceUpdateDTO, MetaResponseDTO, MetaUpdateDTO } from '../dtos/meta.dto';
import { IRepoError } from '../repositories/interfaces/error.repository.interface';
import metaRepository from '../repositories/meta.repository';
import metaModel from '../models/meta.model';
import * as Utils from "../utils/common.utils";

class MetaService {
    async getMetaData(id: number): Promise<MetaResponseDTO | IRepoError | null> {
        let result = await metaRepository.findById(id);
        result = !result || Utils.isIRepoError(result) ? result : metaModel.mapMetaToApi(result as MetaResponseDTO);
        return result;
    }

    async getAllData(): Promise<MetaResponseDTO[] | IRepoError | null> {
        let result = await metaRepository.findAll();
        result = !result || Utils.isIRepoError(result) ? result : metaModel.mapArrayToApi(result as MetaResponseDTO[]);
        return result;
    }

    async updateMetaData(id: number, dto: MetaUpdateDTO): Promise<MetaResponseDTO | IRepoError | null> {
        let result = await metaRepository.update(id, dto);
        result = !result || Utils.isIRepoError(result) ? result : metaModel.mapMetaToApi(result as MetaResponseDTO);
        return result;
    }

    async getMaintenanceMode(id: number): Promise<MaintenanceResponseDTO | IRepoError | null> {
        let result = await metaRepository.findMaintenance(id);
        result = !result || Utils.isIRepoError(result) ? result : metaModel.mapMaintenanceToApi(result as MaintenanceResponseDTO);
        return result;
    }

    async setMaintenanceMode(id: number, dto: MaintenanceUpdateDTO): Promise<MaintenanceResponseDTO | IRepoError | null> {
        let result = await metaRepository.updateMaintenance(id, dto);
        result = !result || Utils.isIRepoError(result) ? result : metaModel.mapMaintenanceToApi(result as MaintenanceResponseDTO);
        return result;
    }
}

export default new MetaService();