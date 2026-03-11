import { DBConnection } from "../configs/db";
import { QueryResult } from "pg";
import { IBaseRepository, ICreateRepository, IFindRepository, IUpdateFlagRepository } from "./interfaces/base.repository.interface";
import { Users, UsersId } from "./interfaces/users.entity.interface";
import { logError } from "../utils/common.utils";
import { UsersFilterDTO } from "../dtos/users.dto";
import { DBQueryErrorException } from "../utils/exceptions/db.exception";
import { mapFilteredQueryValues } from "../utils/repository.utils";

class UsersRepository implements 
IBaseRepository<Users>,
IFindRepository<Users>,
ICreateRepository<Users>,
IUpdateFlagRepository<Users>
{
    private table: string;

    constructor() {
        this.table = "users";
    }

    async findById(id: UsersId): Promise<Users | null> {
        const filterColumn = "user_id";
        const sql = `SELECT * FROM ${this.table} WHERE ${filterColumn} = $1;`;
        const value = [id];
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Users> = await client.query(sql, value);
            await db.close(client);
            return result.rows[0] ?? null;
        } catch(err: any) {
            const message = "DB ERROR ON SELECT QUERY";
            const method = "SUPPORT_UsersRepository_findById";
            logError(message, method, err);
            await db.close(client);
            throw new DBQueryErrorException(err);
        }
    }

    async findByEmail(email: string): Promise<Users | null> {
        const filterColumn = "email";
        const sql = `SELECT * FROM ${this.table} WHERE ${filterColumn} = $1;`;
        const value = [email];
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Users> = await client.query(sql, value);
            await db.close(client);
            return result.rows[0] ?? null;
        } catch(err: any) {
            const message = "DB ERROR ON SELECT QUERY";
            const method = "SUPPORT_UsersRepository_findByEmail";
            logError(message, method, err);
            await db.close(client);
            throw new DBQueryErrorException(err);
        }
    }

    async findAll(): Promise<Users[] | null> {
        const orderPrio = "user_id";
        const sql: string = `SELECT * FROM ${this.table} ORDER BY ${orderPrio} ASC FETCH FIRST 100 ROWS ONLY;`;
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Users> = await client.query(sql);
            await db.close(client);
            return !result.rows[0] || result.rows.length === 0 ? null : result.rows;
        } catch(err: any) {
            const message = "DB ERROR ON SELECT QUERY";
            const method = "SUPPORT_UsersRepository_findAll";
            logError(message, method, err);
            await db.close(client);
            throw new DBQueryErrorException(err);
        }
    }

    /**
     * @description Find entries by search params (dto is never empty for this method).
     */
    async findByFilter(dto: UsersFilterDTO): Promise<Users[] | null> {
        const queryData = mapFilteredQueryValues<UsersFilterDTO>(dto, this.table);
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Users> = await client.query(queryData.sql, queryData.values);
            await db.close(client);
            return !result.rows[0] || result.rows.length === 0 ? null : result.rows;
        } catch(err: any) {
            const message = "DB ERROR ON SELECT QUERY";
            const method = "SUPPORT_UsersRepository_findByFilter";
            logError(message, method, err);
            await db.close(client);
            throw new DBQueryErrorException(err);
        }
    }

    async create(entity: Users): Promise<Users> {
        const sql = `INSERT INTO ${this.table}
        (user_id, email, status, flag, last_modified, created_on)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
        `;
        const values = [entity.user_id, entity.email, entity.status, entity.flag, entity.last_modified, entity.created_on];
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Users> = await client.query(sql, values);
            await db.close(client);
            return result.rows[0];
        } catch(err: any) {
            const message = "DB ERROR ON INSERT QUERY";
            const method = "SUPPORT_UsersRepository_create";
            logError(message, method, err);
            await db.close(client);
            throw new DBQueryErrorException(err);
        }
    }

    async update(id: UsersId, dto: Partial<Users>): Promise<Users | null> {
        const filterColumn = "user_id";
        const sql = `UPDATE ${this.table}
        SET email = $1, status = $2, flag = $3, last_modified = $4
        WHERE ${filterColumn} = $5
        RETURNING *;
        `;
        const values = [dto.email, dto.status, dto.flag, dto.last_modified, id];
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Users> = await client.query(sql, values);
            await db.close(client);
            return result.rows[0] ?? null;
        } catch(err: any) {
            const message = "DB ERROR ON UPDATE QUERY";
            const method = "SUPPORT_UsersRepository_update";
            logError(message, method, err);
            await db.close(client);
            throw new DBQueryErrorException(err);
        }
    }

    async updateFlag(id: UsersId, dto: Partial<Users>): Promise<Users | null> {
        const filterColumn = "user_id";
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
            const result: QueryResult<Users> = await client.query(sql, values);
            await db.close(client);
            return result.rows[0] ?? null;
        } catch(err: any) {
            const message = "DB ERROR ON UPDATE QUERY";
            const method = "SUPPORT_UsersRepository_updateFlag";
            logError(message, method, err);
            await db.close(client);
            throw new DBQueryErrorException(err);
        }
    }
}

export default new UsersRepository();