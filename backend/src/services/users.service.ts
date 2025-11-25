import { UsersUpdateDTO, UsersFilterDTO, UsersResponseDTO, UsersCreateDTO } from "../dtos/users.dto";
import { IRepoError } from "../repositories/interfaces/error.repository.interface";
import usersRepository from "../repositories/users.repository";
import * as Utils from "../utils/common.utils";
import usersModel from "../models/users.model";
import { Users } from "../repositories/interfaces/users.entity.interface";

class UsersService {
    private timeMapTargets: string[];

    constructor() {
        this.timeMapTargets = ['last_modified', 'created_on'];
    }

    async getUserById(id: string): Promise<UsersResponseDTO | IRepoError | null> {
        let result = await usersRepository.findById(id);
        result = !result || Utils.isIRepoError(result)
            ? result
            : (Utils.mapObjTimestamps(result as UsersResponseDTO, this.timeMapTargets)) as UsersResponseDTO;
        return result;
    }

    async getUserByEmail(email: string): Promise<UsersResponseDTO | null> {
        let result = await usersRepository.findByEmail(email);
        result = !result ? null : Utils.mapObjTimestamps(result, this.timeMapTargets);
        return result;
    }

    async getAllUsers(): Promise<UsersResponseDTO[] | IRepoError | null> {
        let result = await usersRepository.findAll();
        result = Utils.isIRepoError(result)
            ? result
            : Utils.mapArrayTimestamps(result as UsersResponseDTO[], this.timeMapTargets);
        return result;
    }

    async searchUsersByFilter(dto: UsersFilterDTO): Promise<UsersResponseDTO[] | IRepoError | []> {
        let result = await usersRepository.findByFilter(dto);
        result = Utils.isIRepoError(result)
            ? result
            : Utils.mapArrayTimestamps(result as UsersResponseDTO[], this.timeMapTargets);
        return result;
    }

    async createUser(dto: UsersCreateDTO): Promise<UsersResponseDTO> {
        const user: Users = usersModel.generateUser(dto);
        const result = await usersRepository.create(user);
        return Utils.mapObjTimestamps(result, this.timeMapTargets)
    }

    async updateUser(id: string, dto: UsersUpdateDTO): Promise<UsersResponseDTO | IRepoError | null> {
        dto.last_modified = Utils.getTimestampUTC();
        let result = await usersRepository.update(id, dto);
        result = !result || Utils.isIRepoError(result)
            ? result
            : (Utils.mapObjTimestamps(result as UsersResponseDTO, this.timeMapTargets)) as UsersResponseDTO;
        return result;
    }
}

export default new UsersService();