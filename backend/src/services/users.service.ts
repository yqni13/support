import { UsersUpdateDTO, UsersFilterDTO, UsersResponseDTO, UsersCreateDTO } from "../dtos/users.dto";
import usersRepository from "../repositories/users.repository";
import * as Utils from "../utils/common.utils";
import usersModel from "../models/users.model";
import { Users } from "../repositories/interfaces/users.entity.interface";

class UsersService {
    private timeMapTargets: string[];

    constructor() {
        this.timeMapTargets = ['last_modified', 'created_on'];
    }

    async getUserById(id: string): Promise<UsersResponseDTO | null> {
        let result = await usersRepository.findById(id);
        return !result ? null : Utils.mapObjTimestamps<UsersResponseDTO>(result, this.timeMapTargets);
    }

    async getUserByEmail(email: string): Promise<UsersResponseDTO | null> {
        let result = await usersRepository.findByEmail(email);
        return !result ? null : Utils.mapObjTimestamps<UsersResponseDTO>(result, this.timeMapTargets);
    }

    async getAllUsers(): Promise<UsersResponseDTO[] | null> {
        let result = await usersRepository.findAll();
        return !result ? null : Utils.mapArrayTimestamps<UsersResponseDTO>(result, this.timeMapTargets);
    }

    async searchUsersByFilter(dto: UsersFilterDTO): Promise<UsersResponseDTO[] | null> {
        let result: UsersResponseDTO[] | null = null;
        if(Utils.isEmptyObj(result)) {
            result = await usersRepository.findAll();
        } else {
            result = await usersRepository.findByFilter(dto);
        }
        return !result ? null : Utils.mapArrayTimestamps<UsersResponseDTO>(result, this.timeMapTargets);
    }

    async createUser(dto: UsersCreateDTO): Promise<UsersResponseDTO> {
        const user: Users = usersModel.generateUser(dto);
        const result = await usersRepository.create(user);
        return Utils.mapObjTimestamps<UsersResponseDTO>(result, this.timeMapTargets)
    }

    async updateUser(id: string, dto: UsersUpdateDTO): Promise<UsersResponseDTO | null> {
        dto.last_modified = Utils.getTimestampUTC();
        let result = await usersRepository.update(id, dto);
        return !result ? null : Utils.mapObjTimestamps<UsersResponseDTO>(result, this.timeMapTargets);
    }
}

export default new UsersService();