const Secrets = require('../utils/secrets.utils');
const nodemailer = require('nodemailer');
const { decryptRSA } = require('../utils/crypto.utils');
const { UnexpectedException } = require('../utils/exceptions/common.exception');
const { AuthenticationStandardException } = require('../utils/exceptions/auth.exception');
const Utils = require('../utils/common.utils');

class MailingModel {
    sendMail = async (params) => {
        if(!Object.keys(params).length) {
            return { error: 'no params found' };
        }

        const key = Utils.selectPrivateKey(params['source']);

        const sender = decryptRSA(params['sender'], key);
        const subject = params['subject'];
        const message = params['body'];

        const mailOptions = {
            from: Secrets.EMAIL_SENDER,
            to: Secrets.EMAIL_RECEIVER,
            replyTo: sender,
            subject: subject,
            text: message
        }

        try {
            const success = await this.wrapedSendMail(mailOptions);
            return { response: { success, sender }};
        } catch(err) {
            if(err.status === 535) {
                throw new AuthenticationStandardException('server-535-auth#email-service', { data: err.message});
            } else {
                throw new UnexpectedException();
            }
        }
    }

    async wrapedSendMail(mailOptions) {
        return new Promise((resolve, reject) => {
            const transporter = nodemailer.createTransport({
                service: '',
                host: '',
                port: 465,
                secure: true,
                tls: {
                    secure: true,
                    ciphers: 'SSLv3',
                    rejectUnauthorized: false
                },
                auth: {
                    user: Secrets.EMAIL_SENDER,
                    pass: Secrets.EMAIL_PASS
                }
            });

            transporter.sendMail(mailOptions, function(err, info) {
                if(err) {
                    if(err.responseCode === 535) {
                        return reject(new AuthenticationStandardException(err));
                    } else {
                        return reject(new UnexpectedException(err));
                    }
                }
                resolve(true);
            })
        })
    }
}

module.exports = new MailingModel();