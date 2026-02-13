import { ErrorStatusCodes } from '../../utils/errorStatusCodes.utils';

export class ApiException extends Error {

    public error: string;
    public status: number;
    public data?: any;
    public retryAfter?: string;
    public isOperational: boolean;

    constructor(
        message: string,
        retryAfter?: string,
        data?: any,
        status: number = 404
    ) {
        super(message);
        this.message = message;
        this.retryAfter = retryAfter,
        this.name = 'API Error';
        this.error = this.constructor.name;
        this.status = status;
        this.data = data;
        this.isOperational = true;
    }
}

export class UnexpectedApiResponseException extends ApiException {
    constructor(data?: any) {
        super('support-invalid-api', data, ErrorStatusCodes.UnexpectedApiResponseException)
    }
}

export class InvalidEndpointException extends ApiException {
    constructor(message: string, data?: any) {
        super(message, data);
    }
}

export class UnimplementedException extends ApiException {
    constructor(data?: any) {
        super('support-unimplemented', data, ErrorStatusCodes.UnimplementedException);
    }
}

export class ExceedMaxEndpointException extends ApiException {
    constructor(message: string, retryAfter: string, data?: any) {
        super(message, retryAfter, data, ErrorStatusCodes.ExceedMaxEndpointException);
    }
}