// const MailingModel = require('../models/mailing.model');

class MailingService {
    sendMail = async (params: any, files?: any) => {
        const hasParams = Object.keys(params).length !== 0;
        let mail = {};
        // let mail = await MailingModel.sendMail(hasParams ? params : {});
        return mail;
    }
}

export default new MailingService();