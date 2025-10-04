import { ExpressLoader } from './loaders/express.loader';
import { RoutesLoader } from './loaders/routes.loader';
import { MiddlewareLoader } from './loaders/middleware.loader';

const app = ExpressLoader.init();
const version = 'v1';

RoutesLoader.initRoutes(app, version);
MiddlewareLoader.init(app);

export default app;