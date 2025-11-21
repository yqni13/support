import { Clients } from "./interfaces/clients.entity.interface";
import { IRepoError } from "./interfaces/error.repository.interface";
import { DBConnection } from "../configs/db";
import { QueryResult } from "pg";
import { ApiKeyStatus } from "../utils/enums/api-key-status.enum";
import { logRepoError } from "../utils/common.utils";

class ClientsRepository {
    private table: string;

    constructor() {
        this.table = 'clients';
    }

    async findByActiveKey(hash: string): Promise<Clients | IRepoError | null> {
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
            const logMsg = "DB ERROR ON SELECT (Clients Repository, findByActiveKey): ";
            logRepoError(logMsg, err);
            await db.close(client);
            return {
                method: 'support_clients_findByActiveKey',
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
            return result.rows[0] ?? {};
        } catch(err: any) {
            const logMsg = "DB ERROR ON SELECT (Clients Repository, findStatusByName): ";
            logRepoError(logMsg, err);
            await db.close(client);
            return {
                method: 'support_clients_findStatusByName',
                error: err
            }
        }
    }

    async create(entity: Clients): Promise<Clients | IRepoError> {
        const sql = `INSERT INTO ${this.table}
        (client_id, name, api_key_hash, status, last_use, last_modified, created_on)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
        `;
        const values = [entity.client_id, entity.name, entity.api_key_hash, entity.status, entity.last_use, entity.last_modified, entity.created_on];
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Clients> = await client.query(sql, values);
            await db.close(client);
            return result.rows[0];
        } catch(err: any) {
            const logMsg = "DB ERROR ON SELECT (Clients Repository, create): ";
            logRepoError(logMsg, err);
            await db.close(client);
            return {
                method: 'support_clients_create',
                error: err
            }
        }
    }

    async updateStatus(id: string, dto: Partial<Clients>): Promise<Clients | IRepoError | null> {
        const filterColumn = 'client_id';
        const sql = `UPDATE ${this.table}
        SET status = $1, last_modified = $2
        WHERE ${filterColumn} = $3
        RETURNING *;
        `;
        const values = [dto.status, dto.last_modified, id];
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Clients> = await client.query(sql, values);
            await db.close(client);
            return result.rows[0] ?? null;
        } catch(err: any) {
            const logMsg = "DB ERROR ON SELECT (Clients Repository, updateStatus): ";
            logRepoError(logMsg, err);
            await db.close(client);
            return {
                method: 'support_clients_updateStatus',
                error: err
            }
        }
    }

    async updateLastUse(id: string, dto: Partial<Clients>): Promise<Clients | IRepoError | null> {
        const filterColumn = 'client_id';
        const sql = `UPDATE ${this.table}
        SET last_use = $1
        WHERE ${filterColumn} = $2
        RETURNING *;
        `;
        const values = [dto.last_use, id];
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Clients> = await client.query(sql, values);
            await db.close(client);
            return result.rows[0] ?? null;
        } catch(err: any) {
            const logMsg = "DB ERROR ON SELECT (Clients Repository, updateLastUse): ";
            logRepoError(logMsg, err);
            await db.close(client);
            return {
                method: 'support_clients_updateLastUse',
                error: err
            }
        }
    }
}

export default new ClientsRepository();