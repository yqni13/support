import { MaintenanceException } from './../../../src/utils/exceptions/common.exception';
import { MaintenanceResponseDTO } from './../../../src/dtos/meta.dto';
import metaService from "../../../src/services/meta.service";
import * as Utils from "../../../src/utils/common.utils";
import { MaintenanceMode } from '../../../src/utils/enums/maintenance-mode.enum';
import { ErrorStatusCodes } from '../../../src/utils/errorStatusCodes.utils';
import { maintain, updateTrafficError } from '../../../src/middleware/maintenance.middleware';

describe('Middleware tests category <common>, priority: maintain', () => {

    const mockTimestamp = '2025-01-01T14:00:00.000Z';
    const req: any = { header: jest.fn(), body: {} };
    const res: any = {};
    const next = jest.fn();
    let mockMaintenanceResponse: MaintenanceResponseDTO | null;
    beforeEach(() => {
        mockMaintenanceResponse = {
            id: 1,
            app: 'support',
            build_on: mockTimestamp,
            maintenance_mode: MaintenanceMode.A000,
            created_on: mockTimestamp,
            last_modified: mockTimestamp
        }
        jest.clearAllMocks();
    });

    describe('Testing valid fn calls', () => {

        test('Verify maintenance status, result: "A-000"', async () => {
            jest.spyOn(metaService, 'getMaintenanceMode').mockResolvedValue(mockMaintenanceResponse);

            // middleware == factory fn returning express fn => fn(req, res, next)
            const middleware = maintain();
            await middleware(req, res, next);

            expect(next).toHaveBeenCalledWith();
        })

        test('Verify maintenance status, from "T-011" to "A-000"', async () => {
            const mockResponse = structuredClone(mockMaintenanceResponse) as MaintenanceResponseDTO;
            mockResponse['maintenance_mode'] = MaintenanceMode.T011;

            jest.spyOn(metaService, 'getMaintenanceMode').mockResolvedValue(mockResponse);

            // Mock functions inside updateTrafficError.
            mockResponse.maintenance_mode = MaintenanceMode.A000;
            jest.spyOn(Utils, 'getNextDayUTC').mockReturnValue('2025-01-02T00:00:01.000Z');
            jest.spyOn(metaService, 'updateMaintenanceMode').mockResolvedValue(mockResponse);

            jest.spyOn(Utils, 'logError').mockImplementation();

            const middleware = maintain();
            await middleware(req, res, next);

            expect(next).toHaveBeenCalledWith();
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Verify maintenance status, error: MaintenanceException by null', async () => {
            jest.spyOn(metaService, 'getMaintenanceMode').mockResolvedValue(null);
            jest.spyOn(Utils, 'logError').mockImplementation();

            const middleware = maintain();
            await middleware(req, res, next);

            const errArg = next.mock.calls[0][0];
            expect(errArg).toBeInstanceOf(MaintenanceException);
            expect(errArg.status).toBe(ErrorStatusCodes.MaintenanceException);
        })

        test('Verify maintenance status, error: MaintenanceException by "M-008"', async () => {
            const mockResponse = structuredClone(mockMaintenanceResponse) as MaintenanceResponseDTO;
            mockResponse['maintenance_mode'] = MaintenanceMode.M008;

            jest.spyOn(metaService, 'getMaintenanceMode').mockResolvedValue(mockResponse);
            jest.spyOn(Utils, 'logError').mockImplementation();

            const middleware = maintain();
            await middleware(req, res, next);

            const errArg = next.mock.calls[0][0];
            expect(errArg).toBeInstanceOf(MaintenanceException);
            expect(errArg.status).toBe(ErrorStatusCodes.MaintenanceException);
        })

        test('Verify maintenance status, error: MaintenanceException by "E-013"', async () => {
            const mockResponse = structuredClone(mockMaintenanceResponse) as MaintenanceResponseDTO;
            mockResponse['maintenance_mode'] = MaintenanceMode.E013;

            jest.spyOn(metaService, 'getMaintenanceMode').mockResolvedValue(mockResponse);
            jest.spyOn(Utils, 'logError').mockImplementation();

            const middleware = maintain();
            await middleware(req, res, next);

            const errArg = next.mock.calls[0][0];
            expect(errArg).toBeInstanceOf(MaintenanceException);
            expect(errArg.status).toBe(ErrorStatusCodes.MaintenanceException);
        })

        test('Verify maintenance status, error: MaintenanceException by "T-011"', async () => {
            const mockResponse = structuredClone(mockMaintenanceResponse) as MaintenanceResponseDTO;
            mockResponse['maintenance_mode'] = MaintenanceMode.T011;

            jest.spyOn(metaService, 'getMaintenanceMode').mockResolvedValue(mockResponse);
            jest.spyOn(Utils, 'getNextDayUTC').mockReturnValue('2025-01-03T00:00:01.000Z');
            jest.spyOn(metaService, 'updateMaintenanceMode').mockResolvedValue(mockResponse);
            jest.spyOn(Utils, 'logError').mockImplementation();

            const middleware = maintain();
            await middleware(req, res, next);

            const errArg = next.mock.calls[0][0];
            expect(errArg).toBeInstanceOf(MaintenanceException);
            expect(errArg.status).toBe(ErrorStatusCodes.MaintenanceException);
        })
    })
})

describe('Middleware tests category <common>, priority: updateTrafficError', () => {

    const mockTimestamp = '2025-01-02T14:00:00.000Z';
    let mockMaintenanceResponse: MaintenanceResponseDTO;
    beforeEach(() => {
        mockMaintenanceResponse = {
            id: 1,
            app: 'support',
            build_on: mockTimestamp,
            maintenance_mode: MaintenanceMode.T011,
            created_on: mockTimestamp,
            last_modified: mockTimestamp
        }
        jest.clearAllMocks();
    });

    describe('Testing valid fn calls', () => {

        test('Update maintenance mode by date, before retryAfter date', async () => {
            const mockParam_maintenanceData = structuredClone(mockMaintenanceResponse);
            const mockResult = structuredClone(mockMaintenanceResponse);
            jest.spyOn(Utils, 'getNextDayUTC').mockReturnValue('2025-01-03T00:00:01.000Z');
            jest.spyOn(Utils, 'now').mockReturnValue(new Date(mockTimestamp));
            jest.spyOn(metaService, 'updateMaintenanceMode').mockResolvedValue(mockResult);

            const testFn = await updateTrafficError(mockParam_maintenanceData);
            expect(testFn?.maintenance_mode).toBe(MaintenanceMode.T011);
        })

        test('Update maintenance mode by date, after retryAfter date', async () => {
            const mockParam_maintenanceData = structuredClone(mockMaintenanceResponse);
            const mockResult = structuredClone(mockMaintenanceResponse);
            mockResult.maintenance_mode = MaintenanceMode.A000
            jest.spyOn(Utils, 'now').mockReturnValue(new Date(mockTimestamp));
            jest.spyOn(Utils, 'getNextDayUTC').mockReturnValue('2025-01-02T00:00:01.000Z');
            jest.spyOn(metaService, 'updateMaintenanceMode').mockResolvedValue(mockResult);

            const testFn = await updateTrafficError(mockParam_maintenanceData);
            expect(testFn?.maintenance_mode).toBe(MaintenanceMode.A000);
        })
    })
})