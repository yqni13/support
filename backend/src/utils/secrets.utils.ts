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
    readonly DB_LOCAL_USER: string;
    readonly DB_LOCAL_PASS: string;
    readonly DB_LOCAL_HOST: string;
    readonly DB_LOCAL_PORT: string;
    readonly DB_LOCAL_DB: string;
    readonly DB_PROD_USER: string;
    readonly DB_PROD_PASS: string;
    readonly DB_PROD_HOST: string;
    readonly DB_PROD_PORT: string;
    readonly DB_PROD_DB: string;
    readonly DB_TEST_USER: string;
    readonly DB_TEST_PASS: string;
    readonly DB_TEST_HOST: string;
    readonly DB_TEST_PORT: string;
    readonly DB_TEST_DB: string;
    readonly DB_STAG_USER: string;
    readonly DB_STAG_PASS: string;
    readonly DB_STAG_HOST: string;
    readonly DB_STAG_PORT: string;
    readonly DB_STAG_DB: string;

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
        this.DB_LOCAL_USER = this.setDbLocalUser();
        this.DB_LOCAL_PASS = this.setDbLocalPass();
        this.DB_LOCAL_HOST = this.setDbLocalHost();
        this.DB_LOCAL_PORT = this.setDbLocalPort();
        this.DB_LOCAL_DB = this.setDbLocalDb();
        this.DB_PROD_USER = this.setDbProdUser();
        this.DB_PROD_PASS = this.setDbProdPass();
        this.DB_PROD_HOST = this.setDbProdHost();
        this.DB_PROD_PORT = this.setDbProdPort();
        this.DB_PROD_DB = this.setDbProdDb();
        this.DB_TEST_USER = this.setDbTestUser();
        this.DB_TEST_PASS = this.setDbTestPass();
        this.DB_TEST_HOST = this.setDbTestHost();
        this.DB_TEST_PORT = this.setDbTestPort();
        this.DB_TEST_DB = this.setDbTestDb();
        this.DB_STAG_USER = this.setDbStagUser();
        this.DB_STAG_PASS = this.setDbStagPass();
        this.DB_STAG_HOST = this.setDbStagHost();
        this.DB_STAG_PORT = this.setDbStagPort();
        this.DB_STAG_DB = this.setDbStagDb();
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

    private setDbLocalUser() {
        if(!Config.DB_LOCAL_USER) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_LOCAL_USER');
        }
        return Config.DB_LOCAL_USER;
    }

    private setDbLocalPass() {
        if(!Config.DB_LOCAL_PASS) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_LOCAL_PASS');
        }
        return Config.DB_LOCAL_PASS;
    }

    private setDbLocalHost() {
        if(!Config.DB_LOCAL_HOST) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_LOCAL_HOST');
        }
        return Config.DB_LOCAL_HOST;
    }

    private setDbLocalPort() {
        if(!Config.DB_LOCAL_PORT) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_LOCAL_PORT');
        }
        return Config.DB_LOCAL_PORT;
    }

    private setDbLocalDb() {
        if(!Config.DB_LOCAL_DB) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_LOCAL_DB');
        }
        return Config.DB_LOCAL_DB;
    }

    private setDbProdUser() {
        if(!Config.DB_PROD_USER) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_PROD_USER');
        }
        return Config.DB_PROD_USER;
    }

    private setDbProdPass() {
        if(!Config.DB_PROD_PASS) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_PROD_PASS');
        }
        return Config.DB_PROD_PASS;
    }

    private setDbProdHost() {
        if(!Config.DB_PROD_HOST) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_PROD_HOST');
        }
        return Config.DB_PROD_HOST;
    }

    private setDbProdPort() {
        if(!Config.DB_PROD_PORT) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_PROD_PORT');
        }
        return Config.DB_PROD_PORT;
    }

    private setDbProdDb() {
        if(!Config.DB_PROD_DB) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_PROD_DB');
        }
        return Config.DB_PROD_DB;
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

    private setDbTestDb() {
        if(!Config.DB_TEST_DB) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_TEST_DB');
        }
        return Config.DB_TEST_DB;
    }
    // ##############################
    private setDbStagUser() {
        if(!Config.DB_STAG_USER) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_STAG_USER');
        }
        return Config.DB_STAG_USER;
    }

    private setDbStagPass() {
        if(!Config.DB_STAG_PASS) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_STAG_PASS');
        }
        return Config.DB_STAG_PASS;
    }

    private setDbStagHost() {
        if(!Config.DB_STAG_HOST) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_STAG_HOST');
        }
        return Config.DB_STAG_HOST;
    }

    private setDbStagPort() {
        if(!Config.DB_STAG_PORT) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_STAG_PORT');
        }
        return Config.DB_STAG_PORT;
    }

    private setDbStagDb() {
        if(!Config.DB_STAG_DB) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_STAG_DB');
        }
        return Config.DB_STAG_DB;
    }
}

export const secrets = Secrets.instance;