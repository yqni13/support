import multer from 'multer';
import * as CommonUtils from '../../../../src/utils/common.utils';
import { parseFiles } from '../../../../src/middleware/files/parse.files.middleware';

jest.mock('multer'); 
// Tests including multer parsing mocked files => tickets.integration.test.ts
describe('Unit-tests (middleware), priority: fn parseFiles()', () => {

    const req: any = {};
    const res: any = {};
    const next = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
    })
    afterEach(() => {
        jest.restoreAllMocks();
    })

    describe('Testing valid fn calls', () => {

        test('Mock file-parsing of data into req.files, call next()', () => {
            const mockMulter = jest.fn(
                (mockReq, mockRes, callback) => callback()
            );
            ((multer as unknown) as jest.Mock).mockReturnValue({
                array: jest.fn(() => mockMulter)
            })

            const middleware = parseFiles();
            middleware(req, res, next);

            expect(next).toHaveBeenCalledWith();
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Mock file-parsing of data into req.files, call next(err)', () => {
            jest.spyOn(CommonUtils, 'logError').mockImplementation();
            const errorMsg = 'parsing failed';
            const mockError = new Error(errorMsg);
            const mockMulter = jest.fn(
                (mockReq, mockRes, callback) => callback(mockError)
            );
            ((multer as unknown) as jest.Mock).mockReturnValue({
                array: jest.fn(() => mockMulter)
            })

            const middleware = parseFiles();
            middleware(req, res, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({ message: errorMsg })
            );
        })
    })
})