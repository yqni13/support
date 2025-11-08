import { Client } from "pg";
import { StartedTestContainer } from "testcontainers";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { DBTestData } from "./db-data.setup";

export class DBTestSetup {

    container!: StartedTestContainer;
    setupEnv: any;
    client!: Client;

    constructor() {
        //
    }

    async init() {
        const connectionData = {
            user: 'testuser',
            pass: 'testpass',
            db: 'testdb',
            port: 5432
        };

        this.container = await new PostgreSqlContainer("postgres:17")
            .withUsername(connectionData.user)
            .withPassword(connectionData.pass)
            .withDatabase(connectionData.db)
            .start();

        // Overwrite env var with temporary values.
        process.env.DB_TEST_HOST = this.container.getHost();
        process.env.DB_TEST_PORT = this.container.getMappedPort(connectionData.port).toString();

        this.client = new Client({
            port: this.container.getMappedPort(connectionData.port),
            host: this.container.getHost(),
            user: connectionData.user,
            password: connectionData.pass,
            database: connectionData.db
        });

        await this.client.connect();
    }

    async shutdown() {
        try {
            if(this.client) {
                await this.client.end();
            }
        } catch (err: any) {
            console.warn('TESTCONTAINER ERROR CLOSING CLIENT', err);
        }

        try {
            if(this.container) {
                await this.container.stop();
            }
        } catch (err: any) {
            console.warn('TESTCONTAINER ERROR STOPPING CONTAINER', err);
        }
    }


    async addTestData() {
        const dbTestData = DBTestData.getInstance();
        await this.client.query('BEGIN');
        try {
            const metaData = dbTestData.getMetaInsertSql();
            await this.client.query(metaData.sql, metaData.values);
            const clientData = dbTestData.getClientsInsertSql();
            await this.client.query(clientData.sql, clientData.values);
            await this.client.query('COMMIT');
        } catch (err: any) {
            await this.client.query('ROLLBACK');
            throw new Error('TESTCONTAINER ERROR INSERT TEST DATA');
        }
    }

    async clearTables(tables: string[]) {
        tables = tables.reverse();
        Object.values(tables).forEach(async (table) => {
            await this.client.query(`TRUNCATE TABLE ${table};`);
        });
    }
}