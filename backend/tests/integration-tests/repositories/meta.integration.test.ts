import { Meta } from './../../../src/repositories/interfaces/meta.entity.interface';
import { NextFunction, Request, Response } from "express"
import { DBTestSetup } from "../db-container.setup";
import { runMigrations } from '../../db-migrations.setup';
import metaRepository from "../../../src/repositories/meta.repository";

jest.mock('../../../src/middleware/auth.middleware.ts', () => {
    return jest.fn(() => {
        return (req: Request, res: Response, next: NextFunction) => next();
    });
});

jest.setTimeout(60_000);

describe('Integration test (repository specific), priority: Meta', () => {

    describe('Testing valid fn calls', () => {

        let dbTestSetup: DBTestSetup;
        beforeAll(async () => {
            dbTestSetup = new DBTestSetup();
            await dbTestSetup.init();
            await runMigrations();
        })

        beforeEach(async () => {
            // Clean tables before each test to fill test data individually.
            await dbTestSetup.clearTables(['meta']);
        })

        afterAll(async () => {
            await dbTestSetup.shutdown();
        })

        test('Repository process fn findById, result: existing entry', async () => {
            const testParam_id = 1;
            const testResult: Meta = {
                id: testParam_id,
                app: "support",
                author: "yqni13",
                build_on: "2025-01-01T00:00:01.000",
                environment: "test",
                app_version: "0.0.1",
                db_version: "0.0.2",
                docker_image: "no-image",
                docker_version: "0.0.3",
                jenkins_version: "0.0.4",
                last_modified: "2025-01-01T01:00:01.000Z",
                created_on: "2025-01-01T01:00:01.000Z"
            }

            dbTestSetup.addTestData();
            let response = await metaRepository.findById(1);
            expect(response).toStrictEqual(testResult)
        })
    })
})