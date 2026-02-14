import { requirePayload } from "../../../src/middleware/require.middleware";
import * as CommonUtils from "../../../src/utils/common.utils";
import { InvalidPropertiesException } from "../../../src/utils/exceptions/validation.exception";

describe('Unit-tests (middleware), priority: fn requirePayload()', () => {

    const res: any = {};
    const next = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Testing valid fn calls', () => {

        test('Validate req.body, content: valid test object', async () => {
            const req: any = { header: jest.fn(), body: { test: 'test-content' }};

            // middleware == factory fn returning express fn => fn(req, res, next)
            const middleware = requirePayload();
            await middleware(req, res, next);

            expect(next).toHaveBeenCalledWith();
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Validate req.body, error: InvalidPropertiesException by undefined', async () => {
            const req: any = { header: jest.fn(), body: undefined };

            jest.spyOn(CommonUtils, 'logError').mockImplementation();

            const middleware = requirePayload();
            await middleware(req, res, next);

            const errArg = next.mock.calls[0][0];
            expect(errArg).toBeInstanceOf(InvalidPropertiesException);
            expect(errArg.status).toBe(400);
        })

        test('Validate req.body, error: InvalidPropertiesException by []', async () => {
            const req: any = { header: jest.fn(), body: [] };

            jest.spyOn(CommonUtils, 'logError').mockImplementation();

            const middleware = requirePayload();
            await middleware(req, res, next);

            const errArg = next.mock.calls[0][0];
            expect(errArg).toBeInstanceOf(InvalidPropertiesException);
            expect(errArg.status).toBe(400);
        })

        test('Validate req.body, error: InvalidPropertiesException by {}', async () => {
            const req: any = { header: jest.fn(), body: {} };

            jest.spyOn(CommonUtils, 'logError').mockImplementation();

            const middleware = requirePayload();
            await middleware(req, res, next);

            const errArg = next.mock.calls[0][0];
            expect(errArg).toBeInstanceOf(InvalidPropertiesException);
            expect(errArg.status).toBe(400);
        })
    })
})