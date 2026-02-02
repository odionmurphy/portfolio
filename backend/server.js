import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import contactRoutes from "./routes/contact.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import { connectDB, prisma } from "./config/database.js";

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
    origin: (origin, cb) => {
      // Allow curl and server-side requests (no origin)
      if (!origin) return cb(null, true);

      // Allow explicit configured URLs
      const allowed = [
        process.env.FRONTEND_URL,
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:3000",
      ].filter(Boolean);

      // Allow any localhost origin (dev flexibility)
      if (
        allowed.includes(origin) ||
        /^https?:\/\/localhost(:\d+)?$/.test(origin)
      ) {
        return cb(null, true);
      }

      return cb(new Error("CORS not allowed"));
    },
    credentials: true,
  }),
);

// Body-parser error handler (e.g., PayloadTooLarge)
app.use((err, req, res, next) => {
  if (err && (err.type === "entity.too.large" || err.status === 413)) {
    console.warn("Payload too large:", err.message || err);
    return res.status(413).json({ message: "Payload too large" });
  }
  // If not a body parsing error, forward to the main error handler
  return next(err);
});

// Connect to SQL database (Postgres via Prisma)
if (process.env.DATABASE_URL) {
  // Attempt to connect but don't exit on failure
  connectDB();
} else {
  console.log("DATABASE_URL not provided, running without database");
}

// Serve uploaded files (CVs) if present
import path from "path";
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

// Health check endpoint
app.get("/api/health", async (req, res) => {
  let dbStatus = "disconnected";
  if (process.env.DATABASE_URL) {
    try {
      // Lightweight query to verify DB connectivity
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = "connected";
    } catch (e) {
      dbStatus = "disconnected";
    }
  }
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

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  try {
    const requestInfo = `${req.method} ${req.originalUrl} - content-length:${req.headers["content-length"] || "unknown"}`;
    console.error("Error handling request:", requestInfo, err.stack || err);
    if (!res.headersSent) {
      res
        .status(err.status || 500)
        .json({ message: err.message || "Internal server error" });
    }
  } catch (e) {
    console.error("Error in error handler:", e);
    if (!res.headersSent)
      res.status(500).json({ message: "Internal server error" });
  }
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
