import { DemoLimits } from "../repositories/interfaces/demo-limits.entity.interface";

class DemoLimitsModel {
    mapCounts(data: DemoLimits[] | null): number {
        if(!data || data.length === 0) {
            return 0;
        }
        let count = 0;
        data.forEach((entry) => {
            count += entry.count;
        })
        return count;
    }
}

export default new DemoLimitsModel();