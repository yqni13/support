import {
    IBaseRepository,
    ICreateRepository,
    IDeleteRepository,
    IFindRepository
} from "./interfaces/base.repository.interface";
import { DBConnection } from "../configs/db";
import { QueryResult } from "pg";
import { Tickets } from "./interfaces/tickets.entity.interface";
import { TicketsFilterDTO, TicketsResponseExtendedDTO } from "../dtos/tickets.dto";
import { DBQueryErrorException } from "../utils/exceptions/db.exception";
import { logError } from "../utils/common.utils";
import { mapFilteredQueryValues } from "../utils/repository.utils";

class TicketsRepository implements 
IBaseRepository<Tickets>,
IFindRepository<Tickets>,
ICreateRepository<Tickets>,
IDeleteRepository 
{
    private table: string;

    constructor() {
        this.table = "tickets";
    }

    async findById(id: string): Promise<TicketsResponseExtendedDTO | null> {
        const filterColumn = "ticket_id";
        const sql = `SELECT
        ${this.table}.*,
        clients.name AS client_name,
        users.email AS user_email
        FROM ${this.table}
        LEFT JOIN clients ON ${this.table}.client_id = clients.client_id
        LEFT JOIN users ON ${this.table}.user_id = users.user_id
        WHERE ${filterColumn} = $1;`;
        const value = [id];
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<TicketsResponseExtendedDTO> = await client.query(sql, value);
            await db.close(client);
            return result.rows[0] ?? null;
        } catch(err: any) {
            const message = "DB ERROR ON SELECT QUERY";
            const method = "SUPPORT_TicketsRepository_findById";
            logError(message, method, err);
            await db.close(client);
            throw new DBQueryErrorException(err);
        }
    }

    async findAll(): Promise<Tickets[] | null> {
        const orderPrio = "ticket_id";
        const sql = `SELECT * FROM ${this.table} ORDER BY ${orderPrio} ASC FETCH FIRST 100 ROWS ONLY;`;
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Tickets> = await client.query(sql);
            await db.close(client);
            return !result.rows[0] || result.rows.length === 0 ? null : result.rows;
        } catch(err: any) {
            const message = "DB ERROR ON SELECT QUERY";
            const method = "SUPPORT_TicketsRepository_findAll";
            logError(message, method, err);
            await db.close(client);
            throw new DBQueryErrorException(err);
        }
    }

    /**
     * @description Find entries by search params (dto is never empty for this method).
     */
    async findByFilter(dto: TicketsFilterDTO): Promise<Tickets[] | null> {
        const queryData = mapFilteredQueryValues<TicketsFilterDTO>(dto, this.table);
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Tickets> = await client.query(queryData.sql, queryData.values);
            await db.close(client);
            return !result.rows[0] || result.rows.length === 0 ? null : result.rows;
        } catch(err: any) {
            const message = "DB ERROR ON SELECT QUERY";
            const method = "SUPPORT_TicketsRepository_findByFilter";
            logError(message, method, err);
            await db.close(client);
            throw new DBQueryErrorException(err);
        }
    }

    async create(entity: Tickets): Promise<Tickets> {
        const sql = `INSERT INTO ${this.table}
        (ticket_id, client_id, user_id, status, message, resource_paths, flag, last_modified, created_on)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;`;
        const values = [entity.ticket_id, entity.client_id, entity.user_id, entity.status, entity.message, entity.resource_paths, entity.flag, entity.last_modified, entity.created_on];
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Tickets> = await client.query(sql, values);
            await db.close(client);
            return result.rows[0];
        } catch(err: any) {
            const message = "DB ERROR ON INSERT QUERY";
            const method = "SUPPORT_TicketsRepository_create";
            logError(message, method, err);
            await db.close(client);
            throw new DBQueryErrorException(err);
        }
    }

    async update(id: string, dto: Partial<Tickets>): Promise<Tickets | null> {
        const filterColumn = "ticket_id";
        const sql = `UPDATE ${this.table}
        SET status = $1, message = $2, resource_paths = $3, flag = $4, last_modified = $5
        WHERE ${filterColumn} = $6
        RETURNING *;
        `;
        const values = [dto.status, dto.message, dto.resource_paths, dto.flag, dto.last_modified, id];
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Tickets> = await client.query(sql, values);
            await db.close(client);
            return result.rows[0] ?? null;
        } catch(err: any) {
            const message = "DB ERROR ON UPDATE QUERY";
            const method = "SUPPORT_TicketsRepository_update";
            logError(message, method, err);
            await db.close(client);
            throw new DBQueryErrorException(err);
        }
    }

    async delete(id: string): Promise<boolean> {
        const filterColumn = "ticket_id";
        const sql = `DELETE FROM ${this.table} WHERE ${filterColumn} = $1;`;
        const value = [id];
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result = await client.query(sql, value);
            await db.close(client);
            return result.rowCount > 0;
        } catch(err: any) {
            const message = "DB ERROR ON DELETE QUERY";
            const method = "SUPPORT_TicketsRepository_delete";
            logError(message, method, err);
            await db.close(client);
            throw new DBQueryErrorException(err);
        }
    }
}

export default new TicketsRepository();