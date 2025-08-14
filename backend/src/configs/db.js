const { Pool } = require('pg');
const Secrets = require('../utils/secrets.utils');
const { DBConnectionException, DBEmptyException } = require('../utils/exceptions/db.exception');
const { ErrorStatusCodes } = require('../utils/errorStatusCodes.utils');

class DBConnection {

    #pool;

    constructor() {
        const connectionString = this._getConnectionString(Secrets.MODE);
        this.#pool = new Pool({connectionString});
    }

    _getConnectionString(env) {
        let [db, user, pass, host, port] = '';
        if(env !== 'production') {
            db = Secrets.DB_LOCAL_DB;
            user = Secrets.DB_LOCAL_USER;
            pass = Secrets.DB_LOCAL_PASS;
            host = Secrets.DB_LOCAL_HOST;
            port = Secrets.DB_LOCAL_PORT;
        } else {
            db = Secrets.DB_DOCKER_DB;
            user = Secrets.DB_DOCKER_USER;
            pass = Secrets.DB_DOCKER_PASS;
            host = Secrets.DB_DOCKER_HOST;
            port = Secrets.DB_DOCKER_PORT;
        }
        return `postgresql://${user}:${pass}@${host}:${port}/${db}`;
    }

    async init() {
        const client = await this.connect();
        try {
            const results = await client.query(`SELECT * FROM meta;`);
            if(!results || results.rowCount === 0) {
                const error = new Error();
                error.code = ErrorStatusCodes.DBEmptyException;
                throw error;
            }
        } catch(error) {
            if(error.code === ErrorStatusCodes.DBEmptyException) {
                throw new DBEmptyException();
            } else {
                throw new DBConnectionException(error);
            }
        }
        console.log("DB COMMUNICATION: SUCCESS");
        await this.close(client);
    }

    async connect() {
        try {
            const client = await this.#pool.connect();
            return client;
        } catch(error) {
            // logging
            throw new DBConnectionException('server-535-auth#database');
        }
    }

    async close(client) {
        try {
            await client.release(true);
        } catch(error) {
            // logging
            throw new DBConnectionException('server-535-auth#database');
        }
    }
}

module.exports = DBConnection;