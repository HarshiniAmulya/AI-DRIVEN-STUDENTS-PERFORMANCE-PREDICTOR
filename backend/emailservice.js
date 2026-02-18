const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

function sendAlert(to, message){
    transporter.sendMail({
        from: process.env.EMAIL,
        to: to,
        subject: "Student Performance Alert",
        text: message
    });
}

module.exports = sendAlert;
