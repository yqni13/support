import { ErrorCodes } from '../../utils/errorCodes.utils';
import { ErrorStatusCodes } from '../../utils/errorStatusCodes.utils';

export class ApiException extends Error {

    public code: number | string;
    public error: string;
    public status: number;
    public data?: unknown;

    constructor(
        code: number | string,
        message: string,
        data?: unknown,
        status: number = 404
    ) {
        super(message);
        this.message = message;
        this.name = 'API Error';
        this.code = code;
        this.error = this.constructor.name;
        this.status = status;
        this.data = data;
    }
}

export class UnexpectedApiResponseException extends ApiException {
    constructor(message: string = 'error-invalid-api', data?: unknown) {
        super(ErrorCodes.UnexpectedApiResponseException, message, data, ErrorStatusCodes.UnexpectedApiResponseException)
    }
}

export class InvalidEndpointException extends ApiException {
    constructor(message: string, data?: unknown) {
        super(ErrorCodes.InvalidEndpointException, message, data);
    }
}

export class UnimplementedException extends ApiException {
    constructor(message: string, data?: unknown) {
        super(ErrorCodes.UnimplementedException, message, data, ErrorStatusCodes.UnimplementedException);
    }
}

export class ExceedMaxEndpointException extends ApiException {
    constructor(message: string, data?: unknown) {
        super(ErrorCodes.ExceedMaxEndpointException, message, data, ErrorStatusCodes.ExceedMaxEndpointException);
    }
}