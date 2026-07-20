import { PrismaClient } from "@prisma/client";
import { PRODUCTS } from "../data/products";

const prisma = new PrismaClient();

async function main() {
  const productCount = await prisma.product.count();
  if (productCount === 0) {
    for (const p of PRODUCTS) {
      await prisma.product.create({ data: { ...p, fabrics: p.fabrics, images: p.images ?? [], active: true } });
    }
    console.log(`Seeded ${PRODUCTS.length} products.`);
  } else {
    console.log(`Skipped products — ${productCount} already in the database.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
