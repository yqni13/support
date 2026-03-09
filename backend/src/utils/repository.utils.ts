import { PoolClient } from "pg";
import { BaseQuery, TimestampFilters } from "../repositories/interfaces/common.repository.interface";
import { DBConnection } from "../configs/db";
import { logError } from "./common.utils";
import { DBQueryErrorException } from "./exceptions/db.exception";

/**
 * @param data Timestamp values come in array [older, younger].
 * @param valueIndex Index for query values.
 */
export function mapTimestampFilters(data: TimestampFilters, valueIndex: number): BaseQuery {
    let sql: string = '';
    const values: string[] = [];
    Object.entries(data).forEach(([key, val], i) => {
        sql += i > 0 ? ' AND ' : '';
        sql += `(${key} >= $${valueIndex}::timestamp AND ${key} <= $${valueIndex+1}::timestamp)`
        values.push(val[0], val[1]);
        valueIndex = valueIndex + 2;
    })

    return { sql: sql, values: values };
}

export function mapFilteredQueryValues<T extends Record<string, any>>(dto: T, table: string): BaseQuery {
    const values: any[] = [];
    const argGroups: string[] = [];
    const timestampObj = {};
    Object.entries(dto).forEach(([key, content]) => {
        if(key !== 'reviewed_on' && key !== 'last_modified' && key !== 'created_on') {
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
                // Multiple "OR" conditions need ( ) otherwise "AND" binds with higher priority.
                argGroups.push(`(${conditions.join(" OR ")})`);
            } else {
                argGroups.push(conditions[0]);
            }
        } else {
            Object.assign(timestampObj, { [key]: content });
        }
    })

    let sql = `SELECT * FROM ${table} WHERE ${argGroups.length ? argGroups.join(" AND ") : ""}`;

    if(dto.last_modified || dto.created_on) {
        const queryTimestampData = mapTimestampFilters(timestampObj as TimestampFilters, values.length+1);
        sql += argGroups.length ? ` AND ${queryTimestampData.sql}` : `${queryTimestampData.sql}`;
        queryTimestampData.values.forEach((value: any) => values.push(value));
    }

    return { sql: sql + ';', values: values };
}

/**
 * @description Wrapper to apply logic within transaction environment + logging/exception handling.
 */
export async function asTransaction<T>(
    message: string,
    method: string,
    fn: (client: PoolClient) => Promise<T | null>
): Promise<T | null> {
    const db = DBConnection.getInstance();
    let client: any;
    try {
        client = await db.connect();
        await client.query('BEGIN');

        const result = await fn(client);

        await client.query('COMMIT');
        return result;
    } catch(err: any) {
        await client.query('ROLLBACK');
        logError(message, method, err);
        throw new DBQueryErrorException(err);
    } finally {
        await db.close(client);
    }
}