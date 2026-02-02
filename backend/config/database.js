import { PrismaClient } from "@prisma/client";

// Lazy and resilient Prisma client creation:
// - Do not instantiate at import time (some Prisma engine configs require adapter/accelerate settings)
// - Only attempt to create the client when DATABASE_URL is provided
// - If client creation or connection fails, log and continue without DB
let prisma = null;

const connectDB = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      console.log("DATABASE_URL not provided, running without database");
      return null;
    }

    if (!prisma) {
      try {
        prisma = new PrismaClient({}); // pass empty options object to satisfy v7 constructor
      } catch (e) {
        console.warn(
          "Prisma client instantiation failed:",
          e && e.message ? e.message : e,
        );
        prisma = null;
        return null;
      }
    }

    await prisma.$connect();
    console.log("Prisma connected to database");
    return prisma;
  } catch (error) {
    console.error(
      "Error connecting to SQL database:",
      error && error.message ? error.message : error,
    );
    console.warn(
      "Continuing without database. Some features will be disabled.",
    );
    prisma = null;
    return null;
  }
};

export { prisma, connectDB };
export default connectDB;
