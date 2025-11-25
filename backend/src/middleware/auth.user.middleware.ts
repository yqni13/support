import { Request, Response, NextFunction } from "express";
import { InvalidUsersException } from "../utils/exceptions/auth.exception";
import { validateEmail } from "../utils/customValidator.utils";
import { Users } from "../repositories/interfaces/users.entity.interface";
import usersService from "../services/users.service";
import { UsersCreateDTO } from "../dtos/users.dto";
import { UserStatus } from "../utils/enums/user-status.enum";
import { secrets } from "../utils/secrets.utils";
import { EnvMode } from "../utils/enums/env-mode.enum";
import { CommonExceptionMessage } from "../utils/enums/common-exception-messages.enum";
import { InvalidPropertiesException } from "../utils/exceptions/validation.exception";

/**
 * @description Status validation of existing user or create new user by email address.
 */
export function authUser() {
    return async function(req: Request, res: Response, next: NextFunction) {
        try {
            const email = req.body.user_email ?? undefined;
            if(!email) {
                throw new InvalidPropertiesException('Missing or invalid properties', { 
                    data: [{
                        type: 'field',
                        value: '',
                        msg: CommonExceptionMessage.REQUIRED,
                        path: 'user_email',
                        location: 'body'
                    }]
                });
            }

            validateEmail(email);
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