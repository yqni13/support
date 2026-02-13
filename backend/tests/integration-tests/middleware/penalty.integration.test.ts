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
import { MaintenanceMode } from "../../../src/utils/enums/maintenance-mode.enum";
import metaService from "../../../src/services/meta.service";

jest.setTimeout(60000);

const testValidMetaId = mockId.meta.valid[0];
const testValidClientsId = mockId.clients.valid[0];
const testValidUsersId = mockId.users.valid[0];

describe('Middleware tests category <handlers>, priority: PenaltyHandler', () => {

    let dbTestSetup: DBTestSetup;
    beforeAll(async () => {
        dbTestSetup = new DBTestSetup();
        await dbTestSetup.init();
        MockUtils.disableConsoleMessages();
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

        test('Params: <PenaltyContext>, type: <Violation.MAINTENANCE_TRAFFIC>, result: "PENALTY"', async () => {
            const testParam_context: PenaltyContext = {
                type: Violation.MAINTENANCE_TRAFFIC,
                id: testValidMetaId,
                penaltyValue: MaintenanceMode.T011
            };

            await dbTestSetup.addTestData();
            const _ = await penaltyHandler.apply(testParam_context);
            const testFn = await metaService.getMaintenanceMode('support');
            const testMaintenanceModeResult = MaintenanceMode.T011;

            expect(testFn?.maintenance_mode).toBe(testMaintenanceModeResult);
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