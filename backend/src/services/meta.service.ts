import { MetaResponseDTO, MetaUpdateDTO } from '../dtos/meta.dto';
import { IRepoError } from '../repositories/interfaces/error.repository.interface';
import metaRepository from '../repositories/meta.repository';
import metaModel from '../models/meta.model';
import * as Utils from "../utils/common.utils";

class MetaService {
    async getMetaData(id: number): Promise<MetaResponseDTO | IRepoError | null> {
        let result = await metaRepository.findById(id);
        result = !result || Utils.isIRepoError(result) ? result : metaModel.mapToApi(result as MetaResponseDTO);
        return result;
    }

    async updateMetaData(id: number, dto: MetaUpdateDTO): Promise<MetaResponseDTO | IRepoError | null> {
        let result = await metaRepository.update(id, dto);
        result = !result || Utils.isIRepoError(result) ? result : metaModel.mapToApi(result as MetaResponseDTO);
        return result;
    }
}

export default new MetaService();