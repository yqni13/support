import { Request, Response, NextFunction } from "express";
import { InvalidUsersException, MissingEmailException } from "../utils/exceptions/auth.exception";
import { validateEmail } from "../utils/customValidator.utils";
import { Users } from "../repositories/interfaces/users.entity.interface";
import usersService from "../services/users.service";
import { UsersCreateUpdateDTO } from "../dtos/users.dto";
import { UserStatus } from "../utils/enums/user-status.enum";
import { secrets } from "../utils/secrets.utils";
import { EnvMode } from "../utils/enums/env-mode.enum";

/**
 * @description Status validation of existing user or create new user by email address.
 */
export function authUser() {
    return async function(req: Request, res: Response, next: NextFunction) {
        try {
            const email = req.body.user_email;
            if(!email) {
                throw new MissingEmailException();
            }

            validateEmail(email);
            let user: Users | null = await usersService.findByEmail(email);
            if(!user) {
                const dto: UsersCreateUpdateDTO = {
                    email: email,
                    status: UserStatus.ACTIVE,
                    flag: null
                }
                const newUser: Users = await usersService.create(dto);
                req.apiUsers = newUser;
                return next();
            }

            if(user.status === UserStatus.BLACKLISTED.trim()) {
                throw new InvalidUsersException();
            }

            req.apiUsers = user;
            next();
        } catch(err: any) {
            // TODO(yqni13): logging
            if(secrets.ENV_MODE.trim() === EnvMode.DEV || secrets.ENV_MODE.trim() === EnvMode.TEST) {
                console.log('AUTH ERROR ON VERIFICATION (Auth-User Middleware): ', err.message);
            }
            err.status = 403;
            next(err);
        }
    }
}