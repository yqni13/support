import { 
    NotificationFeedbackParams,
    NotificationPenaltyParams,
    NotificationPostParams,
    NotificationTicketsParams
} from "./interfaces/notification.interface.service";
import { secrets } from "../utils/secrets.utils";
import { EnvMode } from "../utils/enums/env-mode.enum";
import axios from "axios";
import * as CommonUtils from "../utils/common.utils";

export class NotificationService {
    private static instance: NotificationService;

    static getInstance(): NotificationService {
        if(!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    private async notify(params: NotificationPostParams) {
        try {
            await axios.post(`https://api.telegram.org/bot${secrets.NOTIFY_BOT_KEY.trim()}/sendMessage`, {
                chat_id: secrets.NOTIFY_ADMIN_ID.trim(),
                text: params.text.trim(),
            });
        } catch(err: any) {
            CommonUtils.logError(params.logMsg, params.logMethod, err);
        }
    }

    private generateTitle(name: string): string {
        const env = secrets.ENV_MODE.trim();
        if(env === EnvMode.DEV) {
            return `SUPPORT:${name.toUpperCase()}:TESTING-DEV`;
        } else {
            return `SUPPORT:${name.toUpperCase()}`;
        }
    }

    async sendTicketInfo(data: NotificationTicketsParams) {
        const message = `${this.generateTitle('ticket')}\nID: ${data.ticket_id}\nCLIENT: ${data.client_name}\nUSER: ${data.user_email}\nOPTION: ${data.option}\nTITLE: ${data.title}\nDATE: ${CommonUtils.getTimestampUTC(new Date(data.created_on))}`;

        await this.notify({
            text: message,
            logMsg: 'NOTIFICATION ERROR ON TICKETS NOTIFY',
            logMethod: 'Support_NotificationService_sendTicketInfo'
        });
    }

    async sendFeedbackInfo(data: NotificationFeedbackParams) {
        const message = `${this.generateTitle('feedback')}\nID: ${data.feedback_id}\nCLIENT: ${data.client_name}\nUSER: ${data.user_email}\nRATING: ${data.rating}\nAVERAGE: ${data.rating_average}\nTERM: ${data.term_accepted}\nDATE: ${CommonUtils.getTimestampUTC(new Date(data.created_on))}`;

        await this.notify({
            text: message,
            logMsg: 'NOTIFICATION ERROR ON FEEDBACK NOTIFY',
            logMethod: 'Support_NotificationService_sendFeedbackInfo'
        });
    }

    async sendPenaltyInfo(data: NotificationPenaltyParams) {
        const message = `${this.generateTitle('penalty')}\nENTITY: ${data.entity}\nID: ${String(data.id)}\n${data.client_name ? 'NAME: ' + data.client_name + '\n' : ''}${data.user_email ? 'EMAIL: ' + data.user_email + '\n' : ''}VIOLATION: ${data.violation}\nPENALTY: ${data.penalty}\nDATE: ${CommonUtils.getTimestampUTC(new Date())}`;

        await this.notify({
            text: message,
            logMsg: 'NOTIFICATION ERROR ON PENALTY NOTIFY',
            logMethod: 'Support_NotificationService_sendPenaltyInfo'
        });
    }
}