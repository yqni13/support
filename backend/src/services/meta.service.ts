import {
    MaintenanceResponseDTO,
    MetaResponseDTO,
    MetaUpdateDTO,
    MaintenanceUpdateDTO,
    DemoModusDTO
} from '../dtos/meta.dto';
import metaRepository from '../repositories/meta.repository';
import * as Utils from "../utils/common.utils";
import { DemoMode } from '../utils/enums/demo-mode.enum';

class MetaService {
    private timeMapTargets: string[];

    constructor() {
        this.timeMapTargets = ['build_on', 'created_on', 'last_modified'];
    }

    async getMetaById(id: number): Promise<MetaResponseDTO | null> {
        let result = await metaRepository.findById(id);
        return !result ? null : Utils.mapObjTimestamps<MetaResponseDTO>(result, this.timeMapTargets);
    }

    async getMetaByName(name: string): Promise<MetaResponseDTO | null> {
        let result = await metaRepository.findByName(name);
        return !result ? null : Utils.mapObjTimestamps<MetaResponseDTO>(result, this.timeMapTargets);
    }

    async getAllMeta(): Promise<MetaResponseDTO[] | null> {
        let result = await metaRepository.findAll();
        return !result ? null : Utils.mapArrayTimestamps<MetaResponseDTO>(result, this.timeMapTargets);
    }

    async updateMeta(id: number, dto: MetaUpdateDTO): Promise<MetaResponseDTO | null> {
        dto.last_modified = Utils.getTimestampUTC();
        let result = await metaRepository.update(id, dto);
        return !result ? null : Utils.mapObjTimestamps<MetaResponseDTO>(result, this.timeMapTargets);
    }

    async getMaintenanceMode(name: string): Promise<MaintenanceResponseDTO | null> {
        let result = await metaRepository.findMaintenance(name);
        return !result ? null : Utils.mapObjTimestamps<MaintenanceResponseDTO>(result, this.timeMapTargets);
    }

    async updateMaintenanceMode(name: string, dto: MaintenanceUpdateDTO): Promise<MaintenanceResponseDTO | null> {
        dto.last_modified = Utils.getTimestampUTC();
        let result = await metaRepository.updateMaintenance(name, dto);
        return !result ? null : Utils.mapObjTimestamps<MaintenanceResponseDTO>(result, this.timeMapTargets);
    }

    // DEMO SERVICE CALL
    async searchDemoByPayload(dto: DemoModusDTO): Promise<Record<string, string>> {
        let result: any;
        switch(dto.demo_mode) {
            case(DemoMode.SUCCESS): {
                result = await metaRepository.findById(1);
                result = { app_version: (result as MetaResponseDTO).app_version };
                break;
            }
            case(DemoMode.ERROR): {
                await metaRepository.demoError(); // Expecting exception => no need to assign result.
                break;
            }
            case(undefined): // Payload is an empty object / array.
            default:
                result = { message: 'no app info for an empty payload :)' };
        }
        return result;
    }
}

export default new MetaService();