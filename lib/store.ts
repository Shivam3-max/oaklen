import { promises as fs } from "fs";
import path from "path";
import { PRODUCTS as SEED_PRODUCTS, Product } from "@/data/products";

export interface OrderItem {
  slug: string;
  name: string;
  line: string;
  qty: number;
  price: number;
  fabric?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  paymentMode: "full" | "token";
  paidNow: number;
  balanceDue: number;
  customer: { name: string; phone: string; email: string; address: string; pin: string };
  refCode?: string;
  status: "reserved" | "in-atelier" | "delivered";
  createdAt: string;
}

export interface Referral {
  orderId: string;
  orderValue: number;
  commission: number;
  status: "pending" | "confirmed" | "paid";
  date: string;
}

export interface Partner {
  code: string;
  name: string;
  firm?: string;
  tier: "trade" | "build" | "circle";
  rate: number;
  email: string;
  phone: string;
  clicks: number;
  referrals: Referral[];
  createdAt: string;
}

export interface StoredProduct extends Product {
  active: boolean;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  kind: "consultation" | "swatch-kit";
  name: string;
  phone: string;
  note?: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
}

export interface Subscriber {
  email: string;
  createdAt: string;
}

interface DB {
  orders: Order[];
  partners: Partner[];
  products: StoredProduct[];
  enquiries: Enquiry[];
  subscribers: Subscriber[];
}

// Vercel's serverless functions run on a read-only filesystem — only /tmp is
// writable, and it resets between invocations, so data won't persist reliably
// in production. This keeps the demo from crashing; real persistence needs a
// hosted database (see lib/store.ts migration note before going live for real).
const DB_PATH = process.env.VERCEL
  ? path.join("/tmp", "oaklen-data", "store.json")
  : path.join(process.cwd(), ".data", "store.json");

function seedProducts(): StoredProduct[] {
  return SEED_PRODUCTS.map((p) => ({ ...p, active: true, createdAt: "2026-05-01T09:00:00Z" }));
}

const SEED: DB = {
  orders: [],
  products: seedProducts(),
  enquiries: [],
  subscribers: [],
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

async function load(): Promise<DB> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    const db = JSON.parse(raw) as DB;
    // migrate stores written before products/enquiries/subscribers existed
    let dirty = false;
    if (!db.products) { db.products = seedProducts(); dirty = true; }
    if (!db.enquiries) { db.enquiries = []; dirty = true; }
    if (!db.subscribers) { db.subscribers = []; dirty = true; }
    if (dirty) await save(db);
    return db;
  } catch {
    await save(SEED);
    return structuredClone(SEED);
  }
}

async function save(db: DB) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

/* ---------- products ---------- */

export async function listProducts(includeInactive = false) {
  const db = await load();
  return includeInactive ? db.products : db.products.filter((p) => p.active);
}

export async function getStoredProduct(slug: string) {
  const db = await load();
  return db.products.find((p) => p.slug === slug && p.active) ?? null;
}

function slugify(name: string, line: string) {
  return `${name} ${line}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

export async function createProduct(input: Omit<Product, "slug" | "plate">) {
  const db = await load();
  let slug = slugify(input.name, input.line);
  let n = 2;
  while (db.products.some((p) => p.slug === slug)) slug = `${slugify(input.name, input.line)}-${n++}`;
  const plate = Math.max(0, ...db.products.map((p) => p.plate)) + 1;
  const product: StoredProduct = { ...input, slug, plate, active: true, createdAt: new Date().toISOString() };
  db.products.push(product);
  await save(db);
  return product;
}

export async function updateProduct(slug: string, patch: Partial<Omit<StoredProduct, "slug" | "createdAt">>) {
  const db = await load();
  const p = db.products.find((x) => x.slug === slug);
  if (!p) return null;
  Object.assign(p, patch);
  await save(db);
  return p;
}

export async function deleteProduct(slug: string) {
  const db = await load();
  const before = db.products.length;
  db.products = db.products.filter((p) => p.slug !== slug);
  await save(db);
  return db.products.length < before;
}

/* ---------- orders ---------- */

export async function createOrder(order: Omit<Order, "id" | "createdAt" | "status">): Promise<Order> {
  const db = await load();
  const id = "OAK-" + String(2700 + db.orders.length + Math.floor(Math.random() * 40));
  const full: Order = { ...order, id, status: "reserved", createdAt: new Date().toISOString() };
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
  await save(db);
  return full;
}

export async function getOrder(id: string) {
  const db = await load();
  return db.orders.find((o) => o.id === id) ?? null;
}

export async function ordersByPhone(phone: string) {
  const db = await load();
  const digits = phone.replace(/\D/g, "").slice(-10);
  return db.orders.filter((o) => o.customer.phone.replace(/\D/g, "").endsWith(digits));
}

export async function listOrders() {
  const db = await load();
  return [...db.orders].reverse();
}

export async function setOrderStatus(id: string, status: Order["status"]) {
  const db = await load();
  const order = db.orders.find((o) => o.id === id);
  if (!order) return null;
  order.status = status;
  // a delivered piece confirms the partner's commission
  if (status === "delivered") {
    for (const p of db.partners) {
      const ref = p.referrals.find((r) => r.orderId === id && r.status === "pending");
      if (ref) ref.status = "confirmed";
    }
  }
  await save(db);
  return order;
}

/* ---------- partners ---------- */

export async function listPartners() {
  const db = await load();
  return db.partners;
}

export async function getPartner(code: string) {
  const db = await load();
  return db.partners.find((p) => p.code === code.toUpperCase()) ?? null;
}

export async function trackClick(code: string) {
  const db = await load();
  const p = db.partners.find((x) => x.code === code.toUpperCase());
  if (p) {
    p.clicks += 1;
    await save(db);
  }
  return !!p;
}

export async function setReferralStatus(code: string, orderId: string, status: Referral["status"]) {
  const db = await load();
  const partner = db.partners.find((p) => p.code === code.toUpperCase());
  const ref = partner?.referrals.find((r) => r.orderId === orderId);
  if (!partner || !ref) return null;
  ref.status = status;
  await save(db);
  return ref;
}

export async function createPartner(input: { name: string; firm?: string; tier: Partner["tier"]; email: string; phone: string }) {
  const db = await load();
  const base = input.name.split(" ")[0].toUpperCase().replace(/[^A-Z]/g, "").slice(0, 8) || "OAKLEN";
  let code = base;
  let n = 1;
  while (db.partners.some((p) => p.code === code)) {
    code = base + String(n++);
  }
  const rate = input.tier === "trade" ? 10 : input.tier === "build" ? 7 : 5;
  const partner: Partner = { ...input, code, rate, clicks: 0, referrals: [], createdAt: new Date().toISOString() };
  db.partners.push(partner);
  await save(db);
  return partner;
}

/* ---------- enquiries & subscribers ---------- */

export async function createEnquiry(input: { kind: Enquiry["kind"]; name: string; phone: string; note?: string }) {
  const db = await load();
  const enquiry: Enquiry = {
    ...input,
    id: "ENQ-" + String(100 + db.enquiries.length),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  db.enquiries.push(enquiry);
  await save(db);
  return enquiry;
}

export async function listEnquiries() {
  const db = await load();
  return [...db.enquiries].reverse();
}

export async function setEnquiryStatus(id: string, status: Enquiry["status"]) {
  const db = await load();
  const e = db.enquiries.find((x) => x.id === id);
  if (!e) return null;
  e.status = status;
  await save(db);
  return e;
}

export async function addSubscriber(email: string) {
  const db = await load();
  if (!db.subscribers.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
    db.subscribers.push({ email, createdAt: new Date().toISOString() });
    await save(db);
  }
  return true;
}

export async function listSubscribers() {
  const db = await load();
  return [...db.subscribers].reverse();
}
