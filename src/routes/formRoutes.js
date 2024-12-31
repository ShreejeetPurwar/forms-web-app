const express = require('express');
const path = require('path');
const router = express.Router();
const FormData = require('../models/formData');
const nodemailer = require('nodemailer');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/form.html'));
});

router.post('/submit', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        const formData = new FormData({ name, email, message });
        await formData.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Form Submission Received',
            text: `Thank you, ${name}. Your message: "${message}" has been received.`,
        };

        await transporter.sendMail(mailOptions);
        res.send('Form submitted successfully!');
    } catch (err) {
        res.status(500).send('Error submitting form');
    }
});

module.exports = router;
