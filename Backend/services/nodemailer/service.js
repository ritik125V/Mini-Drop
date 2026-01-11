import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

async function sendMail() {
  await transporter.sendMail({
    from: `"My App" <${process.env.EMAIL}>`,
    to: "user@gmail.com",
    subject: "Hello 👋",
    text: "This is a test email"
  });
}
