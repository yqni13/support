import { Router } from 'express';
import { awaitHandlerFactory as factory } from '../middleware/awaitHandlerFactory.middleware';
import metaController from '../controllers/meta.controller';
import { requirePayload } from '../middleware/require.middleware';
import { authAdmin } from '../middleware/auth.admin.middleware';
import { maintain } from '../middleware/maintenance.middleware';
import {
    getMetaByIdSchema as byIdSchema,
    getMetaByNameSchema as byNameSchema,
    getMaintenanceSchema as getMaintainSchema,
    patchMetaSchema as updateSchema,
    patchMaintenanceSchema as updateMaintainSchema,
    postDemoSchema as demoSchema
} from '../validation/schemata/meta.schema.validation';
import { observe } from '../middleware/observe.middleware';

const router = Router();

// findById
router.get(
    '/by-id/:id',
    authAdmin(),
    byIdSchema,
    factory(metaController.getMetaById)
);

// findByName
router.get(
    '/by-name/:name',
    authAdmin(),
    byNameSchema,
    factory(metaController.getMetaByName)
);

// findAll
router.get(
    '/all',
    authAdmin(),
    factory(metaController.getAllMeta)
);

// findMaintenance
router.get(
    '/maintenance/:name',
    authAdmin(),
    getMaintainSchema,
    factory(metaController.getMaintenanceMode)
);

// update
router.put(
    '/info/:id',
    authAdmin(), requirePayload(),
    updateSchema,
    factory(metaController.patchMeta)
);

// updateMaintenance
router.put(
    '/maintenance/:id',
    authAdmin(), requirePayload(),
    updateMaintainSchema,
    factory(metaController.patchMaintenanceMode)
);

// TODO(yqni13): implement observe-middleware at SUPPORT-25
// demo
router.post(
    '/demo',
    maintain(), requirePayload(), observe(true),
    demoSchema,
    factory(metaController.postDemo)
);

export default router;