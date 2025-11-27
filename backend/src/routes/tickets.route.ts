import { Router } from 'express';
import { awaitHandlerFactory as factory } from '../middleware/awaitHandlerFactory.middleware';
import { authAdmin } from '../middleware/auth.admin.middleware';
import { authClient } from '../middleware/auth.client.middleware';
import { authUser } from '../middleware/auth.user.middleware';
import { maintain } from '../middleware/maintenance.middleware';
import ticketsController from '../controllers/tickets.controller';
import {
    getTicketSchema as getSchema,
    postTicketsSearchSchema as searchSchema,
    postTicketSchema as postSchema,
    patchTicketSchema as patchSchema,
    deleteTicketSchema as deleteSchema

} from '../middleware/validators/ticketsValidator.middleware';

const router = Router();

router.get('/by-id/:id', authAdmin(), getSchema, factory(ticketsController.getTicket));
router.get('/all', authAdmin(), factory(ticketsController.getAllTickets));
router.post('/search', authAdmin(), searchSchema, factory(ticketsController.postTicketsSearch));
router.post('/create', maintain(), authClient(), authUser(), postSchema, factory(ticketsController.postTicket));
router.put('/update/:id', maintain(), authAdmin(), patchSchema, factory(ticketsController.patchTicket));
router.delete('/delete/:id', maintain(), authAdmin(), deleteSchema, factory(ticketsController.deleteTicket));

export default router;