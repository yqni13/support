import winston from 'winston';
import { secrets } from '../utils/secrets.utils';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';

export class Logger {
    private _logger: any;

    constructor() {
        this._logger = null;
    }
    
    getLogger() {
        if(this._logger) {
            return this._logger;
        }
        const logtail = new Logtail(secrets.BETTERSTACK_LOGGING_KEY, {
            endpoint: `https://${secrets.BETTERSTACK_HOST}`
        });

        this._logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [
                new winston.transports.Console({
                    level: 'info',
                    format: winston.format.prettyPrint()
                }),
                new LogtailTransport(logtail)
            ]
        });

        return this._logger;
    }
}