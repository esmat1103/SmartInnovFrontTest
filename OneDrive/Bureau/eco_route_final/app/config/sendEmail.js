const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'esmateddinekhamassi@gmail.com',
        pass: 'Tessaesmat1103@'
    }
});

// Firebase Cloud Function to send email
exports.sendEmail = functions.https.onRequest((req, res) => {
    const { recipientEmail } = req.body;

    // Email options
    const mailOptions = {
        from: 'esmateddinekhamassi@gmail.com',
        to: recipientEmail,
        subject: 'Test Email',
        text: 'This is a test email.'
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Failed to send email');
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send('Email sent successfully');
        }
    });
});
