import { Router } from 'express';
import { awaitHandlerFactory } from '../middleware/awaitHandlerFactory.middleware';
import { auth } from '../middleware/auth.middleware';
import clientsController from '../controllers/clients.controller';
import { 
    clientsCreateSchema
} from './../middleware/validators/clientsValidator.middleware';

const router = Router();

router.post('/create/:key', auth(true), clientsCreateSchema, awaitHandlerFactory(clientsController.createClient));

export default router;