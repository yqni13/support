import {
    ClientsStatusResponseDTO,
    ClientsLastUseResponseDTO,
    ClientsStatusUpdateDTO,
    ClientsLastUseUpdateDTO,
    ClientsFlagUpdateDTO,
    ClientsFlagResponseDTO
} from "../../../src/dtos/clients.dto";
import { DBConnection } from "../../../src/configs/db";
import * as CommonUtils from "../../../src/utils/common.utils";
import * as MockUtils from "../../common.test-utils";
import { default as mockId } from "../../mock-data/id.mock-data.json";
import { Clients, ClientsId } from "../../../src/repositories/interfaces/clients.entity.interface";
import { ApiKeyStatus } from "../../../src/utils/enums/api-key-status.enum";
import clientsRepository from "../../../src/repositories/clients.repository";
import clientsModel from "../../../src/models/clients.model";
import { secrets } from "../../../src/utils/secrets.utils";
import { DBQueryErrorException } from "../../../src/utils/exceptions/db.exception";
import { Flag } from "../../../src/utils/enums/flag.enum";

jest.mock("../../../src/configs/db", () => {
    return {
        DBConnection: {
            getInstance: jest.fn()
        }
    }
});

const mockValidClientId = mockId.clients.valid[0] as ClientsId;
const mockVar_keyHash = secrets.TEST_APIKEY_HASH;
const mockTimestamp = '2025-01-01T14:00:02.000Z';
const mockData: Clients = {
    client_id: mockValidClientId,
    name: 'valid_clients_test_name',
    api_key_hash: mockVar_keyHash,
    status: ApiKeyStatus.ACTIVE,
    flag: null,
    last_use: mockTimestamp,
    last_modified: mockTimestamp,
    created_on: mockTimestamp,
};
const expectExceptionResult = DBQueryErrorException;
const mockBoolean = false;

describe('Unit-tests (repository), priority: entity Clients', () => {

    describe('Database tests table <clients>, priority: fn findById()', () => {

        describe('Testing valid fn calls', () => {

            let sql: string;
            beforeEach(() => {
                sql = `SELECT`;
            });

            test('Return data for existing entry, params: valid <id>', async () => {
                const mockResult: Clients | null = structuredClone(mockData);
                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await clientsRepository.findById(mockValidClientId);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining([mockValidClientId])
                );
            })

            test('Return null for non-existing entry, params: invalid <id>', async () => {
                const mockParam_id = mockId.clients.invalid[0] as ClientsId;
                const mockResult: Clients | null = null;
                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await clientsRepository.findById(mockParam_id);

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
                const mockParam_id = mockId.clients.invalid[0] as ClientsId;
                const mockErrorMsg = "DB ERROR ON SELECT QUERY";
                const mockResult: Clients | null = null;
                jest.spyOn(CommonUtils, "logError").mockReturnValue();
                const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                await expect(() => clientsRepository.findById(mockParam_id))
                    .rejects.toThrow(expectExceptionResult);
            })
        })
    })

    describe('Database tests table <clients>, priority: fn findByActiveKey()', () => {

        describe('Testing valid fn calls', () => {

            let sql: string;
            beforeEach(() => {
                sql = `SELECT`;
            });

            test('Return data for existing entry, params: <apikey>', async () => {
                const mockParam_hash = structuredClone(mockVar_keyHash);
                const mockResult: Clients = structuredClone(mockData);
                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await clientsRepository.findByActiveKey(mockParam_hash);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining([mockParam_hash])
                );
            })

            test('Return null for non-existing entry, params: <apikey>', async () => {
                const mockParam_hash = 'non-existing_clients_test_apikey_hash';
                const mockResult = null;
                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await clientsRepository.findByActiveKey(mockParam_hash);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining([mockParam_hash])
                );
            })
        })

        describe('Testing invalid fn calls', () => {

            test('Throw DBQueryErrorException by catch-block', async () => {
                const mockParam_hash = 'error_test_hash_value';
                const mockErrorMsg = "DB ERROR ON SELECT QUERY";
                const mockResult = null;
                jest.spyOn(CommonUtils, "logError").mockReturnValue();
                const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                await expect(() => clientsRepository.findByActiveKey(mockParam_hash))
                    .rejects.toThrow(expectExceptionResult);
            })
        })
    })

    describe('Database tests table <clients>, priority: fn findStatusByName()', () => {

        describe('Testing valid fn calls', () => {

            let sql: string;
            beforeEach(() => {
                sql = `SELECT`;
            });

            test('Return data for existing entry, params: <name>', async () => {
                const mockParam_name = 'existing_clients_test_name';
                const mockResult: ClientsStatusResponseDTO = {
                    client_id: mockValidClientId,
                    name: mockParam_name,
                    status: ApiKeyStatus.ACTIVE,
                    last_use: mockTimestamp,
                    last_modified: mockTimestamp,
                    created_on: mockTimestamp
                };

                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await clientsRepository.findStatusByName(mockParam_name);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining([mockParam_name])
                );
            })

            test('Return empty obj for non-existing entry, params: <name>', async () => {
                const mockParam_name = 'non-existing_clients_test_name';
                const mockResult = {};
                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await clientsRepository.findStatusByName(mockParam_name);

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
                const mockParam_name = 'error_clients_test_name';
                const mockErrorMsg = "DB ERROR ON SELECT QUERY";
                const mockResult = null;
                jest.spyOn(CommonUtils, "logError").mockReturnValue();
                const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                await expect(() => clientsRepository.findByActiveKey(mockParam_name))
                    .rejects.toThrow(expectExceptionResult);
            })
        })
    })

    describe('Database tests table <clients>, priority: fn create()', () => {

        let sql: string;
        let mockVar_apiKey: any;
        let mockParam_entity: Clients;
        beforeEach(() => {
            sql = `INSERT`;
            mockVar_apiKey = clientsModel._generateApiKeyObj();
            mockParam_entity = {
                client_id: mockValidClientId,
                name: 'valid_clients_test_name',
                api_key_hash: mockVar_apiKey.keyHash,
                status: ApiKeyStatus.ACTIVE,
                flag: null,
                last_use: mockTimestamp,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            }
        });

        describe('Testing valid fn calls', () => {

            test('Return data for created entry, params: <name> = "valid_clients_test_name"', async () => {
                const mockValues: any[] = Object.values(mockParam_entity).map(value => value);
                const mockResult: Clients = structuredClone(mockParam_entity);
                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await clientsRepository.create(mockParam_entity);

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
                const mockErrorMsg = "DB ERROR ON INSERT QUERY";
                const mockResult = null;
                jest.spyOn(CommonUtils, "logError").mockReturnValue();
                const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                await expect(() => clientsRepository.create(mockParam_entity))
                    .rejects.toThrow(expectExceptionResult);
            })
        })
    })

    describe('Database tests table <clients>, priority: fn updateStatus()', () => {

        let sql: string;
        let mockParam_name: string;
        let mockParam_dto: ClientsStatusUpdateDTO;
        beforeEach(() => {
            sql = `UPDATE`;
            mockParam_name = 'valid_clients_test_name';
            mockParam_dto = { status: ApiKeyStatus.DISABLED, last_modified: mockTimestamp };
        });

        describe('Testing valid fn calls', () => {

            test('Return data of changed entry, params: valid <id>', async () => {
                const mockParam_id = mockValidClientId;
                const mockValues = [mockParam_dto.status, mockTimestamp, mockParam_id];

                const mockResult: ClientsStatusResponseDTO = {
                    client_id: mockParam_id,
                    name: mockParam_name,
                    status: mockParam_dto.status,
                    last_use: mockTimestamp,
                    last_modified: mockTimestamp,
                    created_on: mockTimestamp
                };
                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await clientsRepository.updateStatus(mockParam_id, mockParam_dto);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining(mockValues)
                );
            })

            test('Return null for non-existing entry by invalid id', async () => {
                const mockParam_id = mockId.clients.invalid[0] as ClientsId;
                const mockValues = [mockParam_dto.status, mockTimestamp, mockParam_id];

                const mockResult = null;
                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await clientsRepository.updateStatus(mockParam_id, mockParam_dto);

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
                const mockParam_id = mockId.clients.invalid[0] as ClientsId;
                const mockErrorMsg = "DB ERROR ON UPDATE QUERY";
                const mockResult = null;
                jest.spyOn(CommonUtils, "logError").mockReturnValue();
                const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                await expect(() => clientsRepository.updateStatus(mockParam_id, mockParam_dto))
                    .rejects.toThrow(expectExceptionResult);
            })
        })
    })

    describe('Database tests table <clients>, priority: fn updateFlag()', () => {

        let sql: string;
        let mockParam_dto: ClientsFlagUpdateDTO;
        beforeEach(() => {
            sql = `UPDATE`;
            mockParam_dto = { flag: Flag.WARNING, last_modified: mockTimestamp };
        });

        describe('Testing valid fn calls', () => {

            test('Return data of changed entry, params: valid <id>', async () => {
                const mockParam_id = mockValidClientId;
                const mockValues = [mockParam_dto.flag, mockTimestamp, mockParam_id];

                const mockResult: ClientsFlagResponseDTO | null = {
                    client_id: mockParam_id,
                    flag: Flag.WARNING,
                    last_use: mockTimestamp,
                    last_modified: mockTimestamp,
                    created_on: mockTimestamp
                };
                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await clientsRepository.updateFlag(mockParam_id, mockParam_dto);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining(mockValues)
                );
            })

            test('Return null for non-existing entry, params: invalid <id>', async () => {
                const mockParam_id = mockId.clients.invalid[0] as ClientsId;
                const mockValues = [mockParam_dto.flag, mockTimestamp, mockParam_id];

                const mockResult: ClientsFlagResponseDTO | null = null;
                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await clientsRepository.updateFlag(mockParam_id, mockParam_dto);

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
                const mockParam_id = mockId.clients.invalid[0] as ClientsId;
                const mockErrorMsg = "DB ERROR ON UPDATE QUERY";
                const mockResult: ClientsFlagResponseDTO | null = null;
                jest.spyOn(CommonUtils, "logError").mockReturnValue();
                const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                await expect(() => clientsRepository.updateFlag(mockParam_id, mockParam_dto))
                    .rejects.toThrow(expectExceptionResult);
            })
        })
    })

    describe('Database tests table <clients>, priority: fn updateLastUse()', () => {

        let sql: string;
        let mockParam_name: string;
        let mockParam_dto: ClientsLastUseUpdateDTO;
        beforeEach(() => {
            sql = `UPDATE`;
            mockParam_name = 'valid_clients_test_name';
            mockParam_dto = { last_use: mockTimestamp };
        });

        describe('Testing valid fn calls', () => {

            test('Return data of changed entry, params: valid <id>', async () => {
                const mockParam_id = mockValidClientId;
                const mockValues = [mockTimestamp, mockParam_id];

                jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(mockTimestamp);

                const mockResult: ClientsLastUseResponseDTO = {
                    client_id: mockParam_id,
                    name: mockParam_name,
                    last_use: mockTimestamp,
                    last_modified: mockTimestamp,
                    created_on: mockTimestamp
                };
                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await clientsRepository.updateLastUse(mockParam_id, mockParam_dto);

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(sql),
                    expect.arrayContaining(mockValues)
                );
            })

            test('Return null for non-existing entry, params: invalid <id>', async () => {
                const mockParam_id = mockId.clients.invalid[0] as ClientsId;
                const mockValues = [mockTimestamp, mockParam_id];

                const mockResult = null;
                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await clientsRepository.updateLastUse(mockParam_id, mockParam_dto);

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
                const mockParam_id = mockId.clients.invalid[0] as ClientsId;
                const mockErrorMsg = "DB ERROR ON UPDATE QUERY";
                const mockResult = null;
                jest.spyOn(CommonUtils, "logError").mockReturnValue();
                const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

                await expect(() => clientsRepository.updateLastUse(mockParam_id, mockParam_dto))
                    .rejects.toThrow(expectExceptionResult);
            })
        })
    })
})

