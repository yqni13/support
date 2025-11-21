import { UsersCreateUpdateDTO } from "../dtos/users.dto";
import { Users } from "../repositories/interfaces/users.entity.interface";
import * as Utils from "../utils/common.utils";

class UsersModel {
    generateUser(dto: UsersCreateUpdateDTO): Users {
        const id: string = Utils.generateUUID();
        const timestamp = Utils.getTimestampUTC();
        return {
            user_id: id,
            email: dto.email,
            status: dto.status,
            flag: !dto.flag ? null : dto.flag,
            last_modified: timestamp,
            created_on: timestamp
        };
    }
}

export default new UsersModel();