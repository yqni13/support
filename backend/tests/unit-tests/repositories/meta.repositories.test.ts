import { DBConnection } from "../../../src/configs/db";
import metaRepository from "../../../src/repositories/meta.repository"
import { Maintenance, Meta } from "../../../src/repositories/interfaces/meta.entity.interface";
import * as Utils from "../../../src/utils/common.utils";
import * as MockUtils from "../../common.test-utils";
import { IRepoError } from "../../../src/repositories/interfaces/error.repository.interface";
import { MaintenanceMode } from "../../../src/utils/enums/maintenance-mode.enum";

jest.mock("../../../src/configs/db", () => {
    return {
        DBConnection: {
            getInstance: jest.fn()
        }
    }
});

const gmtData = Utils.getPropertiesFromTimezoneOffset(new Date());
const mockVar_timeStamp = `2025-10-02 21:34:00${gmtData.prefix}${gmtData.offset}`;
const mockData: Meta = {
    id: 1,
    app: "support",
    author: "yqni13",
    build_on: "2025-01-01T13:00:01.000",
    environment: "development",
    app_version: "0.0.1",
    db_version: "0.0.2",
    docker_image: "no-image",
    docker_version: "0.0.3",
    jenkins_version: "0.0.4",
    maintenance_mode: MaintenanceMode.E000,
    last_modified: mockVar_timeStamp,
    created_on: "2024-12-31T23:00:01.000"
};

describe('Database tests table <meta>, priority: findById', () => {

    describe('Testing valid fn calls', () => {

        let sql: string;
        beforeEach(() => {
            sql = `SELECT`; // Keep it simple to avoid problems with white-spaces (readability).
        });

        test('Return data for existing entry, params: <key> = 1', async () => {
            const mockParam_id = 1;
            const mockResult: Meta = structuredClone(mockData);
            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await metaRepository.findById(mockParam_id);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining([mockParam_id])
            );
        });

        test('Return null for non-existing entry, params: <key> = 0', async () => {
            const mockParam_id = 0;
            const mockResult = null;
            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await metaRepository.findById(mockParam_id);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining([mockParam_id])
            );
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

describe('Database tests table <meta>, priority: findByName', () => {

    describe('Testing valid fn calls', () => {

        let sql: string;
        beforeEach(() => {
            sql = `SELECT`; // Keep it simple to avoid problems with white-spaces (readability).
        });

        test('Return data for existing entry, params: <key> = "support"', async () => {
            const mockParam_name = 'support';
            const mockResult: Meta = structuredClone(mockData);
            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await metaRepository.findByName(mockParam_name);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining([mockParam_name])
            );
        });

        test('Return null for non-existing entry, params: <key> = "testapp"', async () => {
            const mockParam_name = 'testapp';
            const mockResult = null;
            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await metaRepository.findByName(mockParam_name);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining([mockParam_name])
            );
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Failing query to fall inside catch-block', async () => {
            const mockParam_name = 'support';
            const mockErrorMsg = "DB ERROR ON SELECT QUERY, (Meta TEST Repository, findByName)";
            const mockResult = null;
            const _ = MockUtils.mapMockDbClient(mockResult, mockErrorMsg);
            const testFn = await metaRepository.findByName(mockParam_name);

            expect(testFn).toEqual<IRepoError>({
                method: 'support_meta_findByName',
                error: expect.any(Error)
            });
            expect((testFn as IRepoError).error.message).toBe(mockErrorMsg);
        })
    })
})

describe('Database tests table <meta>, priority: findAll', () => {

    describe('Testing valid fn calls', () => {

        test('Return data for multiple existing entries', async () => {
            const mockData_entry0 = structuredClone(mockData);
            const mockData_entry1 = structuredClone(mockData_entry0);
            mockData_entry1['id'] = 2;
            mockData_entry1['app'] = 'testapp';
            const mockResult: Meta[] = [mockData_entry0, mockData_entry1];

            const mockErrorMsg = undefined;
            const mockExpectArray = true;
            const mockClient = MockUtils.mapMockDbClient(mockResult, mockErrorMsg, mockExpectArray);
            const sql = `SELECT * FROM meta ORDER BY id ASC;`;
            const testFn = await metaRepository.findAll();

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(sql);
        });
    })

    describe('Testing invalid fn calls', () => {

        test('Failing query to fall inside catch-block', async () => {
            const mockErrorMsg = "DB ERROR ON SELECT QUERY, (Meta TEST Repository, findAll)";
            const mockResult = null;
            const _ = MockUtils.mapMockDbClient(mockResult, mockErrorMsg);
            const testFn = await metaRepository.findAll();

            expect(testFn).toEqual<IRepoError>({
                method: 'support_meta_findAll',
                error: expect.any(Error)
            });
            expect((testFn as IRepoError).error.message).toBe(mockErrorMsg);
        })
    })
})

describe('Database tests table <meta>, priority: findMaintenance', () => {

    describe('Testing valid fn calls', () => {

        let sql: string;
        beforeEach(() => {
            sql = `SELECT id, app, build_on, maintenance_mode, last_modified, created_on FROM meta WHERE app = $1;`;
        });

        test('Return data for existing entry, params: <name> = "support"', async () => {
            const mockParam_id = 1;
            const mockParam_name = 'support';
            const mockResult: Maintenance = {
                id: mockParam_id,
                app: mockParam_name,
                build_on: mockData.build_on,
                maintenance_mode: MaintenanceMode.E000,
                last_modified: mockVar_timeStamp,
                created_on: mockData.created_on
            }
            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await metaRepository.findMaintenance(mockParam_name);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(sql, [mockParam_name]);
        });

        test('Return null for non-existing entry, params: <name> = "testapp"', async () => {
            const mockParam_name = 'testapp';
            const mockResult = null;
            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await metaRepository.findMaintenance(mockParam_name);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(sql, [mockParam_name]);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Failing query to fall inside catch-block', async () => {
            const mockParam_name = 'support';
            const mockErrorMsg = "DB ERROR ON SELECT QUERY, (Meta TEST Repository, findMaintenance)";
            const mockResult = null;
            const _ = MockUtils.mapMockDbClient(mockResult, mockErrorMsg);
            const testFn = await metaRepository.findMaintenance(mockParam_name);

            expect(testFn).toEqual<IRepoError>({
                method: 'support_meta_findMaintenance',
                error: expect.any(Error)
            });
            expect((testFn as IRepoError).error.message).toBe(mockErrorMsg);
        })
    })
})

describe('Database tests table <meta>, priority: udpate', () => {

    describe('Testing valid fn calls', () => {

        let sql: string;
        let mockParam_data: Partial<Meta>;
        let mockValues: any[];
        beforeEach(() => {
            sql = `UPDATE meta`; // Keep it simple if it isn't essential.
            mockParam_data = structuredClone(mockData);
            delete mockParam_data['id'];
            delete mockParam_data['maintenance_mode'];
            delete mockParam_data['last_modified'];
            delete mockParam_data['created_on'];
            mockValues = [];
        });

        test('Return data of changed entry by valid id', async () => {
            const mockParam_id = 1;
            Object.values(mockParam_data).forEach((val) => {
                mockValues.push(val);
            });
            mockValues.push(mockVar_timeStamp);
            mockValues.push(mockParam_id);
            const mockResult: Meta = structuredClone(mockData);

            // Mock Utils generated timeStamp for easy comparison.
            jest.spyOn(Utils, "getTimestampWithOffsetInfo").mockReturnValue(mockVar_timeStamp);

            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await metaRepository.update(mockParam_id, mockParam_data);

            expect(testFn).toEqual(mockResult);
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining(mockValues)
            );
        })

        test('Return null for non-existing entry by invalid id', async () => {
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

        let mockParam_data: Partial<Meta>;
        beforeEach(() => {
            mockParam_data = structuredClone(mockData);
            delete mockParam_data['id'];
            delete mockParam_data['last_modified'];
            delete mockParam_data['created_on'];
        });

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

describe('Database tests table <meta>, priority: updateMaintenance', () => {

    describe('Testing valid fn calls', () => {

        let sql: string;
        let mockParam_data: { [key: string]: string }
        let mockValues: any[];
        beforeEach(() => {
            sql = `UPDATE meta`; // Keep it simple to avoid problems with white-spaces (readability).
            mockParam_data = { maintenance_mode: MaintenanceMode.D013 };
            mockValues = [];
        });

        test('Return data of changed entry by valid name', async () => {
            const mockParam_name = 'support';
            mockValues = [mockParam_data.maintenance_mode, mockVar_timeStamp, mockParam_name];
            const mockResult: Maintenance = {
                id: mockData.id,
                app: mockParam_name,
                build_on: mockData.build_on,
                maintenance_mode: (mockParam_data.maintenance_mode) as MaintenanceMode,
                last_modified: mockData.last_modified,
                created_on: mockData.created_on
            }
            Object.assign(mockResult, mockParam_data);

            // Mock Utils generated timeStamp for easy comparison.
            jest.spyOn(Utils, "getTimestampWithOffsetInfo").mockReturnValue(mockVar_timeStamp);

            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await metaRepository.updateMaintenance(mockParam_name, mockParam_data);

            expect(testFn).toEqual(mockResult);
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining(mockValues)
            );
        })

        test('Return null for non-existing entry by invalid name', async () => {
            const mockParam_name = 'testapp';
            mockValues = [mockParam_data.maintenance_mode, mockVar_timeStamp, mockParam_name];
            const mockResult = null;

            // No mock for timeStamp necessary because no result to compare in this test.
            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await metaRepository.updateMaintenance(mockParam_name, mockParam_data);

            expect(testFn).toEqual(mockResult);
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining(mockValues)
            );
        })
    })

    describe('Testing invalid fn calls', () => {

        let mockParam_data: { [key: string]: string }
        beforeEach(() => {
            mockParam_data = { maintenance_mode: MaintenanceMode.D013 };
        });

        test('Failing query to fall inside catch-block', async () => {
            const mockParam_name = 'support';
            const mockErrorMsg = "DB ERROR ON UPDATEMAINTENANCE QUERY, (Meta TEST Repository, updateMaintenance)";
            const mockResult = null;

            const _ = MockUtils.mapMockDbClient(mockResult, mockErrorMsg);
            const testFn = await metaRepository.updateMaintenance(mockParam_name, mockParam_data);

            expect(testFn).toEqual<IRepoError>({
                method: 'support_meta_updateMaintenance',
                error: expect.any(Error)
            });
            expect((testFn as IRepoError).error.message).toBe(mockErrorMsg);
        })
    })
})