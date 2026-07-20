import { prismaStore } from "./prismaStore";
import { memoryStore } from "./memoryStore";
import type { StoreImpl } from "./types";

export type { Order, OrderItem, StoredProduct, Enquiry, Subscriber } from "./types";

// With DATABASE_URL set, everything reads and writes the real MySQL database.
// Without it, an in-memory fallback keeps the site running (data not saved).
const impl: StoreImpl = process.env.DATABASE_URL ? prismaStore : memoryStore;

export const databaseConnected = !!process.env.DATABASE_URL;

export const getSiteImages = impl.getSiteImages;
export const setSiteImage = impl.setSiteImage;
export const clearSiteImage = impl.clearSiteImage;
export const listProducts = impl.listProducts;
export const getStoredProduct = impl.getStoredProduct;
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
