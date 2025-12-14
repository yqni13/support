import { InvalidSourceException } from './exceptions/common.exception';
import { MailSource } from './enums/mail-source.enum';
import { secrets } from './secrets.utils';
import { v4 as uuid_v4 } from 'uuid';
import crypto from 'crypto';
import { Logger } from '../logger/config.logger';

const logger = Logger.getLogger();

export const now = (): Date => new Date();

export function generateUUID(): string {
    return uuid_v4();
}

export function mapKeyToHash(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex');
}

export function getTimestampUTC(timestamp?: Date): string {
    return timestamp ? new Date(timestamp).toISOString() : new Date().toISOString();
}

export function getDateUTC(timestamp?: Date): string {
    const dateObj = timestamp ? new Date(timestamp) : new Date();
    return dateObj.toISOString().slice(0, 10);
}

export function isEmptyObj(obj: any): boolean {
    return JSON.stringify(obj) === '{}';
}

export function selectPrivateKey(source: MailSource): string {
    switch(source) {
        case(MailSource.ARTDV): {
            return secrets.PRIVATE_KEY_ARTDV;
        }
        case(MailSource.TAVA): {
            return secrets.PRIVATE_KEY_TAVA;
        }
        default:
            throw new InvalidSourceException();
    }
}

export function logError(message: string, method: string, err: any) {
    message += ` - ENV: '${secrets.ENV_MODE.trim()}'`;
    logger.error(message, {
        error: err.error,
        code: err.code ? err.code : err.status ? err.status : null,
        stack: err.stack,
        context: { method: method }
    });
}

export function mapObjTimestamps<T>(data: T, timeMapTargets: string[]): T {
    timeMapTargets.forEach((key: string) => {
        (data as any)[key] = getTimestampUTC(new Date((data as any)[key]));
    })
    return data as T;
}

export function mapArrayTimestamps<T>(data: T[], timeMapTargets: string[]): T[] {
    data.forEach((obj: T) => {
        obj = mapObjTimestamps(obj, timeMapTargets);
    })
    return data as T[];
}