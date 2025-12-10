import { NextFunction, Request, Response } from "express";
import { UsersUpdateDTO, UsersFilterDTO, UsersResponseDTO, UsersCreateDTO } from "../dtos/users.dto";
import { checkValidation } from "../middleware/validation.middleware";
import usersService from "../services/users.service";

class UsersController {
    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const id = req.params.id;
            const response: UsersResponseDTO | null = await usersService.getUserById(id);
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }

    async getUserByEmail(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const email = req.params.email;
            const response: UsersResponseDTO | null = await usersService.getUserByEmail(email);
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }

    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const response: UsersResponseDTO[] | null = await usersService.getAllUsers();
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }

    async postUsersSearch(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            let response: UsersResponseDTO[] | null = null;
            if(!req.body) {
                response = await usersService.getAllUsers();
            } else {
                const dto: UsersFilterDTO = req.body;
                response = await usersService.searchUsersByFilter(dto);
            }
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }

    async postUser(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const dto: UsersCreateDTO = req.body;
            const response: UsersResponseDTO = await usersService.createUser(dto);
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }

    async patchUser(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const id: string = req.params.id;
            const dto: UsersUpdateDTO = req.body;
            const response: UsersResponseDTO | null = await usersService.updateUser(id, dto);
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }
}

export default new UsersController();