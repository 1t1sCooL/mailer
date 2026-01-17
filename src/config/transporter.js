const nodemailer = require("nodemailer");

const createTransporter = async () => {

    if (process.env.NODE_ENV !== 'production') {
        const testAccount = await nodemailer.createTestAccount();

        console.log("⚠️ Используется тестовый SMTP Ethereal");
        console.log(`User: ${testAccount.user}`);

        return nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

module.exports = createTransporter;
