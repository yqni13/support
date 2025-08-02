require('dotenv').config();
const { Config } = require('./src/configs/config');
const { ExpressLoader } = require('./src/loaders/express.loader');
const { RoutesLoader } = require('./src/loaders/routes.loader');
const { MiddlewareLoader } = require('./src/loaders/middleware.loader');

const app = ExpressLoader.init();

const version = "v1";
RoutesLoader.initRoutes(app, version);

MiddlewareLoader.init(app);

const port = Config.PORT;
app.listen(port, () => {
    const divider = '=================';
    console.log(`${divider} YQNI13_SUPPORT SERVER ${divider}\n${divider} RUNNING ON PORT: ${port} ${divider}`);
});

module.exports = app;