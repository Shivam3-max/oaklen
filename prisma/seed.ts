import { PrismaClient } from "@prisma/client";
import { PRODUCTS } from "../data/products";

const prisma = new PrismaClient();

async function main() {
  const productCount = await prisma.product.count();
  if (productCount === 0) {
    for (const p of PRODUCTS) {
      await prisma.product.create({
        data: { ...p, fabrics: p.fabrics, active: true },
      });
    }
    console.log(`Seeded ${PRODUCTS.length} products.`);
  } else {
    console.log(`Skipped products — ${productCount} already in the database.`);
  }

  const partnerCount = await prisma.partner.count();
  if (partnerCount === 0) {
    await prisma.partner.create({
      data: {
        code: "ARJUN10", name: "Arjun Mehta", firm: "Studio Mehta Architects", tier: "trade", rate: 10,
        email: "arjun@studiomehta.in", phone: "+91 98100 00000", clicks: 142,
        createdAt: new Date("2026-05-12T09:00:00Z"),
        referrals: {
          create: [
            { orderId: "OAK-2417", orderValue: 296000, commission: 29600, status: "paid", date: new Date("2026-05-28T10:00:00Z") },
            { orderId: "OAK-2561", orderValue: 168000, commission: 16800, status: "confirmed", date: new Date("2026-06-14T10:00:00Z") },
            { orderId: "OAK-2688", orderValue: 424000, commission: 42400, status: "pending", date: new Date("2026-07-01T10:00:00Z") },
          ],
        },
      },
    });
    await prisma.partner.create({
      data: {
        code: "RAVIBUILD", name: "Ravi Khanna", firm: "Khanna Constructions", tier: "build", rate: 7,
        email: "ravi@khannabuild.in", phone: "+91 98200 00000", clicks: 61,
        createdAt: new Date("2026-06-02T09:00:00Z"),
        referrals: {
          create: [
            { orderId: "OAK-2590", orderValue: 342000, commission: 23940, status: "confirmed", date: new Date("2026-06-20T10:00:00Z") },
          ],
        },
      },
    });
    await prisma.partner.create({
      data: {
        code: "MEERA5", name: "Meera Nair", tier: "circle", rate: 5,
        email: "meera.n@gmail.com", phone: "+91 99300 00000", clicks: 18,
        createdAt: new Date("2026-06-18T09:00:00Z"),
      },
    });
    console.log("Seeded 3 partners.");
  } else {
    console.log(`Skipped partners — ${partnerCount} already in the database.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
