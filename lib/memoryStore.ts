import { PRODUCTS as SEED_PRODUCTS, Product } from "@/data/products";
import { PROJECTS as SEED_PROJECTS, Project } from "@/data/projects";
import type { Order, StoredProduct, StoredProject, Enquiry, StoreImpl } from "./types";

// In-memory fallback used only when no database is configured (e.g. local runs
// before the database is wired). Data lives in process memory and does not
// persist — set the DB_* variables for the real, saved store.

interface MemDB {
  orders: Order[];
  products: StoredProduct[];
  projects: StoredProject[];
  enquiries: Enquiry[];
  subscribers: { email: string; createdAt: string }[];
  siteImages: Record<string, string>;
}

function seedProducts(): StoredProduct[] {
  return SEED_PRODUCTS.map((p) => ({ ...p, active: true, createdAt: "2026-05-01T09:00:00Z" }));
}

function seedProjects(): StoredProject[] {
  return SEED_PROJECTS.map((p) => ({ ...p, active: true, createdAt: "2026-06-01T09:00:00Z" }));
}

function freshDB(): MemDB {
  return { orders: [], products: seedProducts(), projects: seedProjects(), enquiries: [], subscribers: [], siteImages: {} };
}

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

  async listProjects(includeInactive = false) {
    return includeInactive ? db.projects : db.projects.filter((p) => p.active);
  },
  async getStoredProject(slug) {
    return db.projects.find((p) => p.slug === slug && p.active) ?? null;
  },
  async createProject(input: Omit<Project, "slug">) {
    const base = input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "project";
    let slug = base;
    let n = 2;
    while (db.projects.some((p) => p.slug === slug)) slug = `${base}-${n++}`;
    const project: StoredProject = { ...input, slug, active: true, createdAt: new Date().toISOString() };
    db.projects.unshift(project);
    return project;
  },
  async updateProject(slug, patch) {
    const p = db.projects.find((x) => x.slug === slug);
    if (!p) return null;
    Object.assign(p, patch);
    return p;
  },
  async deleteProject(slug) {
    const before = db.projects.length;
    db.projects = db.projects.filter((p) => p.slug !== slug);
    return db.projects.length < before;
  },

  async createOrder(order) {
    let id = randomOrderId();
    while (db.orders.some((o) => o.id === id)) id = randomOrderId();
    const full: Order = { ...order, id, status: "new", createdAt: new Date().toISOString() };
    db.orders.push(full);
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
  async setOrderStatus(id, status) {
    const order = db.orders.find((o) => o.id === id);
    if (!order) return null;
    order.status = status;
    return order;
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
