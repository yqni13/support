import { IRepoError } from "./interfaces/error.repository.interface";
import { DBConnection } from "../configs/db";
import { QueryResult } from "pg";
import { IBaseRepository, ICreateRepository, IFindRepository } from "./interfaces/base.repository.interface";
import { Users } from "./interfaces/users.entity.interface";
import { logRepoError } from "../utils/common.utils";
import { UsersFilterDTO } from "../dtos/users.dto";
import { DBQueryErrorException } from "../utils/exceptions/db.exception";

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

    async findByEmail(email: string): Promise<Users | null> {
        const filterColumn = 'email';
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
            const logMsg = "DB ERROR ON SELECT (Users Repository, findByEmail): ";
            logRepoError(logMsg, err);
            await db.close(client);
            throw new DBQueryErrorException('support-dberror-users-findByEmail', err);
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
            return result.rows ?? [];
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

    async findByFilter(dto: UsersFilterDTO): Promise<Users[] | IRepoError | []> {
        const queryData = this._mapFilteredUsersQueryValues(dto);
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Users> = await client.query(queryData.sql, queryData.values);
            await db.close(client);
            return result.rows ?? [];
        } catch(err: any) {
            const logMsg = "DB ERROR ON SELECT (Users Repository, findByFilter): ";
            logRepoError(logMsg, err);
            await db.close(client);
            return {
                method: 'support_users_findByFilter',
                error: err
            }
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
            const logMsg = "DB ERROR ON INSERT (Users Repository, create): ";
            logRepoError(logMsg, err);
            await db.close(client);
            throw new DBQueryErrorException('support-dberror-users-create', err);
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

    _mapFilteredUsersQueryValues(dto: UsersFilterDTO): { sql: string, values: any[] } {
        const values: any[] = [];
        const argGroups: string[] = [];

        Object.entries(dto).forEach(([key, content]) => {
            const valArr = Array.isArray(content) ? content : [content];
            const conditions = valArr.map((value) => {
                if(value === null) {
                    return `${key} IS NULL`;
                }

                values.push(value);
                const index = values.length;
                return `${key} = $${index}`;
            });

            if(conditions.length > 1) {
                // Multiple 'OR' conditions need ( ) otherwise 'AND' binds with higher priority.
                argGroups.push(`(${conditions.join(' OR ')})`);
            } else {
                argGroups.push(conditions[0]);
            }
        })

        const sql = `SELECT * FROM ${this.table}${argGroups.length ? ' WHERE ' + argGroups.join(' AND ') : ''};`;
        return { sql: sql, values: values };
    }
}

export default new UsersRepository();