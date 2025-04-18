module.exports.Config = {
    MODE: process.env.SECRET_MODE || null,
    PORT: process.env.SECRET_PORT || null,
    EMAIL_RECEIVER: process.env.SECRET_EMAIL_RECEIVER || null,
    EMAIL_SENDER: process.env.SECRET_EMAIL_SENDER || null,
    EMAIL_PASS: process.env.SECRET_EMAIL_PASS || null
}