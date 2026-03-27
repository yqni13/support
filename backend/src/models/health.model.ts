import { HealthCheckMemory } from "../services/interfaces/health.interface.service";

class HealthModel {
    checkMemory(): HealthCheckMemory {
        const memory = process.memoryUsage();
        const toMB = (num: number) => `${Math.round(num / 1024 / 1024)}MB`;
        return {
            heapUsed: toMB(memory.heapUsed),
            heapTotal: toMB(memory.heapTotal),
            rss: toMB(memory.rss)
        }
    }
}

export default new HealthModel();