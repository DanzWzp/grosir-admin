import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const prismaClientSingleton = () => {
  // 1. Ambil URL dari environment
  const connectionString = process.env.DATABASE_URL;

  // 2. Buat pool koneksi standar PostgreSQL
  const pool = new Pool({ connectionString });

  // 3. Bungkus dengan Prisma Adapter
  const adapter = new PrismaPg(pool);

  // 4. Return PrismaClient dengan adapter tersebut
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Gunakan instance global jika ada, atau buat baru (mencegah koneksi ganda di mode dev)
const db = globalThis.prismaGlobal ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = db;
}
