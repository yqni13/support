import { Router } from 'express';
import { awaitHandlerFactory as factory } from '../middleware/awaitHandlerFactory.middleware';
import { authAdmin } from '../middleware/auth.admin.middleware';
import usersController from "../controllers/users.controller";
import {
    getUserByIdSchema as byIdSchema,
    getUserByEmailSchema as byEmailSchema,
    postUsersSearchSchema as searchSchema,
    postUserSchema as createSchema,
    patchUserSchema as updateSchema
} from '../middleware/validators/usersValidator.middleware';
import { maintain } from '../middleware/maintenance.middleware';

const router = Router();

router.get('/by-id/:id', authAdmin(), byIdSchema, factory(usersController.getUserById));
router.get('/by-email/:email', authAdmin(), byEmailSchema, factory(usersController.getUserByEmail));
router.get('/all', authAdmin(), factory(usersController.getAllUsers));
router.post('/search', authAdmin(), searchSchema, factory(usersController.postUsersSearch));
router.post('/create', maintain(), authAdmin(), createSchema, factory(usersController.postUser));
router.put('/update/:id', maintain(), authAdmin(), updateSchema, factory(usersController.patchUser));

export default router;