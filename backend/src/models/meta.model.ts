import { Meta } from "../repositories/interfaces/meta.entity.interface";
import * as Utils from "../utils/common.utils";

class MetaModel {

    mapToApi(meta: Meta): Meta {
        return {
            ...meta,
            build_on: Utils.getTimestampWithoutOffsetInfo(new Date(meta.build_on)),
            created_on: Utils.getTimestampWithoutOffsetInfo(new Date(meta.created_on)),
            last_modified: Utils.getTimestampWithoutOffsetInfo(new Date(meta.last_modified))
        };
    }
}

export default new MetaModel();