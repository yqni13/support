import { Router } from 'express';
import { awaitHandlerFactory } from '../middleware/awaitHandlerFactory.middleware';
import { mailingSchema } from '../middleware/validators/mailingValidator.middleware';
import MailingController from '../controllers/mailing.controller';

const router = Router();

router.post('/send', mailingSchema, awaitHandlerFactory(MailingController.sendMail));

export default router;