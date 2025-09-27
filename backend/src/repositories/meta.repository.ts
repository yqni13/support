import { QueryResult } from "pg";
import { DBConnection } from "../configs/db";
import { IBaseRepository, IRepoError } from "./interfaces/base.repository.interface";
import { Meta } from "./interfaces/meta.entity.interface";

class MetaRepository implements IBaseRepository<Meta> {

    constructor() {
        //
    }

    async findById(id: number): Promise<Meta | IRepoError | null> {
        const table = 'meta';
        const idColumn = 'id';
        const sql = `SELECT * FROM ${table} WHERE ${idColumn} = $1;`;
        const value = [id];

        const db = DBConnection.getInstance();
        let client: any;
        try {
            client = await db.connect();
            const result: QueryResult<Meta> = await client.query(sql, value);
            await db.close(client);
            if(result.rows.length > 0) {
                return result.rows[0];
            }
            return null;
        } catch(err: any) {
            // logging
            console.log("DB ERROR ON SELECT (Meta Repository, findById): ", err);
            await db.close(client);
            return {
                method: 'support_meta_findById',
                error: err
            }
        }
    }

    // async update(): Promise<Meta | null> {

    // }
}

export default new MetaRepository();