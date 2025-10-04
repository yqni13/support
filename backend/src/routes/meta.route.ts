import { Router } from 'express';
import { awaitHandlerFactory } from '../middleware/awaitHandlerFactory.middleware';
import metaController from '../controllers/meta.controller';
import { auth } from '../middleware/auth.middleware';
import { 
    metaFindByIdSchema,
    metaUpdateSchema
} from '../middleware/validators/metaValidator.middleware';

const router = Router();

router.get('/info/:id/:key', auth(true), metaFindByIdSchema, awaitHandlerFactory(metaController.getMetaData));
router.put('/update/:id/:key', auth(true), metaUpdateSchema, awaitHandlerFactory(metaController.updateMetaData));

export default router;