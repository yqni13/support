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
import { UsersId } from "../../../src/repositories/interfaces/users.entity.interface";
import { ClientsId } from "../../../src/repositories/interfaces/clients.entity.interface";
import { MetaId } from "../../../src/repositories/interfaces/meta.entity.interface";
import { NotificationService } from "../../../src/services/notificiation.service";

jest.setTimeout(60000);

const testValidMetaId = mockId.meta.valid[0] as MetaId;
const testValidClientId = mockId.clients.valid[0] as ClientsId;
const testValidUserId = mockId.users.valid[0] as UsersId;

describe('Integration-tests (middleware), priority: class PenaltyHandler', () => {

    let dbTestSetup: DBTestSetup;
    let notification: NotificationService;
    beforeAll(async () => {
        dbTestSetup = new DBTestSetup();
        await dbTestSetup.init();
        notification = NotificationService.getInstance();
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

        test('Params: <PenaltyContext> has Violation.CLIENTSFLAG, result: "PENALTY"', async () => {
            const testParam_context: PenaltyContext = {
                type: Violation.CLIENTSFLAG,
                id: testValidClientId,
                penaltyValue: null
            };

            await dbTestSetup.addTestData();
            jest.spyOn(notification, 'sendPenaltyInfo').mockImplementation();
            const _ = await penaltyHandler.apply(testParam_context);
            const testFn = await clientsService.getClientById(testValidClientId);
            const testClientsFlagResult = Flag.WARNING;

            expect(testFn?.flag).toBe(testClientsFlagResult);
        })

        test('Params: <PenaltyContext> has Violation.USERSFLAG, result: "PENALTY"', async () => {
            const testParam_context: PenaltyContext = {
                type: Violation.USERSFLAG,
                id: testValidUserId,
                penaltyValue: null
            };

            await dbTestSetup.addTestData();
            jest.spyOn(notification, 'sendPenaltyInfo').mockImplementation();
            const _ = await penaltyHandler.apply(testParam_context);
            const testFn = await usersService.getUserById(testValidUserId);
            const testUsersFlagResult = Flag.WARNING;

            expect(testFn?.flag).toBe(testUsersFlagResult);
        })

        test('Params: <PenaltyContext> has Violation.MAINTENANCE_TRAFFIC, result: "PENALTY"', async () => {
            const testParam_context: PenaltyContext = {
                type: Violation.MAINTENANCE_TRAFFIC,
                id: testValidMetaId,
                penaltyValue: MaintenanceMode.T011
            };

            await dbTestSetup.addTestData();
            jest.spyOn(notification, 'sendPenaltyInfo').mockImplementation();
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