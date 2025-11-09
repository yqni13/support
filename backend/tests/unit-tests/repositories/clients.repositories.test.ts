import { DBConnection } from "../../../src/configs/db";
import * as Utils from "../../../src/utils/common.utils";
import * as MockUtils from "../../common.test-utils";
import { Clients } from "../../../src/repositories/interfaces/clients.entity.interface";
import { ApiKeyStatus } from "../../../src/utils/enums/api-key-status.enum";
import clientsRepository from "../../../src/repositories/clients.repository";
import clientsModel from "../../../src/models/clients.model";
import { secrets } from "../../../src/utils/secrets.utils";
import { IRepoError } from "../../../src/repositories/interfaces/error.repository.interface";
import { ClientsStatusResponseDTO, ClientsLastUseResponseDTO } from "../../../src/dtos/clients.dto";

jest.mock("../../../src/configs/db", () => {
    return {
        DBConnection: {
            getInstance: jest.fn()
        }
    }
});

const gmtData = Utils.getPropertiesFromTimezoneOffset(new Date());
const mockVar_id = '9e024539-32e8-4317-8007-84a3956e6b57';
const mockVar_keyRaw = secrets.TEST_APIKEY_RAW;
const mockVar_keyHash = secrets.TEST_APIKEY_HASH;
const mockVar_timeStamp = `2025-10-02 21:34:00${gmtData.prefix}${gmtData.offset}`;
const mockData: Clients = {
    client_id: mockVar_id,
    name: 'testclient',
    api_key_hash: mockVar_keyHash,
    status: ApiKeyStatus.ACTIVE,
    last_use: mockVar_timeStamp,
    last_modified: mockVar_timeStamp,
    created_on: '2025-01-01T14:00:01.000',
};

describe('Database tests table <clients>, priority: findByKey', () => {

    describe('Testing valid fn calls', () => {

        let sql: string;
        beforeEach(() => {
            sql = `SELECT`;
        });

        test('Return data for existing entry, params: <apikey>', async () => {
            const mockParam_hash = structuredClone(mockVar_keyHash);
            const mockResult: Clients = structuredClone(mockData);
            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await clientsRepository.findByKey(mockParam_hash);

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
            const testFn = await clientsRepository.findByKey(mockParam_hash);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining([mockParam_hash])
            );
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Failing query to fall inside catch-block', async () => {
            const mockParam_hash = 'test_hash_value';
            const mockErrorMsg = "DB ERROR ON SELECT QUERY, (Clients TEST Repository, findByKey)";
            const mockResult = null;
            const _ = MockUtils.mapMockDbClient(mockResult, mockErrorMsg);
            const testFn = await clientsRepository.findByKey(mockParam_hash);

            expect(testFn).toEqual<IRepoError>({
                method: 'support_clients_findByKey',
                error: expect.any(Error)
            });
            expect((testFn as IRepoError).error.message).toBe(mockErrorMsg);
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
            const mockParam_name = 'test_client';
            const timeStamp = Utils.getTimestampWithOffsetInfo(new Date('2025-01-01T14:00:01.000'));
            const mockResult: ClientsStatusResponseDTO = {
                client_id: 'test_id',
                name: mockParam_name,
                status: ApiKeyStatus.ACTIVE,
                last_use: timeStamp,
                last_modified: timeStamp,
                created_on: timeStamp
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

        test('Return null for non-existing entry, params: <name>', async () => {
            const mockParam_name = 'test_client';
            const mockResult = null;
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

        test('Failing query to fall inside catch-block', async () => {
            const mockParam_name = 'non_existing_test_client_name';
            const mockErrorMsg = "DB ERROR ON SELECT QUERY, (Meta TEST Repository, findStatusByName)";
            const mockResult = null;
            const _ = MockUtils.mapMockDbClient(mockResult, mockErrorMsg);
            const testFn = await clientsRepository.findStatusByName(mockParam_name);

            expect(testFn).toEqual<IRepoError>({
                method: 'support_clients_findStatusByName',
                error: expect.any(Error)
            });
            expect((testFn as IRepoError).error.message).toBe(mockErrorMsg);
        })
    })
})

describe('Database tests table <clients>, priority: create', () => {

    describe('Testing valid fn calls', () => {

        let sql: string;
        beforeEach(() => {
            sql = `INSERT`;
        });

        test('Return data for created entry, params: <name> = "testclient"', async () => {
            const mockVar_apiKey = clientsModel.generateApiKeyObj();
            const mockParam_id = mockVar_id;
            const mockParam_name = 'testclient';
            const mockParam_hash = mockVar_apiKey.keyHash;
            const mockValues = [mockParam_id, mockParam_name, mockVar_apiKey.keyHash, ApiKeyStatus.ACTIVE, mockVar_timeStamp, mockVar_timeStamp, mockVar_timeStamp];

            const mockResult: Clients = {
                client_id: mockParam_id,
                name: mockParam_name,
                api_key_hash: mockVar_apiKey.keyHash,
                status: ApiKeyStatus.ACTIVE,
                last_use: mockVar_timeStamp,
                last_modified: mockVar_timeStamp,
                created_on: '2025-01-01T14:00:01.000'
            };

            jest.spyOn(Utils, "getTimestampWithOffsetInfo").mockReturnValue(mockVar_timeStamp);

            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await clientsRepository.create(
                mockParam_id, mockParam_name, mockParam_hash
            );

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining(mockValues)
            );
        })

        test('Return null for non-existing entry by non-unique name', async () => {
            const mockVar_apiKey = clientsModel.generateApiKeyObj();
            const mockParam_id = Utils.generateUUID();
            const mockParam_name = 'TESTCLIENT';
            const mockValues = [mockParam_id, mockParam_name, mockVar_apiKey.keyHash, ApiKeyStatus.ACTIVE, mockVar_timeStamp, mockVar_timeStamp, mockVar_timeStamp];

            const mockResult = null;

            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await clientsRepository.create(
                mockParam_id, mockParam_name, mockVar_apiKey.keyHash
            );

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining(mockValues)
            );
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Failing query to fall inside catch-block', async () => {
            const mockParam_id = 'test_id';
            const mockParam_name = 'test_client';
            const mockParam_hash = 'test_hash_value';
            const mockErrorMsg = "DB ERROR ON SELECT QUERY, (Clients TEST Repository, create)";
            const mockResult = null;
            const _ = MockUtils.mapMockDbClient(mockResult, mockErrorMsg);
            const testFn = await clientsRepository.create(
                mockParam_id, mockParam_name, mockParam_hash
            );

            expect(testFn).toEqual<IRepoError>({
                method: 'support_clients_create',
                error: expect.any(Error)
            });
            expect((testFn as IRepoError).error.message).toBe(mockErrorMsg);
        })
    })
})

describe('Database tests table <clients>, priority: updateStatus', () => {
    
    describe('Testing valid fn calls', () => {

        let sql: string;
        let mockParam_name: string;
        beforeEach(() => {
            sql = `UPDATE`;
            mockParam_name = 'test_client';
        });

        test('Return data of changed entry by valid id', async () => {
            const mockParam_id = 'valid_test_id';
            const mockParam_data = { status: ApiKeyStatus.DISABLED };
            const mockValues = [mockParam_data.status, mockVar_timeStamp, mockParam_id];

            jest.spyOn(Utils, "getTimestampWithOffsetInfo").mockReturnValue(mockVar_timeStamp);

            const mockResult: ClientsStatusResponseDTO = {
                client_id: mockParam_id,
                name: mockParam_name,
                status: mockParam_data.status,
                last_use: '2025-10-01T14:00:01.000',
                last_modified: mockVar_timeStamp,
                created_on: '2025-10-01T14:00:01.000'
            };
            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await clientsRepository.updateStatus(mockParam_id, mockParam_data);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining(mockValues)
            );
        })

        test('Return null for non-existing entry by invalid id', async () => {
            const mockParam_id = 'invalid_test_id';
            const mockParam_data = { status: ApiKeyStatus.DISABLED };
            const mockValues = [mockParam_id, mockParam_data.status, mockVar_timeStamp];

            const mockResult = null;
            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await clientsRepository.updateStatus(mockParam_id, mockParam_data);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining(mockValues)
            );
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Failing query to fall inside catch-block', async () => {
            const mockParam_id = 'valid_test_id';
            const mockParam_data = { status: ApiKeyStatus.DISABLED };
            const mockErrorMsg = "DB ERROR ON UPDATE QUERY, (Clients TEST Repository, updateStatus)";
            const mockResult = null;
            const _ = MockUtils.mapMockDbClient(mockResult, mockErrorMsg);
            const testFn = await clientsRepository.updateStatus(mockParam_id, mockParam_data);

            expect(testFn).toEqual<IRepoError>({
                method: 'support_clients_updateStatus',
                error: expect.any(Error)
            });
            expect((testFn as IRepoError).error.message).toBe(mockErrorMsg);
        })
    })
})

describe('Database tests table <clients>, priority: updateLastUse', () => {
    
    describe('Testing valid fn calls', () => {

        let sql: string;
        let mockParam_name: string;
        beforeEach(() => {
            sql = `UPDATE`;
            mockParam_name = 'test_client';
        });

        test('Return data of changed entry by valid id', async () => {
            const mockParam_id = 'valid_test_id';
            const mockValues = [mockVar_timeStamp, mockParam_id];

            jest.spyOn(Utils, "getTimestampWithOffsetInfo").mockReturnValue(mockVar_timeStamp);

            const mockResult: ClientsLastUseResponseDTO = {
                client_id: mockParam_id,
                name: mockParam_name,
                last_use: mockVar_timeStamp,
                last_modified: '2025-10-01T14:00:01.000',
                created_on: '2025-10-01T14:00:01.000'
            };
            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await clientsRepository.updateLastUse(mockParam_id);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining(mockValues)
            );
        })

        test('Return null for non-existing entry by invalid id', async () => {
            const mockParam_id = 'invalid_test_id';
            const mockValues = [mockVar_timeStamp, mockParam_id];

            const mockResult = null;
            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await clientsRepository.updateLastUse(mockParam_id);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining(mockValues)
            );
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Failing query to fall inside catch-block', async () => {
            const mockParam_id = 'valid_test_id';
            const mockErrorMsg = "DB ERROR ON UPDATE QUERY, (Clients TEST Repository, updateLastUse)";
            const mockResult = null;
            const _ = MockUtils.mapMockDbClient(mockResult, mockErrorMsg);
            const testFn = await clientsRepository.updateLastUse(mockParam_id);

            expect(testFn).toEqual<IRepoError>({
                method: 'support_clients_updateLastUse',
                error: expect.any(Error)
            });
            expect((testFn as IRepoError).error.message).toBe(mockErrorMsg);
        })
    })
})
