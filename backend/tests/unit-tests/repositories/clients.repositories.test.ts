import { DBConnection } from "../../../src/configs/db";
import * as Utils from "../../../src/utils/common.utils";
import * as MockUtils from "../../common.test-utils";
import { Clients } from "../../../src/repositories/interfaces/clients.entity.interface";
import { ApiKeyStatus } from "../../../src/utils/enums/api-key-status.enum";
import clientsRepository from "../../../src/repositories/clients.repository";
import clientsModel from "../../../src/models/clients.model";
import { secrets } from "../../../src/utils/secrets.utils";
import { ClientsStatusResponseDTO, ClientsLastUseResponseDTO, ClientsStatusUpdateDTO, ClientsLastUseUpdateDTO } from "../../../src/dtos/clients.dto";
import { DBQueryErrorException } from "../../../src/utils/exceptions/db.exception";

jest.mock("../../../src/configs/db", () => {
    return {
        DBConnection: {
            getInstance: jest.fn()
        }
    }
});

const mockVar_id = '9e024539-32e8-4317-8007-84a3956e6b57';
const mockVar_keyHash = secrets.TEST_APIKEY_HASH;
const mockTimestamp = '2025-01-01T14:00:02.000Z';
const mockData: Clients = {
    client_id: mockVar_id,
    name: 'testclient',
    api_key_hash: mockVar_keyHash,
    status: ApiKeyStatus.ACTIVE,
    last_use: mockTimestamp,
    last_modified: mockTimestamp,
    created_on: mockTimestamp,
};
const expectExceptionResult = DBQueryErrorException;
const mockBoolean = false;

describe('Database tests table <clients>, priority: findByActiveKey', () => {

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
            const mockParam_hash = 'test_hash_value';
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
            const mockErrorMsg = "DB ERROR ON SELECT QUERY, (Clients TEST Repository, findByActiveKey)";
            const mockResult = null;
            jest.spyOn(Utils, "logRepoError").mockReturnValue();
            const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

            await expect(() => clientsRepository.findByActiveKey(mockParam_hash))
                .rejects.toThrow(expectExceptionResult);
        })
    })
})

describe('Database tests table <clients>, priority: findStatusByName', () => {
    
    describe('Testing valid fn calls', () => {

        let sql: string;
        beforeEach(() => {
            sql = `SELECT`;
        });

        test('Return data for existing entry, params: <name>', async () => {
            const mockParam_name = 'existing_clients_test_client';
            const mockResult: ClientsStatusResponseDTO = {
                client_id: 'test_id',
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
            const mockParam_name = 'non-existing_clients_test_client';
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
            const mockParam_name = 'error_clients_test_client';
            const mockErrorMsg = "DB ERROR ON SELECT QUERY, (Clients TEST Repository, findStatusByName)";
            const mockResult = null;
            jest.spyOn(Utils, "logRepoError").mockReturnValue();
            const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

            await expect(() => clientsRepository.findByActiveKey(mockParam_name))
                .rejects.toThrow(expectExceptionResult);
        })
    })
})

describe('Database tests table <clients>, priority: create', () => {

    let sql: string;
    let mockVar_apiKey: any;
    let mockParam_entity: Clients;
    beforeEach(() => {
        sql = `INSERT`;
        mockVar_apiKey = clientsModel._generateApiKeyObj();
        mockParam_entity = {
            client_id: mockVar_id,
            name: 'TESTCLIENT',
            api_key_hash: mockVar_apiKey.keyHash,
            status: ApiKeyStatus.ACTIVE,
            last_use: mockTimestamp,
            last_modified: mockTimestamp,
            created_on: mockTimestamp
        }
    });

    describe('Testing valid fn calls', () => {

        test('Return data for created entry, params: <name> = "testclient"', async () => {
            const mockValues: string[] = [];
            Object.values(mockParam_entity).forEach((value) => {
                mockValues.push(value);
            })

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
            const mockErrorMsg = "DB ERROR ON INSERT QUERY, (Clients TEST Repository, create)";
            const mockResult = null;
            jest.spyOn(Utils, "logRepoError").mockReturnValue();
            const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

            await expect(() => clientsRepository.create(mockParam_entity))
                .rejects.toThrow(expectExceptionResult);
        })
    })
})

describe('Database tests table <clients>, priority: updateStatus', () => {

    let sql: string;
    let mockParam_name: string;
    let mockParam_dto: ClientsStatusUpdateDTO;
    beforeEach(() => {
        sql = `UPDATE`;
        mockParam_name = 'test_client';
        mockParam_dto = { status: ApiKeyStatus.DISABLED, last_modified: mockTimestamp };
    });

    describe('Testing valid fn calls', () => {

        test('Return data of changed entry by valid id', async () => {
            const mockParam_id = 'valid_clients_test_id';
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
            const mockParam_id = 'invalid_clients_test_id';
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
            const mockParam_id = 'error_clients_test_id';
            const mockErrorMsg = "DB ERROR ON UPDATE QUERY, (Clients TEST Repository, updateStatus)";
            const mockResult = null;
            jest.spyOn(Utils, "logRepoError").mockReturnValue();
            const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

            await expect(() => clientsRepository.updateStatus(mockParam_id, mockParam_dto))
                .rejects.toThrow(expectExceptionResult);
        })
    })
})

describe('Database tests table <clients>, priority: updateLastUse', () => {

    let sql: string;
    let mockParam_name: string;
    let mockParam_dto: ClientsLastUseUpdateDTO;
    beforeEach(() => {
        sql = `UPDATE`;
        mockParam_name = 'test_client';
        mockParam_dto = { last_use: mockTimestamp };
    });

    describe('Testing valid fn calls', () => {

        test('Return data of changed entry by valid id', async () => {
            const mockParam_id = 'valid_clients_test_id';
            const mockValues = [mockTimestamp, mockParam_id];

            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(mockTimestamp);

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

        test('Return null for non-existing entry by invalid id', async () => {
            const mockParam_id = 'invalid_clients_test_id';
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
            const mockParam_id = 'error_clients_test_id';
            const mockErrorMsg = "DB ERROR ON UPDATE QUERY, (Clients TEST Repository, updateLastUse)";
            const mockResult = null;
            jest.spyOn(Utils, "logRepoError").mockReturnValue();
            const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);

            await expect(() => clientsRepository.updateLastUse(mockParam_id, mockParam_dto))
                .rejects.toThrow(expectExceptionResult);
        })
    })
})
