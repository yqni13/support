import * as pg from 'pg';
import { secrets } from '../utils/secrets.utils';
import { DBConnectionException, DBEmptyException } from '../utils/exceptions/db.exception';
import { ErrorStatusCodes } from '../utils/errorStatusCodes.utils';
import { EnvMode } from '../utils/enums/env-mode.enum';
import { logError } from '../utils/common.utils';

// Global setting to parse certain db data to specific types:
// 1082: type Date [yyyy-mm-dd] - otherwise Date will be returned as full timestamp + time zone changes
pg.types.setTypeParser(1082, (val) => val);

export class DBConnection {
    private static instance: DBConnection;
    #pool: pg.Pool;

    constructor() {
        const connectionString = this._getConnectionString(secrets.ENV_MODE);
        this.#pool = new pg.Pool({connectionString});
    }

    static getInstance(): DBConnection {
        if(!DBConnection.instance) {
            DBConnection.instance = new DBConnection();
        }
        return DBConnection.instance;
    }

    _getConnectionString(env: string) {
        // Remove white spaces to be comparable with enum values.
        env = env.trim() as EnvMode;
        let db: string;
        let user: string;
        let pass: string;
        let host: string;
        let port: string | number;
        if(env === EnvMode.TEST) {
            db = secrets.DB_TEST_DATABASE;
            user = secrets.DB_TEST_USER;
            pass = secrets.DB_TEST_PASS;
            host = secrets.DB_TEST_HOST;
            port = process.env.DB_TEST_PORT ?? secrets.DB_TEST_PORT;
        } else {
            db = secrets.DB_DATABASE;
            user = secrets.DB_USER;
            pass = secrets.DB_PASS;
            host = secrets.DB_HOST;
            port = secrets.DB_PORT;
        }
        let connectionString: string;
        if(env === EnvMode.PROD || env === EnvMode.STAG) {
            connectionString = `postgresql://${user}:${pass}@${host}/${db}?sslmode=require`;
        } else {
            connectionString = `postgresql://${user}:${pass}@${host}:${port}/${db}`;
        }
        return connectionString;
    }

    async init() {
        const client = await this.connect();
        try {
            const results = await client.query(`SELECT * FROM meta;`);
            if(!results || results.rowCount === 0) {
                const error: any = new Error('DB ERROR CONNECTION NO DATA');
                error.code = ErrorStatusCodes.DBEmptyException;
                throw error;
            }
        } catch(error: any) {
            error.code = !error.code ? ErrorStatusCodes.DBConnectionException : error.code;
            logError(
                "DB ERROR CONNECTION INIT",
                "SUPPORT_DBConnection_init",
                error
            );
            if(error.code === ErrorStatusCodes.DBEmptyException) {
                throw new DBEmptyException(error);
            } else {
                throw new DBConnectionException(error);
            }
        } finally {
            await this.close(client);
        }
        if(secrets.ENV_MODE.trim() === EnvMode.DEV) {
            console.log("DB COMMUNICATION: SUCCESS");
        }
    }

    async connect(): Promise<pg.PoolClient> {
        try {
            const client = await this.#pool.connect();
            return client;
        } catch(error: any) {
            logError(
                "DB ERROR CONNECTION CONNECT",
                "SUPPORT_DBConnection_connect",
                error
            );
            throw new DBConnectionException(error);
        }
    }

    async close(client: pg.PoolClient) {
        try {
            client.release(true);
        } catch(error: any) {
            logError(
                "DB ERROR CONNECTION CLOSE",
                "SUPPORT_DBConnection_close",
                error
            );
            throw new DBConnectionException(error);
        }
    }

    async shutdown() {
        await this.#pool.end();
    }
}