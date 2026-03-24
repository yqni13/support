import {
    PenaltyClientsFlagContext,
    PenaltyApply,
    PenaltyUsersFlagContext,
    PenaltyContext,
    PenaltyMaintenanceTrafficContext,
} from "../interfaces/penalties.interface.middleware";
import { ClientsFlagUpdateDTO } from "../../dtos/clients.dto";
import { getNextRankEnumValue } from "../../utils/common.utils";
import clientsService from "../../services/clients.service";
import { Violation } from "../../utils/enums/violations.enum";
import { Flag } from "../../utils/enums/flag.enum";
import usersService from "../../services/users.service";
import { UsersFlagUpdateDTO } from "../../dtos/users.dto";
import { MaintenanceUpdateDTO } from "../../dtos/meta.dto";
import metaService from "../../services/meta.service";
import { NotificationService } from "../../services/notificiation.service";

export class PenaltyHandler{
    constructor(private readonly handlers: Map<Violation, PenaltyApply>) {
        //
    }

    async apply(context?: PenaltyContext) {
        const handler = context ? this.handlers.get(context.type) : null;
        if(!handler) {
            return;
        }
        await handler.apply(context as any);
    }
}

export class ClientsFlagPenalty implements PenaltyApply<Extract<PenaltyContext, { type: Violation.CLIENTSFLAG }>> {
    readonly type = Violation.CLIENTSFLAG;

    async apply(context: PenaltyClientsFlagContext) {
        const id = context.id;
        const dto: ClientsFlagUpdateDTO = { flag: getNextRankEnumValue(Flag, context.penaltyValue) };
        const result = await clientsService.updateClientFlag(id, dto);
        const notification = NotificationService.getInstance();
        await notification.sendPenaltyInfo({
            id: context.id,
            entity: 'Clients',
            client_name: result?.name,
            violation: context.type,
            penalty: dto.flag,
        });
    }
}

export class UsersFlagPenalty implements PenaltyApply<Extract<PenaltyContext, { type: Violation.USERSFLAG }>> {
    readonly type = Violation.USERSFLAG;

    async apply(context: PenaltyUsersFlagContext) {
        const id = context.id;
        const dto: UsersFlagUpdateDTO = { flag: getNextRankEnumValue(Flag, context.penaltyValue) };
        const result = await usersService.updateUserFlag(id, dto);
        const notification = NotificationService.getInstance();
        await notification.sendPenaltyInfo({
            id: context.id,
            entity: 'Users',
            user_email: result?.email,
            violation: context.type,
            penalty: dto.flag,
        });
    }
}

export class MaintenanceTrafficPenalty implements PenaltyApply<Extract<PenaltyContext, 
{ type: Violation.MAINTENANCE_TRAFFIC }>> {
    readonly type = Violation.MAINTENANCE_TRAFFIC;

    async apply(context: PenaltyMaintenanceTrafficContext) {
        const id = context.id;
        const dto: MaintenanceUpdateDTO = { maintenance_mode: context.penaltyValue }; // MaintenanceMode.T011
        await metaService.updateMaintenanceMode(id, dto);
        const notification = NotificationService.getInstance();
        await notification.sendPenaltyInfo({
            id: context.id,
            entity: 'Meta',
            violation: context.type,
            penalty: dto.maintenance_mode,
        });
    }
}