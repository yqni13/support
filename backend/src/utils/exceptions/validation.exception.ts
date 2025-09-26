import { ErrorCodes } from '../errorCodes.utils';

export class ValidationException extends Error {

    public code: number | string;
    public error: string;
    public status: number;
    public data?: unknown;

    constructor(
        code: number | string,
        message: string,
        data?: unknown,
        status: number = 400
    ) {
        super(message);
        this.message = message;
        this.name = 'Validation Error';
        this.code = code;
        this.error = this.constructor.name;
        this.status = status;
        this.data = data;
    }
}

export class InvalidPropertiesException extends ValidationException {
    constructor(message: string, data?: unknown) {
        super(ErrorCodes.InvalidPropertiesException, message, data);
    }
}