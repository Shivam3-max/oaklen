import type { Product } from "@/data/products";

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

export interface StoreImpl {
  listProducts(includeInactive?: boolean): Promise<StoredProduct[]>;
  getStoredProduct(slug: string): Promise<StoredProduct | null>;
  createProduct(input: Omit<Product, "slug" | "plate">): Promise<StoredProduct>;
  updateProduct(slug: string, patch: Partial<Omit<StoredProduct, "slug" | "createdAt">>): Promise<StoredProduct | null>;
  deleteProduct(slug: string): Promise<boolean>;
  createOrder(order: Omit<Order, "id" | "createdAt" | "status">): Promise<Order>;
  getOrder(id: string): Promise<Order | null>;
  ordersByPhone(phone: string): Promise<Order[]>;
  listOrders(): Promise<Order[]>;
  setOrderStatus(id: string, status: Order["status"]): Promise<Order | null>;
  listPartners(): Promise<Partner[]>;
  getPartner(code: string): Promise<Partner | null>;
  trackClick(code: string): Promise<boolean>;
  setReferralStatus(code: string, orderId: string, status: Referral["status"]): Promise<Referral | null>;
  createPartner(input: { name: string; firm?: string; tier: Partner["tier"]; email: string; phone: string }): Promise<Partner>;
  createEnquiry(input: { kind: Enquiry["kind"]; name: string; phone: string; note?: string }): Promise<Enquiry>;
  listEnquiries(): Promise<Enquiry[]>;
  setEnquiryStatus(id: string, status: Enquiry["status"]): Promise<Enquiry | null>;
  addSubscriber(email: string): Promise<boolean>;
  listSubscribers(): Promise<Subscriber[]>;
}
