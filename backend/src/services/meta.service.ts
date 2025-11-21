import { MaintenanceResponseDTO, MaintenanceUpdateDTO, MetaResponseDTO, MetaUpdateDTO } from '../dtos/meta.dto';
import { IRepoError } from '../repositories/interfaces/error.repository.interface';
import metaRepository from '../repositories/meta.repository';
import * as Utils from "../utils/common.utils";

class MetaService {
    private timeMapTargets: string[];

    constructor() {
        this.timeMapTargets = ['build_on', 'created_on', 'last_modified'];
    }

    async getMetaById(id: number): Promise<MetaResponseDTO | IRepoError | null> {
        let result = await metaRepository.findById(id);
        result = !result || Utils.isIRepoError(result) 
            ? result
            : (Utils.mapObjToApi(result as MetaResponseDTO, this.timeMapTargets)) as MetaResponseDTO;
        return result;
    }

    async getMetaByName(name: string): Promise<MetaResponseDTO | IRepoError | null> {
        let result = await metaRepository.findByName(name);
        result = !result || Utils.isIRepoError(result)
            ? result
            : (Utils.mapObjToApi(result as MetaResponseDTO, this.timeMapTargets)) as MetaResponseDTO;
        return result;
    }

    async getAllData(): Promise<MetaResponseDTO[] | IRepoError | null> {
        let result = await metaRepository.findAll();
        result = !result || Utils.isIRepoError(result) 
            ? result
            : Utils.mapArrayToApi(result as MetaResponseDTO[], this.timeMapTargets);
        return result;
    }

    async updateMetaData(id: number, dto: MetaUpdateDTO): Promise<MetaResponseDTO | IRepoError | null> {
        dto.last_modified = Utils.getTimestampUTC();
        let result = await metaRepository.update(id, dto);
        result = !result || Utils.isIRepoError(result)
            ? result
            : (Utils.mapObjToApi(result as MetaResponseDTO, this.timeMapTargets)) as MetaResponseDTO;
        return result;
    }

    async getMaintenanceMode(name: string): Promise<MaintenanceResponseDTO | IRepoError | null> {
        let result = await metaRepository.findMaintenance(name);
        result = !result || Utils.isIRepoError(result)
            ? result
            : (Utils.mapObjToApi(result as MaintenanceResponseDTO, this.timeMapTargets)) as MaintenanceResponseDTO;
        return result;
    }

    async setMaintenanceMode(name: string, dto: MaintenanceUpdateDTO): Promise<MaintenanceResponseDTO | IRepoError | null> {
        dto.last_modified = Utils.getTimestampUTC();
        let result = await metaRepository.updateMaintenance(name, dto);
        result = !result || Utils.isIRepoError(result)
            ? result
            : (Utils.mapObjToApi(result as MaintenanceResponseDTO, this.timeMapTargets)) as MaintenanceResponseDTO;
        return result;
    }
}

export default new MetaService();