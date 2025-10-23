import { Pool, PoolClient } from 'pg';
import { secrets } from '../utils/secrets.utils';
import { DBConnectionException, DBEmptyException } from '../utils/exceptions/db.exception';
import { ErrorStatusCodes } from '../utils/errorStatusCodes.utils';
import { EnvMode } from '../utils/enums/env-mode.enum';

export class DBConnection {
    private static instance: DBConnection;
    #pool: Pool;

    constructor() {
        const connectionString = this._getConnectionString(secrets.MODE);
        this.#pool = new Pool({connectionString});
    }

    static getInstance(): DBConnection {
        if(!DBConnection.instance) {
            DBConnection.instance = new DBConnection();
        }
        return DBConnection.instance;
    }

    _getConnectionString(env: string = (process.env.ENV_MODE ?? EnvMode.DEV)?.trim() as EnvMode) {
        let db: string = '';
        let user: string = '';
        let pass: string = '';
        let host: string = '';
        let port: string | number = 0;
        switch(env) {
            case(EnvMode.DEV): {
                db = secrets.DB_LOCAL_DB;
                user = secrets.DB_LOCAL_USER;
                pass = secrets.DB_LOCAL_PASS;
                host = secrets.DB_LOCAL_HOST;
                port = secrets.DB_LOCAL_PORT;
                break;
            }
            case(EnvMode.STAG): {
                db = secrets.DB_STAG_DB;
                user = secrets.DB_STAG_USER;
                pass = secrets.DB_STAG_PASS;
                host = secrets.DB_STAG_HOST;
                port = secrets.DB_STAG_PORT;
                break;
            }
            case(EnvMode.PROD): {
                db = secrets.DB_PROD_DB;
                user = secrets.DB_PROD_USER;
                pass = secrets.DB_PROD_PASS;
                host = secrets.DB_PROD_HOST;
                port = secrets.DB_PROD_PORT;
                break;
            }
            case(EnvMode.TEST): 
            default: {
                db = secrets.DB_TEST_DB;
                user = secrets.DB_TEST_USER;
                pass = secrets.DB_TEST_PASS;
                host = secrets.DB_TEST_HOST;
                port = process.env.DB_TEST_PORT ?? secrets.DB_TEST_PORT;
            }
        }
        let connectionString = '';
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
                const error: any = new Error();
                error.code = ErrorStatusCodes.DBEmptyException;
                throw error;
            }
        } catch(error: any) {
            // TODO(yqni13): logging
            if(error.code === ErrorStatusCodes.DBEmptyException) {
                throw new DBEmptyException();
            } else {
                throw new DBConnectionException(error);
            }
        } finally {
            await this.close(client);
        }
        if(secrets.MODE === EnvMode.DEV) {
            console.log("DB COMMUNICATION: SUCCESS");
        }
    }

    async connect(): Promise<PoolClient> {
        try {
            const client = await this.#pool.connect();
            return client;
        } catch(error: any) {
            // Get ENV_MODE without white-spaces or comparison will fail.
            const envMode = (process.env.ENV_MODE?.trim() as EnvMode);
            if(envMode === EnvMode.TEST || envMode === EnvMode.DEV) {
                console.log("DBConnection, fn: connect() ERROR: ", error);
            } else {
                // TODO(yqni13): logging
            }
            throw new DBConnectionException('server-535-auth#database');
        }
    }

    async close(client: PoolClient) {
        try {
            client.release(true);
        } catch(error: any) {
            // Get ENV_MODE without white-spaces or comparison will fail.
            const envMode = (process.env.ENV_MODE?.trim() as EnvMode);
            if(envMode === EnvMode.TEST || envMode === EnvMode.DEV) {
                console.log("DBConnection, fn: close() ERROR: ", error);
            } else {
                // TODO(yqni13): logging
            }
            throw new DBConnectionException('server-535-auth#database');
        }
    }

    async shutdown() {
        await this.#pool.end();
    }
}