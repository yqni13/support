import { Application, NextFunction, Request, Response } from "express";
import { errorMiddleware } from '../middleware/error.middleware';

export class MiddlewareLoader {
    static init(app: Application) {
        /**
         * Express.js v5.x has change on internal regex
         * Wildcard via '*' is invalid and needs /*splat or /{*splat} for root paths
         * https://expressjs.com/en/guide/migrating-5/#path-syntax
         */        
        app.all('/*splat', (req: Request, res: Response, next: NextFunction) => {
            res.send('SERVER: YQNI13_SUPPORT.\nSTATUS: ACTIVE.');
        });

        app.use(errorMiddleware);
    }
}