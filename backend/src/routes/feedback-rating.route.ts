import {
    getFeedbackRatingSchema as getExtendedSchema,
    getExtendedFeedbackRatingSchema as getSchema,
    postFeedbackRatingSchema as postSchema
} from '../validation/schemata/feedback-rating.schema.validation';
import { Router } from 'express';
import { authAdmin } from '../middleware/auth.admin.middleware';
import { awaitHandlerFactory as factory } from '../middleware/awaitHandlerFactory.middleware';
import feedbackRatingController from '../controllers/feedback-rating.controller';
import { authClient } from '../middleware/auth.client.middleware';
import { maintain } from '../middleware/maintenance.middleware';
import { requirePayload } from '../middleware/require.middleware';

const router = Router();

// findById
router.get(
    '/by-id/:id',
    authAdmin(),
    getExtendedSchema,
    factory(feedbackRatingController.getExtendedFeedbackRating)
);

// findByClientName
router.get(
    '/by-name/:client_name',
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

// create
router.post(
    '/create',
    authAdmin(), requirePayload(),
    postSchema,
    factory(feedbackRatingController.postFeedbackRating)
);

export default router;