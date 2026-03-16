import * as CommonUtils from '../../../../src/utils/common.utils';
import { parseFormData } from '../../../../src/middleware/parser/form-data.parser.middleware';

describe('Unit-tests (middleware), priority: fn parseFormData()', () => {

    const mockBody = {user_email: 'test@demo.com', option: 'support'};
    let req: any;
    const res: any = {};
    const next = jest.fn();
    beforeEach(() => {
        req  = { body: { data: JSON.stringify(mockBody)}};
        jest.clearAllMocks();
    })
    afterEach(() => {
        jest.restoreAllMocks();
    })

    describe('Testing valid fn calls', () => {

        test('Mock form-data parsing into req.body, call next()', () => {
            const middleware = parseFormData();
            middleware(req, res, next);

            expect(next).toHaveBeenCalledWith();
            expect(req.body).toMatchObject(mockBody);
        })
    })

    describe('Testing invalid fn calls', () => {
    
        test('Mock file-parsing of data into req.files, call next(err)', () => {
            jest.spyOn(CommonUtils, 'logError').mockImplementation();
            const errorMsg = 'parsing failed';
            JSON.parse = jest.fn().mockImplementationOnce(() => {throw new Error(errorMsg)})

            const middleware = parseFormData();
            middleware(req, res, next);

            expect(next).toHaveBeenCalledWith(
                expect.objectContaining({ message: errorMsg })
            );
        })
    })
})