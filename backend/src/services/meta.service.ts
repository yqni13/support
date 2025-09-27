import { MetaFindDTO, MetaResponseDTO } from '../dtos/meta.dto';
import { IRepoError } from '../repositories/interfaces/base.repository.interface';
import metaRepository from '../repositories/meta.repository';

class MetaService {
    async getMetaData(dto: MetaFindDTO): Promise<MetaResponseDTO | IRepoError | null> {
        const result = await metaRepository.findById(dto.id);
        return result;
    }
}

export default new MetaService();