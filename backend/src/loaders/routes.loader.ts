import { Application } from 'express';
import mailingRouter from '../routes/mailing.route';
import metaRouter from '../routes/meta.route';

export class RoutesLoader {
    static initRoutes(app: Application, version: string) {
        app.use(`/api/${version}/mailing`, mailingRouter); 
        app.use(`/api/${version}/meta`, metaRouter);
    }
}