import { Router } from 'express';
import { awaitHandlerFactory as factory } from '../middleware/awaitHandlerFactory.middleware';
import { maintain } from '../middleware/maintenance.middleware';
import { requirePayload } from '../middleware/require.middleware';
import { observe } from '../middleware/observe.middleware';
import testController from '../controllers/test.controller';
import {
    postErrorSchema as errorSchema,
    postDemoSchema as demoSchema,
} from '../validation/schemata/test.schema.validation';
import { authAdmin } from '../middleware/auth.admin.middleware';

const router = Router();

// exception
router.post(
    '/error',
    authAdmin(), requirePayload(),
    errorSchema,
    factory(testController.postError)
);

// demo
router.post(
    '/demo',
    maintain(), requirePayload(), observe(true),
    demoSchema,
    factory(testController.postDemo)
);

export default router;