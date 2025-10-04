import { ErrorCodes } from '../../utils/errorCodes.utils';
import { ErrorStatusCodes } from '../errorStatusCodes.utils';

export class CommonException extends Error {

    public code: number | string;
    public error: string;
    public status: number;
    public data?: unknown;

    constructor(
        code: number | string,
        message: string,
        data?: unknown,
        status = 500
    ) {
        super(message);
        this.message = message;
        this.name = 'Common Error';
        this.code = code;
        this.error = this.constructor.name;
        this.status = status;
        this.data = data;
    }
}

export class InternalServerException extends CommonException {
    constructor(message: string, data?: unknown) {
        super(ErrorCodes.InternalServerException, message, data);
    }
}

export class RequestExceedMaxException extends CommonException {
    constructor(message: string = 'server-max-email', data?: unknown) {
        super(ErrorCodes.RequestExceedMaxException, message, data);
    }
}

export class InvalidSourceException extends CommonException {
    constructor(message: string = 'server-invalid-source', data?: unknown) {
        super(ErrorCodes.InvalidSourceException, message, data);
    }
}

export class UnexpectedException extends CommonException {
    constructor(message: string, data?: unknown) {
        super(ErrorCodes.UnexpectedException, message, data, ErrorStatusCodes.UnexpectedException);
    }
}

module.exports = {
    InternalServerException,
    RequestExceedMaxException,
    InvalidSourceException,
    UnexpectedException,
};