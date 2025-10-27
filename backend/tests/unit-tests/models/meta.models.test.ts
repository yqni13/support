import metaModel from "../../../src/models/meta.model";
import * as Utils from "../../../src/utils/common.utils";

const gmtData = Utils.getPropertiesFromTimezoneOffset(new Date());
const mockData = {
    id: 1,
    app: "support",
    author: "yqni13",
    build_on: "2025-01-01T13:00:01.000Z",
    environment: "development",
    app_version: "0.0.1",
    db_version: "0.0.2",
    docker_image: "no-image",
    docker_version: "0.0.3",
    jenkins_version: "0.0.4",
    last_modified: "2025-01-01T13:00:01.000Z",
    created_on: "2025-01-01T13:00:01.000Z"
};

describe('Model tests, class: <meta>, priority: mapToApi', () => {

    describe('Testing valid fn calls', () =>{

        test('Map timestamps of meta object', () => {
            const mockParam_meta = structuredClone(mockData);
            const testFn = metaModel.mapToApi(mockParam_meta);
            let expectResult = structuredClone(mockData);
            expectResult.build_on = `2025-01-01T${13+(+gmtData.offset)}:00:01.000`;
            expectResult.created_on = `2025-01-01T${13+(+gmtData.offset)}:00:01.000`;
            expectResult.last_modified = `2025-01-01T${13+(+gmtData.offset)}:00:01.000`;

            expect(testFn).toEqual(expectResult);
        })
    })
})