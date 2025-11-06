import { Config } from'../configs/config';
import { AuthSecretNotFoundException } from'./exceptions/auth.exception';
import fs from "fs";

class Secrets {
    readonly ADMIN_API: string;
    readonly ENV_MODE: string;
    readonly PORT: number;
    readonly EMAIL_RECEIVER: string;
    readonly EMAIL_SENDER: string;
    readonly EMAIL_PASS: string;
    readonly PRIVATE_KEY_ARTDV: string;
    readonly PRIVATE_KEY_TAVA: string;
    readonly BETTERSTACK_LOGGING_KEY: string;
    readonly BETTERSTACK_HOST: string;
    readonly DB_USER: string;
    readonly DB_PASS: string;
    readonly DB_HOST: string;
    readonly DB_PORT: string;
    readonly DB_DATABASE: string;
    readonly DB_TEST_USER: string;
    readonly DB_TEST_PASS: string;
    readonly DB_TEST_HOST: string;
    readonly DB_TEST_PORT: string;
    readonly DB_TEST_DATABASE: string;

    private static _instance: Secrets;

    private constructor() {
        this.ADMIN_API = this.setAdminApi();
        this.ENV_MODE = this.setEnvMode();
        this.PORT = this.setPort();
        this.EMAIL_RECEIVER = this.setEmailReceiver();
        this.EMAIL_SENDER = this.setEmailSender();
        this.EMAIL_PASS = this.setEmailPass();
        this.PRIVATE_KEY_ARTDV = this.setPrivateKey_ARTDV();
        this.PRIVATE_KEY_TAVA = this.setPrivateKey_TAVA();
        this.BETTERSTACK_LOGGING_KEY = this.setBetterStackLoggingKey();
        this.BETTERSTACK_HOST = this.setBetterStackHost();
        this.DB_USER = this.setDbUser();
        this.DB_PASS = this.setDbPass();
        this.DB_HOST = this.setDbHost();
        this.DB_PORT = this.setDbPort();
        this.DB_DATABASE = this.setDbDatabase();
        this.DB_TEST_USER = this.setDbTestUser();
        this.DB_TEST_PASS = this.setDbTestPass();
        this.DB_TEST_HOST = this.setDbTestHost();
        this.DB_TEST_PORT = this.setDbTestPort();
        this.DB_TEST_DATABASE = this.setDbTestDatabase();
    }

    static get instance(): Secrets {
        if(!Secrets._instance) {
            Secrets._instance = new Secrets();
        }
        return Secrets._instance;
    }

    private setAdminApi() {
        if(!Config.ADMIN_API) {
            throw new AuthSecretNotFoundException('secret-404-env#ADMIN_API');
        }
        return Config.ADMIN_API;
    }

    private setEnvMode() {
        if(!Config.ENV_MODE) {
            throw new AuthSecretNotFoundException('secret-404-env#ENV_MODE');
        }
        return Config.ENV_MODE;
    }

    private setPort() {
        if(!Config.PORT) {
            throw new AuthSecretNotFoundException('secret-404-env#PORT');
        }
        return Config.PORT;
    }

    private setEmailReceiver() {
        if(!Config.EMAIL_RECEIVER) {
            throw new AuthSecretNotFoundException('secret-404-env#EMAIL_RECEIVER');
        }
        return Config.EMAIL_RECEIVER;
    }

    private setEmailSender() {
        if(!Config.EMAIL_SENDER) {
            throw new AuthSecretNotFoundException('secret-404-env#EMAIL_SENDER');
        }
        return Config.EMAIL_SENDER;
    }

    private setEmailPass() {
        if(!Config.EMAIL_PASS) {
            throw new AuthSecretNotFoundException('secret-404-env#EMAIL_PASS');
        }
        return Config.EMAIL_PASS;
    }

    private setPrivateKey_ARTDV = () => {
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

    private setPrivateKey_TAVA = () => {
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

    private setBetterStackLoggingKey = () => {
        if(!Config.BETTERSTACK_LOGGING_KEY) {
            throw new AuthSecretNotFoundException('secret-404-env#BETTERSTACK_LOGGING_KEY');
        }
        return Config.BETTERSTACK_LOGGING_KEY;
    }

    private setBetterStackHost = () => {
        if(!Config.BETTERSTACK_HOST) {
            throw new AuthSecretNotFoundException('secret-404-env#BETTERSTACK_HOST');
        }
        return Config.BETTERSTACK_HOST;
    }

    private setDbUser() {
        if(!Config.DB_USER) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_USER');
        }
        return Config.DB_USER;
    }

    private setDbPass() {
        if(!Config.DB_PASS) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_PASS');
        }
        return Config.DB_PASS;
    }

    private setDbHost() {
        if(!Config.DB_HOST) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_HOST');
        }
        return Config.DB_HOST;
    }

    private setDbPort() {
        if(!Config.DB_PORT) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_PORT');
        }
        return Config.DB_PORT;
    }

    private setDbDatabase() {
        if(!Config.DB_DATABASE) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_DATABASE');
        }
        return Config.DB_DATABASE;
    }

    private setDbTestUser() {
        if(!Config.DB_TEST_USER) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_TEST_USER');
        }
        return Config.DB_TEST_USER;
    }

    private setDbTestPass() {
        if(!Config.DB_TEST_PASS) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_TEST_PASS');
        }
        return Config.DB_TEST_PASS;
    }

    private setDbTestHost() {
        if(!Config.DB_TEST_HOST) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_TEST_HOST');
        }
        return Config.DB_TEST_HOST;
    }

    private setDbTestPort() {
        if(!Config.DB_TEST_PORT) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_TEST_PORT');
        }
        return Config.DB_TEST_PORT;
    }

    private setDbTestDatabase() {
        if(!Config.DB_TEST_DATABASE) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_TEST_DATABASE');
        }
        return Config.DB_TEST_DATABASE;
    }
}

export const secrets = Secrets.instance;