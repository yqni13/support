const winston = require('winston');
const Secrets = require('../utils/secrets.utils');
const { Logtail } = require('@logtail/node');
const { LogtailTransport } = require('@logtail/winston');

class Logger {
    constructor() {
        this.logger = null;
    }
    
    getLogger() {
        if(this.logger) {
            return this.logger;
        }
        const logtail = new Logtail(Secrets.BETTERSTACK_LOGGING_KEY, {
            endpoint: `https://${Secrets.BETTERSTACK_HOST}`
        });

        this.logger = winston.createLogger({
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

        return this.logger;
    }
}

module.exports = new Logger();