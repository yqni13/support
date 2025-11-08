import metaModel from "../../../src/models/meta.model";
import { Maintenance, Meta } from "../../../src/repositories/interfaces/meta.entity.interface";
import * as Utils from "../../../src/utils/common.utils";
import { MaintenanceMode } from "../../../src/utils/enums/maintenance-mode.enum";

const gmtData = Utils.getPropertiesFromTimezoneOffset(new Date());
const mockData: Meta = {
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
    maintenance_mode: MaintenanceMode.E000,
    last_modified: "2025-01-01T13:00:01.000Z",
    created_on: "2025-01-01T13:00:01.000Z"
};

describe('Model tests, class: <meta>, priority: mapObjToApi', () => {

    describe('Testing valid fn calls', () =>{

        test('Map timestamps of meta object, entity: <Meta>', () => {
            const mockParam_data: Meta = structuredClone(mockData);
            const testFn = metaModel.mapObjToApi(mockParam_data);
            let expectResult = structuredClone(mockData);
            expectResult.build_on = `2025-01-01T${13+(+gmtData.offset)}:00:01.000`;
            expectResult.created_on = `2025-01-01T${13+(+gmtData.offset)}:00:01.000`;
            expectResult.last_modified = `2025-01-01T${13+(+gmtData.offset)}:00:01.000`;

            expect(testFn).toEqual(expectResult);
        })

        test('Map timestamps of meta object, entity: <Maintenance>', () => {
            const mockParam_data: Maintenance = {
                id: 1,
                app: 'support',
                build_on: "2025-01-01T13:00:01.000Z",
                maintenance_mode: MaintenanceMode.E000,
                last_modified: "2025-01-01T13:00:01.000Z",
                created_on: "2025-01-01T13:00:01.000Z"
            }
            const testFn = metaModel.mapObjToApi(mockParam_data);
            const expectResult = structuredClone(mockParam_data);
            expectResult.build_on = `2025-01-01T${13+(+gmtData.offset)}:00:01.000`;
            expectResult.created_on = `2025-01-01T${13+(+gmtData.offset)}:00:01.000`;
            expectResult.last_modified = `2025-01-01T${13+(+gmtData.offset)}:00:01.000`;

            expect(testFn).toEqual(expectResult);
        })
    })
})

describe('Model tests, class: <meta>, priority: mapArrayToApi', () => {

    describe('Testing valid fn calls', () => {

        test('Map timestamps of meta array, entity: <Meta>', () => {
            const mockParam_meta: Meta[] = [structuredClone(mockData)];
            const testFn = metaModel.mapArrayToApi(mockParam_meta);
            let expectResult = [structuredClone(mockData)];
            expectResult[0].build_on = `2025-01-01T${13+(+gmtData.offset)}:00:01.000`;
            expectResult[0].created_on = `2025-01-01T${13+(+gmtData.offset)}:00:01.000`;
            expectResult[0].last_modified = `2025-01-01T${13+(+gmtData.offset)}:00:01.000`;

            expect(testFn).toEqual(expectResult);
        })
    })
})