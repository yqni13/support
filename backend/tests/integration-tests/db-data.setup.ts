import { ApiKeyStatus } from "../../src/utils/enums/api-key-status.enum";
import { MaintenanceMode } from "../../src/utils/enums/maintenance-mode.enum";
import { secrets } from "../../src/utils/secrets.utils";

export class DBTestData {
    private static instance: DBTestData;
    private tableRecord: Record<string, string>;

    constructor() {
        this.tableRecord = {
            meta: 'meta',
            clients: 'clients'
        };
    }

    static getInstance(): DBTestData {
        if(!DBTestData.instance) {
            DBTestData.instance = new DBTestData();
        }
        return DBTestData.instance;
    }

    getDatabaseTables(): string[] {
        let tables: string[] = [];
        Object.values(this.tableRecord).forEach((table) => {
            tables.push(table);
        })
        return tables;
    }

    getMetaInsertSql(): { sql: string, values: any[] } {
        const sql = `INSERT INTO ${this.tableRecord['meta']}
        (id, app, author, build_on, environment, app_version, db_version, docker_image, docker_version, jenkins_version, maintenance_mode, created_on, last_modified)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
        `;
        const values = [1, 'support', 'yqni13', '2025-01-01T13:00:01.000Z', 'test', '0.0.1', '0.0.2', 'no-image', '0.0.3', '0.0.4', MaintenanceMode.E000, '2025-01-01T13:00:01.000Z', '2025-01-01T13:00:01.000Z'];
        return { sql: sql, values: values };
    }

    getClientsInsertSql(): { sql: string, values: any[] } {
        const sql = `INSERT INTO ${this.tableRecord['clients']}
        (client_id, name, api_key_hash, status, last_use, last_modified, created_on)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
        `;
        const values = ['9e024539-32e8-4317-8007-84a3956e6b57', 'TESTCLIENT', secrets.TEST_APIKEY_HASH, ApiKeyStatus.ACTIVE, '2025-01-01T14:00:01.000Z', '2025-01-01T14:00:01.000Z', '2025-01-01T14:00:01.000Z'];
        return { sql: sql, values: values };
    }
}