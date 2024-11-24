// utils/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // Use true para 465, false para outras portas
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

async function enviarCodigo(email, codigo) {
    const mailOptions = {
        from: '"Sistema TFA" <no-reply@example.com>',
        to: email,
        subject: 'Seu código de verificação',
        text: `Seu código de verificação é: ${codigo}`,
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { enviarCodigo };
