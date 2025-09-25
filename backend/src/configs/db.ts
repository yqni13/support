import { Pool, PoolClient } from 'pg';
import { secrets } from '../utils/secrets.utils';
import { DBConnectionException, DBEmptyException } from '../utils/exceptions/db.exception';
import { ErrorStatusCodes } from '../utils/errorStatusCodes.utils';

export class DBConnection {

    #pool: Pool;

    constructor() {
        const connectionString = this._getConnectionString(secrets.MODE);
        this.#pool = new Pool({connectionString});
    }

    _getConnectionString(env: string) {
        let db: string = '';
        let user: string = '';
        let pass: string = '';
        let host: string = '';
        let port: string | number = 0;
        if(env !== 'production') {
            db = secrets.DB_LOCAL_DB;
            user = secrets.DB_LOCAL_USER;
            pass = secrets.DB_LOCAL_PASS;
            host = secrets.DB_LOCAL_HOST;
            port = secrets.DB_LOCAL_PORT;
        } else {
            db = secrets.DB_DOCKER_DB;
            user = secrets.DB_DOCKER_USER;
            pass = secrets.DB_DOCKER_PASS;
            host = secrets.DB_DOCKER_HOST;
            port = secrets.DB_DOCKER_PORT;
        }
        return `postgresql://${user}:${pass}@${host}:${port}/${db}`;
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
        console.log("DB COMMUNICATION: SUCCESS");
    }

    async connect(): Promise<PoolClient> {
        try {
            const client = await this.#pool.connect();
            return client;
        } catch(error) {
            // TODO(yqni13): logging
            throw new DBConnectionException('server-535-auth#database');
        }
    }

    async close(client: PoolClient) {
        try {
            client.release(true);
        } catch(error) {
            // TODO(yqni13): logging
            throw new DBConnectionException('server-535-auth#database');
        }
    }
}