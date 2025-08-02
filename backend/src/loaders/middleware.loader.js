const errorMiddleware = require('../middleware/error.middleware');

class MiddlewareLoader {
    static init(app) {
        app.all('*', (req, res, next) => {
            res.send('SERVER: YQNI13_SUPPORT.\nSTATUS: ACTIVE.');
        });

        app.use(errorMiddleware);
    }
}

module.exports = { MiddlewareLoader };