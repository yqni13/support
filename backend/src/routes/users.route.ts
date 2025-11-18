import { Router } from 'express';
import { awaitHandlerFactory } from '../middleware/awaitHandlerFactory.middleware';
import { authAdmin } from '../middleware/auth.middleware';
import usersController from "../controllers/users.controller";
import {
    usersFindByIdSchema,
    usersCreateSchema,
    usersUpdateSchema
} from '../middleware/validators/usersValidator.middleware';

const router = Router();

router.get('/by-id/:id', authAdmin(), usersFindByIdSchema, awaitHandlerFactory(usersController.getUser));
router.get('/all', authAdmin(), awaitHandlerFactory(usersController.getAllUsers));
router.post('/create', authAdmin(), usersCreateSchema, awaitHandlerFactory(usersController.createUser));
router.put('/update/:id', authAdmin(), usersUpdateSchema, awaitHandlerFactory(usersController.updateUser));

export default router;