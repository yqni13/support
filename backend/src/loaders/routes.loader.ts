import { Application } from 'express';
import clientsRouter from '../routes/clients.route';
import mailingRouter from '../routes/mailing.route';
import metaRouter from '../routes/meta.route';
import ticketsRouter from '../routes/tickets.route'; 
import usersRouter from '../routes/users.route';
import testRouter from '../routes/test.route';

export class RoutesLoader {
    static initRoutes(app: Application, version: string) {
        app.use(`/api/${version}/clients`, clientsRouter);
        app.use(`/api/${version}/mailing`, mailingRouter); 
        app.use(`/api/${version}/meta`, metaRouter);
        app.use(`/api/${version}/test`, testRouter);
        app.use(`/api/${version}/tickets`, ticketsRouter);
        app.use(`/api/${version}/users`, usersRouter);
    }
}