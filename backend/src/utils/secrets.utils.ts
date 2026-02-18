import { Config } from'../configs/config';
import { AuthSecretNotFoundException } from'./exceptions/auth.exception';
import path from 'path';
import fs from "fs";

class Secrets {
    readonly APP_VERSION: string;
    readonly APP_META: Record<string, string>;
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
    readonly TEST_APIKEY_RAW: string;
    readonly TEST_APIKEY_HASH: string;
    readonly RATELIMITS_CLIENTSBURSTLIMIT: number;
    readonly RATELIMITS_CLIENTSDAILYLIMIT: number;
    readonly RATELIMITS_USERSBURSTLIMIT: number;
    readonly RATELIMITS_USERSDAILYLIMIT: number;
    readonly RATELIMITS_TOTALDAILYLIMIT: number;
    readonly DEMOLIMITS_TOTALDAILYLIMIT: number;
    readonly CLOUD_BUCKET: string;
    readonly CLOUD_ENDPOINT: string;
    readonly CLOUD_ACCESS_KEY_ID: string;
    readonly CLOUD_SECRET_KEY: string;

    private static _instance: Secrets;

    private constructor() {
        this.APP_VERSION = this.getAppVersion();
        this.APP_META = this.getAppMeta();
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
        this.TEST_APIKEY_RAW = this.setTestApiKeyRaw();
        this.TEST_APIKEY_HASH = this.setTestApiKeyHash();
        this.RATELIMITS_CLIENTSBURSTLIMIT = this.setRateLimitsClientsBurstLimit();
        this.RATELIMITS_CLIENTSDAILYLIMIT = this.setRateLimitsClientsDailyLimit();
        this.RATELIMITS_USERSBURSTLIMIT = this.setRateLimitsUsersBurstLimit();
        this.RATELIMITS_USERSDAILYLIMIT = this.setRateLimitsUsersDailyLimit();
        this.RATELIMITS_TOTALDAILYLIMIT = this.setRateLimitsTotalDailyLimit();
        this.DEMOLIMITS_TOTALDAILYLIMIT = this.setDemoLimitsTotalDailyLimit();
        this.CLOUD_BUCKET = this.setCloudBucket();
        this.CLOUD_ENDPOINT = this.setCloudEndpoint();
        this.CLOUD_ACCESS_KEY_ID = this.setCloudAccessKeyId();
        this.CLOUD_SECRET_KEY = this.setCloudSecretKey();
    }

    static get instance(): Secrets {
        if(!Secrets._instance) {
            Secrets._instance = new Secrets();
        }
        return Secrets._instance;
    }

    private getAppVersion() {
        const packageJsonPath = path.resolve(process.cwd(), 'package.json');
        let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        return !packageJson ? '0.0.0' : packageJson.version;
    }

    private getAppMeta() {
        const packageJsonPath = path.resolve(process.cwd(), 'package.json');
        let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        return !packageJson ? null : packageJson.appMeta;
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

    private setTestApiKeyRaw() {
        if(!Config.TEST_APIKEY_RAW) {
            throw new AuthSecretNotFoundException('secret-404-env#TEST_APIKEY_RAW');
        }
        return Config.TEST_APIKEY_RAW;
    }

    private setTestApiKeyHash() {
        if(!Config.TEST_APIKEY_HASH) {
            throw new AuthSecretNotFoundException('secret-404-env#TEST_APIKEY_HASH');
        }
        return Config.TEST_APIKEY_HASH;
    }

    private setRateLimitsClientsBurstLimit() {
        if(!Config.RATELIMITS_CLIENTSBURSTLIMIT) {
            throw new AuthSecretNotFoundException('secret-404-env#RATELIMITS_CLIENTSBURSTLIMIT');
        }
        return Config.RATELIMITS_CLIENTSBURSTLIMIT;
    }

    private setRateLimitsClientsDailyLimit() {
        if(!Config.RATELIMITS_CLIENTSDAILYLIMIT) {
            throw new AuthSecretNotFoundException('secret-404-env#RATELIMITS_CLIENTSDAILYLIMIT');
        }
        return Config.RATELIMITS_CLIENTSDAILYLIMIT;
    }

    private setRateLimitsUsersBurstLimit() {
        if(!Config.RATELIMITS_USERSBURSTLIMIT) {
            throw new AuthSecretNotFoundException('secret-404-env#RATELIMITS_USERSBURSTLIMIT');
        }
        return Config.RATELIMITS_USERSBURSTLIMIT;
    }

    private setRateLimitsUsersDailyLimit() {
        if(!Config.RATELIMITS_USERSDAILYLIMIT) {
            throw new AuthSecretNotFoundException('secret-404-env#RATELIMITS_USERSDAILYLIMIT');
        }
        return Config.RATELIMITS_USERSDAILYLIMIT;
    }

    private setRateLimitsTotalDailyLimit() {
        if(!Config.RATELIMITS_TOTALDAILYLIMIT) {
            throw new AuthSecretNotFoundException('secret-404-env#RATELIMITS_TOTALDAILYLIMIT');
        }
        return Config.RATELIMITS_TOTALDAILYLIMIT;
    }

    private setDemoLimitsTotalDailyLimit() {
        if(!Config.DEMOLIMITS_TOTALDAILYLIMIT) {
            throw new AuthSecretNotFoundException('secret-404-env#DEMOLIMITS_TOTALDAILYLIMIT');
        }
        return Config.DEMOLIMITS_TOTALDAILYLIMIT;
    }

    private setCloudBucket() {
        if(!Config.CLOUD_BUCKET) {
            throw new AuthSecretNotFoundException('secret-404-env#CLOUD_BUCKET');
        }
        return Config.CLOUD_BUCKET;
    }

    private setCloudEndpoint() {
        if(!Config.CLOUD_ENDPOINT) {
            throw new AuthSecretNotFoundException('secret-404-env#CLOUD_ENDPOINT');
        }
        return Config.CLOUD_ENDPOINT;
    }

    private setCloudAccessKeyId() {
        if(!Config.CLOUD_ACCESS_KEY_ID) {
            throw new AuthSecretNotFoundException('secret-404-env#CLOUD_ACCESS_KEY_ID');
        }
        return Config.CLOUD_ACCESS_KEY_ID;
    }

    private setCloudSecretKey() {
        if(!Config.CLOUD_SECRET_KEY) {
            throw new AuthSecretNotFoundException('secret-404-env#CLOUD_SECRET_KEY');
        }
        return Config.CLOUD_SECRET_KEY;
    }
}

export const secrets = Secrets.instance;