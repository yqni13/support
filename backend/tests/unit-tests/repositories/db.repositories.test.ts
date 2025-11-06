jest.mock('pg', () => {
    const mockRelease = jest.fn();
    const mockClient = { release: mockRelease };
    const mockConnect = jest.fn().mockResolvedValue(mockClient);
    
    return {
        Pool: jest.fn().mockImplementation(() => ({
            connect: mockConnect
        })),
        _mockClient: mockClient,
        _mockRelease: mockRelease,
        _mockConnect: mockConnect
    };
});

import { DBConnection } from '../../../src/configs/db';
import * as pg from 'pg';
const { _mockClient, _mockConnect, _mockRelease } = pg as any;
import { DBConnectionException, DBEmptyException } from '../../../src/utils/exceptions/db.exception';

describe('Database tests, priority: connection', () => {

    describe('Testing valid fn calls', () => {

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

        test('Get connection string to address database, environment: development', () => {
            const mockParam_env = 'development';
            const testFn = mockDb._getConnectionString(mockParam_env);
            const expectHost = '@localhost';

            expect(testFn).toContain(expectHost);
        })

        test('Get connection string to address database, environment: test', () => {
            const mockParam_env = 'test';
            const testFn = mockDb._getConnectionString(mockParam_env);
            const expectHost = '@localhost';

            expect(testFn).toContain(expectHost);
        })

        test('Open connection to database', async () => {
            const testFn = await mockDb.connect();

            expect(_mockConnect).toHaveBeenCalled();
            expect(testFn).toBe(_mockClient);
        })

        test('Close connection to database', async () => {
            await mockDb.close(_mockClient);

            expect(_mockRelease).toHaveBeenCalled();
        })

        test('Init connection to database, case: db loaded, HAS data rows', async () => {
            mockClient_init.query.mockResolvedValue({rowCount: 1});
            await expect(mockDbInit.init()).resolves.not.toThrow();
            const mockQuery = 'SELECT * FROM meta;';

            expect(mockClient_init.query).toHaveBeenCalledWith(mockQuery);
            expect(mockDbInit.close).toHaveBeenCalledWith(mockClient_init);
        })

        test('Init connection to database, case: db loaded, HAS NO data rows', async () => {
            mockClient_init.query.mockResolvedValue({rowCount: 0});
            await expect(mockDbInit.init()).rejects.toBeInstanceOf(DBEmptyException);
        })

        test('Init connection to database, case: db NOT loaded', async () => {
            mockClient_init.query.mockRejectedValue(new Error('connection failed'));
            await expect(mockDbInit.init()).rejects.toBeInstanceOf(DBConnectionException);
        })
    })
})
