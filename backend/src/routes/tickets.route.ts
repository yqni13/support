import {
    getTicketSchema as getSchema,
    postTicketsSearchSchema as searchSchema,
    postTicketSchema as postSchema,
    patchTicketSchema as patchSchema,
    deleteTicketSchema as deleteSchema

} from '../validation/schemata/tickets.schema.validation';
import ticketsController from '../controllers/tickets.controller';
import { Router } from 'express';
import { awaitHandlerFactory as factory } from '../middleware/awaitHandlerFactory.middleware';
import { authAdmin } from '../middleware/auth.admin.middleware';
import { authClient } from '../middleware/auth.client.middleware';
import { authUser } from '../middleware/auth.user.middleware';
import { maintain } from '../middleware/maintenance.middleware';
import { observe } from '../middleware/observe.middleware';
import { parseFiles } from '../middleware/files/parse.files.middleware';
import { requirePayload } from '../middleware/require.middleware';
import { validateFiles } from '../middleware/files/validate.files.middleware';

const router = Router();

// findById
router.get(
    '/id/:id',
    authAdmin(),
    getSchema,
    factory(ticketsController.getTicket)
);

// findAll
router.get(
    '/all',
    authAdmin(),
    factory(ticketsController.getAllTickets)
);

// findByFilter
router.post(
    '/search',
    authAdmin(),
    searchSchema,
    factory(ticketsController.postTicketsSearch)
);

// create
router.post(
    '/create',
    maintain(), parseFiles(), authClient(), authUser(),
    requirePayload(), observe(), validateFiles(),
    postSchema,
    factory(ticketsController.postTicket)
);

// update
router.put(
    '/update/:id',
    maintain(), authAdmin(), requirePayload(),
    patchSchema,
    factory(ticketsController.patchTicket)
);

// delete
router.delete(
    '/delete/:id',
    maintain(), authAdmin(),
    deleteSchema,
    factory(ticketsController.deleteTicket)
);

export default router;