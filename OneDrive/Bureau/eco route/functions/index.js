// functions/index.js

const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

exports.sendEmail = functions.https.onRequest(async (req, res) => {
    try {
        const { recipientEmail } = req.body;

        // Create a transporter with your SMTP settings
        const transporter = nodemailer.createTransport({
            service: "Gmail", // Change this to your email service provider
            auth: {
                user: "your-email@gmail.com", // your email address
                pass: "your-email-password", // your email password or an app password if you have 2-Step Verification enabled
            },
        });

        // Define email options
        const mailOptions = {
            from: "your-email@gmail.com", // sender address
            to: recipientEmail, // list of receivers
            subject: "Test Email", // Subject line
            text: "This is a test email sent from Firebase Cloud Function.", // plain text body
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: ", info.response);
        res.status(200).send("Email sent successfully");
    } catch (error) {
        console.error("Error sending email: ", error);
        res.status(500).send("Failed to send email");
    }
});
