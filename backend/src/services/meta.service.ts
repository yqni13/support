import {
    MaintenanceResponseDTO,
    MetaResponseDTO,
    MetaUpdateDTO,
    MaintenanceUpdateDTO,
} from '../dtos/meta.dto';
import metaRepository from '../repositories/meta.repository';
import * as CommonUtils from "../utils/common.utils";

class MetaService {
    private timeMapTargets: string[];

    constructor() {
        this.timeMapTargets = ['build_on', 'created_on', 'last_modified'];
    }

    async getMetaById(id: number): Promise<MetaResponseDTO | null> {
        const result = await metaRepository.findById(id);
        return !result ? null : CommonUtils.mapObjTimestamps<MetaResponseDTO>(result, this.timeMapTargets);
    }

    async getMetaByName(name: string): Promise<MetaResponseDTO | null> {
        const result = await metaRepository.findByName(name);
        return !result ? null : CommonUtils.mapObjTimestamps<MetaResponseDTO>(result, this.timeMapTargets);
    }

    async getAllMeta(): Promise<MetaResponseDTO[] | null> {
        const result = await metaRepository.findAll();
        return !result ? null : CommonUtils.mapArrayTimestamps<MetaResponseDTO>(result, this.timeMapTargets);
    }

    async updateMeta(id: number, dto: MetaUpdateDTO): Promise<MetaResponseDTO | null> {
        dto.last_modified = CommonUtils.getTimestampUTC();
        const result = await metaRepository.update(id, dto);
        return !result ? null : CommonUtils.mapObjTimestamps<MetaResponseDTO>(result, this.timeMapTargets);
    }

    async getMaintenanceMode(name: string): Promise<MaintenanceResponseDTO | null> {
        const result = await metaRepository.findMaintenance(name);
        return !result ? null : CommonUtils.mapObjTimestamps<MaintenanceResponseDTO>(result, this.timeMapTargets);
    }

    async updateMaintenanceMode(id: number, dto: MaintenanceUpdateDTO): Promise<MaintenanceResponseDTO | null> {
        dto.last_modified = CommonUtils.getTimestampUTC();
        const result = await metaRepository.updateMaintenance(id, dto);
        return !result ? null : CommonUtils.mapObjTimestamps<MaintenanceResponseDTO>(result, this.timeMapTargets);
    }
}

export default new MetaService();