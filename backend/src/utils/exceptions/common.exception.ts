import { ErrorStatusCodes } from '../errorStatusCodes.utils';

export class CommonException extends Error {

    public error: string;
    public status: number;
    public data?: any;
    public isOperational: boolean;

    constructor(
        message: string,
        data?: any,
        status = 500
    ) {
        super(message);
        this.message = message;
        this.name = 'Common Error';
        this.error = this.constructor.name;
        this.status = status;
        this.data = data;
        this.isOperational = true;
    }
}

export class InternalServerException extends CommonException {
    constructor(message: string = 'support-internal-error', data?: any) {
        super(message, data);
    }
}

export class RequestExceedMaxException extends CommonException {
    // TODO(yqni13): remove? (SUPPORT-6) as user should not get emails from us, this exception should never reach them
    constructor(message: string = 'support-max-email', data?: any) {
        super(message, data);
    }
}

export class InvalidSourceException extends CommonException {
    // TODO(yqni13): remove? (SUPPORT-6) in combination with no usage for additional encryption?
    constructor(message: string = 'support-invalid-source', data?: any) {
        super(message, data);
    }
}

export class MaintenanceException extends CommonException {
    constructor(message: string, data?: any) {
        super(`support-maintenance-${message}`, data, ErrorStatusCodes.MaintenanceException);
    }
}