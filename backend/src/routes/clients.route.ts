import { Router } from 'express';
import { awaitHandlerFactory as factory } from '../middleware/awaitHandlerFactory.middleware';
import { authAdmin } from '../middleware/auth.admin.middleware';
import { maintain } from '../middleware/maintenance.middleware';
import clientsController from '../controllers/clients.controller';
import {
    clientsStatusFindSchema as getStatusSchema,
    clientsCreateSchema as createSchema,
    clientsStatusUpdateSchema as updateStatusSchema
} from './../middleware/validators/clientsValidator.middleware';

const router = Router();

router.get('/status/:name', authAdmin(),getStatusSchema, factory(clientsController.getStatus));
router.post('/create', authAdmin(), createSchema, factory(clientsController.createClient));
router.put('/status/:id', maintain(), authAdmin(), updateStatusSchema, factory(clientsController.setStatus));

export default router;