import winston from 'winston';
import { secrets } from '../utils/secrets.utils';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import { EnvMode } from '../utils/enums/env-mode.enum';

export class Logger {
    private static logger: winston.Logger;

    static getLogger() {
        if(this.logger) {
            return this.logger;
        }

        const logtail = new Logtail(secrets.BETTERSTACK_LOGGING_KEY, {
            endpoint: `https://${secrets.BETTERSTACK_HOST}`
        });

        const transport: any[] = [];
        if(secrets.ENV_MODE.trim() === EnvMode.DEV || secrets.ENV_MODE.trim() === EnvMode.TEST) {
            transport.push(
                new winston.transports.Console({
                    level: 'info',
                    format: winston.format.prettyPrint()
                })
            );
        } else {
            transport.push(new LogtailTransport(logtail));
        }

        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: transport
        });

        return this.logger;
    }
}