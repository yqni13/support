import { Router } from 'express';
import { awaitHandlerFactory } from '../middleware/awaitHandlerFactory.middleware';
import metaController from '../controllers/meta.controller';

const router = Router();

router.get('/info', awaitHandlerFactory(metaController.getMetaData));

export default router;