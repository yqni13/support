import { DBConnection } from "../../../src/configs/db";
import metaRepository from "../../../src/repositories/meta.repository";
import { Maintenance, Meta, MetaId } from "../../../src/repositories/interfaces/meta.entity.interface";
import * as CommonUtils from "../../../src/utils/common.utils";
import * as MockUtils from "../../common.test-utils";
import { MaintenanceMode } from "../../../src/utils/enums/maintenance-mode.enum";
import { MaintenanceUpdateDTO } from "../../../src/dtos/meta.dto";
import { EnvMode } from "../../../src/utils/enums/env-mode.enum";
import { DBQueryErrorException } from "../../../src/utils/exceptions/db.exception";
import { default as mockId } from "../../mock-data/id.mock-data.json";

jest.mock("../../../src/configs/db", () => {
    return {
        DBConnection: {
            getInstance: jest.fn()
        }
    }
});

const mockValidMetaId = mockId.meta.valid[0] as MetaId;
const mockTimestamp = '2025-01-01T14:00:01.000Z';
const mockData: Meta = {
    id: mockValidMetaId,
    app: "support",
    author: "yqni13",
    build_on: mockTimestamp,
    environment: EnvMode.DEV,
    app_version: "0.0.1",
    db_version: "0.0.2",
    docker_image: "no-image",
    docker_version: "0.0.3",
    jenkins_version: "0.0.4",
    maintenance_mode: MaintenanceMode.A000,
    last_modified: mockTimestamp,
    created_on: mockTimestamp
};
const expectExceptionResult = DBQueryErrorException;
const mockBoolean = false;

describe('Unit-tests (repository), priority: entity Meta', () => {

    describe('Database tests table <meta>, priority: fn findById()', () => {

        describe('Testing valid fn calls', () => {

            let sql: string;
            beforeEach(() => {
                sql = `SELECT`; // Keep it simple to avoid problems with white-spaces (readability).
            });

            test('Return data for existing entry, params: <id> = 1', async () => {
                const mockParam_id = mockValidMetaId;
                const mockResult: Meta = structuredClone(mockData);
                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await metaRepository.findById(mockParam_id);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining([mockParam_id])
                );
            })

            test('Return null for non-existing entry, params: <id> = 0', async () => {
                const mockParam_id = mockId.meta.invalid[0] as MetaId;
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

            test('Throw DBQueryErrorException by catch-block', async () => {
                const mockParam_id = mockId.meta.invalid[0] as MetaId;
                const mockErrorMsg = "DB ERROR ON SELECT QUERY";
                const mockResult = null;
                jest.spyOn(CommonUtils, "logError").mockReturnValue();
                const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                await expect(() => metaRepository.findById(mockParam_id))
                    .rejects.toThrow(expectExceptionResult);
            })
        })
    })

    describe('Database tests table <meta>, priority: fn findByName()', () => {

        describe('Testing valid fn calls', () => {

            let sql: string;
            beforeEach(() => {
                sql = `SELECT`; // Keep it simple to avoid problems with white-spaces (readability).
            });

            test('Return data for existing entry, params: <name> = "valid_meta_test_name"', async () => {
                const mockParam_name = 'valid_meta_test_name';
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

            test('Return null for non-existing entry, params: <name> = "non-existing_meta_test_name"', async () => {
                const mockParam_name = 'non-existing_meta_test_name';
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

            test('Throw DBQueryErrorException by catch-block', async () => {
                const mockParam_name = 'error_meta_test_name';
                const mockErrorMsg = "DB ERROR ON SELECT QUERY";
                const mockResult = null;
                jest.spyOn(CommonUtils, "logError").mockReturnValue();
                const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                await expect(() => metaRepository.findByName(mockParam_name))
                    .rejects.toThrow(expectExceptionResult);
            })
        })
    })

    describe('Database tests table <meta>, priority: fn findAll()', () => {

        describe('Testing valid fn calls', () => {

            let sql: string;
            beforeEach(() => {
                sql = 'SELECT * FROM meta ORDER BY id ASC;';
            })

            test('Return data for multiple existing entries', async () => {
                const mockData_entry0 = structuredClone(mockData);
                const mockData_entry1 = structuredClone(mockData_entry0);
                mockData_entry1['id'] = 2 as MetaId;
                mockData_entry1['app'] = 'valid_meta_test_name';
                const mockResult: Meta[] = [mockData_entry0, mockData_entry1];

                const mockErrorMsg = undefined;
                const mockExpectArray = true;
                const mockClient = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg, mockExpectArray);
                const testFn = await metaRepository.findAll();

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(sql);
            });

            test('Return null for non-existing entry', async () => {
                const mockResult: Meta[] | null = null;

                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await metaRepository.findAll();

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(sql);
            })
        })

        describe('Testing invalid fn calls', () => {

            test('Throw DBQueryErrorException by catch-block', async () => {
                const mockErrorMsg = "DB ERROR ON SELECT QUERY";
                const mockResult = null;
                jest.spyOn(CommonUtils, "logError").mockReturnValue();
                const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                await expect(() => metaRepository.findAll())
                    .rejects.toThrow(expectExceptionResult);
            })
        })
    })

    describe('Database tests table <meta>, priority: fn findMaintenance()', () => {

        describe('Testing valid fn calls', () => {

            let sql: string;
            beforeEach(() => {
                sql = `SELECT id, app, build_on, maintenance_mode, last_modified, created_on FROM meta WHERE app = $1;`;
            });

            test('Return data for existing entry, params: <name> = "valid_meta_test_name"', async () => {
                const mockParam_id = mockValidMetaId;
                const mockParam_name = 'valid_meta_test_name';
                const mockResult: Maintenance = {
                    id: mockParam_id,
                    app: mockParam_name,
                    build_on: mockData.build_on,
                    maintenance_mode: MaintenanceMode.A000,
                    last_modified: mockData.last_modified,
                    created_on: mockData.created_on
                }
                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await metaRepository.findMaintenance(mockParam_name);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(sql, [mockParam_name]);
            });

            test('Return null for non-existing entry, params: <name> = "non-existing_meta_test_name"', async () => {
                const mockParam_name = 'non-existing_meta_test_name';
                const mockResult = null;
                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await metaRepository.findMaintenance(mockParam_name);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(sql, [mockParam_name]);
            })
        })

        describe('Testing invalid fn calls', () => {

            test('Throw DBQueryErrorException by catch-block', async () => {
                const mockParam_name = 'error_meta_test_name';
                const mockErrorMsg = "DB ERROR ON SELECT QUERY";
                const mockResult = null;
                jest.spyOn(CommonUtils, "logError").mockReturnValue();
                const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                await expect(() => metaRepository.findMaintenance(mockParam_name))
                    .rejects.toThrow(expectExceptionResult);
            })
        })
    })

    describe('Database tests table <meta>, priority: fn udpate()', () => {

        let sql: string;
        let mockParam_dto: Partial<Meta>;
        beforeEach(() => {
            sql = `UPDATE`;
            mockParam_dto = structuredClone(mockData);
            delete mockParam_dto['id'];
            delete mockParam_dto['maintenance_mode'];
            delete mockParam_dto['created_on'];
        });

        describe('Testing valid fn calls', () => {

            test('Return data of changed entry, params: valid <id>', async () => {
                const mockParam_id = mockValidMetaId;
                const mockValues: any[] = Object.values(mockParam_dto).map(value => value);
                mockValues.push(mockParam_id);
                const mockResult: Meta = structuredClone(mockData);

                jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(mockTimestamp);

                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await metaRepository.update(mockParam_id, mockParam_dto);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining(mockValues)
                );
            })

            test('Return null for non-existing entry, params: invalid <id>', async () => {
                const mockParam_id = mockId.meta.invalid[0] as MetaId;
                const mockValues: any[] = Object.values(mockParam_dto).map(value => value);
                mockValues.push(mockParam_id);

                const mockResult = null;
                // No mock for timeStamp necessary because no result to compare in this test.

                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await metaRepository.update(mockParam_id, mockParam_dto);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining(mockValues)
                );
            })
        })

        describe('Testing invalid fn calls', () => {

            test('Throw DBQueryErrorException by catch-block', async () => {
                const mockParam_id = mockId.meta.invalid[0] as MetaId;
                const mockErrorMsg = "DB ERROR ON UPDATE QUERY";
                const mockResult = null;
                jest.spyOn(CommonUtils, "logError").mockReturnValue();
                const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                await expect(() => metaRepository.update(mockParam_id, mockParam_dto))
                    .rejects.toThrow(expectExceptionResult);
            })
        })
    })

    describe('Database tests table <meta>, priority: fn updateMaintenance()', () => {

        let sql: string;
        let mockValues: any[];
        let mockParam_dto: MaintenanceUpdateDTO;
        beforeEach(() => {
            sql = `UPDATE`;
            mockParam_dto = {
                maintenance_mode: MaintenanceMode.E013,
                last_modified: mockTimestamp
            };
            mockValues = [];
        });

        describe('Testing valid fn calls', () => {

            test('Return data of changed entry, params: valid <id>', async () => {
                const mockParam_id = mockValidMetaId;
                mockValues = [mockParam_dto.maintenance_mode, mockParam_dto.last_modified, mockParam_id];
                const mockResult: Maintenance = {
                    id: mockData.id,
                    app: 'support',
                    build_on: mockData.build_on,
                    maintenance_mode: mockParam_dto.maintenance_mode,
                    last_modified: mockTimestamp,
                    created_on: mockData.created_on
                }

                // Mock Utils generated timeStamp for easy comparison.
                jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(mockTimestamp);

                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await metaRepository.updateMaintenance(mockParam_id, mockParam_dto);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining(mockValues)
                );
            })

            test('Return null for non-existing entry, params: invalid <id>', async () => {
                const mockParam_id = mockId.meta.invalid[0] as MetaId;
                mockValues = [mockParam_dto.maintenance_mode, mockParam_dto.last_modified, mockParam_id];
                const mockResult = null;

                // No mock for timeStamp necessary because no result to compare in this test.
                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await metaRepository.updateMaintenance(mockParam_id, mockParam_dto);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining(mockValues)
                );
            })
        })

        describe('Testing invalid fn calls', () => {

            test('Throw DBQueryErrorException by catch-block', async () => {
                const mockParam_id = mockId.meta.invalid[0] as MetaId;
                const mockErrorMsg = "DB ERROR ON UPDATE QUERY";
                const mockResult = null;
                jest.spyOn(CommonUtils, "logError").mockReturnValue();
                const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                await expect(() => metaRepository.updateMaintenance(mockParam_id, mockParam_dto))
                    .rejects.toThrow(expectExceptionResult);
            })
        })
    })
})
