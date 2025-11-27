import { NextFunction, Request, Response } from "express";
import { secrets } from '../utils/secrets.utils';
import { InternalServerException } from '../utils/exceptions/common.exception';
import { EnvMode } from "../utils/enums/env-mode.enum";

export function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
    if((err.status === 500 || !err.message) && !err.isOperational) {
        err = new InternalServerException('Internal Server Error');
    }

    const errDataMessage = err.data?.message ? err.data?.message : undefined;
    let { message, error, status, data, stack } = err;
    data = !data.message ? data?.data : { message: errDataMessage, ...err.data };

    if(secrets.ENV_MODE.trim() === EnvMode.DEV) {
        console.log("----------------------------------------------------------")
        console.log(`[Exception]... ${error}`);
        console.log(`[StatusCode].. ${status}`);
        if(data?.message) { console.log(`[ErrorInfo]... ${data?.message}`); }
        console.log(`[Stack]....... ${stack}`);
    }

    const headers = {
        success: "0",
        error,
        status,
        message,
        data
    };

    res.status(status).send({ headers, body: {}});
}