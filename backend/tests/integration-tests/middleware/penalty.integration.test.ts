import { penaltyHandler } from "../../../src/middleware/container/penalty.container.middleware";
import { PenaltyContext } from "../../../src/middleware/interfaces/penalties.interface.middleware";
import clientsService from "../../../src/services/clients.service";
import { Flag } from "../../../src/utils/enums/flag.enum";
import { Violation } from "../../../src/utils/enums/violations.enum";
import { DBTestSetup } from "../../db-container.setup";
import { default as mockId } from "../../mock-data/id.mock-data.json";
import * as MockUtils from "../../common.test-utils";
import { runMigrations } from "../../db-migrations.setup";
import usersService from "../../../src/services/users.service";

jest.setTimeout(60000);

const testValidClientsId = mockId.clients.valid[0];
const testValidUsersId = mockId.users.valid[0];

describe('Middleware tests category <handlers>, priority: PenaltyHandler', () => {

    let dbTestSetup: DBTestSetup;
    beforeAll(async () => {
        dbTestSetup = new DBTestSetup();
        await dbTestSetup.init();
        MockUtils.disableConsoleMessages(); // Surpress multiple messages (migration progress etc). Disable to debug.
        await runMigrations('penalty.integration.test.ts');
    });

    beforeEach(async () => {
        await dbTestSetup.clearTables();
    });

    afterAll(async () => {
        await dbTestSetup.shutdown();
    });

    describe('Testing valid fn calls', () => {

        test('Params: <PenaltyContext>, type: <Violation.CLIENTSFLAG>, result: "PENALTY"', async () => {
            const testParam_context: PenaltyContext = {
                type: Violation.CLIENTSFLAG,
                id: testValidClientsId,
                penaltyValue: null
            };

            await dbTestSetup.addTestData();
            const _ = await penaltyHandler.apply(testParam_context);
            const testFn = await clientsService.getClientById(testValidClientsId);
            const testClientsFlagResult = Flag.WARNING;

            expect(testFn?.flag).toBe(testClientsFlagResult);
        })

        test('Params: <PenaltyContext>, type: <Violation.USERSFLAG>, result: "PENALTY"', async () => {
            const testParam_context: PenaltyContext = {
                type: Violation.USERSFLAG,
                id: testValidUsersId,
                penaltyValue: null
            };

            await dbTestSetup.addTestData();
            const _ = await penaltyHandler.apply(testParam_context);
            const testFn = await usersService.getUserById(testValidUsersId);
            const testUsersFlagResult = Flag.WARNING;

            expect(testFn?.flag).toBe(testUsersFlagResult);
        })

        test('Params: <undefined>, result: null', async () => {
            const testParam_context = undefined;

            await dbTestSetup.addTestData();
            const testResponse = await penaltyHandler.apply(testParam_context);
            const testResult = undefined;

            expect(testResponse).toBe(testResult);
        })
    })
})