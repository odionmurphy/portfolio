import express from "express";
import fs from "fs";
import path from "path";
import { prisma } from "../config/database.js";
import { sendEmail } from "../utils/email.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Prepare uploads directory
const uploadsDir = path.join(process.cwd(), "uploads");
// Submit contact form (public) - JSON payload only
router.post("/", async (req, res) => {
  try {
    // Verbose request logging for diagnostics
    try {
      console.log(`Incoming /api/contact - ${new Date().toISOString()}`);
      console.log("method:", req.method, "url:", req.originalUrl);
      console.log("headers:", JSON.stringify(req.headers, null, 2));
      console.log("content-type:", req.headers["content-type"] || "(none)");
      console.log(
        "content-length:",
        req.headers["content-length"] || "unknown",
      );
      console.log(`/api/contact preview: ${JSON.stringify(req.body).slice(0, 1000)}`);
    } catch (e) {
      console.warn("Could not stringify request body for debug:", e?.message || e);
    }

    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;
    const phone = req.body.phone;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Please provide name, email, and message" });
    }

    // Try to save to database if DATABASE_URL is provided
    let contactId = null;
    if (process.env.DATABASE_URL) {
      try {
        const contact = await prisma.contact.create({
          data: {
            name,
            email,
            message,
            phone: phone || null,
          },
        });
        contactId = contact.id;
      } catch (dbError) {
        console.warn("Database save failed, proceeding with email only:", dbError.message);
      }
    }

    // Respond to client
    console.log("Responding 201 to client", { contactId });
    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully",
      contactId,
    });

    // Send emails asynchronously
    (async () => {
      try {
        await sendEmail({
          to: email,
          subject: "We received your message",
          html: `<h3>Thank you, ${name}!</h3><p>We have received your message and will get back to you soon.</p>`,
        }).catch((err) => console.warn("User confirmation email failed:", err?.message || err));

        if (process.env.EMAIL_USER) {
          const adminHtml = `
            <h3>New Message from Portfolio</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `;

          await sendEmail({
            to: process.env.EMAIL_USER,
            subject: `New Contact Form Submission from ${name}`,
            html: adminHtml,
          }).catch((err) => console.warn("Admin notification email failed:", err?.message || err));
        }
      } catch (e) {
        console.warn("Background email process error:", e?.message || e);
      }
    })();
  } catch (error) {
    console.error("Contact form error:", error);
    if (!res.headersSent) res.status(500).json({ message: "Failed to submit contact form" });
  }
});
});

// Get all contacts (admin only)
router.get("/", protect, async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single contact (admin only)
router.get("/:id", protect, async (req, res) => {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id: req.params.id },
    });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    // Mark as read
    await prisma.contact.update({
      where: { id: req.params.id },
      data: { isRead: true },
    });

    res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reply to contact (admin only)
router.put("/:id/reply", protect, async (req, res) => {
  try {
    const { replyMessage } = req.body;

    if (!replyMessage) {
      return res
        .status(400)
        .json({ message: "Please provide a reply message" });
    }

    let contact = await prisma.contact.findUnique({
      where: { id: req.params.id },
    });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    contact = await prisma.contact.update({
      where: { id: req.params.id },
      data: { replyMessage: replyMessage, isReplied: true },
    });

    // Send reply email
    await sendEmail({
      to: contact.email,
      subject: "Reply to your message",
      html: `
        <h3>Hello ${contact.name},</h3>
        <p>Thank you for reaching out. Here's our reply:</p>
        <p>${replyMessage}</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Reply sent successfully",
      contact,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete contact (admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    const contact = await prisma.contact.delete({
      where: { id: req.params.id },
    });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
