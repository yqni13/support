import { UsersCreateUpdateDTO } from "../dtos/users.dto";
import { Users } from "../repositories/interfaces/users.entity.interface";
import * as Utils from "../utils/common.utils";

class UsersModel {
    mapObjToApi(data: Users): Users {
        return {
            ...data,
            last_modified: Utils.getTimestampUTC(new Date(data.last_modified)),
            created_on: Utils.getTimestampUTC(new Date(data.created_on))
        };
    }

    mapArrayToApi(users: Users[]): Users[] {
        Object.values(users).forEach((user) => {
            user.last_modified = Utils.getTimestampUTC(new Date(user.last_modified));
            user.created_on = Utils.getTimestampUTC(new Date(user.created_on));
        });
        return users;
    }

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