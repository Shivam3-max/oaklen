import { PrismaClient } from "@prisma/client";
import { PRODUCTS } from "../data/products";
import { PROJECTS } from "../data/projects";

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

  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    for (const p of PROJECTS) {
      await prisma.project.create({ data: { ...p, scope: p.scope, images: p.images, active: true } });
    }
    console.log(`Seeded ${PROJECTS.length} projects.`);
  } else {
    console.log(`Skipped projects — ${projectCount} already in the database.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
