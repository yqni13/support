const { ErrorCodes } = require('../errorCodes.utils');
const { ErrorStatusCodes } = require('../errorStatusCodes.utils');

class AuthException extends Error {
    constructor(code, message, data, status = 401) {
        super(message);
        this.message = message;
        this.name = 'Auth Error';
        this.code = code;
        this.error = this.constructor.name;
        this.status = status;
        this.data = data;
    }
}

class AuthenticationStandardException extends CommonException {
    constructor(message, data) {
        super(ErrorCodes.AuthenticationStandardException, message, data);
    }
}

class AuthenticationEmailException extends CommonException {
    constructor(message, data) {
        super(ErrorCodes.AuthenticationEmailException, message, data, ErrorStatusCodes.AuthenticationException);
    }
}

class JWTExpirationException extends AuthException {
    constructor (message = 'auth-jwt-expiration', data){
        super(ErrorCodes.JWTExpirationException, message, data);
    }
}

class TokenMissingException extends AuthException {
    constructor (message = 'auth-jwt-missing', data){
        super(ErrorCodes.TokenMissingException, message, data);
    }
}

class InvalidCredentialsException extends AuthException {
    constructor (message, data){
        super(ErrorCodes.InvalidCredentialsException, message, data);
    }
}

class InvalidTokenException extends ApiException {
    constructor(message, data) {
        super(ErrorCodes.InvalidTokenException, message, data);
    }
}

class AuthSecretNotFoundException extends AuthException {
    constructor (message, data) {
        super(ErrorCodes.AuthSecretNotFoundException, message, data, ErrorStatusCodes.AuthSecretNotFoundException);
    }
}

module.exports = {
    AuthenticationStandardException,
    AuthenticationEmailException,
    JWTExpirationException,
    TokenMissingException,
    InvalidCredentialsException,
    InvalidTokenException,
    AuthSecretNotFoundException
}