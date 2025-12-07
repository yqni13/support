import { default as mockId } from "../../mock-data/id.mock-data.json";
import * as Utils from "../../../src/utils/common.utils";
import { authUser } from "../../../src/middleware/auth.user.middleware";
import { Users } from "../../../src/repositories/interfaces/users.entity.interface";
import { UserStatus } from "../../../src/utils/enums/user-status.enum";
import usersService from "../../../src/services/users.service";
import { UsersResponseDTO } from "../../../src/dtos/users.dto";
import { InvalidUsersException } from "../../../src/utils/exceptions/auth.exception";

describe('Middleware tests category <auth>, priority: authUser', () => {

    const mockTimestamp = '2025-01-01T14:00:00.000Z';
    const res: any = {};
    const next = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Testing valid fn calls', () => {

        test('Verfiy user, params: valid <user_email> for existing user', async () => {
            const mockUserEmail = 'valid_user@test.com';
            const mockUser: Users = {
                user_id: mockId.users.valid[0],
                email: mockUserEmail,
                status: UserStatus.ACTIVE,
                flag: null,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            };

            const req: any = { header: jest.fn(), body: { user_email: mockUserEmail }};

            jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(mockUser);

            // middleware == factory fn returning express fn => fn(req, res, next)
            const middleware = authUser();
            await middleware(req, res, next);

            expect(usersService.getUserByEmail).toHaveBeenCalledWith(mockUserEmail);
            expect(req.apiUsers).toEqual(mockUser);
            expect(next).toHaveBeenCalledWith();
        })

        test('Verfiy user, params: valid <user_email> for non-existing user', async () => {
            const mockUserEmail = 'non-existing-user@test.com';
            const mockUser: Users | null = null;
            const mockNewUser: UsersResponseDTO = {
                user_id: mockId.users.valid[0],
                email: mockUserEmail,
                status: UserStatus.ACTIVE,
                flag: null,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            }

            const req: any = { header: jest.fn(), body: { user_email: mockUserEmail }};

            jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(mockUser);
            jest.spyOn(usersService, 'createUser').mockResolvedValue(mockNewUser);

            const middleware = authUser();
            await middleware(req, res, next);

            expect(usersService.getUserByEmail).toHaveBeenCalledWith(mockUserEmail);
            expect(usersService.createUser).toHaveBeenCalledWith({email: mockUserEmail});
            expect(req.apiUsers).toEqual(mockNewUser);
            expect(next).toHaveBeenCalledWith();
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Verify user, error: InvalidUsersException', async () => {
            const mockUserEmail = 'valid-user@test.com';
            const mockUser: Users = {
                user_id: mockId.users.valid[0],
                email: mockUserEmail,
                status: UserStatus.BLACKLISTED,
                flag: null,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            };
            const req: any = { header: jest.fn(), body: { user_email: mockUserEmail }};

            jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(mockUser);
            jest.spyOn(Utils, 'logError').mockImplementation();

            const middleware = authUser();
            await middleware(req, res, next);

            expect(usersService.getUserByEmail).toHaveBeenCalledWith(mockUserEmail);
            const errArg = next.mock.calls[0][0];
            expect(errArg).toBeInstanceOf(InvalidUsersException);
            expect(errArg.status).toBe(401);
        })
    })
})