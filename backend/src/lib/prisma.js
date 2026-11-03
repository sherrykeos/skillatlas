import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("⚠️ DATABASE_URL is not defined in backend/.env! Database operations will fail.");
}

const isLocalhost =
  connectionString?.includes("localhost") || connectionString?.includes("127.0.0.1");

const pool = new pg.Pool({
  connectionString,
  ssl: connectionString && !isLocalhost ? { rejectUnauthorized: false } : undefined,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
