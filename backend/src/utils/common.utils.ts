import { InvalidSourceException } from './exceptions/common.exception';
import { MailSource } from './enums/mail-source.enum';
import { secrets } from './secrets.utils';
import { v4 as uuid_v4 } from 'uuid';
import crypto from 'crypto';
import { EnvMode } from './enums/env-mode.enum';

export function generateUUID(): string {
    return uuid_v4();
}

export function mapKeyToHash(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex');
}

export function getTimestampUTC(timestamp?: Date): string {
    return timestamp ? new Date(timestamp).toISOString() : new Date().toISOString();
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

export function isIRepoError(obj: any): boolean {
    // Check if obj is an array instead (result with multiple data like from findAll) or null.
    if(!obj || obj.length) {
        return false;
    }
    const properties = Object.getOwnPropertyNames(obj);
    return properties.includes('method') && properties.includes('error');
}

export function logRepoError(logMsg: string, err: any) {
    // TODO(yqni13): logging
    if(secrets.ENV_MODE.trim() === EnvMode.DEV || secrets.ENV_MODE.trim() === EnvMode.TEST) {
        console.log(logMsg, err);
    }
}
