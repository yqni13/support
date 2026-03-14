import { PoolClient, QueryResult } from "pg";
import { DBConnection } from "../configs/db";
import { FeedbackCreateResponseDTO, FeedbackFilterDTO, FeedbackResponseDTO, FeedbackUpdateReviewDTO } from "../dtos/feedback.dto";
import { Feedback, FeedbackId } from "./interfaces/feedback.entity.interface";
import { DBQueryErrorException } from "../utils/exceptions/db.exception";
import { logError } from "../utils/common.utils";
import { mapFilteredQueryValues } from "../utils/repository.utils";

class FeedbackRepository {
    private table: string;

    constructor() {
        this.table = 'feedback_entries';
    }

    async findById(id: FeedbackId): Promise<Feedback | null> {
        const filterColumn = "feedback_id";
        const sql = `SELECT * FROM ${this.table} WHERE ${filterColumn} = $1;`;
        const value = [id];
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Feedback> = await client.query(sql, value);
            return result.rows[0] ?? null;
        } catch(err: any) {
            const message = "DB ERROR ON SELECT QUERY";
            const method = "SUPPORT_FeedbackRepository_findById";
            logError(message, method, err);
            throw new DBQueryErrorException(err);
        } finally {
            await db.close(client);
        }
    }

    async findByFilter(dto: FeedbackFilterDTO): Promise<Feedback[] | null> {
        const queryData = mapFilteredQueryValues<FeedbackFilterDTO>(dto, this.table);
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Feedback> = await client.query(queryData.sql, queryData.values);
            return !result.rows[0] || result.rows.length === 0 ? null : result.rows;
        } catch(err: any) {
            const message = "DB ERROR ON SELECT QUERY";
            const method = "SUPPORT_FeedbackRepository_findByFilter";
            logError(message, method, err);
            throw new DBQueryErrorException(err);
        } finally {
            await db.close(client);
        }
    }

    async updateReview(id: FeedbackId, dto: FeedbackUpdateReviewDTO): Promise<Feedback | null> {
        const filterColumn = "feedback_id";
        const sql = `UPDATE ${this.table}
        SET reviewed_on = $1::timestamp, last_modified = $2::timestamp
        WHERE ${filterColumn} = $3
        RETURNING *;
        `;
        const values = [dto.reviewed_on, dto.last_modified, id];
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Feedback> = await client.query(sql, values);
            return result.rows[0] ?? null;
        } catch(err: any) {
            const message = "DB ERROR ON UPDATE QUERY";
            const method = "SUPPORT_FeedbackRepository_updateReview";
            logError(message, method, err);
            throw new DBQueryErrorException(err);
        } finally {
            await db.close(client);
        }
    }

    /**
     * Upsert feedback within a transaction.
     * 
     * Uses a CTE-based pattern to handle the following cases:
     *  - UDPATE: Existing entry => updates and returns row
     *  - INSERT: Non existing entry (unique constraint for client_id & user_id combination) => creates new row
     *  - BLOCK: Existing entry with message but without review => update is prevented by WHERE NOT clause.
     *    Returns existing row with `blocked: true` to handle specific response.
     * 
     * Notes:
     *  - UNION ALL: Combine results of multiple SELECT statements.
     *  - ON CONFLICT: PostgreSQL does NOT have UPSERT statement => supports INSERT...ON CONFLICT instead (or MERGE).
     * 
     * @param {PoolClient} client Client used to connect database as this fn is called within a transaction.
     * @param {Partial<Feedback>} entity All properties needed except 'feedback_id' due to serial type in database.
     * @returns {FeedbackResponseDTO | null} FeedbackResponseDTO expands `Feedback` by 'rating_old' and 'blocked' value for further processing => `blocked: true` for prevented update or `NULL` if nothing was found (unexpected).
     */
    async upsertInTa(client: PoolClient, entity: Partial<Feedback>): Promise<FeedbackResponseDTO | null> {
        const sql = `
        WITH pre_update_data AS (
            SELECT rating
            FROM ${this.table}
            WHERE client_id = $1 AND user_id = $2
        ),
        upsert AS (
            INSERT INTO ${this.table}
            (client_id, user_id, rating, term_accepted, message, reviewed_on, last_modified, created_on)
            VALUES ($1, $2, $3, $4, $5, $6, $7::timestamp, $8::timestamp)
            ON CONFLICT (client_id, user_id)
            DO UPDATE SET 
                rating = EXCLUDED.rating,
                term_accepted = EXCLUDED.term_accepted,
                message = EXCLUDED.message,
                reviewed_on = EXCLUDED.reviewed_on,
                last_modified = EXCLUDED.last_modified
            WHERE NOT (${this.table}.message IS NOT NULL AND ${this.table}.reviewed_on IS NULL)
            RETURNING
                ${this.table}.*,
                (SELECT rating FROM pre_update_data) AS rating_old,
                false AS blocked
        )
        SELECT * FROM upsert
        UNION ALL
        SELECT *, NULL AS rating_old, true AS blocked
        FROM ${this.table}
        WHERE client_id = $1 AND user_id = $2
            AND NOT EXISTS (SELECT 1 FROM upsert)
        `;
        const values = [entity.client_id, entity.user_id, entity.rating, entity.term_accepted, entity.message, null, entity.last_modified, entity.created_on];
        const result: QueryResult<FeedbackResponseDTO> = await client.query(sql, values);
        return result.rows[0] ?? null;
    }
}

export default new FeedbackRepository();