import express from "express";
import Contact from "../models/Contact.js";
import { sendEmail } from "../utils/email.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Submit contact form (public)
router.post("/", async (req, res) => {
  try {
    const { name, email, message, phone } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "Please provide name, email, and message" });
    }

    // Create contact record
    const contact = new Contact({
      name,
      email,
      message,
      phone: phone || null,
    });

    await contact.save();

    // Try to send emails, but don't fail the request if they fail
    try {
      // Send confirmation email to user
      await sendEmail({
        to: email,
        subject: "We received your message",
        html: `
          <h3>Thank you, ${name}!</h3>
          <p>We have received your message and will get back to you soon.</p>
          <p>Message ID: ${contact._id}</p>
        `,
      });

      // Send notification email to admin
      await sendEmail({
        to: process.env.EMAIL_USER,
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <h3>New Message from Portfolio</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <p><strong>Message ID:</strong> ${contact._id}</p>
          <p><a href="${process.env.ADMIN_URL}/messages/${contact._id}">View in Dashboard</a></p>
        `,
      });
    } catch (emailError) {
      // Log email error but continue - form was submitted successfully
      console.warn("Email notification failed:", emailError.message);
    }

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully",
      contactId: contact._id,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ message: "Failed to submit contact form" });
  }
});

// Get all contacts (admin only)
router.get("/", protect, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
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
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    // Mark as read
    contact.isRead = true;
    await contact.save();

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

    let contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    contact.replyMessage = replyMessage;
    contact.isReplied = true;
    await contact.save();

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
    const contact = await Contact.findByIdAndDelete(req.params.id);

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
