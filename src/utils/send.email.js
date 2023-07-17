const nodemailer = require("nodemailer");

const sendEmail = async (optinos) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const message = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}`,
      to: optinos.email,
      subject: optinos.subject,
      text: optinos.text,
    };

    const info = await transporter.sendMail(message);
  } catch (error) {
    throw error;
  }
};

module.exports = sendEmail;
