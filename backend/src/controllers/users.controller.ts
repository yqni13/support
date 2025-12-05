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
            res.send(response);
        } catch(err: any) {
            next(err);
        }
    }

    async getUserByEmail(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const email = req.params.email;
            const response: UsersResponseDTO | null = await usersService.getUserByEmail(email);
            res.send(response);
        } catch(err: any) {
            next(err);
        }
    }

    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const response: UsersResponseDTO[] | null = await usersService.getAllUsers();
            res.send(response);
        } catch(err: any) {
            next(err);
        }
    }

    async postUsersSearch(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const dto: UsersFilterDTO = !req.body ? {} : req.body; // Null or undefined prohibited.
            const response: UsersResponseDTO[] | null = await usersService.searchUsersByFilter(dto);
            res.send(response);
        } catch(err: any) {
            next(err);
        }
    }

    async postUser(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const dto: UsersCreateDTO = req.body;
            const response: UsersResponseDTO = await usersService.createUser(dto);
            res.send(response);
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
            res.send(response);
        } catch(err: any) {
            next(err);
        }
    }
}

export default new UsersController();