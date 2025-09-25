import { Application, NextFunction, Request, Response } from "express";
import { errorMiddleware } from '../middleware/error.middleware';

export class MiddlewareLoader {
    static init(app: Application) {
        app.all('*', (req: Request, res: Response, next: NextFunction) => {
            res.send('SERVER: YQNI13_SUPPORT.\nSTATUS: ACTIVE.');
        });

        app.use(errorMiddleware);
    }
}