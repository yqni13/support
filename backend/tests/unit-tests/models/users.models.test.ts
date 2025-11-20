import { Users } from "../../../src/repositories/interfaces/users.entity.interface";
import { UsersCreateUpdateDTO } from "../../../src/dtos/users.dto";
import usersModel from "../../../src/models/users.model";
import * as Utils from "../../../src/utils/common.utils";
import { UserStatus } from "../../../src/utils/enums/user-status.enum";

const mockTimestamp = '2025-01-03T14:00:03.000Z';
const mockData: Users = {
    user_id: 'valid_users_test_id',
    email: 'user@test.com',
    status: UserStatus.ACTIVE,
    flag: null,
    last_modified: mockTimestamp,
    created_on: mockTimestamp
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
                last_modified: mockTimestamp,
                created_on: mockTimestamp
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
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            }];

            expect(testFn).toEqual(expectResult);
        })
    })
})

describe('Model tests, class: <users>, priority: generateUser', () => {

    describe('Testing valid fn calls', () => {

        test('Generate new user object, entity: <Users>', () => {
            const testParam_id = 'valid_users_test_id';
            const mockParam_dto: UsersCreateUpdateDTO = {
                email: 'valid.user@test.com',
                status: UserStatus.ACTIVE,
                flag: null
            };

            jest.spyOn(Utils, "generateUUID").mockReturnValue(testParam_id);
            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(mockTimestamp);

            const testFn = usersModel.generateUser(mockParam_dto);
            const expectResult: Users = {
                user_id: testParam_id,
                email: mockParam_dto.email,
                status: mockParam_dto.status,
                flag: mockParam_dto.flag,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            };

            expect(testFn).toEqual(expectResult);
        })
    })
})