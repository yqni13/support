import { InvalidApiKeyException, MissingApiKeyException } from './../../../src/utils/exceptions/auth.exception';
import { Clients } from "../../../src/repositories/interfaces/clients.entity.interface";
import clientsService from "../../../src/services/clients.service";
import { default as mockId } from "../../mock-data/id.mock-data.json";
import { secrets } from "../../../src/utils/secrets.utils";
import { ApiKeyStatus } from "../../../src/utils/enums/api-key-status.enum";
import * as CommonValidators from "../../../src/validation/common.validation";
import * as CommonUtils from "../../../src/utils/common.utils";
import { authClient } from "../../../src/middleware/auth.client.middleware";
import { ErrorStatusCodes } from "../../../src/utils/errorStatusCodes.utils";

describe('Unit-tests (middleware), priority: fn authClient()', () => {

    const mockTimestamp = '2025-01-01T14:00:00.000Z';
    const req: any = { header: jest.fn() };
    const res: any = {};
    const next = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Testing valid fn calls', () => {

        test('Verfiy client, params: valid <api-key>', async () => {
            const mockApiKey = 'valid_api_key';
            const mockClient: Clients = {
                client_id: mockId.clients.valid[0],
                name: 'valid_clients_test_name',
                api_key_hash: secrets.TEST_APIKEY_HASH,
                status: ApiKeyStatus.ACTIVE,
                flag: null,
                last_use: mockTimestamp,
                last_modified: mockTimestamp,
                created_on: mockTimestamp
            };
            req.header.mockReturnValue(mockApiKey);

            jest.spyOn(CommonValidators, 'validateApiKey').mockImplementation();
            jest.spyOn(clientsService, 'getClientByActiveKey').mockResolvedValue(mockClient);
            jest.spyOn(clientsService, 'updateClientLastUse').mockImplementation();

            // middleware == factory fn returning express fn => fn(req, res, next)
            const middleware = authClient();
            await middleware(req, res, next);

            expect(CommonValidators.validateApiKey).toHaveBeenCalledWith(mockApiKey);
            expect(clientsService.getClientByActiveKey).toHaveBeenCalledWith(mockApiKey);
            expect(req.apiClients).toEqual(mockClient);
            expect(clientsService.updateClientLastUse).toHaveBeenCalledWith(mockClient.client_id);
            // Only important check but keep other checks for demo reasons.
            expect(next).toHaveBeenCalledWith();
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Verify client, error: MissingApiKeyException', async () => {
            req.header.mockReturnValue(undefined);

            jest.spyOn(CommonUtils, 'logError').mockImplementation();

            const middleware = authClient();
            await middleware(req, res, next);

            expect(CommonValidators.validateApiKey).not.toHaveBeenCalledWith();
            expect(clientsService.getClientByActiveKey).not.toHaveBeenCalledWith();
            expect(clientsService.updateClientLastUse).not.toHaveBeenCalledWith();
            const errArg = next.mock.calls[0][0];
            expect(errArg).toBeInstanceOf(MissingApiKeyException);
            expect(errArg.status).toBe(401);
        })

        test('Verify client, error: InvalidApiKeyException', async () => {
            const mockApiKey = 'invalid_api_key';
            const mockClient: Clients | null = null;
            req.header.mockReturnValue(mockApiKey);

            jest.spyOn(CommonValidators, 'validateApiKey').mockImplementation();
            jest.spyOn(clientsService, 'getClientByActiveKey').mockResolvedValue(mockClient);

            const middleware = authClient();
            await middleware(req, res, next);

            const errArg = next.mock.calls[0][0];
            expect(errArg).toBeInstanceOf(InvalidApiKeyException);
            expect(errArg.status).toBe(ErrorStatusCodes.InvalidApiKeyException);
        })
    })
})