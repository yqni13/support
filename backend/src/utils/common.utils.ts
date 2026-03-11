import { InvalidSourceException } from './exceptions/common.exception';
import { MailSource } from './enums/mail-source.enum';
import { secrets } from './secrets.utils';
import { v4 as uuid_v4 } from 'uuid';
import crypto from 'crypto';
import { Logger } from '../logger/config.logger';

const logger = Logger.getLogger();

/**
 * @description Testable function for current Date object.
 * @returns new Date()
 */
export const now = (): Date => new Date();

export function generateUUID<T extends string>(): T {
    return uuid_v4() as T;
}

export function mapKeyToHash(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex');
}

export function getTimestampUTC(timestamp?: Date): string {
    return timestamp ? timestamp.toISOString() : new Date().toISOString();
}

export function getDateUTC(timestamp?: Date): string {
    const dateObj = timestamp ? timestamp : new Date();
    return dateObj.toISOString().slice(0, 10);
}

export function getNextDayUTC(timestamp?: Date): string {
    const now = timestamp ? timestamp : new Date();
    now.setDate(now.getDate()+1);
    return `${now.toISOString().slice(0, 10)}T00:00:01.000Z`;
}

export function isEmptyObj(obj: any): boolean {
    return JSON.stringify(obj) === '{}';
}

export function logError(message: string, method: string, err: any) {
    logger.error(message, {
        error: err.error,
        code: err.status ? err.status : err.code ? err.code : null,
        stack: err.stack,
        context: {
            method: method,
        }
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

export function getNextRankEnumValue<T extends Record<string, any>>(enumObj: T, value: T[keyof T] | null): T[keyof T] {
    const values = Object.values(enumObj);
    if(value === null) {
        return values[0];
    }

    const index = values.indexOf(value);

    if(index === -1 || index === values.length - 1) {
        return values[values.length - 1];
    }

    return values[index + 1];
}

/**
 * 
 * @returns {string} Returns substring or empty string if endChar is not found in text.
 */
export function getPreCharString(text: string, endChar: string): string {
    return text.substring(0, text.indexOf(endChar));
}

/**
 * 
 * @returns {string} Returns substring or empty string if startChar is not found in text.
 */
export function getPostCharString(text: string, startChar: string): string {
    return text.substring(text.indexOf(startChar)+1);
}