import { PoolClient, QueryResult } from "pg";
import { DBConnection } from "../configs/db";
import { logError } from "../utils/common.utils";
import { DBQueryErrorException } from "../utils/exceptions/db.exception";
import { IFindRepository } from "./interfaces/base.repository.interface";
import { FeedbackRating } from "./interfaces/feedback-rating.entity.interface";
import { FeedbackRatingUpdateDTO } from "../dtos/feedback-rating.dto";

class FeedbackRatingRepository implements 
IFindRepository<FeedbackRating> {
    private table: string;

    constructor() {
        this.table = 'feedback_ratings';
    }

    async findById(id: string): Promise<FeedbackRating | null> {
        const filterColumn = 'client_id';
        const sql = `SELECT * FROM ${this.table} WHERE ${filterColumn} = $1;`;
        const value = [id];
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<FeedbackRating> = await client.query(sql, value);
            await db.close(client);
            return result.rows[0] ?? null;
        } catch(err: any) {
            const message = "DB ERROR ON SELECT QUERY";
            const method = "SUPPORT_FeedbackRatingRepository_findById";
            logError(message, method, err);
            await db.close(client);
            throw new DBQueryErrorException(err);
        }
    }

    async findByClientName(client_name: string): Promise<FeedbackRating | null> {
        const sql = `SELECT
        ${this.table}.*
        FROM ${this.table} 
        JOIN clients ON clients.client_id = ${this.table}.client_id
        WHERE clients.name = $1`;
        const value = [client_name];
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<FeedbackRating> = await client.query(sql, value);
            await db.close(client);
            return result.rows[0] ?? null;
        } catch(err: any) {
            const message = "DB ERROR ON SELECT QUERY";
            const method = "SUPPORT_FeedbackRatingRepository_findByClientsName";
            logError(message, method, err);
            await db.close(client);
            throw new DBQueryErrorException(err);
        }
    }

    async findAll(): Promise<FeedbackRating[] | null> {
        const orderPrio = "client_id";
        const sql = `SELECT * FROM ${this.table} ORDER BY ${orderPrio} ASC FETCH FIRST 100 ROWS ONLY;`;
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<FeedbackRating> = await client.query(sql);
            await db.close(client);
            return !result.rows[0] || result.rows.length === 0 ? null : result.rows;
        } catch(err: any) {
            const message = "DB ERROR ON SELECT QUERY";
            const method = "SUPPORT_FeedbackRatingRepository_findAll";
            logError(message, method, err);
            await db.close(client);
            throw new DBQueryErrorException(err);
        }
    }

    async create(client: PoolClient, entity: FeedbackRating): Promise<FeedbackRating> {
        const sql = `INSERT INTO ${this.table}
        (client_id, count, rating_sum, last_modified, created_on)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;`;
        const values = [entity.client_id, entity.count, entity.rating_sum, entity.last_modified, entity.created_on];
        const result: QueryResult<FeedbackRating> = await client.query(sql, values);
        return result.rows[0];
        // Used within transaction => catch & handle exceptions there.
    }

    async update(client: PoolClient, id: string, dto: FeedbackRatingUpdateDTO): Promise <FeedbackRating | null> {
        const filterColumn = 'client_id';
        const sql = `UPDATE ${this.table}
        SET count = count + $1, rating_sum = rating_sum + $2, last_modified = $3::timestamp
        WHERE ${filterColumn} = $4
        RETURNING *;`;
        const values = [dto.count, dto.rating, dto.last_modified, id];
        const result: QueryResult<FeedbackRating> = await client.query(sql, values);
        return result.rows[0] ?? null;
        // Used within transaction => catch & handle exceptions there.
    }
}

export default new FeedbackRatingRepository();