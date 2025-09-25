import { InvalidSourceException } from './exceptions/common.exception';
import { MailSource } from './enums/mail-source.enum';
import { secrets } from './secrets.utils';
import { NextFunction, Request, Response } from "express";

export type AsyncMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export function basicResponse(body: unknown, success: number, message: string): any {
    return {
        headers: { success, message },
        body: body
    }
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