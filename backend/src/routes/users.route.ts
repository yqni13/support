import { Router } from 'express';
import { awaitHandlerFactory as factory } from '../middleware/awaitHandlerFactory.middleware';
import { authAdmin } from '../middleware/auth.admin.middleware';
import usersController from "../controllers/users.controller";
import {
    usersFindByIdSchema as byIdSchema,
    usersFindByEmailSchema as byEmailSchema,
    usersFindByFilterSchema as searchSchema,
    usersCreateSchema as createSchema,
    usersUpdateSchema as updateSchema
} from '../middleware/validators/usersValidator.middleware';

const router = Router();

router.get('/by-id/:id', authAdmin(), byIdSchema, factory(usersController.getUser));
router.get('/by-email/:email', authAdmin(), byEmailSchema, factory(usersController.getUserByEmail));
router.get('/all', authAdmin(), factory(usersController.getAllUsers));
router.post('/search', authAdmin(), searchSchema, factory(usersController.searchByFilter));
router.post('/create', authAdmin(), createSchema, factory(usersController.createUser));
router.put('/update/:id', authAdmin(), updateSchema, factory(usersController.updateUser));

export default router;