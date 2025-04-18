const { InvalidSourceException } = require('./exceptions/common.exception');

exports.basicResponse = (body, success, message) => {
    return {
        headers: { success, message },
        body: body
    }
}

exports.selectPrivateKey = (source) => {
    switch(source) {
        case(MailSource.ARTDV): {
            return Secrets.PRIVATE_KEY_ARTDV;
        }
        case(MailSource.TAVA): {
            return Secrets.PRIVATE_KEY_TAVA;
        }
        default:
            throw new InvalidSourceException();
    }
}