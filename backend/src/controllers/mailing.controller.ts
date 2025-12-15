import { NextFunction, Request, Response } from "express";
import MailingService from '../services/mailing.service';
const { checkValidation } = require('../middleware/validation.middleware');

class MailingController {
    sendMail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            checkValidation(req);
            const response = await MailingService.sendMail(req.body, null); // TODO(yqni13): files param missing
            res.json(response);
        } catch(err: any) {
            next(err);
        }
    }
}

export default new MailingController();