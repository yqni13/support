import { Router } from 'express';
import { awaitHandlerFactory } from '../middleware/awaitHandlerFactory.middleware';
import metaController from '../controllers/meta.controller';
import { 
    metaFindByIdSchema,
    metaUpdateSchema
} from '../middleware/validators/metaValidator.middleware';

const router = Router();

router.get('/info/:id', metaFindByIdSchema, awaitHandlerFactory(metaController.getMetaData));
router.put('/update/:id', metaUpdateSchema, awaitHandlerFactory(metaController.updateMetaData));

export default router;