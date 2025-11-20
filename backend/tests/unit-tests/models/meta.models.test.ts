import metaModel from "../../../src/models/meta.model";
import { Maintenance, Meta } from "../../../src/repositories/interfaces/meta.entity.interface";
import { MaintenanceMode } from "../../../src/utils/enums/maintenance-mode.enum";

const mockTimestamp = '2025-01-01T14:00:01.000Z';
const mockData: Meta = {
    id: 1,
    app: "support",
    author: "yqni13",
    build_on: mockTimestamp,
    environment: "development",
    app_version: "0.0.1",
    db_version: "0.0.2",
    docker_image: "no-image",
    docker_version: "0.0.3",
    jenkins_version: "0.0.4",
    maintenance_mode: MaintenanceMode.E000,
    last_modified: mockTimestamp,
    created_on: mockTimestamp
};

describe('Model tests, class: <meta>, priority: mapObjToApi', () => {

    describe('Testing valid fn calls', () =>{

        test('Map timestamps of meta object, entity: <Meta>', () => {
            const mockParam_data: Meta = structuredClone(mockData);
            const testFn = metaModel.mapObjToApi(mockParam_data);
            let expectResult = structuredClone(mockData);
            expectResult.build_on = mockTimestamp;
            expectResult.created_on = mockTimestamp;
            expectResult.last_modified = mockTimestamp;

            expect(testFn).toEqual(expectResult);
        })

        test('Map timestamps of meta object, entity: <Maintenance>', () => {
            const mockParam_data: Maintenance = {
                id: 1,
                app: 'support',
                build_on: mockTimestamp,
                maintenance_mode: MaintenanceMode.E000,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            }
            const testFn = metaModel.mapObjToApi(mockParam_data);
            const expectResult = structuredClone(mockParam_data);

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
            expectResult[0].build_on = mockTimestamp;
            expectResult[0].created_on = mockTimestamp;
            expectResult[0].last_modified = mockTimestamp;

            expect(testFn).toEqual(expectResult);
        })
    })
})