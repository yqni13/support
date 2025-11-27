export class ValidationException extends Error {

    public error: string;
    public status: number;
    public data?: unknown;
    public isOperational: boolean;

    constructor(
        message: string,
        data?: any,
        status: number = 400
    ) {
        super(message);
        this.message = message;
        this.name = 'Validation Error';
        this.error = this.constructor.name;
        this.status = status;
        this.data = data;
        this.isOperational = true;
    }
}

export class InvalidPropertiesException extends ValidationException {
    constructor(message: string, data?: any) {
        super(message, data);
    }
}