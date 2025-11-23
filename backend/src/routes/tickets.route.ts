import { Router } from 'express';
import { awaitHandlerFactory as factory } from '../middleware/awaitHandlerFactory.middleware';
import { authAdmin, authClient } from '../middleware/auth.middleware';
import { maintain } from '../middleware/maintenance.middleware';
// import ticketsController from '../controllers/tickets.controller';
// import {
//     ticketsFindByIdSchema as byIdSchema,
//     ticketsFindByFilterSchema as searchSchema,
//     ticketsCreateSchema as createSchema,
//     ticketsUpdateSchema as updateSchema,
//     ticketsDeleteSchema as deleteSchema

// } from '../middleware/validators/ticketsValidator.middleware';

const router = Router();

// router.get('/by-id/:id', authAdmin(), byIdSchema, factory(ticketsController.getById));
// router.get('/all', authAdmin(), factory(ticketsController.getAll));
// router.post('/search', authAdmin(), searchSchema, factory(ticketsController.getByFilter));
// router.post('/create', maintain(), authClient(), createSchema, factory(ticketsController.create));
// router.put('/update/:id', maintain(), authAdmin(), updateSchema, factory(ticketsController.update));
// router.delete('/delete/:id',maintain(), authAdmin(), deleteSchema, factory(ticketsController.delete));

export default router;