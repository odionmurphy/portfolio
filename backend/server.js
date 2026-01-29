import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import contactRoutes from "./routes/contact.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import connectDB from "./config/database.js";

dotenv.config();

const app = express();

// Middleware
// Increase JSON body limit to avoid PayloadTooLarge errors seen on some hosts
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// Simple request logger to help troubleshoot 502s on Render
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.originalUrl} - Content-Length: ${req.headers["content-length"] || "unknown"}`,
  );
  next();
});

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
      "http://localhost:5173",
      "http://localhost:3000",
    ].filter(Boolean),
    credentials: true,
  }),
);

// Connect to MongoDB
if (process.env.MONGODB_URI) {
  connectDB();
} else {
  console.log("MongoDB URI not provided, running without database");
}

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({
    status: "ok",
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Portfolio Backend API" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

// Process-level error handlers to avoid crashes on unhandled errors
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(
    `✓ Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`,
  );
});
