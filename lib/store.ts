import { prismaStore } from "./prismaStore";
import { memoryStore } from "./memoryStore";
import { databaseUrl } from "./dbUrl";
import { BUNDLED_SITE_PHOTOS, BUNDLED_PRODUCT_PHOTOS } from "@/data/bundledPhotos";
import type { StoreImpl, StoredProduct } from "./types";

export type { Order, OrderItem, StoredProduct, StoredProject, Enquiry, Subscriber } from "./types";

// With the DB_* variables set, everything reads and writes the real MySQL database.
// Without it, an in-memory fallback keeps the site running (data not saved).
export const databaseConfigured = !!databaseUrl();

// If the database is configured but unreachable (wrong password, tables not
// created yet, server down), reads fall back to the in-memory catalogue so the
// site keeps rendering instead of throwing a server error. Writes still fail,
// so nobody is told a booking was saved when it wasn't.
const READS = new Set<keyof StoreImpl>([
  "getSiteImages", "listProducts", "getStoredProduct", "listProjects", "getStoredProject",
  "getOrder", "ordersByPhone", "listOrders", "listEnquiries", "listSubscribers",
]);

let lastDbError: string | null = null;

/** Short reason the database last failed, or null if it's working. */
export const databaseError = () => lastDbError;

function resilient(primary: StoreImpl, fallback: StoreImpl): StoreImpl {
  const wrapped = {} as Record<string, unknown>;
  for (const key of Object.keys(primary) as (keyof StoreImpl)[]) {
    const run = primary[key] as (...a: unknown[]) => Promise<unknown>;
    const backup = fallback[key] as (...a: unknown[]) => Promise<unknown>;
    wrapped[key] = async (...args: unknown[]) => {
      try {
        const result = await run(...args);
        lastDbError = null;
        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message.trim().split("\n").pop()! : String(err);
        if (msg !== lastDbError) console.error(`[store] database error in ${key}: ${msg}`);
        lastDbError = msg;
        if (READS.has(key)) return backup(...args);
        throw err;
      }
    };
  }
  return wrapped as unknown as StoreImpl;
}

const impl: StoreImpl = databaseConfigured ? resilient(prismaStore, memoryStore) : memoryStore;

// Photography bundled in public/photos is the baseline; anything uploaded
// through the admin overrides the bundled file of the same key.
export const getSiteImages: StoreImpl["getSiteImages"] = async () => ({
  ...BUNDLED_SITE_PHOTOS,
  ...(await impl.getSiteImages()),
});
export const setSiteImage = impl.setSiteImage;
export const clearSiteImage = impl.clearSiteImage;
// Same rule for products: a bundled photo fills in only where the product
// has none of its own, so an admin upload always wins.
function withBundledPhoto<T extends StoredProduct>(p: T): T {
  if (p.images?.length) return p;
  const bundled = BUNDLED_PRODUCT_PHOTOS[p.slug];
  return bundled ? { ...p, images: [bundled] } : p;
}

export const listProducts: StoreImpl["listProducts"] = async (includeInactive) =>
  (await impl.listProducts(includeInactive)).map(withBundledPhoto);

export const getStoredProduct: StoreImpl["getStoredProduct"] = async (slug) => {
  const p = await impl.getStoredProduct(slug);
  return p ? withBundledPhoto(p) : null;
};
export const createProduct = impl.createProduct;
export const updateProduct = impl.updateProduct;
export const deleteProduct = impl.deleteProduct;
export const listProjects = impl.listProjects;
export const getStoredProject = impl.getStoredProject;
export const createProject = impl.createProject;
export const updateProject = impl.updateProject;
export const deleteProject = impl.deleteProject;
export const createOrder = impl.createOrder;
export const getOrder = impl.getOrder;
export const ordersByPhone = impl.ordersByPhone;
export const listOrders = impl.listOrders;
export const setOrderStatus = impl.setOrderStatus;
export const createEnquiry = impl.createEnquiry;
export const listEnquiries = impl.listEnquiries;
export const setEnquiryStatus = impl.setEnquiryStatus;
export const addSubscriber = impl.addSubscriber;
export const listSubscribers = impl.listSubscribers;
