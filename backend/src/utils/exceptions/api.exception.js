const { ErrorCodes } = require('../../utils/errorCodes.utils');
const { ErrorStatusCodes } = require('../../utils/errorStatusCodes.utils');

class ApiException extends Error {
    constructor(code, message, data, status = 404) {
        super(message);
        this.message = message;
        this.name = 'API Error';
        this.code = code;
        this.error = this.constructor.name;
        this.status = status;
        this.data = data;
    }
}

class UnexpectedApiResponseException extends ApiException {
    constructor(message = 'error-invalid-api', data) {
        super(ErrorCodes.UnexpectedApiResponseException, message, data, ErrorStatusCodes.UnexpectedApiResponseException)
    }
}

class InvalidEndpointException extends ApiException {
    constructor(message, data) {
        super(ErrorCodes.InvalidEndpointException, message, data);
    }
}

class UnimplementedException extends ApiException {
    constructor(message, data) {
        super(ErrorCodes.UnimplementedException, message, data, ErrorStatusCodes.UnimplementedException);
    }
}

module.exports = {
    UnexpectedApiResponseException,
    InvalidEndpointException,
    UnimplementedException
};

