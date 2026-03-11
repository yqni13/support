import { ErrorStatusCodes } from "../errorStatusCodes.utils";

export class DBException extends Error {

    public error: string;
    public status: number;
    public data?: any;
    public isOperational: boolean;

    constructor(
        message: string,
        data?: any,
        status: number = 500
    ) {
        super(message);
        this.message = message;
        this.name = 'Database Error';
        this.error = this.constructor.name;
        this.status = status;
        this.data = data;
        this.isOperational = true;
    }
}

export class DBConnectionException extends DBException {
    constructor(message: string = 'support-dbconnection-error', data?: any) {
        super(message, data, ErrorStatusCodes.DBConnectionException);
    }
}

export class DBEmptyException extends DBException {
    constructor(data?: any) {
        super('support-dbempty-error', data, ErrorStatusCodes.DBEmptyException);
    }
}

export class DBQueryErrorException extends DBException {
    constructor(data?: any) {
        super('support-dbquery-error', data);
    }
}

export class DBConstraintErrorException extends DBException {
    constructor(message: string, data?: any) {
        super(message, data);
    }
}