import { join } from "path";
import migrate from "node-pg-migrate";

export async function runMigrations(testfile: string = 'unknown') {
    const {
        DB_TEST_HOST = "localhost",
        DB_TEST_PORT = "5432",
        DB_TEST_USER = "testuser",
        DB_TEST_PASS = "testpass",
        DB_TEST_DATABASE = "testdb"
    } = process.env;
    
    try {
        const migrationsDir = join(process.cwd(), "migrations");

        await migrate({
            databaseUrl: {
                host: DB_TEST_HOST,
                port: Number(DB_TEST_PORT),
                user: DB_TEST_USER,
                password: DB_TEST_PASS,
                database: DB_TEST_DATABASE
            },
            dir: migrationsDir,
            direction: "up",
            migrationsTable: "pgmigrations",
            verbose: true,
            count: 999,
        });
        console.log(`Migrations executed successfully for: '${testfile}'.`);
    } catch (err: any) {
        console.error(`Migration failed for: '${testfile}': `, err);
    }
}
