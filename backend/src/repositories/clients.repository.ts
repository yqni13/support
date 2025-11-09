import { Clients } from "./interfaces/clients.entity.interface";
import { IRepoError } from "./interfaces/error.repository.interface";
import { DBConnection } from "../configs/db";
import { QueryResult } from "pg";
import { secrets } from "../utils/secrets.utils";
import { EnvMode } from "../utils/enums/env-mode.enum";
import { ApiKeyStatus } from "../utils/enums/api-key-status.enum";
import * as Utils from "../utils/common.utils";

class ClientsRepository {
    private table: string;

    constructor() {
        this.table = 'clients';
    }

    async findByKey(hash: string): Promise<Clients | IRepoError | null> {
        const sql = `SELECT * FROM ${this.table} WHERE api_key_hash = $1 AND status = $2;`;
        const values = [hash, ApiKeyStatus.ACTIVE];
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Clients> = await client.query(sql, values);
            await db.close(client);
            return result.rows[0] ?? null;
        } catch(err: any) {
            // TODO(yqni13): logging
            if(secrets.ENV_MODE === EnvMode.DEV || secrets.ENV_MODE === EnvMode.TEST) {
                console.log("DB ERROR ON SELECT (Clients Repository, findByKey): ", err);
            }
            await db.close(client);
            return {
                method: 'support_clients_findByKey',
                error: err
            }
        }
    }

    async findStatusByName(name: string): Promise<Clients | IRepoError | null> {
        const sql = `SELECT * FROM ${this.table} WHERE name = $1;`;
        const value = [name];
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Clients> = await client.query(sql, value);
            await db.close(client);
            return result.rows[0] ?? null;
        } catch(err: any) {
            // TODO(yqni13): logging
            if(secrets.ENV_MODE === EnvMode.DEV || secrets.ENV_MODE === EnvMode.TEST) {
                console.log("DB ERROR ON SELECT (Clients Repository, findStatusByName): ", err);
            }
            await db.close(client);
            return {
                method: 'support_clients_findStatusByName',
                error: err
            }
        }
    }

    async create(id: string, name: string, hash: string): Promise<Clients | IRepoError> {
        const timeStamp = Utils.getTimestampWithOffsetInfo(new Date());
        const sql = `INSERT INTO ${this.table}
        (client_id, name, api_key_hash, status, last_use, last_modified, created_on)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
        `;
        const values = [id, name, hash, ApiKeyStatus.ACTIVE, timeStamp, timeStamp, timeStamp];
        
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Clients> = await client.query(sql, values);
            await db.close(client);
            return result.rows[0] ?? null;
        } catch(err: any) {
            // TODO(yqni13): logging
            if(secrets.ENV_MODE === EnvMode.DEV || secrets.ENV_MODE === EnvMode.TEST) {
                console.log("DB ERROR ON SELECT (Clients Repository, create): ", err);
            }
            await db.close(client);
            return {
                method: 'support_clients_create',
                error: err
            }
        }
    }

    async updateStatus(id: string, data: Partial<Clients>): Promise<Clients | IRepoError | null> {
        const filterColumn = 'client_id';
        const timeStamp = Utils.getTimestampWithOffsetInfo(new Date());
        const sql = `UPDATE ${this.table}
        SET status = $1, last_modified = $2
        WHERE ${filterColumn} = $3
        RETURNING *;
        `;
        const values = [data.status, timeStamp, id];
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Clients> = await client.query(sql, values);
            await db.close(client);
            return result.rows[0] ?? null;
        } catch(err: any) {
            // TODO(yqni13): logging
            if(secrets.ENV_MODE === EnvMode.DEV || secrets.ENV_MODE === EnvMode.TEST) {
                console.log("DB ERROR ON SELECT (Clients Repository, updateStatus): ", err);
            }
            await db.close(client);
            return {
                method: 'support_clients_updateStatus',
                error: err
            }
        }
    }

    async updateLastUse(id: string): Promise<Clients | IRepoError | null> {
        const filterColumn = 'client_id';
        const timeStamp = Utils.getTimestampWithOffsetInfo(new Date());
        const sql = `UPDATE ${this.table}
        SET last_use = $1
        WHERE ${filterColumn} = $2
        RETURNING *;
        `;
        const values = [timeStamp, id];
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Clients> = await client.query(sql, values);
            await db.close(client);
            return result.rows[0] ?? null;
        } catch(err: any) {
            // TODO(yqni13): logging
            if(secrets.ENV_MODE === EnvMode.DEV || secrets.ENV_MODE === EnvMode.TEST) {
                console.log("DB ERROR ON SELECT (Clients Repository, updateLastUse): ", err);
            }
            await db.close(client);
            return {
                method: 'support_clients_updateLastUse',
                error: err
            }
        }
    }
}

export default new ClientsRepository();