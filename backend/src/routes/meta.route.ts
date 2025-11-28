import { Router } from 'express';
import { awaitHandlerFactory as factory } from '../middleware/awaitHandlerFactory.middleware';
import metaController from '../controllers/meta.controller';
import { authAdmin } from '../middleware/auth.admin.middleware';
import {
    getMetaByIdSchema as byIdSchema,
    getMetaByNameSchema as byNameSchema,
    getMaintenanceSchema as getMaintainSchema,
    patchMetaSchema as updateSchema,
    patchMaintenanceSchema as updateMaintainSchema,
    postDemoSchema as demoSchema
} from '../middleware/validators/metaValidator.middleware';
import { maintain } from '../middleware/maintenance.middleware';

const router = Router();

router.get('/by-id/:id', authAdmin(), byIdSchema, factory(metaController.getMetaById));
router.get('/by-name/:name', authAdmin(), byNameSchema, factory(metaController.getMetaByName));
router.get('/all', authAdmin(), factory(metaController.getAllMeta));
router.get('/maintenance/:name', authAdmin(), getMaintainSchema, factory(metaController.getMaintenanceMode));
router.put('/info/:id', authAdmin(), updateSchema, factory(metaController.patchMeta));
router.put('/maintenance/:name', authAdmin(), updateMaintainSchema, factory(metaController.patchMaintenanceMode));

// TODO(yqni13): implement observe-middleware at SUPPORT-25
router.post('/demo', maintain(), demoSchema, factory(metaController.postDemo));

export default router;