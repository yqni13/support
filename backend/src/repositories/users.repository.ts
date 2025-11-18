import { IRepoError } from "./interfaces/error.repository.interface";
import { DBConnection } from "../configs/db";
import { QueryResult } from "pg";
import { IBaseRepository, ICreateRepository, IFindRepository } from "./interfaces/base.repository.interface";
import { Users } from "./interfaces/users.entity.interface";
import { logRepoError } from "../utils/common.utils";

class UsersRepository implements 
IBaseRepository<Users>,
IFindRepository<Users>,
ICreateRepository<Users> {
    private table: string;

    constructor() {
        this.table = 'users';
    }

    async findById(id: string): Promise<Users | IRepoError | null> {
        const filterColumn = 'user_id';
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
            const logMsg = "DB ERROR ON SELECT (Users Repository, findById): ";
            logRepoError(logMsg, err);
            await db.close(client);
            return {
                method: 'support_users_findById',
                error: err
            }
        }
    }

    async findAll(): Promise<Users[] | IRepoError | null> {
        const orderPrio = 'user_id';
        const sql: string = `SELECT * FROM ${this.table} ORDER BY ${orderPrio} ASC FETCH FIRST 100 ROWS ONLY;`;
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Users> = await client.query(sql);
            await db.close(client);
            return result.rows ?? null;
        } catch(err: any) {
            const logMsg = "DB ERROR ON SELECT (Users Repository, findAll): ";
            logRepoError(logMsg, err);
            await db.close(client);
            return {
                method: 'support_users_findAll',
                error: err
            }
        }
    }

    async create(entity: Users): Promise<Users | IRepoError> {
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
            return result.rows[0] ?? null;
        } catch(err: any) {
            const logMsg = "DB ERROR ON INSERT (Users Repository, create): ";
            logRepoError(logMsg, err);
            await db.close(client);
            return {
                method: 'support_users_create',
                error: err
            }
        }
    }

    async update(id: string, dto: Partial<Users>): Promise<Users | IRepoError | null> {
        const filterColumn = 'user_id';
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
            const logMsg = "DB ERROR ON UPDATE (Users Repository, update): ";
            logRepoError(logMsg, err);
            await db.close(client);
            return {
                method: 'support_users_update',
                error: err
            }
        }
    }
}

export default new UsersRepository();