import { MaintenanceMode } from '../enums/maintenance-mode.enum';
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

export class MaintenanceException extends CommonException {
    constructor(message: MaintenanceMode, data?: any) {
        super(`support-maintenance-${message}`, data, ErrorStatusCodes.MaintenanceException);
    }
}