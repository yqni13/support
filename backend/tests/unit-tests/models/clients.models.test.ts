import {
    ClientsCreateDTO,
    ClientsCreateResponseDTO,
    ClientsLastUseResponseDTO,
    ClientsStatusResponseDTO
} from "../../../src/dtos/clients.dto";
import * as Utils from "../../../src/utils/common.utils";
import clientsModel from "../../../src/models/clients.model";
import { Clients } from "../../../src/repositories/interfaces/clients.entity.interface";
import { ApiKeyStatus } from "../../../src/utils/enums/api-key-status.enum";

const mockVar_apiKey = clientsModel._generateApiKeyObj();
const mockTimestamp = '2025-01-01T14:00:02.000Z';
let mockData: Clients = {
    client_id: 'valid_test_id',
    name: 'testclient',
    api_key_hash: mockVar_apiKey.keyHash,
    status: ApiKeyStatus.ACTIVE,
    flag: null,
    last_use: mockTimestamp,
    last_modified: mockTimestamp,
    created_on: mockTimestamp
};

describe('Model tests, class: <clients>, priority: mapToCreateResponseDTO', () => {

    describe('Testing valid fn calls', () => {

        test('Map timestamps of clients object, entity: <ClientsCreateResponseDTO>', () => {
            const mockParam_data: Clients = structuredClone(mockData);

            const testFn = clientsModel.mapToCreateResponseDTO(mockParam_data, mockVar_apiKey.keyRaw);
            const expectResult: ClientsCreateResponseDTO = {
                client_id: mockParam_data.client_id,
                name: mockParam_data.name,
                api_key: mockVar_apiKey.keyRaw,
                status: mockParam_data.status,
                flag: null,
                last_use: mockTimestamp,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            };

            expect(testFn).toEqual(expectResult);
        })
    })
})

describe('Model tests, class: <clients>, priority: mapToStatusResponseDTO', () => {

    describe('Testing valid fn calls', () => {

        test('Map timestamps of clients object, entity: <ClientsStatusResponseDTO>', () => {
            const mockParam_data: Clients = structuredClone(mockData);

            const testFn = clientsModel.mapToStatusResponseDTO(mockParam_data);
            const expectResult: ClientsStatusResponseDTO = {
                client_id: mockParam_data.client_id,
                name: mockParam_data.name,
                status: mockParam_data.status,
                last_use: mockTimestamp,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            };

            expect(testFn).toEqual(expectResult);
        })
    })
})

describe('Model tests, class: <clients>, priority: mapToLastUseResponseDTO', () => {

    describe('Testing valid fn calls', () => {

        test('Map timestamps of clients object, entity: <ClientsLastUseResponseDTO>', () => {
            const mockParam_data: Clients = structuredClone(mockData);

            const testFn = clientsModel.mapToLastUseResponseDTO(mockParam_data);
            const expectResult: ClientsLastUseResponseDTO = {
                client_id: mockParam_data.client_id,
                name: mockParam_data.name,
                last_use: mockTimestamp,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            };

            expect(testFn).toEqual(expectResult);
        })
    })
})

describe('Model tests, class: <clients>, priority: generateClientsCreateObj', () => {

    describe('Testing valid fn calls', () => {

        test('Generate new clients object + raw key, entity: <Clients>', () => {
            const mockParam_dto: ClientsCreateDTO = {
                name: 'TESTCLIENT'
            };
            const mockParam_id = 'valid_users_test_id';
            const mockApiKeyObj = { keyRaw: 'test-key', keyHash: 'hashed-test-key' };
            const mockClient: Clients = {
                client_id: mockParam_id,
                name: mockParam_dto.name,
                api_key_hash: mockApiKeyObj.keyHash,
                status: ApiKeyStatus.ACTIVE,
                flag: null,
                last_use: mockTimestamp,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            };

            jest.spyOn(Utils, "generateUUID").mockReturnValue(mockParam_id);
            jest.spyOn(clientsModel, "_generateApiKeyObj").mockReturnValue(mockApiKeyObj);
            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(mockTimestamp);

            const testFn = clientsModel.generateClientsCreateObj(mockParam_dto);
            const expectResult = { client: mockClient, keyRaw: mockApiKeyObj.keyRaw };

            expect(testFn).toEqual(expectResult);
        })
    })
})