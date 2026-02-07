// Lazy, resilient Prisma client creation without top-level importing
// This avoids crashing the app when the generated client is missing on startup.
let _prisma = null;

const getPrisma = async () => {
  if (_prisma) return _prisma;

  if (!process.env.DATABASE_URL) {
    console.log("DATABASE_URL not provided, running without database");
    return null;
  }

  try {
    const pkg = await import("@prisma/client");
    const { PrismaClient } = pkg;
    _prisma = new PrismaClient({});
    return _prisma;
  } catch (e) {
    console.warn(
      "Prisma client import/creation failed:",
      e && e.message ? e.message : e,
    );
    _prisma = null;
    return null;
  }
};

const connectDB = async () => {
  try {
    const prisma = await getPrisma();
    if (!prisma) return null;
    await prisma.$connect();
    console.log("Prisma connected to database");
    return prisma;
  } catch (e) {
    console.error(
      "Error connecting to SQL database:",
      e && e.message ? e.message : e,
    );
    _prisma = null;
    return null;
  }
};

export { getPrisma, connectDB };
export default connectDB;
