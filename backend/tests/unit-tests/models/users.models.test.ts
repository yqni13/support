import { Users, UsersId } from "../../../src/repositories/interfaces/users.entity.interface";
import { UsersCreateDTO } from "../../../src/dtos/users.dto";
import usersModel from "../../../src/models/users.model";
import * as CommonUtils from "../../../src/utils/common.utils";
import { default as mockId } from "../../mock-data/id.mock-data.json";
import { UserStatus } from "../../../src/utils/enums/user-status.enum";

const mockValidUserId = mockId.users.valid[0] as UsersId;
const mockTimestamp = '2025-01-03T14:00:03.000Z';

describe('Unit-tests (model), priority: entity Users', () => {

    describe('Priority: fn generateUser()', () => {

        describe('Testing valid fn calls', () => {

            test('Generate new user object, params: valid <id, dto>', () => {
                const mockParam_id = mockId.users.valid[0];
                const mockParam_dto: UsersCreateDTO = {
                    email: 'valid.user@test.com'
                };

                jest.spyOn(CommonUtils, "generateUUID").mockReturnValue(mockParam_id);
                jest.spyOn(CommonUtils, "getTimestampUTC").mockReturnValue(mockTimestamp);

                const testFn = usersModel.generateUser(mockParam_dto);
                const expectResult: Users = {
                    user_id: mockValidUserId,
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
})