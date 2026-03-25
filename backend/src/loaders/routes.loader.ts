import { Application } from 'express';
import clientsRouter from '../routes/clients.route';
import metaRouter from '../routes/meta.route';
import ticketsRouter from '../routes/tickets.route'; 
import usersRouter from '../routes/users.route';
import testRouter from '../routes/test.route';
import feedbackRouter from '../routes/feedback.route';
import feedbackRatingRouter from '../routes/feedback-rating.route';
import healthRouter from '../routes/health.route';

export class RoutesLoader {
    static initRoutes(app: Application, version: string) {
        app.use(`/api/${version}/clients`, clientsRouter);
        app.use(`/api/${version}/feedback`, feedbackRouter);
        app.use(`/api/${version}/feedback-rating`, feedbackRatingRouter);
        app.use(`/api/${version}/health`, healthRouter);
        app.use(`/api/${version}/meta`, metaRouter);
        app.use(`/api/${version}/test`, testRouter);
        app.use(`/api/${version}/tickets`, ticketsRouter);
        app.use(`/api/${version}/users`, usersRouter);
    };
}