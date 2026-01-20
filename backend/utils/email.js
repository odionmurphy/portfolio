import nodemailer from "nodemailer";
import { Resend } from "resend";

// Use Resend if API key is available, otherwise use Nodemailer
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (resend) {
      // Use Resend
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "noreply@resend.dev",
        to,
        subject,
        html,
        text,
      });
    } else {
      // Use Nodemailer
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
        text,
      });
    }
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
};
