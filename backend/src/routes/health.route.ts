import { Router } from "express";
import { awaitHandlerFactory as factory } from '../middleware/awaitHandlerFactory.middleware';
import healthController from "../controllers/health.controller";
import { authAdmin } from "../middleware/auth.admin.middleware";

const router = Router();

// public
router.get('/', factory(healthController.getHealthCheck));

// admin only
router.get(
    '/details',
    authAdmin(),
    factory(healthController.getHealthCheckDetails)
)

export default router;