const { Config } = require('../configs/config');
const { AuthSecretNotFoundException } = require('../utils/exceptions/auth.exception');

class Secrets {
    MODE = '';
    EMAIL_RECEIVER = '';
    EMAIL_SENDER = '';
    EMAIL_PASS = '';

    constructor() {
        this.MODE = this.#setMode();
        this.EMAIL_RECEIVER = this.#setEmailReceiver();
        this.EMAIL_SENDER = this.#setEmailSender();
        this.EMAIL_PASS = this.#setEmailPass();
    }

    #setMode() {
        if(!Config.MODE) {
            throw new AuthSecretNotFoundException('secret-404-env#MODE')
        }
        return Config.MODE;
    }

    #setEmailReceiver() {
        if(!Config.EMAIL_RECEIVER) {
            throw new AuthSecretNotFoundException('secret-404-env#EMAIL_RECEIVER')
        }
        return Config.EMAIL_RECEIVER;
    }

    #setEmailSender() {
        if(!Config.EMAIL_SENDER) {
            throw new AuthSecretNotFoundException('secret-404-env#EMAIL_SENDER')
        }
        return Config.EMAIL_SENDER;
    }

    #setEmailPass() {
        if(!Config.EMAIL_PASS) {
            throw new AuthSecretNotFoundException('secret-404-env#EMAIL_PASS')
        }
        return Config.EMAIL_PASS;
    }
}

module.exports = new Secrets();