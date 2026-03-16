import { QueryResult } from "pg";
import { DBConnection } from "../configs/db";
import { DemoLimitsCountDTO, DemoLimitsUpdateDTO } from "../dtos/demo-limits.dto";
import { DemoLimits } from "./interfaces/demo-limits.entity.interface";
import { logError } from "../utils/common.utils";
import { DBQueryErrorException } from "../utils/exceptions/db.exception";

class DemoLimitsRepository {
    private table: string;

    constructor() {
        this.table = 'demo_limits';
    }

    async count(dto: DemoLimitsCountDTO): Promise<DemoLimits[] | null> {
        const filterColumn = 'day';
        let sql: string;
        let value: any[];
        sql = `SELECT * FROM ${this.table} WHERE ${filterColumn} = $1::date;`;
        value = [dto.day];
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<DemoLimits> = await client.query(sql, value);
            return !result.rows[0] || result.rows.length === 0 ? null : result.rows;
        } catch(err: any) {
            const message = "DB ERROR ON SELECT QUERY";
            const method = "SUPPORT_DemoLimitsRepository_count";
            logError(message, method, err);
            throw new DBQueryErrorException(err);
        } finally {
            await db.close(client);
        }
    }

    async create(entity: Partial<DemoLimits>): Promise<DemoLimits> {
        const sql = `INSERT INTO ${this.table}
        (day, count, last_modified)
        VALUES ($1::date, $2, $3::timestamp)
        RETURNING *;`;
        const values = [entity.day, entity.count, entity.last_modified];
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<DemoLimits> = await client.query(sql, values);
            return result.rows[0];
        } catch(err: any) {
            const message = "DB ERROR ON INSERT QUERY";
            const method = "SUPPORT_DemoLimitsRepository_create";
            logError(message, method, err);
            throw new DBQueryErrorException(err);
        } finally {
            await db.close(client);
        }
    }

    async update(dto: DemoLimitsUpdateDTO): Promise<DemoLimits | null> {
        const sql = `UPDATE ${this.table}
        SET count = count + 1, last_modified = $1::timestamp
        WHERE day = $2::date
        RETURNING *;`;
        const values = [dto.last_modified, dto.day];
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<DemoLimits> = await client.query(sql, values);
            return result.rows[0] ?? null;
        } catch(err: any) {
            const message = "DB ERROR ON UPDATE QUERY";
            const method = "SUPPORT_DemoLimitsRepository_update";
            logError(message, method, err);
            throw new DBQueryErrorException(err);
        } finally {
            await db.close(client);
        }
    }
}

export default new DemoLimitsRepository();