import {
    getFeedbackRatingSchema as getExtendedSchema,
    getExtendedFeedbackRatingSchema as getSchema,
} from '../validation/schemata/feedback-rating.schema.validation';
import { Router } from 'express';
import { authAdmin } from '../middleware/auth.admin.middleware';
import { awaitHandlerFactory as factory } from '../middleware/awaitHandlerFactory.middleware';
import feedbackRatingController from '../controllers/feedback-rating.controller';
import { authClient } from '../middleware/auth.client.middleware';
import { maintain } from '../middleware/maintenance.middleware';

const router = Router();

// findById
router.get(
    '/find/id/:id',
    authAdmin(),
    getExtendedSchema,
    factory(feedbackRatingController.getExtendedFeedbackRating)
);

// findByClientName
router.get(
    '/find/name/:client_name',
    maintain(), authClient(),
    getSchema,
    factory(feedbackRatingController.getFeedbackRating)
);

// findAll
router.get(
    '/all',
    authAdmin(),
    factory(feedbackRatingController.getAllFeedbackRatings)
);

export default router;