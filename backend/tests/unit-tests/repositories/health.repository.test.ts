import { DBConnection } from "../../../src/configs/db";
import healthRepository from "../../../src/repositories/health.repository";
import * as MockUtils from "../../common.test-utils";

jest.mock("../../../src/configs/db", () => {
    return {
        DBConnection: {
            getInstance: jest.fn()
        }
    }
});

const mockBoolean = false;

describe('Unit-tests (repository), priority: HealthCheck', () => {

    describe('Database tests, priority: fn checkDatabase()', () => {

        describe('Testing valid fn calls', () => {

            test('Return status for positive database connection', async () => {
                const mockQuery = `SELECT 1`;
                const mockResult = { status: 'ok' };
                const mockClient = MockUtils.mapMockDbClient(mockResult);
                const testFn = await healthRepository.checkDatabase();

                expect(testFn).toEqual(mockResult);
                expect(DBConnection.getInstance).toHaveBeenCalled();
                expect(mockClient.query).toHaveBeenCalledWith(
                    expect.stringContaining(mockQuery),
                );
            })
        })

        describe('Testing invalid fn calls', () => {

            test('Return error result by catch-block', async () => {
                const mockErrorMsg = 'test-error';
                const mockResult = { status: 'error', message: mockErrorMsg };
                const _ = MockUtils.mapMockDbClient(mockResult, mockBoolean, mockErrorMsg);
                const testFn = await healthRepository.checkDatabase();

                expect(testFn).toEqual(mockResult);
            })
        })
    })
})