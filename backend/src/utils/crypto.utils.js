const crypto = require('crypto');
const { UnexpectedException } = require('../utils/exceptions/common.exception');

// RSA
exports.decryptRSA = (data, privateKey) => {
    try {
        const buffer = Buffer.from(data, "base64");
        const decrypted = crypto.privateDecrypt(
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        buffer
        );
    
        return decrypted.toString("utf8");
    } catch(err) {
        logger.error('ERROR decryptRSA', {
            error: err.code,
            stack: err.stack,
            context: {
                method: 'support_crypto_decryptRSA'
            }
        });
        throw new UnexpectedException(err.message);
    }
}