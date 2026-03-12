import { DemoLimitsCountDTO } from "../../dtos/demo-limits.dto";
import { RateLimitsCountDTO } from "../../dtos/rate-limits.dto";
import { TicketsIntervalDTO } from "../../dtos/tickets.dto";
import { MetaId } from "../../repositories/interfaces/meta.entity.interface";
import demoLimitsService from "../../services/demo-limits.service";
import rateLimitsService from "../../services/rate-limits.service";
import ticketsService from "../../services/tickets.service";
import * as CommonUtils from "../../utils/common.utils";
import { MaintenanceMode } from "../../utils/enums/maintenance-mode.enum";
import { Violation } from "../../utils/enums/violations.enum";
import { RateLimitsData, RateLimitsResponse, RateLimitsRule } from "../interfaces/rate-limits.interface.middleware";

export class ClientsBurstLimitRule implements RateLimitsRule {

    constructor(private requestLimit: number) {
        //
    }

    async check(data: RateLimitsData): Promise<RateLimitsResponse | null> {
        const dto: TicketsIntervalDTO = { client_id: data.client_id, intervalTime: '1 minute' };
        const tickets = await ticketsService.getTicketsByTimeInterval(dto);
        if(tickets && tickets.length >= this.requestLimit) {
            return { msg: 'support-ratelimits-clients-burst', retryAfter: CommonUtils.getNextDayUTC() };
        }

        return null;
    }
}

export class UsersBurstLimitRule implements RateLimitsRule {

    constructor(private requestLimit: number) {
        //
    }

    async check(data: RateLimitsData): Promise<RateLimitsResponse | null> {
        const dto: TicketsIntervalDTO = { user_id: data.user_id, intervalTime: '1 minute' };
        const tickets = await ticketsService.getTicketsByTimeInterval(dto);
        if(tickets && tickets.length >= this.requestLimit) {
            return { msg: 'support-ratelimits-users-burst', retryAfter: CommonUtils.getNextDayUTC() };
        }

        return null;
    }
}

export class ClientsDailyLimitRule implements RateLimitsRule {

    constructor(private requestLimit: number) {
        //
    }

    async check(data: RateLimitsData): Promise<RateLimitsResponse | null> {
        const dto: RateLimitsCountDTO = { client_id: data.client_id, day: CommonUtils.getDateUTC() };
        const count: number = await rateLimitsService.getRateLimitCount(dto);
        if(count >= this.requestLimit) {
            return {
                msg: 'support-ratelimits-clients-daily',
                retryAfter: CommonUtils.getNextDayUTC(),
                penalty: {
                    type: Violation.CLIENTSFLAG,
                    id: data.client_id,
                    penaltyValue: data.client?.flag ?? null
                }
            };
        }

        return null;
    }
}

export class UsersDailyLimitRule implements RateLimitsRule {

    constructor(private requestLimit: number) {
        //
    }

    async check(data: RateLimitsData): Promise<RateLimitsResponse | null> {
        const dto: RateLimitsCountDTO = { user_id: data.user_id, day: CommonUtils.getDateUTC() };
        const count: number = await rateLimitsService.getRateLimitCount(dto);
        if(count >= this.requestLimit) {
            return {
                msg: 'support-ratelimits-users-daily',
                retryAfter: CommonUtils.getNextDayUTC(),
                penalty: {
                    type: Violation.USERSFLAG,
                    id: data.user_id,
                    penaltyValue: data.user?.flag ?? null
                }
            };
        }

        return null;
    }
}

export class TotalDailyLimitRule implements RateLimitsRule {

    constructor(private requestLimit: number) {
        //
    }

    async check(): Promise<RateLimitsResponse | null> {
        const dto: RateLimitsCountDTO = { day: CommonUtils.getDateUTC() };
        const count: number = await rateLimitsService.getRateLimitCount(dto);
        if(count >= this.requestLimit) {
            return { 
                msg: 'support-ratelimits-total-daily', 
                retryAfter: CommonUtils.getNextDayUTC(),
                penalty: {
                    type: Violation.MAINTENANCE_TRAFFIC,
                    id: 1 as MetaId,
                    penaltyValue: MaintenanceMode.T011
                }
            };
        }

        return null;
    }
}

export class DemoDailyLimitRule implements RateLimitsRule {

    constructor(private requestLimit: number) {
        //
    }

    async check(): Promise<RateLimitsResponse | null> {
        const dto: DemoLimitsCountDTO = { day: CommonUtils.getDateUTC() };
        const count: number = await demoLimitsService.getDemoLimitCount(dto);
        if(count >= this.requestLimit) {
            return { msg: 'support-demolimits-total-daily', retryAfter: CommonUtils.getNextDayUTC() };
        }

        return null;
    }
}