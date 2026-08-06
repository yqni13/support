import { ClientsId } from "../../repositories/interfaces/clients.entity.interface";
import { MetaId } from "../../repositories/interfaces/meta.entity.interface";
import { UsersId } from "../../repositories/interfaces/users.entity.interface";
import { Flag } from "../../utils/enums/flag.enum";
import { MaintenanceMode } from "../../utils/enums/maintenance-mode.enum";
import { Violation } from "../../utils/enums/violations.enum";

export interface BasePenaltyContext {
    type: Violation,
    id: string | number,
    penaltyValue: unknown
}

export interface PenaltyApply<T extends PenaltyContext = PenaltyContext> {
    readonly type: Violation;
    apply(context: T): Promise<void>;
}

export type PenaltyContext =
    | { type: Violation.CLIENTSFLAG, id: ClientsId, penaltyValue: Flag | null }
    | { type: Violation.USERSFLAG, id: UsersId, penaltyValue: Flag | null }
    | { type: Violation.MAINTENANCE_TRAFFIC, id: MetaId, penaltyValue: MaintenanceMode };

export interface PenaltyClientsFlagContext extends BasePenaltyContext {
    type: Violation.CLIENTSFLAG,
    id: ClientsId,
    penaltyValue: Flag | null
}

export interface PenaltyUsersFlagContext extends BasePenaltyContext {
    type: Violation.USERSFLAG,
    id: UsersId,
    penaltyValue: Flag | null
}

export interface PenaltyMaintenanceTrafficContext extends BasePenaltyContext {
    type: Violation.MAINTENANCE_TRAFFIC,
    id: MetaId,
    penaltyValue: MaintenanceMode
}