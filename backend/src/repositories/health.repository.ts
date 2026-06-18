import { DBConnection } from "../configs/db";
import { HealthCheckDatabase } from "../services/interfaces/health.interface.service";

class HealthRepository {
    async checkDatabase(): Promise<HealthCheckDatabase> {
        const sql = 'SELECT 1';
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            await client.query(sql);
            return { status: 'ok' };
        } catch(err: unknown) {
            return {
                status: 'error',
                message: err instanceof Error ? err.message : 'Unknown error'
            }
        } finally {
            await db.close(client);
        }
    }
}

export default new HealthRepository();