import { Config } from'../configs/config';
import { AuthSecretNotFoundException } from'./exceptions/auth.exception';
import fs from "fs";

class Secrets {
    readonly MODE: string ;
    readonly PORT: number ;
    readonly EMAIL_RECEIVER: string ;
    readonly EMAIL_SENDER: string ;
    readonly EMAIL_PASS: string ;
    readonly PRIVATE_KEY_ARTDV: string ;
    readonly PRIVATE_KEY_TAVA: string ;
    readonly BETTERSTACK_LOGGING_KEY: string ;
    readonly BETTERSTACK_HOST: string ;
    readonly DB_LOCAL_USER: string ;
    readonly DB_LOCAL_PASS: string ;
    readonly DB_LOCAL_HOST: string ;
    readonly DB_LOCAL_PORT: string ;
    readonly DB_LOCAL_DB: string ;
    readonly DB_DOCKER_USER: string ;
    readonly DB_DOCKER_PASS: string ;
    readonly DB_DOCKER_HOST: string ;
    readonly DB_DOCKER_PORT: string ;
    readonly DB_DOCKER_DB: string ;

    private static _instance: Secrets;

    private constructor() {
        this.MODE = this.setMode();
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
        this.DB_DOCKER_USER = this.setDbDockerUser();
        this.DB_DOCKER_PASS = this.setDbDockerPass();
        this.DB_DOCKER_HOST = this.setDbDockerHost();
        this.DB_DOCKER_PORT = this.setDbDockerPort();
        this.DB_DOCKER_DB = this.setDbDockerDb();
    }

    static get instance(): Secrets {
        if(!Secrets._instance) {
            Secrets._instance = new Secrets();
        }
        return Secrets._instance;
    }

    private setMode() {
        if(!Config.MODE) {
            throw new AuthSecretNotFoundException('secret-404-env#MODE');
        }
        return Config.MODE;
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
        return Config.DB_LOCAL_USER
    }

    private setDbLocalPass() {
        if(!Config.DB_LOCAL_PASS) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_LOCAL_PASS');
        }
        return Config.DB_LOCAL_PASS
    }

    private setDbLocalHost() {
        if(!Config.DB_LOCAL_HOST) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_LOCAL_HOST');
        }
        return Config.DB_LOCAL_HOST
    }

    private setDbLocalPort() {
        if(!Config.DB_LOCAL_PORT) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_LOCAL_PORT');
        }
        return Config.DB_LOCAL_PORT
    }

    private setDbLocalDb() {
        if(!Config.DB_LOCAL_DB) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_LOCAL_DB');
        }
        return Config.DB_LOCAL_DB
    }

    private setDbDockerUser() {
        if(!Config.DB_DOCKER_USER) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_DOCKER_USER');
        }
        return Config.DB_DOCKER_USER
    }

    private setDbDockerPass() {
        if(!Config.DB_DOCKER_PASS) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_DOCKER_PASS');
        }
        return Config.DB_DOCKER_PASS
    }

    private setDbDockerHost() {
        if(!Config.DB_DOCKER_HOST) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_DOCKER_HOST');
        }
        return Config.DB_DOCKER_HOST
    }

    private setDbDockerPort() {
        if(!Config.DB_DOCKER_PORT) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_DOCKER_PORT');
        }
        return Config.DB_DOCKER_PORT
    }

    private setDbDockerDb() {
        if(!Config.DB_DOCKER_DB) {
            throw new AuthSecretNotFoundException('secret-404-env#DB_DOCKER_DB');
        }
        return Config.DB_DOCKER_DB
    }
}

export const secrets = Secrets.instance;