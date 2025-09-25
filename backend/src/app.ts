import { ExpressLoader } from './loaders/express.loader';
import { RoutesLoader } from './loaders/routes.loader';
import { MiddlewareLoader } from './loaders/middleware.loader';
import { DBConnection } from './configs/db';

const app = ExpressLoader.init();
const version = 'v1';

RoutesLoader.initRoutes(app, version);
MiddlewareLoader.init(app);
const dbConnect = new DBConnection();
dbConnect.init();

export default app;