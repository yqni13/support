import { Router } from 'express';
import { awaitHandlerFactory as factory } from '../middleware/awaitHandlerFactory.middleware';
import metaController from '../controllers/meta.controller';
import { authAdmin } from '../middleware/auth.admin.middleware';
import { 
    metaFindByIdSchema as byIdSchema,
    metaFindByNameSchema as byNameSchema,
    maintenanceFindSchema as getMaintainSchema,
    metaUpdateSchema as updateSchema,
    maintenanceUpdateSchema as updateMaintainSchema
} from '../middleware/validators/metaValidator.middleware';

const router = Router();

router.get('/by-id/:id', authAdmin(), byIdSchema, factory(metaController.getMetaById));
router.get('/by-name/:name', authAdmin(), byNameSchema, factory(metaController.getMetaByName));
router.get('/all', authAdmin(), factory(metaController.getAllData));
router.get('/maintenance/:name', authAdmin(), getMaintainSchema, factory(metaController.getMaintenanceMode));
router.put('/info/:id', authAdmin(), updateSchema, factory(metaController.updateMetaData));
router.put('/maintenance/:name', authAdmin(), updateMaintainSchema, factory(metaController.setMaintenanceMode));

export default router;