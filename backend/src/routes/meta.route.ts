import { Router } from 'express';
import { awaitHandlerFactory } from '../middleware/awaitHandlerFactory.middleware';
import metaController from '../controllers/meta.controller';
import { auth } from '../middleware/auth.middleware';
import { 
    metaFindByIdSchema,
    maintenanceFindSchema,
    metaUpdateSchema,
    maintenanceUpdateSchema
} from '../middleware/validators/metaValidator.middleware';

const router = Router();

router.get('/info/:id/:key', auth(true), metaFindByIdSchema, awaitHandlerFactory(metaController.getMetaData));
router.get('/all/:key', auth(true), awaitHandlerFactory(metaController.getAllData));
router.get('/maintenance/:id/:key', auth(true), maintenanceFindSchema, awaitHandlerFactory(metaController.getMaintenanceMode));
router.put('/info/:id/:key', auth(true), metaUpdateSchema, awaitHandlerFactory(metaController.updateMetaData));
router.put('/maintenance/:id/:key', auth(true), maintenanceUpdateSchema, awaitHandlerFactory(metaController.setMaintenanceMode));

export default router;