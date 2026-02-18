import { Router } from 'express';
import { awaitHandlerFactory as factory } from '../middleware/awaitHandlerFactory.middleware';
import metaController from '../controllers/meta.controller';
import { requirePayload } from '../middleware/require.middleware';
import { authAdmin } from '../middleware/auth.admin.middleware';
import {
    getMetaByIdSchema as byIdSchema,
    getMetaByNameSchema as byNameSchema,
    getMaintenanceSchema as getMaintainSchema,
    patchMetaSchema as updateSchema,
    patchMaintenanceSchema as updateMaintainSchema,
} from '../validation/schemata/meta.schema.validation';

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

export default router;