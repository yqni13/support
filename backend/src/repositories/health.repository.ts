import { DBConnection } from "../configs/db";

class HealthRepository {
    async checkDatabase(): Promise<any> {
        const sql = 'SELECT 1';
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            await client.query(sql);
            return { status: 'ok' };
        } catch(err: any) {
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