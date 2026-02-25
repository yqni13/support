import { InvalidApiKeyException, MissingApiKeyException } from './../../../src/utils/exceptions/auth.exception';
import { authAdmin } from '../../../src/middleware/auth.admin.middleware';
import * as CommonUtils from "../../../src/utils/common.utils";
import { secrets } from "../../../src/utils/secrets.utils";

describe('Unit-tests (middleware), priority: fn authAdmin()', () => {

    const req: any = { header: jest.fn() };
    const res: any = {};
    const next = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Testing valid fn calls', () => {

        test('Verfiy admin, params: valid <api-key>', async () => {
            const mockApiKey = secrets.ADMIN_API.trim();
            req.header.mockReturnValue(mockApiKey);

            // middleware == factory fn returning express fn => fn(req, res, next)
            const middleware = authAdmin();
            await middleware(req, res, next);

            expect(next).toHaveBeenCalledWith();
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Verify admin, error: MissingApiKeyException', async () => {
            req.header.mockReturnValue(undefined);

            jest.spyOn(CommonUtils, 'logError').mockImplementation();

            const middleware = authAdmin();
            await middleware(req, res, next);

            const errArg = next.mock.calls[0][0];
            expect(errArg).toBeInstanceOf(MissingApiKeyException);
            expect(errArg.status).toBe(401);
        })

        test('Verify admin, error: InvalidApiKeyException', async () => {
            const mockApiKey = 'invalid_api_key';
            req.header.mockReturnValue(mockApiKey);

            jest.spyOn(CommonUtils, 'logError').mockImplementation();

            const middleware = authAdmin();
            await middleware(req, res, next);

            const errArg = next.mock.calls[0][0];
            expect(errArg).toBeInstanceOf(InvalidApiKeyException);
            expect(errArg.status).toBe(401);
        })
    })
})