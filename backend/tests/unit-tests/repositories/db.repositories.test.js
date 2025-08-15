
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

const DBConnection = require('../../../src/configs/db');
const { _mockClient, _mockConnect, _mockRelease } = require('pg');

describe('Database tests, priority: connection', () => {

    describe('Testing valid fn calls', () => {

        let mockDb;
        beforeAll(() => {
            mockDb = new DBConnection();
        })

        test('Get connection string to address database, environment: development', () => {
            const mockParam_env = 'development';
            const testFn = mockDb._getConnectionString(mockParam_env);
            const expectHost = '@localhost';

            expect(testFn).toContain(expectHost);
        })

        test('Get connection string to address database, environment: staging', () => {
            const mockParam_env = 'staging';
            const testFn = mockDb._getConnectionString(mockParam_env);
            const expectHost = '@localhost';

            expect(testFn).toContain(expectHost);
        })

        test('Get connection string to address database, environment: production', () => {
            const mockParam_env = 'production';
            const testFn = mockDb._getConnectionString(mockParam_env);
            const expectHost = '@dockerhost';

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
    })
})
