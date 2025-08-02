const { ErrorCodes } = require('../../utils/errorCodes.utils');
const { ErrorStatusCodes } = require('../../utils/errorStatusCodes.utils');

class CommonException extends Error {
    constructor(code, message, data, status = 500) {
        super(message);
        this.message = message;
        this.name = 'Common Error';
        this.code = code;
        this.error = this.constructor.name;
        this.status = status;
        this.data = data;
    }
}

class InternalServerException extends CommonException {
    constructor(message, data) {
        super(ErrorCodes.InternalServerException, message, data);
    }
}

class RequestExceedMaxException extends CommonException {
    constructor(message = 'server-max-email', data) {
        super(ErrorCodes.RequestExceedMaxException, message, data);
    }
}

class InvalidSourceException extends CommonException {
    constructor(message = 'server-invalid-source', data) {
        super(ErrorCodes.InvalidSourceException, message, data);
    }
}

class UnexpectedException extends CommonException {
    constructor(message, data) {
        super(ErrorCodes.UnexpectedException, message, data, ErrorStatusCodes.UnexpectedException);
    }
}

module.exports = {
    InternalServerException,
    RequestExceedMaxException,
    InvalidSourceException,
    UnexpectedException,
};