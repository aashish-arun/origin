import "dotenv/config";
import { prisma } from "@/app/lib/prisma";

async function main() {
  const items = await prisma.collectionItem.findMany();

  const dbTime = await prisma.$queryRaw`SELECT NOW()`;

  console.log("✅ Prisma connected!");
  console.log("🕒 DB Time:", dbTime);
  console.log("📦 Items:", items);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());