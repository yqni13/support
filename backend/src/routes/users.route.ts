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
} from '../validation/schemata/users.schema.validation';
import { maintain } from '../middleware/maintenance.middleware';
import { requirePayload } from '../middleware/require.middleware';

const router = Router();

// findById
router.get(
    '/id/:id',
    authAdmin(),
    byIdSchema,
    factory(usersController.getUserById)
);

// findByEmail
router.get(
    '/email/:email',
    authAdmin(),
    byEmailSchema,
    factory(usersController.getUserByEmail)
);

// findAll
router.get(
    '/all',
    authAdmin(),
    factory(usersController.getAllUsers)
);

// findByFilter
router.post(
    '/search',
    authAdmin(),
    searchSchema,
    factory(usersController.postUsersSearch)
);

// create
router.post(
    '/create',
    maintain(), authAdmin(), requirePayload(),
    createSchema,
    factory(usersController.postUser)
);

// update
router.put(
    '/update/:id',
    maintain(), authAdmin(), requirePayload(),
    updateSchema,
    factory(usersController.patchUser)
);

export default router;