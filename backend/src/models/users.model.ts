import { UsersCreateDTO } from "../dtos/users.dto";
import { Users, UsersId } from "../repositories/interfaces/users.entity.interface";
import * as CommonUtils from "../utils/common.utils";
import { UserStatus } from "../utils/enums/user-status.enum";

class UsersModel {
    generateUser(dto: UsersCreateDTO): Users {
        const timestamp = CommonUtils.getTimestampUTC();
        return {
            user_id: CommonUtils.generateUUID() as UsersId,
            email: dto.email,
            status: UserStatus.ACTIVE,
            flag: null,
            last_modified: timestamp,
            created_on: timestamp
        };
    }
}

export default new UsersModel();