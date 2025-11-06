import { QueryResult } from "pg";
import { DBConnection } from "../configs/db";
import { IBaseRepository, IFindRepository } from "./interfaces/base.repository.interface";
import { IRepoError } from "./interfaces/error.repository.interface";
import { Maintenance, Meta } from "./interfaces/meta.entity.interface";
import * as Utils from '../utils/common.utils';
import { secrets } from "../utils/secrets.utils";
import { EnvMode } from "../utils/enums/env-mode.enum";

class MetaRepository implements IBaseRepository<Meta>, IFindRepository<Meta> {

    private table: string;

    constructor() {
        this.table = 'meta';
    }

    async findById(id: number): Promise<Meta | IRepoError | null> {
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
            // TODO(yqni13): logging
            if(secrets.ENV_MODE === EnvMode.DEV || secrets.ENV_MODE === EnvMode.TEST) {
                console.log("DB ERROR ON SELECT (Meta Repository, findById): ", err);
            }
            await db.close(client);
            return {
                method: 'support_meta_findById',
                error: err
            }
        }
    }

    async findByName(name: string): Promise<Meta | IRepoError | null> {
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
            // TODO(yqni13): logging
            if(secrets.ENV_MODE === EnvMode.DEV || secrets.ENV_MODE === EnvMode.TEST) {
                console.log("DB ERROR ON SELECT (Meta Repository, findByName): ", err);
            }
            await db.close(client);
            return {
                method: 'support_meta_findByName',
                error: err
            }
        }
    }

    async findAll(): Promise<Meta[] | IRepoError | null> {
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
            // TODO(yqni13): logging
            if(secrets.ENV_MODE === EnvMode.DEV || secrets.ENV_MODE === EnvMode.TEST) {
                console.log("DB ERROR ON SELECT (Meta Repository, findAll): ", err);
            }
            await db.close(client);
            return {
                method: 'support_meta_findAll',
                error: err
            }
        }
    }

    async findMaintenance(name: string): Promise<Maintenance | IRepoError | null> {
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
            // TODO(yqni13): logging
            if(secrets.ENV_MODE === EnvMode.DEV || secrets.ENV_MODE === EnvMode.TEST) {
                console.log("DB ERROR ON SELECT (Meta Repository, findMaintenance): ", err);
            }
            await db.close(client);
            return {
                method: 'support_meta_findMaintenance',
                error: err
            }
        }
    }

    async update(id: number, data: Partial<Meta>): Promise<Meta | IRepoError | null> {
        const filterColumn = 'id';
        const timeStamp = Utils.getTimestampWithOffsetInfo(new Date());
        const sql = `UPDATE ${this.table}
        SET app = $1, author = $2, build_on = $3, environment = $4, app_version = $5, db_version = $6,
        docker_image = $7, docker_version = $8, jenkins_version = $9, last_modified = $10
        WHERE ${filterColumn} = $11
        RETURNING id, app, author, build_on, environment, app_version, db_version, docker_image, docker_version, jenkins_version, maintenance_mode, created_on, last_modified;
        `;
        const values = [data.app, data.author, data.build_on, data.environment, data.app_version, data.db_version, data.docker_image, data.docker_version, data.jenkins_version, timeStamp, id];

        let db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Meta> = await client.query(sql, values);
            await db.close(client);
            return result.rows[0] ?? null;
        } catch(err: any) {
            // TODO(yqni13): logging
            if(secrets.ENV_MODE === EnvMode.DEV || secrets.ENV_MODE === EnvMode.TEST) {
                console.log("DB ERROR ON UPDATE (Meta Repository, update): ", err);
            }
            await db.close(client);
            return {
                method: 'support_meta_update',
                error: err
            }
        }
    }

    async updateMaintenance(name: string, data: Partial<Meta>): Promise<Maintenance | IRepoError | null> {
        const filterColumn = 'app';
        const timeStamp = Utils.getTimestampWithOffsetInfo(new Date());
        const sql = `UPDATE ${this.table}
        SET maintenance_mode = $1, last_modified = $2
        WHERE ${filterColumn} = $3
        RETURNING id, app, build_on, maintenance_mode, created_on, last_modified;
        `;
        const values = [data.maintenance_mode, timeStamp, name];

        let db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Maintenance> = await client.query(sql, values);
            await db.close(client);
            return result.rows[0] ?? null;
        } catch(err: any) {
            // TODO(yqni13): logging
            if(secrets.ENV_MODE === EnvMode.DEV || secrets.ENV_MODE === EnvMode.TEST) {
                console.log("DB ERROR ON UPDATEMAINTENANCE (Meta Repository, updateMaintenance): ", err);
            }
            await db.close(client);
            return {
                method: 'support_meta_updateMaintenance',
                error: err
            }
        }
    }
}

export default new MetaRepository();