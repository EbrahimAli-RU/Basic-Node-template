const nodemailer = require('nodemailer')

const sendMail = async options => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    let EmailOption = {
        from: process.env.EMAIL_FROM,
        to: 'ebrahimali.cse.ru@gmail.com',
        subject: 'check',
        text: options.url
    }

    await transporter.sendMail(EmailOption);
}

module.exports = sendMail