import healthModel from "../models/health.model";
import healthRepository from "../repositories/health.repository";
import { EnvMode } from "../utils/enums/env-mode.enum";
import { secrets } from "../utils/secrets.utils";
import { HealthCheckExtended } from "./interfaces/health.interface.service";

class HealthService {
    async getHealthCheckDetails(): Promise<HealthCheckExtended> {
        const statusDatabase = await healthRepository.checkDatabase();
        const statusMemory = healthModel.checkMemory();
        return {
            status: statusDatabase && statusMemory ? 200 : 503,
            environment: secrets.ENV_MODE.trim() as EnvMode,
            db: statusDatabase,
            memory: statusMemory,
        };
    }
}

export default new HealthService();