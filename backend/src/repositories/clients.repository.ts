import { Clients, ClientsId } from "./interfaces/clients.entity.interface";
import { DBConnection } from "../configs/db";
import { QueryResult } from "pg";
import { ApiKeyStatus } from "../utils/enums/api-key-status.enum";
import { logError } from "../utils/common.utils";
import { DBQueryErrorException } from "../utils/exceptions/db.exception";
import { ICreateRepository, IUpdateFlagRepository } from "./interfaces/base.repository.interface";

class ClientsRepository implements ICreateRepository<Clients>, IUpdateFlagRepository<Clients> {
    private table: string;

    constructor() {
        this.table = "clients";
    }

    async findById(id: ClientsId): Promise<Clients | null> {
        const filterColumn = 'client_id';
        const sql = `SELECT * FROM ${this.table} WHERE ${filterColumn} = $1;`;
        const value = [id];
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Clients> = await client.query(sql, value);
            await db.close(client);
            return result.rows[0] ?? null;
        } catch(err: any) {
            const message = "DB ERROR ON SELECT QUERY";
            const method = "SUPPORT_ClientsRepository_findById";
            logError(message, method, err);
            await db.close(client);
            throw new DBQueryErrorException(err);
        }
    }

    async findByActiveKey(hash: string): Promise<Clients | null> {
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
            const message = "DB ERROR ON SELECT QUERY";
            const method = "SUPPORT_ClientsRepository_findByActiveKey";
            logError(message, method, err);
            await db.close(client);
            throw new DBQueryErrorException(err);
        }
    }

    async findStatusByName(name: string): Promise<Clients | null> {
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
            const message = "DB ERROR ON SELECT QUERY";
            const method = "SUPPORT_ClientsRepository_findStatusByName";
            logError(message, method, err);
            await db.close(client);
            throw new DBQueryErrorException(err);
        }
    }

    async create(entity: Clients): Promise<Clients> {
        const sql = `INSERT INTO ${this.table}
        (client_id, name, api_key_hash, status, flag, last_use, last_modified, created_on)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
        `;
        const values = [entity.client_id, entity.name, entity.api_key_hash, entity.status, entity.flag, entity.last_use, entity.last_modified, entity.created_on];
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Clients> = await client.query(sql, values);
            await db.close(client);
            return result.rows[0];
        } catch(err: any) {
            const message = "DB ERROR ON INSERT QUERY";
            const method = "SUPPORT_ClientsRepository_create";
            logError(message, method, err);
            await db.close(client);
            throw new DBQueryErrorException(err);
        }
    }

    async updateFlag(id: ClientsId, dto: Partial<Clients>): Promise<Clients | null> {
        const filterColumn = "client_id";
        const sql = `UPDATE ${this.table}
        SET flag = $1, last_modified = $2
        WHERE ${filterColumn} = $3
        RETURNING *;
        `;
        const values = [dto.flag, dto.last_modified, id];
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Clients> = await client.query(sql, values);
            await db.close(client);
            return result.rows[0] ?? null;
        } catch(err: any) {
            const message = "DB ERROR ON UPDATE QUERY";
            const method = "SUPPORT_ClientsRepository_updateFlag";
            logError(message, method, err);
            await db.close(client);
            throw new DBQueryErrorException(err);
        }
    }

    async updateStatus(id: ClientsId, dto: Partial<Clients>): Promise<Clients | null> {
        const filterColumn = "client_id";
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
            const message = "DB ERROR ON UPDATE QUERY";
            const method = "SUPPORT_ClientsRepository_updateStatus";
            logError(message, method, err);
            await db.close(client);
            throw new DBQueryErrorException(err);
        }
    }

    async updateLastUse(id: ClientsId, dto: Partial<Clients>): Promise<Clients | null> {
        const filterColumn = "client_id";
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
            const message = "DB ERROR ON UPDATE QUERY";
            const method = "SUPPORT_ClientsRepository_updateLastStatus";
            logError(message, method, err);
            await db.close(client);
            throw new DBQueryErrorException(err);
        }
    }
}

export default new ClientsRepository();