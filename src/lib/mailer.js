const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "15bfe3d876b1a3",
        pass: "d14a4dbde90d35"
    }
});