import { prismaStore } from "./prismaStore";
import { memoryStore } from "./memoryStore";
import { BUNDLED_SITE_PHOTOS, BUNDLED_PRODUCT_PHOTOS } from "@/data/bundledPhotos";
import type { StoreImpl, StoredProduct } from "./types";

export type { Order, OrderItem, StoredProduct, Enquiry, Subscriber } from "./types";

// With DATABASE_URL set, everything reads and writes the real MySQL database.
// Without it, an in-memory fallback keeps the site running (data not saved).
const impl: StoreImpl = process.env.DATABASE_URL ? prismaStore : memoryStore;

export const databaseConnected = !!process.env.DATABASE_URL;

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
