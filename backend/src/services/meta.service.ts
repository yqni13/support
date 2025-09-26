import { basicResponse } from '../utils/common.utils';

class MetaService {
    async getMetaData() {
        return basicResponse({demo: true}, 1, 'Success');
    }
}

export default new MetaService();