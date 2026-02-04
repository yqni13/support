import {
    ClientsFlagPenalty,
    MaintenanceTrafficPenalty,
    PenaltyHandler,
    UsersFlagPenalty
} from "../handler/penalty.handler.middleware";
import { Violation } from "../../utils/enums/violations.enum";
import { PenaltyApply } from "../interfaces/penalties.interface.middleware";

export const penaltyHandler = new PenaltyHandler(
    new Map<Violation, PenaltyApply>([
        [Violation.CLIENTSFLAG, new ClientsFlagPenalty()],
        [Violation.USERSFLAG, new UsersFlagPenalty()],
        [Violation.MAINTENANCE_TRAFFIC, new MaintenanceTrafficPenalty]
    ])
)