import { prisma } from "./prisma";
import type { Product } from "@/data/products";
import type { Prisma } from "@prisma/client";
import type { Order, Partner, Referral, StoredProduct, Enquiry, StoreImpl } from "./types";

/* ---------- status <-> Prisma enum mapping ---------- */
// the app uses hyphenated strings ("in-atelier", "swatch-kit") for readability;
// MySQL enum identifiers can't contain hyphens, so Prisma stores underscores.

const toDbOrderStatus = (s: Order["status"]) => s.replace("-", "_") as "reserved" | "in_atelier" | "delivered";
const fromDbOrderStatus = (s: string) => s.replace("_", "-") as Order["status"];
const toDbEnquiryKind = (k: Enquiry["kind"]) => k.replace("-", "_") as "consultation" | "swatch_kit";
const fromDbEnquiryKind = (k: string) => k.replace("_", "-") as Enquiry["kind"];

/* ---------- row -> app-shape mappers ---------- */

type OrderRow = Prisma.OrderGetPayload<{ include: { items: true } }>;

function mapOrder(row: OrderRow): Order {
  return {
    id: row.id,
    subtotal: row.subtotal,
    paymentMode: row.paymentMode,
    paidNow: row.paidNow,
    balanceDue: row.balanceDue,
    refCode: row.refCode ?? undefined,
    status: fromDbOrderStatus(row.status),
    paymentStatus: row.paymentStatus as Order["paymentStatus"],
    paymentId: row.paymentId ?? undefined,
    createdAt: row.createdAt.toISOString(),
    customer: { name: row.custName, phone: row.custPhone, email: row.custEmail, address: row.custAddress, pin: row.custPin },
    items: row.items.map((it) => ({
      slug: it.slug, name: it.name, line: it.line, qty: it.qty, price: it.price,
      fabric: it.fabric ?? undefined,
    })),
  };
}

type PartnerRow = Prisma.PartnerGetPayload<{ include: { referrals: true } }>;

function mapPartner(row: PartnerRow): Partner {
  return {
    code: row.code, name: row.name, firm: row.firm ?? undefined, tier: row.tier,
    rate: row.rate, email: row.email, phone: row.phone, clicks: row.clicks,
    createdAt: row.createdAt.toISOString(),
    referrals: row.referrals.map((r) => ({
      orderId: r.orderId, orderValue: r.orderValue, commission: r.commission,
      status: r.status, date: r.date.toISOString(),
    })),
  };
}

function mapProduct(row: Prisma.ProductGetPayload<object>): StoredProduct {
  return {
    slug: row.slug, name: row.name, line: row.line, category: row.category, type: row.type,
    style: row.style, silhouette: row.silhouette as StoredProduct["silhouette"], price: row.price,
    dims: row.dims, wood: row.wood, fabrics: row.fabrics as string[], leadDays: row.leadDays,
    story: row.story, plate: row.plate, signature: row.signature, active: row.active,
    image: row.image ?? null,
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
      data: { ...input, slug, plate, fabrics: input.fabrics, active: true },
    });
    return mapProduct(row);
  },

  async updateProduct(slug, patch) {
    try {
      const row = await prisma.product.update({
        where: { slug },
        data: { ...patch, fabrics: patch.fabrics as Prisma.InputJsonValue | undefined },
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
    const refCode = order.refCode?.toUpperCase();

    const row = await prisma.$transaction(async (tx) => {
      let id = randomOrderId();
      for (let attempt = 0; attempt < 5; attempt++) {
        if (!(await tx.order.findUnique({ where: { id } }))) break;
        id = randomOrderId();
      }
      const created = await tx.order.create({
        data: {
          id,
          subtotal: order.subtotal,
          paymentMode: order.paymentMode,
          paidNow: order.paidNow,
          balanceDue: order.balanceDue,
          custName: order.customer.name,
          custPhone: order.customer.phone,
          custEmail: order.customer.email,
          custAddress: order.customer.address,
          custPin: order.customer.pin,
          refCode,
          paymentStatus: order.paymentStatus ?? "unpaid",
          paymentId: order.paymentId,
          items: { create: order.items.map((it) => ({ ...it })) },
        },
        include: { items: true },
      });

      if (refCode) {
        const partner = await tx.partner.findUnique({ where: { code: refCode } });
        if (partner) {
          await tx.referral.create({
            data: {
              partnerCode: partner.code,
              orderId: id,
              orderValue: order.subtotal,
              commission: Math.round((order.subtotal * partner.rate) / 100),
              status: "pending",
            },
          });
        }
      }
      return created;
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

  async setOrderPayment(id, paymentStatus, paymentId) {
    try {
      const row = await prisma.order.update({
        where: { id },
        data: { paymentStatus, ...(paymentId ? { paymentId } : {}) },
        include: { items: true },
      });
      return mapOrder(row);
    } catch {
      return null;
    }
  },

  async setOrderStatus(id, status) {
    const dbStatus = toDbOrderStatus(status);
    try {
      const row = await prisma.$transaction(async (tx) => {
        const updated = await tx.order.update({ where: { id }, data: { status: dbStatus }, include: { items: true } });
        // a delivered piece confirms the partner's commission
        if (status === "delivered") {
          await tx.referral.updateMany({ where: { orderId: id, status: "pending" }, data: { status: "confirmed" } });
        }
        return updated;
      });
      return mapOrder(row);
    } catch {
      return null;
    }
  },

  async listPartners() {
    const rows = await prisma.partner.findMany({ include: { referrals: { orderBy: { date: "asc" } } } });
    return rows.map(mapPartner);
  },

  async getPartner(code) {
    const row = await prisma.partner.findUnique({
      where: { code: code.toUpperCase() },
      include: { referrals: { orderBy: { date: "asc" } } },
    });
    return row ? mapPartner(row) : null;
  },

  async trackClick(code) {
    try {
      await prisma.partner.update({ where: { code: code.toUpperCase() }, data: { clicks: { increment: 1 } } });
      return true;
    } catch {
      return false;
    }
  },

  async setReferralStatus(code, orderId, status): Promise<Referral | null> {
    const partner = await prisma.partner.findUnique({ where: { code: code.toUpperCase() } });
    if (!partner) return null;
    const ref = await prisma.referral.findFirst({ where: { partnerCode: partner.code, orderId } });
    if (!ref) return null;
    const updated = await prisma.referral.update({ where: { id: ref.id }, data: { status } });
    return { orderId: updated.orderId, orderValue: updated.orderValue, commission: updated.commission, status: updated.status, date: updated.date.toISOString() };
  },

  async createPartner(input) {
    const base = input.name.split(" ")[0].toUpperCase().replace(/[^A-Z]/g, "").slice(0, 8) || "OAKLEN";
    let code = base;
    let n = 1;
    while (await prisma.partner.findUnique({ where: { code } })) code = base + String(n++);

    const rate = input.tier === "trade" ? 10 : input.tier === "build" ? 7 : 5;
    const row = await prisma.partner.create({
      data: { code, name: input.name, firm: input.firm, tier: input.tier, rate, email: input.email, phone: input.phone },
      include: { referrals: true },
    });
    return mapPartner(row);
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
