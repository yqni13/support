import { ClientsCreateResponseDTO } from "../../../src/dtos/clients.dto";
import clientsModel from "../../../src/models/clients.model";
import { Clients } from "../../../src/repositories/interfaces/clients.entity.interface";
import * as Utils from "../../../src/utils/common.utils";
import { ApiKeyStatus } from "../../../src/utils/enums/api-key-status.enum";
import { validateApiKey } from "../../../src/utils/customValidator.utils";

const gmtData = Utils.getPropertiesFromTimezoneOffset(new Date());

describe('Model tests, class: <clients>, priority: mapToResponseDTO', () => {

    describe('Testing valid fn calls', () => {

        test('Map timestamps of clients object, entity: <Clients>', () => {
            const mockParam_id = Utils.generateUUID();
            const mockParam_apiKey = clientsModel.generateApiKeyObj();
            const mockParam_data: Clients = {
                client_id: mockParam_id,
                name: 'testclient',
                api_key_hash: mockParam_apiKey.keyHash,
                status: ApiKeyStatus.ACTIVE,
                last_use: "2025-01-01T13:00:01.000Z",
                last_modified: "2025-01-01T13:00:01.000Z",
                created_on: "2025-01-01T13:00:01.000Z"
            };

            const testFn = clientsModel.mapToResponseDTO(mockParam_data, mockParam_apiKey.keyRaw);
            const expectResult: ClientsCreateResponseDTO = {
                client_id: mockParam_id,
                name: 'testclient',
                api_key: mockParam_apiKey.keyRaw,
                status: ApiKeyStatus.ACTIVE,
                last_use: `2025-01-01T${13+(+gmtData.offset)}:00:01.000`,
                last_modified: `2025-01-01T${13+(+gmtData.offset)}:00:01.000`,
                created_on: `2025-01-01T${13+(+gmtData.offset)}:00:01.000`
            }

            expect(testFn).toEqual(expectResult);
        })
    })
})