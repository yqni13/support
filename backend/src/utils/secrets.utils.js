const { Config } = require('../configs/config');
const { AuthSecretNotFoundException } = require('../utils/exceptions/auth.exception');
const fs = require('fs');

class Secrets {
    MODE = '';
    EMAIL_RECEIVER = '';
    EMAIL_SENDER = '';
    EMAIL_PASS = '';
    PRIVATE_KEY_ARTDV = '';
    PRIVATE_KEY_TAVA = '';
    BETTERSTACK_LOGGING_KEY = '';
    BETTERSTACK_HOST = '';

    constructor() {
        this.MODE = this.#setMode();
        this.EMAIL_RECEIVER = this.#setEmailReceiver();
        this.EMAIL_SENDER = this.#setEmailSender();
        this.EMAIL_PASS = this.#setEmailPass();
        this.PRIVATE_KEY_ARTDV = this.#setPrivateKey_ARTDV();
        this.PRIVATE_KEY_TAVA = this.#setPrivateKey_TAVA();
        this.BETTERSTACK_LOGGING_KEY = this.#setBetterStackLoggingKey();
        this.BETTERSTACK_HOST = this.#setBetterStackHost();
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

    #setPrivateKey_ARTDV = () => {
        let key;
        if(Config.MODE === 'development') {
            key = !Config.PRIVATE_KEY_ARTDV ? null : fs.readFileSync(Config.PRIVATE_KEY_ARTDV, 'utf8');
        } else {
            key = Config.PRIVATE_KEY_ARTDV;
        }
    
        if(!key) {
            throw new AuthSecretNotFoundException('secret-404-env#PRIVATE_KEY_ARTDV');
        }    
        return key;
    }

    #setPrivateKey_TAVA = () => {
        let key;
        if(Config.MODE === 'development') {
            key = !Config.PRIVATE_KEY_TAVA ? null : fs.readFileSync(Config.PRIVATE_KEY_TAVA, 'utf8');
        } else {
            key = Config.PRIVATE_KEY_TAVA;
        }
    
        if(!key) {
            throw new AuthSecretNotFoundException('secret-404-env#PRIVATE_KEY_TAVA');
        }    
        return key;
    }

    #setBetterStackLoggingKey = () => {
        if(!Config.BETTERSTACK_LOGGING_KEY) {
            throw new AuthSecretNotFoundException('secret-404-env#BETTERSTACK_LOGGING_KEY');
        }
        return Config.BETTERSTACK_LOGGING_KEY;
    }

    #setBetterStackHost = () => {
        if(!Config.BETTERSTACK_HOST) {
            throw new AuthSecretNotFoundException('secret-404-env#BETTERSTACK_HOST');
        }
        return Config.BETTERSTACK_HOST;
    }
}

module.exports = new Secrets();