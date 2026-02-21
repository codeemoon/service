const nodemailer = require("nodemailer");

// Simple utility to send an email using nodemailer
const sendEmail = async ({ to, subject, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail", // You can configure this to other services if needed
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Helpbro" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    // Returning false instead of throwing helps prevent the primary registration request from entirely failing just because the email failed.
    return false;
  }
};

module.exports = sendEmail;
