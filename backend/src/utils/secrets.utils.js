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
    DB_LOCAL_USER = '';
    DB_LOCAL_PASS = '';
    DB_LOCAL_HOST = '';
    DB_LOCAL_PORT = '';
    DB_LOCAL_DB = '';
    DB_DOCKER_USER = '';
    DB_DOCKER_PASS = '';
    DB_DOCKER_HOST = '';
    DB_DOCKER_PORT = '';
    DB_DOCKER_DB = '';

    constructor() {
        this.MODE = this._setMode();
        this.EMAIL_RECEIVER = this._setEmailReceiver();
        this.EMAIL_SENDER = this._setEmailSender();
        this.EMAIL_PASS = this._setEmailPass();
        this.PRIVATE_KEY_ARTDV = this._setPrivateKey_ARTDV();
        this.PRIVATE_KEY_TAVA = this._setPrivateKey_TAVA();
        this.BETTERSTACK_LOGGING_KEY = this._setBetterStackLoggingKey();
        this.BETTERSTACK_HOST = this._setBetterStackHost();
        this.DB_LOCAL_USER = this._setDbLocalUser();
        this.DB_LOCAL_PASS = this._setDbLocalPass();
        this.DB_LOCAL_HOST = this._setDbLocalHost();
        this.DB_LOCAL_PORT = this._setDbLocalPort();
        this.DB_LOCAL_DB = this._setDbLocalDb();
        this.DB_DOCKER_USER = this._setDbDockerUser();
        this.DB_DOCKER_PASS = this._setDbDockerPass();
        this.DB_DOCKER_HOST = this._setDbDockerHost();
        this.DB_DOCKER_PORT = this._setDbDockerPort();
        this.DB_DOCKER_DB = this._setDbDockerDb();
    }

    _setMode() {
        if(!Config.MODE) {
            throw new AuthSecretNotFoundException('secret-404-env#MODE')
        }
        return Config.MODE;
    }

    _setEmailReceiver() {
        if(!Config.EMAIL_RECEIVER) {
            throw new AuthSecretNotFoundException('secret-404-env#EMAIL_RECEIVER')
        }
        return Config.EMAIL_RECEIVER;
    }

    _setEmailSender() {
        if(!Config.EMAIL_SENDER) {
            throw new AuthSecretNotFoundException('secret-404-env#EMAIL_SENDER')
        }
        return Config.EMAIL_SENDER;
    }

    _setEmailPass() {
        if(!Config.EMAIL_PASS) {
            throw new AuthSecretNotFoundException('secret-404-env#EMAIL_PASS')
        }
        return Config.EMAIL_PASS;
    }

    _setPrivateKey_ARTDV = () => {
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

    _setPrivateKey_TAVA = () => {
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

    _setBetterStackLoggingKey = () => {
        if(!Config.BETTERSTACK_LOGGING_KEY) {
            throw new AuthSecretNotFoundException('secret-404-env#BETTERSTACK_LOGGING_KEY');
        }
        return Config.BETTERSTACK_LOGGING_KEY;
    }

    _setBetterStackHost = () => {
        if(!Config.BETTERSTACK_HOST) {
            throw new AuthSecretNotFoundException('secret-404-env#BETTERSTACK_HOST');
        }
        return Config.BETTERSTACK_HOST;
    }

    _setDbLocalUser() {
        if(!Config.DB_LOCAL_USER) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_LOCAL_USER');
        }
        return Config.DB_LOCAL_USER
    }

    _setDbLocalPass() {
        if(!Config.DB_LOCAL_PASS) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_LOCAL_PASS');
        }
        return Config.DB_LOCAL_PASS
    }

    _setDbLocalHost() {
        if(!Config.DB_LOCAL_HOST) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_LOCAL_HOST');
        }
        return Config.DB_LOCAL_HOST
    }

    _setDbLocalPort() {
        if(!Config.DB_LOCAL_PORT) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_LOCAL_PORT');
        }
        return Config.DB_LOCAL_PORT
    }

    _setDbLocalDb() {
        if(!Config.DB_LOCAL_DB) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_LOCAL_DB');
        }
        return Config.DB_LOCAL_DB
    }

    _setDbDockerUser() {
        if(!Config.DB_DOCKER_USER) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_DOCKER_USER');
        }
        return Config.DB_DOCKER_USER
    }

    _setDbDockerPass() {
        if(!Config.DB_DOCKER_PASS) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_DOCKER_PASS');
        }
        return Config.DB_DOCKER_PASS
    }

    _setDbDockerHost() {
        if(!Config.DB_DOCKER_HOST) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_DOCKER_HOST');
        }
        return Config.DB_DOCKER_HOST
    }

    _setDbDockerPort() {
        if(!Config.DB_DOCKER_PORT) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_DOCKER_PORT');
        }
        return Config.DB_DOCKER_PORT
    }

    _setDbDockerDb() {
        if(!Config.DB_DOCKER_DB) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_DOCKER_DB');
        }
        return Config.DB_DOCKER_DB
    }
}

module.exports = new Secrets();