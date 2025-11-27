import { UsersCreateDTO } from "../dtos/users.dto";
import { Users } from "../repositories/interfaces/users.entity.interface";
import * as Utils from "../utils/common.utils";
import { UserStatus } from "../utils/enums/user-status.enum";

class UsersModel {
    generateUser(dto: UsersCreateDTO): Users {
        const timestamp = Utils.getTimestampUTC();
        return {
            user_id: Utils.generateUUID(),
            email: dto.email,
            status: UserStatus.ACTIVE,
            flag: null,
            last_modified: timestamp,
            created_on: timestamp
        };
    }
}

export default new UsersModel();