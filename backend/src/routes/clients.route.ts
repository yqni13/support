import { Router } from 'express';
import { awaitHandlerFactory } from '../middleware/awaitHandlerFactory.middleware';
import { auth } from '../middleware/auth.middleware';
import clientsController from '../controllers/clients.controller';
import {
    clientsStatusFindSchema,
    clientsCreateSchema,
    clientsStatusUpdateSchema
} from './../middleware/validators/clientsValidator.middleware';

const router = Router();

router.get('/status/:name/:key', auth(true), clientsStatusFindSchema, awaitHandlerFactory(clientsController.getStatus));
router.post('/create/:key', auth(true), clientsCreateSchema, awaitHandlerFactory(clientsController.createClient));
router.put('/status/:id/:key', auth(true), clientsStatusUpdateSchema, awaitHandlerFactory(clientsController.setStatus));

export default router;