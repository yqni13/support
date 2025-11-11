import { Maintenance, Meta } from "../repositories/interfaces/meta.entity.interface";
import { getTimestampWithoutOffsetInfo as convert} from "../utils/common.utils";

class MetaModel {

    mapObjToApi(data: Meta | Maintenance): Meta | Maintenance {
        return {
            ...data,
            build_on: convert(new Date(data.build_on)),
            created_on: convert(new Date(data.created_on)),
            last_modified: convert(new Date(data.last_modified))
        };
    }

    mapArrayToApi(meta: Meta[]): Meta[] {
        Object.values(meta).forEach((entry) => {
            entry.build_on = convert(new Date(entry.build_on));
            entry.created_on = convert(new Date(entry.created_on));
            entry.last_modified = convert(new Date(entry.last_modified));
        });
        return meta;
    }
}

export default new MetaModel();