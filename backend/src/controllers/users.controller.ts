import { NextFunction, Request, Response } from "express";
import { UsersCreateUpdateDTO, UsersResponseDTO } from "../dtos/users.dto";
import { checkValidation } from "../middleware/validation.middleware";
import { IRepoError } from "../repositories/interfaces/error.repository.interface";
import usersService from "../services/users.service";

class UsersController {
    async getUser(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const id = req.params.id;
            const response: UsersResponseDTO | IRepoError | null = await usersService.findById(id);
            res.send(response);
        } catch(err: any) {
            next(err);
        }
    }

    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const response: UsersResponseDTO[] | IRepoError | null = await usersService.findAll();
            res.send(response);
        } catch(err: any) {
            next(err);
        }
    }

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const dto: UsersCreateUpdateDTO = req.body;
            const response: UsersResponseDTO | IRepoError | null = await usersService.create(dto);
            res.send(response);
        } catch(err: any) {
            next(err);
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidation(req);
            const id: string = req.params.id;
            const dto: UsersCreateUpdateDTO = req.body;
            const response: UsersResponseDTO | IRepoError | null = await usersService.update(id, dto);
            res.send(response);
        } catch(err: any) {
            next(err);
        }
    }
}

export default new UsersController();