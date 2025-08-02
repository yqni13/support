const { InvalidSourceException } = require('./exceptions/common.exception');
const MailSource = require('./enums/mail-source.enum');

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

exports.getSourceID = (source) => {
    switch(source) {
        case(MailSource.ARTDV): {
            return 'ARTDV';
        }
        case(MailSource.TAVA): {
            return 'TAVA';
        }
        default:
            throw new InvalidSourceException();
    }
}