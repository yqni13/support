import { DemoLimitsCountDTO, DemoLimitsResponseDTO, DemoLimitsUpdateDTO } from "../dtos/demo-limits.dto";
import demoLimitsModel from "../models/demo-limits.model";
import demoLimitsRepository from "../repositories/demo-limits.repository";
import * as Utils from "../utils/common.utils";

class DemoLimitsService {
    private timeMapTargets: string[];

    constructor() {
        this.timeMapTargets = ['last_modified'];
    }

    async getDemoLimitCount(dto: DemoLimitsCountDTO): Promise<number> {
        const result = await demoLimitsRepository.count(dto);
        return demoLimitsModel.mapCounts(result);
    }

    async createDemoLimit(): Promise<DemoLimitsResponseDTO> {
        const timestamp = new Date();
        const entity = {
            day: Utils.getDateUTC(timestamp),
            count: 1,
            last_modified: Utils.getTimestampUTC(timestamp)
        };
        const result = await demoLimitsRepository.create(entity);
        return Utils.mapObjTimestamps<DemoLimitsResponseDTO>(result, this.timeMapTargets);
    }

    async updateDemoLimit(): Promise<DemoLimitsResponseDTO | null> {
        const timestamp = new Date();
        const dto: DemoLimitsUpdateDTO = {
            day: Utils.getDateUTC(timestamp),
            last_modified: Utils.getTimestampUTC(timestamp)
        };
        const result = await demoLimitsRepository.update(dto);
        return !result ? null : Utils.mapObjTimestamps<DemoLimitsResponseDTO>(result, this.timeMapTargets);
    }
}

export default new DemoLimitsService();