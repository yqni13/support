const { ErrorCodes } = require("../errorCodes.utils");
const { ErrorStatusCodes } = require("../errorStatusCodes.utils");

class DBException extends Error {
    constructor(code, message, data, status = 500) {
        super(message);
        this.message = message;
        this.name = 'Database Error';
        this.code = code;
        this.error = this.constructor.name;
        this.status = status;
        this.data = data;
    }
}

class DBConnectionException extends DBException {
    constructor(data) {
        super(ErrorCodes.DBConnectionException, 'Database not connected', data, ErrorStatusCodes.DBConnectionException);
    }
}

class DBEmptyException extends DBException {
    constructor(data) {
        super(ErrorCodes.DBEmptyException, 'Database is empty', data, ErrorStatusCodes.DBEmptyException);
    }
}

module.exports = {
    DBConnectionException,
    DBEmptyException
}