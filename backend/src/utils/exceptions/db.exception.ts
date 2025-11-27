import { ErrorCodes } from "../errorCodes.utils";
import { ErrorStatusCodes } from "../errorStatusCodes.utils";

export class DBException extends Error {

    public code: number | string;
    public error: string;
    public status: number;
    public data?: unknown;
    public isOperational: boolean;

    constructor(
        code: number | string,
        message: string,
        data?: unknown,
        status: number = 500
    ) {
        super(message);
        this.message = message;
        this.name = 'Database Error';
        this.code = code;
        this.error = this.constructor.name;
        this.status = status;
        this.data = data;
        this.isOperational = true;
    }
}

export class DBConnectionException extends DBException {
    constructor(message: string = 'support-dbconnection-error', data?: unknown) {
        super(ErrorCodes.DBConnectionException, message, data, ErrorStatusCodes.DBConnectionException);
    }
}

export class DBEmptyException extends DBException {
    constructor(data?: unknown) {
        super(ErrorCodes.DBEmptyException, 'support-dbempty-error', data, ErrorStatusCodes.DBEmptyException);
    }
}

export class DBQueryErrorException extends DBException {
    constructor(data?: unknown) {
        super(ErrorCodes.DBQueryErrorException, 'support-dbquery-error', data);
    }
}