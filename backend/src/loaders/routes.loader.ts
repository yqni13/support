import { Application } from 'express';
import mailingRouter from '../routes/mailing.route';

export class RoutesLoader {
    static initRoutes(app: Application, version: string) {
        app.use(`/api/${version}/mailing`, mailingRouter);
    }
}