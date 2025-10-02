import { QueryResult } from "pg";
import { DBConnection } from "../../../src/configs/db";
import metaRepository from "../../../src/repositories/meta.repository"
import { IRepoError } from "../../../src/repositories/interfaces/base.repository.interface";
import { Meta } from "../../../src/repositories/interfaces/meta.entity.interface";
import * as Utils from "../../../src/utils/common.utils";
import * as MockUtils from "../../common.test-utils";

jest.mock("../../../src/configs/db", () => {
    return {
        DBConnection: {
            getInstance: jest.fn()
        }
    }
})

describe('Database tests table <meta>, priority: findById', () => {

    describe('Testing valid fn calls', () => {

        let sql: string;
        beforeEach(() => {
            sql = "SELECT * FROM meta WHERE id = $1;";
        })

        test('Params: <key> = 1', async () => {
            const mockParam_id = 1;
            const mockResult = {
                id: 1,
                app: "support",
                author: "yqni13",
                build_on: "2025-01-01T00:00:01.000z",
                environment: "development",
                app_version: "0.1.2",
                db_version: "0.0.0",
                docker_image: "no-image",
                docker_version: "0.0.0",
                jenkins_version: "0.0.0",
                created_on: "2024-12-31T23:00:01.000Z",
                last_modified: "2025-09-29T01:18:38.000Z"
            };
            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await metaRepository.findById(mockParam_id);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(sql, [mockParam_id]);
        });

        test('Params: <key> = 0', async () => {
            const mockParam_id = 0;
            const mockResult = null;
            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await metaRepository.findById(mockParam_id);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(sql, [mockParam_id]);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Failing query to fall inside catch-block', async () => {
            const mockParam_id = 1;
            const mockErrorMsg = "DB ERROR ON SELECT QUERY, (Meta TEST Repository, findById)";
            const mockResult = null;
            const _ = MockUtils.mapMockDbClient(mockResult, mockErrorMsg);
            const testFn = await metaRepository.findById(mockParam_id);

            expect(testFn).toEqual<IRepoError>({
                method: 'support_meta_findById',
                error: expect.any(Error)
            });
            expect((testFn as IRepoError).error.message).toBe(mockErrorMsg);
        })
    })
})

describe('Database tests table <meta>, priority: udpate', () => {

    describe('Testing valid fn calls', () => {

        let sql: string;
        let data: Partial<Meta>;
        let mockVar_timeStamp: string;
        let mockParam_data: Partial<Meta>;
        let mockValues: any[];
        beforeEach(() => {
            mockVar_timeStamp = "2025-10-02T21:34:00.000Z";
            sql = `UPDATE meta`; // Keep it simple if it isn't essential.
            data = {
                id: 1,
                app: "support",
                author: "yqni13",
                build_on: "2025-01-01T00:00:01.000z",
                environment: "development",
                app_version: "0.0.1",
                db_version: "0.0.2",
                docker_image: "no-image",
                docker_version: "0.0.3",
                jenkins_version: "0.0.4",
                last_modified: mockVar_timeStamp,
                created_on: "2024-12-31T23:00:01.000Z"
            };
            mockParam_data = structuredClone(data);
            delete mockParam_data['id'];
            delete mockParam_data['last_modified'];
            delete mockParam_data['created_on'];
            mockValues = [];
        })

        test('PUT by valid values', async () => {
            const mockParam_id = 1;
            Object.values(mockParam_data).forEach((val) => {
                mockValues.push(val);
            });
            mockValues.push(mockVar_timeStamp);
            mockValues.push(mockParam_id);
            const mockResult = structuredClone(data);

            // Mock Utils generated timeStamp for easy comparison.
            jest.spyOn(Utils, "getCustomLocaleTimestamp").mockReturnValue(mockVar_timeStamp);

            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await metaRepository.update(mockParam_id, mockParam_data);

            expect(testFn).toEqual(mockResult);
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining(mockValues)
            );
        })

        test('PUT by id for non-existing entry', async () => {
            const mockParam_id = 1000;
            Object.values(mockParam_data).forEach((val) => {
                mockValues.push(val);
            });
            mockValues.push(mockVar_timeStamp);
            mockValues.push(mockParam_id);

            const mockResult = null;
            // No mock for timeStamp necessary because no result to compare in this test.

            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await metaRepository.update(mockParam_id, mockParam_data);

            expect(testFn).toEqual(mockResult);
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining(mockValues)
            );
        })
    })

    describe('Testing invalid fn calls', () => {

        let data: Partial<Meta>;
        let mockVar_timeStamp: string;
        let mockParam_data: Partial<Meta>;
        beforeEach(() => {
            mockVar_timeStamp = "2025-10-02T21:34:00.000Z";
            data = {
                id: 1,
                app: "support",
                author: "yqni13",
                build_on: "2025-01-01T00:00:01.000z",
                environment: "development",
                app_version: "0.0.1",
                db_version: "0.0.2",
                docker_image: "no-image",
                docker_version: "0.0.3",
                jenkins_version: "0.0.4",
                last_modified: mockVar_timeStamp,
                created_on: "2024-12-31T23:00:01.000Z"
            };
            mockParam_data = structuredClone(data);
            delete mockParam_data['id'];
            delete mockParam_data['last_modified'];
            delete mockParam_data['created_on'];
        })

        test('Failing query to fall inside catch-block', async () => {
            const mockParam_id = 1;
            const mockErrorMsg = "DB ERROR ON UPDATE QUERY, (Meta TEST Repository, update)";
            const mockResult = null;

            const _ = MockUtils.mapMockDbClient(mockResult, mockErrorMsg);
            const testFn = await metaRepository.update(mockParam_id, mockParam_data);

            expect(testFn).toEqual<IRepoError>({
                method: 'support_meta_update',
                error: expect.any(Error)
            });
            expect((testFn as IRepoError).error.message).toBe(mockErrorMsg);
        })
    })
})