import { ClientsCreateResponseDTO, ClientsLastUseResponseDTO, ClientsStatusResponseDTO } from "../../../src/dtos/clients.dto";
import clientsModel from "../../../src/models/clients.model";
import { Clients } from "../../../src/repositories/interfaces/clients.entity.interface";
import * as Utils from "../../../src/utils/common.utils";
import { ApiKeyStatus } from "../../../src/utils/enums/api-key-status.enum";
import { secrets } from "../../../src/utils/secrets.utils";

const gmtData = Utils.getPropertiesFromTimezoneOffset(new Date());
const mockApiKeyObj = clientsModel.generateApiKeyObj();
let mockData: Clients = {
    client_id: 'valid_test_id',
    name: 'testclient',
    api_key_hash: mockApiKeyObj.keyHash,
    status: ApiKeyStatus.ACTIVE,
    last_use: "2025-01-01T13:00:01.000Z",
    last_modified: "2025-01-01T13:00:01.000Z",
    created_on: "2025-01-01T13:00:01.000Z"
};

describe('Model tests, class: <clients>, priority: mapObjToApi', () => {

    describe('Testing valid fn calls', () => {

        test('Map timestamps of clients object, entity: <Clients>', () => {
            const mockParam_data: Clients = structuredClone(mockData);

            const testFn = clientsModel.mapObjToApi(mockParam_data);
            const expectResult: Clients = {
                client_id: mockParam_data.client_id,
                name: mockParam_data.name,
                api_key_hash: mockParam_data.api_key_hash,
                status: mockParam_data.status,
                last_use: `2025-01-01T${13+(+gmtData.offset)}:00:01.000`,
                last_modified: `2025-01-01T${13+(+gmtData.offset)}:00:01.000`,
                created_on: `2025-01-01T${13+(+gmtData.offset)}:00:01.000`
            };

            expect(testFn).toEqual(expectResult);
        })
    })
})

describe('Model tests, class: <clients>, priority: mapToCreateResponseDTO', () => {

    describe('Testing valid fn calls', () => {

        test('Map timestamps of clients object, entity: <ClientsCreateResponseDTO>', () => {
            const mockParam_data: Clients = structuredClone(mockData);

            const testFn = clientsModel.mapToCreateResponseDTO(mockParam_data, mockApiKeyObj.keyRaw);
            const expectResult: ClientsCreateResponseDTO = {
                client_id: mockParam_data.client_id,
                name: mockParam_data.name,
                api_key: mockApiKeyObj.keyRaw,
                status: mockParam_data.status,
                last_use: `2025-01-01T${13+(+gmtData.offset)}:00:01.000`,
                last_modified: `2025-01-01T${13+(+gmtData.offset)}:00:01.000`,
                created_on: `2025-01-01T${13+(+gmtData.offset)}:00:01.000`
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
                last_use: `2025-01-01T${13+(+gmtData.offset)}:00:01.000`,
                last_modified: `2025-01-01T${13+(+gmtData.offset)}:00:01.000`,
                created_on: `2025-01-01T${13+(+gmtData.offset)}:00:01.000`
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
                last_use: `2025-01-01T${13+(+gmtData.offset)}:00:01.000`,
                last_modified: `2025-01-01T${13+(+gmtData.offset)}:00:01.000`,
                created_on: `2025-01-01T${13+(+gmtData.offset)}:00:01.000`
            };

            expect(testFn).toEqual(expectResult);
        })
    })
})

describe('Model tests, class: <clients>, priority: mapKeyToHash', () => {

    describe('Testing valid fn calls', () => {

        test('Map raw key to hash value, param: <key>', () => {
            const mockParam_key: string = secrets.TEST_APIKEY_RAW;

            const testFn = clientsModel.mapKeyToHash(mockParam_key);
            const expectResult: string = secrets.TEST_APIKEY_HASH;

            expect(testFn).toEqual(expectResult);
        })
    })
})