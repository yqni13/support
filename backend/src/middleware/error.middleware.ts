import { NextFunction, Request, Response } from "express";
import { secrets } from '../utils/secrets.utils';
import { InternalServerException } from '../utils/exceptions/common.exception';

export function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
    if((err.status === 500 || !err.message) && !err.isOperational) {
        err = new InternalServerException('Internal Server Error');
    }

    let { message, code, error, status, data, stack } = err;

    if(secrets.MODE === 'development') {
        console.log(`[Exception] ${error}, [Code] ${code}`);
        console.log(`[Error] ${message}`);
        console.log(`[Stack] ${stack}`);
    }

    const headers = {
        success: "0",
        error,
        code,
        message,
        ...(data) && data
    };

    res.status(status).send({ headers, body: {}});
}