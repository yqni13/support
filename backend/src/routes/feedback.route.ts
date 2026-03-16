import {
    getFeedbackSchema as getSchema,
    postFeedbackSearchSchema as searchSchema,
    postFeedbackSchema as postSchema,
    patchFeedbackReviewSchema as patchReviewSchema
} from '../validation/schemata/feedback.schema.validation';
import { Router } from 'express';
import { authAdmin } from '../middleware/auth.admin.middleware';
import { awaitHandlerFactory as factory } from '../middleware/awaitHandlerFactory.middleware';
import { maintain } from '../middleware/maintenance.middleware';
import { authClient } from '../middleware/auth.client.middleware';
import { authUser } from '../middleware/auth.user.middleware';
import { requirePayload } from '../middleware/require.middleware';
import { observe } from '../middleware/observe.middleware';
import feedbackController from '../controllers/feedback.controller';

const router = Router();

// findById
router.get(
    '/id/:id',
    authAdmin(),
    getSchema,
    factory(feedbackController.getFeedback)
)

// findByFilter
router.post(
    '/search',
    authAdmin(),
    searchSchema,
    factory(feedbackController.postFeedbackEntriesSearch)
)

// create
router.post(
    '/create',
    maintain(), authClient(), authUser(), requirePayload(), observe(),
    postSchema,
    factory(feedbackController.postFeedback)
)

// update (review)
router.put(
    '/update/review/:id',
    authAdmin(),
    patchReviewSchema,
    factory(feedbackController.patchFeedbackReview)
)

export default router;