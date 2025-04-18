const { checkValidation } = require('../middleware/validation.middleware');

class MailingController {
    sendMail = async (req, res, next) => {
        checkValidation(req);
        const response = '';
        res.send(response)
    }
}

module.exports = new MailingController();