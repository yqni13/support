export class DBTestData {
    private static instance: DBTestData;

    constructor() {
        //
    }

    static getInstance(): DBTestData {
        if(!DBTestData.instance) {
            DBTestData.instance = new DBTestData();
        }
        return DBTestData.instance;
    }

    getMetaInsertSql(): { sql: string, values: any[]} {
        const table = 'meta'
        const values = [1, 'support', 'yqni13', '2025-01-01T00:00:01.000z', 'staging', '0.0.1', '0.0.2', 'no-image', '0.0.3', '0.0.4', "2025-01-01T01:00:00.000Z", "2025-01-01T01:00:00.000Z"];
        return {
            sql: `INSERT INTO ${table}
            (id, app, author, build_on, environment, app_version, db_version, docker_image, docker_version, jenkins_version, created_on, last_modified)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`,
            values: values
        };
    }
}