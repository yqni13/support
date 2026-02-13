import { Router } from 'express';
import { awaitHandlerFactory as factory } from '../middleware/awaitHandlerFactory.middleware';
import { authAdmin } from '../middleware/auth.admin.middleware';
import { maintain } from '../middleware/maintenance.middleware';
import clientsController from '../controllers/clients.controller';
import {
    getClientStatusSchema as getStatusSchema,
    postClientSchema as createSchema,
    patchClientStatusSchema as updateStatusSchema
} from '../validation/schemata/clients.schema.validation';
import { requirePayload } from '../middleware/require.middleware';

const router = Router();

// findStatusByName
router.get(
    '/status/:name',
    authAdmin(),
    getStatusSchema,
    factory(clientsController.getClientStatus)
);

// create
router.post(
    '/create',
    maintain(), authAdmin(), requirePayload(),
    createSchema,
    factory(clientsController.postClient)
);

// udpateStatus
router.put(
    '/status/:id',
    maintain(), authAdmin(), requirePayload(),
    updateStatusSchema,
    factory(clientsController.patchClientStatus)
);

export default router;