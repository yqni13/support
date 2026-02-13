import { Router } from 'express';
import { awaitHandlerFactory } from '../middleware/awaitHandlerFactory.middleware';
import MailingController from '../controllers/mailing.controller';
import { mailingSchema } from '../validation/schemata/mailing.schema.validation';

const router = Router();

router.post('/send', mailingSchema, awaitHandlerFactory(MailingController.sendMail));

export default router;