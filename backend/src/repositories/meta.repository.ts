import { QueryResult } from "pg";
import { DBConnection } from "../configs/db";
import { BaseRepository, FindRepository } from "./interfaces/base.repository.interface";
import { Maintenance, Meta, MetaId } from "./interfaces/meta.entity.interface";
import { logError } from "../utils/common.utils";
import { DBQueryErrorException } from "../utils/exceptions/db.exception";

class MetaRepository implements BaseRepository<Meta>, FindRepository<Meta> {

    private table: string;

    constructor() {
        this.table = "meta";
    }

    async findById(id: MetaId): Promise<Meta | null> {
        const filterColumn = "id";
        const sql = `SELECT 
        id, app, author, build_on, environment, app_version, db_version, docker_image, docker_version, jenkins_version, maintenance_mode, last_modified, created_on 
        FROM ${this.table} 
        WHERE ${filterColumn} = $1;
        `;
        const value = [id];

        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Meta> = await client.query(sql, value);
            return result.rows[0] ?? null;
        } catch(err: any) {
            const message = "DB ERROR ON SELECT QUERY";
            const method = "SUPPORT_MetaRepository_findById";
            logError(message, method, err);
            throw new DBQueryErrorException(err);
        } finally {
            await db.close(client);
        }
    }

    async findByName(name: string): Promise<Meta | null> {
        const filterColumn = "app";
        const sql = `SELECT 
        id, app, author, build_on, environment, app_version, db_version, docker_image, docker_version, jenkins_version, maintenance_mode, last_modified, created_on 
        FROM ${this.table} 
        WHERE ${filterColumn} = $1;
        `;
        const value = [name];

        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Meta> = await client.query(sql, value);
            return result.rows[0] ?? null;
        } catch(err: any) {
            const message = "DB ERROR ON SELECT QUERY";
            const method = "SUPPORT_MetaRepository_findByName";
            logError(message, method, err);
            throw new DBQueryErrorException(err);
        } finally {
            await db.close(client);
        }
    }

    async findAll(): Promise<Meta[] | null> {
        const orderPrio = "id";
        const sql: string = `SELECT * FROM ${this.table} ORDER BY ${orderPrio} ASC;`;
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Meta> = await client.query(sql);
            return !result.rows[0] || result.rows.length === 0 ? null : result.rows;
        } catch(err: any) {
            const message = "DB ERROR ON SELECT QUERY";
            const method = "SUPPORT_MetaRepository_findAll";
            logError(message, method, err);
            throw new DBQueryErrorException(err);
        } finally {
            await db.close(client);
        }
    }

    async findMaintenance(name: string): Promise<Maintenance | null> {
        const filterColumn = "app";
        const sql = `SELECT id, app, build_on, maintenance_mode, last_modified, created_on FROM ${this.table} WHERE ${filterColumn} = $1;`;
        const value = [name];

        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Maintenance> = await client.query(sql, value);
            return result.rows[0] ?? null;
        } catch(err: any) {
            const message = "DB ERROR ON SELECT QUERY";
            const method = "SUPPORT_MetaRepository_findMaintenance";
            logError(message, method, err);
            throw new DBQueryErrorException(err);
        } finally {
            await db.close(client);
        }
    }

    async update(id: MetaId, dto: Partial<Meta>): Promise<Meta | null> {
        const filterColumn = "id";
        const sql = `UPDATE ${this.table}
        SET app = $1, author = $2, build_on = $3, environment = $4, app_version = $5, db_version = $6,
        docker_image = $7, docker_version = $8, jenkins_version = $9, last_modified = $10
        WHERE ${filterColumn} = $11
        RETURNING id, app, author, build_on, environment, app_version, db_version, docker_image, docker_version, jenkins_version, maintenance_mode, created_on, last_modified;
        `;
        const values = [dto.app, dto.author, dto.build_on, dto.environment, dto.app_version, dto.db_version, dto.docker_image, dto.docker_version, dto.jenkins_version, dto.last_modified, id];

        let db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Meta> = await client.query(sql, values);
            return result.rows[0] ?? null;
        } catch(err: any) {
            const message = "DB ERROR ON UPDATE QUERY";
            const method = "SUPPORT_MetaRepository_update";
            logError(message, method, err);
            throw new DBQueryErrorException(err);
        } finally {
            await db.close(client);
        }
    }

    async updateMaintenance(id: MetaId, dto: Partial<Meta>): Promise<Maintenance | null> {
        const filterColumn = "id";
        const sql = `UPDATE ${this.table}
        SET maintenance_mode = $1, last_modified = $2
        WHERE ${filterColumn} = $3
        RETURNING id, app, build_on, maintenance_mode, created_on, last_modified;
        `;
        const values = [dto.maintenance_mode, dto.last_modified, id];
        let db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Maintenance> = await client.query(sql, values);
            return result.rows[0] ?? null;
        } catch(err: any) {
            const message = "DB ERROR ON UPDATE QUERY";
            const method = "SUPPORT_MetaRepository_updateMaintenance";
            logError(message, method, err);
            throw new DBQueryErrorException(err);
        } finally {
            await db.close(client);
        }
    }

    // DEMO REPOSITORY CALL
    async demoError(): Promise<any | null> {
        const filterColumn = "id";
        const sql = `SEL app_version FROM ${this.table} WHERE ${filterColumn} = $1;`; // Invalid query for demo.
        const value = [999];
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Meta> = await client.query(sql, value);
            return result.rows[0] ?? null;
        } catch(err: any) {
            const message = "DB ERROR ON SELECT QUERY";
            const method = "SUPPORT_MetaRepository_demoError";
            logError(message, method, err);
            throw new DBQueryErrorException(err);
        } finally {
            await db.close(client);
        }
    }
}

export default new MetaRepository();