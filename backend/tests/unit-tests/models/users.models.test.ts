import { Users } from "../../../src/repositories/interfaces/users.entity.interface";
import { UsersCreateUpdateDTO } from "../../../src/dtos/users.dto";
import usersModel from "../../../src/models/users.model";
import * as Utils from "../../../src/utils/common.utils";
import { UserStatus } from "../../../src/utils/enums/user-status.enum";

let mockData: Users = {
    user_id: 'valid_users_test_id',
    email: 'user@test.com',
    status: UserStatus.ACTIVE,
    flag: null,
    last_modified: '2025-01-03T14:00:03.000Z',
    created_on: '2025-01-03T14:00:03.000Z'
}

describe('Model tests, class: <users>, priority: mapObjToApi', () => {

    describe('Testing valid fn calls', () => {

        test('Map timestamps of users object, entity: <Users>', () => {
            const mockParam_data: Users = structuredClone(mockData);
            const testFn = usersModel.mapObjToApi(mockParam_data);
            const expectResult: Users = {
                user_id: mockParam_data.user_id,
                email: mockParam_data.email,
                status: mockParam_data.status,
                flag: mockParam_data.flag,
                last_modified: '2025-01-03T14:00:03.000Z',
                created_on: '2025-01-03T14:00:03.000Z'
            };

            expect(testFn).toEqual(expectResult);
        })
    })
})

describe('Model tests, class: <users>, priority: mapArrayToApi', () => {

    describe('Testing valid fn calls', () => {

        test('Map timestamps of users array, entity: <Users>', () => {
            const mockParam_data: Users[] = [structuredClone(mockData)];
            const testFn = usersModel.mapArrayToApi(mockParam_data);
            const expectResult: Users[] = [{
                user_id: mockParam_data[0].user_id,
                email: mockParam_data[0].email,
                status: mockParam_data[0].status,
                flag: mockParam_data[0].flag,
                last_modified: '2025-01-03T14:00:03.000Z',
                created_on: '2025-01-03T14:00:03.000Z'
            }];

            expect(testFn).toEqual(expectResult);
        })
    })
})

describe('Model tests, class: <users>, priority: generateUser', () => {

    describe('Testing valid fn calls', () => {

        test('Generate new user object, entity: <Users>', () => {
            const mockParam_dto: UsersCreateUpdateDTO = {
                email: 'valid.user@test.com',
                status: UserStatus.ACTIVE,
                flag: null
            };
            const testParam_id = 'valid_users_test_id';
            const testParam_timestamp = '2025-11-17T18:48:00.000Z';

            jest.spyOn(Utils, "generateUUID").mockReturnValue(testParam_id);
            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(testParam_timestamp);

            const testFn = usersModel.generateUser(mockParam_dto);
            const expectResult: Users = {
                user_id: testParam_id,
                email: mockParam_dto.email,
                status: mockParam_dto.status,
                flag: mockParam_dto.flag,
                last_modified: testParam_timestamp,
                created_on: testParam_timestamp
            };

            expect(testFn).toEqual(expectResult);
        })
    })
})