import {
    UsersUpdateDTO,
    UsersFilterDTO,
    UsersResponseDTO,
    UsersCreateDTO,
    UsersFlagUpdateDTO
} from "../dtos/users.dto";
import usersRepository from "../repositories/users.repository";
import * as CommonUtils from "../utils/common.utils";
import usersModel from "../models/users.model";
import { Users } from "../repositories/interfaces/users.entity.interface";

class UsersService {
    private timeMapTargets: string[];

    constructor() {
        this.timeMapTargets = ['last_modified', 'created_on'];
    }

    async getUserById(id: string): Promise<UsersResponseDTO | null> {
        const result = await usersRepository.findById(id);
        return !result ? null : CommonUtils.mapObjTimestamps<UsersResponseDTO>(result, this.timeMapTargets);
    }

    async getUserByEmail(email: string): Promise<UsersResponseDTO | null> {
        const result = await usersRepository.findByEmail(email);
        return !result ? null : CommonUtils.mapObjTimestamps<UsersResponseDTO>(result, this.timeMapTargets);
    }

    async getAllUsers(): Promise<UsersResponseDTO[] | null> {
        const result = await usersRepository.findAll();
        return !result ? null : CommonUtils.mapArrayTimestamps<UsersResponseDTO>(result, this.timeMapTargets);
    }

    async searchUsersByFilter(dto: UsersFilterDTO): Promise<UsersResponseDTO[] | null> {
        const result = await usersRepository.findByFilter(dto);
        return !result ? null : CommonUtils.mapArrayTimestamps<UsersResponseDTO>(result, this.timeMapTargets);
    }

    async createUser(dto: UsersCreateDTO): Promise<UsersResponseDTO> {
        const user: Users = usersModel.generateUser(dto);
        const result = await usersRepository.create(user);
        return CommonUtils.mapObjTimestamps<UsersResponseDTO>(result, this.timeMapTargets)
    }

    async updateUser(id: string, dto: UsersUpdateDTO): Promise<UsersResponseDTO | null> {
        dto.last_modified = CommonUtils.getTimestampUTC();
        const result = await usersRepository.update(id, dto);
        return !result ? null : CommonUtils.mapObjTimestamps<UsersResponseDTO>(result, this.timeMapTargets);
    }

    async updateUserFlag(id: string, dto: UsersFlagUpdateDTO): Promise<UsersResponseDTO | null> {
        dto.last_modified = CommonUtils.getTimestampUTC();
        const result = await usersRepository.updateFlag(id, dto);
        return !result ? null : CommonUtils.mapObjTimestamps<UsersResponseDTO>(result, this.timeMapTargets);
    }
}

export default new UsersService();