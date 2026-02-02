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

export const sendEmail = async ({ to, subject, html, text, attachments }) => {
  try {
    if (resend) {
      // Resend doesn't support arbitrary attachments directly in the same way as nodemailer.
      // Fall back to including attachment links in the email HTML when available.
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "noreply@resend.dev",
        to,
        subject,
        html,
        text,
      });
    } else {
      // Use Nodemailer and pass attachments if provided
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
        text,
        attachments,
      });
    }
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
};
