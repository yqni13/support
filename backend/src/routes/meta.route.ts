import { Router } from 'express';
import { awaitHandlerFactory } from '../middleware/awaitHandlerFactory.middleware';
import metaController from '../controllers/meta.controller';
import { auth } from '../middleware/auth.middleware';
import { maintain } from '../middleware/maintenance.middleware';
import { 
    metaFindByIdSchema,
    metaFindByNameSchema,
    maintenanceFindSchema,
    metaUpdateSchema,
    maintenanceUpdateSchema
} from '../middleware/validators/metaValidator.middleware';

const router = Router();

router.get('/by-id/:id', auth(), maintain(), metaFindByIdSchema, awaitHandlerFactory(metaController.getMetaById));
router.get('/by-name/:name', auth(), maintain(), metaFindByNameSchema, awaitHandlerFactory(metaController.getMetaByName));
router.get('/all', auth(), maintain(), awaitHandlerFactory(metaController.getAllData));
router.get('/maintenance/:name', auth(), maintenanceFindSchema, awaitHandlerFactory(metaController.getMaintenanceMode));
router.put('/info/:id', auth(), maintain(), metaUpdateSchema, awaitHandlerFactory(metaController.updateMetaData));
router.put('/maintenance/:name', auth(), maintenanceUpdateSchema, awaitHandlerFactory(metaController.setMaintenanceMode));

export default router;