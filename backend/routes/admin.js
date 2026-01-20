import express from "express";
import Contact from "../models/Contact.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Middleware to check if user is admin
const checkAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// ============ MESSAGES ============

// Get all contact messages (paginated)
router.get("/messages", protect, checkAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const messages = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments();

    res.json({
      messages,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single message
router.get("/messages/:id", protect, checkAdmin, async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark message as read
router.patch("/messages/:id/read", protect, checkAdmin, async (req, res) => {
  try {
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true },
    );
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reply to message
router.post("/messages/:id/reply", protect, checkAdmin, async (req, res) => {
  try {
    const { reply } = req.body;

    if (!reply) {
      return res.status(400).json({ message: "Reply message required" });
    }

    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        isReplied: true,
        reply,
        repliedAt: new Date(),
        repliedBy: req.user.id,
      },
      { new: true },
    );

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete message
router.delete("/messages/:id", protect, checkAdmin, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ USERS ============

// Get all users
router.get("/users", protect, checkAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Make user admin
router.patch("/users/:id/admin", protect, checkAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isAdmin: true },
      { new: true },
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove admin from user
router.patch(
  "/users/:id/remove-admin",
  protect,
  checkAdmin,
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { isAdmin: false },
        { new: true },
      ).select("-password");

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

// Delete user
router.delete("/users/:id", protect, checkAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ DASHBOARD STATS ============

// Get dashboard statistics
router.get("/stats", protect, checkAdmin, async (req, res) => {
  try {
    const totalMessages = await Contact.countDocuments();
    const unreadMessages = await Contact.countDocuments({ isRead: false });
    const repliedMessages = await Contact.countDocuments({ isReplied: true });
    const totalUsers = await User.countDocuments();

    res.json({
      totalMessages,
      unreadMessages,
      repliedMessages,
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
