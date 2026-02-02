import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { prisma } from "../config/database.js";
import { sendEmail } from "../utils/email.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Prepare uploads directory
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safe = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    cb(null, safe);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// Submit contact form (public) - supports JSON or multipart/form-data with 'cv' file
router.post("/", upload.single("cv"), async (req, res) => {
  try {
    // Log a small preview for debugging
    try {
      const preview = req.file
        ? `[file:${req.file.originalname}] ${JSON.stringify(req.body).slice(0, 500)}`
        : JSON.stringify(req.body).slice(0, 1000);
      console.log(
        `${new Date().toISOString()} - /api/contact preview: ${preview}`,
      );
    } catch (e) {
      console.warn("Could not stringify request body for debug:", e.message);
    }

    const name = req.body.name || req.body.get?.("name");
    const email = req.body.email || req.body.get?.("email");
    const message = req.body.message || req.body.get?.("message");
    const phone = req.body.phone || req.body.get?.("phone");

    // Validation
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "Please provide name, email, and message" });
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
        console.warn(
          "Database save failed, proceeding with email only:",
          dbError.message,
        );
      }
    }

    // If file uploaded, build a public URL (served under /uploads) or upload to S3 when configured
    let fileUrl = null;

    if (req.file) {
      try {
        if (
          process.env.AWS_S3_BUCKET &&
          process.env.AWS_REGION &&
          process.env.AWS_ACCESS_KEY_ID &&
          process.env.AWS_SECRET_ACCESS_KEY
        ) {
          // lazy import the storage helper only when needed
          const { uploadToS3, removeLocalFile } =
            await import("../utils/storage.js");
          const key = `cv-${Date.now()}-${req.file.filename}`;
          fileUrl = await uploadToS3(req.file.path, key, req.file.mimetype);
          // Remove the local copy once uploaded
          removeLocalFile(req.file.path).catch((e) =>
            console.warn("Failed to remove local file:", e.message || e),
          );
        } else {
          fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        }
      } catch (e) {
        console.warn("File upload handling failed:", e.message || e);
        fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      }
    }

    // Persist cvUrl to DB if available
    if (process.env.DATABASE_URL && contactId && fileUrl) {
      try {
        await prisma.contact.update({
          where: { id: contactId },
          data: { cvUrl: fileUrl },
        });
      } catch (e) {
        console.warn("Failed to persist cvUrl to DB:", e.message || e);
      }
    }

    // Respond to client immediately
    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully",
      contactId,
      fileUrl,
    });

    // Try to send emails asynchronously (fire-and-forget)
    (async () => {
      try {
        // Send confirmation email to user
        await sendEmail({
          to: email,
          subject: "We received your message",
          html: `
            <h3>Thank you, ${name}!</h3>
            <p>We have received your message and will get back to you soon.</p>
            <p>We'll respond as soon as possible.</p>
          `,
        }).catch((err) =>
          console.warn("User confirmation email failed:", err.message),
        );

        // Send notification email to admin (if configured)
        if (process.env.EMAIL_USER) {
          const adminHtml = `
            <h3>New Message from Portfolio</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            ${fileUrl ? `<p><strong>CV:</strong> <a href="${fileUrl}">${fileUrl}</a></p>` : ""}
          `;

          // If there's an uploaded CV and we use nodemailer, attach it
          const mailOptions = {
            to: process.env.EMAIL_USER,
            subject: `New Contact Form Submission from ${name}`,
            html: adminHtml,
          };

          // If the file was stored locally, attach it to the admin email.
          // When S3 is configured we won't attach the binary (we include the public S3 link above).
          if (
            req.file &&
            !(
              process.env.AWS_S3_BUCKET &&
              process.env.AWS_REGION &&
              process.env.AWS_ACCESS_KEY_ID &&
              process.env.AWS_SECRET_ACCESS_KEY
            )
          ) {
            mailOptions.attachments = [
              { filename: req.file.originalname, path: req.file.path },
            ];
          }

          await sendEmail(mailOptions).catch((err) =>
            console.warn("Admin notification email failed:", err.message),
          );
        }
      } catch (e) {
        console.warn("Background email process error:", e.message || e);
      }
    })();
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ message: "Failed to submit contact form" });
  }
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
