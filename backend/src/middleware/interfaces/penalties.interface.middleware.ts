import { Flag } from "../../utils/enums/flag.enum";
import { MaintenanceMode } from "../../utils/enums/maintenance-mode.enum";
import { Violation } from "../../utils/enums/violations.enum";

export interface BasePenaltyContext {
    type: Violation,
    id: string | number,
    penaltyValue: any
}

export interface PenaltyApply<T extends PenaltyContext = PenaltyContext> {
    readonly type: Violation;
    apply(context: T): Promise<void>;
}

export type PenaltyContext =
    | { type: Violation.CLIENTSFLAG; id: string; penaltyValue: Flag | null; }
    | { type: Violation.USERSFLAG, id: string, penaltyValue: Flag | null; }
    | { type: Violation.MAINTENANCE_TRAFFIC, id: number, penaltyValue: MaintenanceMode };

export interface PenaltyClientsFlagContext extends BasePenaltyContext {
    type: Violation.CLIENTSFLAG,
    id: string,
    penaltyValue: Flag | null
}

export interface PenaltyUsersFlagContext extends BasePenaltyContext {
    type: Violation.USERSFLAG,
    id: string,
    penaltyValue: Flag | null
}

export interface PenaltyMaintenanceTrafficContext extends BasePenaltyContext {
    type: Violation.MAINTENANCE_TRAFFIC,
    id: number,
    penaltyValue: MaintenanceMode
}