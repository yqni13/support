import { Router } from 'express';
import { awaitHandlerFactory } from '../middleware/awaitHandlerFactory.middleware';
import { authAdmin } from '../middleware/auth.middleware';
import { maintain } from '../middleware/maintenance.middleware';
import clientsController from '../controllers/clients.controller';
import {
    clientsStatusFindSchema,
    clientsCreateSchema,
    clientsStatusUpdateSchema
} from './../middleware/validators/clientsValidator.middleware';

const router = Router();

router.get('/status/:name', authAdmin(),clientsStatusFindSchema, awaitHandlerFactory(clientsController.getStatus));
router.post('/create', authAdmin(), clientsCreateSchema, awaitHandlerFactory(clientsController.createClient));
router.put('/status/:id', maintain(), authAdmin(), clientsStatusUpdateSchema, awaitHandlerFactory(clientsController.setStatus));

export default router;