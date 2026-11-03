import { prismaStore } from "./prismaStore";
import { memoryStore } from "./memoryStore";
import { databaseUrl } from "./dbUrl";
import { toMedia, type MediaKind } from "./media";
import { BUNDLED_SITE_PHOTOS, BUNDLED_PRODUCT_PHOTOS } from "@/data/bundledPhotos";
import type { StoreImpl, StoredProduct } from "./types";

import type { StoredProject } from "./types";

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
async function siteImagesRaw() {
  return { ...BUNDLED_SITE_PHOTOS, ...(await impl.getSiteImages()) };
}

// Same rule for products: a bundled photo fills in only where the product
// has none of its own, so an admin upload always wins.
function withBundledPhoto<T extends StoredProduct>(p: T): T {
  if (p.images?.length) return p;
  const bundled = BUNDLED_PRODUCT_PHOTOS[p.slug];
  return bundled ? { ...p, images: [bundled] } : p;
}

// Public reads swap stored data: URLs for /media links (see lib/media.ts).
function publicProduct<T extends StoredProduct>(p: T): T {
  const withPhoto = withBundledPhoto(p);
  return { ...withPhoto, images: (withPhoto.images ?? []).map((src, i) => toMedia("p", p.slug, i, src)) };
}

function publicProject<T extends StoredProject>(p: T): T {
  return {
    ...p,
    cover: p.cover ? toMedia("j", p.slug, "cover", p.cover) : p.cover,
    images: (p.images ?? []).map((src, i) => toMedia("j", p.slug, i, src)),
  };
}

export const getSiteImages: StoreImpl["getSiteImages"] = async () =>
  Object.fromEntries(Object.entries(await siteImagesRaw()).map(([k, src]) => [k, toMedia("s", k, 0, src)]));
export const setSiteImage = impl.setSiteImage;
export const clearSiteImage = impl.clearSiteImage;

export const listProducts: StoreImpl["listProducts"] = async (includeInactive) =>
  (await impl.listProducts(includeInactive)).map(publicProduct);

export const getStoredProduct: StoreImpl["getStoredProduct"] = async (slug) => {
  const p = await impl.getStoredProduct(slug);
  return p ? publicProduct(p) : null;
};
export const createProduct = impl.createProduct;
export const updateProduct = impl.updateProduct;
export const deleteProduct = impl.deleteProduct;
export const listProjects: StoreImpl["listProjects"] = async (includeInactive) =>
  (await impl.listProjects(includeInactive)).map(publicProject);
export const getStoredProject: StoreImpl["getStoredProject"] = async (slug) => {
  const p = await impl.getStoredProject(slug);
  return p ? publicProject(p) : null;
};

// The admin edits the stored originals, so it reads them unchanged.
export const adminListProducts = async (includeInactive?: boolean) =>
  (await impl.listProducts(includeInactive)).map(withBundledPhoto);
export const adminListProjects = impl.listProjects;
export const adminGetSiteImages = siteImagesRaw;

/** The stored photo behind a /media URL, or null. */
export async function getMediaSource(kind: MediaKind, id: string, index: string): Promise<string | null> {
  if (kind === "s") return (await impl.getSiteImages())[id] ?? null;
  if (kind === "p") return (await impl.getStoredProduct(id))?.images?.[Number(index)] ?? null;
  const project = await impl.getStoredProject(id);
  if (!project) return null;
  return index === "cover" ? project.cover || null : project.images?.[Number(index)] ?? null;
}
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
