import { Request, Response, NextFunction } from "express";
import { BlockedUsersException, InvalidUsersException } from "../utils/exceptions/auth.exception";
import { Users } from "../repositories/interfaces/users.entity.interface";
import usersService from "../services/users.service";
import { UsersCreateDTO } from "../dtos/users.dto";
import { UserStatus } from "../utils/enums/user-status.enum";
import { logError } from "../utils/common.utils";
import { Flag } from "../utils/enums/flag.enum";
import * as CommonValidators from "../validation/common.validation";

/**
 * @description Status validation of existing user or create new user by email address.
 */
export function authUser() {
    return async function(req: Request, res: Response, next: NextFunction) {
        try {
            const email = req.body.user_email;
            CommonValidators.validateEmail(email);
            let user: Users | null = await usersService.getUserByEmail(email);
            if(!user) {
                const dto: UsersCreateDTO = {
                    email: email
                }
                const newUser: Users = await usersService.createUser(dto);
                req.apiUsers = newUser;
                return next();
            }

            if(user.status === UserStatus.BLACKLISTED.trim()) {
                throw new BlockedUsersException();
            } else if(user.flag === Flag.ERROR.trim()) {
                throw new InvalidUsersException();
            }

            req.apiUsers = user;
            next();
        } catch(err: any) {
            err.status = !err.status ? 403 : err.status;
            logError(
                "AUTH MIDDLEWARE ERROR ON VERIFICATION",
                "SUPPORT_middleware_authUser",
                err
            );
            next(err);
        }
    }
}