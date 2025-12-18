import {
    PenaltyClientsFlagContext,
    PenaltyApply,
    PenaltyUsersFlagContext,
    PenaltyContext,
} from "../interfaces/penalties.interface.middleware";
import { ClientsFlagUpdateDTO } from "../../dtos/clients.dto";
import { getNextRankEnumValue } from "../../utils/common.utils";
import clientsService from "../../services/clients.service";
import { Violation } from "../../utils/enums/violations.enum";
import { Flag } from "../../utils/enums/flag.enum";
import usersService from "../../services/users.service";
import { UsersFlagUpdateDTO } from "../../dtos/users.dto";

export class PenaltyHandler{
    constructor(private readonly handlers: Map<Violation, PenaltyApply>) {
        //
    }

    async apply(context: PenaltyContext) {
        const handler = this.handlers.get(context.type);
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
        await clientsService.updateClientFlag(id, dto);
        // TODO(yqni13): add mail notification (SUPPORT-49)
    }
}

export class UsersFlagPenalty implements PenaltyApply<Extract<PenaltyContext, { type: Violation.USERSFLAG }>> {
    readonly type = Violation.USERSFLAG;

    async apply(context: PenaltyUsersFlagContext) {
        const id = context.id;
        const dto: UsersFlagUpdateDTO = { flag: getNextRankEnumValue(Flag, context.penaltyValue) };
        await usersService.updateUserFlag(id, dto);
        // TODO(yqni13): add mail notification (SUPPORT-49)
    }
}