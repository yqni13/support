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

const mockVar_id = '9e024539-32e8-4317-8007-84a3956e6b57';
const mockVar_keyHash = secrets.TEST_APIKEY_HASH;
const mockVar_timeStamp = `2025-10-02T21:34:00.000Z`;
const mockData: Clients = {
    client_id: mockVar_id,
    name: 'testclient',
    api_key_hash: mockVar_keyHash,
    status: ApiKeyStatus.ACTIVE,
    last_use: mockVar_timeStamp,
    last_modified: mockVar_timeStamp,
    created_on: '2025-01-01T14:00:01.000Z',
};

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

        test('Return IRepoError by catch-block', async () => {
            const mockParam_hash = 'test_hash_value';
            const mockErrorMsg = "DB ERROR ON SELECT QUERY, (Clients TEST Repository, findByActiveKey)";
            const mockResult = null;
            jest.spyOn(Utils, "logRepoError").mockReturnValue();
            const _ = MockUtils.mapMockDbClient(mockResult, mockErrorMsg);
            const testFn = await clientsRepository.findByActiveKey(mockParam_hash);

            expect(testFn).toEqual<IRepoError>({
                method: 'support_clients_findByActiveKey',
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
            const timeStamp = '2025-01-01T14:00:02.000Z';
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

        test('Return IRepoError by catch-block', async () => {
            const mockParam_name = 'non_existing_test_client_name';
            const mockErrorMsg = "DB ERROR ON SELECT QUERY, (Meta TEST Repository, findStatusByName)";
            const mockResult = null;
            jest.spyOn(Utils, "logRepoError").mockReturnValue();
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
            const mockParam_entity: Clients = {
                client_id: mockVar_id,
                name: 'TESTCLIENT',
                api_key_hash: mockVar_apiKey.keyHash,
                status: ApiKeyStatus.ACTIVE,
                last_use: mockVar_timeStamp,
                last_modified: mockVar_timeStamp,
                created_on: '2025-01-01T14:00:02.000Z'
            }
            const mockValues = [
                mockParam_entity.client_id,
                mockParam_entity.name,
                mockParam_entity.api_key_hash,
                mockParam_entity.status,
                mockParam_entity.last_use,
                mockParam_entity.last_modified,
                mockParam_entity.created_on
            ];

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

        test('Return IRepoError by catch-block', async () => {
            const mockParam_hash = 'test_hash_value';
            const mockParam_entity: Clients = {
                client_id: mockVar_id,
                name: 'TESTCLIENT',
                api_key_hash: mockParam_hash,
                status: ApiKeyStatus.ACTIVE,
                last_use: mockVar_timeStamp,
                last_modified: mockVar_timeStamp,
                created_on: '2025-01-01T14:00:01.000Z'
            }
            const mockErrorMsg = "DB ERROR ON SELECT QUERY, (Clients TEST Repository, create)";
            const mockResult = null;
            jest.spyOn(Utils, "logRepoError").mockReturnValue();
            const _ = MockUtils.mapMockDbClient(mockResult, mockErrorMsg);
            const testFn = await clientsRepository.create(mockParam_entity);

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
            const mockParam_dto = { status: ApiKeyStatus.DISABLED, last_modified: mockVar_timeStamp };
            const mockValues = [mockParam_dto.status, mockVar_timeStamp, mockParam_id];

            const mockResult: ClientsStatusResponseDTO = {
                client_id: mockParam_id,
                name: mockParam_name,
                status: mockParam_dto.status,
                last_use: '2025-10-01T14:00:02.000Z',
                last_modified: mockVar_timeStamp,
                created_on: '2025-10-01T14:00:02.000Z'
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
            const mockParam_id = 'invalid_test_id';
            const mockParam_dto = { status: ApiKeyStatus.DISABLED, last_modified: mockVar_timeStamp };
            const mockValues = [mockParam_id, mockParam_dto.status, mockVar_timeStamp];

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

        test('Return IRepoError by catch-block', async () => {
            const mockParam_id = 'valid_test_id';
            const mockParam_dto = { status: ApiKeyStatus.DISABLED, last_modified: mockVar_timeStamp };
            const mockErrorMsg = "DB ERROR ON UPDATE QUERY, (Clients TEST Repository, updateStatus)";
            const mockResult = null;
            jest.spyOn(Utils, "logRepoError").mockReturnValue();
            const _ = MockUtils.mapMockDbClient(mockResult, mockErrorMsg);
            const testFn = await clientsRepository.updateStatus(mockParam_id, mockParam_dto);

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
            const mockParam_dto = { last_use: mockVar_timeStamp };
            const mockValues = [mockVar_timeStamp, mockParam_id];

            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(mockVar_timeStamp);

            const mockResult: ClientsLastUseResponseDTO = {
                client_id: mockParam_id,
                name: mockParam_name,
                last_use: mockVar_timeStamp,
                last_modified: '2025-10-01T14:00:02.000Z',
                created_on: '2025-10-01T14:00:02.000Z'
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
            const mockParam_id = 'invalid_test_id';
            const mockParam_dto = { last_use: mockVar_timeStamp };
            const mockValues = [mockVar_timeStamp, mockParam_id];

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

        test('Return IRepoError by catch-block', async () => {
            const mockParam_id = 'valid_test_id';
            const mockParam_dto = { last_use: mockVar_timeStamp };
            const mockErrorMsg = "DB ERROR ON UPDATE QUERY, (Clients TEST Repository, updateLastUse)";
            const mockResult = null;
            jest.spyOn(Utils, "logRepoError").mockReturnValue();
            const _ = MockUtils.mapMockDbClient(mockResult, mockErrorMsg);
            const testFn = await clientsRepository.updateLastUse(mockParam_id, mockParam_dto);

            expect(testFn).toEqual<IRepoError>({
                method: 'support_clients_updateLastUse',
                error: expect.any(Error)
            });
            expect((testFn as IRepoError).error.message).toBe(mockErrorMsg);
        })
    })
})
