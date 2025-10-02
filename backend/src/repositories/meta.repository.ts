import { QueryResult } from "pg";
import { DBConnection } from "../configs/db";
import { IBaseRepository, IRepoError } from "./interfaces/base.repository.interface";
import { Meta } from "./interfaces/meta.entity.interface";
import * as Utils from '../utils/common.utils';
import { secrets } from "../utils/secrets.utils";
import { EnvMode } from "../utils/enums/env-mode.enum";

class MetaRepository implements IBaseRepository<Meta> {

    private table: string;

    constructor() {
        this.table = 'meta';
    }

    async findById(id: number): Promise<Meta | IRepoError | null> {
        const idColumn = 'id';
        const sql = `SELECT * FROM ${this.table} WHERE ${idColumn} = $1;`;
        const value = [id];

        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Meta> = await client.query(sql, value);
            await db.close(client);
            return result.rows[0] ?? null;

        } catch(err: any) {
            // logging
            if(secrets.MODE === EnvMode.DEV) {
                console.log("DB ERROR ON SELECT (Meta Repository, findById): ", err);
            }
            await db.close(client);
            return {
                method: 'support_meta_findById',
                error: err
            }
        }
    }

    async update(id: number, data: Partial<Meta>): Promise<Meta | IRepoError | null> {
        const timeStamp = Utils.getCustomLocaleTimestamp();
        const sql = `UPDATE ${this.table}
        SET app = $1, author = $2, build_on = $3, environment = $4, app_version = $5, db_version = $6,
        docker_image = $7, docker_version = $8, jenkins_version = $9, last_modified = $10
        WHERE id = $11
        RETURNING id, app, author, build_on, environment, app_version, db_version, docker_image, docker_version, jenkins_version, created_on, last_modified;
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
            // logging
            if(secrets.MODE === EnvMode.DEV) {
                console.log("DB ERROR ON UPDATE (Meta Repository, update): ", err);
            }
            await db.close(client);
            return {
                method: 'support_meta_update',
                error: err
            }
        }
    }
}

export default new MetaRepository();