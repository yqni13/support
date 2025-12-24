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
            const userData = dbTestData.getUsersInsertSql();
            await this.client.query(userData.sql, userData.values);
            const ticketData = dbTestData.getTicketsInsertSql();
            await this.client.query(ticketData.sql, ticketData.values);
            const rateLimitData = dbTestData.getRateLimitsInsertSql();
            await this.client.query(rateLimitData.sql, rateLimitData.values);
            const demoLimitData = dbTestData.getDemoLimitsInsertSql();
            await this.client.query(demoLimitData.sql, demoLimitData.values);
            await this.client.query('COMMIT');
        } catch (err: any) {
            await this.client.query('ROLLBACK');
            throw new Error('TESTCONTAINER ERROR INSERT TEST DATA');
        }
    }

    async clearTables() {
        const dbTestData = DBTestData.getInstance();
        let tables: string[] = dbTestData.getDatabaseTables().reverse();

        // ForEach does not wait for async process to finish.
        await this.client.query('BEGIN');
        for(const table of tables) {
            // 'RESTART IDENTITY' because some tables use auto-incremented id's.
            await this.client.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE;`);
        }
        await this.client.query('COMMIT');
    }
}