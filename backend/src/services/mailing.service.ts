// const MailingModel = require('../models/mailing.model');
import { basicResponse } from '../utils/common.utils';

class MailingService {
    sendMail = async (params: any, files?: any) => {
        const hasParams = Object.keys(params).length !== 0;
        let mail = {};
        // let mail = await MailingModel.sendMail(hasParams ? params : {});
        return basicResponse(mail, 1, 'Success');
    }
}

export default new MailingService();