import { prismaStore } from "./prismaStore";
import { memoryStore } from "./memoryStore";
import type { StoreImpl } from "./types";

export type { Order, OrderItem, Partner, Referral, StoredProduct, Enquiry, Subscriber } from "./types";

// No DATABASE_URL -> run on the in-memory demo store (zero setup, good for
// showing the design to a client). Once DATABASE_URL is set, everything reads
// and writes through the real MySQL database instead, with no code changes.
const impl: StoreImpl = process.env.DATABASE_URL ? prismaStore : memoryStore;

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
export const listPartners = impl.listPartners;
export const getPartner = impl.getPartner;
export const trackClick = impl.trackClick;
export const setReferralStatus = impl.setReferralStatus;
export const createPartner = impl.createPartner;
export const createEnquiry = impl.createEnquiry;
export const listEnquiries = impl.listEnquiries;
export const setEnquiryStatus = impl.setEnquiryStatus;
export const addSubscriber = impl.addSubscriber;
export const listSubscribers = impl.listSubscribers;
