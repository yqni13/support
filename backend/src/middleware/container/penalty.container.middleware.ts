import { Violation } from "../../utils/enums/violations.enum";
import { ClientsFlagPenalty, PenaltyHandler, UsersFlagPenalty } from "../handler/penalty.handler.middleware";
import { PenaltyApply } from "../interfaces/penalties.interface.middleware";

export const penaltyHandler = new PenaltyHandler(
    new Map<Violation, PenaltyApply>([
        [Violation.CLIENTSFLAG, new ClientsFlagPenalty()],
        [Violation.USERSFLAG, new UsersFlagPenalty()]
    ])
)