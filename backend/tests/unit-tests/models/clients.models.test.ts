import {
    ClientsCreateDTO,
    ClientsCreateResponseDTO,
} from "../../../src/dtos/clients.dto";
import * as CommonUtils from "../../../src/utils/common.utils";
import { default as mockId } from "../../mock-data/id.mock-data.json";
import clientsModel from "../../../src/models/clients.model";
import { Clients, ClientsId } from "../../../src/repositories/interfaces/clients.entity.interface";
import { ApiKeyStatus } from "../../../src/utils/enums/api-key-status.enum";

const mockValidClientId = mockId.clients.valid[0] as ClientsId;
const mockVar_apiKey = clientsModel._generateApiKeyObj();
const mockTimestamp = '2025-01-01T14:00:02.000Z';
let mockData: Clients = {
    client_id: mockValidClientId,
    name: 'testclient',
    api_key_hash: mockVar_apiKey.keyHash,
    status: ApiKeyStatus.ACTIVE,
    flag: null,
    last_use: mockTimestamp,
    last_modified: mockTimestamp,
    created_on: mockTimestamp
};

describe('Unit-tests (model), priority: entity Clients', () => {

    describe('Priority: fn mapToCreateResponseDTO()', () => {

        describe('Testing valid fn calls', () => {

            test('Map timestamps of clients object, result: dto ClientsCreateResponseDTO', () => {
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

    describe('Priority: fn generateClientsCreateObj()', () => {

        describe('Testing valid fn calls', () => {

            test('Generate new object Clients + raw key', () => {
                const mockParam_id = mockValidClientId;
                const mockParam_dto: ClientsCreateDTO = {
                    name: 'TESTCLIENT'
                };
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

                jest.spyOn(CommonUtils, "generateUUID").mockReturnValue(mockParam_id);
                jest.spyOn(clientsModel, "_generateApiKeyObj").mockReturnValue(mockApiKeyObj);
                jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(mockTimestamp);

                const testFn = clientsModel.generateClientsCreateObj(mockParam_dto);
                const expectResult = { client: mockClient, keyRaw: mockApiKeyObj.keyRaw };

                expect(testFn).toEqual(expectResult);
            })
        })
    })
})

