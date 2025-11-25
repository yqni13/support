import { Users } from "../../../src/repositories/interfaces/users.entity.interface";
import { UsersCreateDTO } from "../../../src/dtos/users.dto";
import usersModel from "../../../src/models/users.model";
import * as Utils from "../../../src/utils/common.utils";
import { UserStatus } from "../../../src/utils/enums/user-status.enum";

const mockTimestamp = '2025-01-03T14:00:03.000Z';

describe('Model tests, class: <users>, priority: generateUser', () => {

    describe('Testing valid fn calls', () => {

        test('Generate new user object, entity: <Users>', () => {
            const mockParam_id = 'valid_users_test_id';
            const mockParam_dto: UsersCreateDTO = {
                email: 'valid.user@test.com'
            };

            jest.spyOn(Utils, "generateUUID").mockReturnValue(mockParam_id);
            jest.spyOn(Utils, "getTimestampUTC").mockReturnValue(mockTimestamp);

            const testFn = usersModel.generateUser(mockParam_dto);
            const expectResult: Users = {
                user_id: mockParam_id,
                email: mockParam_dto.email,
                status: UserStatus.ACTIVE,
                flag: null,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            };

            expect(testFn).toEqual(expectResult);
        })
    })
})