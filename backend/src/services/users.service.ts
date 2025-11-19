import { UsersCreateUpdateDTO, UsersFilterDTO, UsersResponseDTO } from "../dtos/users.dto";
import { IRepoError } from "../repositories/interfaces/error.repository.interface";
import usersRepository from "../repositories/users.repository";
import * as Utils from "../utils/common.utils";
import usersModel from "../models/users.model";
import { Users } from "../repositories/interfaces/users.entity.interface";

class UsersService {
    async findById(id: string): Promise<UsersResponseDTO | IRepoError | null> {
        let result = await usersRepository.findById(id);
        result = !result || Utils.isIRepoError(result)
            ? result
            : (usersModel.mapObjToApi(result as UsersResponseDTO)) as UsersResponseDTO;
        return result;
    }

    async findAll(): Promise<UsersResponseDTO[] | IRepoError | null> {
        let result = await usersRepository.findAll();
        result = Utils.isIRepoError(result)
            ? result
            : usersModel.mapArrayToApi(result as UsersResponseDTO[]);
        return result;
    }

    async findByFilter(dto: UsersFilterDTO): Promise<UsersResponseDTO[] | IRepoError | null> {
        let result = await usersRepository.findByFilter(dto);
        result = Utils.isIRepoError(result)
            ? result
            : usersModel.mapArrayToApi(result as UsersResponseDTO[]);
        return result;
    }

    async create(dto: UsersCreateUpdateDTO): Promise<UsersResponseDTO | IRepoError> {
        const user: Users = usersModel.generateUser(dto);
        let result = await usersRepository.create(user);
        result = !result || Utils.isIRepoError(result)
            ? result
            : (usersModel.mapObjToApi(result as UsersResponseDTO)) as UsersResponseDTO;
        return result;
    }

    async update(id: string, dto: UsersCreateUpdateDTO): Promise<UsersResponseDTO | IRepoError | null> {
        dto.last_modified = Utils.getCustomUTCString(new Date());
        let result = await usersRepository.update(id, dto);
        result = !result || Utils.isIRepoError(result)
            ? result
            : (usersModel.mapObjToApi(result as UsersResponseDTO)) as UsersResponseDTO;
        return result;
    }
}

export default new UsersService();