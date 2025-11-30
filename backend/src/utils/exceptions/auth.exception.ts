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

export class AuthenticationStandardException extends AuthException {
    constructor(message: string, data?: any) {
        super(message, data);
    }
}

export class AuthenticationEmailException extends AuthException {
    constructor(message: string, data?: any) {
        super(message, data, ErrorStatusCodes.AuthenticationException);
    }
}

export class JWTExpirationException extends AuthException {
    constructor(message: string = 'auth-jwt-expiration', data?: any){
        super(message, data);
    }
}

export class TokenMissingException extends AuthException {
    constructor(message: string = 'auth-jwt-missing', data?: any){
        super(message, data);
    }
}

export class InvalidCredentialsException extends AuthException {
    constructor(message: string, data?: any){
        super(message, data);
    }
}

export class InvalidTokenException extends AuthException {
    constructor(message: string, data?: any) {
        super(message, data);
    }
}

export class MissingApiKeyException extends AuthException {
    constructor(message: string = 'support-missing-apikey', data?: any) {
        super(message, data);
    }
}

export class InvalidApiKeyException extends AuthException {
    constructor(message: string = 'support-invalid-apikey', data?: any) {
        super(message, data, ErrorStatusCodes.InvalidApiKeyException);
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