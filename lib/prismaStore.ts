import { prisma } from "./prisma";
import type { Product } from "@/data/products";
import type { Prisma } from "@prisma/client";
import type { Order, StoredProduct, Enquiry, StoreImpl } from "./types";

// hyphenated app values <-> underscore MySQL enum identifiers
const toDbOrderStatus = (s: Order["status"]) => s.replace("-", "_") as "new" | "in_atelier" | "delivered";
const fromDbOrderStatus = (s: string) => s.replace("_", "-") as Order["status"];
const toDbEnquiryKind = (k: Enquiry["kind"]) => k.replace("-", "_") as "consultation" | "swatch_kit" | "reward";
const fromDbEnquiryKind = (k: string) => k.replace("_", "-") as Enquiry["kind"];

type OrderRow = Prisma.OrderGetPayload<{ include: { items: true } }>;

function mapOrder(row: OrderRow): Order {
  return {
    id: row.id,
    subtotal: row.subtotal,
    status: fromDbOrderStatus(row.status),
    note: row.note ?? undefined,
    createdAt: row.createdAt.toISOString(),
    customer: { name: row.custName, phone: row.custPhone, email: row.custEmail, address: row.custAddress, pin: row.custPin },
    items: row.items.map((it) => ({
      slug: it.slug, name: it.name, line: it.line, qty: it.qty, price: it.price, fabric: it.fabric ?? undefined,
    })),
  };
}

function mapProduct(row: Prisma.ProductGetPayload<object>): StoredProduct {
  return {
    slug: row.slug, name: row.name, line: row.line, category: row.category, type: row.type,
    style: row.style, silhouette: row.silhouette as StoredProduct["silhouette"], price: row.price,
    dims: row.dims, wood: row.wood, fabrics: row.fabrics as string[], leadDays: row.leadDays,
    story: row.story, plate: row.plate, signature: row.signature,
    images: (row.images as string[] | null) ?? [],
    active: row.active,
    createdAt: row.createdAt.toISOString(),
  };
}

function mapEnquiry(row: Prisma.EnquiryGetPayload<object>): Enquiry {
  return {
    id: row.id, kind: fromDbEnquiryKind(row.kind), name: row.name, phone: row.phone,
    note: row.note ?? undefined, status: row.status, createdAt: row.createdAt.toISOString(),
  };
}

function slugify(name: string, line: string) {
  return `${name} ${line}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

function randomOrderId() {
  return "OAK-" + String(2700 + Math.floor(Math.random() * 90000));
}

export const prismaStore: StoreImpl = {
  async getSiteImages() {
    const rows = await prisma.siteImage.findMany();
    const map: Record<string, string> = {};
    for (const r of rows) map[r.key] = r.url;
    return map;
  },
  async setSiteImage(key, url) {
    await prisma.siteImage.upsert({ where: { key }, create: { key, url }, update: { url } });
    return true;
  },
  async clearSiteImage(key) {
    try {
      await prisma.siteImage.delete({ where: { key } });
    } catch {
      /* already absent */
    }
    return true;
  },

  async listProducts(includeInactive = false) {
    const rows = await prisma.product.findMany({
      where: includeInactive ? undefined : { active: true },
      orderBy: { plate: "asc" },
    });
    return rows.map(mapProduct);
  },
  async getStoredProduct(slug) {
    const row = await prisma.product.findFirst({ where: { slug, active: true } });
    return row ? mapProduct(row) : null;
  },
  async createProduct(input: Omit<Product, "slug" | "plate">) {
    const base = slugify(input.name, input.line);
    let slug = base;
    let n = 2;
    while (await prisma.product.findUnique({ where: { slug } })) slug = `${base}-${n++}`;
    const maxPlate = await prisma.product.aggregate({ _max: { plate: true } });
    const plate = (maxPlate._max.plate ?? 0) + 1;
    const row = await prisma.product.create({
      data: { ...input, slug, plate, fabrics: input.fabrics, images: input.images ?? [], active: true },
    });
    return mapProduct(row);
  },
  async updateProduct(slug, patch) {
    try {
      const row = await prisma.product.update({
        where: { slug },
        data: {
          ...patch,
          fabrics: patch.fabrics as Prisma.InputJsonValue | undefined,
          images: patch.images as Prisma.InputJsonValue | undefined,
        },
      });
      return mapProduct(row);
    } catch {
      return null;
    }
  },
  async deleteProduct(slug) {
    try {
      await prisma.product.delete({ where: { slug } });
      return true;
    } catch {
      return false;
    }
  },

  async createOrder(order) {
    const id = await (async () => {
      let candidate = randomOrderId();
      for (let i = 0; i < 5; i++) {
        if (!(await prisma.order.findUnique({ where: { id: candidate } }))) return candidate;
        candidate = randomOrderId();
      }
      return candidate;
    })();
    const row = await prisma.order.create({
      data: {
        id,
        subtotal: order.subtotal,
        note: order.note,
        custName: order.customer.name,
        custPhone: order.customer.phone,
        custEmail: order.customer.email,
        custAddress: order.customer.address,
        custPin: order.customer.pin,
        items: { create: order.items.map((it) => ({ ...it })) },
      },
      include: { items: true },
    });
    return mapOrder(row);
  },
  async getOrder(id) {
    const row = await prisma.order.findUnique({ where: { id }, include: { items: true } });
    return row ? mapOrder(row) : null;
  },
  async ordersByPhone(phone) {
    const digits = phone.replace(/\D/g, "").slice(-10);
    const rows = await prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" } });
    return rows.filter((o) => o.custPhone.replace(/\D/g, "").endsWith(digits)).map(mapOrder);
  },
  async listOrders() {
    const rows = await prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" } });
    return rows.map(mapOrder);
  },
  async setOrderStatus(id, status) {
    try {
      const row = await prisma.order.update({ where: { id }, data: { status: toDbOrderStatus(status) }, include: { items: true } });
      return mapOrder(row);
    } catch {
      return null;
    }
  },

  async createEnquiry(input) {
    const count = await prisma.enquiry.count();
    const row = await prisma.enquiry.create({
      data: { id: "ENQ-" + String(100 + count), kind: toDbEnquiryKind(input.kind), name: input.name, phone: input.phone, note: input.note },
    });
    return mapEnquiry(row);
  },
  async listEnquiries() {
    const rows = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map(mapEnquiry);
  },
  async setEnquiryStatus(id, status) {
    try {
      const row = await prisma.enquiry.update({ where: { id }, data: { status } });
      return mapEnquiry(row);
    } catch {
      return null;
    }
  },

  async addSubscriber(email) {
    await prisma.subscriber.upsert({ where: { email }, create: { email }, update: {} });
    return true;
  },
  async listSubscribers() {
    const rows = await prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map((r) => ({ email: r.email, createdAt: r.createdAt.toISOString() }));
  },
};
