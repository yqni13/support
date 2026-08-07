import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";

export class ExpressLoader {
    static init() {
        const app: Application = express();

        app.use(bodyParser.json());
        app.use(cors());

        return app;
    }
}