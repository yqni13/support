import { Router } from 'express';
import { awaitHandlerFactory } from '../middleware/awaitHandlerFactory.middleware';
import metaController from '../controllers/meta.controller';
import { authAdmin } from '../middleware/auth.middleware';
import { 
    metaFindByIdSchema,
    metaFindByNameSchema,
    maintenanceFindSchema,
    metaUpdateSchema,
    maintenanceUpdateSchema
} from '../middleware/validators/metaValidator.middleware';

const router = Router();

router.get('/by-id/:id', authAdmin(), metaFindByIdSchema, awaitHandlerFactory(metaController.getMetaById));
router.get('/by-name/:name', authAdmin(), metaFindByNameSchema, awaitHandlerFactory(metaController.getMetaByName));
router.get('/all', authAdmin(), awaitHandlerFactory(metaController.getAllData));
router.get('/maintenance/:name', authAdmin(), maintenanceFindSchema, awaitHandlerFactory(metaController.getMaintenanceMode));
router.put('/info/:id', authAdmin(), metaUpdateSchema, awaitHandlerFactory(metaController.updateMetaData));
router.put('/maintenance/:name', authAdmin(), maintenanceUpdateSchema, awaitHandlerFactory(metaController.setMaintenanceMode));

export default router;