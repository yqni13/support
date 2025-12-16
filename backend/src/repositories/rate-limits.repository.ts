import { QueryResult } from "pg";
import { RateLimitsCountDTO, RateLimitsCreateUpdateDTO } from "../dtos/rate-limits.dto";
import { RateLimits } from "./interfaces/rate-limits.entity.interface";
import { logError } from "../utils/common.utils";
import { DBQueryErrorException } from "../utils/exceptions/db.exception";
import { DBConnection } from "../configs/db";

class RateLimitsRepository {
    private table: string;

    constructor() {
        this.table = 'rate_limits';
    }

    async count(dto: RateLimitsCountDTO): Promise<RateLimits[] | null> {
        const filterColumn0 = dto.client_id ? 'client_id' : 'user_id';
        const filterColumn1 = 'day';
        let sql: string;
        let values: any[];
        if(!dto.client_id && !dto.user_id) {
            sql = `SELECT * FROM ${this.table} WHERE ${filterColumn1} = $1::date;`;
            values = [dto.day];
        } else {
            sql = `SELECT * FROM ${this.table} WHERE ${filterColumn0} = $1 AND ${filterColumn1} = $2::date;`;
            values = [(dto.client_id ? dto.client_id : dto.user_id), dto.day];
        }
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<RateLimits> = await client.query(sql, values);
            await db.close(client);
            return !result.rows[0] || result.rows.length === 0 ? null : result.rows;
        } catch(err: any) {
            const message = "DB ERROR ON SELECT QUERY";
            const method = "SUPPORT_RateLimitsRepository_count";
            logError(message, method, err);
            await db.close(client);
            throw new DBQueryErrorException(err);
        }
    }

    async create(entity: Partial<RateLimits>): Promise<RateLimits> {
        // Information 'DATE type' handling in PostgreSQL:
        // - cast date from string to literal to ensure type in query
        // - returning value gets parsed to date type due to setTypeParser (OID 1082) in db.ts
        const sql = `INSERT INTO ${this.table}
        (client_id, user_id, day, count, last_modified)
        VALUES ($1, $2, $3::date, $4, $5::timestamp)
        RETURNING *;`;
        const values = [entity.client_id, entity.user_id, entity.day, 1, entity.last_modified];
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<RateLimits> = await client.query(sql, values);
            await db.close(client);
            return result.rows[0];
        } catch(err: any) {
            const message = "DB ERROR ON INSERT QUERY";
            const method = "SUPPORT_RateLimitsRepository_create";
            logError(message, method, err);
            await db.close(client);
            throw new DBQueryErrorException(err);
        }
    }

    async update(dto: RateLimitsCreateUpdateDTO): Promise<RateLimits | null> {
        const filterColumn0 = "client_id";
        const filterColumn1 = "user_id";
        const sql = `UPDATE ${this.table}
        SET count = count + 1, last_modified = $1::timestamp
        WHERE ${filterColumn0} = $2 AND ${filterColumn1} = $3 AND day = $4::date
        RETURNING *;`;
        const values = [dto.last_modified, dto.client_id, dto.user_id, dto.day];
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<RateLimits> = await client.query(sql, values);
            await db.close(client);
            return result.rows[0] ?? null;
        } catch(err: any) {
            const message = "DB ERROR ON UPDATE QUERY";
            const method = "SUPPORT_RateLimitsRepository_update";
            logError(message, method, err);
            await db.close(client);
            throw new DBQueryErrorException(err);
        }
    }
}

export default new RateLimitsRepository();