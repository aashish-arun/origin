import "dotenv/config";
import { prisma } from "@/lib/prisma";

async function main() {
  const items = await prisma.collectible.findMany();

  const dbTime = await prisma.$queryRaw`SELECT NOW()`;

  console.log("✅ Prisma connected!");
  console.log("🕒 DB Time:", dbTime);
  console.log("📦 Collectibles:", items);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });