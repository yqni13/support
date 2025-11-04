import { Router } from 'express';
import { awaitHandlerFactory } from '../middleware/awaitHandlerFactory.middleware';
import metaController from '../controllers/meta.controller';
import { auth } from '../middleware/auth.middleware';
import { 
    metaFindByIdSchema,
    metaFindByNameSchema,
    maintenanceFindSchema,
    metaUpdateSchema,
    maintenanceUpdateSchema
} from '../middleware/validators/metaValidator.middleware';

const router = Router();

router.get('/by-id/:id/:key', auth(true), metaFindByIdSchema, awaitHandlerFactory(metaController.getMetaById));
router.get('/by-name/:name/:key', auth(true), metaFindByNameSchema, awaitHandlerFactory(metaController.getMetaByName));
router.get('/all/:key', auth(true), awaitHandlerFactory(metaController.getAllData));
router.get('/maintenance/:name/:key', auth(true), maintenanceFindSchema, awaitHandlerFactory(metaController.getMaintenanceMode));
router.put('/info/:id/:key', auth(true), metaUpdateSchema, awaitHandlerFactory(metaController.updateMetaData));
router.put('/maintenance/:name/:key', auth(true), maintenanceUpdateSchema, awaitHandlerFactory(metaController.setMaintenanceMode));

export default router;