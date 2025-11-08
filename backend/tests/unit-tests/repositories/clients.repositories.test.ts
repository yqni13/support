import { DBConnection } from "../../../src/configs/db";
import * as Utils from "../../../src/utils/common.utils";
import * as MockUtils from "../../common.test-utils";
import { Clients } from "../../../src/repositories/interfaces/clients.entity.interface";
import { ApiKeyStatus } from "../../../src/utils/enums/api-key-status.enum";
import clientsRepository from "../../../src/repositories/clients.repository";
import clientsModel from "../../../src/models/clients.model";
import { secrets } from "../../../src/utils/secrets.utils";

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
    })
})

describe('Database tests table <clients>, priority: findByKey', () => {

    describe('Testing valid fn calls', () => {

        let sql: string;
        beforeEach(() => {
            sql = `SELECT`;
        })

        test('Return data for existing entry, params: <apikey>', async () => {
            const mockParam_apikey = structuredClone(mockVar_keyRaw);
            const mockResult: Clients = structuredClone(mockData);
            const mockClient = MockUtils.mapMockDbClient(mockResult);
            const testFn = await clientsRepository.findByKey(mockParam_apikey);

            expect(testFn).toEqual(mockResult);
            expect(DBConnection.getInstance).toHaveBeenCalled();
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining(sql),
                expect.arrayContaining([mockParam_apikey])
            );
        })
    })
})

// describe('Database tests table <clients>, priority: getStatusByName', () => {
    
//     describe('Testing valid fn calls', () => {

//         test('', () => {})
//     })
// })

// describe('Database tests table <clients>, priority: setStatus', () => {
    
//     describe('Testing valid fn calls', () => {

//         test('', () => {})
//     })
// })

// describe('Database tests table <clients>, priority: setLastUse', () => {
    
//     describe('Testing valid fn calls', () => {

//         test('', () => {})
//     })
// })
