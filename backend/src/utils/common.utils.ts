import { InvalidSourceException } from './exceptions/common.exception';
import { MailSource } from './enums/mail-source.enum';
import { secrets } from './secrets.utils';
import { NextFunction, Request, Response } from "express";

export type AsyncMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export function isObjEmpty(obj: any): boolean {
    for(let key in obj) {
        if(Object.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
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

export function getSourceID(source: MailSource): string {
    switch(source) {
        case(MailSource.ARTDV): {
            return 'ARTDV';
        }
        case(MailSource.TAVA): {
            return 'TAVA';
        }
        default:
            throw new InvalidSourceException();
    }
}

export function getCustomLocaleTimestamp(): string {
    // TODO(yqni13): currently 2 hours off (03:20 local, 01:20 response)
    // this solution does NOT take care of timezones (neither local nor prod)!
    const time = new Date();
    const date = new Date();
    
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate().toString();
    const month = date.getMonth()+1 < 10 ? `0${date.getMonth()+1}` : (date.getMonth()+1).toString();

    const hours = time.getHours() < 10 ? `0${time.getHours()}` : `${time.getHours()}`;
    const minutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : `${time.getMinutes()}`;
    const seconds = time.getSeconds() < 10 ? `0${time.getSeconds()}` : `${time.getSeconds()}`;
    
    // need prefix-0 on single digits
    return `${date.getFullYear()}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
}