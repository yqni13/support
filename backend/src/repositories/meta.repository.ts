import { QueryResult } from "pg";
import { DBConnection } from "../configs/db";
import { IBaseRepository, IFindRepository } from "./interfaces/base.repository.interface";
import { Maintenance, Meta } from "./interfaces/meta.entity.interface";
import * as Utils from '../utils/common.utils';
import { DBQueryErrorException } from "../utils/exceptions/db.exception";

class MetaRepository implements IBaseRepository<Meta>, IFindRepository<Meta> {

    private table: string;

    constructor() {
        this.table = 'meta';
    }

    async findById(id: number): Promise<Meta | null> {
        const filterColumn = 'id';
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
            await db.close(client);
            return result.rows[0] ?? null;
        } catch(err: any) {
            const logMsg = "DB ERROR ON SELECT (Meta Repository, findById): ";
            Utils.logRepoError(logMsg, err);
            await db.close(client);
            throw new DBQueryErrorException('support-dberror-meta-findById', err);
        }
    }

    async findByName(name: string): Promise<Meta | null> {
        const filterColumn = 'app';
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
            await db.close(client);
            return result.rows[0] ?? null;
        } catch(err: any) {
            const logMsg = "DB ERROR ON SELECT (Meta Repository, findByName): ";
            Utils.logRepoError(logMsg, err);
            await db.close(client);
            throw new DBQueryErrorException('support-dberror-meta-findByName', err);
        }
    }

    async findAll(): Promise<Meta[] | null> {
        const orderPrio = 'id';
        const sql: string = `SELECT * FROM ${this.table} ORDER BY ${orderPrio} ASC;`;
        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Meta> = await client.query(sql);
            await db.close(client);
            return result.rows ?? null;
        } catch(err: any) {
            const logMsg = "DB ERROR ON SELECT (Meta Repository, findAll): ";
            Utils.logRepoError(logMsg, err);
            await db.close(client);
            throw new DBQueryErrorException('support-dberror-meta-findAll', err);
        }
    }

    async findMaintenance(name: string): Promise<Maintenance | null> {
        const filterColumn = 'app';
        const sql = `SELECT id, app, build_on, maintenance_mode, last_modified, created_on FROM ${this.table} WHERE ${filterColumn} = $1;`;
        const value = [name];

        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Maintenance> = await client.query(sql, value);
            await db.close(client);
            return result.rows[0] ?? null;
        } catch(err: any) {
            const logMsg = "DB ERROR ON SELECT (Meta Repository, findMaintenance): ";
            Utils.logRepoError(logMsg, err);
            await db.close(client);
            throw new DBQueryErrorException('support-dberror-meta-findMaintenance', err);
        }
    }

    async update(id: number, dto: Partial<Meta>): Promise<Meta | null> {
        const filterColumn = 'id';
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
            await db.close(client);
            return result.rows[0] ?? null;
        } catch(err: any) {
            const logMsg = "DB ERROR ON UPDATE (Meta Repository, update): ";
            Utils.logRepoError(logMsg, err);
            await db.close(client);
            throw new DBQueryErrorException('support-dberror-meta-update', err);
        }
    }

    async updateMaintenance(name: string, dto: Partial<Meta>): Promise<Maintenance | null> {
        const filterColumn = 'app';
        const sql = `UPDATE ${this.table}
        SET maintenance_mode = $1, last_modified = $2
        WHERE ${filterColumn} = $3
        RETURNING id, app, build_on, maintenance_mode, created_on, last_modified;
        `;
        const values = [dto.maintenance_mode, dto.last_modified, name];
        let db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Maintenance> = await client.query(sql, values);
            await db.close(client);
            return result.rows[0] ?? null;
        } catch(err: any) {
            const logMsg = "DB ERROR ON UPDATE (Meta Repository, updateMaintenance): ";
            Utils.logRepoError(logMsg, err);
            await db.close(client);
            throw new DBQueryErrorException('support-dberror-meta-updateMaintenance', err);
        }
    }
}

export default new MetaRepository();