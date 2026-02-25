import { ErrorStatusCodes } from '../errorStatusCodes.utils';

export class AuthException extends Error {

    public error: string;
    public status: number;
    public data?: any;
    public isOperational: boolean;

    constructor(
        message: string,
        data?: any,
        status: number = 401
    ) {
        super(message);
        this.message = message;
        this.name = 'Auth Error';
        this.error = this.constructor.name;
        this.status = status;
        this.data = data;
        this.isOperational = true;
    }
}

export class MissingApiKeyException extends AuthException {
    constructor(message: string = 'support-missing-apikey', data?: any) {
        super(message, data);
    }
}

export class InvalidApiKeyException extends AuthException { // Access key is invalid
    constructor(message: string = 'support-invalid-apikey', data?: any) {
        super(message, data);
    }
}

export class ForbiddenApiKeyException extends AuthException { // Access key disabled/expired
    constructor(message: string, data?: any) {
        super(message, data, ErrorStatusCodes.ForbiddenApiKeyException);
    }
}

export class MalformedApiKeyException extends AuthException {
    constructor(message: string = 'support-malformed-apikey', data?: any) {
        super(message, data);
    }
}

export class AuthSecretNotFoundException extends AuthException {
    constructor(message: string, data?: any) {
        super(message, data, ErrorStatusCodes.AuthSecretNotFoundException);
    }
}

export class InvalidUsersException extends AuthException {
    constructor(data?: any) {
        super('support-invalid-users', data);
    }
}

export class BlockedUsersException extends AuthException {
    constructor(data?: any) {
        super('support-blocked-users', data);
    }
}

export class PermissionException extends AuthException {
    constructor(message: string, data?: any) {
        super(message, data, ErrorStatusCodes.PermissionException);
    }
}