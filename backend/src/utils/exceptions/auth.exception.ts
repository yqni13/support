import { ErrorCodes } from '../errorCodes.utils';
import { ErrorStatusCodes } from '../errorStatusCodes.utils';

export class AuthException extends Error {

    public code: number | string;
    public error: string;
    public status: number;
    public data?: unknown;

    constructor(
        code: number | string,
        message: string,
        data?: unknown,
        status: number = 401
    ) {
        super(message);
        this.message = message;
        this.name = 'Auth Error';
        this.code = code;
        this.error = this.constructor.name;
        this.status = status;
        this.data = data;
    }
}

export class AuthenticationStandardException extends AuthException {
    constructor(message: string, data?: unknown) {
        super(ErrorCodes.AuthenticationStandardException, message, data);
    }
}

export class AuthenticationEmailException extends AuthException {
    constructor(message: string, data?: unknown) {
        super(ErrorCodes.AuthenticationEmailException, message, data, ErrorStatusCodes.AuthenticationException);
    }
}

export class JWTExpirationException extends AuthException {
    constructor(message: string = 'auth-jwt-expiration', data?: unknown){
        super(ErrorCodes.JWTExpirationException, message, data);
    }
}

export class TokenMissingException extends AuthException {
    constructor(message: string = 'auth-jwt-missing', data?: unknown){
        super(ErrorCodes.TokenMissingException, message, data);
    }
}

export class InvalidCredentialsException extends AuthException {
    constructor(message: string, data?: unknown){
        super(ErrorCodes.InvalidCredentialsException, message, data);
    }
}

export class InvalidTokenException extends AuthException {
    constructor(message: string, data?: unknown) {
        super(ErrorCodes.InvalidTokenException, message, data);
    }
}

export class MissingApiKeyException extends AuthException {
    constructor(message: string = 'support-missing-apikey', data?: unknown) {
        super(ErrorCodes.MissingApiKeyException, message, data)
    }
}

export class InvalidApiKeyException extends AuthException {
    constructor(message: string = 'support-invalid-apikey', data?: unknown) {
        super(ErrorCodes.InvalidApiKeyException, message, data, ErrorStatusCodes.InvalidApiKeyException)
    }
}

export class MalformedApiKeyException extends AuthException {
    constructor(message: string = 'support-malformed-apikey', data?: unknown) {
        super(ErrorCodes.MalformedApiKeyException, message, data)
    }
}

export class AuthSecretNotFoundException extends AuthException {
    constructor(message: string, data?: unknown) {
        super(ErrorCodes.AuthSecretNotFoundException, message, data, ErrorStatusCodes.AuthSecretNotFoundException);
    }
}