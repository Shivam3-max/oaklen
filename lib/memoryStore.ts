import { PRODUCTS as SEED_PRODUCTS, Product } from "@/data/products";
import type { Order, Partner, Referral, StoredProduct, Enquiry, StoreImpl } from "./types";

// No DATABASE_URL is set, so the site runs on this in-memory demo store instead
// of Prisma/MySQL — good for showing the design and flows to a client with zero
// setup, but data lives only in process memory: it resets on server restarts and
// isn't shared across serverless instances. Add DATABASE_URL to switch to the
// real, persistent backend (see lib/store.ts) with no other code changes needed.

interface MemDB {
  orders: Order[];
  partners: Partner[];
  products: StoredProduct[];
  enquiries: Enquiry[];
  subscribers: { email: string; createdAt: string }[];
  siteImages: Record<string, string>;
}

function seedProducts(): StoredProduct[] {
  return SEED_PRODUCTS.map((p) => ({ ...p, active: true, createdAt: "2026-05-01T09:00:00Z" }));
}

function freshDB(): MemDB {
  return {
    orders: [],
    products: seedProducts(),
    enquiries: [],
    subscribers: [],
    siteImages: {},
    partners: [
      {
        code: "ARJUN10", name: "Arjun Mehta", firm: "Studio Mehta Architects", tier: "trade", rate: 10,
        email: "arjun@studiomehta.in", phone: "+91 98100 00000", clicks: 142, createdAt: "2026-05-12T09:00:00Z",
        referrals: [
          { orderId: "OAK-2417", orderValue: 296000, commission: 29600, status: "paid", date: "2026-05-28T10:00:00Z" },
          { orderId: "OAK-2561", orderValue: 168000, commission: 16800, status: "confirmed", date: "2026-06-14T10:00:00Z" },
          { orderId: "OAK-2688", orderValue: 424000, commission: 42400, status: "pending", date: "2026-07-01T10:00:00Z" },
        ],
      },
      {
        code: "RAVIBUILD", name: "Ravi Khanna", firm: "Khanna Constructions", tier: "build", rate: 7,
        email: "ravi@khannabuild.in", phone: "+91 98200 00000", clicks: 61, createdAt: "2026-06-02T09:00:00Z",
        referrals: [
          { orderId: "OAK-2590", orderValue: 342000, commission: 23940, status: "confirmed", date: "2026-06-20T10:00:00Z" },
        ],
      },
      {
        code: "MEERA5", name: "Meera Nair", tier: "circle", rate: 5,
        email: "meera.n@gmail.com", phone: "+91 99300 00000", clicks: 18, createdAt: "2026-06-18T09:00:00Z",
        referrals: [],
      },
    ],
  };
}

// module-scope + globalThis: survives hot reloads in dev and reuse within a
// single warm serverless instance, though not across cold starts/instances.
const g = globalThis as unknown as { __oaklenMemDB?: MemDB };
const db: MemDB = g.__oaklenMemDB ?? (g.__oaklenMemDB = freshDB());

function slugify(name: string, line: string) {
  return `${name} ${line}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

function randomOrderId() {
  return "OAK-" + String(2700 + Math.floor(Math.random() * 90000));
}

export const memoryStore: StoreImpl = {
  async getSiteImages() {
    return { ...db.siteImages };
  },

  async setSiteImage(key, url) {
    db.siteImages[key] = url;
    return true;
  },

  async clearSiteImage(key) {
    delete db.siteImages[key];
    return true;
  },

  async listProducts(includeInactive = false) {
    return includeInactive ? db.products : db.products.filter((p) => p.active);
  },

  async getStoredProduct(slug) {
    return db.products.find((p) => p.slug === slug && p.active) ?? null;
  },

  async createProduct(input: Omit<Product, "slug" | "plate">) {
    let slug = slugify(input.name, input.line);
    let n = 2;
    while (db.products.some((p) => p.slug === slug)) slug = `${slugify(input.name, input.line)}-${n++}`;
    const plate = Math.max(0, ...db.products.map((p) => p.plate)) + 1;
    const product: StoredProduct = { ...input, slug, plate, active: true, createdAt: new Date().toISOString() };
    db.products.push(product);
    return product;
  },

  async updateProduct(slug, patch) {
    const p = db.products.find((x) => x.slug === slug);
    if (!p) return null;
    Object.assign(p, patch);
    return p;
  },

  async deleteProduct(slug) {
    const before = db.products.length;
    db.products = db.products.filter((p) => p.slug !== slug);
    return db.products.length < before;
  },

  async createOrder(order) {
    let id = randomOrderId();
    while (db.orders.some((o) => o.id === id)) id = randomOrderId();
    const full: Order = {
      ...order,
      id,
      status: "reserved",
      paymentStatus: order.paymentStatus ?? "unpaid",
      createdAt: new Date().toISOString(),
    };
    db.orders.push(full);
    if (order.refCode) {
      const partner = db.partners.find((p) => p.code === order.refCode!.toUpperCase());
      if (partner) {
        partner.referrals.push({
          orderId: id,
          orderValue: order.subtotal,
          commission: Math.round((order.subtotal * partner.rate) / 100),
          status: "pending",
          date: full.createdAt,
        });
      }
    }
    return full;
  },

  async getOrder(id) {
    return db.orders.find((o) => o.id === id) ?? null;
  },

  async ordersByPhone(phone) {
    const digits = phone.replace(/\D/g, "").slice(-10);
    return db.orders.filter((o) => o.customer.phone.replace(/\D/g, "").endsWith(digits));
  },

  async listOrders() {
    return [...db.orders].reverse();
  },

  async setOrderPayment(id, paymentStatus, paymentId) {
    const order = db.orders.find((o) => o.id === id);
    if (!order) return null;
    order.paymentStatus = paymentStatus;
    if (paymentId) order.paymentId = paymentId;
    return order;
  },

  async setOrderStatus(id, status) {
    const order = db.orders.find((o) => o.id === id);
    if (!order) return null;
    order.status = status;
    if (status === "delivered") {
      for (const p of db.partners) {
        const ref = p.referrals.find((r) => r.orderId === id && r.status === "pending");
        if (ref) ref.status = "confirmed";
      }
    }
    return order;
  },

  async listPartners() {
    return db.partners;
  },

  async getPartner(code) {
    return db.partners.find((p) => p.code === code.toUpperCase()) ?? null;
  },

  async trackClick(code) {
    const p = db.partners.find((x) => x.code === code.toUpperCase());
    if (p) p.clicks += 1;
    return !!p;
  },

  async setReferralStatus(code, orderId, status): Promise<Referral | null> {
    const partner = db.partners.find((p) => p.code === code.toUpperCase());
    const ref = partner?.referrals.find((r) => r.orderId === orderId);
    if (!partner || !ref) return null;
    ref.status = status;
    return ref;
  },

  async createPartner(input) {
    const base = input.name.split(" ")[0].toUpperCase().replace(/[^A-Z]/g, "").slice(0, 8) || "OAKLEN";
    let code = base;
    let n = 1;
    while (db.partners.some((p) => p.code === code)) code = base + String(n++);
    const rate = input.tier === "trade" ? 10 : input.tier === "build" ? 7 : 5;
    const partner: Partner = { ...input, code, rate, clicks: 0, referrals: [], createdAt: new Date().toISOString() };
    db.partners.push(partner);
    return partner;
  },

  async createEnquiry(input) {
    const enquiry: Enquiry = { ...input, id: "ENQ-" + String(100 + db.enquiries.length), status: "new", createdAt: new Date().toISOString() };
    db.enquiries.push(enquiry);
    return enquiry;
  },

  async listEnquiries() {
    return [...db.enquiries].reverse();
  },

  async setEnquiryStatus(id, status) {
    const e = db.enquiries.find((x) => x.id === id);
    if (!e) return null;
    e.status = status;
    return e;
  },

  async addSubscriber(email) {
    if (!db.subscribers.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
      db.subscribers.push({ email, createdAt: new Date().toISOString() });
    }
    return true;
  },

  async listSubscribers() {
    return [...db.subscribers].reverse();
  },
};
