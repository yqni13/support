const mailingRouter = require('../routes/mailing.route');

class RoutesLoader {
    static initRoutes(app, version) {
        app.use(`/api/${version}/mailing`, mailingRouter);
    }
}

module.exports = { RoutesLoader };