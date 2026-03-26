jest.mock('pg', () => {
    const mockRelease = jest.fn();
    const mockClient = { release: mockRelease };
    const mockConnect = jest.fn().mockResolvedValue(mockClient);

    // Mock the following parts of 'pg' otherwise real Module will be overwritten (error).
    return {
        Pool: jest.fn().mockImplementation(() => ({
            connect: mockConnect
        })),
        types: {
            setTypeParser: jest.fn()
        },
        _mockClient: mockClient,
        _mockRelease: mockRelease,
        _mockConnect: mockConnect
    };
});

import { DBConnection } from '../../../src/configs/db';
import * as pg from 'pg';
import * as CommonUtils from "../../../src/utils/common.utils";
const { _mockClient, _mockConnect, _mockRelease } = pg as any;
import { DBConnectionException, DBEmptyException } from '../../../src/utils/exceptions/db.exception';

describe('Unit-tests (repository), class DBConnection', () => {

    let mockDb: any, mockDbInit: any, mockClient_init: any;
    beforeEach(() => {
        mockDb = new DBConnection();
        mockDbInit = new DBConnection();
        mockClient_init = {
            query: jest.fn(),
            release: jest.fn()
        }
        jest.spyOn(mockDbInit, 'connect').mockResolvedValue(mockClient_init);
        jest.spyOn(mockDbInit, 'close').mockResolvedValue(null);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Testing valid fn calls', () => {

        test('Fn getConnectionString(), environment: development', () => {
            const mockParam_env = 'development';
            const testFn = mockDb.getConnectionString(mockParam_env);
            const expectUser = 'postgres';

            expect(testFn).toContain(expectUser);
        })

        test('Fn getConnectionString(), environment: test', () => {
            const mockParam_env = 'test';
            const testFn = mockDb.getConnectionString(mockParam_env);
            const expectUser = 'testuser';

            expect(testFn).toContain(expectUser);
        })

        test('Fn connect()', async () => {
            const testFn = await mockDb.connect();

            expect(_mockConnect).toHaveBeenCalled();
            expect(testFn).toBe(_mockClient);
        })

        test('Fn close()', async () => {
            await mockDb.close(_mockClient);

            expect(_mockRelease).toHaveBeenCalled();
        })

        test('Fn init(), result: db loaded, HAS data rows', async () => {
            mockClient_init.query.mockResolvedValue({rowCount: 1});
            await expect(mockDbInit.init()).resolves.not.toThrow();
            const mockQuery = 'SELECT * FROM meta;';

            expect(mockClient_init.query).toHaveBeenCalledWith(mockQuery);
            expect(mockDbInit.close).toHaveBeenCalledWith(mockClient_init);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Fn init(), result: db loaded, HAS NO data rows', async () => {
            jest.spyOn(CommonUtils, 'logError').mockImplementation();
            mockClient_init.query.mockResolvedValue({rowCount: 0});
            await expect(mockDbInit.init()).rejects.toBeInstanceOf(DBEmptyException);
        })

        test('Fn init(), result: db NOT loaded', async () => {
            jest.spyOn(CommonUtils, 'logError').mockImplementation();
            mockClient_init.query.mockRejectedValue(new Error('connection failed'));
            await expect(mockDbInit.init()).rejects.toBeInstanceOf(DBConnectionException);
        })
    })
})
