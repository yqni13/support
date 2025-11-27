import { Router } from 'express';
import { awaitHandlerFactory as factory } from '../middleware/awaitHandlerFactory.middleware';
import { authAdmin } from '../middleware/auth.admin.middleware';
import { maintain } from '../middleware/maintenance.middleware';
import clientsController from '../controllers/clients.controller';
import {
    getClientStatusSchema as getStatusSchema,
    postClientSchema as createSchema,
    patchClientStatusSchema as updateStatusSchema
} from './../middleware/validators/clientsValidator.middleware';

const router = Router();

router.get('/status/:name', authAdmin(), getStatusSchema, factory(clientsController.getClientStatus));
router.post('/create', maintain(), authAdmin(), createSchema, factory(clientsController.postClient));
router.put('/status/:id', maintain(), authAdmin(), updateStatusSchema, factory(clientsController.patchClientStatus));

export default router;