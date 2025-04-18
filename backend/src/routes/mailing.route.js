const express = require('express');
const router = express.Router();
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const MailingController = require('../controllers/mailing.controller');
const { mailingSchema } = require('../middleware/validators/mailingValidator.middleware');

router.post('/send', mailingSchema, awaitHandlerFactory(MailingController.sendMail));

module.exports = router;