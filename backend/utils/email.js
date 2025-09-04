const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Create email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email (stored in .env)
    pass: process.env.EMAIL_PASS, // Your password (stored in .env)
  },
});

/**
 * Sends an email notification.
 * @param {string | string[]} to - Recipient email(s)
 * @param {string} subject - Email subject
 * @param {string} text - Email body
 */
const sendEmail = async (to, subject, text) => {
  try {
    let mailOptions = {
      from: process.env.EMAIL_USER, // Sender email
      to,
      subject,
      text,
    };

    // Send email
    let info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}:`, info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Export the function so it can be used in other files
module.exports = sendEmail;
