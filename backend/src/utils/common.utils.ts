import { InvalidSourceException } from './exceptions/common.exception';
import { MailSource } from './enums/mail-source.enum';
import { secrets } from './secrets.utils';
import { NextFunction, Request, Response } from "express";
import { v4 as uuid_v4 } from 'uuid';
import crypto from 'crypto';
import { EnvMode } from './enums/env-mode.enum';

export function generateUUID(): string {
    return uuid_v4();
}

export function mapKeyToHash(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex');
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

/**
 * @returns yyyy-mm-ddThh:mm:ss.000
 */
export function getTimestampWithoutOffsetInfo(time: Date): string {
    const day = time.getDate() < 10 ? `0${time.getDate()}` : time.getDate().toString();
    const month = time.getMonth()+1 < 10 ? `0${time.getMonth()+1}` : (time.getMonth()+1).toString();

    const hours = time.getHours() < 10 ? `0${time.getHours()}` : `${time.getHours()}`;
    const minutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : `${time.getMinutes()}`;
    const seconds = time.getSeconds() < 10 ? `0${time.getSeconds()}` : `${time.getSeconds()}`;

    // need prefix-0 on single digits
    return `${time.getFullYear()}-${month}-${day}T${hours}:${minutes}:${seconds}.000`;
}

export function getPropertiesFromTimezoneOffset(time: Date): any {
    let offset: number | string = time.getTimezoneOffset();
    const prefix = offset < 0 ? '+' : '-';
    offset = offset < 0 ? offset * (-1) : offset;
    offset = offset !== 0 ? offset / 60 : offset;
    offset = offset < 10 ? `0${offset}` : `${offset}`;

    return { prefix: prefix, offset: offset };
}

/**
 * @returns yyyy-mm-dd hh:mm:ss+/-hh
 */
export function getTimestampWithOffsetInfo(time: Date): string {
    // Get the GMT offset.
    const gmtData = getPropertiesFromTimezoneOffset(time);

    // Extract date and time data for custom string.
    const day = time.getDate() < 10 ? `0${time.getDate()}` : time.getDate().toString();
    const month = time.getMonth()+1 < 10 ? `0${time.getMonth()+1}` : (time.getMonth()+1).toString();
    const hours = time.getHours() < 10 ? `0${time.getHours()}` : `${time.getHours()}`;
    const minutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : `${time.getMinutes()}`;
    const seconds = time.getSeconds() < 10 ? `0${time.getSeconds()}` : `${time.getSeconds()}`;

    // Need prefix-0 on single digits.
    return `${time.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}${gmtData.prefix}${gmtData.offset}`;
}

export function logRepoError(logMsg: string, err: any) {
    // TODO(yqni13): logging
    if((secrets.ENV_MODE).trim() === EnvMode.DEV || (secrets.ENV_MODE).trim() === EnvMode.TEST) {
        console.log(logMsg, err);
    }
}
