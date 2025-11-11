import { Router } from 'express';
import { awaitHandlerFactory } from '../middleware/awaitHandlerFactory.middleware';
import { auth } from '../middleware/auth.middleware';
import { maintain } from '../middleware/maintenance.middleware';
import clientsController from '../controllers/clients.controller';
import {
    clientsStatusFindSchema,
    clientsCreateSchema,
    clientsStatusUpdateSchema
} from './../middleware/validators/clientsValidator.middleware';

const router = Router();

router.get('/status/:name', auth(), maintain(), clientsStatusFindSchema, awaitHandlerFactory(clientsController.getStatus));
router.post('/create', auth(), maintain(), clientsCreateSchema, awaitHandlerFactory(clientsController.createClient));
router.put('/status/:id', auth(), maintain(), clientsStatusUpdateSchema, awaitHandlerFactory(clientsController.setStatus));

export default router;