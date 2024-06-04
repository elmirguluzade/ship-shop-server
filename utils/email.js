const nodemailer = require('nodemailer')
const pug = require('pug')

const sendEmail = (options, type) => {
    let { to, subject, name, url } = options;
    if(name) name = name.charAt(0).toUpperCase() + name.slice(1);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL,
            pass: process.env.MAIL_PASSWORD
        }
    });

    let html;
    if (type == "welcome") html = pug.renderFile(`${__dirname}/../views/welcome.pug`, { name })
    else if (type == "reset") html = pug.renderFile(`${__dirname}/../views/reset.pug`, { url });

    const mailOptions = {
        from: {
            name: "ShipShop",
            address: "myblogapp01@gmail.com",
        },
        to,
        subject,
        html
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = sendEmail