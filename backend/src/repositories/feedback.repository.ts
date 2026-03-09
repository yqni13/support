import { PoolClient, QueryResult } from "pg";
import { DBConnection } from "../configs/db";
import { FeedbackFilterDTO, FeedbackResponseDTO, FeedbackUpdateReviewDTO } from "../dtos/feedback.dto";
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
            await db.close(client);
            return result.rows[0] ?? null;
        } catch(err: any) {
            const message = "DB ERROR ON SELECT QUERY";
            const method = "SUPPORT_FeedbackRepository_findById";
            logError(message, method, err);
            await db.close(client);
            throw new DBQueryErrorException(err);
        }
    }

    async findByFilter(dto: FeedbackFilterDTO): Promise<Feedback[] | null> {
        const queryData = mapFilteredQueryValues<FeedbackFilterDTO>(dto, this.table);
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Feedback> = await client.query(queryData.sql, queryData.values);
            await db.close(client);
            return !result.rows[0] || result.rows.length === 0 ? null : result.rows;
        } catch(err: any) {
            const message = "DB ERROR ON SELECT QUERY";
            const method = "SUPPORT_FeedbackRepository_findByFilter";
            logError(message, method, err);
            await db.close(client);
            throw new DBQueryErrorException(err);
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
                await db.close(client);
                return result.rows[0] ?? null;
            } catch(err: any) {
                const message = "DB ERROR ON UPDATE QUERY";
                const method = "SUPPORT_FeedbackRepository_updateReview";
                logError(message, method, err);
                await db.close(client);
                throw new DBQueryErrorException(err);
            }
    }

    /**
     * 
     * @description Update on insert conflict for existing client_id and user_id combined entry (unique constraint). Is called within transaction only => needs PoolClient as param.
     * @returns {FeedbackResponseDTO | null} Entity <Feedback> expanded by rating_old value for further processing.
     */
    async upsertInTa(client: PoolClient, entity: Partial<Feedback>): Promise<FeedbackResponseDTO | null> {
        const sql = `
        WITH pre_update_data AS (
            SELECT rating
            FROM ${this.table}
            WHERE client_id = $1 AND user_id = $2
        )
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
        WHERE NOT (${this.table}.message IS NOT NULL AND ${this.table}.reviewed_on IS NOT NULL)
        RETURNING
            ${this.table}.*,
            (SELECT rating FROM pre_update_data) AS rating_old;
        `;
        const values = [entity.client_id, entity.user_id, entity.rating, entity.term_accepted, entity.message, null, entity.last_modified, entity.created_on];
        const result: QueryResult<FeedbackResponseDTO> = await client.query(sql, values);
        return result.rows[0] ?? null;
    }
}

export default new FeedbackRepository();