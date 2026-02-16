import { MetaResponseDTO } from '../dtos/meta.dto';
import { TestDemoDTO, TestErrorDTO } from '../dtos/test.dto';
import testModel from '../models/test.model';
import metaRepository from '../repositories/meta.repository';
import { DemoMode } from '../utils/enums/demo-mode.enum';

class TestService {
    async searchExceptionThrow(dto: TestErrorDTO) {
        testModel.throwExceptionOnTestPurpose(dto);
    }

    async searchDemoByPayload(dto: TestDemoDTO): Promise<Record<string, string>> {
        let result: any;
        switch(dto.demo_mode) {
            case(DemoMode.SUCCESS): {
                result = await metaRepository.findById(1);
                result = { app_version: (result as MetaResponseDTO).app_version };
                break;
            }
            case(DemoMode.ERROR): 
            default:
                await metaRepository.demoError(); // Expecting exception => no need to assign result.
        }
        return result;
    }
}

export default new TestService();