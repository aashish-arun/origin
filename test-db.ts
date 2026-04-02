import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

async function main() {
  const result = await prisma.$queryRaw`SELECT NOW()`;
  console.log("✅ DB time:", result);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());