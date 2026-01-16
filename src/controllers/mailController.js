const createTransporter = require('../config/transporter');
const nodemailer = require("nodemailer");

exports.sendMail = async (req, res) => {
    try {
        const { to, subject, text, html } = req.body;

        if (!to || !subject || (!text && !html)) {
            return res.status(400).json({ error: "Missing required fields: to, subject, text/html" });
        }

        const transporter = await createTransporter();

        const info = await transporter.sendMail({
            from: '"Mailer Service" <no-reply@example.com>',
            to,
            subject,
            text,
            html,
        });

        console.log("Message sent: %s", info.messageId);

        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
            console.log("Preview URL: %s", previewUrl);
        }

        res.status(200).json({
            message: "Email sent successfully",
            messageId: info.messageId,
            previewUrl
        });

    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
};
