import { Maintenance, Meta } from "../repositories/interfaces/meta.entity.interface";
import * as Utils from "../utils/common.utils";

class MetaModel {

    mapObjtoApi(data: Meta | Maintenance): Meta | Maintenance {
        return {
            ...data,
            build_on: Utils.getTimestampWithoutOffsetInfo(new Date(data.build_on)),
            created_on: Utils.getTimestampWithoutOffsetInfo(new Date(data.created_on)),
            last_modified: Utils.getTimestampWithoutOffsetInfo(new Date(data.last_modified))
        };
    }

    mapArrayToApi(meta: Meta[]): Meta[] {
        Object.values(meta).forEach((entry) => {
            entry.build_on = Utils.getTimestampWithoutOffsetInfo(new Date(entry.build_on));
            entry.created_on = Utils.getTimestampWithoutOffsetInfo(new Date(entry.created_on));
            entry.last_modified = Utils.getTimestampWithoutOffsetInfo(new Date(entry.last_modified));
        });
        return meta;
    }
}

export default new MetaModel();